import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import {
  RBAC_READ,
  RBAC_MANAGE,
  ROLE_CREATE,
  ROLE_UPDATE,
  ROLE_DELETE,
  ROLE_ASSIGN,
  PERMISSION_READ,
} from '@zeal/contracts';

@Controller('rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  @Permissions(ROLE_CREATE)
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('roles')
  @Permissions(RBAC_READ)
  listRoles(@Query('tenantId') tenantId?: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId query parameter is required');
    }
    return this.rbacService.listRoles(tenantId);
  }

  @Get('roles/:id')
  @Permissions(RBAC_READ)
  getRole(@Param('id') id: string) {
    return this.rbacService.getRole(id);
  }

  @Put('roles/:id')
  @Permissions(ROLE_UPDATE)
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rbacService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @Permissions(ROLE_DELETE)
  deleteRole(@Param('id') id: string) {
    return this.rbacService.deleteRole(id);
  }

  @Post('users/:userId/roles/:roleId')
  @Permissions(ROLE_ASSIGN)
  assignRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.rbacService.assignRoleToUser(userId, roleId);
  }

  @Delete('users/:userId/roles/:roleId')
  @Permissions(ROLE_ASSIGN)
  removeRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.rbacService.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/roles')
  @Permissions(RBAC_READ)
  listUserRoles(@Param('userId') userId: string) {
    return this.rbacService.listUserRoles(userId);
  }

  @Get('permissions')
  @Permissions(PERMISSION_READ)
  listPermissions() {
    return this.rbacService.listPermissions();
  }

  @Put('roles/:id/permissions')
  @Permissions(RBAC_MANAGE)
  setRolePermissions(@Param('id') id: string, @Body() dto: SetRolePermissionsDto) {
    return this.rbacService.setRolePermissions(id, dto.permissionIds);
  }
}
