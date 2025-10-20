/**
 * Middleware for database operations
 */
export declare class DatabaseMiddleware {
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
    private static getCurrentTenantId;
    /**
     * Get current user ID from context
     */
    private static getCurrentUserId;
    /**
     * Log audit information
     */
    private static logAudit;
    /**
     * Validate data based on model
     */
    private static validateData;
    /**
     * Validate patient data
     */
    private static validatePatientData;
    /**
     * Validate user data
     */
    private static validateUserData;
    /**
     * Validate Emirates ID format
     */
    private static isValidEmiratesId;
    /**
     * Validate email format
     */
    private static isValidEmail;
}
/**
 * Apply all middleware to Prisma client
 */
export declare function applyMiddleware(prisma: any): void;
//# sourceMappingURL=middleware.d.ts.map