"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeScheduleService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
const library_1 = require("@prisma/client/runtime/library");
const fee_schedule_dto_1 = require("../dto/fee-schedule.dto");
let FeeScheduleService = class FeeScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ==================== FEE SCHEDULE CRUD ====================
    async createFeeSchedule(tenantId, dto) {
        const finalTenantId = dto.tenantId === undefined ? tenantId : dto.tenantId;
        // Validate: Authority schedules must have null tenantId
        if (dto.scheduleType === fee_schedule_dto_1.FeeScheduleType.AUTHORITY && finalTenantId !== null) {
            throw new common_1.BadRequestException('Authority fee schedules must have null tenantId');
        }
        // Validate: Authority schedules must have authorityCode
        if (dto.scheduleType === fee_schedule_dto_1.FeeScheduleType.AUTHORITY && !dto.authorityCode) {
            throw new common_1.BadRequestException('Authority fee schedules must have an authorityCode');
        }
        // Validate: effectiveTo must be after effectiveFrom
        if (dto.effectiveTo && dto.effectiveTo <= dto.effectiveFrom) {
            throw new common_1.BadRequestException('effectiveTo must be after effectiveFrom');
        }
        // Validate: baseFeeScheduleId exists if provided
        if (dto.baseFeeScheduleId) {
            const baseSchedule = await this.prisma.feeSchedule.findUnique({
                where: { id: dto.baseFeeScheduleId },
            });
            if (!baseSchedule) {
                throw new common_1.NotFoundException(`Base fee schedule ${dto.baseFeeScheduleId} not found`);
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
                status: dto.status ?? fee_schedule_dto_1.FeeScheduleStatus.ACTIVE,
                baseFeeScheduleId: dto.baseFeeScheduleId ?? null,
                ...(dto.metadata !== undefined && { metadata: dto.metadata }),
            },
            include: {
                baseFeeSchedule: true,
                feeScheduleItems: true,
            },
        });
    }
    async findAllFeeSchedules(tenantId, filters) {
        const where = {};
        // Build AND conditions
        const andConditions = [];
        // Include authority schedules (tenantId = null) and tenant-specific schedules
        if (tenantId) {
            andConditions.push({
                OR: [{ tenantId }, { tenantId: null }],
            });
        }
        else {
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
    async findFeeScheduleById(tenantId, id) {
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
            throw new common_1.NotFoundException(`Fee schedule ${id} not found`);
        }
        return schedule;
    }
    async updateFeeSchedule(tenantId, id, dto) {
        // Check if schedule exists and tenant has access
        await this.findFeeScheduleById(tenantId, id);
        // Validate: effectiveTo must be after effectiveFrom
        if (dto.effectiveTo && dto.effectiveFrom && dto.effectiveTo <= dto.effectiveFrom) {
            throw new common_1.BadRequestException('effectiveTo must be after effectiveFrom');
        }
        const data = {};
        if (dto.scheduleName !== undefined)
            data.scheduleName = dto.scheduleName;
        if (dto.scheduleType !== undefined)
            data.scheduleType = dto.scheduleType;
        if (dto.authorityCode !== undefined)
            data.authorityCode = dto.authorityCode;
        if (dto.version !== undefined)
            data.version = dto.version;
        if (dto.effectiveFrom !== undefined)
            data.effectiveFrom = dto.effectiveFrom;
        if (dto.effectiveTo !== undefined)
            data.effectiveTo = dto.effectiveTo;
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.baseFeeScheduleId !== undefined)
            data.baseFeeScheduleId = dto.baseFeeScheduleId;
        if (dto.metadata !== undefined)
            data.metadata = dto.metadata;
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
    async deleteFeeSchedule(tenantId, id) {
        // Check if schedule exists and tenant has access
        await this.findFeeScheduleById(tenantId, id);
        // Check if this schedule is used as a base for other schedules
        const derivedSchedules = await this.prisma.feeSchedule.count({
            where: { baseFeeScheduleId: id },
        });
        if (derivedSchedules > 0) {
            throw new common_1.BadRequestException(`Cannot delete fee schedule ${id}. It is used as base for ${derivedSchedules} other schedule(s)`);
        }
        await this.prisma.feeSchedule.delete({
            where: { id },
        });
        return { message: 'Fee schedule deleted successfully' };
    }
    // ==================== FEE SCHEDULE ITEM CRUD ====================
    async createFeeScheduleItem(tenantId, dto) {
        // Verify fee schedule exists and tenant has access
        await this.findFeeScheduleById(tenantId, dto.feeScheduleId);
        // Verify billing item exists if provided
        if (dto.billingItemId) {
            const billingItem = await this.prisma.billingItem.findUnique({
                where: { id: dto.billingItemId },
            });
            if (!billingItem) {
                throw new common_1.NotFoundException(`Billing item ${dto.billingItemId} not found`);
            }
        }
        return this.prisma.feeScheduleItem.create({
            data: {
                feeScheduleId: dto.feeScheduleId,
                billingItemId: dto.billingItemId ?? null,
                code: dto.code,
                codeType: dto.codeType,
                baseAmount: new library_1.Decimal(dto.baseAmount),
                currency: dto.currency ?? 'AED',
                unit: dto.unit ?? null,
                multiplier: dto.multiplier ? new library_1.Decimal(dto.multiplier) : null,
                discountPct: dto.discountPct ? new library_1.Decimal(dto.discountPct) : null,
                maxAllowedAmount: dto.maxAllowedAmount ? new library_1.Decimal(dto.maxAllowedAmount) : null,
                serviceGroup: dto.serviceGroup ?? null,
                priority: dto.priority ?? 100,
            },
            include: {
                feeSchedule: true,
                billingItem: true,
            },
        });
    }
    async bulkCreateFeeScheduleItems(tenantId, dto) {
        // Verify fee schedule exists and tenant has access
        await this.findFeeScheduleById(tenantId, dto.feeScheduleId);
        const items = dto.items.map((item) => ({
            feeScheduleId: dto.feeScheduleId,
            billingItemId: item.billingItemId ?? null,
            code: item.code,
            codeType: item.codeType,
            baseAmount: new library_1.Decimal(item.baseAmount),
            currency: item.currency ?? 'AED',
            unit: item.unit ?? null,
            multiplier: item.multiplier ? new library_1.Decimal(item.multiplier) : null,
            discountPct: item.discountPct ? new library_1.Decimal(item.discountPct) : null,
            maxAllowedAmount: item.maxAllowedAmount ? new library_1.Decimal(item.maxAllowedAmount) : null,
            serviceGroup: item.serviceGroup ?? null,
            priority: item.priority ?? 100,
        }));
        await this.prisma.feeScheduleItem.createMany({
            data: items,
            skipDuplicates: true, // Skip if unique constraint violated
        });
        return { message: `${items.length} fee schedule items created successfully` };
    }
    async findFeeScheduleItems(feeScheduleId, filters) {
        const where = { feeScheduleId };
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
    async findFeeScheduleItemById(id) {
        const item = await this.prisma.feeScheduleItem.findUnique({
            where: { id },
            include: {
                feeSchedule: true,
                billingItem: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Fee schedule item ${id} not found`);
        }
        return item;
    }
    async updateFeeScheduleItem(id, dto) {
        // Check if item exists
        await this.findFeeScheduleItemById(id);
        const data = {};
        if (dto.billingItemId !== undefined)
            data.billingItemId = dto.billingItemId;
        if (dto.code !== undefined)
            data.code = dto.code;
        if (dto.codeType !== undefined)
            data.codeType = dto.codeType;
        if (dto.baseAmount !== undefined)
            data.baseAmount = new library_1.Decimal(dto.baseAmount);
        if (dto.currency !== undefined)
            data.currency = dto.currency;
        if (dto.unit !== undefined)
            data.unit = dto.unit;
        if (dto.multiplier !== undefined)
            data.multiplier = dto.multiplier ? new library_1.Decimal(dto.multiplier) : null;
        if (dto.discountPct !== undefined)
            data.discountPct = dto.discountPct ? new library_1.Decimal(dto.discountPct) : null;
        if (dto.maxAllowedAmount !== undefined)
            data.maxAllowedAmount = dto.maxAllowedAmount ? new library_1.Decimal(dto.maxAllowedAmount) : null;
        if (dto.serviceGroup !== undefined)
            data.serviceGroup = dto.serviceGroup;
        if (dto.priority !== undefined)
            data.priority = dto.priority;
        return this.prisma.feeScheduleItem.update({
            where: { id },
            data,
            include: {
                feeSchedule: true,
                billingItem: true,
            },
        });
    }
    async deleteFeeScheduleItem(id) {
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
    async lookupPrice(tenantId, dto) {
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
                        status: fee_schedule_dto_1.FeeScheduleStatus.ACTIVE,
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
                let effectiveAmount = new library_1.Decimal(item.baseAmount);
                // Apply multiplier if present
                if (item.multiplier) {
                    effectiveAmount = effectiveAmount.times(new library_1.Decimal(item.multiplier));
                }
                // Apply discount if present
                if (item.discountPct) {
                    const discountAmount = effectiveAmount.times(new library_1.Decimal(item.discountPct)).dividedBy(100);
                    effectiveAmount = effectiveAmount.minus(discountAmount);
                }
                // Apply max allowed amount cap
                if (item.maxAllowedAmount) {
                    const maxAmount = new library_1.Decimal(item.maxAllowedAmount);
                    if (effectiveAmount.greaterThan(maxAmount)) {
                        effectiveAmount = maxAmount;
                    }
                }
                return {
                    code: item.code,
                    codeType: item.codeType,
                    baseAmount: parseFloat(item.baseAmount.toString()),
                    effectiveAmount: parseFloat(effectiveAmount.toString()),
                    currency: item.currency,
                    feeSchedule: {
                        id: schedule.id,
                        scheduleName: schedule.scheduleName,
                        scheduleType: schedule.scheduleType,
                        authorityCode: schedule.authorityCode,
                    },
                    feeScheduleItem: {
                        id: item.id,
                        feeScheduleId: item.feeScheduleId,
                        billingItemId: item.billingItemId,
                        code: item.code,
                        codeType: item.codeType,
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
        // Fallback: Check billing item catalog
        const billingItem = await this.prisma.billingItem.findFirst({
            where: {
                billingCode: dto.code,
                billingCodeType: dto.codeType,
                isActive: true,
                OR: tenantId ? [{ tenantId }, { tenantId: null }] : [{ tenantId: null }],
            },
        });
        if (billingItem && billingItem.listPrice) {
            return {
                code: billingItem.billingCode,
                codeType: dto.codeType,
                baseAmount: parseFloat(billingItem.listPrice.toString()),
                effectiveAmount: parseFloat(billingItem.listPrice.toString()),
                currency: 'AED',
                feeSchedule: {
                    id: 'catalog',
                    scheduleName: 'Billing Item Catalog',
                    scheduleType: fee_schedule_dto_1.FeeScheduleType.TENANT,
                    authorityCode: null,
                },
                feeScheduleItem: {
                    id: billingItem.id,
                    feeScheduleId: 'catalog',
                    billingItemId: billingItem.id,
                    code: billingItem.billingCode,
                    codeType: dto.codeType,
                    baseAmount: parseFloat(billingItem.listPrice.toString()),
                    currency: 'AED',
                    unit: billingItem.defaultUnit,
                    multiplier: null,
                    discountPct: null,
                    maxAllowedAmount: null,
                    serviceGroup: null,
                    priority: 999,
                    createdAt: billingItem.createdAt,
                    updatedAt: billingItem.updatedAt,
                },
            };
        }
        return null; // No price found
    }
    /**
     * Get pricing for a billing code from the most specific applicable fee schedule
     */
    async getPriceForCode(tenantId, code, codeType, effectiveDate) {
        const result = await this.lookupPrice(tenantId, {
            code,
            codeType,
            ...(effectiveDate && { lookupDate: effectiveDate }),
        });
        return result ? result.effectiveAmount : null;
    }
};
exports.FeeScheduleService = FeeScheduleService;
exports.FeeScheduleService = FeeScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], FeeScheduleService);
//# sourceMappingURL=fee-schedule.service.js.map