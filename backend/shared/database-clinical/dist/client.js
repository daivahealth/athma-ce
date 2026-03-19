"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.ZealPrismaClient = void 0;
const generated_1 = require("../generated");
const observability_1 = require("@zeal/observability");
/**
 * Extended Prisma Client with custom configuration and middleware
 */
class ZealPrismaClient extends generated_1.PrismaClient {
    constructor(options) {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
            ],
            errorFormat: 'pretty',
            ...options,
        });
        this.setupLogging();
    }
    setupLogging() {
        // @ts-expect-error Prisma event typings for `$on('query')` are not exposed in generated client
        this.$on('query', (e) => {
            if (process.env.NODE_ENV === 'development') {
                observability_1.logger.debug({
                    type: 'query',
                    query: e.query,
                    params: e.params,
                    duration: e.duration,
                }, `SQL Query (${e.duration}ms)`);
            }
        });
        // @ts-expect-error Prisma event typings for `$on('error')` are not exposed in generated client
        this.$on('error', (e) => {
            observability_1.logger.error({ type: 'database', error: e }, 'Database Error');
        });
    }
    getTenantId() {
        // This would be set by the application context
        return global.currentTenantId || null;
    }
    /**
     * Set the current tenant context for the client
     */
    setTenantContext(tenantId) {
        global.currentTenantId = tenantId;
    }
    /**
     * Clear the current tenant context
     */
    clearTenantContext() {
        global.currentTenantId = null;
    }
    /**
     * Get the current tenant context
     */
    getCurrentTenantId() {
        return this.getTenantId();
    }
}
exports.ZealPrismaClient = ZealPrismaClient;
// Create and export the singleton instance
exports.prisma = new ZealPrismaClient();
//# sourceMappingURL=client.js.map