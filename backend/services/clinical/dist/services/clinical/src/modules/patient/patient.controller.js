"use strict";
/**
 * Patient Controller
 *
 * REST API endpoints for patient management
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const common_1 = require("@nestjs/common");
const patient_service_1 = require("./patient.service");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const search_patients_dto_1 = require("./dto/search-patients.dto");
const tenant_context_decorator_1 = require("../../common/decorators/tenant-context.decorator");
let PatientController = class PatientController {
    patientService;
    constructor(patientService) {
        this.patientService = patientService;
    }
    /**
     * POST /patients - Create a new patient
     */
    async createPatient(dto, context) {
        // Convert dateOfBirth string to Date
        const patientData = {
            ...dto,
            dateOfBirth: new Date(dto.dateOfBirth),
        };
        return this.patientService.registerPatient(patientData, context);
    }
    /**
     * GET /patients/registration/defaults - Default values for registration form
     * IMPORTANT: Must come before :id route to avoid "registration" being treated as an ID
     */
    async getRegistrationDefaults(context) {
        return this.patientService.getRegistrationDefaults(context);
    }
    /**
     * GET /patients - Search patients
     */
    async searchPatients(query, tenantId) {
        return this.patientService.searchPatients(tenantId, query);
    }
    /**
     * GET /patients/:id - Get patient by ID
     */
    async getPatient(id, tenantId) {
        return this.patientService.getPatientById(id, tenantId);
    }
    /**
     * PUT /patients/:id - Update patient
     */
    async updatePatient(id, dto, context) {
        // Convert dateOfBirth if provided
        const updateData = dto.dateOfBirth
            ? { ...dto, dateOfBirth: new Date(dto.dateOfBirth) }
            : dto;
        return this.patientService.updatePatient(id, updateData, context);
    }
    /**
     * GET /patients/:id/history - Get patient with history
     */
    async getPatientWithHistory(id, tenantId) {
        return this.patientService.getPatientWithHistory(id, tenantId);
    }
    /**
     * POST /patients/:id/change-request - Create change request
     */
    async createChangeRequest(id, dto, context) {
        return this.patientService.createChangeRequest(id, dto, {
            ...context,
            requestedBy: 'patient',
        });
    }
    /**
     * POST /patients/:id/approve/:historyId - Approve change request
     */
    async approveChangeRequest(historyId, context) {
        return this.patientService.approveChangeRequest(historyId, context);
    }
    /**
     * GET /patients/:id/field/:fieldName/timeline - Get field timeline
     */
    async getFieldTimeline(id, fieldName, tenantId) {
        return this.patientService.getFieldTimeline(id, tenantId, fieldName);
    }
    /**
     * GET /patients/:id/audit - Get audit report
     */
    async getAuditReport(id, tenantId) {
        return this.patientService.getAuditReport(id, tenantId);
    }
};
exports.PatientController = PatientController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "createPatient", null);
__decorate([
    (0, common_1.Get)('registration/defaults'),
    __param(0, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getRegistrationDefaults", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_patients_dto_1.SearchPatientsDto, String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatient", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_patient_dto_1.UpdatePatientDto, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "updatePatient", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientWithHistory", null);
__decorate([
    (0, common_1.Post)(':id/change-request'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_patient_dto_1.UpdatePatientDto, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "createChangeRequest", null);
__decorate([
    (0, common_1.Post)(':id/approve/:historyId'),
    __param(0, (0, common_1.Param)('historyId')),
    __param(1, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "approveChangeRequest", null);
__decorate([
    (0, common_1.Get)(':id/field/:fieldName/timeline'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('fieldName')),
    __param(2, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getFieldTimeline", null);
__decorate([
    (0, common_1.Get)(':id/audit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getAuditReport", null);
exports.PatientController = PatientController = __decorate([
    (0, common_1.Controller)('patients'),
    __metadata("design:paramtypes", [patient_service_1.PatientService])
], PatientController);
//# sourceMappingURL=patient.controller.js.map