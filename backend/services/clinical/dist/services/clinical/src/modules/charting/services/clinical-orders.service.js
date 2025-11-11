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
exports.ClinicalOrdersService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const clinical_order_dto_1 = require("../dto/clinical-order.dto");
let ClinicalOrdersService = class ClinicalOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.clinicalOrder.create({
            data: {
                tenantId,
                ...dto,
                priority: dto.priority || 'routine',
            },
        });
    }
    async findById(tenantId, id) {
        const order = await this.prisma.clinicalOrder.findFirst({
            where: { id, tenantId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Clinical order with ID ${id} not found`);
        }
        return order;
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prisma.clinicalOrder.findMany({
            where: { tenantId, encounterId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByPatient(tenantId, patientId, limit) {
        const query = {
            where: { tenantId, patientId },
            orderBy: { createdAt: 'desc' },
        };
        if (limit) {
            query.take = limit;
        }
        return this.prisma.clinicalOrder.findMany(query);
    }
    async update(tenantId, id, dto) {
        await this.findById(tenantId, id);
        return this.prisma.clinicalOrder.update({
            where: { id },
            data: dto,
        });
    }
    async addResults(tenantId, id, dto) {
        const order = await this.findById(tenantId, id);
        if (order.status === clinical_order_dto_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot add results to a cancelled order');
        }
        const data = {
            resultStatus: dto.resultStatus,
            resultData: dto.resultData,
            resultedAt: new Date(),
            status: clinical_order_dto_1.OrderStatus.COMPLETED,
        };
        if (dto.resultNotes)
            data.resultNotes = dto.resultNotes;
        if (dto.performedBy)
            data.performedBy = dto.performedBy;
        if (dto.performedAt)
            data.performedAt = new Date(dto.performedAt);
        return this.prisma.clinicalOrder.update({
            where: { id },
            data,
        });
    }
    async cancel(tenantId, id) {
        await this.findById(tenantId, id);
        return this.prisma.clinicalOrder.update({
            where: { id },
            data: { status: clinical_order_dto_1.OrderStatus.CANCELLED },
        });
    }
    async delete(tenantId, id) {
        await this.findById(tenantId, id);
        await this.prisma.clinicalOrder.delete({ where: { id } });
        return { message: 'Clinical order deleted successfully' };
    }
};
exports.ClinicalOrdersService = ClinicalOrdersService;
exports.ClinicalOrdersService = ClinicalOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], ClinicalOrdersService);
//# sourceMappingURL=clinical-orders.service.js.map