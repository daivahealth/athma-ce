/**
 * Transaction utility functions for database operations
 */
export class TransactionManager {
    /**
     * Execute a function within a database transaction
     */
    static execute(fn: any): Promise<any>;
    /**
     * Execute multiple operations in a transaction with isolation level control
     */
    static executeWithIsolation(fn: any, options: any): Promise<any>;
    /**
     * Execute a function with retry logic for transaction conflicts
     */
    static executeWithRetry(fn: any, options: any): Promise<any>;
    /**
     * Check if an error is retryable
     */
    static isRetryableError(error: any): boolean;
    /**
     * Delay execution for the specified milliseconds
     */
    static delay(ms: any): Promise<any>;
}
/**
 * Execute a function within a database transaction
 */
export function transaction(fn: any): Promise<any>;
/**
 * Execute multiple operations in a transaction with isolation level control
 */
export function transactionWithIsolation(fn: any, options: any): Promise<any>;
/**
 * Execute a function with retry logic for transaction conflicts
 */
export function transactionWithRetry(fn: any, options: any): Promise<any>;
//# sourceMappingURL=transaction.d.ts.map