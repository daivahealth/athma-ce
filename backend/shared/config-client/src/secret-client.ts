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

export class SecretNotConfiguredError extends Error {
  constructor(ref: SecretRef) {
    super(`Secret '${ref.ownerId}/${ref.key}' is not configured for tenant ${ref.tenantId}`);
    this.name = 'SecretNotConfiguredError';
  }
}

interface CacheEntry {
  value: string;
  expiresAt: number;
}

export class SecretClient {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTtlMs: number;

  constructor(private readonly options: SecretClientOptions) {
    this.cacheTtlMs = options.cacheTtlMs ?? 60_000;
  }

  /** Returns the decrypted value; throws SecretNotConfiguredError when absent. */
  async get(ref: SecretRef): Promise<string> {
    const cacheKey = `${ref.tenantId}:${ref.facilityId ?? ''}:${ref.ownerId}:${ref.key}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value;

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
    const res = await fetch(
      `${this.options.foundationBaseUrl}/api/v1/secrets/internal/value?${params}`,
      {
        headers: {
          'x-internal-api-key': apiKey,
          'x-service-name': this.options.serviceName,
        },
      },
    );

    if (res.status === 404) throw new SecretNotConfiguredError(ref);
    if (!res.ok) {
      throw new Error(`Secret fetch failed with HTTP ${res.status} for '${ref.ownerId}/${ref.key}'`);
    }

    const body = (await res.json()) as { data?: { value?: string } };
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
  async getOptional(ref: SecretRef): Promise<string | undefined> {
    try {
      return await this.get(ref);
    } catch (error) {
      if (error instanceof SecretNotConfiguredError) return undefined;
      throw error;
    }
  }

  /** Drops cached values (e.g. after a known rotation). */
  clearCache(): void {
    this.cache.clear();
  }
}
