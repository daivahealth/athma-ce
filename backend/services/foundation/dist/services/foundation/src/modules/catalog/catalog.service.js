"use strict";
/**
 * Catalog Service
 *
 * Manages master catalog tables for medications, lab tests, imaging studies, and procedures.
 * Supports both global (tenant_id = NULL) and tenant-specific catalog entries.
 */
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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ========================================
    // MEDICATION MASTER
    // ========================================
    async listMedications(filters = {}) {
        const where = {
            isActive: filters.isActive !== undefined ? filters.isActive : true,
        };
        // Handle tenant filtering - catalogs are tenant-specific
        if (filters.tenantId) {
            where.tenantId = filters.tenantId;
        }
        if (filters.search) {
            where.OR = [
                { medicationName: { contains: filters.search, mode: 'insensitive' } },
                { genericName: { contains: filters.search, mode: 'insensitive' } },
                { brandName: { contains: filters.search, mode: 'insensitive' } },
                { ndcCode: { contains: filters.search, mode: 'insensitive' } },
                { atcCode: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.medicationMaster.findMany({
            where,
            orderBy: { medicationName: 'asc' },
        });
    }
    async getMedicationById(id) {
        const medication = await this.prisma.medicationMaster.findUnique({
            where: { id },
        });
        if (!medication) {
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        return medication;
    }
    async createMedication(data) {
        return this.prisma.medicationMaster.create({
            data,
        });
    }
    async updateMedication(id, data) {
        await this.getMedicationById(id); // Verify exists
        return this.prisma.medicationMaster.update({
            where: { id },
            data,
        });
    }
    async deactivateMedication(id) {
        return this.updateMedication(id, { isActive: false });
    }
    // ========================================
    // LAB TEST MASTER
    // ========================================
    async listLabTests(filters = {}) {
        const where = {
            isActive: filters.isActive !== undefined ? filters.isActive : true,
        };
        // Handle tenant filtering - catalogs are tenant-specific
        if (filters.tenantId) {
            where.tenantId = filters.tenantId;
        }
        if (filters.search) {
            where.OR = [
                { testName: { contains: filters.search, mode: 'insensitive' } },
                { loincCode: { contains: filters.search, mode: 'insensitive' } },
                { cptCode: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.labTestMaster.findMany({
            where,
            orderBy: { testName: 'asc' },
        });
    }
    async getLabTestById(id) {
        const labTest = await this.prisma.labTestMaster.findUnique({
            where: { id },
        });
        if (!labTest) {
            throw new common_1.NotFoundException(`Lab test with ID ${id} not found`);
        }
        return labTest;
    }
    async createLabTest(data) {
        return this.prisma.labTestMaster.create({
            data,
        });
    }
    async updateLabTest(id, data) {
        await this.getLabTestById(id); // Verify exists
        return this.prisma.labTestMaster.update({
            where: { id },
            data,
        });
    }
    async deactivateLabTest(id) {
        return this.updateLabTest(id, { isActive: false });
    }
    // ========================================
    // IMAGING STUDY MASTER
    // ========================================
    async listImagingStudies(filters = {}) {
        const where = {
            isActive: filters.isActive !== undefined ? filters.isActive : true,
        };
        // Handle tenant filtering - catalogs are tenant-specific
        if (filters.tenantId) {
            where.tenantId = filters.tenantId;
        }
        if (filters.search) {
            where.OR = [
                { studyName: { contains: filters.search, mode: 'insensitive' } },
                { modality: { contains: filters.search, mode: 'insensitive' } },
                { bodyPart: { contains: filters.search, mode: 'insensitive' } },
                { cptCode: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.imagingStudyMaster.findMany({
            where,
            orderBy: { studyName: 'asc' },
        });
    }
    async getImagingStudyById(id) {
        const study = await this.prisma.imagingStudyMaster.findUnique({
            where: { id },
        });
        if (!study) {
            throw new common_1.NotFoundException(`Imaging study with ID ${id} not found`);
        }
        return study;
    }
    async createImagingStudy(data) {
        return this.prisma.imagingStudyMaster.create({
            data,
        });
    }
    async updateImagingStudy(id, data) {
        await this.getImagingStudyById(id); // Verify exists
        return this.prisma.imagingStudyMaster.update({
            where: { id },
            data,
        });
    }
    async deactivateImagingStudy(id) {
        return this.updateImagingStudy(id, { isActive: false });
    }
    // ========================================
    // PROCEDURE MASTER
    // ========================================
    async listProcedures(filters = {}) {
        const where = {
            isActive: filters.isActive !== undefined ? filters.isActive : true,
        };
        // Handle tenant filtering - catalogs are tenant-specific
        if (filters.tenantId) {
            where.tenantId = filters.tenantId;
        }
        if (filters.search) {
            where.OR = [
                { procedureName: { contains: filters.search, mode: 'insensitive' } },
                { cptCode: { contains: filters.search, mode: 'insensitive' } },
                { icd10PcsCode: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.procedureMaster.findMany({
            where,
            orderBy: { procedureName: 'asc' },
        });
    }
    async getProcedureById(id) {
        const procedure = await this.prisma.procedureMaster.findUnique({
            where: { id },
        });
        if (!procedure) {
            throw new common_1.NotFoundException(`Procedure with ID ${id} not found`);
        }
        return procedure;
    }
    async createProcedure(data) {
        return this.prisma.procedureMaster.create({
            data,
        });
    }
    async updateProcedure(id, data) {
        await this.getProcedureById(id); // Verify exists
        return this.prisma.procedureMaster.update({
            where: { id },
            data,
        });
    }
    async deactivateProcedure(id) {
        return this.updateProcedure(id, { isActive: false });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map