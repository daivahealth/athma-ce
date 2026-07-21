/**
 * Narrative Cache Service
 * Redis-backed caching for AI Care Narratives, keyed so that a patient with an
 * unchanged encounter count reuses the last generated narrative instead of
 * spending LLM tokens on every page load/refetch.
 *
 * Invalidation is implicit: once the patient has a new encounter, the encounter
 * count changes and the key naturally misses, producing a fresh narrative. The
 * "Refresh" button bypasses the cache explicitly (forceRefresh) to let a
 * clinician regenerate on demand even without new encounters.
 */

import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import { logger } from '../../../common/logger/logger.config';
import type { NarrativeResult } from './patient-narrative.service';

const CACHE_PREFIX = 'care-narrative';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Injectable()
export class NarrativeCacheService {
  constructor(private readonly redis: RedisService) {}

  private buildKey(tenantId: string, patientId: string, specialty: string, encounterCount: number): string {
    return `${CACHE_PREFIX}:${tenantId}:${patientId}:${specialty}:${encounterCount}`;
  }

  async get(
    tenantId: string,
    patientId: string,
    specialty: string,
    encounterCount: number,
  ): Promise<NarrativeResult | null> {
    const key = this.buildKey(tenantId, patientId, specialty, encounterCount);
    const cached = await this.redis.get<NarrativeResult>(key);
    if (cached) {
      logger.debug({ key }, 'Care narrative cache hit');
    }
    return cached;
  }

  async set(
    tenantId: string,
    patientId: string,
    specialty: string,
    encounterCount: number,
    result: NarrativeResult,
  ): Promise<void> {
    const key = this.buildKey(tenantId, patientId, specialty, encounterCount);
    await this.redis.set(key, result, CACHE_TTL_SECONDS);
    logger.debug({ key }, 'Care narrative cache set');
  }
}
