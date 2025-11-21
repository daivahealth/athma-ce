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
exports.PolicyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const policy_service_1 = require("../services/policy.service");
const policy_dto_1 = require("../dto/policy.dto");
let PolicyController = class PolicyController {
    policyService;
    constructor(policyService) {
        this.policyService = policyService;
    }
    async create(tenantId, dto) {
        return this.policyService.create(tenantId, dto);
    }
    async findAll(tenantId, patientId, status) {
        return this.policyService.findAll(tenantId, patientId, status);
    }
    async findByPatient(tenantId, patientId) {
        return this.policyService.findByPatient(tenantId, patientId);
    }
    async findPrimaryPolicy(tenantId, patientId) {
        return this.policyService.findPrimaryPolicy(tenantId, patientId);
    }
    async getStatistics(tenantId, patientId) {
        return this.policyService.getPolicyStatistics(tenantId, patientId);
    }
    async checkExpired(tenantId) {
        return this.policyService.checkExpiredPolicies(tenantId);
    }
    async findById(tenantId, id) {
        return this.policyService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.policyService.update(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.policyService.delete(tenantId, id);
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new insurance policy' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, policy_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policies' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: policy_dto_1.PolicyStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active policies for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient policies retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/primary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get primary policy for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Primary policy retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findPrimaryPolicy", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('check-expired'),
    (0, swagger_1.ApiOperation)({ summary: 'Check and update expired policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired policies updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "checkExpired", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, policy_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy cancelled successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "delete", null);
exports.PolicyController = PolicyController = __decorate([
    (0, swagger_1.ApiTags)('Policies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map