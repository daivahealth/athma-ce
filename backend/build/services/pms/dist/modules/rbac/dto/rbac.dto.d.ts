export let CreateRoleDto: {
    new (): {
        tenantId: any;
        code: any;
        name: any;
        description: any;
        isSystem: any;
    };
};
export let UpdateRoleDto: {
    new (): {
        name: any;
        description: any;
    };
};
export let CreatePermissionDto: {
    new (): {
        code: any;
        name: any;
        description: any;
        resource: any;
        action: any;
    };
};
export let AssignRoleDto: {
    new (): {
        userId: any;
        roleId: any;
        assignedBy: any;
        expiresAt: any;
    };
};
export let RbacStatsDto: {
    new (): {
        totalRoles: any;
        systemRoles: any;
        customRoles: any;
        totalPermissions: any;
        totalRoleAssignments: any;
        activeRoleAssignments: any;
    };
};
//# sourceMappingURL=rbac.dto.d.ts.map