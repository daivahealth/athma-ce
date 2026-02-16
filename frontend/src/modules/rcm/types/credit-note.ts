export type CreditNoteStatus = 'draft' | 'posted' | 'voided';

export interface CreditNoteLine {
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

export interface CreditNote {
  id: string;
  tenantId: string;
  creditNoteNumber: string;
  creditNoteDate: string;
  patientId: string;
  invoiceId?: string | null;
  amount: number;
  currency: string;
  reason?: string | null;
  notes?: string | null;
  status: CreditNoteStatus;
  mrn?: string | null;
  patientDisplayName?: string | null;
  patientDisplay?: PatientDisplay | null;
  createdAt: string;
  updatedAt: string;
  lines?: CreditNoteLine[];
}

export interface CreditNoteFilters {
  patientId?: string;
  invoiceId?: string;
  status?: CreditNoteStatus;
}

export interface CreateCreditNoteInput {
  patientId: string;
  invoiceId?: string;
  creditNoteDate?: string;
  amount: number;
  currency?: string;
  reason?: string;
  notes?: string;
  lines?: CreditNoteLine[];
}

export type UpdateCreditNoteInput = Partial<CreateCreditNoteInput>;

export interface VoidCreditNoteInput {
  reason: string;
}
