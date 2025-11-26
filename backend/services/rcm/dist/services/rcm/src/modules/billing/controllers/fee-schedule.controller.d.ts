import { FeeScheduleService } from '../services/fee-schedule.service';
import { CreateFeeScheduleDto, UpdateFeeScheduleDto, CreateFeeScheduleItemDto, UpdateFeeScheduleItemDto, FeeScheduleType, FeeScheduleStatus, AuthorityCode, FeeScheduleCodeType, PriceLookupDto, BulkCreateFeeScheduleItemsDto } from '../dto/fee-schedule.dto';
export declare class FeeScheduleController {
    private readonly feeScheduleService;
    constructor(feeScheduleService: FeeScheduleService);
    createFeeSchedule(tenantId: string, dto: CreateFeeScheduleDto): Promise<{
        baseFeeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        } | null;
        feeScheduleItems: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string | null;
            multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            priority: number;
            code: string;
            codeType: string;
            feeScheduleId: string;
            baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            currency: string;
            unit: string | null;
        }[];
    } & {
        status: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        updatedAt: Date;
        authorityCode: string | null;
        baseFeeScheduleId: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        scheduleName: string;
        scheduleType: string;
        version: string | null;
    }>;
    findAllFeeSchedules(tenantId: string, scheduleType?: FeeScheduleType, status?: FeeScheduleStatus, authorityCode?: AuthorityCode, effectiveDate?: string): Promise<({
        baseFeeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        } | null;
        feeScheduleItems: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string | null;
            multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            priority: number;
            code: string;
            codeType: string;
            feeScheduleId: string;
            baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            currency: string;
            unit: string | null;
        }[];
    } & {
        status: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        updatedAt: Date;
        authorityCode: string | null;
        baseFeeScheduleId: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        scheduleName: string;
        scheduleType: string;
        version: string | null;
    })[]>;
    findFeeScheduleById(tenantId: string, id: string): Promise<{
        baseFeeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        } | null;
        derivedFeeSchedules: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        }[];
        feeScheduleItems: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string | null;
            multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            priority: number;
            code: string;
            codeType: string;
            feeScheduleId: string;
            baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            currency: string;
            unit: string | null;
        }[];
    } & {
        status: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        updatedAt: Date;
        authorityCode: string | null;
        baseFeeScheduleId: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        scheduleName: string;
        scheduleType: string;
        version: string | null;
    }>;
    updateFeeSchedule(tenantId: string, id: string, dto: UpdateFeeScheduleDto): Promise<{
        baseFeeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        } | null;
        feeScheduleItems: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string | null;
            multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            priority: number;
            code: string;
            codeType: string;
            feeScheduleId: string;
            baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            currency: string;
            unit: string | null;
        }[];
    } & {
        status: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        updatedAt: Date;
        authorityCode: string | null;
        baseFeeScheduleId: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        scheduleName: string;
        scheduleType: string;
        version: string | null;
    }>;
    deleteFeeSchedule(tenantId: string, id: string): Promise<{
        message: string;
    }>;
    createFeeScheduleItem(tenantId: string, dto: CreateFeeScheduleItemDto): Promise<{
        feeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        };
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string | null;
        multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        priority: number;
        code: string;
        codeType: string;
        feeScheduleId: string;
        baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        currency: string;
        unit: string | null;
    }>;
    bulkCreateFeeScheduleItems(tenantId: string, dto: BulkCreateFeeScheduleItemsDto): Promise<{
        message: string;
    }>;
    findFeeScheduleItems(feeScheduleId: string, code?: string, codeType?: FeeScheduleCodeType, serviceGroup?: string): Promise<({
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string | null;
        multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        priority: number;
        code: string;
        codeType: string;
        feeScheduleId: string;
        baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        currency: string;
        unit: string | null;
    })[]>;
    findFeeScheduleItemById(id: string): Promise<{
        feeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        };
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string | null;
        multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        priority: number;
        code: string;
        codeType: string;
        feeScheduleId: string;
        baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        currency: string;
        unit: string | null;
    }>;
    updateFeeScheduleItem(id: string, dto: UpdateFeeScheduleItemDto): Promise<{
        feeSchedule: {
            status: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            authorityCode: string | null;
            baseFeeScheduleId: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            metadata: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
            scheduleName: string;
            scheduleType: string;
            version: string | null;
        };
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string | null;
        multiplier: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        discountPct: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        maxAllowedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        priority: number;
        code: string;
        codeType: string;
        feeScheduleId: string;
        baseAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        currency: string;
        unit: string | null;
    }>;
    deleteFeeScheduleItem(id: string): Promise<{
        message: string;
    }>;
    lookupPrice(tenantId: string, dto: PriceLookupDto): Promise<import("../dto/fee-schedule.dto").PriceLookupResponseDto | {
        message: string;
        code: string;
        codeType: FeeScheduleCodeType;
    }>;
    getPriceForCode(tenantId: string, codeType: FeeScheduleCodeType, code: string, effectiveDate?: string): Promise<{
        message: string;
        code: string;
        codeType: FeeScheduleCodeType;
        price: null;
        currency?: never;
    } | {
        code: string;
        codeType: FeeScheduleCodeType;
        price: number;
        currency: string;
        message?: never;
    }>;
}
//# sourceMappingURL=fee-schedule.controller.d.ts.map