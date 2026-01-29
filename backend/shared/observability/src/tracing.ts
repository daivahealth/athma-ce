/**
 * Tracing Utilities
 *
 * Provides helpers for creating custom spans and working with trace context.
 */

import {
  trace,
  context,
  SpanKind,
  SpanStatusCode,
  Span,
  Tracer,
  SpanOptions,
  Context,
} from '@opentelemetry/api';
import { getObservabilityConfig } from './config';

const config = getObservabilityConfig();

/**
 * Get the tracer for the current service
 */
export function getTracer(name?: string): Tracer {
  return trace.getTracer(name || config.exporter.serviceName, config.exporter.serviceVersion);
}

/**
 * Get the currently active span
 */
export function getActiveSpan(): Span | undefined {
  return trace.getSpan(context.active());
}

/**
 * Get the current trace context (traceId, spanId)
 */
export function getTraceContext(): { traceId: string; spanId: string } | null {
  const span = getActiveSpan();
  if (!span) {
    return null;
  }
  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

/**
 * Options for creating a span
 */
export interface CreateSpanOptions {
  /** Span name */
  name: string;
  /** Span kind (default: INTERNAL) */
  kind?: SpanKind;
  /** Additional attributes */
  attributes?: Record<string, string | number | boolean>;
  /** Parent context (defaults to current context) */
  parentContext?: Context;
}

/**
 * Create a new span and execute a function within it
 *
 * @example
 * const result = await withSpan({ name: 'processOrder' }, async (span) => {
 *   span.setAttribute('orderId', orderId);
 *   return await processOrder(orderId);
 * });
 */
export async function withSpan<T>(
  options: CreateSpanOptions,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  const tracer = getTracer();
  const spanOptions: SpanOptions = {
    kind: options.kind || SpanKind.INTERNAL,
    attributes: options.attributes,
  };

  const parentContext = options.parentContext || context.active();

  return tracer.startActiveSpan(
    options.name,
    spanOptions,
    parentContext,
    async (span) => {
      try {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        if (error instanceof Error) {
          span.recordException(error);
        }
        throw error;
      } finally {
        span.end();
      }
    }
  );
}

/**
 * Create a new span and execute a synchronous function within it
 */
export function withSpanSync<T>(
  options: CreateSpanOptions,
  fn: (span: Span) => T
): T {
  const tracer = getTracer();
  const spanOptions: SpanOptions = {
    kind: options.kind || SpanKind.INTERNAL,
    attributes: options.attributes,
  };

  const parentContext = options.parentContext || context.active();
  const span = tracer.startSpan(options.name, spanOptions, parentContext);

  try {
    const result = context.with(trace.setSpan(parentContext, span), () => fn(span));
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    if (error instanceof Error) {
      span.recordException(error);
    }
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Add an event to the current span
 */
export function addSpanEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>
): void {
  const span = getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set attributes on the current span
 */
export function setSpanAttributes(attributes: Record<string, string | number | boolean>): void {
  const span = getActiveSpan();
  if (span) {
    span.setAttributes(attributes);
  }
}

/**
 * Record an exception on the current span
 */
export function recordSpanException(error: Error): void {
  const span = getActiveSpan();
  if (span) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }
}

/**
 * Decorator for tracing class methods
 *
 * @example
 * class OrderService {
 *   @Trace('OrderService.processOrder')
 *   async processOrder(orderId: string) {
 *     // Method will be automatically traced
 *   }
 * }
 */
export function Trace(spanName?: string) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: unknown[]) {
      return withSpan({ name }, async () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}

/**
 * Decorator for tracing synchronous class methods
 */
export function TraceSync(spanName?: string) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: unknown[]) {
      return withSpanSync({ name }, () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
