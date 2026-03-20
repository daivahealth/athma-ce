/**
 * Types for AI-powered clinical coding suggestions.
 */

export interface ClinicalCodingSuggestion {
  code: string;
  description: string;
  shortDescription: string;
  confidence: number;
  codeSystem: 'ICD-10' | 'SNOMED';
  rationale: string;
  catalogMatch: boolean;
  isBillable: boolean | null;
}

export interface ClinicalCodingSuggestRequest {
  clinicalText: string;
  blockTypes?: string[];
  existingCodes?: string[];
}

export interface ClinicalCodingSuggestResponse {
  suggestions: ClinicalCodingSuggestion[];
  fromCache: boolean;
  processingTimeMs: number;
}

/**
 * Input for saving a clinical coding to encounter_clinical_codings.
 */
export interface CreateClinicalCodingInput {
  encounterId: string;
  patientId: string;
  code: string;
  codeSystem: string;
  displayName: string;
  displayNameAr?: string;
  snomedCode?: string;
  snomedDisplay?: string;
  codingType: string; // diagnosis, symptom, finding, procedure, medication
  confidence?: number;
  rationale?: string;
  aiSuggestionId?: string;
  sourceBlockType?: string;
  sourceText?: string;
  status: string; // accepted, rejected, suggested, manual
  reviewedBy?: string;
  catalogMatch?: boolean;
  isBillable?: boolean;
}
