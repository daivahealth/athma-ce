export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  UPI = 'upi',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

export interface ReceiptAllocation {
  id?: string;
  receiptId?: string;
  invoiceId: string;
  allocatedAmount: number;
  createdAt?: string;
}

export interface Receipt {
  id: string;
  tenantId: string;
  patientId: string;
  invoiceId?: string | null;
  receiptNumber: string;
  receiptDate: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  txnReference?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  allocations?: ReceiptAllocation[];
}

export interface ReceiptFilters {
  patientId?: string;
  invoiceId?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateReceiptAllocationInput {
  invoiceId: string;
  allocatedAmount: number;
}

export interface CreateReceiptInput {
  patientId: string;
  invoiceId?: string;
  receiptNumber: string;
  receiptDate?: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  txnReference?: string;
  notes?: string;
  allocations?: CreateReceiptAllocationInput[];
}

export type UpdateReceiptInput = Partial<CreateReceiptInput>;

export interface AllocateReceiptInput {
  allocations: CreateReceiptAllocationInput[];
}

export interface ReceiptStatistics {
  total: number;
  byPaymentMethod: Record<PaymentMethod | string, number>;
}
