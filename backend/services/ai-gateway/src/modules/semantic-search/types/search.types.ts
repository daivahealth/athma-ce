/**
 * Semantic Search Types
 * Types for clinical document search functionality
 */

export type DocumentType =
  | 'encounter_note'
  | 'discharge_summary'
  | 'clinical_note'
  | 'progress_note'
  | 'consultation_note'
  | 'procedure_note'
  | 'operative_note';

export interface SearchFilters {
  // ID-based filters (existing)
  patientId?: string;
  encounterId?: string;
  facilityId?: string;
  departmentId?: string;
  specialtyCode?: string;
  documentTypes?: DocumentType[];
  dateFrom?: Date;
  dateTo?: Date;

  // Name-based filters (new - uses denormalized fields)
  patientName?: string;      // ILIKE search
  patientMrn?: string;       // Exact or prefix match
  patientGender?: string;    // Exact match
  patientAgeMin?: number;    // Range filter
  patientAgeMax?: number;    // Range filter
  encounterType?: string;    // Exact match
  authorStaffId?: string;    // UUID filter
  authorName?: string;       // ILIKE search
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  minSimilarity?: number;
}

export interface SearchResult {
  documentId: string;
  documentType: DocumentType;
  patientId: string;
  encounterId?: string;
  facilityId: string;
  chunkText: string;
  highlightedText: string;
  similarity: number;
  documentDate: Date;
  metadata?: Record<string, any>;

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

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  queryEmbeddingTime: number;
  searchTime: number;
  query: string;
}

export interface SimilarDocumentsRequest {
  documentId: string;
  documentType: DocumentType;
  limit?: number;
  minSimilarity?: number;
}

export interface DocumentEmbedding {
  id: string;
  tenantId: string;
  documentType: DocumentType;
  documentId: string;
  chunkIndex: number;
  chunkText: string;
  chunkStartOffset?: number;
  chunkEndOffset?: number;
  embedding: number[];
  patientId: string;
  encounterId?: string;
  facilityId: string;
  departmentId?: string;
  specialtyCode?: string;
  documentDate: Date;
  isActive: boolean;
  embeddedAt: Date;
  embeddingModel: string;

  // Denormalized metadata
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

export interface EmbeddingSyncJob {
  id: string;
  tenantId: string;
  documentType: DocumentType;
  documentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastAttemptAt?: Date;
  attemptCount: number;
  errorMessage?: string;
}

export interface ChunkingConfig {
  targetChunkSize: number;
  overlap: number;
  minChunkSize: number;
}

export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  targetChunkSize: 512, // tokens
  overlap: 64, // tokens
  minChunkSize: 10, // characters - lowered to allow short clinical notes
};

export const EMBEDDING_CONFIG = {
  MODEL: 'text-embedding-3-small',
  DIMENSIONS: 1536,
  MAX_BATCH_SIZE: 20,
};

export const SEARCH_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_MIN_SIMILARITY: 0.3,
  MIN_SIMILARITY_THRESHOLD: 0.2,
};

/**
 * Medical abbreviation expansions for preprocessing
 */
export const MEDICAL_ABBREVIATIONS: Record<string, string> = {
  pt: 'patient',
  pts: 'patients',
  dx: 'diagnosis',
  hx: 'history',
  rx: 'prescription',
  tx: 'treatment',
  fx: 'fracture',
  sx: 'symptoms',
  bx: 'biopsy',
  'c/o': 'complaining of',
  'r/o': 'rule out',
  sob: 'shortness of breath',
  nkda: 'no known drug allergies',
  nka: 'no known allergies',
  bid: 'twice daily',
  tid: 'three times daily',
  qid: 'four times daily',
  prn: 'as needed',
  po: 'by mouth',
  iv: 'intravenous',
  im: 'intramuscular',
  sc: 'subcutaneous',
  bp: 'blood pressure',
  hr: 'heart rate',
  rr: 'respiratory rate',
  temp: 'temperature',
  wbc: 'white blood cell',
  rbc: 'red blood cell',
  hgb: 'hemoglobin',
  hct: 'hematocrit',
  plt: 'platelet',
  bmp: 'basic metabolic panel',
  cmp: 'comprehensive metabolic panel',
  cbc: 'complete blood count',
  ua: 'urinalysis',
  ecg: 'electrocardiogram',
  ekg: 'electrocardiogram',
  ct: 'computed tomography',
  mri: 'magnetic resonance imaging',
  cxr: 'chest x-ray',
  xray: 'x-ray',
  us: 'ultrasound',
  echo: 'echocardiogram',
  gi: 'gastrointestinal',
  gu: 'genitourinary',
  neuro: 'neurological',
  psych: 'psychiatric',
  ortho: 'orthopedic',
  peds: 'pediatric',
  ob: 'obstetrics',
  gyn: 'gynecology',
  ent: 'ear nose throat',
  derm: 'dermatology',
  ophtho: 'ophthalmology',
  dm: 'diabetes mellitus',
  htn: 'hypertension',
  cad: 'coronary artery disease',
  chf: 'congestive heart failure',
  copd: 'chronic obstructive pulmonary disease',
  ckd: 'chronic kidney disease',
  esrd: 'end stage renal disease',
  gerd: 'gastroesophageal reflux disease',
  uti: 'urinary tract infection',
  uri: 'upper respiratory infection',
  osa: 'obstructive sleep apnea',
  dvt: 'deep vein thrombosis',
  pe: 'pulmonary embolism',
  mi: 'myocardial infarction',
  cva: 'cerebrovascular accident',
  tia: 'transient ischemic attack',
};
