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
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto } from './dto/rbac.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
let RbacController = class RbacController {
    rbacService;
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
__decorate([
    Post('roles'),
    Permissions('admin.roles.manage'),
    ApiOperation({ summary: 'Create a new role' }),
    ApiResponse({ status: 201, description: 'Role created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    ApiResponse({ status: 409, description: 'Role with this code already exists in tenant' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "createRole", null);
__decorate([
    Get('roles/tenant/:tenantId'),
    Permissions('admin.roles.read'),
    ApiOperation({ summary: 'Get roles for a tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Roles retrieved successfully' }),
    __param(0, Param('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRolesByTenant", null);
__decorate([
    Get('roles/:id'),
    Permissions('admin.roles.read'),
    ApiOperation({ summary: 'Get role by ID' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({ status: 200, description: 'Role retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Role not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRoleById", null);
__decorate([
    Put('roles/:id'),
    Permissions('admin.roles.manage'),
    ApiOperation({ summary: 'Update role' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({ status: 200, description: 'Role updated successfully' }),
    ApiResponse({ status: 400, description: 'Cannot update system roles' }),
    ApiResponse({ status: 404, description: 'Role not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "updateRole", null);
__decorate([
    Delete('roles/:id'),
    Permissions('admin.roles.manage'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete role' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({ status: 204, description: 'Role deleted successfully' }),
    ApiResponse({ status: 400, description: 'Cannot delete system roles or roles assigned to users' }),
    ApiResponse({ status: 404, description: 'Role not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "deleteRole", null);
__decorate([
    Post('permissions'),
    Permissions('admin.permissions.manage'),
    ApiOperation({ summary: 'Create a new permission' }),
    ApiResponse({ status: 201, description: 'Permission created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 409, description: 'Permission with this code already exists' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "createPermission", null);
__decorate([
    Get('permissions'),
    Permissions('admin.permissions.read'),
    ApiOperation({ summary: 'Get all permissions' }),
    ApiResponse({ status: 200, description: 'Permissions retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getAllPermissions", null);
__decorate([
    Get('permissions/resource/:resource'),
    Permissions('admin.permissions.read'),
    ApiOperation({ summary: 'Get permissions by resource' }),
    ApiParam({ name: 'resource', description: 'Resource name' }),
    ApiResponse({ status: 200, description: 'Permissions retrieved successfully' }),
    __param(0, Param('resource')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getPermissionsByResource", null);
__decorate([
    Get('permissions/:id'),
    Permissions('admin.permissions.read'),
    ApiOperation({ summary: 'Get permission by ID' }),
    ApiParam({ name: 'id', description: 'Permission ID' }),
    ApiResponse({ status: 200, description: 'Permission retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Permission not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getPermissionById", null);
__decorate([
    Post('roles/:roleId/permissions/:permissionId'),
    Permissions('admin.roles.manage'),
    ApiOperation({ summary: 'Assign permission to role' }),
    ApiParam({ name: 'roleId', description: 'Role ID' }),
    ApiParam({ name: 'permissionId', description: 'Permission ID' }),
    ApiResponse({ status: 201, description: 'Permission assigned to role successfully' }),
    ApiResponse({ status: 404, description: 'Role or permission not found' }),
    ApiResponse({ status: 409, description: 'Permission already assigned to role' }),
    __param(0, Param('roleId')),
    __param(1, Param('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "assignPermissionToRole", null);
__decorate([
    Delete('roles/:roleId/permissions/:permissionId'),
    Permissions('admin.roles.manage'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Remove permission from role' }),
    ApiParam({ name: 'roleId', description: 'Role ID' }),
    ApiParam({ name: 'permissionId', description: 'Permission ID' }),
    ApiResponse({ status: 204, description: 'Permission removed from role successfully' }),
    ApiResponse({ status: 404, description: 'Permission assignment not found' }),
    __param(0, Param('roleId')),
    __param(1, Param('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "removePermissionFromRole", null);
__decorate([
    Get('roles/:roleId/permissions'),
    Permissions('admin.roles.read'),
    ApiOperation({ summary: 'Get role permissions' }),
    ApiParam({ name: 'roleId', description: 'Role ID' }),
    ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' }),
    __param(0, Param('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRolePermissions", null);
__decorate([
    Post('user-roles'),
    Permissions('admin.roles.manage'),
    ApiOperation({ summary: 'Assign role to user' }),
    ApiResponse({ status: 201, description: 'Role assigned to user successfully' }),
    ApiResponse({ status: 404, description: 'User or role not found' }),
    ApiResponse({ status: 409, description: 'Role already assigned to user' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignRoleDto]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "assignRoleToUser", null);
__decorate([
    Delete('user-roles/:userId/:roleId'),
    Permissions('admin.roles.manage'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Remove role from user' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiParam({ name: 'roleId', description: 'Role ID' }),
    ApiResponse({ status: 204, description: 'Role removed from user successfully' }),
    ApiResponse({ status: 404, description: 'Role assignment not found' }),
    __param(0, Param('userId')),
    __param(1, Param('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "removeRoleFromUser", null);
__decorate([
    Get('users/:userId/roles'),
    Permissions('admin.roles.read'),
    ApiOperation({ summary: 'Get user roles' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User roles retrieved successfully' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getUserRoles", null);
__decorate([
    Get('users/:userId/permissions'),
    Permissions('admin.permissions.read'),
    ApiOperation({ summary: 'Get user permissions' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User permissions retrieved successfully' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getUserPermissions", null);
__decorate([
    Get('users/:userId/permissions/:permissionCode'),
    Permissions('admin.permissions.read'),
    ApiOperation({ summary: 'Check if user has permission' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiParam({ name: 'permissionCode', description: 'Permission code' }),
    ApiResponse({ status: 200, description: 'Permission check completed' }),
    __param(0, Param('userId')),
    __param(1, Param('permissionCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "userHasPermission", null);
__decorate([
    Get('stats/tenant/:tenantId'),
    Permissions('admin.roles.read'),
    ApiOperation({ summary: 'Get RBAC statistics for tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'RBAC statistics retrieved successfully' }),
    __param(0, Param('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRbacStats", null);
RbacController = __decorate([
    ApiTags('RBAC'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    Controller('rbac'),
    __metadata("design:paramtypes", [RbacService])
], RbacController);
export { RbacController };
//# sourceMappingURL=rbac.controller.js.map