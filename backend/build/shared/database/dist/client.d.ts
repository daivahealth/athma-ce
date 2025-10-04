/**
 * Extended Prisma Client with custom configuration and middleware
 */
export class ZealPrismaClient extends PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs> {
    constructor(options: any);
    setupMiddleware(): void;
    setupLogging(): void;
    getTenantId(): any;
    /**
     * Set the current tenant context for the client
     */
    setTenantContext(tenantId: any): void;
    /**
     * Clear the current tenant context
     */
    clearTenantContext(): void;
    /**
     * Get the current tenant context
     */
    getCurrentTenantId(): any;
}
export const prisma: ZealPrismaClient;
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
//# sourceMappingURL=client.d.ts.map