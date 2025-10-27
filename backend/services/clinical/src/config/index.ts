import { createConfigClient } from '@zeal/config-client';

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
 * Shutdown handler for graceful cleanup
 */
export async function shutdownConfigClient() {
  await configClient.clearCache();
  await configClient.close();
}
