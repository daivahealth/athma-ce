export function getCachedPermissions(tenantId: any, userId: any): {
    roles: any[];
    permissions: any[];
} | null;
export function setCachedPermissions(tenantId: any, userId: any, value: any, ttlMs?: number): void;
export function invalidateCachedPermissions(tenantId: any, userId: any): void;
//# sourceMappingURL=permission-cache.d.ts.map