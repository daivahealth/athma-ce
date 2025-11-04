/**
 * Request context stored in AsyncLocalStorage
 * Provides request-scoped data accessible throughout the request lifecycle
 */
export interface RequestContext {
    requestId: string;
    tenantId?: string;
    userId?: string;
    facilityId?: string;
    ip?: string;
    userAgent?: string;
    path?: string;
    method?: string;
    startTime?: number;
}
/**
 * Request context utilities
 */
export declare const RequestContextService: {
    /**
     * Initialize a new request context
     */
    run<T>(context: Partial<RequestContext>, callback: () => T): T;
    /**
     * Get the current request context
     */
    get(): RequestContext | undefined;
    /**
     * Get a specific field from the context
     */
    getField<K extends keyof RequestContext>(key: K): RequestContext[K] | undefined;
    /**
     * Update the current context
     */
    update(updates: Partial<RequestContext>): void;
    /**
     * Get request ID (useful for correlation)
     */
    getRequestId(): string | undefined;
    /**
     * Get tenant ID from context
     */
    getTenantId(): string | undefined;
    /**
     * Get user ID from context
     */
    getUserId(): string | undefined;
    /**
     * Get facility ID from context
     */
    getFacilityId(): string | undefined;
};
//# sourceMappingURL=request-context.d.ts.map