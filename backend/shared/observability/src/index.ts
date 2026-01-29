/**
 * @zeal/observability
 *
 * Observability package for Zeal Healthcare Platform.
 * Provides OpenTelemetry instrumentation, structured logging, and metrics.
 *
 * IMPORTANT: Initialize observability BEFORE importing any other modules:
 *
 * @example
 * // main.ts
 * import { initializeObservability } from '@zeal/observability';
 * initializeObservability();
 *
 * // Then import everything else
 * import { NestFactory } from '@nestjs/core';
 * import { AppModule } from './app.module';
 */

// Configuration
export {
  ObservabilityConfig,
  loadObservabilityConfig,
  getObservabilityConfig,
  resetObservabilityConfig,
} from './config';

// Instrumentation
export {
  initializeObservability,
  shutdownObservability,
  isObservabilityInitialized,
  getSDK,
} from './instrumentation';

// Logger
export {
  logger,
  createLogger,
  PinoLoggerService,
  logRequest,
  RequestLogContext,
} from './logger';

// Tracing
export {
  getTracer,
  getActiveSpan,
  getTraceContext,
  withSpan,
  withSpanSync,
  addSpanEvent,
  setSpanAttributes,
  recordSpanException,
  Trace,
  TraceSync,
  CreateSpanOptions,
} from './tracing';

// Metrics
export {
  getMeter,
  httpMetrics,
  dbMetrics,
  businessMetrics,
  createCounter,
  createHistogram,
  createUpDownCounter,
  createObservableGauge,
  recordHttpRequest,
  recordDbQuery,
  MetricsTimer,
} from './metrics';

// NestJS Integration
export {
  ObservabilityModule,
  ObservabilityModuleOptions,
  RequestLoggingMiddleware,
} from './nestjs';
