"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextService = void 0;
const async_hooks_1 = require("async_hooks");
const crypto_1 = require("crypto");
/**
 * AsyncLocalStorage instance for request context
 * Provides context isolation per request without explicit parameter passing
 */
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
/**
 * Request context utilities
 */
exports.RequestContextService = {
    /**
     * Initialize a new request context
     */
    run(context, callback) {
        const fullContext = {
            requestId: context.requestId || (0, crypto_1.randomUUID)(),
            startTime: context.startTime || Date.now(),
        };
        if (context.tenantId)
            fullContext.tenantId = context.tenantId;
        if (context.userId)
            fullContext.userId = context.userId;
        if (context.facilityId)
            fullContext.facilityId = context.facilityId;
        if (context.ip)
            fullContext.ip = context.ip;
        if (context.userAgent)
            fullContext.userAgent = context.userAgent;
        if (context.path)
            fullContext.path = context.path;
        if (context.method)
            fullContext.method = context.method;
        return asyncLocalStorage.run(fullContext, callback);
    },
    /**
     * Get the current request context
     */
    get() {
        return asyncLocalStorage.getStore();
    },
    /**
     * Get a specific field from the context
     */
    getField(key) {
        const context = this.get();
        return context?.[key];
    },
    /**
     * Update the current context
     */
    update(updates) {
        const context = this.get();
        if (context) {
            Object.assign(context, updates);
        }
    },
    /**
     * Get request ID (useful for correlation)
     */
    getRequestId() {
        return this.getField('requestId');
    },
    /**
     * Get tenant ID from context
     */
    getTenantId() {
        return this.getField('tenantId');
    },
    /**
     * Get user ID from context
     */
    getUserId() {
        return this.getField('userId');
    },
    /**
     * Get facility ID from context
     */
    getFacilityId() {
        return this.getField('facilityId');
    },
};
//# sourceMappingURL=request-context.js.map