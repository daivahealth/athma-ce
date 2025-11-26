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
exports.FeeScheduleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fee_schedule_service_1 = require("../services/fee-schedule.service");
const fee_schedule_dto_1 = require("../dto/fee-schedule.dto");
let FeeScheduleController = class FeeScheduleController {
    feeScheduleService;
    constructor(feeScheduleService) {
        this.feeScheduleService = feeScheduleService;
    }
    // ==================== FEE SCHEDULE ENDPOINTS ====================
    async createFeeSchedule(tenantId, dto) {
        return this.feeScheduleService.createFeeSchedule(tenantId, dto);
    }
    async findAllFeeSchedules(tenantId, scheduleType, status, authorityCode, effectiveDate) {
        const filters = {};
        if (scheduleType !== undefined)
            filters.scheduleType = scheduleType;
        if (status !== undefined)
            filters.status = status;
        if (authorityCode !== undefined)
            filters.authorityCode = authorityCode;
        if (effectiveDate !== undefined)
            filters.effectiveDate = new Date(effectiveDate);
        return this.feeScheduleService.findAllFeeSchedules(tenantId, filters);
    }
    async findFeeScheduleById(tenantId, id) {
        return this.feeScheduleService.findFeeScheduleById(tenantId, id);
    }
    async updateFeeSchedule(tenantId, id, dto) {
        return this.feeScheduleService.updateFeeSchedule(tenantId, id, dto);
    }
    async deleteFeeSchedule(tenantId, id) {
        return this.feeScheduleService.deleteFeeSchedule(tenantId, id);
    }
    // ==================== FEE SCHEDULE ITEM ENDPOINTS ====================
    async createFeeScheduleItem(tenantId, dto) {
        return this.feeScheduleService.createFeeScheduleItem(tenantId, dto);
    }
    async bulkCreateFeeScheduleItems(tenantId, dto) {
        return this.feeScheduleService.bulkCreateFeeScheduleItems(tenantId, dto);
    }
    async findFeeScheduleItems(feeScheduleId, code, codeType, serviceGroup) {
        const filters = {};
        if (code !== undefined)
            filters.code = code;
        if (codeType !== undefined)
            filters.codeType = codeType;
        if (serviceGroup !== undefined)
            filters.serviceGroup = serviceGroup;
        return this.feeScheduleService.findFeeScheduleItems(feeScheduleId, filters);
    }
    async findFeeScheduleItemById(id) {
        return this.feeScheduleService.findFeeScheduleItemById(id);
    }
    async updateFeeScheduleItem(id, dto) {
        return this.feeScheduleService.updateFeeScheduleItem(id, dto);
    }
    async deleteFeeScheduleItem(id) {
        return this.feeScheduleService.deleteFeeScheduleItem(id);
    }
    // ==================== PRICE LOOKUP ENDPOINTS ====================
    async lookupPrice(tenantId, dto) {
        const result = await this.feeScheduleService.lookupPrice(tenantId, dto);
        if (!result) {
            return {
                message: `Price not found for code ${dto.code} (${dto.codeType})`,
                code: dto.code,
                codeType: dto.codeType,
            };
        }
        return result;
    }
    async getPriceForCode(tenantId, codeType, code, effectiveDate) {
        const date = effectiveDate ? new Date(effectiveDate) : undefined;
        const price = await this.feeScheduleService.getPriceForCode(tenantId, code, codeType, date);
        if (price === null) {
            return {
                message: `Price not found for code ${code} (${codeType})`,
                code,
                codeType,
                price: null,
            };
        }
        return {
            code,
            codeType,
            price,
            currency: 'AED',
        };
    }
};
exports.FeeScheduleController = FeeScheduleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fee schedule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fee schedule created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_schedule_dto_1.CreateFeeScheduleDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "createFeeSchedule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fee schedules' }),
    (0, swagger_1.ApiQuery)({ name: 'scheduleType', required: false, enum: fee_schedule_dto_1.FeeScheduleType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: fee_schedule_dto_1.FeeScheduleStatus }),
    (0, swagger_1.ApiQuery)({ name: 'authorityCode', required: false, enum: fee_schedule_dto_1.AuthorityCode }),
    (0, swagger_1.ApiQuery)({ name: 'effectiveDate', required: false, type: Date, description: 'Filter by effective date (ISO 8601 format)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedules retrieved' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('scheduleType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('authorityCode')),
    __param(4, (0, common_1.Query)('effectiveDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "findAllFeeSchedules", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fee schedule by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "findFeeScheduleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update fee schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule updated' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, fee_schedule_dto_1.UpdateFeeScheduleDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "updateFeeSchedule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete fee schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule deleted successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "deleteFeeSchedule", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fee schedule item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fee schedule item created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_schedule_dto_1.CreateFeeScheduleItemDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "createFeeScheduleItem", null);
__decorate([
    (0, common_1.Post)('items/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk create fee schedule items' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fee schedule items created successfully' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_schedule_dto_1.BulkCreateFeeScheduleItemsDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "bulkCreateFeeScheduleItems", null);
__decorate([
    (0, common_1.Get)(':feeScheduleId/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all items for a fee schedule' }),
    (0, swagger_1.ApiQuery)({ name: 'code', required: false, type: String, description: 'Filter by code' }),
    (0, swagger_1.ApiQuery)({ name: 'codeType', required: false, enum: fee_schedule_dto_1.FeeScheduleCodeType, description: 'Filter by code type' }),
    (0, swagger_1.ApiQuery)({ name: 'serviceGroup', required: false, type: String, description: 'Filter by service group' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule items retrieved' }),
    __param(0, (0, common_1.Param)('feeScheduleId')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Query)('codeType')),
    __param(3, (0, common_1.Query)('serviceGroup')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "findFeeScheduleItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fee schedule item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule item found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "findFeeScheduleItemById", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update fee schedule item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule item updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_schedule_dto_1.UpdateFeeScheduleItemDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "updateFeeScheduleItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete fee schedule item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee schedule item deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "deleteFeeScheduleItem", null);
__decorate([
    (0, common_1.Post)('lookup-price'),
    (0, swagger_1.ApiOperation)({ summary: 'Lookup price for a billing code with hierarchical resolution' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Price not found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_schedule_dto_1.PriceLookupDto]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "lookupPrice", null);
__decorate([
    (0, common_1.Get)('price/:codeType/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price for a billing code (simple lookup)' }),
    (0, swagger_1.ApiQuery)({ name: 'effectiveDate', required: false, type: Date, description: 'Effective date for price lookup (ISO 8601 format)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price found' }),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('codeType')),
    __param(2, (0, common_1.Param)('code')),
    __param(3, (0, common_1.Query)('effectiveDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FeeScheduleController.prototype, "getPriceForCode", null);
exports.FeeScheduleController = FeeScheduleController = __decorate([
    (0, swagger_1.ApiTags)('Fee Schedules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('fee-schedules'),
    __metadata("design:paramtypes", [fee_schedule_service_1.FeeScheduleService])
], FeeScheduleController);
//# sourceMappingURL=fee-schedule.controller.js.map