import { createConfigClient, SecretClient } from '@zeal/config-client';

/**
 * Foundation-backed clients. The connector resolves per-tenant ABDM settings
 * through the config hierarchy and per-facility credentials through the
 * encrypted TenantSecret store — it holds no credentials of its own beyond
 * the documented single-tenant env fallback.
 */
export const configClient = createConfigClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  enableCache: true,
  cacheConfig: { memoryTtlMs: 60_000 },
});

export const secretClient = new SecretClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  serviceName: 'abdm-connector',
});
