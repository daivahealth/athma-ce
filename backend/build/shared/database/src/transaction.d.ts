import { Prisma } from '@prisma/client';
/**
 * Transaction utility functions for database operations
 */
export declare class TransactionManager {
    /**
     * Execute a function within a database transaction
     */
    static execute<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
    /**
     * Execute multiple operations in a transaction with isolation level control
     */
    static executeWithIsolation<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>, options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
        timeout?: number;
    }): Promise<T>;
    /**
     * Execute a function with retry logic for transaction conflicts
     */
    static executeWithRetry<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>, options?: {
        maxRetries?: number;
        retryDelay?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): Promise<T>;
    /**
     * Check if an error is retryable
     */
    private static isRetryableError;
    /**
     * Delay execution for the specified milliseconds
     */
    private static delay;
}
/**
 * Utility function for executing transactions
 */
export declare const transaction: typeof TransactionManager.execute;
/**
 * Utility function for executing transactions with isolation control
 */
export declare const transactionWithIsolation: typeof TransactionManager.executeWithIsolation;
/**
 * Utility function for executing transactions with retry logic
 */
export declare const transactionWithRetry: typeof TransactionManager.executeWithRetry;
//# sourceMappingURL=transaction.d.ts.map