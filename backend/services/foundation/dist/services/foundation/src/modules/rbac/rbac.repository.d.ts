import { PrismaService } from '@zeal/database-foundation';
export declare class RbacRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRole(data: {
        tenantId: string;
        code: string;
        name: string;
        description?: string;
        isSystem?: boolean;
    }): import("@zeal/database-foundation").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findRoleByTenantAndCode(tenantId: string, code: string): import("@zeal/database-foundation").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findRoles(tenantId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }[]>;
    findRoleById(id: string): import("@zeal/database-foundation").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
        rolePermissions: {
            permission: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                resource: string | null;
                action: string | null;
            };
        }[];
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    updateRole(id: string, data: Partial<{
        name: string;
        description: string;
    }>): import("@zeal/database-foundation").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    deleteRole(id: string): import("@zeal/database-foundation").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    createPermission(data: {
        code: string;
        name: string;
        description?: string;
        resource?: string;
        action?: string;
    }): import("@zeal/database-foundation").Prisma.Prisma__PermissionClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findPermissionByCode(code: string): import("@zeal/database-foundation").Prisma.Prisma__PermissionClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    listPermissions(): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        resource: string | null;
        action: string | null;
    }[]>;
    assignRoleToUser(userId: string, roleId: string): import("@zeal/database-foundation").Prisma.Prisma__UserRoleClient<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        isActive: boolean;
        userId: string;
        assignedAt: Date;
        roleId: string;
        expiresAt: Date | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    removeRoleFromUser(userId: string, roleId: string): import("@zeal/database-foundation").Prisma.Prisma__UserRoleClient<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        isActive: boolean;
        userId: string;
        assignedAt: Date;
        roleId: string;
        expiresAt: Date | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    listUserRoles(userId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            tenantId: string;
            description: string | null;
            isSystem: boolean;
        };
    }[]>;
    private readonly roleSelect;
    private readonly permissionSelect;
    private readonly userRoleSelect;
}
//# sourceMappingURL=rbac.repository.d.ts.map