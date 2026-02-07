export type RemittanceStatus =
  | 'received'
  | 'processing'
  | 'processed'
  | 'reconciled'
  | 'error';

export type RemittanceFormat = 'ERA_835' | 'EOB_PDF' | 'MANUAL' | 'JSON';

export interface RemittanceLine {
  claimId?: string;
  claimNumber: string;
  billedAmount: number;
  allowedAmount?: number;
  paidAmount: number;
  patientResponsibility?: number;
  adjustmentCodes?: Array<{ code: string; reason: string; amount: number }>;
  remarkCodes?: string[];
}

export interface Remittance {
  id: string;
  payerId: string;
  status: RemittanceStatus;
  paymentAmount: number;
  format: RemittanceFormat;
  checkNumber?: string | null;
  checkDate?: string | null;
  createdAt?: string;
  lines?: RemittanceLine[];
}

export interface CreateRemittanceInput {
  remittance: {
    payerId: string;
    format: RemittanceFormat;
    checkNumber?: string;
    checkDate?: string;
    paymentAmount: number;
    fileContent?: string;
  };
  lines?: RemittanceLine[];
}

export interface RemittanceFilters {
  payerId?: string;
  status?: RemittanceStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface RemittanceListResponse {
  remittances: Remittance[];
  total: number;
}

export interface ReconcileRemittanceResponse {
  remittanceId: string;
  matchedLines: number;
  unmatchedLines: number;
  totalPaid: number;
  totalAdjusted: number;
  matchedClaims: Array<{
    claimId: string;
    claimNumber: string;
    paidAmount: number;
  }>;
  unmatchedLines_details?: Array<{
    claimNumber: string;
    reason: string;
  }>;
}
