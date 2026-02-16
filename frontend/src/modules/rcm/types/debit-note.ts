export type DebitNoteStatus = 'draft' | 'posted' | 'voided';

export interface DebitNoteLine {
  id?: string;
  lineNumber: number;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  lineAmount: number;
}

export interface PatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
}

export interface DebitNote {
  id: string;
  tenantId: string;
  debitNoteNumber: string;
  debitNoteDate: string;
  patientId: string;
  invoiceId?: string | null;
  amount: number;
  currency: string;
  reason?: string | null;
  notes?: string | null;
  status: DebitNoteStatus;
  mrn?: string | null;
  patientDisplayName?: string | null;
  patientDisplay?: PatientDisplay | null;
  createdAt: string;
  updatedAt: string;
  lines?: DebitNoteLine[];
}

export interface DebitNoteFilters {
  patientId?: string;
  invoiceId?: string;
  status?: DebitNoteStatus;
}

export interface CreateDebitNoteInput {
  patientId: string;
  invoiceId?: string;
  debitNoteDate?: string;
  amount: number;
  currency?: string;
  reason?: string;
  notes?: string;
  lines?: DebitNoteLine[];
}

export type UpdateDebitNoteInput = Partial<CreateDebitNoteInput>;

export interface VoidDebitNoteInput {
  reason: string;
}
