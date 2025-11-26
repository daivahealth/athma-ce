import { BillingItemService } from '../services/billing-item.service';
import { CreateBillingItemDto, UpdateBillingItemDto, ItemType, ChargeType, BillingCodeType } from '../dto/billing-item.dto';
export declare class BillingItemController {
    private readonly billingItemService;
    constructor(billingItemService: BillingItemService);
    create(tenantId: string, dto: CreateBillingItemDto): Promise<{
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
    findAll(tenantId: string, itemType?: ItemType, chargeType?: ChargeType, billingCodeType?: BillingCodeType, isActive?: boolean, includeGlobal?: boolean): Promise<{
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
    getStatistics(tenantId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        byItemType: Record<string, number>;
        byChargeType: Record<string, number>;
    }>;
    findById(tenantId: string, id: string): Promise<{
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
    update(tenantId: string, id: string, dto: UpdateBillingItemDto): Promise<{
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
    delete(tenantId: string, id: string): Promise<{
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
    hardDelete(tenantId: string, id: string): Promise<{
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
}
//# sourceMappingURL=billing-item.controller.d.ts.map