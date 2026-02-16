import type { PatientDisplay } from './invoice';

export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
  VOIDED = 'voided',
}

export enum RefundMethod {
  CASH = 'cash',
  CARD_REVERSAL = 'card_reversal',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  WALLET = 'wallet',
  OTHER = 'other',
}

export interface RefundAllocation {
  id?: string;
  refundId?: string;
  invoiceId: string;
  allocatedAmount: number;
  createdAt?: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
    netAmount: number;
    balanceDue: number;
    status: string;
  };
}

export interface RefundAuditLog {
  id: string;
  refundId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: Record<string, unknown>;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  receiptDate: string;
}

export interface Refund {
  id: string;
  tenantId: string;
  patientId: string;
  receiptId?: string | null;
  refundNumber: string;
  refundDate: string;
  amount: number;
  currency: string;
  refundedAmount?: number | null;
  refundedCurrency?: string | null;
  fxRateToBase?: number | null;
  refundMethod: RefundMethod;
  txnReference?: string | null;
  reason?: string | null;
  notes?: string | null;
  status: RefundStatus;
  requestedBy?: string | null;
  requestedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  processedBy?: string | null;
  processedAt?: string | null;
  rejectionReason?: string | null;
  mrn?: string | null;
  patientDisplayName?: string | null;
  createdAt: string;
  updatedAt: string;
  allocations?: RefundAllocation[];
  receipt?: Receipt | null;
  auditLogs?: RefundAuditLog[];
  patientDisplay?: PatientDisplay | null;
}

export interface RefundFilters {
  patientId?: string;
  receiptId?: string;
  status?: RefundStatus;
  refundMethod?: RefundMethod;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateRefundAllocationInput {
  invoiceId: string;
  allocatedAmount: number;
}

export interface CreateRefundInput {
  patientId: string;
  receiptId?: string;
  refundNumber?: string;
  refundDate?: string;
  amount: number;
  currency?: string;
  refundedAmount?: number;
  refundedCurrency?: string;
  fxRateToBase?: number;
  refundMethod: RefundMethod;
  txnReference?: string;
  reason?: string;
  notes?: string;
  mrn?: string;
  patientDisplayName?: string;
  allocations?: CreateRefundAllocationInput[];
}

export interface UpdateRefundInput {
  amount?: number;
  currency?: string;
  refundedAmount?: number;
  refundedCurrency?: string;
  fxRateToBase?: number;
  refundMethod?: RefundMethod;
  txnReference?: string;
  reason?: string;
  notes?: string;
}

export interface ApproveRefundInput {
  notes?: string;
}

export interface RejectRefundInput {
  rejectionReason: string;
}

export interface ProcessRefundInput {
  txnReference?: string;
  refundedAmount?: number;
  refundedCurrency?: string;
  fxRateToBase?: number;
  notes?: string;
}

export interface VoidRefundInput {
  reason: string;
}

export interface AllocateRefundInput {
  allocations: CreateRefundAllocationInput[];
}

export interface RefundStatistics {
  total: number;
  totalAmount: number;
  byStatus: Record<RefundStatus | string, { count: number; totalAmount: number }>;
  byMethod: Record<RefundMethod | string, { count: number; totalAmount: number }>;
}
