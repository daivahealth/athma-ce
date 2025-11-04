import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
/**
 * Global exception filter
 * Catches all exceptions and formats them consistently
 * Integrates with Pino logger and request context
 */
export declare class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
    /**
     * Extract error information from exception
     */
    private extractErrorInfo;
    /**
     * Check if error is a Prisma error
     */
    private isPrismaError;
    /**
     * Handle Prisma-specific errors
     */
    private handlePrismaError;
    /**
     * Check if error is a validation error
     */
    private isValidationError;
    /**
     * Log error with appropriate level
     */
    private logError;
}
//# sourceMappingURL=global-exception.filter.d.ts.map