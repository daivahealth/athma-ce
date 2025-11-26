export declare enum InvoiceStatus {
    UNPAID = "unpaid",
    PARTIAL = "partial",
    PAID = "paid",
    CANCELLED = "cancelled"
}
export declare class InvoiceLineDto {
    chargeId: string;
    lineNumber: number;
    description?: string;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
    lineDiscount?: number;
}
export declare class CreateInvoiceDto {
    patientId: string;
    encounterId?: string;
    mrn?: string;
    patientDisplayName?: string;
    invoiceNumber: string;
    invoiceDate?: Date;
    dueDate?: Date;
    grossAmount: number;
    totalDiscounts?: number;
    netAmount: number;
    amountPaid?: number;
    balanceDue: number;
    status?: InvoiceStatus;
    currency?: string;
    invoiceLines: InvoiceLineDto[];
}
declare const UpdateInvoiceDto_base: import("@nestjs/common").Type<Partial<CreateInvoiceDto>>;
export declare class UpdateInvoiceDto extends UpdateInvoiceDto_base {
}
export declare class UpdateInvoiceStatusDto {
    status: InvoiceStatus;
}
export declare class RecordPaymentDto {
    amount: number;
    reference?: string;
}
export interface InvoiceLineResponseDto {
    id: string;
    invoiceId: string;
    chargeId: string;
    lineNumber: number;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
    lineDiscount: number;
    createdAt: Date;
    updatedAt: Date;
    charge?: any;
}
export interface InvoiceResponseDto {
    id: string;
    tenantId: string;
    patientId: string;
    encounterId?: string | null;
    mrn?: string | null;
    patientDisplayName?: string | null;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate?: Date | null;
    grossAmount: number;
    totalDiscounts: number;
    netAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: InvoiceStatus;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    invoiceLines?: InvoiceLineResponseDto[];
}
export {};
//# sourceMappingURL=invoice.dto.d.ts.map