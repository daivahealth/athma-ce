import { LoggerService as NestLoggerService } from '@nestjs/common';
/**
 * Custom Pino-based logger service for NestJS
 * Integrates with AsyncLocalStorage request context
 */
export declare class LoggerService implements NestLoggerService {
    /**
     * Add request context to log metadata
     */
    private enrichWithContext;
    log(message: string, context?: string, metadata?: Record<string, unknown>): void;
    error(message: string, trace?: string, context?: string, metadata?: Record<string, unknown>): void;
    warn(message: string, context?: string, metadata?: Record<string, unknown>): void;
    debug(message: string, context?: string, metadata?: Record<string, unknown>): void;
    verbose(message: string, context?: string, metadata?: Record<string, unknown>): void;
    fatal(message: string, metadata?: Record<string, unknown>): void;
    http(message: string, metadata?: Record<string, unknown>): void;
}
//# sourceMappingURL=logger.service.d.ts.map