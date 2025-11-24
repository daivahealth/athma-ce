import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  CreateBillingItemDto,
  UpdateBillingItemDto,
  ItemType,
  ChargeType,
  BillingCodeType,
} from '../dto/billing-item.dto';

@Injectable()
export class BillingItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string | null, dto: CreateBillingItemDto) {
    // For tenant-scoped items, use the provided tenantId from header
    // For global items, dto.tenantId should be null
    const finalTenantId = dto.tenantId === undefined ? tenantId : dto.tenantId;

    const data: any = {
      tenantId: finalTenantId,
      itemType: dto.itemType,
      clinicalRefId: dto.clinicalRefId ?? null,
      billingCode: dto.billingCode,
      billingCodeType: dto.billingCodeType,
      billingDescription: dto.billingDescription,
      chargeType: dto.chargeType,
      defaultUnit: dto.defaultUnit ?? 'each',
      listPrice: dto.listPrice ?? null,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    };

    return this.prisma.billingItem.create({
      data,
    });
  }

  async findAll(
    tenantId: string | null,
    filters?: {
      itemType?: ItemType;
      chargeType?: ChargeType;
      billingCodeType?: BillingCodeType;
      isActive?: boolean;
      includeGlobal?: boolean; // Whether to include global items (tenantId = null)
    },
  ) {
    const where: any = {};

    // If includeGlobal is true, include both tenant-specific and global items
    // Otherwise, only items for this tenant
    if (filters?.includeGlobal && tenantId) {
      where.OR = [{ tenantId }, { tenantId: null }];
    } else {
      where.tenantId = tenantId;
    }

    if (filters?.itemType) {
      where.itemType = filters.itemType;
    }
    if (filters?.chargeType) {
      where.chargeType = filters.chargeType;
    }
    if (filters?.billingCodeType) {
      where.billingCodeType = filters.billingCodeType;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.billingItem.findMany({
      where,
      orderBy: {
        billingDescription: 'asc',
      },
    });
  }

  async findById(tenantId: string | null, id: string) {
    const item = await this.prisma.billingItem.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { tenantId: null }], // Can retrieve global or tenant items
      },
    });

    if (!item) {
      throw new NotFoundException(`Billing item with ID ${id} not found`);
    }

    return item;
  }

  async findByCode(
    tenantId: string | null,
    billingCodeType: BillingCodeType,
    billingCode: string,
  ) {
    return this.prisma.billingItem.findFirst({
      where: {
        billingCodeType,
        billingCode,
        OR: [{ tenantId }, { tenantId: null }],
      },
    });
  }

  async update(tenantId: string | null, id: string, dto: UpdateBillingItemDto) {
    // Verify item exists and belongs to tenant (or is global)
    await this.findById(tenantId, id);

    const data: any = {};
    if (dto.itemType !== undefined) data.itemType = dto.itemType;
    if (dto.clinicalRefId !== undefined) data.clinicalRefId = dto.clinicalRefId ?? null;
    if (dto.billingCode !== undefined) data.billingCode = dto.billingCode;
    if (dto.billingCodeType !== undefined) data.billingCodeType = dto.billingCodeType;
    if (dto.billingDescription !== undefined) data.billingDescription = dto.billingDescription;
    if (dto.chargeType !== undefined) data.chargeType = dto.chargeType;
    if (dto.defaultUnit !== undefined) data.defaultUnit = dto.defaultUnit;
    if (dto.listPrice !== undefined) data.listPrice = dto.listPrice ?? null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.billingItem.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string | null, id: string) {
    // Verify item exists and belongs to tenant (or is global)
    await this.findById(tenantId, id);

    // Soft delete by setting isActive to false
    return this.prisma.billingItem.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async hardDelete(tenantId: string | null, id: string) {
    // Verify item exists and belongs to tenant (or is global)
    await this.findById(tenantId, id);

    return this.prisma.billingItem.delete({
      where: { id },
    });
  }

  async getStatistics(tenantId: string | null) {
    const where: any = {
      OR: [{ tenantId }, { tenantId: null }],
    };

    const [total, byItemType, byChargeType, active, inactive] = await Promise.all([
      this.prisma.billingItem.count({ where }),
      this.prisma.billingItem.groupBy({
        by: ['itemType'],
        where,
        _count: true,
      }),
      this.prisma.billingItem.groupBy({
        by: ['chargeType'],
        where,
        _count: true,
      }),
      this.prisma.billingItem.count({ where: { ...where, isActive: true } }),
      this.prisma.billingItem.count({ where: { ...where, isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
      byItemType: byItemType.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.itemType] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byChargeType: byChargeType.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.chargeType] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
