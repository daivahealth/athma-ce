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
exports.ClinicalOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinical_orders_service_1 = require("../services/clinical-orders.service");
const clinical_order_dto_1 = require("../dto/clinical-order.dto");
let ClinicalOrdersController = class ClinicalOrdersController {
    clinicalOrdersService;
    constructor(clinicalOrdersService) {
        this.clinicalOrdersService = clinicalOrdersService;
    }
    async create(tenantId, dto) {
        return this.clinicalOrdersService.create(tenantId, dto);
    }
    async findById(tenantId, id) {
        return this.clinicalOrdersService.findById(tenantId, id);
    }
    async findByEncounter(tenantId, encounterId) {
        return this.clinicalOrdersService.findByEncounter(tenantId, encounterId);
    }
    async findByPatient(tenantId, patientId, limit) {
        return this.clinicalOrdersService.findByPatient(tenantId, patientId, limit);
    }
    async update(tenantId, id, dto) {
        return this.clinicalOrdersService.update(tenantId, id, dto);
    }
    async addResults(tenantId, id, dto) {
        return this.clinicalOrdersService.addResults(tenantId, id, dto);
    }
    async cancel(tenantId, id) {
        return this.clinicalOrdersService.cancel(tenantId, id);
    }
    async delete(tenantId, id) {
        return this.clinicalOrdersService.delete(tenantId, id);
    }
};
exports.ClinicalOrdersController = ClinicalOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clinical order (lab, imaging, procedure)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully', type: clinical_order_dto_1.ClinicalOrderResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, clinical_order_dto_1.CreateClinicalOrderDto]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get clinical order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order found', type: clinical_order_dto_1.ClinicalOrderResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved', type: [clinical_order_dto_1.ClinicalOrderResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "findByEncounter", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved', type: [clinical_order_dto_1.ClinicalOrderResponseDto] }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated', type: clinical_order_dto_1.ClinicalOrderResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, clinical_order_dto_1.UpdateClinicalOrderDto]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/results'),
    (0, swagger_1.ApiOperation)({ summary: 'Add order results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results added', type: clinical_order_dto_1.ClinicalOrderResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, clinical_order_dto_1.AddOrderResultDto]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "addResults", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled', type: clinical_order_dto_1.ClinicalOrderResponseDto }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicalOrdersController.prototype, "delete", null);
exports.ClinicalOrdersController = ClinicalOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Clinical Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical-orders'),
    __metadata("design:paramtypes", [clinical_orders_service_1.ClinicalOrdersService])
], ClinicalOrdersController);
//# sourceMappingURL=clinical-orders.controller.js.map