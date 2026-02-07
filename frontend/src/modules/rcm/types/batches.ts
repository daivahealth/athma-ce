export type BatchStatus =
  | 'open'
  | 'closed'
  | 'submitting'
  | 'submitted'
  | 'acknowledged'
  | 'rejected'
  | 'partially_processed';

export type BatchType = 'professional' | 'institutional' | 'dental' | 'pharmacy';

export interface Batch {
  id: string;
  batchNumber: string;
  status: BatchStatus;
  batchType?: BatchType | null;
  claimFormat: string;
  claimCount: number;
  totalAmount: number;
  payerId?: string | null;
  payer?: any;
  claims?: any[];
  createdAt?: string;
}

export interface BatchFilters {
  payerId?: string;
  status?: BatchStatus;
  batchType?: BatchType;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreateBatchInput {
  batchType?: BatchType;
  claimFormat: string;
  payerId?: string;
}

export interface BatchListResponse {
  batches: Batch[];
  total: number;
}

export interface BatchGenerateResponse {
  success: boolean;
  generatedFile?: { format: string; filename: string; mimeType: string };
  validationResults?: Array<{ claimId: string; claimNumber: string; validation: any }>;
  failedClaims?: Array<{ claimId: string; claimNumber: string; validation: any }>;
  error?: string;
}
