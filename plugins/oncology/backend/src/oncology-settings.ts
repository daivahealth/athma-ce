import { Injectable, Logger } from '@nestjs/common';
import { parseDualSignFlag } from './chemo-order-rules';

export const DUAL_SIGN_CONFIG_KEY = 'oncology.chemo.require_dual_sign';

const CACHE_TTL_MS = 60_000;

/**
 * Reads oncology config keys (declared in athma-plugin.json `configKeys`) from the
 * foundation config hierarchy: facility → tenant → instance.
 *
 * Uses the public `GET /api/v1/configs/resolve` endpoint directly with `fetch`
 * rather than `@zeal/config-client`, because the plugin directory sits outside
 * backend/node_modules and cannot rely on resolving that package at runtime.
 *
 * Safety flags fail closed: if foundation is unreachable or the key is missing,
 * dual sign-off is treated as required.
 */
@Injectable()
export class OncologySettingsService {
  private readonly logger = new Logger(OncologySettingsService.name);
  private readonly cache = new Map<string, { value: boolean; expiresAt: number }>();
  private readonly baseUrl = (process.env.FOUNDATION_BASE_URL || 'http://localhost:3010').replace(/\/+$/, '');

  async requireDualSign(tenantId: string, facilityId?: string | null): Promise<boolean> {
    const cacheKey = `${tenantId}:${facilityId ?? ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    let value = true;
    try {
      const headers: Record<string, string> = { 'x-tenant-id': tenantId };
      if (facilityId) headers['x-facility-id'] = facilityId;
      const res = await fetch(
        `${this.baseUrl}/api/v1/configs/resolve?key=${encodeURIComponent(DUAL_SIGN_CONFIG_KEY)}`,
        { headers, signal: AbortSignal.timeout(3000) },
      );
      if (res.ok) {
        const body = (await res.json()) as { value?: unknown; data?: { value?: unknown } };
        value = parseDualSignFlag(body?.value ?? body?.data?.value);
      } else if (res.status !== 404) {
        this.logger.warn(`Config resolve for ${DUAL_SIGN_CONFIG_KEY} returned ${res.status}; requiring dual sign-off`);
      }
    } catch (err) {
      this.logger.warn(`Config resolve for ${DUAL_SIGN_CONFIG_KEY} failed (${(err as Error).message}); requiring dual sign-off`);
    }

    this.cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  }
}
