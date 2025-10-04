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
import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto } from './dto/tenant.dto';
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async create(createTenantDto) {
        const tenant = await this.tenantService.createTenant(createTenantDto);
        return {
            data: tenant,
            message: 'Tenant created successfully'
        };
    }
    async findAll(searchDto, pagination) {
        const { tenants, total } = await this.tenantService.searchTenants(searchDto, pagination);
        return {
            data: tenants,
            pagination: {
                total,
                page: pagination.page || 1,
                limit: pagination.limit || 20,
                totalPages: Math.ceil(total / (pagination.limit || 20)),
            },
        };
    }
    async getActiveTenants() {
        const tenants = await this.tenantService.getActiveTenants();
        return {
            data: tenants,
            message: 'Active tenants retrieved successfully'
        };
    }
    async findOne(id) {
        const tenant = await this.tenantService.getTenantById(id);
        return {
            data: tenant,
            message: 'Tenant retrieved successfully'
        };
    }
    async getTenantStats(id) {
        const stats = await this.tenantService.getTenantStats(id);
        return {
            data: stats,
            message: 'Tenant statistics retrieved successfully'
        };
    }
    async findByDomain(domain) {
        const tenant = await this.tenantService.getTenantByDomain(domain);
        return {
            data: tenant,
            message: 'Tenant retrieved successfully'
        };
    }
    async update(id, updateTenantDto) {
        const tenant = await this.tenantService.updateTenant(id, updateTenantDto);
        return {
            data: tenant,
            message: 'Tenant updated successfully'
        };
    }
    async remove(id) {
        await this.tenantService.deleteTenant(id);
    }
    async checkExists(id) {
        const exists = await this.tenantService.tenantExists(id);
        return {
            data: { exists },
            message: 'Tenant existence checked'
        };
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Create a new tenant' }),
    ApiResponse({ status: 201, description: 'Tenant created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all tenants with pagination and search' }),
    ApiResponse({ status: 200, description: 'Tenants retrieved successfully' }),
    __param(0, Query()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TenantSearchDto, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "findAll", null);
__decorate([
    Get('active'),
    ApiOperation({ summary: 'Get all active tenants' }),
    ApiResponse({ status: 200, description: 'Active tenants retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getActiveTenants", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get tenant by ID' }),
    ApiParam({ name: 'id', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Tenant retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "findOne", null);
__decorate([
    Get(':id/stats'),
    ApiOperation({ summary: 'Get tenant statistics' }),
    ApiParam({ name: 'id', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Tenant statistics retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getTenantStats", null);
__decorate([
    Get('domain/:domain'),
    ApiOperation({ summary: 'Get tenant by domain' }),
    ApiParam({ name: 'domain', description: 'Tenant domain' }),
    ApiResponse({ status: 200, description: 'Tenant retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    __param(0, Param('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "findByDomain", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update tenant' }),
    ApiParam({ name: 'id', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Tenant updated successfully' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete tenant (soft delete)' }),
    ApiParam({ name: 'id', description: 'Tenant ID' }),
    ApiResponse({ status: 204, description: 'Tenant deleted successfully' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    ApiResponse({ status: 400, description: 'Cannot delete tenant with active data' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "remove", null);
__decorate([
    Get(':id/exists'),
    ApiOperation({ summary: 'Check if tenant exists' }),
    ApiParam({ name: 'id', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Tenant existence checked' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkExists", null);
TenantController = __decorate([
    ApiTags('Tenants'),
    Controller('tenants'),
    __metadata("design:paramtypes", [TenantService])
], TenantController);
export { TenantController };
//# sourceMappingURL=tenant.controller.js.map