import { PrismaService } from '@zeal/database-foundation';
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
    }): import("@zeal/database-foundation").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findMany(tenantId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        role: string;
    }[]>;
    findById(id: string): import("@zeal/database-foundation").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        role: string;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findByEmail(tenantId: string, email: string): import("@zeal/database-foundation").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        staffId: string | null;
        passwordHash: string;
        role: string;
        permissions: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        lastLogin: Date | null;
        defaultFacilityId: string | null;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        passwordHash: string;
        email: string;
    }>): import("@zeal/database-foundation").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    delete(id: string): import("@zeal/database-foundation").Prisma.Prisma__UserClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        staffId: string | null;
        passwordHash: string;
        role: string;
        permissions: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        lastLogin: Date | null;
        defaultFacilityId: string | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
}
//# sourceMappingURL=user.repository.d.ts.map