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
exports.BillingItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const billing_item_service_1 = require("../services/billing-item.service");
const billing_item_dto_1 = require("../dto/billing-item.dto");
let BillingItemController = class BillingItemController {
    billingItemService;
    constructor(billingItemService) {
        this.billingItemService = billingItemService;
    }
    async create(tenantId, dto) {
        return this.billingItemService.create(tenantId, dto);
    }
    async findAll(tenantId, itemType, chargeType, billingCodeType, isActive, includeGlobal) {
        const filters = {};
        if (itemType !== undefined)
            filters.itemType = itemType;
        if (chargeType !== undefined)
            filters.chargeType = chargeType;
        if (billingCodeType !== undefined)
            filters.billingCodeType = billingCodeType;
        if (isActive !== undefined)
            filters.isActive = isActive;
        if (includeGlobal !== undefined)
            filters.includeGlobal = includeGlobal;
        return this.billingItemService.findAll(tenantId, filters);
    }
    async getStatistics(tenantId) {
        return this.billingItemService.getStatistics(tenantId);
    }
    async findById(tenantId, id) {
        return this.billingItemService.findById(tenantId, id);
    }
    async update(tenantId, id, dto) {
        return this.billingItemService.update(tenantId, id, dto);
    }
    async delete(tenantId, id) {
        return this.billingItemService.delete(tenantId, id);
    }
    async hardDelete(tenantId, id) {
        return this.billingItemService.hardDelete(tenantId, id);
    }
};
exports.BillingItemController = BillingItemController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new billing item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Billing item created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_item_dto_1.CreateBillingItemDto]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all billing items for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'itemType', required: false, enum: billing_item_dto_1.ItemType }),
    (0, swagger_1.ApiQuery)({ name: 'chargeType', required: false, enum: billing_item_dto_1.ChargeType }),
    (0, swagger_1.ApiQuery)({ name: 'billingCodeType', required: false, enum: billing_item_dto_1.BillingCodeType }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'includeGlobal', required: false, type: Boolean, description: 'Include global items (tenantId = null)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing items retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('itemType')),
    __param(2, (0, common_1.Query)('chargeType')),
    __param(3, (0, common_1.Query)('billingCodeType')),
    __param(4, (0, common_1.Query)('isActive')),
    __param(5, (0, common_1.Query)('includeGlobal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing item statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing item found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update billing item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing item updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, billing_item_dto_1.UpdateBillingItemDto]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete (soft delete) billing item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing item soft deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete billing item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing item permanently deleted' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingItemController.prototype, "hardDelete", null);
exports.BillingItemController = BillingItemController = __decorate([
    (0, swagger_1.ApiTags)('Billing Items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('billing-items'),
    __metadata("design:paramtypes", [billing_item_service_1.BillingItemService])
], BillingItemController);
//# sourceMappingURL=billing-item.controller.js.map