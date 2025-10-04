"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidationSchema = exports.updateValidationSchema = exports.createValidationSchema = exports.contactSchema = exports.addressSchema = exports.nameSchema = exports.sortQuerySchema = exports.searchQuerySchema = exports.tenantIdParamSchema = exports.idParamSchema = exports.serviceConfigSchema = exports.monitoringConfigSchema = exports.authConfigSchema = exports.messagingConfigSchema = exports.redisConfigSchema = exports.databaseConfigSchema = exports.domainEventSchema = exports.logEntrySchema = exports.metricDataSchema = exports.healthCheckSchema = exports.rateLimitSchema = exports.retryOptionsSchema = exports.cacheOptionsSchema = exports.bulkOperationResultSchema = exports.bulkOperationErrorSchema = exports.validationResultSchema = exports.validationErrorSchema = exports.apiResponseSchema = exports.apiErrorSchema = exports.queryOptionsSchema = exports.filterOptionsSchema = exports.entityStatusSchema = exports.textSearchSchema = exports.dateRangeSchema = exports.paginatedResultSchema = exports.paginationSchema = exports.emiratesIdSchema = exports.dateSchema = exports.phoneSchema = exports.emailSchema = exports.uuidSchema = void 0;
const zod_1 = require("zod");
/**
 * Common validation schemas using Zod
 */
// Base schemas
exports.uuidSchema = zod_1.z.string().uuid();
exports.emailSchema = zod_1.z.string().email();
exports.phoneSchema = zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/);
exports.dateSchema = zod_1.z.string().datetime().or(zod_1.z.date());
// Emirates ID validation
exports.emiratesIdSchema = zod_1.z.string().regex(/^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$/, 'Invalid Emirates ID format');
// Pagination schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
exports.paginatedResultSchema = zod_1.z.object({
    data: zod_1.z.array(zod_1.z.any()),
    pagination: zod_1.z.object({
        page: zod_1.z.number(),
        limit: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPages: zod_1.z.number(),
        hasNext: zod_1.z.boolean(),
        hasPrev: zod_1.z.boolean(),
    }),
});
// Date range schema
exports.dateRangeSchema = zod_1.z.object({
    from: exports.dateSchema.optional(),
    to: exports.dateSchema.optional(),
});
// Text search schema
exports.textSearchSchema = zod_1.z.object({
    search: zod_1.z.string().min(1).max(255).optional(),
    fields: zod_1.z.array(zod_1.z.string()).optional(),
});
// Status schema
exports.entityStatusSchema = zod_1.z.enum(['active', 'inactive', 'suspended', 'deleted']);
// Filter options schema
exports.filterOptionsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: exports.entityStatusSchema.or(zod_1.z.array(exports.entityStatusSchema)).optional(),
    dateRange: exports.dateRangeSchema.optional(),
}).passthrough(); // Allow additional fields
// Query options schema
exports.queryOptionsSchema = exports.paginationSchema.extend({
    filters: exports.filterOptionsSchema.optional(),
    include: zod_1.z.array(zod_1.z.string()).optional(),
    select: zod_1.z.array(zod_1.z.string()).optional(),
});
// API response schemas
exports.apiErrorSchema = zod_1.z.object({
    code: zod_1.z.string(),
    message: zod_1.z.string(),
    details: zod_1.z.record(zod_1.z.any()).optional(),
    timestamp: exports.dateSchema,
});
exports.apiResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.any().optional(),
    error: exports.apiErrorSchema.optional(),
    meta: zod_1.z.record(zod_1.z.any()).optional(),
});
// Validation error schema
exports.validationErrorSchema = zod_1.z.object({
    field: zod_1.z.string(),
    message: zod_1.z.string(),
    code: zod_1.z.string(),
    value: zod_1.z.any().optional(),
});
exports.validationResultSchema = zod_1.z.object({
    isValid: zod_1.z.boolean(),
    errors: zod_1.z.array(exports.validationErrorSchema),
});
// Bulk operation schemas
exports.bulkOperationErrorSchema = zod_1.z.object({
    index: zod_1.z.number(),
    error: exports.apiErrorSchema,
});
exports.bulkOperationResultSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.array(zod_1.z.any()).optional(),
    errors: zod_1.z.array(exports.bulkOperationErrorSchema).optional(),
    summary: zod_1.z.object({
        total: zod_1.z.number(),
        success: zod_1.z.number(),
        failed: zod_1.z.number(),
    }),
});
// Cache options schema
exports.cacheOptionsSchema = zod_1.z.object({
    ttl: zod_1.z.number().int().positive().optional(),
    key: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
// Retry options schema
exports.retryOptionsSchema = zod_1.z.object({
    maxRetries: zod_1.z.number().int().min(0).max(10).default(3),
    retryDelay: zod_1.z.number().int().positive().default(1000),
    backoffMultiplier: zod_1.z.number().positive().default(2),
});
// Rate limit schema
exports.rateLimitSchema = zod_1.z.object({
    windowMs: zod_1.z.number().int().positive(),
    maxRequests: zod_1.z.number().int().positive(),
});
exports.healthCheckSchema = zod_1.z.lazy(() => zod_1.z.object({
    service: zod_1.z.string(),
    status: zod_1.z.enum(['healthy', 'degraded', 'unhealthy']),
    timestamp: exports.dateSchema,
    details: zod_1.z.record(zod_1.z.unknown()).optional(),
    dependencies: zod_1.z.array(exports.healthCheckSchema).optional(),
}));
// Metric data schema
exports.metricDataSchema = zod_1.z.object({
    name: zod_1.z.string(),
    value: zod_1.z.number(),
    timestamp: exports.dateSchema,
    tags: zod_1.z.record(zod_1.z.string()).optional(),
    unit: zod_1.z.string().optional(),
});
// Log entry schema
exports.logEntrySchema = zod_1.z.object({
    level: zod_1.z.enum(['debug', 'info', 'warn', 'error']),
    message: zod_1.z.string(),
    timestamp: exports.dateSchema,
    service: zod_1.z.string(),
    context: zod_1.z.record(zod_1.z.any()).optional(),
    traceId: zod_1.z.string().optional(),
    spanId: zod_1.z.string().optional(),
});
// Domain event schema
exports.domainEventSchema = zod_1.z.object({
    id: exports.uuidSchema,
    type: zod_1.z.string(),
    aggregateId: zod_1.z.string(),
    aggregateType: zod_1.z.string(),
    version: zod_1.z.number().int().positive(),
    data: zod_1.z.any(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    timestamp: exports.dateSchema,
});
// Configuration schemas
exports.databaseConfigSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    directUrl: zod_1.z.string().url().optional(),
    poolSize: zod_1.z.number().int().positive().optional(),
    timeout: zod_1.z.number().int().positive().optional(),
    ssl: zod_1.z.boolean().optional(),
});
exports.redisConfigSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    password: zod_1.z.string().optional(),
    db: zod_1.z.number().int().min(0).max(15).optional(),
    keyPrefix: zod_1.z.string().optional(),
});
exports.messagingConfigSchema = zod_1.z.object({
    type: zod_1.z.enum(['kafka', 'rabbitmq']),
    brokers: zod_1.z.array(zod_1.z.string()),
    groupId: zod_1.z.string().optional(),
    topics: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.authConfigSchema = zod_1.z.object({
    jwtSecret: zod_1.z.string().min(32),
    jwtExpiry: zod_1.z.string(),
    refreshTokenExpiry: zod_1.z.string(),
    mfaRequired: zod_1.z.boolean(),
});
exports.monitoringConfigSchema = zod_1.z.object({
    metrics: zod_1.z.boolean(),
    tracing: zod_1.z.boolean(),
    logging: zod_1.z.boolean(),
    healthCheck: zod_1.z.boolean(),
});
exports.serviceConfigSchema = zod_1.z.object({
    name: zod_1.z.string(),
    version: zod_1.z.string(),
    port: zod_1.z.number().int().positive(),
    environment: zod_1.z.enum(['development', 'staging', 'production']),
    database: exports.databaseConfigSchema,
    redis: exports.redisConfigSchema.optional(),
    messaging: exports.messagingConfigSchema.optional(),
    auth: exports.authConfigSchema.optional(),
    monitoring: exports.monitoringConfigSchema.optional(),
});
// Utility schemas
exports.idParamSchema = zod_1.z.object({
    id: exports.uuidSchema,
});
exports.tenantIdParamSchema = zod_1.z.object({
    tenantId: exports.uuidSchema,
});
exports.searchQuerySchema = zod_1.z.object({
    q: zod_1.z.string().min(1).max(255),
});
exports.sortQuerySchema = zod_1.z.object({
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
// Common field schemas
exports.nameSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    middleName: zod_1.z.string().max(100).optional(),
});
exports.addressSchema = zod_1.z.object({
    addressLine1: zod_1.z.string().min(1).max(255),
    addressLine2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().min(1).max(100),
    stateProvince: zod_1.z.string().min(1).max(100),
    postalCode: zod_1.z.string().max(20),
    country: zod_1.z.string().min(2).max(2).default('AE'),
});
exports.contactSchema = zod_1.z.object({
    phoneNumber: exports.phoneSchema.optional(),
    email: exports.emailSchema.optional(),
});
// Validation helpers
const createValidationSchema = (schema) => schema;
exports.createValidationSchema = createValidationSchema;
const updateValidationSchema = (schema) => 'partial' in schema
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema.partial()
    : schema;
exports.updateValidationSchema = updateValidationSchema;
const queryValidationSchema = (schema) => schema.optional();
exports.queryValidationSchema = queryValidationSchema;
//# sourceMappingURL=common.js.map