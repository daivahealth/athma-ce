/**
 * Apply all middleware to Prisma client
 */
export function applyMiddleware(prisma: any): void;
/**
 * Middleware for database operations
 */
export class DatabaseMiddleware {
    /**
     * Middleware for automatic tenant filtering
     */
    static tenantFiltering(): (params: any, next: any) => Promise<any>;
    /**
     * Middleware for audit logging
     */
    static auditLogging(): (params: any, next: any) => Promise<any>;
    /**
     * Middleware for data validation
     */
    static dataValidation(): (params: any, next: any) => Promise<any>;
    /**
     * Middleware for soft delete
     */
    static softDelete(): (params: any, next: any) => Promise<any>;
    /**
     * Get current tenant ID from context
     */
    static getCurrentTenantId(): any;
    /**
     * Get current user ID from context
     */
    static getCurrentUserId(): any;
    /**
     * Log audit information
     */
    static logAudit(auditInfo: any): void;
    /**
     * Validate data based on model
     */
    static validateData(model: any, data: any): void;
    /**
     * Validate patient data
     */
    static validatePatientData(data: any): void;
    /**
     * Validate user data
     */
    static validateUserData(data: any): void;
    /**
     * Validate Emirates ID format
     */
    static isValidEmiratesId(emiratesId: any): boolean;
    /**
     * Validate email format
     */
    static isValidEmail(email: any): boolean;
}
//# sourceMappingURL=middleware.d.ts.map