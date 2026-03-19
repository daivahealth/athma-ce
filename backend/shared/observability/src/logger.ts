/**
 * Structured Logger
 *
 * Provides a Pino-based logger that integrates with OpenTelemetry.
 * Logs include trace context (traceId, spanId) for correlation.
 *
 * Output strategy:
 *   - stdout: pretty-printed (development) or JSON (production)
 *   - file:   JSON logs to LOG_DIR/{serviceName}.log (when LOG_DIR is set)
 *             Promtail scrapes these files and ships them to Loki.
 */

import pino, { Logger as PinoLogger, multistream } from 'pino';
import { LoggerService } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { getObservabilityConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

const config = getObservabilityConfig();

/**
 * Get trace context for logging
 */
function getTraceContext(): { traceId?: string; spanId?: string } {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    return {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
    };
  }
  return {};
}

/**
 * Create the base Pino logger instance
 *
 * When LOG_DIR is set, uses multistream to write:
 *   1. Pretty-printed logs to stdout (for developer terminal)
 *   2. JSON logs to a file (for Promtail to scrape and ship to Loki)
 *
 * When LOG_DIR is not set:
 *   - Development: pretty-printed to stdout
 *   - Production: JSON to stdout (container runtime ships logs)
 */
function createPinoLogger(): PinoLogger {
  const baseOptions: pino.LoggerOptions = {
    level: config.logging.level,
    enabled: config.logging.enabled,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      service: config.exporter.serviceName,
      version: config.exporter.serviceVersion,
      env: config.exporter.environment,
    },
    formatters: {
      level: (label) => ({ level: label }),
    },
    mixin() {
      return getTraceContext();
    },
  };

  const logDir = config.logging.logDir
    ? path.resolve(process.cwd(), config.logging.logDir)
    : undefined;

  // When LOG_DIR is set, write both pretty stdout and JSON file
  if (logDir) {
    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const logFile = path.join(logDir, `${config.exporter.serviceName}.log`);
      const fileStream = pino.destination({
        dest: logFile,
        sync: config.exporter.environment !== 'production',
      });

      const streams: pino.StreamEntry[] = [];

      if (config.logging.pretty) {
        const pinoPretty = require('pino-pretty');
        streams.push({
          stream: pinoPretty({
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          }),
        });
      } else {
        streams.push({ stream: process.stdout });
      }

      streams.push({ stream: fileStream });

      return pino(baseOptions, multistream(streams));
    } catch (error) {
      console.warn(
        `[Observability] Failed to initialize file logging at ${logDir}, falling back to stdout only.`,
        error
      );
    }
  }

  // No LOG_DIR: standard single-destination output
  if (config.logging.pretty) {
    return pino({
      ...baseOptions,
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

  return pino(baseOptions);
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

  constructor(context?: string) {
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
