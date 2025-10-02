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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto, RbacStatsDto } from './dto/rbac.dto';
import { ApiResponse as ApiResponseType } from '@zeal/contracts';
import { Role, Permission, UserRole, RolePermission } from '@prisma/client';
let RbacController = (() => {
    let _classDecorators = [ApiTags('RBAC'), Controller('rbac')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRole_decorators;
    let _getRolesByTenant_decorators;
    let _getRoleById_decorators;
    let _updateRole_decorators;
    let _deleteRole_decorators;
    let _createPermission_decorators;
    let _getAllPermissions_decorators;
    let _getPermissionsByResource_decorators;
    let _getPermissionById_decorators;
    let _assignPermissionToRole_decorators;
    let _removePermissionFromRole_decorators;
    let _getRolePermissions_decorators;
    let _assignRoleToUser_decorators;
    let _removeRoleFromUser_decorators;
    let _getUserRoles_decorators;
    let _getUserPermissions_decorators;
    let _userHasPermission_decorators;
    let _getRbacStats_decorators;
    var RbacController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createRole_decorators = [Post('roles'), ApiOperation({ summary: 'Create a new role' }), ApiResponse({ status: 201, description: 'Role created successfully' }), ApiResponse({ status: 400, description: 'Invalid input data' }), ApiResponse({ status: 404, description: 'Tenant not found' }), ApiResponse({ status: 409, description: 'Role with this code already exists in tenant' })];
            _getRolesByTenant_decorators = [Get('roles/tenant/:tenantId'), ApiOperation({ summary: 'Get roles for a tenant' }), ApiParam({ name: 'tenantId', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'Roles retrieved successfully' })];
            _getRoleById_decorators = [Get('roles/:id'), ApiOperation({ summary: 'Get role by ID' }), ApiParam({ name: 'id', description: 'Role ID' }), ApiResponse({ status: 200, description: 'Role retrieved successfully' }), ApiResponse({ status: 404, description: 'Role not found' })];
            _updateRole_decorators = [Put('roles/:id'), ApiOperation({ summary: 'Update role' }), ApiParam({ name: 'id', description: 'Role ID' }), ApiResponse({ status: 200, description: 'Role updated successfully' }), ApiResponse({ status: 400, description: 'Cannot update system roles' }), ApiResponse({ status: 404, description: 'Role not found' })];
            _deleteRole_decorators = [Delete('roles/:id'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: 'Delete role' }), ApiParam({ name: 'id', description: 'Role ID' }), ApiResponse({ status: 204, description: 'Role deleted successfully' }), ApiResponse({ status: 400, description: 'Cannot delete system roles or roles assigned to users' }), ApiResponse({ status: 404, description: 'Role not found' })];
            _createPermission_decorators = [Post('permissions'), ApiOperation({ summary: 'Create a new permission' }), ApiResponse({ status: 201, description: 'Permission created successfully' }), ApiResponse({ status: 400, description: 'Invalid input data' }), ApiResponse({ status: 409, description: 'Permission with this code already exists' })];
            _getAllPermissions_decorators = [Get('permissions'), ApiOperation({ summary: 'Get all permissions' }), ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })];
            _getPermissionsByResource_decorators = [Get('permissions/resource/:resource'), ApiOperation({ summary: 'Get permissions by resource' }), ApiParam({ name: 'resource', description: 'Resource name' }), ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })];
            _getPermissionById_decorators = [Get('permissions/:id'), ApiOperation({ summary: 'Get permission by ID' }), ApiParam({ name: 'id', description: 'Permission ID' }), ApiResponse({ status: 200, description: 'Permission retrieved successfully' }), ApiResponse({ status: 404, description: 'Permission not found' })];
            _assignPermissionToRole_decorators = [Post('roles/:roleId/permissions/:permissionId'), ApiOperation({ summary: 'Assign permission to role' }), ApiParam({ name: 'roleId', description: 'Role ID' }), ApiParam({ name: 'permissionId', description: 'Permission ID' }), ApiResponse({ status: 201, description: 'Permission assigned to role successfully' }), ApiResponse({ status: 404, description: 'Role or permission not found' }), ApiResponse({ status: 409, description: 'Permission already assigned to role' })];
            _removePermissionFromRole_decorators = [Delete('roles/:roleId/permissions/:permissionId'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: 'Remove permission from role' }), ApiParam({ name: 'roleId', description: 'Role ID' }), ApiParam({ name: 'permissionId', description: 'Permission ID' }), ApiResponse({ status: 204, description: 'Permission removed from role successfully' }), ApiResponse({ status: 404, description: 'Permission assignment not found' })];
            _getRolePermissions_decorators = [Get('roles/:roleId/permissions'), ApiOperation({ summary: 'Get role permissions' }), ApiParam({ name: 'roleId', description: 'Role ID' }), ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' })];
            _assignRoleToUser_decorators = [Post('user-roles'), ApiOperation({ summary: 'Assign role to user' }), ApiResponse({ status: 201, description: 'Role assigned to user successfully' }), ApiResponse({ status: 404, description: 'User or role not found' }), ApiResponse({ status: 409, description: 'Role already assigned to user' })];
            _removeRoleFromUser_decorators = [Delete('user-roles/:userId/:roleId'), HttpCode(HttpStatus.NO_CONTENT), ApiOperation({ summary: 'Remove role from user' }), ApiParam({ name: 'userId', description: 'User ID' }), ApiParam({ name: 'roleId', description: 'Role ID' }), ApiResponse({ status: 204, description: 'Role removed from user successfully' }), ApiResponse({ status: 404, description: 'Role assignment not found' })];
            _getUserRoles_decorators = [Get('users/:userId/roles'), ApiOperation({ summary: 'Get user roles' }), ApiParam({ name: 'userId', description: 'User ID' }), ApiResponse({ status: 200, description: 'User roles retrieved successfully' })];
            _getUserPermissions_decorators = [Get('users/:userId/permissions'), ApiOperation({ summary: 'Get user permissions' }), ApiParam({ name: 'userId', description: 'User ID' }), ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })];
            _userHasPermission_decorators = [Get('users/:userId/permissions/:permissionCode'), ApiOperation({ summary: 'Check if user has permission' }), ApiParam({ name: 'userId', description: 'User ID' }), ApiParam({ name: 'permissionCode', description: 'Permission code' }), ApiResponse({ status: 200, description: 'Permission check completed' })];
            _getRbacStats_decorators = [Get('stats/tenant/:tenantId'), ApiOperation({ summary: 'Get RBAC statistics for tenant' }), ApiParam({ name: 'tenantId', description: 'Tenant ID' }), ApiResponse({ status: 200, description: 'RBAC statistics retrieved successfully' })];
            __esDecorate(this, null, _createRole_decorators, { kind: "method", name: "createRole", static: false, private: false, access: { has: obj => "createRole" in obj, get: obj => obj.createRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRolesByTenant_decorators, { kind: "method", name: "getRolesByTenant", static: false, private: false, access: { has: obj => "getRolesByTenant" in obj, get: obj => obj.getRolesByTenant }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRoleById_decorators, { kind: "method", name: "getRoleById", static: false, private: false, access: { has: obj => "getRoleById" in obj, get: obj => obj.getRoleById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateRole_decorators, { kind: "method", name: "updateRole", static: false, private: false, access: { has: obj => "updateRole" in obj, get: obj => obj.updateRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteRole_decorators, { kind: "method", name: "deleteRole", static: false, private: false, access: { has: obj => "deleteRole" in obj, get: obj => obj.deleteRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createPermission_decorators, { kind: "method", name: "createPermission", static: false, private: false, access: { has: obj => "createPermission" in obj, get: obj => obj.createPermission }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAllPermissions_decorators, { kind: "method", name: "getAllPermissions", static: false, private: false, access: { has: obj => "getAllPermissions" in obj, get: obj => obj.getAllPermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPermissionsByResource_decorators, { kind: "method", name: "getPermissionsByResource", static: false, private: false, access: { has: obj => "getPermissionsByResource" in obj, get: obj => obj.getPermissionsByResource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPermissionById_decorators, { kind: "method", name: "getPermissionById", static: false, private: false, access: { has: obj => "getPermissionById" in obj, get: obj => obj.getPermissionById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _assignPermissionToRole_decorators, { kind: "method", name: "assignPermissionToRole", static: false, private: false, access: { has: obj => "assignPermissionToRole" in obj, get: obj => obj.assignPermissionToRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _removePermissionFromRole_decorators, { kind: "method", name: "removePermissionFromRole", static: false, private: false, access: { has: obj => "removePermissionFromRole" in obj, get: obj => obj.removePermissionFromRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRolePermissions_decorators, { kind: "method", name: "getRolePermissions", static: false, private: false, access: { has: obj => "getRolePermissions" in obj, get: obj => obj.getRolePermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _assignRoleToUser_decorators, { kind: "method", name: "assignRoleToUser", static: false, private: false, access: { has: obj => "assignRoleToUser" in obj, get: obj => obj.assignRoleToUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _removeRoleFromUser_decorators, { kind: "method", name: "removeRoleFromUser", static: false, private: false, access: { has: obj => "removeRoleFromUser" in obj, get: obj => obj.removeRoleFromUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getUserRoles_decorators, { kind: "method", name: "getUserRoles", static: false, private: false, access: { has: obj => "getUserRoles" in obj, get: obj => obj.getUserRoles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getUserPermissions_decorators, { kind: "method", name: "getUserPermissions", static: false, private: false, access: { has: obj => "getUserPermissions" in obj, get: obj => obj.getUserPermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _userHasPermission_decorators, { kind: "method", name: "userHasPermission", static: false, private: false, access: { has: obj => "userHasPermission" in obj, get: obj => obj.userHasPermission }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRbacStats_decorators, { kind: "method", name: "getRbacStats", static: false, private: false, access: { has: obj => "getRbacStats" in obj, get: obj => obj.getRbacStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RbacController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        rbacService = __runInitializers(this, _instanceExtraInitializers);
        constructor(rbacService) {
            this.rbacService = rbacService;
        }
        // ============================================================================
        // ROLE ENDPOINTS
        // ============================================================================
        async createRole(createRoleDto) {
            const role = await this.rbacService.createRole(createRoleDto);
            return {
                data: role,
                message: 'Role created successfully'
            };
        }
        async getRolesByTenant(tenantId) {
            const roles = await this.rbacService.getRolesByTenant(tenantId);
            return {
                data: roles,
                message: 'Roles retrieved successfully'
            };
        }
        async getRoleById(id) {
            const role = await this.rbacService.getRoleById(id);
            return {
                data: role,
                message: 'Role retrieved successfully'
            };
        }
        async updateRole(id, updateRoleDto) {
            const role = await this.rbacService.updateRole(id, updateRoleDto);
            return {
                data: role,
                message: 'Role updated successfully'
            };
        }
        async deleteRole(id) {
            await this.rbacService.deleteRole(id);
        }
        // ============================================================================
        // PERMISSION ENDPOINTS
        // ============================================================================
        async createPermission(createPermissionDto) {
            const permission = await this.rbacService.createPermission(createPermissionDto);
            return {
                data: permission,
                message: 'Permission created successfully'
            };
        }
        async getAllPermissions() {
            const permissions = await this.rbacService.getAllPermissions();
            return {
                data: permissions,
                message: 'Permissions retrieved successfully'
            };
        }
        async getPermissionsByResource(resource) {
            const permissions = await this.rbacService.getPermissionsByResource(resource);
            return {
                data: permissions,
                message: 'Permissions retrieved successfully'
            };
        }
        async getPermissionById(id) {
            const permission = await this.rbacService.getPermissionById(id);
            return {
                data: permission,
                message: 'Permission retrieved successfully'
            };
        }
        // ============================================================================
        // ROLE-PERMISSION ENDPOINTS
        // ============================================================================
        async assignPermissionToRole(roleId, permissionId) {
            const rolePermission = await this.rbacService.assignPermissionToRole(roleId, permissionId);
            return {
                data: rolePermission,
                message: 'Permission assigned to role successfully'
            };
        }
        async removePermissionFromRole(roleId, permissionId) {
            await this.rbacService.removePermissionFromRole(roleId, permissionId);
        }
        async getRolePermissions(roleId) {
            const permissions = await this.rbacService.getRolePermissions(roleId);
            return {
                data: permissions,
                message: 'Role permissions retrieved successfully'
            };
        }
        // ============================================================================
        // USER-ROLE ENDPOINTS
        // ============================================================================
        async assignRoleToUser(assignRoleDto) {
            const userRole = await this.rbacService.assignRoleToUser(assignRoleDto);
            return {
                data: userRole,
                message: 'Role assigned to user successfully'
            };
        }
        async removeRoleFromUser(userId, roleId) {
            await this.rbacService.removeRoleFromUser(userId, roleId);
        }
        async getUserRoles(userId) {
            const roles = await this.rbacService.getUserRoles(userId);
            return {
                data: roles,
                message: 'User roles retrieved successfully'
            };
        }
        async getUserPermissions(userId) {
            const permissions = await this.rbacService.getUserPermissions(userId);
            return {
                data: permissions,
                message: 'User permissions retrieved successfully'
            };
        }
        async userHasPermission(userId, permissionCode) {
            const hasPermission = await this.rbacService.userHasPermission(userId, permissionCode);
            return {
                data: { hasPermission },
                message: 'Permission check completed'
            };
        }
        // ============================================================================
        // STATISTICS ENDPOINTS
        // ============================================================================
        async getRbacStats(tenantId) {
            const stats = await this.rbacService.getRbacStats(tenantId);
            return {
                data: stats,
                message: 'RBAC statistics retrieved successfully'
            };
        }
    };
    return RbacController = _classThis;
})();
export { RbacController };
//# sourceMappingURL=rbac.controller.js.map