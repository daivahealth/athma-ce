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
exports.ChargeService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
const charge_dto_1 = require("../dto/charge.dto");
let ChargeService = class ChargeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        const data = {
            tenantId,
            patientId: dto.patientId,
            encounterId: dto.encounterId ?? null,
            billingItemId: dto.billingItemId,
            chargeDate: dto.chargeDate ?? new Date(),
            quantity: dto.quantity ?? 1,
            unitPrice: dto.unitPrice,
            grossAmount: dto.grossAmount,
            patientResponsibility: dto.patientResponsibility ?? null,
            payerResponsibility: dto.payerResponsibility ?? null,
            status: dto.status ?? charge_dto_1.ChargeStatus.UNBILLED,
            sourceType: dto.sourceType ?? null,
            sourceId: dto.sourceId ?? null,
            notes: dto.notes ?? null,
        };
        return this.prisma.charge.create({
            data,
            include: {
                billingItem: true,
            },
        });
    }
    async findAll(tenantId, filters) {
        const where = {
            tenantId,
        };
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters?.encounterId) {
            where.encounterId = filters.encounterId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.sourceType) {
            where.sourceType = filters.sourceType;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.chargeDate = {};
            if (filters.dateFrom) {
                where.chargeDate.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                where.chargeDate.lte = filters.dateTo;
            }
        }
        return this.prisma.charge.findMany({
            where,
            include: {
                billingItem: true,
            },
            orderBy: {
                chargeDate: 'desc',
            },
        });
    }
    async findById(tenantId, id) {
        const charge = await this.prisma.charge.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                billingItem: true,
            },
        });
        if (!charge) {
            throw new common_1.NotFoundException(`Charge with ID ${id} not found`);
        }
        return charge;
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prisma.charge.findMany({
            where: {
                tenantId,
                encounterId,
            },
            include: {
                billingItem: true,
            },
            orderBy: {
                chargeDate: 'asc',
            },
        });
    }
    async findByPatient(tenantId, patientId) {
        return this.prisma.charge.findMany({
            where: {
                tenantId,
                patientId,
            },
            include: {
                billingItem: true,
            },
            orderBy: {
                chargeDate: 'desc',
            },
        });
    }
    async update(tenantId, id, dto) {
        // Verify charge exists and belongs to tenant
        await this.findById(tenantId, id);
        const data = {};
        if (dto.patientId !== undefined)
            data.patientId = dto.patientId;
        if (dto.encounterId !== undefined)
            data.encounterId = dto.encounterId ?? null;
        if (dto.billingItemId !== undefined)
            data.billingItemId = dto.billingItemId;
        if (dto.chargeDate !== undefined)
            data.chargeDate = dto.chargeDate;
        if (dto.quantity !== undefined)
            data.quantity = dto.quantity;
        if (dto.unitPrice !== undefined)
            data.unitPrice = dto.unitPrice;
        if (dto.grossAmount !== undefined)
            data.grossAmount = dto.grossAmount;
        if (dto.patientResponsibility !== undefined)
            data.patientResponsibility = dto.patientResponsibility ?? null;
        if (dto.payerResponsibility !== undefined)
            data.payerResponsibility = dto.payerResponsibility ?? null;
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.sourceType !== undefined)
            data.sourceType = dto.sourceType ?? null;
        if (dto.sourceId !== undefined)
            data.sourceId = dto.sourceId ?? null;
        if (dto.notes !== undefined)
            data.notes = dto.notes ?? null;
        return this.prisma.charge.update({
            where: { id },
            data,
            include: {
                billingItem: true,
            },
        });
    }
    async cancel(tenantId, id) {
        // Verify charge exists and belongs to tenant
        await this.findById(tenantId, id);
        return this.prisma.charge.update({
            where: { id },
            data: { status: charge_dto_1.ChargeStatus.CANCELLED },
            include: {
                billingItem: true,
            },
        });
    }
    async delete(tenantId, id) {
        // Verify charge exists and belongs to tenant
        await this.findById(tenantId, id);
        return this.prisma.charge.delete({
            where: { id },
        });
    }
    async getStatistics(tenantId, filters) {
        const where = {
            tenantId,
        };
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters?.encounterId) {
            where.encounterId = filters.encounterId;
        }
        const [total, byStatus, totalAmount] = await Promise.all([
            this.prisma.charge.count({ where }),
            this.prisma.charge.groupBy({
                by: ['status'],
                where,
                _count: true,
                _sum: {
                    grossAmount: true,
                },
            }),
            this.prisma.charge.aggregate({
                where,
                _sum: {
                    grossAmount: true,
                    patientResponsibility: true,
                    payerResponsibility: true,
                },
            }),
        ]);
        return {
            total,
            totalGrossAmount: totalAmount._sum.grossAmount || 0,
            totalPatientResponsibility: totalAmount._sum.patientResponsibility || 0,
            totalPayerResponsibility: totalAmount._sum.payerResponsibility || 0,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = {
                    count: item._count,
                    amount: item._sum.grossAmount || 0,
                };
                return acc;
            }, {}),
        };
    }
    // Bulk operations
    async createBulk(tenantId, charges) {
        const data = charges.map((dto) => ({
            tenantId,
            patientId: dto.patientId,
            encounterId: dto.encounterId ?? null,
            billingItemId: dto.billingItemId,
            chargeDate: dto.chargeDate ?? new Date(),
            quantity: dto.quantity ?? 1,
            unitPrice: dto.unitPrice,
            grossAmount: dto.grossAmount,
            patientResponsibility: dto.patientResponsibility ?? null,
            payerResponsibility: dto.payerResponsibility ?? null,
            status: dto.status ?? charge_dto_1.ChargeStatus.UNBILLED,
            sourceType: dto.sourceType ?? null,
            sourceId: dto.sourceId ?? null,
            notes: dto.notes ?? null,
        }));
        const result = await this.prisma.charge.createMany({
            data,
        });
        return result;
    }
};
exports.ChargeService = ChargeService;
exports.ChargeService = ChargeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], ChargeService);
//# sourceMappingURL=charge.service.js.map