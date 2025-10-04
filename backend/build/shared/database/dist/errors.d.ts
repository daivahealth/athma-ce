/**
 * Custom database error classes
 */
export class DatabaseError extends Error {
    constructor(message: any, code: string | undefined, meta: any);
    code: string;
    meta: any;
}
export class ValidationError extends DatabaseError {
    constructor(message: any, field: any, value: any, constraint: any);
    field: any;
    value: any;
    constraint: any;
}
export class NotFoundError extends DatabaseError {
    constructor(resource: any, id: any);
}
export class ConflictError extends DatabaseError {
    constructor(message: any, conflictingField: any);
}
export class UnauthorizedError extends DatabaseError {
    constructor(message?: string);
}
export class ForbiddenError extends DatabaseError {
    constructor(message?: string);
}
export class TenantMismatchError extends DatabaseError {
    constructor(expectedTenantId: any, actualTenantId: any);
}
export class TransactionError extends DatabaseError {
    constructor(message: any, cause: any);
}
export class ConnectionError extends DatabaseError {
    constructor(message?: string);
}
export class TimeoutError extends DatabaseError {
    constructor(message?: string);
}
export class ConstraintError extends DatabaseError {
    constructor(message: any, constraint: any, field: any);
    constraint: any;
    field: any;
}
export class UniqueConstraintError extends ConstraintError {
    constructor(field: any, value: any);
}
export class ForeignKeyConstraintError extends ConstraintError {
    constructor(field: any, referencedTable: any);
}
export class CheckConstraintError extends ConstraintError {
    constructor(field: any, constraint: any);
}
/**
 * Error handler utilities
 */
export class ErrorHandler {
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