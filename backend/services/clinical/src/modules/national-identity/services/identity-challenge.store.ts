/**
 * Short-lived store binding a provider transaction to the request that started
 * it.
 *
 * The provider returns an opaque `txnId`; we need to remember which tenant,
 * provider and purpose it belongs to when the OTP comes back, without trusting
 * the client to tell us. Entries are short-lived — this is transient auth
 * state, not a record. Nothing sensitive (Aadhaar, OTP, provider token) is
 * ever stored here.
 *
 * Backed by Redis when REDIS_URL is set, so challenges survive restarts and
 * work across load-balanced replicas. Falls back to an in-memory Map for
 * single-node dev without Redis (transactions then don't survive a restart —
 * the user simply requests a new OTP).
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import type { IdentityChallengePurpose } from '../providers/national-identity-provider.interface';

const TTL_MS = 10 * 60 * 1000;
const KEY_PREFIX = 'identity:challenge:';

export interface StoredChallenge {
  tenantId: string;
  /** Facility the challenge was started under — credential scope must match on completion. */
  facilityId?: string;
  country: string;
  identityType: string;
  purpose: IdentityChallengePurpose;
  loginHint: string;
  /** Optional patient to auto-link on success. */
  patientId?: string;
  createdAt: number;
}

@Injectable()
export class IdentityChallengeStore implements OnModuleDestroy {
  private readonly logger = new Logger(IdentityChallengeStore.name);
  private readonly entries = new Map<string, StoredChallenge>();
  private readonly redis?: Redis;

  constructor() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 2,
        lazyConnect: false,
      });
      this.redis.on('error', (err) =>
        this.logger.warn(`Redis error in identity challenge store: ${err.message}`),
      );
      this.logger.log('Identity challenge store using Redis');
    } else {
      this.logger.warn(
        'REDIS_URL not set — identity challenge store is in-memory only (not multi-replica safe)',
      );
    }
  }

  async put(txnId: string, challenge: Omit<StoredChallenge, 'createdAt'>): Promise<void> {
    const entry: StoredChallenge = { ...challenge, createdAt: Date.now() };
    if (this.redis) {
      await this.redis.set(KEY_PREFIX + txnId, JSON.stringify(entry), 'PX', TTL_MS);
      return;
    }
    this.sweep();
    this.entries.set(txnId, entry);
  }

  /** Returns the challenge if it exists, is unexpired and belongs to `tenantId`. */
  async get(txnId: string, tenantId: string): Promise<StoredChallenge | undefined> {
    let entry: StoredChallenge | undefined;

    if (this.redis) {
      const raw = await this.redis.get(KEY_PREFIX + txnId);
      if (!raw) return undefined;
      try {
        entry = JSON.parse(raw) as StoredChallenge;
      } catch {
        await this.redis.del(KEY_PREFIX + txnId);
        return undefined;
      }
    } else {
      entry = this.entries.get(txnId);
      if (!entry) return undefined;
      if (Date.now() - entry.createdAt > TTL_MS) {
        this.entries.delete(txnId);
        return undefined;
      }
    }

    // Prevents a transaction started by one tenant being completed by another.
    if (entry.tenantId !== tenantId) {
      this.logger.warn(`Rejected cross-tenant use of identity transaction ${txnId}`);
      return undefined;
    }

    return entry;
  }

  async delete(txnId: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(KEY_PREFIX + txnId);
      return;
    }
    this.entries.delete(txnId);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit().catch(() => this.redis?.disconnect());
    }
  }

  private sweep(): void {
    const cutoff = Date.now() - TTL_MS;
    for (const [id, entry] of this.entries) {
      if (entry.createdAt < cutoff) this.entries.delete(id);
    }
  }
}
