import { Prisma } from '@prisma/client';
import { prisma } from './client';
/**
 * Transaction utility functions for database operations
 */
export class TransactionManager {
    /**
     * Execute a function within a database transaction
     */
    static async execute(fn) {
        return await prisma.$transaction(fn);
    }
    /**
     * Execute multiple operations in a transaction with isolation level control
     */
    static async executeWithIsolation(fn, options) {
        return await prisma.$transaction(fn, options);
    }
    /**
     * Execute a function with retry logic for transaction conflicts
     */
    static async executeWithRetry(fn, options) {
        const { maxRetries = 3, retryDelay = 100, isolationLevel } = options || {};
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await prisma.$transaction(fn, { isolationLevel });
            }
            catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                // Check if it's a retryable error (deadlock, serialization failure, etc.)
                if (this.isRetryableError(error)) {
                    await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
                    continue;
                }
                // If it's not retryable, throw immediately
                throw error;
            }
        }
        throw new Error('Transaction failed after all retries');
    }
    /**
     * Check if an error is retryable
     */
    static isRetryableError(error) {
        if (!error)
            return false;
        const errorMessage = error.message?.toLowerCase() || '';
        const errorCode = error.code;
        // PostgreSQL specific retryable errors
        const retryableErrors = [
            'deadlock detected',
            'serialization failure',
            'could not serialize access',
            'concurrent update',
        ];
        const retryableCodes = [
            '40001', // serialization_failure
            '40P01', // deadlock_detected
        ];
        return (retryableErrors.some(msg => errorMessage.includes(msg)) ||
            retryableCodes.includes(errorCode));
    }
    /**
     * Delay execution for the specified milliseconds
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
/**
 * Utility function for executing transactions
 */
export const transaction = TransactionManager.execute;
/**
 * Utility function for executing transactions with isolation control
 */
export const transactionWithIsolation = TransactionManager.executeWithIsolation;
/**
 * Utility function for executing transactions with retry logic
 */
export const transactionWithRetry = TransactionManager.executeWithRetry;
//# sourceMappingURL=transaction.js.map