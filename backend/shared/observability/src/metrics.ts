/**
 * Metrics Utilities
 *
 * Provides helpers for creating and recording custom metrics.
 */

import {
  metrics,
  Meter,
  Counter,
  Histogram,
  UpDownCounter,
  ObservableGauge,
  Attributes,
} from '@opentelemetry/api';
import { getObservabilityConfig } from './config';

const config = getObservabilityConfig();

/**
 * Get the meter for the current service
 */
export function getMeter(name?: string): Meter {
  return metrics.getMeter(name || config.exporter.serviceName, config.exporter.serviceVersion);
}

/**
 * Pre-configured meters for common use cases
 */
const meter = getMeter();

/**
 * HTTP request metrics
 */
export const httpMetrics = {
  /**
   * Counter for total HTTP requests
   */
  requestsTotal: meter.createCounter('http_requests_total', {
    description: 'Total number of HTTP requests',
    unit: '1',
  }),

  /**
   * Histogram for HTTP request duration
   */
  requestDuration: meter.createHistogram('http_request_duration_seconds', {
    description: 'HTTP request duration in seconds',
    unit: 's',
  }),

  /**
   * Counter for HTTP request errors
   */
  requestErrors: meter.createCounter('http_request_errors_total', {
    description: 'Total number of HTTP request errors',
    unit: '1',
  }),

  /**
   * Gauge for active HTTP connections
   */
  activeConnections: meter.createUpDownCounter('http_active_connections', {
    description: 'Number of active HTTP connections',
    unit: '1',
  }),
};

/**
 * Database metrics
 */
export const dbMetrics = {
  /**
   * Counter for database queries
   */
  queriesTotal: meter.createCounter('db_queries_total', {
    description: 'Total number of database queries',
    unit: '1',
  }),

  /**
   * Histogram for database query duration
   */
  queryDuration: meter.createHistogram('db_query_duration_seconds', {
    description: 'Database query duration in seconds',
    unit: 's',
  }),

  /**
   * Counter for database errors
   */
  queryErrors: meter.createCounter('db_query_errors_total', {
    description: 'Total number of database query errors',
    unit: '1',
  }),

  /**
   * Gauge for active database connections
   */
  activeConnections: meter.createUpDownCounter('db_active_connections', {
    description: 'Number of active database connections',
    unit: '1',
  }),
};

/**
 * Business metrics for healthcare domain
 */
export const businessMetrics = {
  /**
   * Counter for appointments created
   */
  appointmentsCreated: meter.createCounter('appointments_created_total', {
    description: 'Total number of appointments created',
    unit: '1',
  }),

  /**
   * Counter for encounters started
   */
  encountersStarted: meter.createCounter('encounters_started_total', {
    description: 'Total number of encounters started',
    unit: '1',
  }),

  /**
   * Counter for patients registered
   */
  patientsRegistered: meter.createCounter('patients_registered_total', {
    description: 'Total number of patients registered',
    unit: '1',
  }),

  /**
   * Histogram for appointment wait time
   */
  appointmentWaitTime: meter.createHistogram('appointment_wait_time_minutes', {
    description: 'Time between check-in and encounter start in minutes',
    unit: 'min',
  }),

  /**
   * Histogram for encounter duration
   */
  encounterDuration: meter.createHistogram('encounter_duration_minutes', {
    description: 'Duration of encounters in minutes',
    unit: 'min',
  }),
};

/**
 * Create a custom counter
 */
export function createCounter(
  name: string,
  options?: { description?: string; unit?: string }
): Counter {
  return meter.createCounter(name, options);
}

/**
 * Create a custom histogram
 */
export function createHistogram(
  name: string,
  options?: { description?: string; unit?: string }
): Histogram {
  return meter.createHistogram(name, options);
}

/**
 * Create a custom up-down counter (gauge-like)
 */
export function createUpDownCounter(
  name: string,
  options?: { description?: string; unit?: string }
): UpDownCounter {
  return meter.createUpDownCounter(name, options);
}

/**
 * Create a custom observable gauge
 */
export function createObservableGauge(
  name: string,
  callback: (observableResult: { observe: (value: number, attributes?: Attributes) => void }) => void,
  options?: { description?: string; unit?: string }
): ObservableGauge {
  return meter.createObservableGauge(name, options);
}

/**
 * Record HTTP request metrics
 */
export function recordHttpRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number
): void {
  const attributes: Attributes = {
    method,
    path,
    status_code: statusCode.toString(),
    status_class: `${Math.floor(statusCode / 100)}xx`,
  };

  httpMetrics.requestsTotal.add(1, attributes);
  httpMetrics.requestDuration.record(durationMs / 1000, attributes);

  if (statusCode >= 400) {
    httpMetrics.requestErrors.add(1, attributes);
  }
}

/**
 * Record database query metrics
 */
export function recordDbQuery(
  operation: string,
  table: string,
  durationMs: number,
  error?: boolean
): void {
  const attributes: Attributes = {
    operation,
    table,
  };

  dbMetrics.queriesTotal.add(1, attributes);
  dbMetrics.queryDuration.record(durationMs / 1000, attributes);

  if (error) {
    dbMetrics.queryErrors.add(1, attributes);
  }
}

/**
 * Timer utility for measuring durations
 */
export class MetricsTimer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get elapsed time in milliseconds
   */
  elapsedMs(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get elapsed time in seconds
   */
  elapsedSeconds(): number {
    return this.elapsedMs() / 1000;
  }

  /**
   * Record elapsed time to a histogram
   */
  recordTo(histogram: Histogram, attributes?: Attributes): void {
    histogram.record(this.elapsedSeconds(), attributes);
  }
}
