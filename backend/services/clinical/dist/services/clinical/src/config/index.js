"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configClient = void 0;
exports.shutdownConfigClient = shutdownConfigClient;
const config_client_1 = require("@zeal/config-client");
/**
 * Global configuration client instance for Clinical service
 * Provides hierarchical config resolution with caching
 */
const cacheConfig = {
    memoryTtlMs: 60000, // 1 minute in-memory cache
    redisTtlMs: 300000, // 5 minutes Redis cache
};
if (process.env.REDIS_URL) {
    cacheConfig.redisUrl = process.env.REDIS_URL;
}
exports.configClient = (0, config_client_1.createConfigClient)({
    foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
    enableCache: true,
    cacheConfig,
});
/**
 * Shutdown handler for graceful cleanup
 */
async function shutdownConfigClient() {
    await exports.configClient.clearCache();
    await exports.configClient.close();
}
//# sourceMappingURL=index.js.map