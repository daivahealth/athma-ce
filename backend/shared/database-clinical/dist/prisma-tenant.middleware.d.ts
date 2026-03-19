/**
 * Prisma Tenant Isolation Middleware
 *
 * Automatically injects tenantId filter into all database queries
 * to ensure row-level security and data isolation
 */
type TenantMiddlewareParams = {
    model?: string;
    action: string;
    args: Record<string, any>;
};
/**
 * Creates Prisma middleware for automatic tenant isolation
 */
export declare function createTenantIsolationMiddleware(): (params: TenantMiddlewareParams, next: any) => Promise<any>;
/**
 * Utility function to bypass tenant check for system operations
 * Use with extreme caution!
 */
export declare function withoutTenantCheck<T>(fn: () => Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=prisma-tenant.middleware.d.ts.map