export enum LedgerEntryType {
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND',
  OPENING_BALANCE = 'OPENING_BALANCE',
}

export enum LedgerEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  VOID = 'VOID',
}

export enum AdjustmentType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export interface PatientLedgerEntry {
  id: string;
  tenantId: string;
  patientId: string;
  entryTime: string;
  postingDate: string;
  currency: string;
  debitAmount: number;
  creditAmount: number;
  entryType: LedgerEntryType;
  sourceType: string;
  sourceId: string;
  sourceNumber: string;
  encounterId?: string | null;
  invoiceId?: string | null;
  receiptId?: string | null;
  refundId?: string | null;
  description?: string | null;
  notes?: string | null;
  status: LedgerEntryStatus;
  reversalOfEntryId?: string | null;
  createdAt: string;
  createdBy?: string | null;
  postedAt?: string | null;
  postedBy?: string | null;
  runningBalance?: number;
}

export interface PatientBalanceSummary {
  patientId: string;
  currency: string;
  balance: number;
  totalDebits: number;
  totalCredits: number;
  lastLedgerEntryId?: string | null;
  lastLedgerEntryTime?: string | null;
  updatedAt: string;
}

export interface PatientLedgerResponse {
  entries: PatientLedgerEntry[];
  summary: PatientBalanceSummary | null;
}

export interface LedgerFilters {
  dateFrom?: string;
  dateTo?: string;
  entryType?: LedgerEntryType;
  status?: LedgerEntryStatus;
}

export interface CreateAdjustmentInput {
  patientId: string;
  amount: number;
  adjustmentType: AdjustmentType;
  reason: string;
  currency?: string;
  notes?: string;
  postingDate?: string;
}

export interface CreateOpeningBalanceInput {
  patientId: string;
  amount: number;
  currency?: string;
  postingDate?: string;
  description?: string;
}

export interface ReverseEntryInput {
  reason: string;
}

// Display labels for entry types
export const entryTypeLabels: Record<LedgerEntryType, string> = {
  [LedgerEntryType.INVOICE]: 'Invoice',
  [LedgerEntryType.RECEIPT]: 'Receipt',
  [LedgerEntryType.CREDIT_NOTE]: 'Credit Note',
  [LedgerEntryType.DEBIT_NOTE]: 'Debit Note',
  [LedgerEntryType.ADJUSTMENT]: 'Adjustment',
  [LedgerEntryType.REFUND]: 'Refund',
  [LedgerEntryType.OPENING_BALANCE]: 'Opening Balance',
};

// Display labels for entry statuses
export const entryStatusLabels: Record<LedgerEntryStatus, string> = {
  [LedgerEntryStatus.DRAFT]: 'Draft',
  [LedgerEntryStatus.POSTED]: 'Posted',
  [LedgerEntryStatus.REVERSED]: 'Reversed',
  [LedgerEntryStatus.VOID]: 'Void',
};
