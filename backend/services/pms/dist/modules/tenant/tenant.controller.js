var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto, TenantStatsDto } from './dto/tenant.dto';
let TenantController = (() => {
    let _classDecorators = [ApiTags('Tenants'), Controller('tenants')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _getActiveTenants_decorators;
    let _findOne_decorators;
    let _getTenantStats_decorators;
    let _findByDomain_decorators;
    let _update_decorators;
    let _remove_decorators;
    let _checkExists_decorators;
    var TenantController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _create_decorators = [Post(), ApiOperation({ summary: 'Create a new tenant' }), ApiResponse({ status: 201, description: 'Tenant created successfully' }), ApiResponse({ status: 400, description: 'Invalid input data' }), ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' })];
            _findAll_decorators = [Get(), ApiOperation({ summary: 'Get all tenants with pagination and search' }), ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })];
            _getActiveTenants_decorators = [Get('active'), ApiOperation({ summary: 'Get all active tenants' }), ApiResponse({ status: 200, description: 'Active tenants retrieved successfully' })];
            _findOne_decorators = [Get(':id'), ApiOperation({ summary: 'Get tenant by ID' }), ApiParam({ name: 'id', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'Tenant retrieved successfully' }), ApiResponse({ status: 404, description: 'Tenant not found' })];
            _getTenantStats_decorators = [Get(':id/stats'), ApiOperation({ summary: 'Get tenant statistics' }), ApiParam({ name: 'id', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'Tenant statistics retrieved successfully' }), ApiResponse({ status: 404, description: 'Tenant not found' })];
            _findByDomain_decorators = [Get('domain/:domain'), ApiOperation({ summary: 'Get tenant by domain' }), ApiParam({ name: 'domain', description: 'Tenant domain' }), ApiResponse({ status: 200, description: 'Tenant retrieved successfully' }), ApiResponse({ status: 404, description: 'Tenant not found' })];
            _update_decorators = [Put(':id'), ApiOperation({ summary: 'Update tenant' }), ApiParam({ name: 'id', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'Tenant updated successfully' }), ApiResponse({ status: 404, description: 'Tenant not found' }), ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' })];
            _remove_decorators = [Delete(':id'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: 'Delete tenant (soft delete)' }), ApiParam({ name: 'id', description: 'Tenant ID' }), ApiResponse({ status: 204, description: 'Tenant deleted successfully' }), ApiResponse({ status: 404, description: 'Tenant not found' }), ApiResponse({ status: 400, description: 'Cannot delete tenant with active data' })];
            _checkExists_decorators = [Get(':id/exists'), ApiOperation({ summary: 'Check if tenant exists' }), ApiParam({ name: 'id', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'Tenant existence checked' })];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getActiveTenants_decorators, { kind: "method", name: "getActiveTenants", static: false, private: false, access: { has: obj => "getActiveTenants" in obj, get: obj => obj.getActiveTenants }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTenantStats_decorators, { kind: "method", name: "getTenantStats", static: false, private: false, access: { has: obj => "getTenantStats" in obj, get: obj => obj.getTenantStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findByDomain_decorators, { kind: "method", name: "findByDomain", static: false, private: false, access: { has: obj => "findByDomain" in obj, get: obj => obj.findByDomain }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkExists_decorators, { kind: "method", name: "checkExists", static: false, private: false, access: { has: obj => "checkExists" in obj, get: obj => obj.checkExists }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        tenantService = __runInitializers(this, _instanceExtraInitializers);
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
    return TenantController = _classThis;
})();
export { TenantController };
//# sourceMappingURL=tenant.controller.js.map