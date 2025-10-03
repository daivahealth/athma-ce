import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto } from './dto/rbac.dto';
import type { Role, Permission, UserRole, RolePermission, Prisma } from '@prisma/client';
// Temporary local interface until contracts package is fixed
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class RbacService {
  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  /**
   * Create a new role
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { tenantId, code, name, description, isSystem } = createRoleDto;

    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Check for existing role with same code in tenant
    const existingRole = await this.prisma.role.findUnique({
      where: {
        tenantId_code: {
          tenantId,
          code
        }
      }
    });

    if (existingRole) {
      throw new ConflictException('Role with this code already exists in this tenant');
    }

    return this.prisma.role.create({
      data: {
        tenantId,
        code,
        name,
        description: description || null,
        isSystem: isSystem || false
      }
    });
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true
          }
        },
        rolePermissions: {
          include: {
            permission: true
          }
        },
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * Get roles for tenant
   */
  async getRolesByTenant(tenantId: string): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true
          }
        }
      }
    });
  }

  /**
   * Update role
   */
  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name, description } = updateRoleDto;

    // Check if role exists
    const existingRole = await this.prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent updating system roles
    if (existingRole.isSystem) {
      throw new BadRequestException('Cannot update system roles');
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description })
      }
    });
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { id }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system roles');
    }

    // Check if role is assigned to users
    const userRoleCount = await this.prisma.userRole.count({
      where: { roleId: id }
    });

    if (userRoleCount > 0) {
      throw new BadRequestException('Cannot delete role that is assigned to users');
    }

    await this.prisma.role.delete({
      where: { id }
    });
  }

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  /**
   * Create a new permission
   */
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { code, name, description, resource, action } = createPermissionDto;

    // Check for existing permission with same code
    const existingPermission = await this.prisma.permission.findUnique({
      where: { code }
    });

    if (existingPermission) {
      throw new ConflictException('Permission with this code already exists');
    }

    return this.prisma.permission.create({
      data: {
        code,
        name,
        description: description || null,
        resource: resource || null,
        action: action || null
      }
    });
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id: string): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                tenant: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      orderBy: { code: 'asc' }
    });
  }

  /**
   * Get permissions by resource
   */
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { resource },
      orderBy: { code: 'asc' }
    });
  }

  // ============================================================================
  // ROLE-PERMISSION MANAGEMENT
  // ============================================================================

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId }
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    // Check if assignment already exists
    const existingAssignment = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });

    if (existingAssignment) {
      throw new ConflictException('Permission is already assigned to this role');
    }

    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      },
      include: {
        role: true,
        permission: true
      }
    });
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const assignment = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });

    if (!assignment) {
      throw new NotFoundException('Permission assignment not found');
    }

    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true
      }
    });

    return rolePermissions.map(rp => rp.permission);
  }

  // ============================================================================
  // USER-ROLE MANAGEMENT
  // ============================================================================

  /**
   * Assign role to user
   */
  async assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<UserRole> {
    const { userId, roleId, assignedBy, expiresAt } = assignRoleDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if assignment already exists
    const existingAssignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });

    if (existingAssignment) {
      throw new ConflictException('Role is already assigned to this user');
    }

    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy: assignedBy || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        role: true
      }
    });
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const assignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });

    if (!assignment) {
      throw new NotFoundException('Role assignment not found');
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        role: true
      }
    });

    return userRoles.map(ur => ur.role);
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    const permissions = new Map<string, Permission>();
    
    userRoles.forEach(userRole => {
      userRole.role.rolePermissions.forEach(rolePermission => {
        permissions.set(rolePermission.permission.id, rolePermission.permission);
      });
    });

    return Array.from(permissions.values());
  }

  /**
   * Check if user has permission
   */
  async userHasPermission(userId: string, permissionCode: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.some(permission => permission.code === permissionCode);
  }

  /**
   * Check if user has any of the specified permissions
   */
  async userHasAnyPermission(userId: string, permissionCodes: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissionCodes.some(code => 
      userPermissions.some(permission => permission.code === code)
    );
  }

  /**
   * Check if user has all of the specified permissions
   */
  async userHasAllPermissions(userId: string, permissionCodes: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissionCodes.every(code => 
      userPermissions.some(permission => permission.code === code)
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get RBAC statistics for tenant
   */
  async getRbacStats(tenantId: string): Promise<{
    totalRoles: number;
    systemRoles: number;
    customRoles: number;
    totalPermissions: number;
    totalRoleAssignments: number;
    activeRoleAssignments: number;
  }> {
    const [totalRoles, systemRoles, customRoles, totalPermissions, totalRoleAssignments, activeRoleAssignments] = await Promise.all([
      this.prisma.role.count({ where: { tenantId } }),
      this.prisma.role.count({ where: { tenantId, isSystem: true } }),
      this.prisma.role.count({ where: { tenantId, isSystem: false } }),
      this.prisma.permission.count(),
      this.prisma.userRole.count({
        where: {
          role: { tenantId }
        }
      }),
      this.prisma.userRole.count({
        where: {
          role: { tenantId },
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      })
    ]);

    return {
      totalRoles,
      systemRoles,
      customRoles,
      totalPermissions,
      totalRoleAssignments,
      activeRoleAssignments
    };
  }
}
