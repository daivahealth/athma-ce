export declare enum ChargeStatus {
    UNBILLED = "unbilled",
    INVOICED = "invoiced",
    CANCELLED = "cancelled"
}
export declare enum ChargeSourceType {
    ENCOUNTER = "encounter",
    ORDER = "order",
    MANUAL = "manual"
}
export declare class CreateChargeDto {
    patientId: string;
    encounterId?: string;
    billingItemId: string;
    chargeDate?: Date;
    quantity?: number;
    unitPrice: number;
    grossAmount: number;
    patientResponsibility?: number;
    payerResponsibility?: number;
    status?: ChargeStatus;
    sourceType?: ChargeSourceType;
    sourceId?: string;
    notes?: string;
}
declare const UpdateChargeDto_base: import("@nestjs/common").Type<Partial<CreateChargeDto>>;
export declare class UpdateChargeDto extends UpdateChargeDto_base {
}
export interface ChargeResponseDto {
    id: string;
    tenantId: string;
    patientId: string;
    encounterId?: string | null;
    billingItemId: string;
    chargeDate: Date;
    quantity: number;
    unitPrice: number;
    grossAmount: number;
    patientResponsibility?: number | null;
    payerResponsibility?: number | null;
    status: ChargeStatus;
    sourceType?: ChargeSourceType | null;
    sourceId?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    billingItem?: any;
}
export {};
//# sourceMappingURL=charge.dto.d.ts.map