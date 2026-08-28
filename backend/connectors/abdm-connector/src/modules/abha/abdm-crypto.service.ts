/**
 * ABDM payload encryption.
 *
 * NHA requires Aadhaar numbers, mobile numbers and OTPs to be RSA-encrypted
 * with the certificate published at `/v3/profile/public/certificate`, using
 * `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`.
 *
 * The SHA-1 OAEP hash is the part that trips people up: Node's default for
 * `publicEncrypt` with OAEP padding varies by version, so `oaepHash` is set
 * explicitly rather than relied upon.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { AbdmProviderError } from './abdm-error';

/** Public certificates are stable; re-fetching per request is wasteful. */
const CERT_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedCert {
  publicKey: string;
  fetchedAt: number;
}

@Injectable()
export class AbdmCryptoService {
  private readonly logger = new Logger(AbdmCryptoService.name);
  private readonly cache = new Map<string, CachedCert>();
  private readonly inFlight = new Map<string, Promise<string>>();

  /**
   * Encrypt a sensitive value for ABDM.
   *
   * @param value raw Aadhaar / mobile / OTP — never logged by this method
   */
  async encrypt(baseUrl: string, accessToken: string, value: string): Promise<string> {
    const publicKey = await this.getPublicKey(baseUrl, accessToken);

    try {
      return crypto
        .publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha1',
          },
          Buffer.from(value, 'utf8'),
        )
        .toString('base64');
    } catch (error) {
      // Deliberately does not include `value` in the message.
      throw new AbdmProviderError(
        'ABDM_ENCRYPTION_FAILED',
        `Unable to encrypt payload for ABDM: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  /** Fetches (and caches) the ABDM public certificate, single-flighted. */
  async getPublicKey(baseUrl: string, accessToken: string): Promise<string> {
    const cached = this.cache.get(baseUrl);
    if (cached && Date.now() - cached.fetchedAt < CERT_TTL_MS) {
      return cached.publicKey;
    }

    const existing = this.inFlight.get(baseUrl);
    if (existing) return existing;

    const promise = this.fetchPublicKey(baseUrl, accessToken)
      .then((publicKey) => {
        this.cache.set(baseUrl, { publicKey, fetchedAt: Date.now() });
        return publicKey;
      })
      .finally(() => {
        this.inFlight.delete(baseUrl);
      });

    this.inFlight.set(baseUrl, promise);
    return promise;
  }

  private async fetchPublicKey(baseUrl: string, accessToken: string): Promise<string> {
    try {
      const response = await axios.get(`${baseUrl}/v3/profile/public/certificate`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'REQUEST-ID': crypto.randomUUID(),
          TIMESTAMP: new Date().toISOString(),
        },
        timeout: 15_000,
      });

      const key: unknown = response.data?.publicKey ?? response.data;
      if (typeof key !== 'string' || !key.includes('PUBLIC KEY')) {
        throw new Error('response did not contain a PEM public key');
      }
      return key;
    } catch (error) {
      throw new AbdmProviderError(
        'ABDM_CERT_UNAVAILABLE',
        `Unable to fetch the ABDM public certificate: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        true,
      );
    }
  }

  /** Test/ops affordance — drops cached certificates. */
  clearCache(): void {
    this.cache.clear();
  }
}
