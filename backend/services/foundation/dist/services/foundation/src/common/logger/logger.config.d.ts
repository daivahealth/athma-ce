import pino from 'pino';
/**
 * Pino logger configuration
 * - Development: Pretty-printed with colors
 * - Production: JSON formatted for log aggregation
 */
export declare const createLogger: () => pino.Logger<never, boolean>;
export declare const logger: pino.Logger<never, boolean>;
//# sourceMappingURL=logger.config.d.ts.map