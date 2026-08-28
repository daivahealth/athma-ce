import { Injectable, Logger } from '@nestjs/common';
import type { Request } from 'express';

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
 *   'bearer' (default) — require a structurally valid JWT bearer token
 *   'none'             — accept unauthenticated callbacks (local dev only)
 *
 * Whatever the mode, a failed verification quarantines the callback; it is
 * never processed.
 */
@Injectable()
export class AbdmCallbackVerifier {
  private readonly logger = new Logger(AbdmCallbackVerifier.name);

  verify(req: Request): VerificationResult {
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
    // Structural JWT check only until JWKS verification is wired (M2, #82).
    if (token.split('.').length !== 3) {
      return { ok: false, reason: 'Malformed bearer token' };
    }
    return { ok: true };
  }
}
