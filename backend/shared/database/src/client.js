import { PrismaClient, Prisma } from '@prisma/client';
/**
 * Extended Prisma Client with custom configuration and middleware
 */
export class ZealPrismaClient extends PrismaClient {
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
        this.setupMiddleware();
        this.setupLogging();
    }
    setupMiddleware() {
        // Add middleware for tenant context
        this.$use(async (params, next) => {
            // Add tenant_id to create/update operations if not present
            if ((params.action === 'create' || params.action === 'update') && params.args.data) {
                const tenantId = this.getTenantId();
                if (tenantId && !params.args.data.tenantId) {
                    params.args.data.tenantId = tenantId;
                }
            }
            return next(params);
        });
        // Add middleware for soft delete
        this.$use(async (params, next) => {
            if (params.action === 'delete') {
                params.action = 'update';
                params.args.data = { status: 'deleted' };
            }
            if (params.action === 'deleteMany') {
                params.action = 'updateMany';
                params.args.data = { status: 'deleted' };
            }
            return next(params);
        });
    }
    setupLogging() {
        this.$on('query', (e) => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Query: ' + e.query);
                console.log('Params: ' + e.params);
                console.log('Duration: ' + e.duration + 'ms');
            }
        });
        this.$on('error', (e) => {
            console.error('Database Error:', e);
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
// Create and export the singleton instance
export const prisma = new ZealPrismaClient();
//# sourceMappingURL=client.js.map