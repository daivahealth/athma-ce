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
