import { createConfigClient } from '@zeal/config-client';

/**
 * Global configuration client instance for Clinical service
 * Provides hierarchical config resolution with caching
 */
export const configClient = createConfigClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  enableCache: true,
  cacheConfig: {
    redisUrl: process.env.REDIS_URL,
    memoryTtlMs: 60000,  // 1 minute in-memory cache
    redisTtlMs: 300000,  // 5 minutes Redis cache
  },
});

/**
 * Shutdown handler for graceful cleanup
 */
export async function shutdownConfigClient() {
  await configClient.clearCache();
  await configClient.close();
}
