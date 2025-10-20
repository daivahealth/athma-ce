import { RbacRepository } from './rbac.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RbacService {
    private readonly rbacRepository;
    constructor(rbacRepository: RbacRepository);
    createRole(dto: CreateRoleDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }>;
    listRoles(tenantId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }[]>;
    getRole(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        tenantId: string;
        description: string | null;
        isSystem: boolean;
    }>;
    deleteRole(id: string): Promise<void>;
    assignRoleToUser(userId: string, roleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        isActive: boolean;
        userId: string;
        assignedAt: Date;
        roleId: string;
        expiresAt: Date | null;
    }>;
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
}
//# sourceMappingURL=rbac.service.d.ts.map