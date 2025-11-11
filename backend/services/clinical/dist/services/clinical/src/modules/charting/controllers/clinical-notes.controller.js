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
exports.ClinicalNotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinical_notes_service_1 = require("../services/clinical-notes.service");
const clinical_note_dto_1 = require("../dto/clinical-note.dto");
let ClinicalNotesController = class ClinicalNotesController {
    clinicalNotesService;
    constructor(clinicalNotesService) {
        this.clinicalNotesService = clinicalNotesService;
    }
    async create(tenantId, dto) {
        return this.clinicalNotesService.create(tenantId, dto);
    }
    async findById(tenantId, id) {
        return this.clinicalNotesService.findById(tenantId, id);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.clinicalNotesService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId, limit) {
        return this.clinicalNotesService.findByPatient(tenantId, patientId, limit);
    }
    async update(tenantId, id, dto) {
        return this.clinicalNotesService.update(tenantId, id, dto);
    }
    async updateSections(tenantId, id, dto) {
        return this.clinicalNotesService.updateSections(tenantId, id, dto);
    }
    async signNote(tenantId, id, dto) {
        return this.clinicalNotesService.signNote(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.clinicalNotesService.delete(tenantId, id);
    }
    async getStatistics(tenantId, encounterId) {
        return this.clinicalNotesService.getNotesStatistics(tenantId, encounterId);
    }
};
exports.ClinicalNotesController = ClinicalNotesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clinical note' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Clinical note created successfully', type: clinical_note_dto_1.ClinicalNoteResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, clinical_note_dto_1.CreateClinicalNoteDto]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get clinical note by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clinical note found', type: clinical_note_dto_1.ClinicalNoteResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all clinical notes for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clinical notes retrieved', type: [clinical_note_dto_1.ClinicalNoteResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all clinical notes for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clinical notes retrieved', type: [clinical_note_dto_1.ClinicalNoteResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update clinical note metadata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clinical note updated', type: clinical_note_dto_1.ClinicalNoteResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, clinical_note_dto_1.UpdateClinicalNoteDto]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Update clinical note sections' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sections updated', type: clinical_note_dto_1.ClinicalNoteResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, clinical_note_dto_1.UpdateNoteSectionsDto]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "updateSections", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign a clinical note' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Note signed successfully', type: clinical_note_dto_1.ClinicalNoteResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, clinical_note_dto_1.SignNoteDto]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "signNote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a clinical note' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Note deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes statistics for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalNotesController.prototype, "getStatistics", null);
exports.ClinicalNotesController = ClinicalNotesController = __decorate([
    (0, swagger_1.ApiTags)('Clinical Notes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical-notes'),
    __metadata("design:paramtypes", [clinical_notes_service_1.ClinicalNotesService])
], ClinicalNotesController);
//# sourceMappingURL=clinical-notes.controller.js.map