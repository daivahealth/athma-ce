import { z } from 'zod';
/**
 * Common validation schemas using Zod
 */
export declare const uuidSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
export declare const dateSchema: z.ZodUnion<[z.ZodString, z.ZodDate]>;
export declare const emiratesIdSchema: z.ZodString;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const paginatedResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodAny, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, "strip", z.ZodTypeAny, {
    from?: string | Date | undefined;
    to?: string | Date | undefined;
}, {
    from?: string | Date | undefined;
    to?: string | Date | undefined;
}>;
export declare const textSearchSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    fields?: string[] | undefined;
}, {
    search?: string | undefined;
    fields?: string[] | undefined;
}>;
export declare const entityStatusSchema: z.ZodEnum<["active", "inactive", "suspended", "deleted"]>;
export declare const filterOptionsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    }, "strip", z.ZodTypeAny, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    }, "strip", z.ZodTypeAny, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    }, "strip", z.ZodTypeAny, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const queryOptionsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    filters: z.ZodOptional<z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, "strip", z.ZodTypeAny, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, "strip", z.ZodTypeAny, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, "strip", z.ZodTypeAny, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">>>;
    include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    select: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    select?: string[] | undefined;
    include?: string[] | undefined;
    sortBy?: string | undefined;
    filters?: z.objectOutputType<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, "strip", z.ZodTypeAny, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    select?: string[] | undefined;
    include?: string[] | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    filters?: z.objectInputType<{
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, z.ZodArray<z.ZodEnum<["active", "inactive", "suspended", "deleted"]>, "many">]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        }, "strip", z.ZodTypeAny, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }, {
            from?: string | Date | undefined;
            to?: string | Date | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
export declare const apiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
}, "strip", z.ZodTypeAny, {
    message: string;
    code: string;
    timestamp: string | Date;
    details?: Record<string, any> | undefined;
}, {
    message: string;
    code: string;
    timestamp: string | Date;
    details?: Record<string, any> | undefined;
}>;
export declare const apiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    }, {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    } | undefined;
    data?: any;
    meta?: Record<string, any> | undefined;
}, {
    success: boolean;
    error?: {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    } | undefined;
    data?: any;
    meta?: Record<string, any> | undefined;
}>;
export declare const validationErrorSchema: z.ZodObject<{
    field: z.ZodString;
    message: z.ZodString;
    code: z.ZodString;
    value: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    message: string;
    code: string;
    field: string;
    value?: any;
}, {
    message: string;
    code: string;
    field: string;
    value?: any;
}>;
export declare const validationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    errors: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        message: z.ZodString;
        code: z.ZodString;
        value: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        field: string;
        value?: any;
    }, {
        message: string;
        code: string;
        field: string;
        value?: any;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    isValid: boolean;
    errors: {
        message: string;
        code: string;
        field: string;
        value?: any;
    }[];
}, {
    isValid: boolean;
    errors: {
        message: string;
        code: string;
        field: string;
        value?: any;
    }[];
}>;
export declare const bulkOperationErrorSchema: z.ZodObject<{
    index: z.ZodNumber;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    }, {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    };
    index: number;
}, {
    error: {
        message: string;
        code: string;
        timestamp: string | Date;
        details?: Record<string, any> | undefined;
    };
    index: number;
}>;
export declare const bulkOperationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        error: z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        }, {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        error: {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        };
        index: number;
    }, {
        error: {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        };
        index: number;
    }>, "many">>;
    summary: z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        failed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        success: number;
        failed: number;
        total: number;
    }, {
        success: number;
        failed: number;
        total: number;
    }>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    summary: {
        success: number;
        failed: number;
        total: number;
    };
    data?: any[] | undefined;
    errors?: {
        error: {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        };
        index: number;
    }[] | undefined;
}, {
    success: boolean;
    summary: {
        success: number;
        failed: number;
        total: number;
    };
    data?: any[] | undefined;
    errors?: {
        error: {
            message: string;
            code: string;
            timestamp: string | Date;
            details?: Record<string, any> | undefined;
        };
        index: number;
    }[] | undefined;
}>;
export declare const cacheOptionsSchema: z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
    key: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    ttl?: number | undefined;
    key?: string | undefined;
    tags?: string[] | undefined;
}, {
    ttl?: number | undefined;
    key?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const retryOptionsSchema: z.ZodObject<{
    maxRetries: z.ZodDefault<z.ZodNumber>;
    retryDelay: z.ZodDefault<z.ZodNumber>;
    backoffMultiplier: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
}, {
    maxRetries?: number | undefined;
    retryDelay?: number | undefined;
    backoffMultiplier?: number | undefined;
}>;
export declare const rateLimitSchema: z.ZodObject<{
    windowMs: z.ZodNumber;
    maxRequests: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    windowMs: number;
    maxRequests: number;
}, {
    windowMs: number;
    maxRequests: number;
}>;
export declare const healthCheckSchema: any;
export declare const metricDataSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodNumber;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    tags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    unit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    value: number;
    timestamp: string | Date;
    tags?: Record<string, string> | undefined;
    unit?: string | undefined;
}, {
    name: string;
    value: number;
    timestamp: string | Date;
    tags?: Record<string, string> | undefined;
    unit?: string | undefined;
}>;
export declare const logEntrySchema: z.ZodObject<{
    level: z.ZodEnum<["debug", "info", "warn", "error"]>;
    message: z.ZodString;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    service: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    traceId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    level: "info" | "warn" | "error" | "debug";
    message: string;
    timestamp: string | Date;
    service: string;
    context?: Record<string, any> | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}, {
    level: "info" | "warn" | "error" | "debug";
    message: string;
    timestamp: string | Date;
    service: string;
    context?: Record<string, any> | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}>;
export declare const domainEventSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    aggregateId: z.ZodString;
    aggregateType: z.ZodString;
    version: z.ZodNumber;
    data: z.ZodAny;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    timestamp: string | Date;
    aggregateId: string;
    aggregateType: string;
    version: number;
    data?: any;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    type: string;
    timestamp: string | Date;
    aggregateId: string;
    aggregateType: string;
    version: number;
    data?: any;
    metadata?: Record<string, any> | undefined;
}>;
export declare const databaseConfigSchema: z.ZodObject<{
    url: z.ZodString;
    directUrl: z.ZodOptional<z.ZodString>;
    poolSize: z.ZodOptional<z.ZodNumber>;
    timeout: z.ZodOptional<z.ZodNumber>;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    url: string;
    timeout?: number | undefined;
    directUrl?: string | undefined;
    poolSize?: number | undefined;
    ssl?: boolean | undefined;
}, {
    url: string;
    timeout?: number | undefined;
    directUrl?: string | undefined;
    poolSize?: number | undefined;
    ssl?: boolean | undefined;
}>;
export declare const redisConfigSchema: z.ZodObject<{
    url: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    db: z.ZodOptional<z.ZodNumber>;
    keyPrefix: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    password?: string | undefined;
    db?: number | undefined;
    keyPrefix?: string | undefined;
}, {
    url: string;
    password?: string | undefined;
    db?: number | undefined;
    keyPrefix?: string | undefined;
}>;
export declare const messagingConfigSchema: z.ZodObject<{
    type: z.ZodEnum<["kafka", "rabbitmq"]>;
    brokers: z.ZodArray<z.ZodString, "many">;
    groupId: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "kafka" | "rabbitmq";
    brokers: string[];
    groupId?: string | undefined;
    topics?: string[] | undefined;
}, {
    type: "kafka" | "rabbitmq";
    brokers: string[];
    groupId?: string | undefined;
    topics?: string[] | undefined;
}>;
export declare const authConfigSchema: z.ZodObject<{
    jwtSecret: z.ZodString;
    jwtExpiry: z.ZodString;
    refreshTokenExpiry: z.ZodString;
    mfaRequired: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    jwtSecret: string;
    jwtExpiry: string;
    refreshTokenExpiry: string;
    mfaRequired: boolean;
}, {
    jwtSecret: string;
    jwtExpiry: string;
    refreshTokenExpiry: string;
    mfaRequired: boolean;
}>;
export declare const monitoringConfigSchema: z.ZodObject<{
    metrics: z.ZodBoolean;
    tracing: z.ZodBoolean;
    logging: z.ZodBoolean;
    healthCheck: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    metrics: boolean;
    tracing: boolean;
    logging: boolean;
    healthCheck: boolean;
}, {
    metrics: boolean;
    tracing: boolean;
    logging: boolean;
    healthCheck: boolean;
}>;
export declare const serviceConfigSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    port: z.ZodNumber;
    environment: z.ZodEnum<["development", "staging", "production"]>;
    database: z.ZodObject<{
        url: z.ZodString;
        directUrl: z.ZodOptional<z.ZodString>;
        poolSize: z.ZodOptional<z.ZodNumber>;
        timeout: z.ZodOptional<z.ZodNumber>;
        ssl: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        timeout?: number | undefined;
        directUrl?: string | undefined;
        poolSize?: number | undefined;
        ssl?: boolean | undefined;
    }, {
        url: string;
        timeout?: number | undefined;
        directUrl?: string | undefined;
        poolSize?: number | undefined;
        ssl?: boolean | undefined;
    }>;
    redis: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
        db: z.ZodOptional<z.ZodNumber>;
        keyPrefix: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        password?: string | undefined;
        db?: number | undefined;
        keyPrefix?: string | undefined;
    }, {
        url: string;
        password?: string | undefined;
        db?: number | undefined;
        keyPrefix?: string | undefined;
    }>>;
    messaging: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["kafka", "rabbitmq"]>;
        brokers: z.ZodArray<z.ZodString, "many">;
        groupId: z.ZodOptional<z.ZodString>;
        topics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "kafka" | "rabbitmq";
        brokers: string[];
        groupId?: string | undefined;
        topics?: string[] | undefined;
    }, {
        type: "kafka" | "rabbitmq";
        brokers: string[];
        groupId?: string | undefined;
        topics?: string[] | undefined;
    }>>;
    auth: z.ZodOptional<z.ZodObject<{
        jwtSecret: z.ZodString;
        jwtExpiry: z.ZodString;
        refreshTokenExpiry: z.ZodString;
        mfaRequired: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        jwtSecret: string;
        jwtExpiry: string;
        refreshTokenExpiry: string;
        mfaRequired: boolean;
    }, {
        jwtSecret: string;
        jwtExpiry: string;
        refreshTokenExpiry: string;
        mfaRequired: boolean;
    }>>;
    monitoring: z.ZodOptional<z.ZodObject<{
        metrics: z.ZodBoolean;
        tracing: z.ZodBoolean;
        logging: z.ZodBoolean;
        healthCheck: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        metrics: boolean;
        tracing: boolean;
        logging: boolean;
        healthCheck: boolean;
    }, {
        metrics: boolean;
        tracing: boolean;
        logging: boolean;
        healthCheck: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    port: number;
    environment: "development" | "staging" | "production";
    database: {
        url: string;
        timeout?: number | undefined;
        directUrl?: string | undefined;
        poolSize?: number | undefined;
        ssl?: boolean | undefined;
    };
    redis?: {
        url: string;
        password?: string | undefined;
        db?: number | undefined;
        keyPrefix?: string | undefined;
    } | undefined;
    messaging?: {
        type: "kafka" | "rabbitmq";
        brokers: string[];
        groupId?: string | undefined;
        topics?: string[] | undefined;
    } | undefined;
    auth?: {
        jwtSecret: string;
        jwtExpiry: string;
        refreshTokenExpiry: string;
        mfaRequired: boolean;
    } | undefined;
    monitoring?: {
        metrics: boolean;
        tracing: boolean;
        logging: boolean;
        healthCheck: boolean;
    } | undefined;
}, {
    name: string;
    version: string;
    port: number;
    environment: "development" | "staging" | "production";
    database: {
        url: string;
        timeout?: number | undefined;
        directUrl?: string | undefined;
        poolSize?: number | undefined;
        ssl?: boolean | undefined;
    };
    redis?: {
        url: string;
        password?: string | undefined;
        db?: number | undefined;
        keyPrefix?: string | undefined;
    } | undefined;
    messaging?: {
        type: "kafka" | "rabbitmq";
        brokers: string[];
        groupId?: string | undefined;
        topics?: string[] | undefined;
    } | undefined;
    auth?: {
        jwtSecret: string;
        jwtExpiry: string;
        refreshTokenExpiry: string;
        mfaRequired: boolean;
    } | undefined;
    monitoring?: {
        metrics: boolean;
        tracing: boolean;
        logging: boolean;
        healthCheck: boolean;
    } | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const tenantIdParamSchema: z.ZodObject<{
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
}, {
    tenantId: string;
}>;
export declare const searchQuerySchema: z.ZodObject<{
    q: z.ZodString;
}, "strip", z.ZodTypeAny, {
    q: string;
}, {
    q: string;
}>;
export declare const sortQuerySchema: z.ZodObject<{
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    order: "asc" | "desc";
    sort?: string | undefined;
}, {
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
}>;
export declare const nameSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    middleName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    middleName?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    middleName?: string | undefined;
}>;
export declare const addressSchema: z.ZodObject<{
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    stateProvince: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    addressLine1: string;
    city: string;
    postalCode: string;
    stateProvince: string;
    country: string;
    addressLine2?: string | undefined;
}, {
    addressLine1: string;
    city: string;
    postalCode: string;
    stateProvince: string;
    addressLine2?: string | undefined;
    country?: string | undefined;
}>;
export declare const contactSchema: z.ZodObject<{
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phoneNumber?: string | undefined;
}, {
    email?: string | undefined;
    phoneNumber?: string | undefined;
}>;
export declare const createValidationSchema: <T>(schema: z.ZodSchema<T>) => z.ZodType<T, z.ZodTypeDef, T>;
export declare const updateValidationSchema: <T>(schema: z.ZodSchema<T>) => any;
export declare const queryValidationSchema: <T>(schema: z.ZodSchema<T>) => z.ZodOptional<z.ZodType<T, z.ZodTypeDef, T>>;
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
export type HealthCheck = z.infer<typeof healthCheckSchema>;
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