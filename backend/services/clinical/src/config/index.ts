import { createConfigClient, SecretClient } from '@zeal/config-client';

/**
 * Global configuration client instance for Clinical service
 * Provides hierarchical config resolution with caching
 */
const cacheConfig: any = {
  memoryTtlMs: 60000,  // 1 minute in-memory cache
  redisTtlMs: 300000,  // 5 minutes Redis cache
};
if (process.env.REDIS_URL) {
  cacheConfig.redisUrl = process.env.REDIS_URL;
}

export const configClient = createConfigClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  enableCache: true,
  cacheConfig,
});

/**
 * Tenant-secret client (Foundation TenantSecret store, issue #81). Values are
 * fetched over the internal API, cached in memory only, and every read is
 * audited on the Foundation side under this service's name.
 */
export const secretClient = new SecretClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  serviceName: 'clinical',
});

/**
 * Shutdown handler for graceful cleanup
 */
export async function shutdownConfigClient() {
  await configClient.clearCache();
  await configClient.close();
}
