export declare enum PayerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class CreatePayerDto {
    payerName: string;
    payerId?: string;
    payerType?: string;
    contactInfo?: Record<string, any>;
    configuration?: Record<string, any>;
    status?: PayerStatus;
}
declare const UpdatePayerDto_base: import("@nestjs/common").Type<Partial<CreatePayerDto>>;
export declare class UpdatePayerDto extends UpdatePayerDto_base {
}
export interface PayerResponseDto {
    id: string;
    tenantId: string;
    payerName: string;
    payerId?: string | null;
    payerType?: string | null;
    contactInfo?: Record<string, any>;
    configuration?: Record<string, any>;
    status: PayerStatus;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=payer.dto.d.ts.map