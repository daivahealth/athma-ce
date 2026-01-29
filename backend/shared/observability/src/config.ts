/**
 * Observability Configuration
 *
 * Loads configuration from environment variables with sensible defaults.
 * Supports toggling individual pillars (metrics, logs, traces) independently.
 */

export interface ObservabilityConfig {
  /** Master toggle for all observability features */
  enabled: boolean;

  /** Metrics configuration */
  metrics: {
    enabled: boolean;
    /** Metrics export interval in milliseconds */
    exportIntervalMs: number;
  };

  /** Logging configuration */
  logging: {
    enabled: boolean;
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    /** Pretty print logs (for development) */
    pretty: boolean;
  };

  /** Tracing configuration */
  tracing: {
    enabled: boolean;
    /** Sample rate (0.0 to 1.0) - percentage of requests to trace */
    sampleRate: number;
  };

  /** Exporter configuration */
  exporter: {
    /** OpenTelemetry Collector endpoint */
    endpoint: string;
    /** Service name for identification */
    serviceName: string;
    /** Service version */
    serviceVersion: string;
    /** Service namespace */
    serviceNamespace: string;
    /** Deployment environment */
    environment: string;
  };
}

/**
 * Load observability configuration from environment variables
 */
export function loadObservabilityConfig(): ObservabilityConfig {
  const masterEnabled = process.env.OBSERVABILITY_ENABLED === 'true';
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return {
    enabled: masterEnabled,

    metrics: {
      enabled: masterEnabled && process.env.METRICS_ENABLED !== 'false',
      exportIntervalMs: parseInt(process.env.METRICS_EXPORT_INTERVAL_MS || '60000', 10),
    },

    logging: {
      enabled: process.env.LOGGING_ENABLED !== 'false', // Logging enabled by default even when observability is off
      level: (process.env.LOG_LEVEL as ObservabilityConfig['logging']['level']) || (isDevelopment ? 'debug' : 'info'),
      pretty: process.env.LOG_PRETTY === 'true' || isDevelopment,
    },

    tracing: {
      enabled: masterEnabled && process.env.TRACING_ENABLED !== 'false',
      sampleRate: parseFloat(process.env.TRACE_SAMPLE_RATE || (isDevelopment ? '1.0' : '0.1')),
    },

    exporter: {
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
      serviceName: process.env.OTEL_SERVICE_NAME || 'unknown-service',
      serviceVersion: process.env.OTEL_SERVICE_VERSION || process.env.npm_package_version || '0.0.0',
      serviceNamespace: process.env.OTEL_SERVICE_NAMESPACE || 'zeal',
      environment: process.env.NODE_ENV || 'development',
    },
  };
}

/**
 * Singleton instance of the configuration
 */
let configInstance: ObservabilityConfig | null = null;

/**
 * Get the observability configuration (cached singleton)
 */
export function getObservabilityConfig(): ObservabilityConfig {
  if (!configInstance) {
    configInstance = loadObservabilityConfig();
  }
  return configInstance;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetObservabilityConfig(): void {
  configInstance = null;
}
