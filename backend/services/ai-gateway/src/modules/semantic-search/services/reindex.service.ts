/**
 * Reindex Service
 * Handles bulk reindexing of clinical documents
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { EmbeddingSyncService } from './embedding-sync.service';
import { DocumentType } from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

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
   */
  async startReindex(
    tenantId: string,
    documentTypes?: DocumentType[],
    fromDate?: Date,
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

    // Start reindex in background
    this.runReindex(tenantId, documentTypes, fromDate).catch((error) => {
      logger.error({ error, tenantId }, 'Reindex job failed');
      if (this.currentJob) {
        this.currentJob.progress.status = 'failed';
      }
    });

    return {
      jobId,
      message: 'Reindex job started. Use GET /search/reindex/status to check progress.',
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
      { tenantId, documentTypes: types, fromDate },
      'Starting reindex job',
    );

    try {
      // Count total documents
      let totalCount = 0;
      for (const docType of types) {
        const count = await this.countDocuments(tenantId, docType, fromDate);
        totalCount += count;
      }

      this.currentJob.progress.totalDocuments = totalCount;

      if (totalCount === 0) {
        this.currentJob.progress.status = 'completed';
        logger.info({ tenantId }, 'No documents to reindex');
        return;
      }

      // Process each document type
      for (const docType of types) {
        if (this.currentJob.cancel) break;

        await this.reindexDocumentType(
          tenantId,
          docType as DocumentType,
          fromDate,
        );
      }

      this.currentJob.progress.status = this.currentJob.cancel
        ? 'cancelled'
        : 'completed';

      logger.info(
        {
          tenantId,
          totalDocuments: this.currentJob.progress.totalDocuments,
          processedDocuments: this.currentJob.progress.processedDocuments,
          failedDocuments: this.currentJob.progress.failedDocuments,
        },
        'Reindex job completed',
      );
    } catch (error) {
      logger.error({ error, tenantId }, 'Reindex job failed');
      if (this.currentJob) {
        this.currentJob.progress.status = 'failed';
      }
    }
  }

  /**
   * Count documents of a specific type
   */
  private async countDocuments(
    tenantId: string,
    documentType: DocumentType,
    fromDate?: Date,
  ): Promise<number> {
    try {
      let result: any[];

      switch (documentType) {
        case 'encounter_note':
          result = await this.clinicalPrisma.$queryRaw<any[]>`
            SELECT COUNT(*) as count
            FROM encounter_notes
            WHERE tenant_id = ${tenantId}
            ${fromDate ? this.clinicalPrisma.$queryRaw`AND created_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
          `;
          break;

        case 'discharge_summary':
          result = await this.clinicalPrisma.$queryRaw<any[]>`
            SELECT COUNT(*) as count
            FROM discharge_summaries
            WHERE tenant_id = ${tenantId}
            ${fromDate ? this.clinicalPrisma.$queryRaw`AND finalized_at >= ${fromDate}` : this.clinicalPrisma.$queryRaw``}
          `;
          break;

        default:
          return 0;
      }

      return parseInt(result[0]?.count || '0');
    } catch {
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
   */
  private async fetchDocumentIds(
    tenantId: string,
    documentType: DocumentType,
    fromDate: Date | undefined,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    try {
      let result: any[];

      switch (documentType) {
        case 'encounter_note':
          if (fromDate) {
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT id FROM encounter_notes
              WHERE tenant_id = ${tenantId}
                AND created_at >= ${fromDate}
              ORDER BY created_at
              LIMIT ${limit} OFFSET ${offset}
            `;
          } else {
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT id FROM encounter_notes
              WHERE tenant_id = ${tenantId}
              ORDER BY created_at
              LIMIT ${limit} OFFSET ${offset}
            `;
          }
          break;

        case 'discharge_summary':
          if (fromDate) {
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT id FROM discharge_summaries
              WHERE tenant_id = ${tenantId}
                AND finalized_at >= ${fromDate}
              ORDER BY finalized_at
              LIMIT ${limit} OFFSET ${offset}
            `;
          } else {
            result = await this.clinicalPrisma.$queryRaw<any[]>`
              SELECT id FROM discharge_summaries
              WHERE tenant_id = ${tenantId}
              ORDER BY finalized_at
              LIMIT ${limit} OFFSET ${offset}
            `;
          }
          break;

        default:
          return [];
      }

      return result.map((row) => row.id);
    } catch {
      return [];
    }
  }
}
