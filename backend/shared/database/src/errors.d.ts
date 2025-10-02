/**
 * Custom database error classes
 */
export declare class DatabaseError extends Error {
    readonly code: string;
    readonly meta?: any;
    constructor(message: string, code?: string, meta?: any);
}
export declare class ValidationError extends DatabaseError {
    readonly field: string;
    readonly value: any;
    readonly constraint: string;
    constructor(message: string, field: string, value: any, constraint: string);
}
export declare class NotFoundError extends DatabaseError {
    constructor(resource: string, id: string);
}
export declare class ConflictError extends DatabaseError {
    constructor(message: string, conflictingField?: string);
}
export declare class UnauthorizedError extends DatabaseError {
    constructor(message?: string);
}
export declare class ForbiddenError extends DatabaseError {
    constructor(message?: string);
}
export declare class TenantMismatchError extends DatabaseError {
    constructor(expectedTenantId: string, actualTenantId: string);
}
export declare class TransactionError extends DatabaseError {
    constructor(message: string, cause?: Error);
}
export declare class ConnectionError extends DatabaseError {
    constructor(message?: string);
}
export declare class TimeoutError extends DatabaseError {
    constructor(message?: string);
}
export declare class ConstraintError extends DatabaseError {
    readonly constraint: string;
    readonly field?: string;
    constructor(message: string, constraint: string, field?: string);
}
export declare class UniqueConstraintError extends ConstraintError {
    constructor(field: string, value: any);
}
export declare class ForeignKeyConstraintError extends ConstraintError {
    constructor(field: string, referencedTable: string);
}
export declare class CheckConstraintError extends ConstraintError {
    constructor(field: string, constraint: string);
}
/**
 * Error handler utilities
 */
export declare class ErrorHandler {
    /**
     * Convert Prisma errors to custom database errors
     */
    static handlePrismaError(error: any): DatabaseError;
    /**
     * Check if error is retryable
     */
    static isRetryableError(error: any): boolean;
    /**
     * Get user-friendly error message
     */
    static getUserFriendlyMessage(error: any): string;
}
//# sourceMappingURL=errors.d.ts.map