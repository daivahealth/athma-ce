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
exports.PayerContractController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payer_contract_service_1 = require("../services/payer-contract.service");
const payer_contract_dto_1 = require("../dto/payer-contract.dto");
let PayerContractController = class PayerContractController {
    payerContractService;
    constructor(payerContractService) {
        this.payerContractService = payerContractService;
    }
    // ==================== PAYER CONTRACT ENDPOINTS ====================
    async createContract(tenantId, userId, dto) {
        return this.payerContractService.createContract(tenantId, dto, userId);
    }
    async findAllContracts(tenantId, payerId, status, contractType, authorityCode, planCode, networkType, effectiveDate) {
        const filters = {};
        if (payerId)
            filters.payerId = payerId;
        if (status)
            filters.status = status;
        if (contractType)
            filters.contractType = contractType;
        if (authorityCode)
            filters.authorityCode = authorityCode;
        if (planCode)
            filters.planCode = planCode;
        if (networkType)
            filters.networkType = networkType;
        if (effectiveDate)
            filters.effectiveDate = effectiveDate;
        return this.payerContractService.findAllContracts(tenantId, filters);
    }
    async getStatistics(tenantId, payerId) {
        return this.payerContractService.getContractStatistics(tenantId, payerId);
    }
    async findContractById(tenantId, id) {
        return this.payerContractService.findContractById(tenantId, id);
    }
    async updateContract(tenantId, userId, id, dto) {
        return this.payerContractService.updateContract(tenantId, id, dto, userId);
    }
    async deleteContract(tenantId, id) {
        return this.payerContractService.deleteContract(tenantId, id);
    }
    // ==================== PAYER CONTRACT ADJUSTMENT ENDPOINTS ====================
    async createAdjustment(tenantId, userId, dto) {
        return this.payerContractService.createAdjustment(tenantId, dto, userId);
    }
    async bulkCreateAdjustments(tenantId, userId, dto) {
        return this.payerContractService.bulkCreateAdjustments(tenantId, dto, userId);
    }
    async findAdjustments(contractId, serviceGroup, billingItemId, feeScheduleItemId, effectiveDate, includeExclusions) {
        const filters = {};
        if (serviceGroup)
            filters.serviceGroup = serviceGroup;
        if (billingItemId)
            filters.billingItemId = billingItemId;
        if (feeScheduleItemId)
            filters.feeScheduleItemId = feeScheduleItemId;
        if (effectiveDate)
            filters.effectiveDate = effectiveDate;
        if (includeExclusions !== undefined)
            filters.includeExclusions = includeExclusions;
        return this.payerContractService.findAdjustments(contractId, filters);
    }
    async findAdjustmentById(id) {
        return this.payerContractService.findAdjustmentById(id);
    }
    async updateAdjustment(userId, id, dto) {
        return this.payerContractService.updateAdjustment(id, dto, userId);
    }
    async deleteAdjustment(id) {
        return this.payerContractService.deleteAdjustment(id);
    }
    // ==================== PRICE CALCULATION ENDPOINTS ====================
    async calculatePrice(tenantId, dto) {
        return this.payerContractService.calculateContractPrice(tenantId, dto);
    }
};
exports.PayerContractController = PayerContractController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new payer contract' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Contract created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payer_contract_dto_1.CreatePayerContractDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "createContract", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payer contracts' }),
    (0, swagger_1.ApiQuery)({ name: 'payerId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: payer_contract_dto_1.ContractStatus }),
    (0, swagger_1.ApiQuery)({ name: 'contractType', required: false, enum: payer_contract_dto_1.ContractType }),
    (0, swagger_1.ApiQuery)({ name: 'authorityCode', required: false, enum: payer_contract_dto_1.AuthorityCode }),
    (0, swagger_1.ApiQuery)({ name: 'planCode', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'networkType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'effectiveDate', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contracts retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('payerId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('contractType')),
    __param(4, (0, common_1.Query)('authorityCode')),
    __param(5, (0, common_1.Query)('planCode')),
    __param(6, (0, common_1.Query)('networkType')),
    __param(7, (0, common_1.Query)('effectiveDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "findAllContracts", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contract statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'payerId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('payerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contract by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "findContractById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update contract' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, payer_contract_dto_1.UpdatePayerContractDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete (deactivate) contract' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract deactivated successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "deleteContract", null);
__decorate([
    (0, common_1.Post)('adjustments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new contract adjustment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Adjustment created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payer_contract_dto_1.CreatePayerContractAdjustmentDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "createAdjustment", null);
__decorate([
    (0, common_1.Post)('adjustments/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk create contract adjustments' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Adjustments created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payer_contract_dto_1.BulkCreatePayerContractAdjustmentsDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "bulkCreateAdjustments", null);
__decorate([
    (0, common_1.Get)(':contractId/adjustments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all adjustments for a contract' }),
    (0, swagger_1.ApiQuery)({ name: 'serviceGroup', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'billingItemId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'feeScheduleItemId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'effectiveDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'includeExclusions', required: false, type: Boolean, description: 'Include exclusion rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Adjustments retrieved' }),
    __param(0, (0, common_1.Param)('contractId')),
    __param(1, (0, common_1.Query)('serviceGroup')),
    __param(2, (0, common_1.Query)('billingItemId')),
    __param(3, (0, common_1.Query)('feeScheduleItemId')),
    __param(4, (0, common_1.Query)('effectiveDate')),
    __param(5, (0, common_1.Query)('includeExclusions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "findAdjustments", null);
__decorate([
    (0, common_1.Get)('adjustments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get adjustment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Adjustment found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "findAdjustmentById", null);
__decorate([
    (0, common_1.Put)('adjustments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update adjustment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Adjustment updated' }),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payer_contract_dto_1.UpdatePayerContractAdjustmentDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "updateAdjustment", null);
__decorate([
    (0, common_1.Delete)('adjustments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete adjustment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Adjustment deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "deleteAdjustment", null);
__decorate([
    (0, common_1.Post)('calculate-price'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate contract price for a billing code',
        description: 'Calculates the final price based on contract terms and adjustments',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price calculated successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payer_contract_dto_1.CalculateContractPriceDto]),
    __metadata("design:returntype", Promise)
], PayerContractController.prototype, "calculatePrice", null);
exports.PayerContractController = PayerContractController = __decorate([
    (0, swagger_1.ApiTags)('Payer Contracts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payer-contracts'),
    __metadata("design:paramtypes", [payer_contract_service_1.PayerContractService])
], PayerContractController);
//# sourceMappingURL=payer-contract.controller.js.map