/**
 * Dashboard Cache Service
 * Caches dashboard metrics in Redis to eliminate repeated database + LLM queries
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { PrismaService as RcmPrismaService } from '@zeal/database-rcm';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { RedisService } from '../../../shared/redis/redis.service';
import { logger } from '../../../common/logger/logger.config';
import {
  DashboardMetrics,
  getDashboardCacheKey,
  DASHBOARD_CACHE_CONFIG,
  CacheResult,
  MetricDefinition,
} from '../types/dashboard-cache.types';

/**
 * Predefined metric queries for dashboard
 * Each metric has a specific SQL query that bypasses the LLM planner
 */
const METRIC_DEFINITIONS: MetricDefinition[] = [
  // Revenue metrics
  {
    name: 'revenueMTD',
    database: 'rcm',
    sql: `
      SELECT COALESCE(SUM(net_amount), 0) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND invoice_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND status != 'cancelled'
    `,
    defaultValue: 0,
    isCurrency: true,
  },
  {
    name: 'revenueLastMonth',
    database: 'rcm',
    sql: `
      SELECT COALESCE(SUM(net_amount), 0) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND invoice_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        AND invoice_date < DATE_TRUNC('month', CURRENT_DATE)
        AND status != 'cancelled'
    `,
    defaultValue: 0,
    isCurrency: true,
  },
  // Patient metrics
  {
    name: 'totalPatients',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM patients
      WHERE tenant_id = $1::uuid
    `,
    defaultValue: 0,
  },
  {
    name: 'newPatientsThisMonth',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM patients
      WHERE tenant_id = $1::uuid
        AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `,
    defaultValue: 0,
  },
  // Appointment metrics
  {
    name: 'appointmentsToday',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM appointments
      WHERE tenant_id = $1::uuid
        AND DATE(start_time) = CURRENT_DATE
    `,
    defaultValue: 0,
  },
  {
    name: 'appointmentsThisWeek',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM appointments
      WHERE tenant_id = $1::uuid
        AND start_time >= DATE_TRUNC('week', CURRENT_DATE)
        AND start_time < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
    `,
    defaultValue: 0,
  },
  {
    name: 'completedAppointments',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM appointments
      WHERE tenant_id = $1::uuid
        AND DATE(start_time) = CURRENT_DATE
        AND status = 'completed'
    `,
    defaultValue: 0,
  },
  {
    name: 'cancelledAppointments',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM appointments
      WHERE tenant_id = $1::uuid
        AND DATE(start_time) = CURRENT_DATE
        AND status = 'cancelled'
    `,
    defaultValue: 0,
  },
  {
    name: 'noShowAppointments',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM appointments
      WHERE tenant_id = $1::uuid
        AND DATE(start_time) = CURRENT_DATE
        AND status = 'no_show'
    `,
    defaultValue: 0,
  },
  // Encounter metrics
  {
    name: 'encountersToday',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM encounters
      WHERE tenant_id = $1::uuid
        AND DATE(created_at) = CURRENT_DATE
    `,
    defaultValue: 0,
  },
  {
    name: 'encountersThisWeek',
    database: 'clinical',
    sql: `
      SELECT COUNT(*) as value
      FROM encounters
      WHERE tenant_id = $1::uuid
        AND created_at >= DATE_TRUNC('week', CURRENT_DATE)
        AND created_at < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
    `,
    defaultValue: 0,
  },
  // Invoice metrics
  {
    name: 'unpaidInvoices',
    database: 'rcm',
    sql: `
      SELECT COUNT(*) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND status IN ('unpaid', 'partial')
    `,
    defaultValue: 0,
  },
  {
    name: 'unpaidAmount',
    database: 'rcm',
    sql: `
      SELECT COALESCE(SUM(balance_due), 0) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND status IN ('unpaid', 'partial')
    `,
    defaultValue: 0,
    isCurrency: true,
  },
  {
    name: 'overdueInvoices',
    database: 'rcm',
    sql: `
      SELECT COUNT(*) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND status IN ('unpaid', 'partial')
        AND due_date < CURRENT_DATE - INTERVAL '30 days'
    `,
    defaultValue: 0,
  },
  {
    name: 'overdueAmount',
    database: 'rcm',
    sql: `
      SELECT COALESCE(SUM(balance_due), 0) as value
      FROM invoices
      WHERE tenant_id = $1::uuid
        AND status IN ('unpaid', 'partial')
        AND due_date < CURRENT_DATE - INTERVAL '30 days'
    `,
    defaultValue: 0,
    isCurrency: true,
  },
  // Facility metrics
  {
    name: 'activeFacilities',
    database: 'foundation',
    sql: `
      SELECT COUNT(*) as value
      FROM facilities
      WHERE tenant_id = $1::uuid
        AND status = 'active'
    `,
    defaultValue: 0,
  },
];

@Injectable()
export class DashboardCacheService {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
    private clinicalPrisma: ClinicalPrismaService,
    private rcmPrisma: RcmPrismaService,
    private foundationPrisma: FoundationPrismaService,
  ) {}

  /**
   * Get dashboard metrics for a tenant
   * Returns cached data if available, otherwise fetches from database
   */
  async getMetrics(
    tenantId: string,
    currency: string = DASHBOARD_CACHE_CONFIG.DEFAULT_CURRENCY,
  ): Promise<CacheResult<DashboardMetrics>> {
    const cacheKey = getDashboardCacheKey(tenantId, currency);

    // Try to get from cache first
    if (this.redisService.isAvailable()) {
      const cached = await this.redisService.get<DashboardMetrics>(cacheKey);
      if (cached) {
        const ttlSeconds = await this.redisService.ttl(cacheKey);
        logger.debug(
          { tenantId, currency, ttlSeconds },
          'Dashboard metrics served from cache',
        );
        return {
          fromCache: true,
          data: cached,
          ttlSeconds: ttlSeconds > 0 ? ttlSeconds : undefined,
        };
      }
    }

    // Cache miss - fetch from database and cache
    logger.info({ tenantId, currency }, 'Dashboard metrics cache miss - fetching from database');
    const metrics = await this.fetchMetricsFromDatabase(tenantId, currency);

    // Cache the results
    await this.cacheMetrics(tenantId, currency, metrics);

    return {
      fromCache: false,
      data: metrics,
    };
  }

  /**
   * Warm cache for a tenant - called by scheduled job
   */
  async warmCacheForTenant(
    tenantId: string,
    currency: string = DASHBOARD_CACHE_CONFIG.DEFAULT_CURRENCY,
  ): Promise<void> {
    const startTime = Date.now();
    logger.info({ tenantId, currency }, 'Warming dashboard cache');

    const metrics = await this.fetchMetricsFromDatabase(tenantId, currency);
    await this.cacheMetrics(tenantId, currency, metrics);

    const duration = Date.now() - startTime;
    logger.info({ tenantId, currency, durationMs: duration }, 'Dashboard cache warmed');
  }

  /**
   * Manually refresh cache for a tenant
   */
  async refreshCache(
    tenantId: string,
    currency: string = DASHBOARD_CACHE_CONFIG.DEFAULT_CURRENCY,
  ): Promise<DashboardMetrics> {
    // Delete existing cache
    const cacheKey = getDashboardCacheKey(tenantId, currency);
    await this.redisService.del(cacheKey);

    // Fetch fresh data
    const metrics = await this.fetchMetricsFromDatabase(tenantId, currency);

    // Cache the results
    await this.cacheMetrics(tenantId, currency, metrics);

    logger.info({ tenantId, currency }, 'Dashboard cache manually refreshed');
    return metrics;
  }

  /**
   * Invalidate cache for a tenant
   */
  async invalidateCache(tenantId: string): Promise<void> {
    const pattern = `dashboard:metrics:${tenantId}:*`;
    const deleted = await this.redisService.delPattern(pattern);
    logger.info({ tenantId, deletedKeys: deleted }, 'Dashboard cache invalidated');
  }

  /**
   * Get cache TTL in seconds
   */
  async getCacheTTLSeconds(): Promise<number> {
    // Check for environment variable override
    const envTTL = this.configService.get<number>('DASHBOARD_CACHE_TTL_MINUTES');
    if (envTTL && envTTL > 0) {
      const ttlSeconds = envTTL * 60;
      return Math.max(
        DASHBOARD_CACHE_CONFIG.MIN_TTL_SECONDS,
        Math.min(ttlSeconds, DASHBOARD_CACHE_CONFIG.MAX_TTL_SECONDS),
      );
    }

    // Default TTL
    return DASHBOARD_CACHE_CONFIG.DEFAULT_TTL_SECONDS;
  }

  /**
   * Fetch all metrics from database
   */
  private async fetchMetricsFromDatabase(
    tenantId: string,
    currency: string,
  ): Promise<DashboardMetrics> {
    const startTime = Date.now();
    const metrics: Partial<DashboardMetrics> = {};
    const errors: string[] = [];

    // Execute all metric queries in parallel
    const results = await Promise.allSettled(
      METRIC_DEFINITIONS.map(async (def) => {
        try {
          const value = await this.executeMetricQuery(def, tenantId);
          return { name: def.name, value };
        } catch (error) {
          logger.error(
            { error, metric: def.name, tenantId },
            'Failed to fetch metric',
          );
          errors.push(def.name);
          return { name: def.name, value: def.defaultValue };
        }
      }),
    );

    // Process results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        (metrics as any)[result.value.name] = result.value.value;
      }
    }

    // Calculate derived metrics
    const totalPatients = (metrics.totalPatients as number) || 0;
    const newPatients = (metrics.newPatientsThisMonth as number) || 0;
    const revenueMTD = (metrics.revenueMTD as number) || 0;
    const revenueLastMonth = (metrics.revenueLastMonth as number) || 0;
    const appointmentsToday = (metrics.appointmentsToday as number) || 0;
    const completedAppointments = (metrics.completedAppointments as number) || 0;
    const encountersToday = (metrics.encountersToday as number) || 0;

    metrics.revenueGrowth =
      revenueLastMonth > 0
        ? ((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

    metrics.patientGrowth =
      totalPatients > 0 ? (newPatients / totalPatients) * 100 : 0;

    metrics.appointmentCompletionRate =
      appointmentsToday > 0
        ? (completedAppointments / appointmentsToday) * 100
        : 0;

    // Estimate utilization (encounters per day / expected capacity)
    // Assuming 20 encounters per day as baseline capacity
    metrics.utilizationRate = Math.min(100, (encountersToday / 20) * 100);

    // Placeholder for average encounter duration (requires more complex query)
    metrics.avgEncounterDuration = 0;

    // Add metadata
    metrics.cachedAt = new Date().toISOString();
    metrics.currency = currency;

    const duration = Date.now() - startTime;
    logger.info(
      {
        tenantId,
        currency,
        durationMs: duration,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      'Fetched dashboard metrics from database',
    );

    return metrics as DashboardMetrics;
  }

  /**
   * Execute a single metric query
   */
  private async executeMetricQuery(
    definition: MetricDefinition,
    tenantId: string,
  ): Promise<number> {
    const prisma = this.getPrismaClient(definition.database);

    const result = await prisma.$queryRawUnsafe<{ value: number | bigint | string }[]>(
      definition.sql,
      tenantId,
    );

    if (result && result.length > 0 && result[0].value !== null) {
      const value = result[0].value;
      if (typeof value === 'bigint') {
        return Number(value);
      }
      if (typeof value === 'string') {
        return parseFloat(value);
      }
      return value;
    }

    return definition.defaultValue;
  }

  /**
   * Get the appropriate Prisma client
   */
  private getPrismaClient(database: string) {
    switch (database) {
      case 'clinical':
        return this.clinicalPrisma;
      case 'rcm':
        return this.rcmPrisma;
      case 'foundation':
        return this.foundationPrisma;
      default:
        throw new Error(`Unknown database: ${database}`);
    }
  }

  /**
   * Cache metrics in Redis
   */
  private async cacheMetrics(
    tenantId: string,
    currency: string,
    metrics: DashboardMetrics,
  ): Promise<void> {
    if (!this.redisService.isAvailable()) {
      logger.warn('Redis not available - metrics not cached');
      return;
    }

    const cacheKey = getDashboardCacheKey(tenantId, currency);
    const ttlSeconds = await this.getCacheTTLSeconds();

    const success = await this.redisService.set(cacheKey, metrics, ttlSeconds);
    if (success) {
      logger.debug({ tenantId, currency, ttlSeconds }, 'Metrics cached in Redis');
    } else {
      logger.warn({ tenantId, currency }, 'Failed to cache metrics in Redis');
    }
  }
}
