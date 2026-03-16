/**
 * Config Client Service
 * Resolves AI configuration keys from the Foundation config system.
 * Falls back to environment variables when Foundation is unreachable.
 * Results are cached in-memory with a 60-second TTL.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RequestContext } from '@zeal/shared-utils';
import { logger } from '../../common/logger/logger.config';

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

@Injectable()
export class ConfigClientService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 60_000;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Resolve a config key against the Foundation config system.
   * Uses the current request's tenant context for hierarchy resolution.
   * Returns undefined if Foundation is unreachable (caller should fall back to env var).
   */
  async resolve(key: string): Promise<unknown> {
    const tenantId = RequestContext.getTenantId();
    const cacheKey = `${key}:${tenantId ?? 'system'}`;

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      const foundationUrl = this.configService.get<string>(
        'FOUNDATION_API_URL',
        'http://localhost:3010/api/v1',
      );

      const headers: Record<string, string> = {};
      if (tenantId) headers['x-tenant-id'] = tenantId;

      const response = await axios.get(`${foundationUrl}/configs/resolve`, {
        params: { key },
        headers,
        timeout: 3000,
      });

      const value = response.data?.value;
      this.cache.set(cacheKey, { value, expiresAt: Date.now() + this.TTL_MS });
      return value;
    } catch {
      logger.warn(
        { key, tenantId },
        'ConfigClient: Foundation API unavailable, falling back to env var',
      );
      return undefined;
    }
  }

  /**
   * Resolve a string config key. Falls back to envFallback if not set in Foundation.
   */
  async resolveString(key: string, envFallback: string): Promise<string> {
    const value = await this.resolve(key);
    if (value && typeof value === 'string' && value.trim()) return value;
    return envFallback;
  }

  /**
   * Resolve a numeric config key. Falls back to envFallback if not set in Foundation.
   */
  async resolveNumber(key: string, envFallback: number): Promise<number> {
    const value = await this.resolve(key);
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (!isNaN(num)) return num;
    }
    return envFallback;
  }
}
