import { PrismaService } from '@zeal/shared-database';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto } from './dto/rbac.dto';
import type { Role, Permission, UserRole, RolePermission } from '@prisma/client';
export declare class RbacService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new role
     */
    createRole(createRoleDto: CreateRoleDto): Promise<Role>;
    /**
     * Get role by ID
     */
    getRoleById(id: string): Promise<Role>;
    /**
     * Get roles for tenant
     */
    getRolesByTenant(tenantId: string): Promise<Role[]>;
    /**
     * Update role
     */
    updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
    /**
     * Delete role
     */
    deleteRole(id: string): Promise<void>;
    /**
     * Create a new permission
     */
    createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission>;
    /**
     * Get permission by ID
     */
    getPermissionById(id: string): Promise<Permission>;
    /**
     * Get all permissions
     */
    getAllPermissions(): Promise<Permission[]>;
    /**
     * Get permissions by resource
     */
    getPermissionsByResource(resource: string): Promise<Permission[]>;
    /**
     * Assign permission to role
     */
    assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission>;
    /**
     * Remove permission from role
     */
    removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
    /**
     * Get role permissions
     */
    getRolePermissions(roleId: string): Promise<Permission[]>;
    /**
     * Assign role to user
     */
    assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<UserRole>;
    /**
     * Remove role from user
     */
    removeRoleFromUser(userId: string, roleId: string): Promise<void>;
    /**
     * Get user roles
     */
    getUserRoles(userId: string): Promise<Role[]>;
    /**
     * Get user permissions
     */
    getUserPermissions(userId: string): Promise<Permission[]>;
    /**
     * Check if user has permission
     */
    userHasPermission(userId: string, permissionCode: string): Promise<boolean>;
    /**
     * Check if user has any of the specified permissions
     */
    userHasAnyPermission(userId: string, permissionCodes: string[]): Promise<boolean>;
    /**
     * Check if user has all of the specified permissions
     */
    userHasAllPermissions(userId: string, permissionCodes: string[]): Promise<boolean>;
    /**
     * Get RBAC statistics for tenant
     */
    getRbacStats(tenantId: string): Promise<{
        totalRoles: number;
        systemRoles: number;
        customRoles: number;
        totalPermissions: number;
        totalRoleAssignments: number;
        activeRoleAssignments: number;
    }>;
}
//# sourceMappingURL=rbac.service.d.ts.map