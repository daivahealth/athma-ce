import { Prisma } from '@prisma/client';
import { PrismaService } from '@zeal/shared-database';
export declare class TenantRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        domain: string;
        settings?: Record<string, unknown>;
    }): Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMany(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByNameOrDomain(name: string, domain: string): Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findById(id: string): Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: {
        name?: string;
        domain?: string;
        settings?: Record<string, unknown>;
    }): Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
//# sourceMappingURL=tenant.repository.d.ts.map