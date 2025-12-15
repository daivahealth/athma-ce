import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { Decimal } from '@prisma/client/runtime/library';
import {
  CreateFeeScheduleDto,
  UpdateFeeScheduleDto,
  CreateFeeScheduleItemDto,
  UpdateFeeScheduleItemDto,
  FeeScheduleType,
  FeeScheduleStatus,
  FeeScheduleCodeType,
  FeeScheduleQueryDto,
  FeeScheduleItemQueryDto,
  PriceLookupDto,
  PriceLookupResponseDto,
  BulkCreateFeeScheduleItemsDto,
} from '../dto/fee-schedule.dto';

@Injectable()
export class FeeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== FEE SCHEDULE CRUD ====================

  async createFeeSchedule(tenantId: string | null, dto: CreateFeeScheduleDto) {
    const finalTenantId = dto.tenantId === undefined ? tenantId : dto.tenantId;

    // Validate: Authority schedules must have null tenantId
    if (dto.scheduleType === FeeScheduleType.AUTHORITY && finalTenantId !== null) {
      throw new BadRequestException('Authority fee schedules must have null tenantId');
    }

    // Validate: Authority schedules must have authorityCode
    if (dto.scheduleType === FeeScheduleType.AUTHORITY && !dto.authorityCode) {
      throw new BadRequestException('Authority fee schedules must have an authorityCode');
    }

    // Validate: effectiveTo must be after effectiveFrom
    if (dto.effectiveTo && dto.effectiveTo <= dto.effectiveFrom) {
      throw new BadRequestException('effectiveTo must be after effectiveFrom');
    }

    // Validate: baseFeeScheduleId exists if provided
    if (dto.baseFeeScheduleId) {
      const baseSchedule = await this.prisma.feeSchedule.findUnique({
        where: { id: dto.baseFeeScheduleId },
      });
      if (!baseSchedule) {
        throw new NotFoundException(`Base fee schedule ${dto.baseFeeScheduleId} not found`);
      }
    }

    return this.prisma.feeSchedule.create({
      data: {
        tenantId: finalTenantId,
        scheduleName: dto.scheduleName,
        scheduleType: dto.scheduleType,
        authorityCode: dto.authorityCode ?? null,
        version: dto.version ?? null,
        effectiveFrom: dto.effectiveFrom,
        effectiveTo: dto.effectiveTo ?? null,
        status: dto.status ?? FeeScheduleStatus.ACTIVE,
        baseFeeScheduleId: dto.baseFeeScheduleId ?? null,
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
      },
      include: {
        baseFeeSchedule: true,
        feeScheduleItems: true,
      },
    });
  }

  async findAllFeeSchedules(tenantId: string | null, filters?: FeeScheduleQueryDto) {
    const where: any = {};

    // Build AND conditions
    const andConditions: any[] = [];

    // Include authority schedules (tenantId = null) and tenant-specific schedules
    if (tenantId) {
      andConditions.push({
        OR: [{ tenantId }, { tenantId: null }],
      });
    } else {
      where.tenantId = null; // Only global schedules
    }

    if (filters?.scheduleType) {
      where.scheduleType = filters.scheduleType;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.authorityCode) {
      where.authorityCode = filters.authorityCode;
    }

    // Filter by effective date (find schedules active on this date)
    if (filters?.effectiveDate) {
      where.effectiveFrom = { lte: filters.effectiveDate };
      andConditions.push({
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: filters.effectiveDate } },
        ],
      });
    }

    // Combine AND conditions if any exist
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return this.prisma.feeSchedule.findMany({
      where,
      include: {
        baseFeeSchedule: true,
        feeScheduleItems: {
          take: 10, // Limit items in list view
          orderBy: { code: 'asc' },
        },
      },
      orderBy: [
        { scheduleType: 'asc' }, // authority first, then tenant, then contract
        { effectiveFrom: 'desc' }, // Newest first
      ],
    });
  }

  async findFeeScheduleById(tenantId: string | null, id: string) {
    const schedule = await this.prisma.feeSchedule.findFirst({
      where: {
        id,
        OR: tenantId ? [{ tenantId }, { tenantId: null }] : [{ tenantId: null }],
      },
      include: {
        baseFeeSchedule: true,
        derivedFeeSchedules: true,
        feeScheduleItems: {
          orderBy: { code: 'asc' },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Fee schedule ${id} not found`);
    }

    return schedule;
  }

  async updateFeeSchedule(tenantId: string | null, id: string, dto: UpdateFeeScheduleDto) {
    // Check if schedule exists and tenant has access
    await this.findFeeScheduleById(tenantId, id);

    // Validate: effectiveTo must be after effectiveFrom
    if (dto.effectiveTo && dto.effectiveFrom && dto.effectiveTo <= dto.effectiveFrom) {
      throw new BadRequestException('effectiveTo must be after effectiveFrom');
    }

    const data: any = {};
    if (dto.scheduleName !== undefined) data.scheduleName = dto.scheduleName;
    if (dto.scheduleType !== undefined) data.scheduleType = dto.scheduleType;
    if (dto.authorityCode !== undefined) data.authorityCode = dto.authorityCode;
    if (dto.version !== undefined) data.version = dto.version;
    if (dto.effectiveFrom !== undefined) data.effectiveFrom = dto.effectiveFrom;
    if (dto.effectiveTo !== undefined) data.effectiveTo = dto.effectiveTo;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.baseFeeScheduleId !== undefined) data.baseFeeScheduleId = dto.baseFeeScheduleId;
    if (dto.metadata !== undefined) data.metadata = dto.metadata;

    return this.prisma.feeSchedule.update({
      where: { id },
      data,
      include: {
        baseFeeSchedule: true,
        feeScheduleItems: {
          orderBy: { code: 'asc' },
        },
      },
    });
  }

  async deleteFeeSchedule(tenantId: string | null, id: string) {
    // Check if schedule exists and tenant has access
    await this.findFeeScheduleById(tenantId, id);

    // Check if this schedule is used as a base for other schedules
    const derivedSchedules = await this.prisma.feeSchedule.count({
      where: { baseFeeScheduleId: id },
    });

    if (derivedSchedules > 0) {
      throw new BadRequestException(
        `Cannot delete fee schedule ${id}. It is used as base for ${derivedSchedules} other schedule(s)`,
      );
    }

    await this.prisma.feeSchedule.delete({
      where: { id },
    });

    return { message: 'Fee schedule deleted successfully' };
  }

  // ==================== FEE SCHEDULE ITEM CRUD ====================

  async createFeeScheduleItem(tenantId: string | null, dto: CreateFeeScheduleItemDto) {
    // Verify fee schedule exists and tenant has access
    await this.findFeeScheduleById(tenantId, dto.feeScheduleId);

    // Verify billing item exists if provided
    if (dto.billingItemId) {
      const billingItem = await this.prisma.billingItem.findUnique({
        where: { id: dto.billingItemId },
      });
      if (!billingItem) {
        throw new NotFoundException(`Billing item ${dto.billingItemId} not found`);
      }
    }

    return this.prisma.feeScheduleItem.create({
      data: {
        feeScheduleId: dto.feeScheduleId,
        billingItemId: dto.billingItemId ?? null,
        code: dto.code,
        codeType: dto.codeType,
        baseAmount: new Decimal(dto.baseAmount),
        currency: dto.currency ?? 'AED',
        unit: dto.unit ?? null,
        multiplier: dto.multiplier ? new Decimal(dto.multiplier) : null,
        discountPct: dto.discountPct ? new Decimal(dto.discountPct) : null,
        maxAllowedAmount: dto.maxAllowedAmount ? new Decimal(dto.maxAllowedAmount) : null,
        serviceGroup: dto.serviceGroup ?? null,
        priority: dto.priority ?? 100,
      },
      include: {
        feeSchedule: true,
        billingItem: true,
      },
    });
  }

  async bulkCreateFeeScheduleItems(tenantId: string | null, dto: BulkCreateFeeScheduleItemsDto) {
    // Verify fee schedule exists and tenant has access
    await this.findFeeScheduleById(tenantId, dto.feeScheduleId);

    const items = dto.items.map((item) => ({
      feeScheduleId: dto.feeScheduleId,
      billingItemId: item.billingItemId ?? null,
      code: item.code,
      codeType: item.codeType,
      baseAmount: new Decimal(item.baseAmount),
      currency: item.currency ?? 'AED',
      unit: item.unit ?? null,
      multiplier: item.multiplier ? new Decimal(item.multiplier) : null,
      discountPct: item.discountPct ? new Decimal(item.discountPct) : null,
      maxAllowedAmount: item.maxAllowedAmount ? new Decimal(item.maxAllowedAmount) : null,
      serviceGroup: item.serviceGroup ?? null,
      priority: item.priority ?? 100,
    }));

    await this.prisma.feeScheduleItem.createMany({
      data: items,
      skipDuplicates: true, // Skip if unique constraint violated
    });

    return { message: `${items.length} fee schedule items created successfully` };
  }

  async findFeeScheduleItems(feeScheduleId: string, filters?: FeeScheduleItemQueryDto) {
    const where: any = { feeScheduleId };

    if (filters?.code) {
      where.code = { contains: filters.code, mode: 'insensitive' };
    }

    if (filters?.codeType) {
      where.codeType = filters.codeType;
    }

    if (filters?.serviceGroup) {
      where.serviceGroup = filters.serviceGroup;
    }

    return this.prisma.feeScheduleItem.findMany({
      where,
      include: {
        billingItem: true,
      },
      orderBy: [
        { priority: 'asc' },
        { code: 'asc' },
      ],
    });
  }

  async findFeeScheduleItemById(id: string) {
    const item = await this.prisma.feeScheduleItem.findUnique({
      where: { id },
      include: {
        feeSchedule: true,
        billingItem: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Fee schedule item ${id} not found`);
    }

    return item;
  }

  async updateFeeScheduleItem(id: string, dto: UpdateFeeScheduleItemDto) {
    // Check if item exists
    await this.findFeeScheduleItemById(id);

    const data: any = {};
    if (dto.billingItemId !== undefined) data.billingItemId = dto.billingItemId;
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.codeType !== undefined) data.codeType = dto.codeType;
    if (dto.baseAmount !== undefined) data.baseAmount = new Decimal(dto.baseAmount);
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.unit !== undefined) data.unit = dto.unit;
    if (dto.multiplier !== undefined) data.multiplier = dto.multiplier ? new Decimal(dto.multiplier) : null;
    if (dto.discountPct !== undefined) data.discountPct = dto.discountPct ? new Decimal(dto.discountPct) : null;
    if (dto.maxAllowedAmount !== undefined) data.maxAllowedAmount = dto.maxAllowedAmount ? new Decimal(dto.maxAllowedAmount) : null;
    if (dto.serviceGroup !== undefined) data.serviceGroup = dto.serviceGroup;
    if (dto.priority !== undefined) data.priority = dto.priority;

    return this.prisma.feeScheduleItem.update({
      where: { id },
      data,
      include: {
        feeSchedule: true,
        billingItem: true,
      },
    });
  }

  async deleteFeeScheduleItem(id: string) {
    await this.findFeeScheduleItemById(id);

    await this.prisma.feeScheduleItem.delete({
      where: { id },
    });

    return { message: 'Fee schedule item deleted successfully' };
  }

  // ==================== PRICE LOOKUP & HIERARCHICAL RESOLUTION ====================

  /**
   * Lookup price for a billing code with hierarchical fallback:
   * 1. Contract-specific fee schedule (if contract provided)
   * 2. Tenant-specific fee schedule
   * 3. Authority fee schedule
   * 4. Billing item catalog (fallback)
   */
  async lookupPrice(
    tenantId: string | null,
    dto: PriceLookupDto,
  ): Promise<PriceLookupResponseDto | null> {
    const lookupDate = dto.lookupDate ?? new Date();

    // Find all applicable fee schedules for this tenant (contract, tenant, authority)
    const feeSchedules = await this.prisma.feeSchedule.findMany({
      where: {
        AND: [
          {
            OR: [
              { tenantId }, // Tenant or contract specific
              { tenantId: null }, // Authority schedules
            ],
          },
          {
            status: FeeScheduleStatus.ACTIVE,
            effectiveFrom: { lte: lookupDate },
          },
          {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gte: lookupDate } },
            ],
          },
        ],
      },
      include: {
        feeScheduleItems: {
          where: {
            code: dto.code,
            codeType: dto.codeType,
          },
          orderBy: { priority: 'asc' },
        },
      },
      orderBy: [
        { scheduleType: 'desc' }, // contract > tenant > authority
        { effectiveFrom: 'desc' }, // Newest first
      ],
    });

    // If specific fee schedule requested, filter to that one
    let filteredSchedules = feeSchedules;
    if (dto.feeScheduleId) {
      filteredSchedules = feeSchedules.filter(fs => fs.id === dto.feeScheduleId);
    }

    // Find first matching item across all applicable schedules
    for (const schedule of filteredSchedules) {
      const item = schedule.feeScheduleItems[0];
      if (item) {
        // Calculate effective amount
        let effectiveAmount = new Decimal(item.baseAmount);

        // Apply multiplier if present
        if (item.multiplier) {
          effectiveAmount = effectiveAmount.times(new Decimal(item.multiplier));
        }

        // Apply discount if present
        if (item.discountPct) {
          const discountAmount = effectiveAmount.times(new Decimal(item.discountPct)).dividedBy(100);
          effectiveAmount = effectiveAmount.minus(discountAmount);
        }

        // Apply max allowed amount cap
        if (item.maxAllowedAmount) {
          const maxAmount = new Decimal(item.maxAllowedAmount);
          if (effectiveAmount.greaterThan(maxAmount)) {
            effectiveAmount = maxAmount;
          }
        }

        return {
          code: item.code,
          codeType: item.codeType as FeeScheduleCodeType,
          baseAmount: parseFloat(item.baseAmount.toString()),
          effectiveAmount: parseFloat(effectiveAmount.toString()),
          currency: item.currency,
          feeSchedule: {
            id: schedule.id,
            scheduleName: schedule.scheduleName,
            scheduleType: schedule.scheduleType as FeeScheduleType,
            authorityCode: schedule.authorityCode,
          },
          feeScheduleItem: {
            id: item.id,
            feeScheduleId: item.feeScheduleId,
            billingItemId: item.billingItemId,
            code: item.code,
            codeType: item.codeType as FeeScheduleCodeType,
            baseAmount: parseFloat(item.baseAmount.toString()),
            currency: item.currency,
            unit: item.unit,
            multiplier: item.multiplier ? parseFloat(item.multiplier.toString()) : null,
            discountPct: item.discountPct ? parseFloat(item.discountPct.toString()) : null,
            maxAllowedAmount: item.maxAllowedAmount ? parseFloat(item.maxAllowedAmount.toString()) : null,
            serviceGroup: item.serviceGroup,
            priority: item.priority,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
        };
      }
    }

    // No fee schedule found - prices must come from fee schedules only
    // Billing items no longer have listPrice field
    return null;
  }

  /**
   * Get pricing for a billing code from the most specific applicable fee schedule
   */
  async getPriceForCode(
    tenantId: string | null,
    code: string,
    codeType: FeeScheduleCodeType,
    effectiveDate?: Date,
  ): Promise<number | null> {
    const result = await this.lookupPrice(tenantId, {
      code,
      codeType,
      ...(effectiveDate && { lookupDate: effectiveDate }),
    });

    return result ? result.effectiveAmount : null;
  }
}
