/**
 * Full signature verification of ABDM gateway callback JWTs against the
 * gateway's published JWKS (issue #115, closing the gap flagged in #82).
 *
 * Enabled with ABDM_CALLBACK_AUTH=jwks (+ ABDM_JWKS_URL, e.g.
 * https://dev.abdm.gov.in/api/hiecm/gateway/v3/certs). Keys are cached for an
 * hour and refreshed once on an unknown kid (key rotation). RS256 only —
 * anything else is rejected. No external JWT library: node crypto verifies
 * the RSA signature from the JWK directly.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface Jwk {
  kid?: string;
  kty: string;
  alg?: string;
  n?: string;
  e?: string;
}

const JWKS_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class JwksVerifierService {
  private readonly logger = new Logger(JwksVerifierService.name);
  private keys: Jwk[] = [];
  private fetchedAt = 0;

  /** Returns null when valid; a reason string when not. */
  async verify(token: string): Promise<string | null> {
    const parts = token.split('.');
    if (parts.length !== 3) return 'Malformed token';
    const [headerB64, payloadB64, signatureB64] = parts as [string, string, string];

    let header: { alg?: string; kid?: string };
    let payload: { exp?: number; nbf?: number };
    try {
      header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    } catch {
      return 'Undecodable token';
    }

    if (header.alg !== 'RS256') return `Unsupported alg '${header.alg}'`;

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now - 60) return 'Token expired';
    if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return 'Token not yet valid';

    let key = await this.keyFor(header.kid, false);
    if (!key) key = await this.keyFor(header.kid, true); // rotation: refetch once
    if (!key) return `No JWKS key for kid '${header.kid}'`;

    try {
      const publicKey = crypto.createPublicKey({ key: key as crypto.JsonWebKey, format: 'jwk' });
      const valid = crypto.verify(
        'RSA-SHA256',
        Buffer.from(`${headerB64}.${payloadB64}`),
        publicKey,
        Buffer.from(signatureB64, 'base64url'),
      );
      return valid ? null : 'Signature verification failed';
    } catch (error) {
      return `Signature check errored: ${error instanceof Error ? error.message : error}`;
    }
  }

  private async keyFor(kid: string | undefined, forceRefresh: boolean): Promise<Jwk | undefined> {
    if (forceRefresh || Date.now() - this.fetchedAt > JWKS_TTL_MS || this.keys.length === 0) {
      await this.refresh();
    }
    if (!kid) return this.keys.find((k) => k.kty === 'RSA');
    return this.keys.find((k) => k.kid === kid);
  }

  private async refresh(): Promise<void> {
    const url = process.env.ABDM_JWKS_URL;
    if (!url) {
      this.logger.error('ABDM_CALLBACK_AUTH=jwks but ABDM_JWKS_URL is not set');
      this.keys = [];
      return;
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as { keys?: Jwk[] };
      this.keys = Array.isArray(body?.keys) ? body.keys.filter((k) => k.kty === 'RSA') : [];
      this.fetchedAt = Date.now();
      this.logger.log(`JWKS refreshed: ${this.keys.length} RSA key(s)`);
    } catch (error) {
      this.logger.error(`JWKS fetch failed: ${error}`);
      // Keep stale keys if we had any — better than rejecting everything on a blip.
    }
  }
}
