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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_service_1 = require("../services/invoice.service");
const invoice_dto_1 = require("../dto/invoice.dto");
let InvoiceController = class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async create(tenantId, dto) {
        return this.invoiceService.create(tenantId, dto);
    }
    async findAll(tenantId, patientId, encounterId, status, dateFrom, dateTo) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (encounterId !== undefined)
            filters.encounterId = encounterId;
        if (status !== undefined)
            filters.status = status;
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.invoiceService.findAll(tenantId, filters);
    }
    async getStatistics(tenantId, patientId, encounterId) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (encounterId !== undefined)
            filters.encounterId = encounterId;
        return this.invoiceService.getStatistics(tenantId, filters);
    }
    async findByInvoiceNumber(tenantId, invoiceNumber) {
        return this.invoiceService.findByInvoiceNumber(tenantId, invoiceNumber);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.invoiceService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId) {
        return this.invoiceService.findByPatient(tenantId, patientId);
    }
    async findById(tenantId, id) {
        return this.invoiceService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.invoiceService.update(tenantId, id, dto);
    }
    async updateStatus(tenantId, id, dto) {
        return this.invoiceService.updateStatus(tenantId, id, dto);
    }
    async recordPayment(tenantId, id, dto) {
        return this.invoiceService.recordPayment(tenantId, id, dto);
    }
    async cancel(tenantId, id) {
        return this.invoiceService.cancel(tenantId, id);
    }
    async delete(tenantId, id) {
        return this.invoiceService.delete(tenantId, id);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new invoice with lines' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invoice created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all invoices for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: invoice_dto_1.InvoiceStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoices retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('encounterId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('number/:invoiceNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice by invoice number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findByInvoiceNumber", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoices by encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoices retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoices by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoices retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update invoice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invoice_dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update invoice status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice status updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invoice_dto_1.UpdateInvoiceStatusDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Record payment for invoice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment recorded' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invoice_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel invoice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice cancelled' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete invoice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "delete", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map