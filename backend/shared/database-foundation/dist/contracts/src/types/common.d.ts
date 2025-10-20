/**
 * Common types used across all Zeal services
 */
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TenantEntity extends BaseEntity {
    tenantId: string;
}
export interface SoftDeleteEntity extends BaseEntity {
    status: 'active' | 'inactive' | 'deleted';
    deletedAt?: Date;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface DateRange {
    from?: Date;
    to?: Date;
}
export interface TextSearch {
    search?: string;
    fields?: string[];
}
export interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
    meta?: Record<string, any>;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: Date;
}
export interface AuditInfo {
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'deleted';
export type SortOrder = 'asc' | 'desc';
export interface FilterOptions {
    search?: string;
    status?: EntityStatus | EntityStatus[];
    dateRange?: DateRange;
    [key: string]: any;
}
export interface QueryOptions extends PaginationParams {
    filters?: FilterOptions;
    include?: string[];
    select?: string[];
}
export interface BulkOperationResult<T = any> {
    success: boolean;
    data?: T[];
    errors?: Array<{
        index: number;
        error: ApiError;
    }>;
    summary: {
        total: number;
        success: number;
        failed: number;
    };
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: any;
}
export interface CacheOptions {
    ttl?: number;
    key?: string;
    tags?: string[];
}
export interface RetryOptions {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
}
export interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (req: any) => string;
}
export interface HealthCheck {
    service: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    details?: Record<string, any>;
    dependencies?: HealthCheck[];
}
export interface MetricData {
    name: string;
    value: number;
    timestamp: Date;
    tags?: Record<string, string>;
    unit?: string;
}
export interface LogEntry {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    timestamp: Date;
    service: string;
    context?: Record<string, any>;
    traceId?: string;
    spanId?: string;
}
export interface DomainEvent<T = any> {
    id: string;
    type: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    data: T;
    metadata?: Record<string, any>;
    timestamp: Date;
}
export interface EventHandler<T = any> {
    handle(event: DomainEvent<T>): Promise<void>;
}
export interface EventStore {
    save(events: DomainEvent[]): Promise<void>;
    getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
}
export interface ServiceConfig {
    name: string;
    version: string;
    port: number;
    environment: 'development' | 'staging' | 'production';
    database: DatabaseConfig;
    redis?: RedisConfig;
    messaging?: MessagingConfig;
    auth?: AuthConfig;
    monitoring?: MonitoringConfig;
}
export interface DatabaseConfig {
    url: string;
    directUrl?: string;
    poolSize?: number;
    timeout?: number;
    ssl?: boolean;
}
export interface RedisConfig {
    url: string;
    password?: string;
    db?: number;
    keyPrefix?: string;
}
export interface MessagingConfig {
    type: 'kafka' | 'rabbitmq';
    brokers: string[];
    groupId?: string;
    topics?: string[];
}
export interface AuthConfig {
    jwtSecret: string;
    jwtExpiry: string;
    refreshTokenExpiry: string;
    mfaRequired: boolean;
}
export interface MonitoringConfig {
    metrics: boolean;
    tracing: boolean;
    logging: boolean;
    healthCheck: boolean;
}
//# sourceMappingURL=common.d.ts.map