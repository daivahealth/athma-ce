/**
 * Structured Logger
 *
 * Provides a Pino-based logger that integrates with OpenTelemetry.
 * Logs include trace context (traceId, spanId) for correlation.
 * When observability is enabled, logs are also sent to Loki.
 */

import pino, { Logger as PinoLogger, multistream } from 'pino';
import { LoggerService } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { getObservabilityConfig } from './config';
import { Writable } from 'stream';

const config = getObservabilityConfig();

/**
 * Loki log entry
 */
interface LokiEntry {
  timestamp: string;
  line: string;
}

/**
 * Create a writable stream that sends logs to Loki
 */
function createLokiStream(
  lokiUrl: string,
  labels: Record<string, string>,
  interval = 5000,
  batchSize = 100
): Writable {
  const pushUrl = `${lokiUrl}/loki/api/v1/push`;
  let batch: LokiEntry[] = [];
  let timer: NodeJS.Timeout | null = null;

  async function flush() {
    if (batch.length === 0) return;

    const entries = batch;
    batch = [];

    const payload = {
      streams: [
        {
          stream: labels,
          values: entries.map((entry) => [entry.timestamp, entry.line]),
        },
      ],
    };

    try {
      const response = await fetch(pushUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`[Loki] Push failed: ${response.status} - ${text}`);
      }
    } catch (error) {
      console.error('[Loki] Error pushing logs:', error);
    }
  }

  function scheduleFlush() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      flush().catch(console.error);
    }, interval);
  }

  const stream = new Writable({
    objectMode: false,
    write(chunk, _encoding, callback) {
      try {
        const line = chunk.toString().trim();
        if (!line) {
          callback();
          return;
        }

        // Parse to get the timestamp
        let logObj: Record<string, unknown>;
        try {
          logObj = JSON.parse(line);
        } catch {
          logObj = { msg: line, time: Date.now() };
        }

        // Convert timestamp to nanoseconds string
        const timeValue = logObj.time || Date.now();
        const ts = String(BigInt(new Date(timeValue as number).getTime()) * 1000000n);

        batch.push({ timestamp: ts, line });

        if (batch.length >= batchSize) {
          flush().catch(console.error);
        } else {
          scheduleFlush();
        }

        callback();
      } catch (error) {
        console.error('[Loki] Write error:', error);
        callback();
      }
    },
    final(callback) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      flush()
        .then(() => callback())
        .catch((err) => callback(err));
    },
  });

  return stream;
}

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
 */
function createPinoLogger(): PinoLogger {
  const lokiEnabled = config.enabled && config.logging.enabled;
  const lokiUrl = process.env.LOKI_URL || 'http://localhost:3100';

  // When Loki is enabled, use multistream with custom Loki stream
  if (lokiEnabled) {
    // Create the Loki stream
    const lokiStream = createLokiStream(lokiUrl, {
      application: 'zeal-healthcare',
      service: config.exporter.serviceName,
      environment: config.exporter.environment,
    });

    // Create multistream with console and Loki
    const streams = multistream([
      // Console output (stdout)
      { stream: process.stdout },
      // Loki output
      { stream: lokiStream },
    ]);

    // Create logger with multistream
    const lokiLogger = pino({
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
    }, streams);

    return lokiLogger;
  }

  // Standard config without Loki (supports full features)
  const baseOptions: pino.LoggerOptions = {
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
    mixin() {
      return getTraceContext();
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

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
