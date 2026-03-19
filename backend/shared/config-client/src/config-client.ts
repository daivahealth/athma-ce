/**
 * Configuration Client
 * Provides type-safe, cached access to hierarchical configurations
 */

import axios, { AxiosInstance } from 'axios';
import Redis from 'ioredis';
import type {
  ConfigContext,
  ConfigValues,
  ConfigClientOptions,
  ResolvedConfig,
} from './types';
import { getDefaultValue } from './defaults';

/**
 * In-memory cache entry
 */
interface CacheEntry {
  value: any;
  expiresAt: number;
}

/**
 * Configuration Client
 */
export class ConfigClient {
  private httpClient: AxiosInstance;
  private redisClient?: Redis;
  private redisAvailable = false;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private enableCache: boolean;
  private memoryTtlMs: number;
  private redisTtlMs: number;

  constructor(options: ConfigClientOptions) {
    this.httpClient = axios.create({
      baseURL: options.foundationBaseUrl,
      timeout: 5000,
    });

    this.enableCache = options.enableCache ?? true;
    this.memoryTtlMs = options.cacheConfig?.memoryTtlMs ?? 60000; // 1 minute
    this.redisTtlMs = options.cacheConfig?.redisTtlMs ?? 300000; // 5 minutes

    // Initialize Redis if URL provided
    if (options.cacheConfig?.redisUrl) {
      try {
        const redisClient = new Redis(options.cacheConfig.redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });

        redisClient.on('connect', () => {
          this.redisAvailable = true;
          console.log('✅ ConfigClient: Redis connected');
        });

        redisClient.on('error', (error) => {
          if (this.redisAvailable) {
            console.warn('⚠️ ConfigClient: Redis error, falling back to memory cache only', error);
          } else {
            console.warn('⚠️ ConfigClient: Redis unavailable, using memory cache only', error.message);
          }

          this.redisAvailable = false;
        });

        redisClient.connect().catch((error) => {
          this.redisAvailable = false;
          console.warn('⚠️ ConfigClient: Redis connection failed, using memory cache only', error.message);
        });

        this.redisClient = redisClient;
      } catch (error) {
        console.warn('⚠️ ConfigClient: Redis connection failed, using memory cache only', error);
      }
    }
  }

  /**
   * Get a single configuration value with type safety
   */
  async get<K extends keyof ConfigValues>(
    key: K,
    context: ConfigContext = {}
  ): Promise<ConfigValues[K]> {
    const resolved = await this.resolve(key, context);
    return resolved.value;
  }

  /**
   * Get multiple configuration values
   */
  async getMany<K extends keyof ConfigValues>(
    keys: K[],
    context: ConfigContext = {}
  ): Promise<Record<K, ConfigValues[K]>> {
    const results = await Promise.all(
      keys.map(key => this.resolve(key, context))
    );

    const configMap = {} as Record<K, ConfigValues[K]>;
    results.forEach((resolved, index) => {
      configMap[keys[index]] = resolved.value;
    });

    return configMap;
  }

  /**
   * Get all effective configurations for the context
   */
  async getAll(context: ConfigContext = {}): Promise<Partial<ConfigValues>> {
    try {
      const response = await this.httpClient.get('/api/v1/configs/effective', {
        headers: this.buildHeaders(context),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all configs:', error);
      return {};
    }
  }

  /**
   * Resolve a configuration value through the hierarchy
   */
  private async resolve<K extends keyof ConfigValues>(
    key: K,
    context: ConfigContext
  ): Promise<ResolvedConfig<ConfigValues[K]>> {
    // Try cache first
    if (this.enableCache) {
      const cached = await this.getFromCache(key, context);
      if (cached !== null) {
        return {
          key: key as string,
          value: cached,
          level: this.determineLevelFromContext(context),
          source: 'cache',
        };
      }
    }

    // Fetch from API
    try {
      const response = await this.httpClient.get('/api/v1/configs/resolve', {
        params: { key },
        headers: this.buildHeaders(context),
      });

      const value = response.data.value;
      const level = response.data.level;

      // Cache the result
      if (this.enableCache) {
        await this.setInCache(key, context, value);
      }

      return {
        key: key as string,
        value,
        level,
        source: 'api',
      };
    } catch (error: any) {
      // Only log non-404 errors (404 is expected when config not in database)
      if (error?.response?.status !== 404) {
        console.warn(`Failed to fetch config ${key}, using default:`, error);
      }

      // Fallback to default
      const defaultValue = getDefaultValue(key);
      return {
        key: key as string,
        value: defaultValue as ConfigValues[K],
        level: 'instance',
        source: 'default',
      };
    }
  }

  /**
   * Get value from cache (memory → Redis)
   */
  private async getFromCache<K extends keyof ConfigValues>(
    key: K,
    context: ConfigContext
  ): Promise<ConfigValues[K] | null> {
    const cacheKey = this.buildCacheKey(key as string, context);

    // Try memory cache first
    const memEntry = this.memoryCache.get(cacheKey);
    if (memEntry && memEntry.expiresAt > Date.now()) {
      return memEntry.value;
    }

    // Try Redis cache
    if (this.redisClient && this.redisAvailable) {
      try {
        const cached = await this.redisClient.get(cacheKey);
        if (cached) {
          const value = JSON.parse(cached);
          // Populate memory cache
          this.memoryCache.set(cacheKey, {
            value,
            expiresAt: Date.now() + this.memoryTtlMs,
          });
          return value;
        }
      } catch (error) {
        console.warn('Redis cache read failed:', error);
      }
    }

    return null;
  }

  /**
   * Set value in cache (memory + Redis)
   */
  private async setInCache<K extends keyof ConfigValues>(
    key: K,
    context: ConfigContext,
    value: ConfigValues[K]
  ): Promise<void> {
    const cacheKey = this.buildCacheKey(key as string, context);

    // Set in memory cache
    this.memoryCache.set(cacheKey, {
      value,
      expiresAt: Date.now() + this.memoryTtlMs,
    });

    // Set in Redis cache
    if (this.redisClient && this.redisAvailable) {
      try {
        await this.redisClient.set(
          cacheKey,
          JSON.stringify(value),
          'PX',
          this.redisTtlMs
        );
      } catch (error) {
        console.warn('Redis cache write failed:', error);
      }
    }
  }

  /**
   * Invalidate cache for a specific config key
   */
  async invalidate(key: string, context: ConfigContext = {}): Promise<void> {
    const cacheKey = this.buildCacheKey(key, context);

    // Remove from memory
    this.memoryCache.delete(cacheKey);

    // Remove from Redis
    if (this.redisClient && this.redisAvailable) {
      try {
        await this.redisClient.del(cacheKey);
      } catch (error) {
        console.warn('Redis cache invalidation failed:', error);
      }
    }
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    this.memoryCache.clear();

    if (this.redisClient && this.redisAvailable) {
      try {
        // Clear all config keys from Redis
        const keys = await this.redisClient.keys('config:*');
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (error) {
        console.warn('Redis cache clear failed:', error);
      }
    }
  }

  /**
   * Build cache key based on hierarchy
   */
  private buildCacheKey(key: string, context: ConfigContext): string {
    if (context.facilityId) {
      return `config:facility:${context.facilityId}:${key}`;
    }
    if (context.tenantId) {
      return `config:tenant:${context.tenantId}:${key}`;
    }
    return `config:instance:${key}`;
  }

  /**
   * Build HTTP headers from context
   */
  private buildHeaders(context: ConfigContext): Record<string, string> {
    const headers: Record<string, string> = {};

    if (context.tenantId) {
      headers['x-tenant-id'] = context.tenantId;
    }
    if (context.facilityId) {
      headers['x-facility-id'] = context.facilityId;
    }
    if (context.userId) {
      headers['x-user-id'] = context.userId;
    }

    return headers;
  }

  /**
   * Determine config level from context
   */
  private determineLevelFromContext(context: ConfigContext) {
    if (context.facilityId) return 'facility';
    if (context.tenantId) return 'tenant';
    return 'instance';
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    if (this.redisClient && this.redisAvailable) {
      await this.redisClient.quit();
    }
  }
}

/**
 * Create a config client instance
 */
export function createConfigClient(options: ConfigClientOptions): ConfigClient {
  return new ConfigClient(options);
}
