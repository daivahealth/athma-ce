"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
/**
 * Pino logger configuration
 * - Development: Pretty-printed with colors
 * - Production: JSON formatted for log aggregation
 */
const createLogger = () => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    return (0, pino_1.default)({
        level: process.env.LOG_LEVEL || 'info',
        // Development configuration
        ...(isDevelopment && {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    messageFormat: '{levelLabel} - {msg}',
                },
            },
        }),
        // Production configuration
        ...(!isDevelopment && {
            formatters: {
                level: (label) => {
                    return { level: label };
                },
                bindings: (bindings) => {
                    return {
                        pid: bindings.pid,
                        hostname: bindings.hostname,
                        service: 'clinical',
                    };
                },
            },
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
        }),
        // Base configuration
        base: {
            service: 'clinical',
            environment: process.env.NODE_ENV || 'development',
        },
        // Serializers for common objects
        serializers: {
            req: pino_1.default.stdSerializers.req,
            res: pino_1.default.stdSerializers.res,
            err: pino_1.default.stdSerializers.err,
        },
        // Redact sensitive fields
        redact: {
            paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'password',
                'passwordHash',
                'token',
                'accessToken',
                'refreshToken',
                'secret',
            ],
            remove: true,
        },
    });
};
exports.createLogger = createLogger;
exports.logger = (0, exports.createLogger)();
//# sourceMappingURL=logger.config.js.map