import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

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
 * AsyncLocalStorage instance for request context
 * Provides context isolation per request without explicit parameter passing
 */
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Request context utilities
 */
export const RequestContextService = {
  /**
   * Initialize a new request context
   */
  run<T>(context: Partial<RequestContext>, callback: () => T): T {
    const fullContext: RequestContext = {
      requestId: context.requestId || randomUUID(),
      startTime: context.startTime || Date.now(),
      ...(context.tenantId && { tenantId: context.tenantId }),
      ...(context.userId && { userId: context.userId }),
      ...(context.facilityId && { facilityId: context.facilityId }),
      ...(context.ip && { ip: context.ip }),
      ...(context.userAgent && { userAgent: context.userAgent }),
      ...(context.path && { path: context.path }),
      ...(context.method && { method: context.method }),
    };

    return asyncLocalStorage.run(fullContext, callback);
  },

  /**
   * Get the current request context
   */
  get(): RequestContext | undefined {
    return asyncLocalStorage.getStore();
  },

  /**
   * Get a specific field from the context
   */
  getField<K extends keyof RequestContext>(
    key: K,
  ): RequestContext[K] | undefined {
    const context = this.get();
    return context?.[key];
  },

  /**
   * Update the current context
   */
  update(updates: Partial<RequestContext>): void {
    const context = this.get();
    if (context) {
      Object.assign(context, updates);
    }
  },

  /**
   * Get request ID (useful for correlation)
   */
  getRequestId(): string | undefined {
    return this.getField('requestId');
  },

  /**
   * Get tenant ID from context
   */
  getTenantId(): string | undefined {
    return this.getField('tenantId');
  },

  /**
   * Get user ID from context
   */
  getUserId(): string | undefined {
    return this.getField('userId');
  },

  /**
   * Get facility ID from context
   */
  getFacilityId(): string | undefined {
    return this.getField('facilityId');
  },
};
