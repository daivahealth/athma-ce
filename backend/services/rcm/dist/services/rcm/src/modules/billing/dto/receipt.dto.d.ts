export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    UPI = "upi",
    BANK_TRANSFER = "bank_transfer",
    WALLET = "wallet"
}
export declare class ReceiptAllocationDto {
    invoiceId: string;
    allocatedAmount: number;
}
export declare class CreateReceiptDto {
    patientId: string;
    invoiceId?: string;
    mrn?: string;
    patientDisplayName?: string;
    receiptNumber: string;
    receiptDate?: Date;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    txnReference?: string;
    notes?: string;
    allocations?: ReceiptAllocationDto[];
}
declare const UpdateReceiptDto_base: import("@nestjs/common").Type<Partial<CreateReceiptDto>>;
export declare class UpdateReceiptDto extends UpdateReceiptDto_base {
}
export declare class AllocateReceiptDto {
    allocations: ReceiptAllocationDto[];
}
export interface ReceiptAllocationResponseDto {
    id: string;
    receiptId: string;
    invoiceId: string;
    allocatedAmount: number;
    createdAt: Date;
    invoice?: any;
}
export interface ReceiptResponseDto {
    id: string;
    tenantId: string;
    patientId: string;
    invoiceId?: string | null;
    mrn?: string | null;
    patientDisplayName?: string | null;
    receiptNumber: string;
    receiptDate: Date;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    txnReference?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    allocations?: ReceiptAllocationResponseDto[];
}
export {};
//# sourceMappingURL=receipt.dto.d.ts.map