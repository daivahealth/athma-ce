export declare enum FeeScheduleType {
    AUTHORITY = "authority",
    TENANT = "tenant",
    CONTRACT = "contract"
}
export declare enum FeeScheduleStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DRAFT = "draft",
    EXPIRED = "expired"
}
export declare enum AuthorityCode {
    DHA = "DHA",
    DOH = "DOH",
    MOHAP = "MOHAP",
    HAAD = "HAAD"
}
export declare enum FeeScheduleCodeType {
    INTERNAL = "INTERNAL",
    CPT = "CPT",
    DHA = "DHA",
    DOH = "DOH",
    HAAD = "HAAD",
    MOHAP = "MOHAP",
    LOINC = "LOINC",
    ICD10 = "ICD10",
    CUSTOM = "CUSTOM"
}
export declare class CreateFeeScheduleDto {
    tenantId?: string;
    scheduleName: string;
    scheduleType: FeeScheduleType;
    authorityCode?: AuthorityCode;
    version?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    status?: FeeScheduleStatus;
    baseFeeScheduleId?: string;
    metadata?: Record<string, any>;
}
declare const UpdateFeeScheduleDto_base: import("@nestjs/common").Type<Partial<CreateFeeScheduleDto>>;
export declare class UpdateFeeScheduleDto extends UpdateFeeScheduleDto_base {
}
export interface FeeScheduleResponseDto {
    id: string;
    tenantId?: string | null;
    scheduleName: string;
    scheduleType: FeeScheduleType;
    authorityCode?: string | null;
    version?: string | null;
    effectiveFrom: Date;
    effectiveTo?: Date | null;
    status: FeeScheduleStatus;
    baseFeeScheduleId?: string | null;
    metadata?: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    baseFeeSchedule?: FeeScheduleResponseDto | null;
    feeScheduleItems?: FeeScheduleItemResponseDto[];
}
export declare class CreateFeeScheduleItemDto {
    feeScheduleId: string;
    billingItemId?: string;
    code: string;
    codeType: FeeScheduleCodeType;
    baseAmount: number;
    currency?: string;
    unit?: string;
    multiplier?: number;
    discountPct?: number;
    maxAllowedAmount?: number;
    serviceGroup?: string;
    priority?: number;
}
declare const UpdateFeeScheduleItemDto_base: import("@nestjs/common").Type<Partial<CreateFeeScheduleItemDto>>;
export declare class UpdateFeeScheduleItemDto extends UpdateFeeScheduleItemDto_base {
}
export interface FeeScheduleItemResponseDto {
    id: string;
    feeScheduleId: string;
    billingItemId?: string | null;
    code: string;
    codeType: FeeScheduleCodeType;
    baseAmount: number;
    currency: string;
    unit?: string | null;
    multiplier?: number | null;
    discountPct?: number | null;
    maxAllowedAmount?: number | null;
    serviceGroup?: string | null;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    feeSchedule?: FeeScheduleResponseDto;
}
export declare class BulkCreateFeeScheduleItemsDto {
    feeScheduleId: string;
    items: Omit<CreateFeeScheduleItemDto, 'feeScheduleId'>[];
}
export declare class FeeScheduleQueryDto {
    scheduleType?: FeeScheduleType;
    status?: FeeScheduleStatus;
    authorityCode?: AuthorityCode;
    effectiveDate?: Date;
}
export declare class FeeScheduleItemQueryDto {
    code?: string;
    codeType?: FeeScheduleCodeType;
    serviceGroup?: string;
}
export declare class PriceLookupDto {
    code: string;
    codeType: FeeScheduleCodeType;
    feeScheduleId?: string;
    lookupDate?: Date;
}
export interface PriceLookupResponseDto {
    code: string;
    codeType: FeeScheduleCodeType;
    baseAmount: number;
    effectiveAmount: number;
    currency: string;
    feeSchedule: {
        id: string;
        scheduleName: string;
        scheduleType: FeeScheduleType;
        authorityCode?: string | null;
    };
    feeScheduleItem: FeeScheduleItemResponseDto;
}
export {};
//# sourceMappingURL=fee-schedule.dto.d.ts.map