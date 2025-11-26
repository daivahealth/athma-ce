import { PrismaService } from '@zeal/database-rcm';
import { CreateBillingItemDto, UpdateBillingItemDto, ItemType, ChargeType, BillingCodeType } from '../dto/billing-item.dto';
export declare class BillingItemService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string | null, dto: CreateBillingItemDto): Promise<{
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
    }>;
    findAll(tenantId: string | null, filters?: {
        itemType?: ItemType;
        chargeType?: ChargeType;
        billingCodeType?: BillingCodeType;
        isActive?: boolean;
        includeGlobal?: boolean;
    }): Promise<{
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
    }[]>;
    findById(tenantId: string | null, id: string): Promise<{
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
    }>;
    findByCode(tenantId: string | null, billingCodeType: BillingCodeType, billingCode: string): Promise<{
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
    } | null>;
    update(tenantId: string | null, id: string, dto: UpdateBillingItemDto): Promise<{
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
    }>;
    delete(tenantId: string | null, id: string): Promise<{
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
    }>;
    hardDelete(tenantId: string | null, id: string): Promise<{
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
    }>;
    getStatistics(tenantId: string | null): Promise<{
        total: number;
        active: number;
        inactive: number;
        byItemType: Record<string, number>;
        byChargeType: Record<string, number>;
    }>;
}
//# sourceMappingURL=billing-item.service.d.ts.map