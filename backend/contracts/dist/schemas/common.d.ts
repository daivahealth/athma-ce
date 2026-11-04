import { z } from 'zod';
/**
 * Common validation schemas using Zod
 */
export declare const uuidSchema: z.ZodGUID;
export declare const emailSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
export declare const dateSchema: z.ZodUnion<[z.ZodString, z.ZodDate]>;
export declare const emiratesIdSchema: z.ZodString;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const paginatedResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodAny>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, z.core.$strip>;
export declare const textSearchSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const entityStatusSchema: z.ZodEnum<{
    active: "active";
    inactive: "inactive";
    deleted: "deleted";
    suspended: "suspended";
}>;
export declare const filterOptionsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        deleted: "deleted";
        suspended: "suspended";
    }>, z.ZodArray<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        deleted: "deleted";
        suspended: "suspended";
    }>>]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const queryOptionsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    filters: z.ZodOptional<z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
            active: "active";
            inactive: "inactive";
            deleted: "deleted";
            suspended: "suspended";
        }>, z.ZodArray<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
            deleted: "deleted";
            suspended: "suspended";
        }>>]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, z.core.$strip>>;
    }, z.core.$loose>>;
    include: z.ZodOptional<z.ZodArray<z.ZodString>>;
    select: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const apiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
}, z.core.$strip>;
export declare const apiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, z.core.$strip>>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export declare const validationErrorSchema: z.ZodObject<{
    field: z.ZodString;
    message: z.ZodString;
    code: z.ZodString;
    value: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const validationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    errors: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        message: z.ZodString;
        code: z.ZodString;
        value: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const bulkOperationErrorSchema: z.ZodObject<{
    index: z.ZodNumber;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const bulkOperationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        error: z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        }, z.core.$strip>;
    }, z.core.$strip>>>;
    summary: z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        failed: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const cacheOptionsSchema: z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
    key: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const retryOptionsSchema: z.ZodObject<{
    maxRetries: z.ZodDefault<z.ZodNumber>;
    retryDelay: z.ZodDefault<z.ZodNumber>;
    backoffMultiplier: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const rateLimitSchema: z.ZodObject<{
    windowMs: z.ZodNumber;
    maxRequests: z.ZodNumber;
}, z.core.$strip>;
export type HealthCheck = {
    service: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date | string;
    details?: Record<string, unknown> | undefined;
    dependencies?: HealthCheck[] | undefined;
};
export declare const healthCheckSchema: z.ZodType<HealthCheck>;
export declare const metricDataSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodNumber;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    tags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    unit: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const logEntrySchema: z.ZodObject<{
    level: z.ZodEnum<{
        debug: "debug";
        info: "info";
        warn: "warn";
        error: "error";
    }>;
    message: z.ZodString;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    service: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    traceId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const domainEventSchema: z.ZodObject<{
    id: z.ZodGUID;
    type: z.ZodString;
    aggregateId: z.ZodString;
    aggregateType: z.ZodString;
    version: z.ZodNumber;
    data: z.ZodAny;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
}, z.core.$strip>;
export declare const databaseConfigSchema: z.ZodObject<{
    url: z.ZodString;
    directUrl: z.ZodOptional<z.ZodString>;
    poolSize: z.ZodOptional<z.ZodNumber>;
    timeout: z.ZodOptional<z.ZodNumber>;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const redisConfigSchema: z.ZodObject<{
    url: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    db: z.ZodOptional<z.ZodNumber>;
    keyPrefix: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const messagingConfigSchema: z.ZodObject<{
    type: z.ZodEnum<{
        kafka: "kafka";
        rabbitmq: "rabbitmq";
    }>;
    brokers: z.ZodArray<z.ZodString>;
    groupId: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const authConfigSchema: z.ZodObject<{
    jwtSecret: z.ZodString;
    jwtExpiry: z.ZodString;
    refreshTokenExpiry: z.ZodString;
    mfaRequired: z.ZodBoolean;
}, z.core.$strip>;
export declare const monitoringConfigSchema: z.ZodObject<{
    metrics: z.ZodBoolean;
    tracing: z.ZodBoolean;
    logging: z.ZodBoolean;
    healthCheck: z.ZodBoolean;
}, z.core.$strip>;
export declare const serviceConfigSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    port: z.ZodNumber;
    environment: z.ZodEnum<{
        development: "development";
        staging: "staging";
        production: "production";
    }>;
    database: z.ZodObject<{
        url: z.ZodString;
        directUrl: z.ZodOptional<z.ZodString>;
        poolSize: z.ZodOptional<z.ZodNumber>;
        timeout: z.ZodOptional<z.ZodNumber>;
        ssl: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    redis: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
        db: z.ZodOptional<z.ZodNumber>;
        keyPrefix: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    messaging: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<{
            kafka: "kafka";
            rabbitmq: "rabbitmq";
        }>;
        brokers: z.ZodArray<z.ZodString>;
        groupId: z.ZodOptional<z.ZodString>;
        topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    auth: z.ZodOptional<z.ZodObject<{
        jwtSecret: z.ZodString;
        jwtExpiry: z.ZodString;
        refreshTokenExpiry: z.ZodString;
        mfaRequired: z.ZodBoolean;
    }, z.core.$strip>>;
    monitoring: z.ZodOptional<z.ZodObject<{
        metrics: z.ZodBoolean;
        tracing: z.ZodBoolean;
        logging: z.ZodBoolean;
        healthCheck: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodGUID;
}, z.core.$strip>;
export declare const tenantIdParamSchema: z.ZodObject<{
    tenantId: z.ZodGUID;
}, z.core.$strip>;
export declare const searchQuerySchema: z.ZodObject<{
    q: z.ZodString;
}, z.core.$strip>;
export declare const sortQuerySchema: z.ZodObject<{
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const nameSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    middleName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const addressSchema: z.ZodObject<{
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    stateProvince: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const contactSchema: z.ZodObject<{
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createValidationSchema: <T>(schema: z.ZodSchema<T>) => z.ZodSchema<T, unknown, z.core.$ZodTypeInternals<T, unknown>>;
export declare const updateValidationSchema: <T>(schema: z.ZodSchema<T>) => any;
export declare const queryValidationSchema: <T>(schema: z.ZodSchema<T>) => z.ZodOptional<z.ZodSchema<T, unknown, z.core.$ZodTypeInternals<T, unknown>>>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type PaginatedResult<T> = z.infer<typeof paginatedResultSchema> & {
    data: T[];
};
export type DateRange = z.infer<typeof dateRangeSchema>;
export type TextSearch = z.infer<typeof textSearchSchema>;
export type EntityStatus = z.infer<typeof entityStatusSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
export type QueryOptions = z.infer<typeof queryOptionsSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & {
    data?: T;
};
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
export type BulkOperationResult<T> = z.infer<typeof bulkOperationResultSchema> & {
    data?: T[];
};
export type CacheOptions = z.infer<typeof cacheOptionsSchema>;
export type RetryOptions = z.infer<typeof retryOptionsSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;
export type MetricData = z.infer<typeof metricDataSchema>;
export type LogEntry = z.infer<typeof logEntrySchema>;
export type DomainEvent<T = any> = z.infer<typeof domainEventSchema> & {
    data: T;
};
export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export type RedisConfig = z.infer<typeof redisConfigSchema>;
export type MessagingConfig = z.infer<typeof messagingConfigSchema>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export type MonitoringConfig = z.infer<typeof monitoringConfigSchema>;
export type ServiceConfig = z.infer<typeof serviceConfigSchema>;
export type Name = z.infer<typeof nameSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;
//# sourceMappingURL=common.d.ts.map