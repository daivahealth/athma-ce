/**
 * Coding Cache Service
 * Redis-backed caching for AI clinical coding suggestions.
 * Normalizes text to maximize cache hit rate.
 */

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { RedisService } from '../../../shared/redis/redis.service';
import { logger } from '../../../common/logger/logger.config';
import type { ClinicalCodingSuggestion } from '../dto/clinical-coding.dto';

const CACHE_PREFIX = 'clinical-coding';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Injectable()
export class CodingCacheService {
  constructor(private redis: RedisService) {}

  /**
   * Build a deterministic cache key from tenant + clinical text.
   */
  private buildKey(tenantId: string, text: string): string {
    const normalized = this.normalize(text);
    const hash = createHash('sha256').update(normalized).digest('hex');
    return `${CACHE_PREFIX}:${tenantId}:${hash}`;
  }

  /**
   * Normalize text to improve cache hit rate across minor variations.
   */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Look up cached suggestions.
   */
  async get(
    tenantId: string,
    clinicalText: string,
  ): Promise<ClinicalCodingSuggestion[] | null> {
    const key = this.buildKey(tenantId, clinicalText);
    const cached = await this.redis.get<ClinicalCodingSuggestion[]>(key);
    if (cached) {
      logger.debug({ key }, 'Clinical coding cache hit');
    }
    return cached;
  }

  /**
   * Store suggestions in cache.
   */
  async set(
    tenantId: string,
    clinicalText: string,
    suggestions: ClinicalCodingSuggestion[],
  ): Promise<void> {
    const key = this.buildKey(tenantId, clinicalText);
    await this.redis.set(key, suggestions, CACHE_TTL_SECONDS);
    logger.debug({ key }, 'Clinical coding cache set');
  }
}
