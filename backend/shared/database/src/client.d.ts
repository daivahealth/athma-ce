import { PrismaClient, Prisma } from '@prisma/client';
/**
 * Extended Prisma Client with custom configuration and middleware
 */
export declare class ZealPrismaClient extends PrismaClient {
    constructor(options?: Prisma.PrismaClientOptions);
    private setupMiddleware;
    private setupLogging;
    private getTenantId;
    /**
     * Set the current tenant context for the client
     */
    setTenantContext(tenantId: string): void;
    /**
     * Clear the current tenant context
     */
    clearTenantContext(): void;
    /**
     * Get the current tenant context
     */
    getCurrentTenantId(): string | null;
}
export declare const prisma: ZealPrismaClient;
export type { Prisma } from '@prisma/client';
//# sourceMappingURL=client.d.ts.map