const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map();
function makeKey(tenantId, userId) {
    return `${tenantId}:${userId}`;
}
export function getCachedPermissions(tenantId, userId) {
    const key = makeKey(tenantId, userId);
    const entry = cache.get(key);
    if (!entry) {
        return null;
    }
    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return null;
    }
    return {
        roles: [...entry.roles],
        permissions: [...entry.permissions],
    };
}
export function setCachedPermissions(tenantId, userId, value, ttlMs = DEFAULT_TTL_MS) {
    const key = makeKey(tenantId, userId);
    cache.set(key, {
        roles: [...value.roles],
        permissions: [...value.permissions],
        expiresAt: Date.now() + ttlMs,
    });
}
export function invalidateCachedPermissions(tenantId, userId) {
    if (userId) {
        cache.delete(makeKey(tenantId, userId));
        return;
    }
    const prefix = `${tenantId}:`;
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
}
//# sourceMappingURL=permission-cache.js.map
//# sourceMappingURL=permission-cache.js.map