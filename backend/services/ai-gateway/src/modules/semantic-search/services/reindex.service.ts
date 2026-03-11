/**
 * Reindex Service
 * Handles bulk reindexing of clinical documents
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { EmbeddingSyncService } from './embedding-sync.service';
import { DocumentType } from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

export type ReindexMode = 'full' | 'new_only' | 'metadata_only';

export interface ReindexProgress {
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  startedAt: Date;
  estimatedCompletionAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
}

@Injectable()
export class ReindexService {
  private currentJob: {
    tenantId: string;
    progress: ReindexProgress;
    cancel: boolean;
  } | null = null;

  constructor(
    private clinicalPrisma: ClinicalPrismaService,
    private embeddingSyncService: EmbeddingSyncService,
  ) {}

  /**
   * Start a reindex job for a tenant
   * @param mode - 'full' = re-index all documents, 'new_only' = only documents without embeddings, 'metadata_only' = update metadata for existing embeddings
   */
  async startReindex(
    tenantId: string,
    documentTypes?: DocumentType[],
    fromDate?: Date,
    mode: ReindexMode = 'full',
  ): Promise<{ jobId: string; message: string }> {
    if (this.currentJob && this.currentJob.progress.status === 'running') {
      return {
        jobId: 'existing',
        message: 'A reindex job is already running. Please wait for it to complete.',
      };
    }

    const jobId = `reindex-${Date.now()}`;

    // Initialize progress
    this.currentJob = {
      tenantId,
      progress: {
        totalDocuments: 0,
        processedDocuments: 0,
        failedDocuments: 0,
        startedAt: new Date(),
        status: 'pending',
      },
      cancel: false,
    };

    const modeDescriptions: Record<ReindexMode, string> = {
      full: 'Re-indexing all documents (full rebuild)',
      new_only: 'Indexing new documents only (no embeddings yet)',
      metadata_only: 'Updating metadata for existing embeddings',
    };

    // Start reindex in background
    this.runReindex(tenantId, documentTypes, fromDate, mode).catch((error) => {
      logger.error({ error, tenantId, mode }, 'Reindex job failed');
      if (this.currentJob) {
        this.currentJob.progress.status = 'failed';
      }
    });

    return {
      jobId,
      message: `${modeDescriptions[mode]}. Use GET /search/reindex/status to check progress.`,
    };
  }

  /**
   * Get current reindex progress
   */
  getProgress(tenantId: string): ReindexProgress | null {
    if (!this.currentJob || this.currentJob.tenantId !== tenantId) {
      return null;
    }
    return this.currentJob.progress;
  }

  /**
   * Cancel current reindex job
   */
  cancelReindex(tenantId: string): boolean {
    if (!this.currentJob || this.currentJob.tenantId !== tenantId) {
      return false;
    }

    this.currentJob.cancel = true;
    this.currentJob.progress.status = 'cancelled';
    return true;
  }

  /**
   * Run the reindex process
   */
  private async runReindex(
    tenantId: string,
    documentTypes?: DocumentType[],
    fromDate?: Date,
    mode: ReindexMode = 'full',
  ): Promise<void> {
    if (!this.currentJob) return;

    this.currentJob.progress.status = 'running';

    const types = documentTypes || [
      'encounter_note',
      'discharge_summary',
      'clinical_note',
      'progress_note',
    ];

    logger.info(
      { tenantId, documentTypes: types, fromDate, mode },
      'Starting reindex job',
    );

    try {
      // Handle metadata_only mode separately
      if (mode === 'metadata_only') {
        await this.runMetadataUpdate(tenantId, types as DocumentType[]);
        return;
      }

      // Count total documents based on mode
      let totalCount = 0;
      for (const docType of types) {
        const count = await this.countDocuments(tenantId, docType, fromDate, mode);
        totalCount += count;
      }

      this.currentJob.progress.totalDocuments = totalCount;

      if (totalCount === 0) {
        this.currentJob.progress.status = 'completed';
        logger.info({ tenantId, mode }, 'No documents to reindex');
        return;
      }

      // Process each document type
      for (const docType of types) {
        if (this.currentJob.cancel) break;

        await this.reindexDocumentType(
          tenantId,
          docType as DocumentType,
          fromDate,
          mode,
        );
      }

      this.currentJob.progress.status = this.currentJob.cancel
        ? 'cancelled'
        : 'completed';

      logger.info(
        {
          tenantId,
          mode,
          totalDocuments: this.currentJob.progress.totalDocuments,
          processedDocuments: this.currentJob.progress.processedDocuments,
          failedDocuments: this.currentJob.progress.failedDocuments,
        },
        'Reindex job completed',
      );
    } catch (error) {
      logger.error({ error, tenantId, mode }, 'Reindex job failed');
      if (this.currentJob) {
        this.currentJob.progress.status = 'failed';
      }
    }
  }

  /**
   * Update metadata for existing embeddings without regenerating vectors
   */
  private async runMetadataUpdate(
    tenantId: string,
    documentTypes: DocumentType[],
  ): Promise<void> {
    if (!this.currentJob) return;

    logger.info({ tenantId, documentTypes }, 'Starting metadata update');

    try {
      // Count embeddings that need metadata update (where patient_name is null)
      const countResult = await this.clinicalPrisma.$queryRaw<any[]>`
        SELECT COUNT(DISTINCT document_id) as count
        FROM clinical_document_embeddings
        WHERE tenant_id = ${tenantId}::uuid
          AND document_type = ANY(${documentTypes})
          AND is_active = true
          AND patient_name IS NULL
      `;

      const totalCount = parseInt(countResult[0]?.count || '0');
      this.currentJob.progress.totalDocuments = totalCount;

      if (totalCount === 0) {
        this.currentJob.progress.status = 'completed';
        logger.info({ tenantId }, 'No embeddings need metadata update');
        return;
      }

      // Fetch document IDs that need metadata update
      const batchSize = 100;
      let offset = 0;
      let hasMore = true;

      while (hasMore && !this.currentJob.cancel) {
        const docs = await this.clinicalPrisma.$queryRaw<any[]>`
          SELECT DISTINCT document_id, document_type
          FROM clinical_document_embeddings
          WHERE tenant_id = ${tenantId}::uuid
            AND document_type = ANY(${documentTypes})
            AND is_active = true
            AND patient_name IS NULL
          LIMIT ${batchSize} OFFSET ${offset}
        `;

        if (docs.length === 0) {
          hasMore = false;
          continue;
        }

        for (const doc of docs) {
          if (this.currentJob.cancel) break;

          try {
            // Queue for re-embedding (which will fetch fresh metadata)
            await this.embeddingSyncService.queueForEmbedding(
              tenantId,
              doc.document_type as DocumentType,
              doc.document_id,
            );
            this.currentJob.progress.processedDocuments++;
          } catch (error) {
            logger.error({ error, documentId: doc.document_id }, 'Failed to queue for metadata update');
            this.currentJob.progress.failedDocuments++;
          }
        }

        offset += batchSize;
        hasMore = docs.length === batchSize;
      }

      this.currentJob.progress.status = this.currentJob.cancel ? 'cancelled' : 'completed';
    } catch (error) {
      logger.error({ error, tenantId }, 'Metadata update failed');
      this.currentJob.progress.status = 'failed';
    }
  }

  /**
   * Count documents of a specific type
   * @param mode - 'full' counts all, 'new_only' counts only documents without embeddings
   */
  private async countDocuments(
    tenantId: string,
    documentType: DocumentType,
    fromDate?: Date,
    mode: ReindexMode = 'full',
  ): Promise<number> {
    try {
      let result: any[];

      // For new_only mode, count documents that don't have embeddings
      if (mode === 'new_only') {
        switch (documentType) {
          case 'encounter_note':
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT COUNT(*) as count
              FROM encounter_notes en
              WHERE en.tenant_id = ${tenantId}::uuid
                ${fromDate ? this.clinicalPrisma.$queryRaw`AND en.created_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
                AND NOT EXISTS (
                  SELECT 1 FROM clinical_document_embeddings cde
                  WHERE cde.document_id = en.id
                    AND cde.tenant_id = en.tenant_id
                    AND cde.document_type = 'encounter_note'
                    AND cde.is_active = true
                )
            `;
            break;

          case 'discharge_summary':
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT COUNT(*) as count
              FROM discharge_summaries ds
              WHERE ds.tenant_id = ${tenantId}::uuid
                ${fromDate ? this.clinicalPrisma.$queryRaw`AND ds.finalized_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
                AND NOT EXISTS (
                  SELECT 1 FROM clinical_document_embeddings cde
                  WHERE cde.document_id = ds.id
                    AND cde.tenant_id = ds.tenant_id
                    AND cde.document_type = 'discharge_summary'
                    AND cde.is_active = true
                )
            `;
            break;

          default:
            return 0;
        }
      } else {
        // Full mode - count all documents
        switch (documentType) {
          case 'encounter_note':
            if (fromDate) {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT COUNT(*) as count
                FROM encounter_notes
                WHERE tenant_id = ${tenantId}::uuid
                  AND created_at >= ${fromDate}
              `;
            } else {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT COUNT(*) as count
                FROM encounter_notes
                WHERE tenant_id = ${tenantId}::uuid
              `;
            }
            break;

          case 'discharge_summary':
            if (fromDate) {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT COUNT(*) as count
                FROM discharge_summaries
                WHERE tenant_id = ${tenantId}::uuid
                  AND finalized_at >= ${fromDate}
              `;
            } else {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT COUNT(*) as count
                FROM discharge_summaries
                WHERE tenant_id = ${tenantId}::uuid
              `;
            }
            break;

          default:
            return 0;
        }
      }

      const count = parseInt(result[0]?.count || '0');
      logger.debug({ tenantId, documentType, count, mode }, 'Document count');
      return count;
    } catch (error) {
      logger.error({ error, tenantId, documentType, mode }, 'Failed to count documents');
      return 0;
    }
  }

  /**
   * Reindex all documents of a specific type
   */
  private async reindexDocumentType(
    tenantId: string,
    documentType: DocumentType,
    fromDate?: Date,
    mode: ReindexMode = 'full',
  ): Promise<void> {
    const batchSize = 100;
    let offset = 0;
    let hasMore = true;

    while (hasMore && !this.currentJob?.cancel) {
      const documentIds = await this.fetchDocumentIds(
        tenantId,
        documentType,
        fromDate,
        batchSize,
        offset,
        mode,
      );

      if (documentIds.length === 0) {
        hasMore = false;
        continue;
      }

      // Queue documents for embedding
      for (const documentId of documentIds) {
        if (this.currentJob?.cancel) break;

        try {
          await this.embeddingSyncService.queueForEmbedding(
            tenantId,
            documentType,
            documentId,
          );
          if (this.currentJob) {
            this.currentJob.progress.processedDocuments++;
          }
        } catch (error) {
          logger.error(
            { error, documentId, documentType },
            'Failed to queue document for embedding',
          );
          if (this.currentJob) {
            this.currentJob.progress.failedDocuments++;
          }
        }

        // Update estimated completion time
        if (this.currentJob && this.currentJob.progress.processedDocuments > 0) {
          const elapsed =
            Date.now() - this.currentJob.progress.startedAt.getTime();
          const rate =
            this.currentJob.progress.processedDocuments / (elapsed / 1000);
          const remaining =
            this.currentJob.progress.totalDocuments -
            this.currentJob.progress.processedDocuments;
          const estimatedSecondsRemaining = remaining / rate;
          this.currentJob.progress.estimatedCompletionAt = new Date(
            Date.now() + estimatedSecondsRemaining * 1000,
          );
        }
      }

      offset += batchSize;
      hasMore = documentIds.length === batchSize;
    }
  }

  /**
   * Fetch document IDs for reindexing
   * @param mode - 'full' fetches all, 'new_only' fetches only documents without embeddings
   */
  private async fetchDocumentIds(
    tenantId: string,
    documentType: DocumentType,
    fromDate: Date | undefined,
    limit: number,
    offset: number,
    mode: ReindexMode = 'full',
  ): Promise<string[]> {
    try {
      let result: any[];

      // For new_only mode, fetch documents that don't have embeddings
      if (mode === 'new_only') {
        switch (documentType) {
          case 'encounter_note':
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT en.id FROM encounter_notes en
              WHERE en.tenant_id = ${tenantId}::uuid
                ${fromDate ? this.clinicalPrisma.$queryRaw`AND en.created_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
                AND NOT EXISTS (
                  SELECT 1 FROM clinical_document_embeddings cde
                  WHERE cde.document_id = en.id
                    AND cde.tenant_id = en.tenant_id
                    AND cde.document_type = 'encounter_note'
                    AND cde.is_active = true
                )
              ORDER BY en.created_at
              LIMIT ${limit} OFFSET ${offset}
            `;
            break;

          case 'discharge_summary':
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT ds.id FROM discharge_summaries ds
              WHERE ds.tenant_id = ${tenantId}::uuid
                ${fromDate ? this.clinicalPrisma.$queryRaw`AND ds.finalized_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
                AND NOT EXISTS (
                  SELECT 1 FROM clinical_document_embeddings cde
                  WHERE cde.document_id = ds.id
                    AND cde.tenant_id = ds.tenant_id
                    AND cde.document_type = 'discharge_summary'
                    AND cde.is_active = true
                )
              ORDER BY ds.finalized_at
              LIMIT ${limit} OFFSET ${offset}
            `;
            break;

          default:
            return [];
        }
      } else {
        // Full mode - fetch all documents
        switch (documentType) {
          case 'encounter_note':
            if (fromDate) {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT id FROM encounter_notes
                WHERE tenant_id = ${tenantId}::uuid
                  AND created_at >= ${fromDate}
                ORDER BY created_at
                LIMIT ${limit} OFFSET ${offset}
              `;
            } else {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT id FROM encounter_notes
                WHERE tenant_id = ${tenantId}::uuid
                ORDER BY created_at
                LIMIT ${limit} OFFSET ${offset}
              `;
            }
            break;

          case 'discharge_summary':
            if (fromDate) {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT id FROM discharge_summaries
                WHERE tenant_id = ${tenantId}::uuid
                  AND finalized_at >= ${fromDate}
                ORDER BY finalized_at
                LIMIT ${limit} OFFSET ${offset}
              `;
            } else {
              result = await this.clinicalPrisma.$queryRaw<any[]>`
                SELECT id FROM discharge_summaries
                WHERE tenant_id = ${tenantId}::uuid
                ORDER BY finalized_at
                LIMIT ${limit} OFFSET ${offset}
              `;
            }
            break;

          default:
            return [];
        }
      }

      return result.map((row) => row.id);
    } catch {
      return [];
    }
  }
}
