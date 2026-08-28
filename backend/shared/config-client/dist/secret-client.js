"use strict";
/**
 * Client for the Foundation tenant-secret store (issue #81, ADR-0015 §5).
 *
 * Fetches decrypted secret values over the internal service-to-service
 * surface (X-Internal-Api-Key). Foundation audits every read with the
 * consumer's service name. Values are cached in memory only, briefly —
 * secrets are never written to Redis or disk.
 *
 * Fail-closed by design: any error surfaces to the caller; there is no
 * fallback to an empty value. Callers that support an env-var fallback for
 * single-tenant/dev deployments must implement it explicitly (and say so).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretClient = exports.SecretNotConfiguredError = void 0;
class SecretNotConfiguredError extends Error {
    constructor(ref) {
        super(`Secret '${ref.ownerId}/${ref.key}' is not configured for tenant ${ref.tenantId}`);
        this.name = 'SecretNotConfiguredError';
    }
}
exports.SecretNotConfiguredError = SecretNotConfiguredError;
class SecretClient {
    constructor(options) {
        this.options = options;
        this.cache = new Map();
        this.cacheTtlMs = options.cacheTtlMs ?? 60000;
    }
    /** Returns the decrypted value; throws SecretNotConfiguredError when absent. */
    async get(ref) {
        const cacheKey = `${ref.tenantId}:${ref.facilityId ?? ''}:${ref.ownerId}:${ref.key}`;
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now())
            return cached.value;
        const apiKey = this.options.internalApiKey ?? process.env.INTERNAL_API_KEY;
        if (!apiKey) {
            throw new Error('INTERNAL_API_KEY is not configured — cannot fetch secrets');
        }
        const params = new URLSearchParams({
            tenantId: ref.tenantId,
            ownerId: ref.ownerId,
            key: ref.key,
            ...(ref.facilityId ? { facilityId: ref.facilityId } : {}),
        });
        const res = await fetch(`${this.options.foundationBaseUrl}/api/v1/secrets/internal/value?${params}`, {
            headers: {
                'x-internal-api-key': apiKey,
                'x-service-name': this.options.serviceName,
            },
        });
        if (res.status === 404)
            throw new SecretNotConfiguredError(ref);
        if (!res.ok) {
            throw new Error(`Secret fetch failed with HTTP ${res.status} for '${ref.ownerId}/${ref.key}'`);
        }
        const body = (await res.json());
        const value = body?.data?.value;
        if (typeof value !== 'string') {
            throw new Error(`Secret fetch returned no value for '${ref.ownerId}/${ref.key}'`);
        }
        if (this.cacheTtlMs > 0) {
            this.cache.set(cacheKey, { value, expiresAt: Date.now() + this.cacheTtlMs });
        }
        return value;
    }
    /** Like get(), but resolves to undefined when the secret is not configured. */
    async getOptional(ref) {
        try {
            return await this.get(ref);
        }
        catch (error) {
            if (error instanceof SecretNotConfiguredError)
                return undefined;
            throw error;
        }
    }
    /** Drops cached values (e.g. after a known rotation). */
    clearCache() {
        this.cache.clear();
    }
}
exports.SecretClient = SecretClient;
