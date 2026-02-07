import type { PatientDisplay } from './invoice';

export type ClaimStatus =
  | 'draft'
  | 'pending'
  | 'ready'
  | 'scrubbing'
  | 'validated'
  | 'failed_validation'
  | 'submitted'
  | 'acknowledged'
  | 'rejected'
  | 'pending_adjudication'
  | 'adjudicated'
  | 'paid'
  | 'partially_paid'
  | 'denied'
  | 'appealed'
  | 'cancelled';

export interface ClaimLine {
  id?: string;
  lineNumber?: number;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  lineAmount?: number;
}

export interface ClaimDiagnosis {
  id?: string;
  code?: string;
  description?: string;
  sequence?: number;
}

export interface Claim {
  id: string;
  claimNumber: string;
  status: ClaimStatus;
  patientId: string;
  encounterId?: string | null;
  payerId?: string | null;
  batchId?: string | null;
  serviceDate?: string | null;
  totalAmount: number;
  currency?: string | null;
  payer?: any;
  claimLines?: ClaimLine[];
  claimDiagnoses?: ClaimDiagnosis[];
  patientDisplay?: PatientDisplay | null;
}

export interface ClaimFilters {
  patientId?: string;
  encounterId?: string;
  payerId?: string;
  status?: ClaimStatus;
  batchId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreateClaimInput {
  patientId: string;
  encounterId?: string;
  payerId?: string;
  serviceDate: string;
  currency?: string;
}

export interface GenerateClaimsInput {
  encounterIds?: string[];
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  payerId?: string;
}

export interface GenerateClaimsResponse {
  generatedCount: number;
  claimIds: string[];
}

export interface ValidateClaimResult {
  isValid: boolean;
  errors: Array<{
    code: string;
    field?: string;
    lineNumber?: number;
    message: string;
    severity: 'error';
  }>;
  warnings: Array<{
    code: string;
    field?: string;
    message: string;
    severity: 'warning';
  }>;
}

export interface SubmitClaimResponse {
  success: boolean;
  claimId: string;
  submittedAt?: string;
  generatedFile?: {
    format: string;
    filename: string;
    mimeType: string;
  };
  validation: ValidateClaimResult;
  error?: string;
}

export interface ClaimStatistics {
  total: number;
  totalAmount: number;
  byStatus: Record<string, { count: number; amount: number }>;
}

export interface ClaimFormat {
  format: string;
  displayName: string;
  supportedRegions: string[];
}
