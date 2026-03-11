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
 * Encounter types
 */
export type EncounterType = 'outpatient' | 'inpatient' | 'emergency' | 'day_case' | 'virtual';

export const ENCOUNTER_TYPE_LABELS: Record<EncounterType, string> = {
  outpatient: 'Outpatient',
  inpatient: 'Inpatient',
  emergency: 'Emergency',
  day_case: 'Day Case',
  virtual: 'Virtual',
};

/**
 * Gender options
 */
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Search filters
 */
export interface SearchFilters {
  // ID-based filters
  patientId?: string;
  encounterId?: string;
  facilityId?: string;
  departmentId?: string;
  specialtyCode?: string;
  documentTypes?: DocumentType[];
  dateFrom?: string;
  dateTo?: string;

  // Name-based filters (uses denormalized fields)
  patientName?: string;      // Case-insensitive contains
  patientMrn?: string;       // Prefix match
  patientGender?: string;    // Exact match
  patientAgeMin?: number;    // Range filter
  patientAgeMax?: number;    // Range filter
  encounterType?: string;    // Exact match
  authorStaffId?: string;    // UUID filter
  authorName?: string;       // Case-insensitive contains
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
  encounterId?: string;
  facilityId: string;
  chunkIndex: number;
  chunkText: string;
  highlightedText?: string;
  similarity: number;
  documentDate: string;

  // Denormalized display fields
  patientName?: string;
  patientMrn?: string;
  patientGender?: string;
  patientAge?: number;
  encounterNumber?: string;
  encounterType?: string;
  authorStaffId?: string;
  authorName?: string;
  departmentId?: string;
  departmentName?: string;
  facilityName?: string;
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
  minSimilarity?: number;
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
 * Reindex mode
 */
export type ReindexMode = 'full' | 'new_only' | 'metadata_only';

export const REINDEX_MODE_LABELS: Record<ReindexMode, string> = {
  full: 'Full Re-index (all documents)',
  new_only: 'New Documents Only',
  metadata_only: 'Update Metadata Only',
};

export const REINDEX_MODE_DESCRIPTIONS: Record<ReindexMode, string> = {
  full: 'Re-generates embeddings for all documents. Use after model upgrades.',
  new_only: 'Only indexes documents that do not have embeddings yet.',
  metadata_only: 'Updates patient/author metadata for existing embeddings without regenerating vectors.',
};

/**
 * Reindex request
 */
export interface ReindexRequest {
  mode?: ReindexMode;
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
