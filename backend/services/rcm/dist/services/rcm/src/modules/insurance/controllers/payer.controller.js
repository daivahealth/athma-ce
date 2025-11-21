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
exports.PayerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payer_service_1 = require("../services/payer.service");
const payer_dto_1 = require("../dto/payer.dto");
let PayerController = class PayerController {
    payerService;
    constructor(payerService) {
        this.payerService = payerService;
    }
    async create(tenantId, dto) {
        return this.payerService.create(tenantId, dto);
    }
    async findAll(tenantId, status) {
        return this.payerService.findAll(tenantId, status);
    }
    async getStatistics(tenantId) {
        return this.payerService.getPayerStatistics(tenantId);
    }
    async findById(tenantId, id) {
        return this.payerService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.payerService.update(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.payerService.delete(tenantId, id);
    }
};
exports.PayerController = PayerController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new payer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payer created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payer_dto_1.CreatePayerDto]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payers for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: payer_dto_1.PayerStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payers retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payer statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payer found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update payer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payer updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payer_dto_1.UpdatePayerDto]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete (deactivate) payer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payer deactivated successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayerController.prototype, "delete", null);
exports.PayerController = PayerController = __decorate([
    (0, swagger_1.ApiTags)('Payers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payers'),
    __metadata("design:paramtypes", [payer_service_1.PayerService])
], PayerController);
//# sourceMappingURL=payer.controller.js.map