"use strict";
/**
 * Triage Controller
 *
 * REST API endpoints for triage management
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
exports.TriageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const triage_service_1 = require("./triage.service");
const triage_dto_1 = require("./dto/triage.dto");
const tenant_context_decorator_1 = require("../../common/decorators/tenant-context.decorator");
let TriageController = class TriageController {
    triageService;
    constructor(triageService) {
        this.triageService = triageService;
    }
    /**
     * POST /triage - Create a new triage record
     */
    async createTriage(dto, context) {
        return this.triageService.createTriage(dto, context);
    }
    /**
     * GET /triage/encounter/:encounterId - Get triage by encounter ID
     */
    async getTriageByEncounterId(encounterId, tenantId) {
        return this.triageService.getTriageByEncounterId(encounterId, tenantId);
    }
    /**
     * GET /triage/patient/:patientId - Get patient's triage history
     */
    async getPatientTriages(patientId, tenantId) {
        return this.triageService.getPatientTriages(patientId, tenantId);
    }
    /**
     * GET /triage/level/:triageLevel - Get triages by priority level
     */
    async getTriagesByLevel(triageLevel, tenantId) {
        return this.triageService.getTriagesByLevel(parseInt(triageLevel), tenantId);
    }
    /**
     * GET /triage/:id - Get triage by ID
     */
    async getTriageById(id, tenantId) {
        return this.triageService.getTriageById(id, tenantId);
    }
    /**
     * PUT /triage/:id - Update triage
     */
    async updateTriage(id, dto, context) {
        return this.triageService.updateTriage(id, dto, context);
    }
    /**
     * DELETE /triage/:id - Delete triage
     */
    async deleteTriage(id, tenantId) {
        return this.triageService.deleteTriage(id, tenantId);
    }
};
exports.TriageController = TriageController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new triage record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Triage created successfully', type: triage_dto_1.TriageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Encounter or patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Triage already exists for this encounter' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [triage_dto_1.CreateTriageDto, Object]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "createTriage", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get triage by encounter ID' }),
    (0, swagger_1.ApiParam)({ name: 'encounterId', description: 'Encounter UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage found', type: triage_dto_1.TriageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Triage not found' }),
    __param(0, (0, common_1.Param)('encounterId')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "getTriageByEncounterId", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: "Get patient's triage history" }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient triages found', type: [triage_dto_1.TriageResponseDto] }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "getPatientTriages", null);
__decorate([
    (0, common_1.Get)('level/:triageLevel'),
    (0, swagger_1.ApiOperation)({ summary: 'Get triages by priority level (for prioritization)' }),
    (0, swagger_1.ApiParam)({ name: 'triageLevel', description: 'Triage level (1-5)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triages found', type: [triage_dto_1.TriageResponseDto] }),
    __param(0, (0, common_1.Param)('triageLevel')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "getTriagesByLevel", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get triage by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Triage UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage found', type: triage_dto_1.TriageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Triage not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "getTriageById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update triage record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Triage UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage updated successfully', type: triage_dto_1.TriageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Triage not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, triage_dto_1.UpdateTriageDto, Object]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "updateTriage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete triage record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Triage UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Triage not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "deleteTriage", null);
exports.TriageController = TriageController = __decorate([
    (0, swagger_1.ApiTags)('Triage'),
    (0, common_1.Controller)('triage'),
    __metadata("design:paramtypes", [triage_service_1.TriageService])
], TriageController);
//# sourceMappingURL=triage.controller.js.map