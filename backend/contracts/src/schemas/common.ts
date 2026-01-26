import { z } from 'zod';

/**
 * Common validation schemas using Zod
 */

// Base schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
export const dateSchema = z.string().datetime().or(z.date());

// Emirates ID validation
export const emiratesIdSchema = z.string().regex(
  /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$/,
  'Invalid Emirates ID format'
);

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const paginatedResultSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Date range schema
export const dateRangeSchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});

// Text search schema
export const textSearchSchema = z.object({
  search: z.string().min(1).max(255).optional(),
  fields: z.array(z.string()).optional(),
});

// Status schema
export const entityStatusSchema = z.enum(['active', 'inactive', 'suspended', 'deleted']);

// Filter options schema
export const filterOptionsSchema = z.object({
  search: z.string().optional(),
  status: entityStatusSchema.or(z.array(entityStatusSchema)).optional(),
  dateRange: dateRangeSchema.optional(),
}).passthrough(); // Allow additional fields

// Query options schema
export const queryOptionsSchema = paginationSchema.extend({
  filters: filterOptionsSchema.optional(),
  include: z.array(z.string()).optional(),
  select: z.array(z.string()).optional(),
});

// API response schemas
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
  timestamp: dateSchema,
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: apiErrorSchema.optional(),
  meta: z.record(z.any()).optional(),
});

// Validation error schema
export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
  value: z.any().optional(),
});

export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(validationErrorSchema),
});

// Bulk operation schemas
export const bulkOperationErrorSchema = z.object({
  index: z.number(),
  error: apiErrorSchema,
});

export const bulkOperationResultSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()).optional(),
  errors: z.array(bulkOperationErrorSchema).optional(),
  summary: z.object({
    total: z.number(),
    success: z.number(),
    failed: z.number(),
  }),
});

// Cache options schema
export const cacheOptionsSchema = z.object({
  ttl: z.number().int().positive().optional(),
  key: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Retry options schema
export const retryOptionsSchema = z.object({
  maxRetries: z.number().int().min(0).max(10).default(3),
  retryDelay: z.number().int().positive().default(1000),
  backoffMultiplier: z.number().positive().default(2),
});

// Rate limit schema
export const rateLimitSchema = z.object({
  windowMs: z.number().int().positive(),
  maxRequests: z.number().int().positive(),
});

export type HealthCheck = {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date | string;
  details?: Record<string, unknown> | undefined;
  dependencies?: HealthCheck[] | undefined;
};

export const healthCheckSchema: z.ZodType<HealthCheck> = z.lazy(() =>
  z.object({
    service: z.string(),
    status: z.enum(['healthy', 'degraded', 'unhealthy']),
    timestamp: dateSchema,
    details: z.record(z.unknown()).optional(),
    dependencies: z.array(healthCheckSchema).optional(),
  }),
);

// Metric data schema
export const metricDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  timestamp: dateSchema,
  tags: z.record(z.string()).optional(),
  unit: z.string().optional(),
});

// Log entry schema
export const logEntrySchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  timestamp: dateSchema,
  service: z.string(),
  context: z.record(z.any()).optional(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
});

// Domain event schema
export const domainEventSchema = z.object({
  id: uuidSchema,
  type: z.string(),
  aggregateId: z.string(),
  aggregateType: z.string(),
  version: z.number().int().positive(),
  data: z.any(),
  metadata: z.record(z.any()).optional(),
  timestamp: dateSchema,
});

// Configuration schemas
export const databaseConfigSchema = z.object({
  url: z.string().url(),
  directUrl: z.string().url().optional(),
  poolSize: z.number().int().positive().optional(),
  timeout: z.number().int().positive().optional(),
  ssl: z.boolean().optional(),
});

export const redisConfigSchema = z.object({
  url: z.string().url(),
  password: z.string().optional(),
  db: z.number().int().min(0).max(15).optional(),
  keyPrefix: z.string().optional(),
});

export const messagingConfigSchema = z.object({
  type: z.enum(['kafka', 'rabbitmq']),
  brokers: z.array(z.string()),
  groupId: z.string().optional(),
  topics: z.array(z.string()).optional(),
});

export const authConfigSchema = z.object({
  jwtSecret: z.string().min(32),
  jwtExpiry: z.string(),
  refreshTokenExpiry: z.string(),
  mfaRequired: z.boolean(),
});

export const monitoringConfigSchema = z.object({
  metrics: z.boolean(),
  tracing: z.boolean(),
  logging: z.boolean(),
  healthCheck: z.boolean(),
});

export const serviceConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  port: z.number().int().positive(),
  environment: z.enum(['development', 'staging', 'production']),
  database: databaseConfigSchema,
  redis: redisConfigSchema.optional(),
  messaging: messagingConfigSchema.optional(),
  auth: authConfigSchema.optional(),
  monitoring: monitoringConfigSchema.optional(),
});

// Utility schemas
export const idParamSchema = z.object({
  id: uuidSchema,
});

export const tenantIdParamSchema = z.object({
  tenantId: uuidSchema,
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(255),
});

export const sortQuerySchema = z.object({
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// Common field schemas
export const nameSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
});

export const addressSchema = z.object({
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  stateProvince: z.string().min(1).max(100),
  postalCode: z.string().max(20),
  country: z.string().min(2).max(2).default('AE'),
});

export const contactSchema = z.object({
  phoneNumber: phoneSchema.optional(),
  email: emailSchema.optional(),
});

// Validation helpers
export const createValidationSchema = <T>(schema: z.ZodSchema<T>) => schema;
export const updateValidationSchema = <T>(schema: z.ZodSchema<T>) =>
  'partial' in schema
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (schema as any).partial()
    : schema;
export const queryValidationSchema = <T>(schema: z.ZodSchema<T>) => schema.optional();

// Type exports
export type PaginationParams = z.infer<typeof paginationSchema>;
export type PaginatedResult<T> = z.infer<typeof paginatedResultSchema> & { data: T[] };
export type DateRange = z.infer<typeof dateRangeSchema>;
export type TextSearch = z.infer<typeof textSearchSchema>;
export type EntityStatus = z.infer<typeof entityStatusSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
export type QueryOptions = z.infer<typeof queryOptionsSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & { data?: T };
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
export type BulkOperationResult<T> = z.infer<typeof bulkOperationResultSchema> & { data?: T[] };
export type CacheOptions = z.infer<typeof cacheOptionsSchema>;
export type RetryOptions = z.infer<typeof retryOptionsSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;
export type MetricData = z.infer<typeof metricDataSchema>;
export type LogEntry = z.infer<typeof logEntrySchema>;
export type DomainEvent<T = any> = z.infer<typeof domainEventSchema> & { data: T };
export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export type RedisConfig = z.infer<typeof redisConfigSchema>;
export type MessagingConfig = z.infer<typeof messagingConfigSchema>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export type MonitoringConfig = z.infer<typeof monitoringConfigSchema>;
export type ServiceConfig = z.infer<typeof serviceConfigSchema>;
export type Name = z.infer<typeof nameSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;






