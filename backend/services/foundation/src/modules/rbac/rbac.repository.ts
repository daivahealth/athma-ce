import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class RbacRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRole(data: {
    tenantId: string;
    code: string;
    name: string;
    description?: string;
    isSystem?: boolean;
  }) {
    return this.prisma.role.create({
      data,
      select: this.roleSelect,
    });
  }

  findRoleByTenantAndCode(tenantId: string, code: string) {
    return this.prisma.role.findUnique({
      where: {
        tenantId_code: {
          tenantId,
          code,
        },
      },
      select: this.roleSelect,
    });
  }

  findRoles(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      select: this.roleSelect,
    });
  }

  findRoleById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      select: {
        ...this.roleSelect,
        rolePermissions: {
          select: {
            permission: {
              select: this.permissionSelect,
            },
          },
        },
      },
    });
  }

  updateRole(id: string, data: Partial<{ name: string; description: string }>) {
    return this.prisma.role.update({
      where: { id },
      data,
      select: this.roleSelect,
    });
  }

  deleteRole(id: string) {
    return this.prisma.role.delete({ where: { id }, select: this.roleSelect });
  }

  createPermission(data: { code: string; name: string; description?: string; resource?: string; action?: string }) {
    return this.prisma.permission.create({
      data,
      select: this.permissionSelect,
    });
  }

  findPermissionByCode(code: string) {
    return this.prisma.permission.findUnique({ where: { code }, select: this.permissionSelect });
  }

  listPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { code: 'asc' },
      select: this.permissionSelect,
    });
  }

  assignRoleToUser(userId: string, roleId: string) {
    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
      select: this.userRoleSelect,
    });
  }

  removeRoleFromUser(userId: string, roleId: string) {
    return this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      select: this.userRoleSelect,
    });
  }

  listUserRoles(userId: string) {
    return this.prisma.userRole.findMany({
      where: { userId },
      select: {
        id: true,
        role: {
          select: this.roleSelect,
        },
      },
    });
  }

  private readonly roleSelect = {
    id: true,
    tenantId: true,
    code: true,
    name: true,
    description: true,
    isSystem: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  private readonly permissionSelect = {
    id: true,
    code: true,
    name: true,
    description: true,
    resource: true,
    action: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  private readonly userRoleSelect = {
    id: true,
    userId: true,
    roleId: true,
    assignedAt: true,
    expiresAt: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
