import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto, RbacStatsDto } from './dto/rbac.dto';
// Temporary local interface until contracts package is fixed
interface ApiResponseType<T> {
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
import type { Role, Permission, UserRole, RolePermission } from '@prisma/client';

@ApiTags('RBAC')
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ============================================================================
  // ROLE ENDPOINTS
  // ============================================================================

  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Role with this code already exists in tenant' })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<ApiResponseType<Role>> {
    const role = await this.rbacService.createRole(createRoleDto);
    return { 
      data: role, 
      message: 'Role created successfully' 
    };
  }

  @Get('roles/tenant/:tenantId')
  @ApiOperation({ summary: 'Get roles for a tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  async getRolesByTenant(@Param('tenantId') tenantId: string): Promise<ApiResponseType<Role[]>> {
    const roles = await this.rbacService.getRolesByTenant(tenantId);
    return { 
      data: roles, 
      message: 'Roles retrieved successfully' 
    };
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') id: string): Promise<ApiResponseType<Role>> {
    const role = await this.rbacService.getRoleById(id);
    return { 
      data: role, 
      message: 'Role retrieved successfully' 
    };
  }

  @Put('roles/:id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Cannot update system roles' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(
    @Param('id') id: string, 
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<ApiResponseType<Role>> {
    const role = await this.rbacService.updateRole(id, updateRoleDto);
    return { 
      data: role, 
      message: 'Role updated successfully' 
    };
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete system roles or roles assigned to users' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Param('id') id: string): Promise<void> {
    await this.rbacService.deleteRole(id);
  }

  // ============================================================================
  // PERMISSION ENDPOINTS
  // ============================================================================

  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Permission with this code already exists' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto): Promise<ApiResponseType<Permission>> {
    const permission = await this.rbacService.createPermission(createPermissionDto);
    return { 
      data: permission, 
      message: 'Permission created successfully' 
    };
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  async getAllPermissions(): Promise<ApiResponseType<Permission[]>> {
    const permissions = await this.rbacService.getAllPermissions();
    return { 
      data: permissions, 
      message: 'Permissions retrieved successfully' 
    };
  }

  @Get('permissions/resource/:resource')
  @ApiOperation({ summary: 'Get permissions by resource' })
  @ApiParam({ name: 'resource', description: 'Resource name' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  async getPermissionsByResource(@Param('resource') resource: string): Promise<ApiResponseType<Permission[]>> {
    const permissions = await this.rbacService.getPermissionsByResource(resource);
    return { 
      data: permissions, 
      message: 'Permissions retrieved successfully' 
    };
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async getPermissionById(@Param('id') id: string): Promise<ApiResponseType<Permission>> {
    const permission = await this.rbacService.getPermissionById(id);
    return { 
      data: permission, 
      message: 'Permission retrieved successfully' 
    };
  }

  // ============================================================================
  // ROLE-PERMISSION ENDPOINTS
  // ============================================================================

  @Post('roles/:roleId/permissions/:permissionId')
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({ status: 201, description: 'Permission assigned to role successfully' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  @ApiResponse({ status: 409, description: 'Permission already assigned to role' })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ): Promise<ApiResponseType<RolePermission>> {
    const rolePermission = await this.rbacService.assignPermissionToRole(roleId, permissionId);
    return { 
      data: rolePermission, 
      message: 'Permission assigned to role successfully' 
    };
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({ status: 204, description: 'Permission removed from role successfully' })
  @ApiResponse({ status: 404, description: 'Permission assignment not found' })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ): Promise<void> {
    await this.rbacService.removePermissionFromRole(roleId, permissionId);
  }

  @Get('roles/:roleId/permissions')
  @ApiOperation({ summary: 'Get role permissions' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' })
  async getRolePermissions(@Param('roleId') roleId: string): Promise<ApiResponseType<Permission[]>> {
    const permissions = await this.rbacService.getRolePermissions(roleId);
    return { 
      data: permissions, 
      message: 'Role permissions retrieved successfully' 
    };
  }

  // ============================================================================
  // USER-ROLE ENDPOINTS
  // ============================================================================

  @Post('user-roles')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 201, description: 'Role assigned to user successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @ApiResponse({ status: 409, description: 'Role already assigned to user' })
  async assignRoleToUser(@Body() assignRoleDto: AssignRoleDto): Promise<ApiResponseType<UserRole>> {
    const userRole = await this.rbacService.assignRoleToUser(assignRoleDto);
    return { 
      data: userRole, 
      message: 'Role assigned to user successfully' 
    };
  }

  @Delete('user-roles/:userId/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role removed from user successfully' })
  @ApiResponse({ status: 404, description: 'Role assignment not found' })
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string
  ): Promise<void> {
    await this.rbacService.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User roles retrieved successfully' })
  async getUserRoles(@Param('userId') userId: string): Promise<ApiResponseType<Role[]>> {
    const roles = await this.rbacService.getUserRoles(userId);
    return { 
      data: roles, 
      message: 'User roles retrieved successfully' 
    };
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
  async getUserPermissions(@Param('userId') userId: string): Promise<ApiResponseType<Permission[]>> {
    const permissions = await this.rbacService.getUserPermissions(userId);
    return { 
      data: permissions, 
      message: 'User permissions retrieved successfully' 
    };
  }

  @Get('users/:userId/permissions/:permissionCode')
  @ApiOperation({ summary: 'Check if user has permission' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'permissionCode', description: 'Permission code' })
  @ApiResponse({ status: 200, description: 'Permission check completed' })
  async userHasPermission(
    @Param('userId') userId: string,
    @Param('permissionCode') permissionCode: string
  ): Promise<ApiResponseType<{ hasPermission: boolean }>> {
    const hasPermission = await this.rbacService.userHasPermission(userId, permissionCode);
    return { 
      data: { hasPermission }, 
      message: 'Permission check completed' 
    };
  }

  // ============================================================================
  // STATISTICS ENDPOINTS
  // ============================================================================

  @Get('stats/tenant/:tenantId')
  @ApiOperation({ summary: 'Get RBAC statistics for tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'RBAC statistics retrieved successfully' })
  async getRbacStats(@Param('tenantId') tenantId: string): Promise<ApiResponseType<RbacStatsDto>> {
    const stats = await this.rbacService.getRbacStats(tenantId);
    return { 
      data: stats, 
      message: 'RBAC statistics retrieved successfully' 
    };
  }
}

