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
exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prescriptions_service_1 = require("../services/prescriptions.service");
const prescription_dto_1 = require("../dto/prescription.dto");
let PrescriptionsController = class PrescriptionsController {
    prescriptionsService;
    constructor(prescriptionsService) {
        this.prescriptionsService = prescriptionsService;
    }
    async create(tenantId, dto) {
        return this.prescriptionsService.create(tenantId, dto);
    }
    async findById(tenantId, id) {
        return this.prescriptionsService.findById(tenantId, id);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prescriptionsService.findByEncounter(tenantId, encounterId);
    }
    async findActiveByPatient(tenantId, patientId) {
        return this.prescriptionsService.findByPatient(tenantId, patientId, true);
    }
    async update(tenantId, id, dto) {
        return this.prescriptionsService.update(tenantId, id, dto);
    }
    async discontinue(tenantId, id, reason) {
        return this.prescriptionsService.discontinue(tenantId, id);
    }
    async delete(tenantId, id) {
        return this.prescriptionsService.delete(tenantId, id);
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prescription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully', type: prescription_dto_1.PrescriptionResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription found', type: prescription_dto_1.PrescriptionResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all prescriptions for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescriptions retrieved', type: [prescription_dto_1.PrescriptionResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active medications for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active medications retrieved', type: [prescription_dto_1.PrescriptionResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "findActiveByPatient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription updated', type: prescription_dto_1.PrescriptionResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, prescription_dto_1.UpdatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/discontinue'),
    (0, swagger_1.ApiOperation)({ summary: 'Discontinue a prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription discontinued', type: prescription_dto_1.PrescriptionResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "discontinue", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "delete", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map