/**
 * OpenTelemetry Instrumentation
 *
 * IMPORTANT: This file must be imported BEFORE any other application code
 * to ensure proper instrumentation of all libraries.
 *
 * Usage in main.ts:
 *   import { initializeObservability } from '@zeal/observability';
 *   initializeObservability();
 *
 *   // Then import everything else
 *   import { NestFactory } from '@nestjs/core';
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_SERVICE_NAMESPACE,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { getObservabilityConfig, ObservabilityConfig } from './config';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry instrumentation
 *
 * @returns boolean - true if initialization was successful
 */
export function initializeObservability(): boolean {
  const config = getObservabilityConfig();

  if (!config.enabled) {
    console.log('[Observability] Disabled - skipping initialization');
    return false;
  }

  if (sdk) {
    console.log('[Observability] Already initialized');
    return true;
  }

  try {
    // Enable debug logging for OpenTelemetry if in development
    if (config.logging.level === 'debug' || config.logging.level === 'trace') {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
    }

    // Create resource with service information
    const resource = new Resource({
      [SEMRESATTRS_SERVICE_NAME]: config.exporter.serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: config.exporter.serviceVersion,
      [SEMRESATTRS_SERVICE_NAMESPACE]: config.exporter.serviceNamespace,
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: config.exporter.environment,
    });

    // Configure trace exporter and sampler
    const traceExporter = config.tracing.enabled
      ? new OTLPTraceExporter({
        url: `${config.exporter.endpoint}/v1/traces`,
      })
      : undefined;

    const sampler = new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(config.tracing.sampleRate),
    });

    // Configure metric reader
    const metricReader = config.metrics.enabled
      ? new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${config.exporter.endpoint}/v1/metrics`,
        }),
        exportIntervalMillis: config.metrics.exportIntervalMs,
      })
      : undefined;

    // Configure log processor
    const logRecordProcessor = config.logging.enabled
      ? new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${config.exporter.endpoint}/v1/logs`,
        })
      )
      : undefined;

    // Build instrumentations list
    const instrumentations = [
      getNodeAutoInstrumentations({
        // Disable noisy instrumentations
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
        // Configure HTTP instrumentation
        '@opentelemetry/instrumentation-http': {
          ignoreIncomingPaths: ['/health', '/ready', '/metrics', '/favicon.ico'],
        },
      }),
      // Add Prisma instrumentation for database tracing
      new PrismaInstrumentation(),
    ];

    // Build SDK configuration
    const sdkConfig: any = {
      resource,
      sampler,
      traceExporter,
      logRecordProcessor,
      instrumentations,
    };

    // Only add optional properties if they are defined
    if (metricReader) {
      sdkConfig.metricReader = metricReader;
    }
    if (traceExporter) {
      sdkConfig.spanProcessors = [new BatchSpanProcessor(traceExporter)];
    }

    // Create and start the SDK
    sdk = new NodeSDK(sdkConfig);

    sdk.start();

    console.log(`[Observability] Initialized for ${config.exporter.serviceName}`);
    console.log(`[Observability] Tracing: ${config.tracing.enabled ? `enabled (${config.tracing.sampleRate * 100}% sample rate)` : 'disabled'}`);
    console.log(`[Observability] Metrics: ${config.metrics.enabled ? 'enabled' : 'disabled'}`);
    console.log(`[Observability] Logging: ${config.logging.enabled ? 'enabled' : 'disabled'}`);
    console.log(`[Observability] Exporting to: ${config.exporter.endpoint}`);

    // Graceful shutdown
    const shutdown = async () => {
      console.log('[Observability] Shutting down...');
      try {
        await sdk?.shutdown();
        console.log('[Observability] Shutdown complete');
      } catch (error) {
        console.error('[Observability] Error during shutdown:', error);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return true;
  } catch (error) {
    console.error('[Observability] Failed to initialize:', error);
    return false;
  }
}

/**
 * Get the current SDK instance (for testing/advanced use)
 */
export function getSDK(): NodeSDK | null {
  return sdk;
}

/**
 * Check if observability is initialized
 */
export function isObservabilityInitialized(): boolean {
  return sdk !== null;
}

/**
 * Shutdown observability (for graceful shutdown or testing)
 */
export async function shutdownObservability(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    sdk = null;
  }
}
