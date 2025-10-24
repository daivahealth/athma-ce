/**
 * Prisma Tenant Isolation Middleware
 *
 * Automatically injects tenantId filter into all database queries
 * to ensure row-level security and data isolation
 */
import { Prisma } from '../generated';
/**
 * Creates Prisma middleware for automatic tenant isolation
 */
export declare function createTenantIsolationMiddleware(): (params: Prisma.MiddlewareParams, next: any) => Promise<any>;
/**
 * Utility function to bypass tenant check for system operations
 * Use with extreme caution!
 */
export declare function withoutTenantCheck<T>(fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=prisma-tenant.middleware.d.ts.map