import { PrismaService } from '@zeal/shared-database';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        role?: string;
    }): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMany(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail(tenantId: string, email: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        role: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        lastLogin: Date | null;
        defaultFacilityId: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        passwordHash: string;
        email: string;
    }>): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        role: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        lastLogin: Date | null;
        defaultFacilityId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
//# sourceMappingURL=user.repository.d.ts.map