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
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }>;
    listRoles(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }[]>;
    getRole(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        code: string;
        description: string | null;
        isSystem: boolean;
    }>;
    deleteRole(id: string): Promise<void>;
    assignRoleToUser(userId: string, roleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        userId: string;
        assignedAt: Date;
        expiresAt: Date | null;
        isActive: boolean;
        roleId: string;
    }>;
    removeRoleFromUser(userId: string, roleId: string): import(".prisma/client").Prisma.Prisma__UserRoleClient<{
        id: string;
        createdAt: Date;
        updatedAt: never;
        userId: string;
        assignedAt: Date;
        expiresAt: Date | null;
        isActive: boolean;
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
}
//# sourceMappingURL=rbac.service.d.ts.map