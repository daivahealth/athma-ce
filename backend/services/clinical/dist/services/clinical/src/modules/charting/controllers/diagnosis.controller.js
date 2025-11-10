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
exports.DiagnosisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const diagnosis_service_1 = require("../services/diagnosis.service");
const diagnosis_dto_1 = require("../dto/diagnosis.dto");
let DiagnosisController = class DiagnosisController {
    diagnosisService;
    constructor(diagnosisService) {
        this.diagnosisService = diagnosisService;
    }
    async create(tenantId, dto) {
        return this.diagnosisService.create(tenantId, dto);
    }
    async findById(tenantId, id) {
        return this.diagnosisService.findById(tenantId, id);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.diagnosisService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId, limit) {
        return this.diagnosisService.findByPatient(tenantId, patientId, limit);
    }
    async update(tenantId, id, dto) {
        return this.diagnosisService.update(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.diagnosisService.delete(tenantId, id);
    }
};
exports.DiagnosisController = DiagnosisController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a diagnosis to encounter' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis added successfully', type: diagnosis_dto_1.DiagnosisResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diagnosis_dto_1.CreateDiagnosisDto]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis found', type: diagnosis_dto_1.DiagnosisResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all diagnoses for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnoses retrieved', type: [diagnosis_dto_1.DiagnosisResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all diagnoses for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnoses retrieved', type: [diagnosis_dto_1.DiagnosisResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated', type: diagnosis_dto_1.DiagnosisResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, diagnosis_dto_1.UpdateDiagnosisDto]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "delete", null);
exports.DiagnosisController = DiagnosisController = __decorate([
    (0, swagger_1.ApiTags)('Diagnoses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('diagnoses'),
    __metadata("design:paramtypes", [diagnosis_service_1.DiagnosisService])
], DiagnosisController);
//# sourceMappingURL=diagnosis.controller.js.map