"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.ZealPrismaClient = void 0;
const generated_1 = require("../generated");
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
        this.setupMiddleware();
        this.setupLogging();
    }
    setupMiddleware() {
        // Tenant isolation is handled by createTenantIsolationMiddleware() in PrismaService
        // No duplicate middleware needed here
        // Add middleware for soft delete
        const skipSoftDeleteModels = new Set([
            'StaffSchedule',
            'EquipmentSchedule',
            'SpaceSchedule',
            'AppointmentResource',
            'AppointmentSeries',
            'ResourceBlock',
            'EncounterDiagnosis',
            'ClinicalOrder',
            'PrescriptionOrder',
        ]);
        this.$use(async (params, next) => {
            if (params.model && skipSoftDeleteModels.has(params.model)) {
                return next(params);
            }
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
        // @ts-expect-error Prisma event typings for `$on('query')` are not exposed in generated client
        this.$on('query', (e) => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Query: ' + e.query);
                console.log('Params: ' + e.params);
                console.log('Duration: ' + e.duration + 'ms');
            }
        });
        // @ts-expect-error Prisma event typings for `$on('error')` are not exposed in generated client
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
exports.ZealPrismaClient = ZealPrismaClient;
// Create and export the singleton instance
exports.prisma = new ZealPrismaClient();
//# sourceMappingURL=client.js.map