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
exports.BillingItemService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
let BillingItemService = class BillingItemService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        // For tenant-scoped items, use the provided tenantId from header
        // For global items, dto.tenantId should be null
        const finalTenantId = dto.tenantId === undefined ? tenantId : dto.tenantId;
        const data = {
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
    async findAll(tenantId, filters) {
        const where = {};
        // If includeGlobal is true, include both tenant-specific and global items
        // Otherwise, only items for this tenant
        if (filters?.includeGlobal && tenantId) {
            where.OR = [{ tenantId }, { tenantId: null }];
        }
        else {
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
    async findById(tenantId, id) {
        const item = await this.prisma.billingItem.findFirst({
            where: {
                id,
                OR: [{ tenantId }, { tenantId: null }], // Can retrieve global or tenant items
            },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Billing item with ID ${id} not found`);
        }
        return item;
    }
    async findByCode(tenantId, billingCodeType, billingCode) {
        return this.prisma.billingItem.findFirst({
            where: {
                billingCodeType,
                billingCode,
                OR: [{ tenantId }, { tenantId: null }],
            },
        });
    }
    async update(tenantId, id, dto) {
        // Verify item exists and belongs to tenant (or is global)
        await this.findById(tenantId, id);
        const data = {};
        if (dto.itemType !== undefined)
            data.itemType = dto.itemType;
        if (dto.clinicalRefId !== undefined)
            data.clinicalRefId = dto.clinicalRefId ?? null;
        if (dto.billingCode !== undefined)
            data.billingCode = dto.billingCode;
        if (dto.billingCodeType !== undefined)
            data.billingCodeType = dto.billingCodeType;
        if (dto.billingDescription !== undefined)
            data.billingDescription = dto.billingDescription;
        if (dto.chargeType !== undefined)
            data.chargeType = dto.chargeType;
        if (dto.defaultUnit !== undefined)
            data.defaultUnit = dto.defaultUnit;
        if (dto.listPrice !== undefined)
            data.listPrice = dto.listPrice ?? null;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        return this.prisma.billingItem.update({
            where: { id },
            data,
        });
    }
    async delete(tenantId, id) {
        // Verify item exists and belongs to tenant (or is global)
        await this.findById(tenantId, id);
        // Soft delete by setting isActive to false
        return this.prisma.billingItem.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async hardDelete(tenantId, id) {
        // Verify item exists and belongs to tenant (or is global)
        await this.findById(tenantId, id);
        return this.prisma.billingItem.delete({
            where: { id },
        });
    }
    async getStatistics(tenantId) {
        const where = {
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
            byItemType: byItemType.reduce((acc, item) => {
                acc[item.itemType] = item._count;
                return acc;
            }, {}),
            byChargeType: byChargeType.reduce((acc, item) => {
                acc[item.chargeType] = item._count;
                return acc;
            }, {}),
        };
    }
};
exports.BillingItemService = BillingItemService;
exports.BillingItemService = BillingItemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], BillingItemService);
//# sourceMappingURL=billing-item.service.js.map