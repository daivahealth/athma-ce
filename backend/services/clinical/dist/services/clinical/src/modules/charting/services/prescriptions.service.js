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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const prescription_dto_1 = require("../dto/prescription.dto");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.prescriptionOrder.create({
            data: {
                tenantId,
                ...dto,
                codeSystem: dto.codeSystem || 'NDC',
                refills: dto.refills || 0,
            },
        });
    }
    async findById(tenantId, id) {
        const prescription = await this.prisma.prescriptionOrder.findFirst({
            where: { id, tenantId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException(`Prescription with ID ${id} not found`);
        }
        return prescription;
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prisma.prescriptionOrder.findMany({
            where: { tenantId, encounterId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByPatient(tenantId, patientId, activeOnly = false) {
        return this.prisma.prescriptionOrder.findMany({
            where: {
                tenantId,
                patientId,
                ...(activeOnly ? { status: prescription_dto_1.PrescriptionStatus.ACTIVE } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(tenantId, id, dto) {
        await this.findById(tenantId, id);
        return this.prisma.prescriptionOrder.update({
            where: { id },
            data: dto,
        });
    }
    async discontinue(tenantId, id) {
        await this.findById(tenantId, id);
        return this.prisma.prescriptionOrder.update({
            where: { id },
            data: { status: prescription_dto_1.PrescriptionStatus.DISCONTINUED },
        });
    }
    async delete(tenantId, id) {
        await this.findById(tenantId, id);
        await this.prisma.prescriptionOrder.delete({ where: { id } });
        return { message: 'Prescription deleted successfully' };
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map