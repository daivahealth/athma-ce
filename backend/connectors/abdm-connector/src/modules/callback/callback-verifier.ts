import { Injectable, Logger } from '@nestjs/common';
import type { Request } from 'express';
import { JwksVerifierService } from './jwks-verifier.service';

export interface VerificationResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verification hook for inbound ABDM gateway callbacks.
 *
 * ABDM signs callbacks with a gateway-issued JWT (Authorization: Bearer ...).
 * Full JWKS signature verification against the gateway's certs endpoint is
 * follow-up work for the M2/HIP phase (#82) — for now this enforces the presence and
 * basic shape of the bearer token, controlled by ABDM_CALLBACK_AUTH:
 *
 *   'jwks'             — full RS256 signature verification against
 *                         ABDM_JWKS_URL (REQUIRED in production)
 *   'bearer' (default) — require a structurally valid JWT bearer token
 *   'none'             — accept unauthenticated callbacks (local dev only)
 *
 * Whatever the mode, a failed verification quarantines the callback; it is
 * never processed.
 */
@Injectable()
export class AbdmCallbackVerifier {
  private readonly logger = new Logger(AbdmCallbackVerifier.name);

  constructor(private readonly jwks: JwksVerifierService) {}

  async verify(req: Request): Promise<VerificationResult> {
    const mode = process.env.ABDM_CALLBACK_AUTH ?? 'bearer';
    if (mode === 'none') {
      this.logger.warn('ABDM_CALLBACK_AUTH=none — callback verification disabled (dev only)');
      return { ok: true };
    }

    const header = req.headers['authorization'];
    if (!header || Array.isArray(header) || !header.startsWith('Bearer ')) {
      return { ok: false, reason: 'Missing bearer token' };
    }
    const token = header.slice('Bearer '.length);
    if (token.split('.').length !== 3) {
      return { ok: false, reason: 'Malformed bearer token' };
    }

    if (mode === 'jwks') {
      const reason = await this.jwks.verify(token);
      return reason ? { ok: false, reason } : { ok: true };
    }

    // 'bearer': structural check only — use 'jwks' in production.
    return { ok: true };
  }
}
