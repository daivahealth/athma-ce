"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMiddleware = void 0;
exports.applyMiddleware = applyMiddleware;
/**
 * Middleware for database operations
 */
class DatabaseMiddleware {
    /**
     * Middleware for automatic tenant filtering
     */
    static tenantFiltering() {
        return async (params, next) => {
            const tenantId = this.getCurrentTenantId();
            if (tenantId) {
                // Add tenant filter to where clauses
                if (params.action === 'findMany' || params.action === 'findFirst') {
                    if (!params.args.where) {
                        params.args.where = {};
                    }
                    params.args.where.tenantId = tenantId;
                }
            }
            return next(params);
        };
    }
    /**
     * Middleware for audit logging
     */
    static auditLogging() {
        return async (params, next) => {
            const startTime = Date.now();
            const userId = this.getCurrentUserId();
            try {
                const result = await next(params);
                // Log successful operations
                this.logAudit({
                    action: params.action,
                    model: params.model,
                    userId,
                    success: true,
                    duration: Date.now() - startTime,
                    timestamp: new Date(),
                });
                return result;
            }
            catch (error) {
                // Log failed operations
                this.logAudit({
                    action: params.action,
                    model: params.model,
                    userId,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    duration: Date.now() - startTime,
                    timestamp: new Date(),
                });
                throw error;
            }
        };
    }
    /**
     * Middleware for data validation
     */
    static dataValidation() {
        return async (params, next) => {
            // Validate data based on model and action
            if (params.action === 'create' || params.action === 'update') {
                this.validateData(params.model, params.args.data);
            }
            return next(params);
        };
    }
    /**
     * Middleware for soft delete
     */
    static softDelete() {
        return async (params, next) => {
            if (params.action === 'delete') {
                params.action = 'update';
                params.args.data = {
                    status: 'deleted',
                    deletedAt: new Date(),
                };
            }
            if (params.action === 'deleteMany') {
                params.action = 'updateMany';
                params.args.data = {
                    status: 'deleted',
                    deletedAt: new Date(),
                };
            }
            // Filter out deleted records by default
            if (params.action === 'findMany' || params.action === 'findFirst') {
                if (!params.args.where) {
                    params.args.where = {};
                }
                if (params.args.where.status === undefined) {
                    params.args.where.status = { not: 'deleted' };
                }
            }
            return next(params);
        };
    }
    /**
     * Get current tenant ID from context
     */
    static getCurrentTenantId() {
        return global.currentTenantId || null;
    }
    /**
     * Get current user ID from context
     */
    static getCurrentUserId() {
        return global.currentUserId || null;
    }
    /**
     * Log audit information
     */
    static logAudit(auditInfo) {
        // This would typically write to an audit log table or external service
        if (process.env.NODE_ENV === 'development') {
            console.log('Audit Log:', auditInfo);
        }
    }
    /**
     * Validate data based on model
     */
    static validateData(model, data) {
        // Add model-specific validation logic here
        switch (model) {
            case 'Patient':
                this.validatePatientData(data);
                break;
            case 'User':
                this.validateUserData(data);
                break;
            // Add more model validations as needed
        }
    }
    /**
     * Validate patient data
     */
    static validatePatientData(data) {
        if (data.emiratesId && !this.isValidEmiratesId(data.emiratesId)) {
            throw new Error('Invalid Emirates ID format');
        }
        if (data.dateOfBirth && new Date(data.dateOfBirth) > new Date()) {
            throw new Error('Date of birth cannot be in the future');
        }
    }
    /**
     * Validate user data
     */
    static validateUserData(data) {
        if (data.email && !this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }
    }
    /**
     * Validate Emirates ID format
     */
    static isValidEmiratesId(emiratesId) {
        const emiratesIdRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$/;
        return emiratesIdRegex.test(emiratesId);
    }
    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.DatabaseMiddleware = DatabaseMiddleware;
/**
 * Apply all middleware to Prisma client
 */
function applyMiddleware(prisma) {
    prisma.$use(DatabaseMiddleware.tenantFiltering());
    prisma.$use(DatabaseMiddleware.auditLogging());
    prisma.$use(DatabaseMiddleware.dataValidation());
    // Soft delete disabled - not all models have status/deletedAt fields
    // prisma.$use(DatabaseMiddleware.softDelete());
}
//# sourceMappingURL=middleware.js.map