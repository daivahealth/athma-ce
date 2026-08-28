/**
 * ABDM gateway session tokens.
 *
 * `POST {gatewayUrl}/api/hiecm/gateway/v3/sessions` exchanges the client
 * credentials for a short-lived bearer token used on every subsequent ABHA
 * call. Tokens are cached per gateway+client and refreshed slightly early;
 * concurrent callers share one in-flight request so a burst of traffic cannot
 * stampede the gateway.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { AbdmProviderError } from './abdm-error';

/** Refresh this long before actual expiry to avoid racing the boundary. */
const EXPIRY_SKEW_MS = 60_000;
/** Fallback lifetime when the gateway omits an explicit expiry. */
const DEFAULT_TTL_MS = 15 * 60 * 1000;

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

@Injectable()
export class AbdmSessionService {
  private readonly logger = new Logger(AbdmSessionService.name);
  private readonly cache = new Map<string, CachedToken>();
  private readonly inFlight = new Map<string, Promise<string>>();

  async getAccessToken(gatewayUrl: string, clientId: string, clientSecret: string): Promise<string> {
    const key = `${gatewayUrl}::${clientId}`;

    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.accessToken;
    }

    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const promise = this.fetchToken(gatewayUrl, clientId, clientSecret)
      .then((token) => {
        this.cache.set(key, token);
        return token.accessToken;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  private async fetchToken(
    gatewayUrl: string,
    clientId: string,
    clientSecret: string,
  ): Promise<CachedToken> {
    try {
      const response = await axios.post(
        `${gatewayUrl}/api/hiecm/gateway/v3/sessions`,
        { clientId, clientSecret, grantType: 'client_credentials' },
        {
          headers: {
            'Content-Type': 'application/json',
            'REQUEST-ID': crypto.randomUUID(),
            TIMESTAMP: new Date().toISOString(),
          },
          timeout: 20_000,
        },
      );

      const accessToken: unknown = response.data?.accessToken;
      if (typeof accessToken !== 'string' || !accessToken) {
        throw new Error('gateway response did not contain an accessToken');
      }

      // `expiresIn` is seconds where present.
      const expiresInSec = Number(response.data?.expiresIn);
      const ttlMs = Number.isFinite(expiresInSec) && expiresInSec > 0
        ? expiresInSec * 1000
        : DEFAULT_TTL_MS;

      this.logger.log(`Obtained ABDM session token (ttl ${Math.round(ttlMs / 1000)}s)`);

      return { accessToken, expiresAt: Date.now() + Math.max(ttlMs - EXPIRY_SKEW_MS, 5_000) };
    } catch (error) {
      // Never echo the client secret into logs or the error message.
      const detail = axios.isAxiosError(error)
        ? `${error.response?.status ?? 'network'} ${error.response?.statusText ?? error.message}`
        : error instanceof Error
          ? error.message
          : 'unknown error';

      throw new AbdmProviderError(
        'ABDM_SESSION_FAILED',
        `Unable to obtain an ABDM session token (${detail})`,
        true,
      );
    }
  }

  /** Test/ops affordance — forces the next call to re-authenticate. */
  clearCache(): void {
    this.cache.clear();
  }
}
