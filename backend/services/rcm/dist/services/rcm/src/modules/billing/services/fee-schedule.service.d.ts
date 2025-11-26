import { PrismaService } from '@zeal/database-rcm';
import { CreateFeeScheduleDto, UpdateFeeScheduleDto, CreateFeeScheduleItemDto, UpdateFeeScheduleItemDto, FeeScheduleCodeType, FeeScheduleQueryDto, FeeScheduleItemQueryDto, PriceLookupDto, PriceLookupResponseDto, BulkCreateFeeScheduleItemsDto } from '../dto/fee-schedule.dto';
export declare class FeeScheduleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createFeeSchedule(tenantId: string | null, dto: CreateFeeScheduleDto): Promise<{
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
    findAllFeeSchedules(tenantId: string | null, filters?: FeeScheduleQueryDto): Promise<({
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
    findFeeScheduleById(tenantId: string | null, id: string): Promise<{
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
    updateFeeSchedule(tenantId: string | null, id: string, dto: UpdateFeeScheduleDto): Promise<{
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
    deleteFeeSchedule(tenantId: string | null, id: string): Promise<{
        message: string;
    }>;
    createFeeScheduleItem(tenantId: string | null, dto: CreateFeeScheduleItemDto): Promise<{
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
    bulkCreateFeeScheduleItems(tenantId: string | null, dto: BulkCreateFeeScheduleItemsDto): Promise<{
        message: string;
    }>;
    findFeeScheduleItems(feeScheduleId: string, filters?: FeeScheduleItemQueryDto): Promise<({
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
    /**
     * Lookup price for a billing code with hierarchical fallback:
     * 1. Contract-specific fee schedule (if contract provided)
     * 2. Tenant-specific fee schedule
     * 3. Authority fee schedule
     * 4. Billing item catalog (fallback)
     */
    lookupPrice(tenantId: string | null, dto: PriceLookupDto): Promise<PriceLookupResponseDto | null>;
    /**
     * Get pricing for a billing code from the most specific applicable fee schedule
     */
    getPriceForCode(tenantId: string | null, code: string, codeType: FeeScheduleCodeType, effectiveDate?: Date): Promise<number | null>;
}
//# sourceMappingURL=fee-schedule.service.d.ts.map