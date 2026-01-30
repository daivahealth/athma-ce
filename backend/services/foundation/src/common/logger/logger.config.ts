/**
 * Logger configuration for Foundation service
 *
 * Re-exports the shared observability logger to ensure consistent
 * logging across all services. Logs are written to JSON files
 * that Promtail scrapes and ships to Loki.
 */

export { logger, createLogger } from '@zeal/observability';
