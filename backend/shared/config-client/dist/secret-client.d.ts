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
export interface SecretClientOptions {
    foundationBaseUrl: string;
    /** Audited consumer name, e.g. 'clinical' or 'abdm-connector'. */
    serviceName: string;
    /** Defaults to process.env.INTERNAL_API_KEY. */
    internalApiKey?: string;
    /** In-memory cache TTL. Default 60s; 0 disables caching. */
    cacheTtlMs?: number;
}
export interface SecretRef {
    tenantId: string;
    /** Facility scope; Foundation falls back to the tenant-scoped secret when unset or not found. */
    facilityId?: string;
    /** Owning integration identity, e.g. 'abdm'. */
    ownerId: string;
    key: string;
}
export declare class SecretNotConfiguredError extends Error {
    constructor(ref: SecretRef);
}
export declare class SecretClient {
    private readonly options;
    private readonly cache;
    private readonly cacheTtlMs;
    constructor(options: SecretClientOptions);
    /** Returns the decrypted value; throws SecretNotConfiguredError when absent. */
    get(ref: SecretRef): Promise<string>;
    /** Like get(), but resolves to undefined when the secret is not configured. */
    getOptional(ref: SecretRef): Promise<string | undefined>;
    /** Drops cached values (e.g. after a known rotation). */
    clearCache(): void;
}
