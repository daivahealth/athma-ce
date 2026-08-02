/**
 * Short-lived store binding a provider transaction to the request that started
 * it.
 *
 * The provider returns an opaque `txnId`; we need to remember which tenant,
 * provider and purpose it belongs to when the OTP comes back, without trusting
 * the client to tell us. Entries are intentionally in-memory and short-lived —
 * this is transient auth state, not a record. Nothing sensitive (Aadhaar, OTP,
 * provider token) is ever stored here.
 *
 * NOTE: in-memory means transactions do not survive a restart and are not
 * shared across replicas. An OTP round-trip is seconds long and the user can
 * simply request a new OTP, so this is an acceptable trade for M1; move to
 * Redis if the clinical service is ever load-balanced without sticky sessions.
 */

import { Injectable, Logger } from '@nestjs/common';
import type { IdentityChallengePurpose } from '../providers/national-identity-provider.interface';

const TTL_MS = 10 * 60 * 1000;

export interface StoredChallenge {
  tenantId: string;
  country: string;
  identityType: string;
  purpose: IdentityChallengePurpose;
  loginHint: string;
  /** Optional patient to auto-link on success. */
  patientId?: string;
  createdAt: number;
}

@Injectable()
export class IdentityChallengeStore {
  private readonly logger = new Logger(IdentityChallengeStore.name);
  private readonly entries = new Map<string, StoredChallenge>();

  put(txnId: string, challenge: Omit<StoredChallenge, 'createdAt'>): void {
    this.sweep();
    this.entries.set(txnId, { ...challenge, createdAt: Date.now() });
  }

  /** Returns the challenge if it exists, is unexpired and belongs to `tenantId`. */
  get(txnId: string, tenantId: string): StoredChallenge | undefined {
    const entry = this.entries.get(txnId);
    if (!entry) return undefined;

    if (Date.now() - entry.createdAt > TTL_MS) {
      this.entries.delete(txnId);
      return undefined;
    }

    // Prevents a transaction started by one tenant being completed by another.
    if (entry.tenantId !== tenantId) {
      this.logger.warn(`Rejected cross-tenant use of identity transaction ${txnId}`);
      return undefined;
    }

    return entry;
  }

  delete(txnId: string): void {
    this.entries.delete(txnId);
  }

  private sweep(): void {
    const cutoff = Date.now() - TTL_MS;
    for (const [id, entry] of this.entries) {
      if (entry.createdAt < cutoff) this.entries.delete(id);
    }
  }
}
