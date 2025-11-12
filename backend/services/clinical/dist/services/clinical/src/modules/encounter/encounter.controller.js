"use strict";
/**
 * Encounter Controller
 *
 * REST API endpoints for encounter management
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
exports.EncounterController = void 0;
const common_1 = require("@nestjs/common");
const encounter_service_1 = require("./encounter.service");
const create_encounter_dto_1 = require("./dto/create-encounter.dto");
const update_encounter_dto_1 = require("./dto/update-encounter.dto");
const search_encounter_dto_1 = require("./dto/search-encounter.dto");
const tenant_context_decorator_1 = require("../../common/decorators/tenant-context.decorator");
let EncounterController = class EncounterController {
    encounterService;
    constructor(encounterService) {
        this.encounterService = encounterService;
    }
    /**
     * POST /encounters - Create a new encounter
     */
    async createEncounter(dto, context) {
        return this.encounterService.createEncounter(dto, context);
    }
    /**
     * GET /encounters - Search encounters
     */
    async searchEncounters(query, tenantId) {
        return this.encounterService.searchEncounters(tenantId, query);
    }
    /**
     * GET /encounters/facility/:facilityId/today - Get today's encounters for a facility
     */
    async getTodayEncounters(facilityId, tenantId) {
        return this.encounterService.getTodayEncounters(facilityId, tenantId);
    }
    /**
     * GET /encounters/patient/:patientId - Get patient encounters
     */
    async getPatientEncounters(patientId, tenantId) {
        return this.encounterService.getPatientEncounters(patientId, tenantId);
    }
    /**
     * GET /encounters/:id - Get encounter by ID
     */
    async getEncounter(id, tenantId) {
        return this.encounterService.getEncounterById(id, tenantId);
    }
    /**
     * PUT /encounters/:id - Update encounter
     */
    async updateEncounter(id, dto, context) {
        return this.encounterService.updateEncounter(id, dto, context);
    }
    /**
     * PATCH /encounters/:id/status - Update encounter status
     */
    async updateEncounterStatus(id, body, tenantId) {
        return this.encounterService.updateEncounterStatus(id, body.status, tenantId);
    }
};
exports.EncounterController = EncounterController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_encounter_dto_1.CreateEncounterDto, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "createEncounter", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_encounter_dto_1.SearchEncounterDto, String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "searchEncounters", null);
__decorate([
    (0, common_1.Get)('facility/:facilityId/today'),
    __param(0, (0, common_1.Param)('facilityId')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getTodayEncounters", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getPatientEncounters", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getEncounter", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_context_decorator_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_encounter_dto_1.UpdateEncounterDto, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateEncounter", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_context_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateEncounterStatus", null);
exports.EncounterController = EncounterController = __decorate([
    (0, common_1.Controller)('encounters'),
    __metadata("design:paramtypes", [encounter_service_1.EncounterService])
], EncounterController);
//# sourceMappingURL=encounter.controller.js.map