import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { logger } from './logger.config';
import { RequestContextService } from '../context/request-context';

/**
 * Custom Pino-based logger service for NestJS
 * Integrates with AsyncLocalStorage request context
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  /**
   * Add request context to log metadata
   */
  private enrichWithContext(metadata?: Record<string, unknown>) {
    const context = RequestContextService.get();
    return {
      ...metadata,
      ...(context && {
        requestId: context.requestId,
        tenantId: context.tenantId,
        userId: context.userId,
        facilityId: context.facilityId,
      }),
    };
  }

  log(message: string, context?: string, metadata?: Record<string, unknown>) {
    logger.info(
      this.enrichWithContext({ context, ...metadata }),
      message,
    );
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ) {
    logger.error(
      this.enrichWithContext({ trace, context, ...metadata }),
      message,
    );
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>) {
    logger.warn(
      this.enrichWithContext({ context, ...metadata }),
      message,
    );
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>) {
    logger.debug(
      this.enrichWithContext({ context, ...metadata }),
      message,
    );
  }

  verbose(message: string, context?: string, metadata?: Record<string, unknown>) {
    logger.trace(
      this.enrichWithContext({ context, ...metadata }),
      message,
    );
  }

  // Additional helper methods
  fatal(message: string, metadata?: Record<string, unknown>) {
    logger.fatal(this.enrichWithContext(metadata), message);
  }

  http(message: string, metadata?: Record<string, unknown>) {
    logger.info(this.enrichWithContext({ type: 'http', ...metadata }), message);
  }
}
