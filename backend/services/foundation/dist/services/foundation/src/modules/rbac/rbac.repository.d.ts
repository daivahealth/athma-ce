import { PrismaService } from '@zeal/shared-database';
export declare class RbacRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRole(data: {
        tenantId: string;
        code: string;
        name: string;
        description?: string;
        isSystem?: boolean;
    }): import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findRoleByTenantAndCode(tenantId: string, code: string): import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findRoles(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }[]>;
    findRoleById(id: string): import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateRole(id: string, data: Partial<{
        name: string;
        description: string;
    }>): import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteRole(id: string): import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createPermission(data: {
        code: string;
        name: string;
        description?: string;
        resource?: string;
        action?: string;
    }): import(".prisma/client").Prisma.Prisma__PermissionClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findPermissionByCode(code: string): import(".prisma/client").Prisma.Prisma__PermissionClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    listPermissions(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    }[]>;
    assignRoleToUser(userId: string, roleId: string): import(".prisma/client").Prisma.Prisma__UserRoleClient<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        assignedAt: Date;
        expiresAt: Date | null;
        isActive: boolean;
        userId: string;
        roleId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeRoleFromUser(userId: string, roleId: string): import(".prisma/client").Prisma.Prisma__UserRoleClient<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        assignedAt: Date;
        expiresAt: Date | null;
        isActive: boolean;
        userId: string;
        roleId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listUserRoles(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            code: string;
            description: string | null;
            isSystem: boolean;
        };
    }[]>;
    private readonly roleSelect;
    private readonly permissionSelect;
    private readonly userRoleSelect;
}
//# sourceMappingURL=rbac.repository.d.ts.map