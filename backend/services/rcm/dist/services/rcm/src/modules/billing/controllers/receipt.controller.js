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
exports.ReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const receipt_service_1 = require("../services/receipt.service");
const receipt_dto_1 = require("../dto/receipt.dto");
let ReceiptController = class ReceiptController {
    receiptService;
    constructor(receiptService) {
        this.receiptService = receiptService;
    }
    async create(tenantId, dto) {
        return this.receiptService.create(tenantId, dto);
    }
    async findAll(tenantId, patientId, invoiceId, paymentMethod, dateFrom, dateTo) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (invoiceId !== undefined)
            filters.invoiceId = invoiceId;
        if (paymentMethod !== undefined)
            filters.paymentMethod = paymentMethod;
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.receiptService.findAll(tenantId, filters);
    }
    async getStatistics(tenantId, patientId) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        return this.receiptService.getStatistics(tenantId, filters);
    }
    async findByReceiptNumber(tenantId, receiptNumber) {
        return this.receiptService.findByReceiptNumber(tenantId, receiptNumber);
    }
    async findByPatient(tenantId, patientId) {
        return this.receiptService.findByPatient(tenantId, patientId);
    }
    async findById(tenantId, id) {
        return this.receiptService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.receiptService.update(tenantId, id, dto);
    }
    async allocate(tenantId, id, dto) {
        return this.receiptService.allocate(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.receiptService.delete(tenantId, id);
    }
};
exports.ReceiptController = ReceiptController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new receipt with optional allocations' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Receipt created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, receipt_dto_1.CreateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all receipts for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'invoiceId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'paymentMethod', required: false, enum: receipt_dto_1.PaymentMethod }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipts retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('invoiceId')),
    __param(3, (0, common_1.Query)('paymentMethod')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipt statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('number/:receiptNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipt by receipt number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('receiptNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "findByReceiptNumber", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipts by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipts retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipt by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update receipt' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, receipt_dto_1.UpdateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/allocate'),
    (0, swagger_1.ApiOperation)({ summary: 'Allocate receipt to invoices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt allocated to invoices' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, receipt_dto_1.AllocateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "allocate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete receipt' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "delete", null);
exports.ReceiptController = ReceiptController = __decorate([
    (0, swagger_1.ApiTags)('Receipts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('receipts'),
    __metadata("design:paramtypes", [receipt_service_1.ReceiptService])
], ReceiptController);
//# sourceMappingURL=receipt.controller.js.map