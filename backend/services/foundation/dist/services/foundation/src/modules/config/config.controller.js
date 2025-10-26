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
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("./config.service");
const set_config_dto_1 = require("./dto/set-config.dto");
let ConfigController = class ConfigController {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * Resolve a config value for the current context
     * GET /api/v1/configs/resolve?key=locale.timezone
     */
    async resolve(key, tenantId, facilityId) {
        const context = {};
        if (tenantId)
            context.tenantId = tenantId;
        if (facilityId)
            context.facilityId = facilityId;
        return this.configService.resolve(key, context);
    }
    /**
     * Get all effective configs for current context
     * GET /api/v1/configs/effective
     */
    async getEffective(tenantId, facilityId) {
        const context = {};
        if (tenantId)
            context.tenantId = tenantId;
        if (facilityId)
            context.facilityId = facilityId;
        return this.configService.getEffectiveConfigs(context);
    }
    /**
     * Get config schema (all available keys)
     * GET /api/v1/configs/schema
     */
    async getSchema() {
        return this.configService.getConfigSchema();
    }
    // ===================================
    // Instance Config Endpoints
    // ===================================
    /**
     * Get all instance configs
     * GET /api/v1/configs/instance
     */
    async getAllInstanceConfigs() {
        return this.configService.getAllInstanceConfigs();
    }
    /**
     * Get specific instance config
     * GET /api/v1/configs/instance/:key
     */
    async getInstanceConfig(key) {
        return this.configService.getInstanceConfig(key);
    }
    /**
     * Update instance config (admin only)
     * PUT /api/v1/configs/instance/:key
     */
    async setInstanceConfig(key, dto, userId) {
        return this.configService.setInstanceConfig(key, dto.value, userId, dto.changeReason);
    }
    // ===================================
    // Tenant Config Endpoints
    // ===================================
    /**
     * Get all configs for a tenant
     * GET /api/v1/configs/tenant/:tenantId
     */
    async getTenantConfigs(tenantId) {
        return this.configService.getTenantConfigs(tenantId);
    }
    /**
     * Set tenant config
     * PUT /api/v1/configs/tenant/:tenantId/:key
     */
    async setTenantConfig(tenantId, key, dto, userId) {
        return this.configService.setTenantConfig(tenantId, key, dto.value, userId, dto.changeReason);
    }
    /**
     * Delete tenant config (revert to instance default)
     * DELETE /api/v1/configs/tenant/:tenantId/:key
     */
    async deleteTenantConfig(tenantId, key, userId, changeReason) {
        await this.configService.deleteTenantConfig(tenantId, key, userId, changeReason);
        return { message: 'Tenant config deleted, reverted to instance default' };
    }
    // ===================================
    // Facility Config Endpoints
    // ===================================
    /**
     * Get all configs for a facility
     * GET /api/v1/configs/facility/:facilityId
     */
    async getFacilityConfigs(facilityId) {
        return this.configService.getFacilityConfigs(facilityId);
    }
    /**
     * Set facility config
     * PUT /api/v1/configs/facility/:facilityId/:key
     */
    async setFacilityConfig(facilityId, key, dto, userId) {
        return this.configService.setFacilityConfig(facilityId, key, dto.value, userId, dto.changeReason);
    }
    /**
     * Delete facility config (revert to tenant/instance default)
     * DELETE /api/v1/configs/facility/:facilityId/:key
     */
    async deleteFacilityConfig(facilityId, key, userId, changeReason) {
        await this.configService.deleteFacilityConfig(facilityId, key, userId, changeReason);
        return { message: 'Facility config deleted, reverted to tenant/instance default' };
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Get)('resolve'),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Headers)('x-tenant-id')),
    __param(2, (0, common_1.Headers)('x-facility-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "resolve", null);
__decorate([
    (0, common_1.Get)('effective'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Headers)('x-facility-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getEffective", null);
__decorate([
    (0, common_1.Get)('schema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getSchema", null);
__decorate([
    (0, common_1.Get)('instance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getAllInstanceConfigs", null);
__decorate([
    (0, common_1.Get)('instance/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getInstanceConfig", null);
__decorate([
    (0, common_1.Put)('instance/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_config_dto_1.SetConfigDto, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "setInstanceConfig", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getTenantConfigs", null);
__decorate([
    (0, common_1.Put)('tenant/:tenantId/:key'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_config_dto_1.SetConfigDto, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "setTenantConfig", null);
__decorate([
    (0, common_1.Delete)('tenant/:tenantId/:key'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Headers)('x-user-id')),
    __param(3, (0, common_1.Body)('changeReason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deleteTenantConfig", null);
__decorate([
    (0, common_1.Get)('facility/:facilityId'),
    __param(0, (0, common_1.Param)('facilityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getFacilityConfigs", null);
__decorate([
    (0, common_1.Put)('facility/:facilityId/:key'),
    __param(0, (0, common_1.Param)('facilityId')),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_config_dto_1.SetConfigDto, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "setFacilityConfig", null);
__decorate([
    (0, common_1.Delete)('facility/:facilityId/:key'),
    __param(0, (0, common_1.Param)('facilityId')),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Headers)('x-user-id')),
    __param(3, (0, common_1.Body)('changeReason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deleteFacilityConfig", null);
exports.ConfigController = ConfigController = __decorate([
    (0, common_1.Controller)('configs'),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ConfigController);
//# sourceMappingURL=config.controller.js.map