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
exports.DiagnosisService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let DiagnosisService = class DiagnosisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.encounterDiagnosis.create({
            data: {
                tenantId,
                ...dto,
            },
        });
    }
    async findById(tenantId, id) {
        const diagnosis = await this.prisma.encounterDiagnosis.findFirst({
            where: { id, tenantId },
        });
        if (!diagnosis) {
            throw new common_1.NotFoundException(`Diagnosis with ID ${id} not found`);
        }
        return diagnosis;
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prisma.encounterDiagnosis.findMany({
            where: { tenantId, encounterId },
            orderBy: [{ diagnosisRank: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async findByPatient(tenantId, patientId, limit) {
        return this.prisma.encounterDiagnosis.findMany({
            where: { tenantId, patientId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async update(tenantId, id, dto) {
        await this.findById(tenantId, id);
        return this.prisma.encounterDiagnosis.update({
            where: { id },
            data: dto,
        });
    }
    async delete(tenantId, id) {
        await this.findById(tenantId, id);
        await this.prisma.encounterDiagnosis.delete({ where: { id } });
        return { message: 'Diagnosis deleted successfully' };
    }
};
exports.DiagnosisService = DiagnosisService;
exports.DiagnosisService = DiagnosisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], DiagnosisService);
//# sourceMappingURL=diagnosis.service.js.map