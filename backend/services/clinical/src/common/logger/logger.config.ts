/**
 * Logger configuration for Clinical service
 *
 * Re-exports the shared observability logger to ensure consistent
 * logging across all services with Loki integration.
 */

import { logger as observabilityLogger, createLogger as createObservabilityLogger } from '@zeal/observability';

/**
 * Create a logger instance
 * @deprecated Use the shared logger from @zeal/observability directly
 */
export const createLogger = () => {
  return observabilityLogger;
};

/**
 * Main logger instance
 * Uses the shared observability logger for Loki integration
 */
export const logger = observabilityLogger;

/**
 * Create a child logger with additional context
 */
export const createChildLogger = (context: Record<string, unknown>) => {
  return createObservabilityLogger(context);
};
