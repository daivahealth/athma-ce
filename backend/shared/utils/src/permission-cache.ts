interface PermissionCacheEntry {
  roles: string[];
  permissions: string[];
  expiresAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, PermissionCacheEntry>();

function makeKey(tenantId: string, userId: string): string {
  return `${tenantId}:${userId}`;
}

export function getCachedPermissions(
  tenantId: string,
  userId: string,
): { roles: string[]; permissions: string[] } | null {
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

export function setCachedPermissions(
  tenantId: string,
  userId: string,
  value: { roles: string[]; permissions: string[] },
  ttlMs: number = DEFAULT_TTL_MS,
): void {
  const key = makeKey(tenantId, userId);
  cache.set(key, {
    roles: [...value.roles],
    permissions: [...value.permissions],
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidateCachedPermissions(tenantId: string, userId?: string): void {
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
