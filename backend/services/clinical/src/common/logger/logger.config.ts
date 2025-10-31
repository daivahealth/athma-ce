import pino from 'pino';

/**
 * Pino logger configuration
 * - Development: Pretty-printed with colors
 * - Production: JSON formatted for log aggregation
 */
export const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return pino({
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
        level: (label: string) => {
          return { level: label };
        },
        bindings: (bindings: Record<string, unknown>) => {
          return {
            pid: bindings.pid,
            hostname: bindings.hostname,
            service: 'clinical',
          };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    }),

    // Base configuration
    base: {
      service: 'clinical',
      environment: process.env.NODE_ENV || 'development',
    },

    // Serializers for common objects
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
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

export const logger = createLogger();
