/**
 * Embedding Sync Service
 * Handles CDC-based synchronization of clinical documents to embeddings
 */

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { EmbeddingService, EmbeddedChunk } from './embedding.service';
import {
  DocumentType,
  EmbeddingSyncJob,
  EMBEDDING_CONFIG,
} from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

interface DocumentContent {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string;
  facilityId: string;
  departmentId?: string;
  specialtyCode?: string;
  documentDate: Date;
  content: string;

  // Denormalized metadata for search
  patientName?: string;
  patientMrn?: string;
  patientGender?: string;
  patientAgeAtDoc?: number;
  encounterNumber?: string;
  encounterType?: string;
  authorStaffId?: string;
  authorName?: string;
  departmentName?: string;
  facilityName?: string;
}

@Injectable()
export class EmbeddingSyncService {
  private isProcessing = false;

  constructor(
    private clinicalPrisma: ClinicalPrismaService,
    private embeddingService: EmbeddingService,
  ) {}

  /**
   * Queue a document for embedding
   */
  async queueForEmbedding(
    tenantId: string,
    documentType: DocumentType,
    documentId: string,
  ): Promise<void> {
    try {
      const result = await this.clinicalPrisma.$executeRaw`
        INSERT INTO embedding_sync_status (id, tenant_id, document_type, document_id, status, attempt_count, created_at, updated_at)
        VALUES (gen_random_uuid(), ${tenantId}::uuid, ${documentType}, ${documentId}::uuid, 'pending', 0, NOW(), NOW())
        ON CONFLICT (tenant_id, document_type, document_id)
        DO UPDATE SET status = 'pending', last_attempt_at = NULL, error_message = NULL, updated_at = NOW()
      `;

      logger.info(
        { tenantId, documentType, documentId, rowsAffected: result },
        'Document queued for embedding',
      );
    } catch (error) {
      logger.error(
        { error, tenantId, documentType, documentId },
        'Failed to queue document for embedding',
      );
    }
  }

  /**
   * Process pending embedding jobs (runs every 30 seconds)
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async processPendingEmbeddings(): Promise<void> {
    if (this.isProcessing) {
      logger.debug('Embedding sync already in progress, skipping');
      return;
    }

    this.isProcessing = true;
    logger.debug('Embedding sync cron triggered');

    try {
      // Fetch pending jobs with row locking
      const pendingJobs = await this.fetchPendingJobs(50);

      if (pendingJobs.length === 0) {
        logger.debug('No pending embedding jobs found');
        return;
      }

      logger.info({ jobCount: pendingJobs.length }, 'Processing embedding jobs');

      for (const job of pendingJobs) {
        await this.processJob(job);
      }
    } catch (error) {
      logger.error({ error }, 'Error processing embedding jobs');
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Fetch pending jobs from the queue
   */
  private async fetchPendingJobs(limit: number): Promise<EmbeddingSyncJob[]> {
    try {
      // Note: FOR UPDATE SKIP LOCKED requires proper transaction context
      // Using simpler query without row locking for now
      const jobs = await this.clinicalPrisma.$queryRaw<EmbeddingSyncJob[]>`
        SELECT id, tenant_id, document_type, document_id, status,
               last_attempt_at, attempt_count, error_message
        FROM embedding_sync_status
        WHERE status = 'pending'
          AND attempt_count < 3
        ORDER BY last_attempt_at NULLS FIRST
        LIMIT ${limit}
      `;

      logger.debug({ jobCount: jobs.length }, 'Fetched pending jobs from queue');

      return jobs.map((job: any) => ({
        id: job.id,
        tenantId: job.tenant_id,
        documentType: job.document_type as DocumentType,
        documentId: job.document_id,
        status: job.status,
        lastAttemptAt: job.last_attempt_at,
        attemptCount: job.attempt_count,
        errorMessage: job.error_message,
      }));
    } catch (error) {
      logger.error({ error }, 'Failed to fetch pending jobs');
      return [];
    }
  }

  /**
   * Process a single embedding job
   */
  private async processJob(job: EmbeddingSyncJob): Promise<void> {
    const startTime = Date.now();

    try {
      // Mark as processing
      await this.updateJobStatus(job.id, 'processing');

      // Fetch document content
      const document = await this.fetchDocumentContent(
        job.tenantId,
        job.documentType,
        job.documentId,
      );

      if (!document) {
        await this.markJobFailed(job.id, 'Document not found');
        return;
      }

      // Generate embeddings
      const chunks = await this.embeddingService.embedDocument(document.content);

      // Delete existing embeddings for this document
      await this.deleteExistingEmbeddings(
        job.tenantId,
        job.documentType,
        job.documentId,
      );

      // Insert new embeddings
      await this.insertEmbeddings(document, job.documentType, chunks);

      // Mark as completed
      await this.updateJobStatus(job.id, 'completed');

      logger.info(
        {
          documentId: job.documentId,
          documentType: job.documentType,
          chunkCount: chunks.length,
          processingTimeMs: Date.now() - startTime,
        },
        'Document embedding completed',
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.markJobFailed(job.id, errorMessage);

      logger.error(
        {
          error,
          documentId: job.documentId,
          documentType: job.documentType,
        },
        'Document embedding failed',
      );
    }
  }

  /**
   * Fetch document content based on type
   */
  private async fetchDocumentContent(
    tenantId: string,
    documentType: DocumentType,
    documentId: string,
  ): Promise<DocumentContent | null> {
    // This would fetch from the appropriate table based on document type
    // For now, return a placeholder
    // In production, this would be implemented per document type

    switch (documentType) {
      case 'encounter_note':
        return this.fetchEncounterNote(tenantId, documentId);
      case 'discharge_summary':
        return this.fetchDischargeSummary(tenantId, documentId);
      case 'clinical_note':
      case 'progress_note':
      case 'consultation_note':
        return this.fetchClinicalNote(tenantId, documentId);
      default:
        return null;
    }
  }

  private async fetchEncounterNote(
    tenantId: string,
    documentId: string,
  ): Promise<DocumentContent | null> {
    try {
      // Get note metadata with patient, encounter, and author info
      const noteResult = await this.clinicalPrisma.$queryRaw<any[]>`
        SELECT
          en.id,
          en.tenant_id,
          en.patient_id,
          en.encounter_id,
          en.title,
          en.note_type,
          en.author_staff_id,
          en.author_display_name,
          e.facility_id,
          e.facility_name,
          e.department_id,
          e.department_name,
          e.encounter_number,
          e.encounter_type,
          p.first_name || ' ' || p.last_name as patient_name,
          p.mrn as patient_mrn,
          p.gender as patient_gender,
          EXTRACT(YEAR FROM AGE(en.created_at, p.date_of_birth))::int as patient_age_at_doc,
          en.created_at as document_date
        FROM encounter_notes en
        JOIN encounters e ON en.encounter_id = e.id
        JOIN patients p ON en.patient_id = p.id
        WHERE en.id = ${documentId}::uuid
          AND en.tenant_id = ${tenantId}::uuid
        LIMIT 1
      `;

      if (noteResult.length === 0) return null;

      // Get all sections and extract text content from JSONB
      // Handles both simple format {"text": "..."} and smart charting {"blocks": [...]}
      const sectionsResult = await this.clinicalPrisma.$queryRaw<any[]>`
        SELECT
          section_name,
          COALESCE(
            -- Try simple text format first
            content->>'text',
            -- Then try to extract from blocks array
            (
              SELECT string_agg(
                COALESCE(block->>'header', '') || ': ' || COALESCE(block->>'content', ''),
                E'\n'
              )
              FROM jsonb_array_elements(content->'blocks') AS block
              WHERE block->>'content' IS NOT NULL AND block->>'content' != ''
            ),
            ''
          ) as section_text
        FROM encounter_note_sections
        WHERE note_id = ${documentId}::uuid
        ORDER BY sort_order
      `;

      // Combine all section content (only the actual clinical text, no metadata prefixes)
      const contentParts: string[] = [];
      const noteRow = noteResult[0];

      for (const section of sectionsResult) {
        if (section.section_text && section.section_text.trim()) {
          // Only include the actual content, not section names or metadata
          contentParts.push(section.section_text.trim());
        }
      }

      const combinedContent = contentParts.join('\n\n');

      if (!combinedContent.trim()) {
        logger.warn(
          { documentId, tenantId },
          'Encounter note has no extractable content',
        );
        return null;
      }

      return {
        id: noteRow.id,
        tenantId: noteRow.tenant_id,
        patientId: noteRow.patient_id,
        encounterId: noteRow.encounter_id,
        facilityId: noteRow.facility_id,
        departmentId: noteRow.department_id,
        documentDate: noteRow.document_date,
        content: combinedContent,
        // Denormalized metadata
        patientName: noteRow.patient_name,
        patientMrn: noteRow.patient_mrn,
        patientGender: noteRow.patient_gender,
        patientAgeAtDoc: noteRow.patient_age_at_doc,
        encounterNumber: noteRow.encounter_number,
        encounterType: noteRow.encounter_type,
        authorStaffId: noteRow.author_staff_id,
        authorName: noteRow.author_display_name,
        departmentName: noteRow.department_name,
        facilityName: noteRow.facility_name,
      };
    } catch (error) {
      logger.error(
        { error, documentId, tenantId },
        'Failed to fetch encounter note content',
      );
      return null;
    }
  }

  private async fetchDischargeSummary(
    tenantId: string,
    documentId: string,
  ): Promise<DocumentContent | null> {
    try {
      const result = await this.clinicalPrisma.$queryRaw<any[]>`
        SELECT
          ds.id,
          ds.tenant_id,
          ia.patient_id,
          ia.encounter_id,
          ia.facility_id,
          ia.department_id,
          ia.current_ward_name as department_name,
          ds.summary_content as content,
          ds.finalized_at as document_date,
          ds.attending_physician_id as author_staff_id,
          ds.attending_physician_name as author_name,
          e.encounter_number,
          e.encounter_type,
          e.facility_name,
          p.first_name || ' ' || p.last_name as patient_name,
          p.mrn as patient_mrn,
          p.gender as patient_gender,
          EXTRACT(YEAR FROM AGE(ds.finalized_at, p.date_of_birth))::int as patient_age_at_doc
        FROM discharge_summaries ds
        JOIN inpatient_admissions ia ON ds.admission_id = ia.id
        JOIN encounters e ON ia.encounter_id = e.id
        JOIN patients p ON ia.patient_id = p.id
        WHERE ds.id = ${documentId}::uuid
          AND ds.tenant_id = ${tenantId}::uuid
        LIMIT 1
      `;

      if (result.length === 0) return null;

      const row = result[0];
      return {
        id: row.id,
        tenantId: row.tenant_id,
        patientId: row.patient_id,
        encounterId: row.encounter_id,
        facilityId: row.facility_id,
        departmentId: row.department_id,
        documentDate: row.document_date,
        content: row.content || '',
        // Denormalized metadata
        patientName: row.patient_name,
        patientMrn: row.patient_mrn,
        patientGender: row.patient_gender,
        patientAgeAtDoc: row.patient_age_at_doc,
        encounterNumber: row.encounter_number,
        encounterType: row.encounter_type,
        authorStaffId: row.author_staff_id,
        authorName: row.author_name,
        departmentName: row.department_name,
        facilityName: row.facility_name,
      };
    } catch {
      return null;
    }
  }

  private async fetchClinicalNote(
    tenantId: string,
    documentId: string,
  ): Promise<DocumentContent | null> {
    // Placeholder - implement based on actual schema
    return null;
  }

  /**
   * Delete existing embeddings for a document
   */
  private async deleteExistingEmbeddings(
    tenantId: string,
    documentType: DocumentType,
    documentId: string,
  ): Promise<void> {
    try {
      await this.clinicalPrisma.$executeRaw`
        DELETE FROM clinical_document_embeddings
        WHERE tenant_id = ${tenantId}::uuid
          AND document_type = ${documentType}
          AND document_id = ${documentId}::uuid
      `;
    } catch {
      // Table might not exist
    }
  }

  /**
   * Insert embeddings for a document
   */
  private async insertEmbeddings(
    document: DocumentContent,
    documentType: DocumentType,
    chunks: EmbeddedChunk[],
  ): Promise<void> {
    for (const chunk of chunks) {
      const embeddingArray = `[${chunk.embedding.join(',')}]`;

      try {
        await this.clinicalPrisma.$executeRaw`
          INSERT INTO clinical_document_embeddings (
            id, tenant_id, document_type, document_id, chunk_index,
            chunk_text, chunk_start_offset, chunk_end_offset,
            embedding, patient_id, encounter_id, facility_id, department_id,
            specialty_code, document_date, is_active, embedded_at, embedding_model,
            patient_name, patient_mrn, patient_gender, patient_age_at_doc,
            encounter_number, encounter_type, author_staff_id, author_name,
            department_name, facility_name
          ) VALUES (
            gen_random_uuid(),
            ${document.tenantId}::uuid,
            ${documentType},
            ${document.id}::uuid,
            ${chunk.index},
            ${chunk.text},
            ${chunk.startOffset},
            ${chunk.endOffset},
            ${embeddingArray}::vector,
            ${document.patientId}::uuid,
            ${document.encounterId}::uuid,
            ${document.facilityId}::uuid,
            ${document.departmentId}::uuid,
            ${document.specialtyCode},
            ${document.documentDate},
            true,
            NOW(),
            ${EMBEDDING_CONFIG.MODEL},
            ${document.patientName},
            ${document.patientMrn},
            ${document.patientGender},
            ${document.patientAgeAtDoc},
            ${document.encounterNumber},
            ${document.encounterType},
            ${document.authorStaffId}::uuid,
            ${document.authorName},
            ${document.departmentName},
            ${document.facilityName}
          )
        `;
      } catch (error) {
        logger.error({ error, documentId: document.id }, 'Failed to insert embedding');
        throw error;
      }
    }
  }

  /**
   * Update job status
   */
  private async updateJobStatus(
    jobId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
  ): Promise<void> {
    try {
      await this.clinicalPrisma.$executeRaw`
        UPDATE embedding_sync_status
        SET status = ${status},
            last_attempt_at = NOW(),
            attempt_count = attempt_count + 1,
            updated_at = NOW()
        WHERE id = ${jobId}::uuid
      `;
    } catch (error) {
      logger.error({ error, jobId, status }, 'Failed to update job status');
    }
  }

  /**
   * Mark job as failed
   */
  private async markJobFailed(jobId: string, errorMessage: string): Promise<void> {
    try {
      await this.clinicalPrisma.$executeRaw`
        UPDATE embedding_sync_status
        SET status = 'failed',
            last_attempt_at = NOW(),
            attempt_count = attempt_count + 1,
            error_message = ${errorMessage},
            updated_at = NOW()
        WHERE id = ${jobId}::uuid
      `;
    } catch (error) {
      logger.error({ error, jobId }, 'Failed to mark job as failed');
    }
  }

  /**
   * Get embedding statistics
   */
  async getStats(tenantId: string): Promise<{
    totalDocuments: number;
    totalChunks: number;
    pendingJobs: number;
    failedJobs: number;
    lastSyncAt: Date | null;
  }> {
    try {
      const [docStats, jobStats] = await Promise.all([
        this.clinicalPrisma.$queryRaw<any[]>`
          SELECT
            COUNT(DISTINCT document_id) as total_documents,
            COUNT(*) as total_chunks,
            MAX(embedded_at) as last_sync_at
          FROM clinical_document_embeddings
          WHERE tenant_id = ${tenantId}::uuid AND is_active = true
        `,
        this.clinicalPrisma.$queryRaw<any[]>`
          SELECT
            COUNT(*) FILTER (WHERE status = 'pending') as pending_jobs,
            COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs
          FROM embedding_sync_status
          WHERE tenant_id = ${tenantId}::uuid
        `,
      ]);

      return {
        totalDocuments: parseInt(docStats[0]?.total_documents || '0'),
        totalChunks: parseInt(docStats[0]?.total_chunks || '0'),
        pendingJobs: parseInt(jobStats[0]?.pending_jobs || '0'),
        failedJobs: parseInt(jobStats[0]?.failed_jobs || '0'),
        lastSyncAt: docStats[0]?.last_sync_at || null,
      };
    } catch {
      return {
        totalDocuments: 0,
        totalChunks: 0,
        pendingJobs: 0,
        failedJobs: 0,
        lastSyncAt: null,
      };
    }
  }
}
