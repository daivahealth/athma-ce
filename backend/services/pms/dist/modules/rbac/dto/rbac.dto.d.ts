export declare class CreateRoleDto {
    tenantId: string;
    code: string;
    name: string;
    description?: string;
    isSystem?: boolean;
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
}
export declare class CreatePermissionDto {
    code: string;
    name: string;
    description?: string;
    resource?: string;
    action?: string;
}
export declare class AssignRoleDto {
    userId: string;
    roleId: string;
    assignedBy?: string;
    expiresAt?: string;
}
export declare class RbacStatsDto {
    totalRoles: number;
    systemRoles: number;
    customRoles: number;
    totalPermissions: number;
    totalRoleAssignments: number;
    activeRoleAssignments: number;
}
//# sourceMappingURL=rbac.dto.d.ts.map