import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { RequestContext, getCachedPermissions, setCachedPermissions, invalidateCachedPermissions } from '@zeal/shared-utils';

export interface UserWithRoles {
  id: string;
  email: string;
  tenantId: string;
  roles: string[];
}

export interface UserPermissions {
  roles: string[];
  permissions: string[];
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.runWithRequestContext(async (tx) =>
      tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          tenantId: true,
          status: true,
        },
      }),
    );
  }

  async getUserWithRoles(userId: string): Promise<UserWithRoles> {
    const store = RequestContext.getStore();
    if (!store?.tenantId || !store?.userId) {
      throw new Error('Request context missing tenant or user information');
    }

    const user = await this.prisma.runWithRequestContext(async (tx) => {
      return tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          tenantId: true,
          userRoles: {
            where: {
              isActive: true,
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
            select: {
              role: {
                select: {
                  code: true,
                },
              },
            },
          },
        },
      });
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const roles = user.userRoles.map((ur) => ur.role.code);

    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles,
    };
  }

  async getUserPermissions(userId: string, tenantId: string): Promise<UserPermissions> {
    const cached = getCachedPermissions(tenantId, userId);
    if (cached) {
      return cached;
    }

    const store = RequestContext.getStore();
    if (!store?.tenantId || !store?.userId) {
      throw new Error('Request context missing tenant or user information');
    }

    const { roles, permissions } = await this.prisma.runWithRequestContext(async (tx) => {
      const assignments = await tx.userRole.findMany({
        where: {
          userId,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
          role: {
            tenantId,
          },
        },
        select: {
          role: {
            select: {
              code: true,
              rolePermissions: {
                select: {
                  permission: {
                    select: {
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const roleCodes = new Set<string>();
      const permissionCodes = new Set<string>();

      assignments.forEach((assignment) => {
        roleCodes.add(assignment.role.code);
        assignment.role.rolePermissions.forEach((rp) => {
          permissionCodes.add(rp.permission.code);
        });
      });

      return {
        roles: Array.from(roleCodes),
        permissions: Array.from(permissionCodes),
      };
    });

    setCachedPermissions(tenantId, userId, { roles, permissions });
    return { roles, permissions };
  }

  invalidateUserPermissions(userId: string, tenantId: string): void {
    invalidateCachedPermissions(tenantId, userId);
  }

  invalidateTenantPermissions(tenantId: string): void {
    invalidateCachedPermissions(tenantId);
  }
}
