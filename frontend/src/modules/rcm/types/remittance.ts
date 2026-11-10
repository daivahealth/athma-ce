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

/** Prisma `Decimal` columns arrive over JSON as strings. */
type DecimalValue = number | string;

/** A remittance line as stored by RCM (response shape, not the create payload). */
export interface RemittanceLineRecord {
  id: string;
  claimId?: string | null;
  claimNumber: string;
  lineNumber: number;
  chargedAmount: DecimalValue;
  allowedAmount?: DecimalValue | null;
  paidAmount: DecimalValue;
  adjustmentAmount?: DecimalValue;
  patientResponsibility?: DecimalValue | null;
  status?: string;
}

/**
 * Remittance as returned by the RCM service
 * (backend/shared/database-rcm/prisma/schema.prisma `Remittance`).
 * On create, the request's `format` is stored as `paymentMethod`,
 * `checkNumber` as `paymentRef` and `checkDate` as `paymentDate`.
 */
export interface Remittance {
  id: string;
  remittanceNumber: string;
  payerId: string;
  payer?: { id: string; payerName: string } | null;
  status: RemittanceStatus;
  paymentDate?: string | null;
  depositDate?: string | null;
  paymentMethod?: string | null;
  paymentRef?: string | null;
  totalPaid: DecimalValue;
  totalAdjustment?: DecimalValue;
  claimCount?: number;
  createdAt?: string;
  _count?: { lines: number };
  lines?: RemittanceLineRecord[];
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
  /** Server-side free-text search across all rows (not just the loaded page). */
  search?: string;
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
