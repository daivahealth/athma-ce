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
exports.PayerService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
const payer_dto_1 = require("../dto/payer.dto");
let PayerService = class PayerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.payer.create({
            data: {
                tenantId,
                payerName: dto.payerName,
                payerId: dto.payerId ?? null,
                payerType: dto.payerType ?? null,
                contactInfo: dto.contactInfo || {},
                configuration: dto.configuration || {},
                status: dto.status || payer_dto_1.PayerStatus.ACTIVE,
            },
        });
    }
    async findAll(tenantId, status) {
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        return this.prisma.payer.findMany({
            where,
            orderBy: { payerName: 'asc' },
        });
    }
    async findById(tenantId, id) {
        const payer = await this.prisma.payer.findFirst({
            where: { id, tenantId },
            include: {
                policies: {
                    where: { status: 'active' },
                    take: 10,
                },
            },
        });
        if (!payer) {
            throw new common_1.NotFoundException(`Payer with ID ${id} not found`);
        }
        return payer;
    }
    async update(tenantId, id, dto) {
        // Verify payer exists and belongs to tenant
        await this.findById(tenantId, id);
        const data = {};
        if (dto.payerName !== undefined)
            data.payerName = dto.payerName;
        if (dto.payerId !== undefined)
            data.payerId = dto.payerId ?? null;
        if (dto.payerType !== undefined)
            data.payerType = dto.payerType ?? null;
        if (dto.contactInfo !== undefined)
            data.contactInfo = dto.contactInfo;
        if (dto.configuration !== undefined)
            data.configuration = dto.configuration;
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.payer.update({
            where: { id },
            data,
        });
    }
    async delete(tenantId, id) {
        // Verify payer exists and belongs to tenant
        await this.findById(tenantId, id);
        // Soft delete by updating status
        await this.prisma.payer.update({
            where: { id },
            data: { status: payer_dto_1.PayerStatus.INACTIVE },
        });
        return { message: 'Payer deactivated successfully' };
    }
    async getPayerStatistics(tenantId) {
        const payers = await this.prisma.payer.findMany({
            where: { tenantId },
        });
        const policyCounts = await this.prisma.policy.groupBy({
            by: ['payerId'],
            where: { tenantId },
            _count: true,
        });
        return {
            total: payers.length,
            byStatus: payers.reduce((acc, payer) => {
                acc[payer.status] = (acc[payer.status] || 0) + 1;
                return acc;
            }, {}),
            policyCounts: policyCounts.reduce((acc, item) => {
                acc[item.payerId] = item._count;
                return acc;
            }, {}),
        };
    }
};
exports.PayerService = PayerService;
exports.PayerService = PayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], PayerService);
//# sourceMappingURL=payer.service.js.map