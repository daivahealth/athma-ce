/**
 * Custom database error classes
 */
export class DatabaseError extends Error {
    code;
    meta;
    constructor(message, code = 'DATABASE_ERROR', meta) {
        super(message);
        this.name = 'DatabaseError';
        this.code = code;
        this.meta = meta;
    }
}
export class ValidationError extends DatabaseError {
    field;
    value;
    constraint;
    constructor(message, field, value, constraint) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
        this.constraint = constraint;
    }
}
export class NotFoundError extends DatabaseError {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends DatabaseError {
    constructor(message, conflictingField) {
        super(message, 'CONFLICT');
        this.name = 'ConflictError';
        if (conflictingField) {
            this.meta = { conflictingField };
        }
    }
}
export class UnauthorizedError extends DatabaseError {
    constructor(message = 'Unauthorized access') {
        super(message, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}
export class ForbiddenError extends DatabaseError {
    constructor(message = 'Forbidden access') {
        super(message, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}
export class TenantMismatchError extends DatabaseError {
    constructor(expectedTenantId, actualTenantId) {
        super(`Tenant mismatch: expected ${expectedTenantId}, got ${actualTenantId}`, 'TENANT_MISMATCH');
        this.name = 'TenantMismatchError';
    }
}
export class TransactionError extends DatabaseError {
    constructor(message, cause) {
        super(message, 'TRANSACTION_ERROR');
        this.name = 'TransactionError';
        if (cause) {
            this.meta = { cause: cause.message };
        }
    }
}
export class ConnectionError extends DatabaseError {
    constructor(message = 'Database connection failed') {
        super(message, 'CONNECTION_ERROR');
        this.name = 'ConnectionError';
    }
}
export class TimeoutError extends DatabaseError {
    constructor(message = 'Database operation timed out') {
        super(message, 'TIMEOUT_ERROR');
        this.name = 'TimeoutError';
    }
}
export class ConstraintError extends DatabaseError {
    constraint;
    field;
    constructor(message, constraint, field) {
        super(message, 'CONSTRAINT_ERROR');
        this.name = 'ConstraintError';
        this.constraint = constraint;
        this.field = field;
    }
}
export class UniqueConstraintError extends ConstraintError {
    constructor(field, value) {
        super(`Unique constraint violation on field '${field}' with value '${value}'`, 'unique', field);
        this.name = 'UniqueConstraintError';
    }
}
export class ForeignKeyConstraintError extends ConstraintError {
    constructor(field, referencedTable) {
        super(`Foreign key constraint violation on field '${field}' referencing '${referencedTable}'`, 'foreign_key', field);
        this.name = 'ForeignKeyConstraintError';
    }
}
export class CheckConstraintError extends ConstraintError {
    constructor(field, constraint) {
        super(`Check constraint violation on field '${field}': ${constraint}`, 'check', field);
        this.name = 'CheckConstraintError';
    }
}
/**
 * Error handler utilities
 */
export class ErrorHandler {
    /**
     * Convert Prisma errors to custom database errors
     */
    static handlePrismaError(error) {
        if (error.code === 'P2002') {
            // Unique constraint violation
            const field = error.meta?.target?.[0] || 'unknown';
            const value = error.meta?.target?.[1] || 'unknown';
            return new UniqueConstraintError(field, value);
        }
        if (error.code === 'P2003') {
            // Foreign key constraint violation
            const field = error.meta?.field_name || 'unknown';
            const referencedTable = error.meta?.table_name || 'unknown';
            return new ForeignKeyConstraintError(field, referencedTable);
        }
        if (error.code === 'P2025') {
            // Record not found
            const model = error.meta?.model_name || 'Record';
            const id = error.meta?.cause || 'unknown';
            return new NotFoundError(model, id);
        }
        if (error.code === 'P2014') {
            // Required relation violation
            return new ForeignKeyConstraintError('relation', 'required');
        }
        if (error.code === 'P2034') {
            // Transaction conflict
            return new TransactionError('Transaction conflict detected');
        }
        if (error.code === 'P1001') {
            // Connection error
            return new ConnectionError('Cannot reach database server');
        }
        if (error.code === 'P1008') {
            // Timeout error
            return new TimeoutError('Database operation timed out');
        }
        // Default to generic database error
        return new DatabaseError(error.message || 'Unknown database error', error.code || 'UNKNOWN_ERROR');
    }
    /**
     * Check if error is retryable
     */
    static isRetryableError(error) {
        if (error instanceof TransactionError)
            return true;
        if (error instanceof ConnectionError)
            return true;
        if (error instanceof TimeoutError)
            return true;
        // Check Prisma error codes
        if (error.code === 'P2034')
            return true; // Transaction conflict
        if (error.code === 'P1001')
            return true; // Connection error
        if (error.code === 'P1008')
            return true; // Timeout
        return false;
    }
    /**
     * Get user-friendly error message
     */
    static getUserFriendlyMessage(error) {
        if (error instanceof ValidationError) {
            return `Invalid ${error.field}: ${error.message}`;
        }
        if (error instanceof NotFoundError) {
            return error.message;
        }
        if (error instanceof ConflictError) {
            return error.message;
        }
        if (error instanceof UniqueConstraintError) {
            return `A record with this ${error.field} already exists`;
        }
        if (error instanceof ForeignKeyConstraintError) {
            return `Invalid reference: ${error.message}`;
        }
        if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
            return 'Access denied';
        }
        if (error instanceof TenantMismatchError) {
            return 'Invalid tenant access';
        }
        if (error instanceof TransactionError) {
            return 'Operation failed due to a conflict. Please try again.';
        }
        if (error instanceof ConnectionError) {
            return 'Service temporarily unavailable. Please try again later.';
        }
        if (error instanceof TimeoutError) {
            return 'Operation timed out. Please try again.';
        }
        // Default message
        return 'An unexpected error occurred. Please try again.';
    }
}
//# sourceMappingURL=errors.js.map