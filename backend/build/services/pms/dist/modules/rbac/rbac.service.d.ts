export let RbacService: {
    new (prisma: any): {
        prisma: any;
        /**
         * Create a new role
         */
        createRole(createRoleDto: any): Promise<any>;
        /**
         * Get role by ID
         */
        getRoleById(id: any): Promise<any>;
        /**
         * Get roles for tenant
         */
        getRolesByTenant(tenantId: any): Promise<any>;
        /**
         * Update role
         */
        updateRole(id: any, updateRoleDto: any): Promise<any>;
        /**
         * Delete role
         */
        deleteRole(id: any): Promise<void>;
        /**
         * Create a new permission
         */
        createPermission(createPermissionDto: any): Promise<any>;
        /**
         * Get permission by ID
         */
        getPermissionById(id: any): Promise<any>;
        /**
         * Get all permissions
         */
        getAllPermissions(): Promise<any>;
        /**
         * Get permissions by resource
         */
        getPermissionsByResource(resource: any): Promise<any>;
        /**
         * Assign permission to role
         */
        assignPermissionToRole(roleId: any, permissionId: any): Promise<any>;
        /**
         * Remove permission from role
         */
        removePermissionFromRole(roleId: any, permissionId: any): Promise<void>;
        /**
         * Get role permissions
         */
        getRolePermissions(roleId: any): Promise<any>;
        /**
         * Assign role to user
         */
        assignRoleToUser(assignRoleDto: any): Promise<any>;
        /**
         * Remove role from user
         */
        removeRoleFromUser(userId: any, roleId: any): Promise<void>;
        /**
         * Get user roles
         */
        getUserRoles(userId: any): Promise<any>;
        /**
         * Get user permissions
         */
        getUserPermissions(userId: any): Promise<any[]>;
        /**
         * Check if user has permission
         */
        userHasPermission(userId: any, permissionCode: any): Promise<boolean>;
        /**
         * Check if user has any of the specified permissions
         */
        userHasAnyPermission(userId: any, permissionCodes: any): Promise<any>;
        /**
         * Check if user has all of the specified permissions
         */
        userHasAllPermissions(userId: any, permissionCodes: any): Promise<any>;
        /**
         * Get RBAC statistics for tenant
         */
        getRbacStats(tenantId: any): Promise<{
            totalRoles: any;
            systemRoles: any;
            customRoles: any;
            totalPermissions: any;
            totalRoleAssignments: any;
            activeRoleAssignments: any;
        }>;
    };
};
//# sourceMappingURL=rbac.service.d.ts.map