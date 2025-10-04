import { RbacService } from './rbac.service';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto, CreatePermissionDto, RbacStatsDto } from './dto/rbac.dto';
interface ApiResponseType<T> {
    data: T;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
import type { Role, Permission, UserRole, RolePermission } from '@prisma/client';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    createRole(createRoleDto: CreateRoleDto): Promise<ApiResponseType<Role>>;
    getRolesByTenant(tenantId: string): Promise<ApiResponseType<Role[]>>;
    getRoleById(id: string): Promise<ApiResponseType<Role>>;
    updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<ApiResponseType<Role>>;
    deleteRole(id: string): Promise<void>;
    createPermission(createPermissionDto: CreatePermissionDto): Promise<ApiResponseType<Permission>>;
    getAllPermissions(): Promise<ApiResponseType<Permission[]>>;
    getPermissionsByResource(resource: string): Promise<ApiResponseType<Permission[]>>;
    getPermissionById(id: string): Promise<ApiResponseType<Permission>>;
    assignPermissionToRole(roleId: string, permissionId: string): Promise<ApiResponseType<RolePermission>>;
    removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
    getRolePermissions(roleId: string): Promise<ApiResponseType<Permission[]>>;
    assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<ApiResponseType<UserRole>>;
    removeRoleFromUser(userId: string, roleId: string): Promise<void>;
    getUserRoles(userId: string): Promise<ApiResponseType<Role[]>>;
    getUserPermissions(userId: string): Promise<ApiResponseType<Permission[]>>;
    userHasPermission(userId: string, permissionCode: string): Promise<ApiResponseType<{
        hasPermission: boolean;
    }>>;
    getRbacStats(tenantId: string): Promise<ApiResponseType<RbacStatsDto>>;
}
export {};
//# sourceMappingURL=rbac.controller.d.ts.map