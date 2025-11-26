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
exports.ChargeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const charge_service_1 = require("../services/charge.service");
const charge_dto_1 = require("../dto/charge.dto");
let ChargeController = class ChargeController {
    chargeService;
    constructor(chargeService) {
        this.chargeService = chargeService;
    }
    async create(tenantId, dto) {
        return this.chargeService.create(tenantId, dto);
    }
    async createBulk(tenantId, dtos) {
        return this.chargeService.createBulk(tenantId, dtos);
    }
    async findAll(tenantId, patientId, encounterId, status, sourceType, dateFrom, dateTo) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (encounterId !== undefined)
            filters.encounterId = encounterId;
        if (status !== undefined)
            filters.status = status;
        if (sourceType !== undefined)
            filters.sourceType = sourceType;
        if (dateFrom !== undefined)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo !== undefined)
            filters.dateTo = new Date(dateTo);
        return this.chargeService.findAll(tenantId, filters);
    }
    async getStatistics(tenantId, patientId, encounterId) {
        const filters = {};
        if (patientId !== undefined)
            filters.patientId = patientId;
        if (encounterId !== undefined)
            filters.encounterId = encounterId;
        return this.chargeService.getStatistics(tenantId, filters);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.chargeService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId) {
        return this.chargeService.findByPatient(tenantId, patientId);
    }
    async findById(tenantId, id) {
        return this.chargeService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.chargeService.update(tenantId, id, dto);
    }
    async cancel(tenantId, id) {
        return this.chargeService.cancel(tenantId, id);
    }
    async delete(tenantId, id) {
        return this.chargeService.delete(tenantId, id);
    }
};
exports.ChargeController = ChargeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new charge' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Charge created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, charge_dto_1.CreateChargeDto]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple charges' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Charges created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all charges for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: charge_dto_1.ChargeStatus }),
    (0, swagger_1.ApiQuery)({ name: 'sourceType', required: false, enum: charge_dto_1.ChargeSourceType }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charges retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('encounterId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('sourceType')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charge statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'encounterId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charges by encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charges retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charges by patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charges retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charge by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charge found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update charge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charge updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, charge_dto_1.UpdateChargeDto]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel charge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charge cancelled' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete charge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Charge deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "delete", null);
exports.ChargeController = ChargeController = __decorate([
    (0, swagger_1.ApiTags)('Charges'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('charges'),
    __metadata("design:paramtypes", [charge_service_1.ChargeService])
], ChargeController);
//# sourceMappingURL=charge.controller.js.map