/**
 * Configuration Client
 * Provides type-safe, cached access to hierarchical configurations
 */
import type { ConfigContext, ConfigValues, ConfigClientOptions } from './types';
/**
 * Configuration Client
 */
export declare class ConfigClient {
    private httpClient;
    private redisClient?;
    private memoryCache;
    private enableCache;
    private memoryTtlMs;
    private redisTtlMs;
    constructor(options: ConfigClientOptions);
    /**
     * Get a single configuration value with type safety
     */
    get<K extends keyof ConfigValues>(key: K, context?: ConfigContext): Promise<ConfigValues[K]>;
    /**
     * Get multiple configuration values
     */
    getMany<K extends keyof ConfigValues>(keys: K[], context?: ConfigContext): Promise<Record<K, ConfigValues[K]>>;
    /**
     * Get all effective configurations for the context
     */
    getAll(context?: ConfigContext): Promise<Partial<ConfigValues>>;
    /**
     * Resolve a configuration value through the hierarchy
     */
    private resolve;
    /**
     * Get value from cache (memory → Redis)
     */
    private getFromCache;
    /**
     * Set value in cache (memory + Redis)
     */
    private setInCache;
    /**
     * Invalidate cache for a specific config key
     */
    invalidate(key: string, context?: ConfigContext): Promise<void>;
    /**
     * Clear all cache
     */
    clearCache(): Promise<void>;
    /**
     * Build cache key based on hierarchy
     */
    private buildCacheKey;
    /**
     * Build HTTP headers from context
     */
    private buildHeaders;
    /**
     * Determine config level from context
     */
    private determineLevelFromContext;
    /**
     * Close connections
     */
    close(): Promise<void>;
}
/**
 * Create a config client instance
 */
export declare function createConfigClient(options: ConfigClientOptions): ConfigClient;
