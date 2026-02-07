export interface PatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  nationalId?: string;
  nationalIdType?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  preferredLanguage?: string;
}

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export interface InvoiceLine {
  id?: string;
  invoiceId?: string;
  chargeId: string;
  lineNumber: number;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  lineDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  patientId: string;
  mrn?: string | null;
  patientDisplayName?: string | null;
  encounterId?: string | null;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string | null;
  grossAmount: number;
  totalDiscounts: number;
  netAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  currency: string;
  createdAt: string;
  updatedAt: string;
  invoiceLines?: InvoiceLine[];
  patientDisplay?: PatientDisplay | null;
}

export interface InvoiceFilters {
  patientId?: string;
  encounterId?: string;
  status?: InvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface InvoiceStatistics {
  total: number;
  totalGrossAmount: number;
  totalDiscounts: number;
  totalNetAmount: number;
  totalAmountPaid: number;
  totalBalanceDue: number;
  byStatus: Record<InvoiceStatus | string, {
    count: number;
    netAmount: number;
    amountPaid: number;
    balanceDue: number;
  }>;
}

export interface CreateInvoiceLineInput {
  chargeId: string;
  lineNumber: number;
  description?: string;
  quantity: number;
  unitPrice: number;
  lineDiscount?: number;
  lineAmount: number;
}

export interface CreateInvoiceInput {
  patientId: string;
  mrn?: string;
  patientDisplayName?: string;
  encounterId?: string;
  invoiceNumber: string;
  invoiceDate?: string;
  dueDate?: string;
  grossAmount: number;
  totalDiscounts?: number;
  netAmount: number;
  amountPaid?: number;
  balanceDue: number;
  status?: InvoiceStatus;
  currency?: string;
  invoiceLines: CreateInvoiceLineInput[];
}

export type UpdateInvoiceInput = Partial<CreateInvoiceInput>;

export interface UpdateInvoiceStatusInput {
  status: InvoiceStatus;
}

export interface RecordPaymentInput {
  amount: number;
  reference?: string;
}
