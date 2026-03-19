"use strict";
/**
 * Configuration Client
 * Provides type-safe, cached access to hierarchical configurations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigClient = void 0;
exports.createConfigClient = createConfigClient;
const axios_1 = __importDefault(require("axios"));
const ioredis_1 = __importDefault(require("ioredis"));
const defaults_1 = require("./defaults");
/**
 * Configuration Client
 */
class ConfigClient {
    constructor(options) {
        this.redisAvailable = false;
        this.memoryCache = new Map();
        this.httpClient = axios_1.default.create({
            baseURL: options.foundationBaseUrl,
            timeout: 5000,
        });
        this.enableCache = options.enableCache ?? true;
        this.memoryTtlMs = options.cacheConfig?.memoryTtlMs ?? 60000; // 1 minute
        this.redisTtlMs = options.cacheConfig?.redisTtlMs ?? 300000; // 5 minutes
        // Initialize Redis if URL provided
        if (options.cacheConfig?.redisUrl) {
            try {
                const redisClient = new ioredis_1.default(options.cacheConfig.redisUrl, {
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
                    }
                    else {
                        console.warn('⚠️ ConfigClient: Redis unavailable, using memory cache only', error.message);
                    }
                    this.redisAvailable = false;
                });
                redisClient.connect().catch((error) => {
                    this.redisAvailable = false;
                    console.warn('⚠️ ConfigClient: Redis connection failed, using memory cache only', error.message);
                });
                this.redisClient = redisClient;
            }
            catch (error) {
                console.warn('⚠️ ConfigClient: Redis connection failed, using memory cache only', error);
            }
        }
    }
    /**
     * Get a single configuration value with type safety
     */
    async get(key, context = {}) {
        const resolved = await this.resolve(key, context);
        return resolved.value;
    }
    /**
     * Get multiple configuration values
     */
    async getMany(keys, context = {}) {
        const results = await Promise.all(keys.map(key => this.resolve(key, context)));
        const configMap = {};
        results.forEach((resolved, index) => {
            configMap[keys[index]] = resolved.value;
        });
        return configMap;
    }
    /**
     * Get all effective configurations for the context
     */
    async getAll(context = {}) {
        try {
            const response = await this.httpClient.get('/api/v1/configs/effective', {
                headers: this.buildHeaders(context),
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch all configs:', error);
            return {};
        }
    }
    /**
     * Resolve a configuration value through the hierarchy
     */
    async resolve(key, context) {
        // Try cache first
        if (this.enableCache) {
            const cached = await this.getFromCache(key, context);
            if (cached !== null) {
                return {
                    key: key,
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
                key: key,
                value,
                level,
                source: 'api',
            };
        }
        catch (error) {
            // Only log non-404 errors (404 is expected when config not in database)
            if (error?.response?.status !== 404) {
                console.warn(`Failed to fetch config ${key}, using default:`, error);
            }
            // Fallback to default
            const defaultValue = (0, defaults_1.getDefaultValue)(key);
            return {
                key: key,
                value: defaultValue,
                level: 'instance',
                source: 'default',
            };
        }
    }
    /**
     * Get value from cache (memory → Redis)
     */
    async getFromCache(key, context) {
        const cacheKey = this.buildCacheKey(key, context);
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
            }
            catch (error) {
                console.warn('Redis cache read failed:', error);
            }
        }
        return null;
    }
    /**
     * Set value in cache (memory + Redis)
     */
    async setInCache(key, context, value) {
        const cacheKey = this.buildCacheKey(key, context);
        // Set in memory cache
        this.memoryCache.set(cacheKey, {
            value,
            expiresAt: Date.now() + this.memoryTtlMs,
        });
        // Set in Redis cache
        if (this.redisClient && this.redisAvailable) {
            try {
                await this.redisClient.set(cacheKey, JSON.stringify(value), 'PX', this.redisTtlMs);
            }
            catch (error) {
                console.warn('Redis cache write failed:', error);
            }
        }
    }
    /**
     * Invalidate cache for a specific config key
     */
    async invalidate(key, context = {}) {
        const cacheKey = this.buildCacheKey(key, context);
        // Remove from memory
        this.memoryCache.delete(cacheKey);
        // Remove from Redis
        if (this.redisClient && this.redisAvailable) {
            try {
                await this.redisClient.del(cacheKey);
            }
            catch (error) {
                console.warn('Redis cache invalidation failed:', error);
            }
        }
    }
    /**
     * Clear all cache
     */
    async clearCache() {
        this.memoryCache.clear();
        if (this.redisClient && this.redisAvailable) {
            try {
                // Clear all config keys from Redis
                const keys = await this.redisClient.keys('config:*');
                if (keys.length > 0) {
                    await this.redisClient.del(...keys);
                }
            }
            catch (error) {
                console.warn('Redis cache clear failed:', error);
            }
        }
    }
    /**
     * Build cache key based on hierarchy
     */
    buildCacheKey(key, context) {
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
    buildHeaders(context) {
        const headers = {};
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
    determineLevelFromContext(context) {
        if (context.facilityId)
            return 'facility';
        if (context.tenantId)
            return 'tenant';
        return 'instance';
    }
    /**
     * Close connections
     */
    async close() {
        if (this.redisClient && this.redisAvailable) {
            await this.redisClient.quit();
        }
    }
}
exports.ConfigClient = ConfigClient;
/**
 * Create a config client instance
 */
function createConfigClient(options) {
    return new ConfigClient(options);
}
