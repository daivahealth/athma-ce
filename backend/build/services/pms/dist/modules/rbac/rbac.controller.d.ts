export let RbacController: {
    new (rbacService: any): {
        rbacService: any;
        createRole(createRoleDto: any): Promise<{
            data: any;
            message: string;
        }>;
        getRolesByTenant(tenantId: any): Promise<{
            data: any;
            message: string;
        }>;
        getRoleById(id: any): Promise<{
            data: any;
            message: string;
        }>;
        updateRole(id: any, updateRoleDto: any): Promise<{
            data: any;
            message: string;
        }>;
        deleteRole(id: any): Promise<void>;
        createPermission(createPermissionDto: any): Promise<{
            data: any;
            message: string;
        }>;
        getAllPermissions(): Promise<{
            data: any;
            message: string;
        }>;
        getPermissionsByResource(resource: any): Promise<{
            data: any;
            message: string;
        }>;
        getPermissionById(id: any): Promise<{
            data: any;
            message: string;
        }>;
        assignPermissionToRole(roleId: any, permissionId: any): Promise<{
            data: any;
            message: string;
        }>;
        removePermissionFromRole(roleId: any, permissionId: any): Promise<void>;
        getRolePermissions(roleId: any): Promise<{
            data: any;
            message: string;
        }>;
        assignRoleToUser(assignRoleDto: any): Promise<{
            data: any;
            message: string;
        }>;
        removeRoleFromUser(userId: any, roleId: any): Promise<void>;
        getUserRoles(userId: any): Promise<{
            data: any;
            message: string;
        }>;
        getUserPermissions(userId: any): Promise<{
            data: any;
            message: string;
        }>;
        userHasPermission(userId: any, permissionCode: any): Promise<{
            data: {
                hasPermission: any;
            };
            message: string;
        }>;
        getRbacStats(tenantId: any): Promise<{
            data: any;
            message: string;
        }>;
    };
};
//# sourceMappingURL=rbac.controller.d.ts.map