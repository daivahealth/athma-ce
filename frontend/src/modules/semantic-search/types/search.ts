/**
 * Semantic Search Types
 * Types for the Clinical Semantic Search feature
 */

/**
 * Document types that can be searched
 */
export type DocumentType =
  | 'encounter_note'
  | 'discharge_summary'
  | 'clinical_note'
  | 'progress_note'
  | 'consultation_note'
  | 'procedure_note'
  | 'operative_note'
  | 'radiology_report'
  | 'lab_report'
  | 'pathology_report';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  encounter_note: 'Encounter Notes',
  discharge_summary: 'Discharge Summaries',
  clinical_note: 'Clinical Notes',
  progress_note: 'Progress Notes',
  consultation_note: 'Consultation Notes',
  procedure_note: 'Procedure Notes',
  operative_note: 'Operative Notes',
  radiology_report: 'Radiology Reports',
  lab_report: 'Lab Reports',
  pathology_report: 'Pathology Reports',
};

/**
 * Date range filter
 */
export interface DateRange {
  from?: string;
  to?: string;
}

/**
 * Search filters
 */
export interface SearchFilters {
  patientId?: string;
  encounterId?: string;
  facilityId?: string;
  departmentId?: string;
  specialtyCode?: string;
  documentTypes?: DocumentType[];
  dateRange?: DateRange;
}

/**
 * Search request
 */
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  minSimilarity?: number;
}

/**
 * Individual search result
 */
export interface SearchResult {
  documentId: string;
  documentType: DocumentType;
  patientId: string;
  patientName?: string;
  encounterId?: string;
  facilityId: string;
  facilityName?: string;
  departmentId?: string;
  departmentName?: string;
  chunkIndex: number;
  chunkText: string;
  highlightedText?: string;
  similarity: number;
  documentDate: string;
}

/**
 * Search response
 */
export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  queryEmbeddingTimeMs: number;
  searchTimeMs: number;
}

/**
 * Similar documents request
 */
export interface SimilarDocumentsRequest {
  documentId: string;
  documentType: DocumentType;
  limit?: number;
  excludePatient?: boolean;
}

/**
 * Queue embedding request
 */
export interface QueueEmbeddingRequest {
  documentType: DocumentType;
  documentId: string;
}

/**
 * Embedding statistics
 */
export interface EmbeddingStats {
  totalDocuments: number;
  totalChunks: number;
  pendingJobs: number;
  failedJobs: number;
  lastSyncAt: string | null;
}

/**
 * Reindex request
 */
export interface ReindexRequest {
  documentTypes?: DocumentType[];
  fromDate?: string;
}

/**
 * Reindex progress
 */
export interface ReindexProgress {
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  startedAt: string;
  estimatedCompletionAt?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
}
