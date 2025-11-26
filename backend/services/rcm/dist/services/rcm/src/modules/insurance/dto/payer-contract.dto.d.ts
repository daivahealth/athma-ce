import { Decimal } from '@prisma/client/runtime/library';
export declare enum ContractType {
    FEE_FOR_SERVICE = "fee_for_service",
    CAPITATION = "capitation",
    BUNDLED = "bundled",
    VALUE_BASED = "value_based"
}
export declare enum ReimbursementMethod {
    PERCENTAGE_OF_TARIFF = "percentage_of_tariff",
    FIXED_RATE = "fixed_rate",
    PERCENTAGE_OF_CHARGES = "percentage_of_charges",
    PER_DIEM = "per_diem",
    CASE_RATE = "case_rate"
}
export declare enum ContractStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    DRAFT = "draft",
    SUSPENDED = "suspended"
}
export declare enum AuthorityCode {
    DHA = "DHA",
    DOH = "DOH",
    MOHAP = "MOHAP",
    HAAD = "HAAD"
}
export declare class CreatePayerContractDto {
    payerId: string;
    contractName: string;
    contractNumber?: string;
    authorityCode?: AuthorityCode;
    baseFeeScheduleId?: string;
    planCode?: string;
    networkType?: string;
    lineOfBusiness?: string;
    contractType?: ContractType;
    reimbursementMethod?: ReimbursementMethod;
    effectiveFrom: string;
    effectiveTo?: string;
    status?: ContractStatus;
    defaultMultiplier?: number;
    defaultDiscountPct?: number;
    defaultMaxAllowedAmount?: number;
    terms?: Record<string, any>;
    metadata?: Record<string, any>;
}
declare const UpdatePayerContractDto_base: import("@nestjs/common").Type<Partial<CreatePayerContractDto>>;
export declare class UpdatePayerContractDto extends UpdatePayerContractDto_base {
}
export interface PayerContractResponseDto {
    id: string;
    tenantId: string;
    payerId: string;
    contractName: string;
    contractNumber?: string | null;
    authorityCode?: string | null;
    baseFeeScheduleId?: string | null;
    planCode?: string | null;
    networkType?: string | null;
    lineOfBusiness?: string | null;
    contractType: string;
    reimbursementMethod: string;
    effectiveFrom: Date;
    effectiveTo?: Date | null;
    status: string;
    defaultMultiplier?: Decimal | null;
    defaultDiscountPct?: Decimal | null;
    defaultMaxAllowedAmount?: Decimal | null;
    terms?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
    payer?: any;
    baseFeeSchedule?: any;
    adjustments?: PayerContractAdjustmentResponseDto[];
}
export declare class CreatePayerContractAdjustmentDto {
    contractId: string;
    serviceGroup?: string;
    billingItemId?: string;
    feeScheduleItemId?: string;
    multiplier?: number;
    discountPct?: number;
    maxAllowedAmount?: number;
    minAllowedAmount?: number;
    priority?: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    isExclusion?: boolean;
    notes?: string;
}
declare const UpdatePayerContractAdjustmentDto_base: import("@nestjs/common").Type<Partial<CreatePayerContractAdjustmentDto>>;
export declare class UpdatePayerContractAdjustmentDto extends UpdatePayerContractAdjustmentDto_base {
}
export interface PayerContractAdjustmentResponseDto {
    id: string;
    contractId: string;
    serviceGroup?: string | null;
    billingItemId?: string | null;
    feeScheduleItemId?: string | null;
    multiplier?: Decimal | null;
    discountPct?: Decimal | null;
    maxAllowedAmount?: Decimal | null;
    minAllowedAmount?: Decimal | null;
    priority: number;
    effectiveFrom?: Date | null;
    effectiveTo?: Date | null;
    isExclusion: boolean;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
    contract?: any;
    billingItem?: any;
    feeScheduleItem?: any;
}
export declare class BulkCreatePayerContractAdjustmentsDto {
    contractId: string;
    adjustments: Omit<CreatePayerContractAdjustmentDto, 'contractId'>[];
}
export declare class PayerContractQueryDto {
    payerId?: string;
    status?: ContractStatus;
    contractType?: ContractType;
    authorityCode?: AuthorityCode;
    planCode?: string;
    networkType?: string;
    effectiveDate?: string;
}
export declare class PayerContractAdjustmentQueryDto {
    contractId?: string;
    serviceGroup?: string;
    billingItemId?: string;
    feeScheduleItemId?: string;
    effectiveDate?: string;
    includeExclusions?: boolean;
}
export declare class CalculateContractPriceDto {
    contractId: string;
    code: string;
    codeType: string;
    serviceGroup?: string;
    effectiveDate?: string;
}
export interface ContractPriceCalculationResponseDto {
    contractId: string;
    code: string;
    codeType: string;
    basePrice?: number | null;
    adjustedPrice: number;
    appliedAdjustments: {
        adjustmentId: string;
        type: 'multiplier' | 'discount' | 'cap' | 'floor' | 'exclusion';
        value: number;
        description: string;
    }[];
    effectiveDate: Date;
    currency: string;
}
export {};
//# sourceMappingURL=payer-contract.dto.d.ts.map