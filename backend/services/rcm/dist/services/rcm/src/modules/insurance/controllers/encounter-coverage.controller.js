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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterCoverageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const encounter_coverage_service_1 = require("../services/encounter-coverage.service");
const encounter_coverage_dto_1 = require("../dto/encounter-coverage.dto");
let EncounterCoverageController = class EncounterCoverageController {
    encounterCoverageService;
    constructor(encounterCoverageService) {
        this.encounterCoverageService = encounterCoverageService;
    }
    async create(tenantId, dto) {
        return this.encounterCoverageService.create(tenantId, dto);
    }
    async findAll(tenantId, encounterId, patientId, policyId, payerId, financialClass, coverageLevel, isActive) {
        const filters = {};
        if (encounterId)
            filters.encounterId = encounterId;
        if (patientId)
            filters.patientId = patientId;
        if (policyId)
            filters.policyId = policyId;
        if (payerId)
            filters.payerId = payerId;
        if (financialClass)
            filters.financialClass = financialClass;
        if (coverageLevel)
            filters.coverageLevel = coverageLevel;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        return this.encounterCoverageService.findAll(tenantId, filters);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.encounterCoverageService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId, isActive) {
        const isActiveFilter = isActive !== undefined ? isActive === 'true' : undefined;
        return this.encounterCoverageService.findByPatient(tenantId, patientId, isActiveFilter);
    }
    async getStatistics(tenantId, patientId, encounterId) {
        const filters = {};
        if (patientId)
            filters.patientId = patientId;
        if (encounterId)
            filters.encounterId = encounterId;
        return this.encounterCoverageService.getCoverageStatistics(tenantId, filters);
    }
    async findById(tenantId, id) {
        return this.encounterCoverageService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.encounterCoverageService.update(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.encounterCoverageService.delete(tenantId, id);
    }
};
exports.EncounterCoverageController = EncounterCoverageController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create encounter coverage' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Coverage created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, encounter_coverage_dto_1.CreateEncounterCoverageDto]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all encounter coverages' }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'policyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'payerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'financialClass', required: false, enum: encounter_coverage_dto_1.FinancialClass }),
    (0, swagger_1.ApiQuery)({ name: 'coverageLevel', required: false, enum: encounter_coverage_dto_1.CoverageLevel }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coverages retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('encounterId')),
    __param(2, (0, common_1.Query)('patientId')),
    __param(3, (0, common_1.Query)('policyId')),
    __param(4, (0, common_1.Query)('payerId')),
    __param(5, (0, common_1.Query)('financialClass')),
    __param(6, (0, common_1.Query)('coverageLevel')),
    __param(7, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coverages for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Encounter coverages retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coverages for a patient' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient coverages retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coverage statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coverage by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coverage found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update coverage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coverage updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, encounter_coverage_dto_1.UpdateEncounterCoverageDto]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate coverage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coverage deactivated successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterCoverageController.prototype, "delete", null);
exports.EncounterCoverageController = EncounterCoverageController = __decorate([
    (0, swagger_1.ApiTags)('Encounter Coverages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('encounter-coverages'),
    __metadata("design:paramtypes", [encounter_coverage_service_1.EncounterCoverageService])
], EncounterCoverageController);
//# sourceMappingURL=encounter-coverage.controller.js.map