export declare function getCachedPermissions(tenantId: string, userId: string): {
    roles: string[];
    permissions: string[];
} | null;
export declare function setCachedPermissions(tenantId: string, userId: string, value: {
    roles: string[];
    permissions: string[];
}, ttlMs?: number): void;
export declare function invalidateCachedPermissions(tenantId: string, userId?: string): void;
//# sourceMappingURL=permission-cache.d.ts.map