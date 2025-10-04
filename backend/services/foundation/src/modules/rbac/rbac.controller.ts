import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('roles')
  listRoles(@Query('tenantId') tenantId?: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId query parameter is required');
    }
    return this.rbacService.listRoles(tenantId);
  }

  @Get('roles/:id')
  getRole(@Param('id') id: string) {
    return this.rbacService.getRole(id);
  }

  @Put('roles/:id')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rbacService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.rbacService.deleteRole(id);
  }

  @Post('users/:userId/roles/:roleId')
  assignRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.rbacService.assignRoleToUser(userId, roleId);
  }

  @Delete('users/:userId/roles/:roleId')
  removeRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.rbacService.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/roles')
  listUserRoles(@Param('userId') userId: string) {
    return this.rbacService.listUserRoles(userId);
  }

  @Get('permissions')
  listPermissions() {
    return this.rbacService.listPermissions();
  }
}
