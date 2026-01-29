/**
 * Structured Logger
 *
 * Provides a Pino-based logger that integrates with OpenTelemetry.
 * Logs include trace context (traceId, spanId) for correlation.
 */

import pino, { Logger as PinoLogger } from 'pino';
import { LoggerService } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { getObservabilityConfig } from './config';

const config = getObservabilityConfig();

/**
 * Create the base Pino logger instance
 */
function createPinoLogger(): PinoLogger {
  const pinoConfig: pino.LoggerOptions = {
    level: config.logging.level,
    enabled: config.logging.enabled,
    base: {
      service: config.exporter.serviceName,
      version: config.exporter.serviceVersion,
      env: config.exporter.environment,
    },
    formatters: {
      level: (label) => ({ level: label }),
    },
    // Add trace context to every log
    mixin() {
      const span = trace.getSpan(context.active());
      if (span) {
        const spanContext = span.spanContext();
        return {
          traceId: spanContext.traceId,
          spanId: spanContext.spanId,
        };
      }
      return {};
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  // Add pretty printing for development
  if (config.logging.pretty) {
    return pino({
      ...pinoConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  return pino(pinoConfig);
}

/**
 * The main logger instance
 */
export const logger = createPinoLogger();

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>): PinoLogger {
  return logger.child(context);
}

/**
 * NestJS LoggerService implementation using Pino
 *
 * Usage in main.ts:
 *   const app = await NestFactory.create(AppModule, {
 *     logger: new PinoLoggerService(),
 *   });
 */
export class PinoLoggerService implements LoggerService {
  private contextLogger: PinoLogger;

  constructor(private readonly context?: string) {
    this.contextLogger = context ? logger.child({ context }) : logger;
  }

  /**
   * Write a log message at the 'info' level
   */
  log(message: string, ...optionalParams: unknown[]): void {
    const [context] = optionalParams;
    if (typeof context === 'string') {
      this.contextLogger.child({ context }).info(message);
    } else {
      this.contextLogger.info(message);
    }
  }

  /**
   * Write a log message at the 'error' level
   */
  error(message: string, ...optionalParams: unknown[]): void {
    const [trace, context] = optionalParams;
    const logData: Record<string, unknown> = {};

    if (trace instanceof Error) {
      logData.error = {
        message: trace.message,
        stack: trace.stack,
        name: trace.name,
      };
    } else if (typeof trace === 'string') {
      logData.trace = trace;
    }

    if (typeof context === 'string') {
      this.contextLogger.child({ context, ...logData }).error(message);
    } else {
      this.contextLogger.child(logData).error(message);
    }
  }

  /**
   * Write a log message at the 'warn' level
   */
  warn(message: string, ...optionalParams: unknown[]): void {
    const [context] = optionalParams;
    if (typeof context === 'string') {
      this.contextLogger.child({ context }).warn(message);
    } else {
      this.contextLogger.warn(message);
    }
  }

  /**
   * Write a log message at the 'debug' level
   */
  debug(message: string, ...optionalParams: unknown[]): void {
    const [context] = optionalParams;
    if (typeof context === 'string') {
      this.contextLogger.child({ context }).debug(message);
    } else {
      this.contextLogger.debug(message);
    }
  }

  /**
   * Write a log message at the 'trace' level (verbose)
   */
  verbose(message: string, ...optionalParams: unknown[]): void {
    const [context] = optionalParams;
    if (typeof context === 'string') {
      this.contextLogger.child({ context }).trace(message);
    } else {
      this.contextLogger.trace(message);
    }
  }

  /**
   * Set the log context
   */
  setContext(context: string): void {
    this.contextLogger = logger.child({ context });
  }
}

/**
 * Request logger middleware context type
 */
export interface RequestLogContext {
  method: string;
  url: string;
  statusCode?: number;
  duration?: number;
  userId?: string;
  tenantId?: string;
  traceId?: string;
}

/**
 * Log an HTTP request (for use in middleware)
 */
export function logRequest(ctx: RequestLogContext): void {
  const logLevel = ctx.statusCode && ctx.statusCode >= 400 ? 'error' : 'info';
  logger[logLevel]({
    type: 'http',
    ...ctx,
  }, `${ctx.method} ${ctx.url} ${ctx.statusCode || '-'} ${ctx.duration ? `${ctx.duration}ms` : ''}`);
}
