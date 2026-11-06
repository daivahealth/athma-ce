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
  DashboardArAging,
  DashboardArAgingBucket,
  DashboardForecast,
  DashboardTrends,
  DashboardWorklists,
} from '../types/dashboard-cache.types';
import { addDays, densify, forecastDaily, lastDayOfMonth, projectMonthEnd } from './dashboard-forecast';

/** Days of daily history: 12 full months plus the current one, for the Week and Month views. */
const HISTORY_DAYS = 400;
/** Full days the forecast is fitted on. */
const FIT_DAYS = 90;
/** Minimum days projected forward; extended to reach the end of the month. */
const FORECAST_HORIZON_DAYS = 14;

const AR_BUCKETS: Pick<DashboardArAgingBucket, 'key' | 'label'>[] = [
  { key: 'current', label: '0–30 days' },
  { key: 'd31_60', label: '31–60 days' },
  { key: 'd61_90', label: '61–90 days' },
  { key: 'd90_plus', label: '90+ days' },
];

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

    // Worklists, history and projections. Each part fails on its own: a
    // missing table on one tenant must not blank the whole dashboard.
    const [worklists, history, arAging] = await Promise.all([
      this.fetchWorklists(tenantId).catch((error) => {
        logger.error({ error, tenantId }, 'Failed to fetch dashboard worklists');
        return undefined;
      }),
      this.fetchHistory(tenantId).catch((error) => {
        logger.error({ error, tenantId }, 'Failed to fetch dashboard history');
        return undefined;
      }),
      this.fetchArAging(tenantId).catch((error) => {
        logger.error({ error, tenantId }, 'Failed to fetch AR aging');
        return undefined;
      }),
    ]);
    metrics.worklists = worklists;
    metrics.arAging = arAging;
    if (history) {
      metrics.trends = history.trends;
      metrics.forecast = this.buildForecast(history, revenueMTD, revenueLastMonth, newPatients);
    }

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
   * Counts that are waiting on someone: each mirrors the list its page shows.
   */
  private async fetchWorklists(tenantId: string): Promise<DashboardWorklists> {
    const [clinical] = await this.clinicalPrisma.$queryRawUnsafe<Record<string, bigint | number>[]>(
      `
      SELECT
        (SELECT COUNT(*) FROM encounters
          WHERE tenant_id = $1::uuid AND status IN ('in-progress', 'arrived', 'triaged')
            AND encounter_class IS DISTINCT FROM 'IMP') AS "encountersInProgress",
        (SELECT COUNT(*) FROM clinical_orders
          WHERE tenant_id = $1::uuid AND status IN ('ordered', 'in_progress')) AS "ordersOpen",
        (SELECT COUNT(*) FROM clinical_orders
          WHERE tenant_id = $1::uuid AND status IN ('ordered', 'in_progress') AND order_type = 'lab') AS "labOrdersOpen",
        (SELECT COUNT(*) FROM clinical_orders
          WHERE tenant_id = $1::uuid AND status IN ('ordered', 'in_progress') AND order_type = 'imaging') AS "imagingOrdersOpen",
        (SELECT COUNT(*) FROM clinical_orders
          WHERE tenant_id = $1::uuid AND status IN ('ordered', 'in_progress')
            AND LOWER(priority) IN ('stat', 'urgent', 'asap', 'emergency')) AS "urgentOrdersOpen",
        (SELECT COUNT(*) FROM lab_reports
          WHERE tenant_id = $1::uuid AND report_status IN ('DRAFT', 'PRELIMINARY')) AS "labReportsAwaitingSignOff",
        (SELECT COUNT(*) FROM inpatient_admissions
          WHERE tenant_id = $1::uuid
            AND admission_status::text IN ('ADMITTED', 'ACTIVE', 'ON_LEAVE', 'DISCHARGE_PLANNING')) AS "inpatientsCurrent",
        (SELECT COUNT(*) FROM inpatient_admissions
          WHERE tenant_id = $1::uuid
            AND admission_status::text IN ('ADMITTED', 'ACTIVE', 'ON_LEAVE', 'DISCHARGE_PLANNING')
            AND (admission_status::text = 'DISCHARGE_PLANNING' OR expected_discharge_date <= CURRENT_DATE)) AS "dischargesDue",
        (SELECT COUNT(*) FROM appointments
          WHERE tenant_id = $1::uuid AND start_time >= NOW() AND start_time < CURRENT_DATE + INTERVAL '8 days'
            AND status NOT IN ('cancelled', 'no_show')) AS "appointmentsNext7Days"
      `,
      tenantId,
    );
    const toNumber = (value: bigint | number | undefined) => Number(value ?? 0);
    return {
      encountersInProgress: toNumber(clinical?.encountersInProgress),
      ordersOpen: toNumber(clinical?.ordersOpen),
      labOrdersOpen: toNumber(clinical?.labOrdersOpen),
      imagingOrdersOpen: toNumber(clinical?.imagingOrdersOpen),
      urgentOrdersOpen: toNumber(clinical?.urgentOrdersOpen),
      labReportsAwaitingSignOff: toNumber(clinical?.labReportsAwaitingSignOff),
      inpatientsCurrent: toNumber(clinical?.inpatientsCurrent),
      dischargesDue: toNumber(clinical?.dischargesDue),
      appointmentsNext7Days: toNumber(clinical?.appointmentsNext7Days),
    };
  }

  /**
   * Daily history for the Week and Month views and the forecast, ending today.
   * Each series is one GROUP BY day over its own table, scoped to the tenant
   * and the window; days with nothing are filled with 0.
   */
  private async fetchHistory(tenantId: string): Promise<{ today: string; trends: DashboardTrends }> {
    const days = HISTORY_DAYS;
    type Row = { day: Date | string; value: number | bigint | string };
    const [todayRow] = await this.clinicalPrisma.$queryRawUnsafe<{ today: string }[]>(
      `SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS today`,
    );
    const today = todayRow.today;

    // `$2` is the window length; `{at}` the timestamp the row is counted on.
    const windowed = (at: string) =>
      `${at} >= CURRENT_DATE - ($2::int - 1) AND ${at} < CURRENT_DATE + 1`;
    const series: { key: Exclude<keyof DashboardTrends, 'days'>; db: 'clinical' | 'rcm'; sql: string }[] = [
      {
        key: 'encounters',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(COALESCE(start_time, created_at)), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM encounters WHERE tenant_id = $1::uuid AND ${windowed('COALESCE(start_time, created_at)')}
              GROUP BY 1`,
      },
      {
        key: 'newPatients',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM patients WHERE tenant_id = $1::uuid AND ${windowed('created_at')}
              GROUP BY 1`,
      },
      {
        key: 'appointments',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(start_time), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM appointments WHERE tenant_id = $1::uuid AND status <> 'cancelled' AND ${windowed('start_time')}
              GROUP BY 1`,
      },
      {
        key: 'noShows',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(start_time), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM appointments WHERE tenant_id = $1::uuid AND status = 'no_show' AND ${windowed('start_time')}
              GROUP BY 1`,
      },
      {
        key: 'admissions',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(admission_date), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM inpatient_admissions
              WHERE tenant_id = $1::uuid AND admission_status::text <> 'CANCELLED' AND ${windowed('admission_date')}
              GROUP BY 1`,
      },
      {
        key: 'discharges',
        db: 'clinical',
        sql: `SELECT TO_CHAR(DATE(actual_discharge_date), 'YYYY-MM-DD') AS day, COUNT(*) AS value
              FROM inpatient_admissions WHERE tenant_id = $1::uuid AND ${windowed('actual_discharge_date')}
              GROUP BY 1`,
      },
      {
        key: 'revenue',
        db: 'rcm',
        sql: `SELECT TO_CHAR(invoice_date, 'YYYY-MM-DD') AS day, COALESCE(SUM(net_amount), 0) AS value
              FROM invoices
              WHERE tenant_id = $1::uuid AND status != 'cancelled'
                AND invoice_date >= CURRENT_DATE - ($2::int - 1) AND invoice_date <= CURRENT_DATE
              GROUP BY 1`,
      },
    ];

    const results = await Promise.all(
      series.map(({ db, sql }) =>
        (db === 'rcm' ? this.rcmPrisma : this.clinicalPrisma).$queryRawUnsafe<Row[]>(sql, tenantId, days),
      ),
    );

    const trends = { days: densify([], today, days).days } as DashboardTrends;
    series.forEach(({ key }, i) => {
      const rows = results[i].map((row) => ({ day: String(row.day), value: Number(row.value) }));
      trends[key] = densify(rows, today, days).values;
    });
    return { today, trends };
  }

  /**
   * Fits each series on history through yesterday (today is still filling
   * up) and projects from today to at least the end of the month.
   */
  private buildForecast(
    history: { today: string; trends: DashboardTrends },
    revenueMTD: number,
    revenueLastMonth: number,
    newPatientsMTD: number,
  ): DashboardForecast {
    const { today, trends } = history;
    // Fit on the last FIT_DAYS full days: recent enough to follow the current
    // rhythm, long enough for the weekly pattern.
    const fit = <T,>(values: T[]): T[] => values.slice(-FIT_DAYS - 1, -1);
    const fitDays = fit(trends.days);
    const daysToMonthEnd =
      (Date.parse(`${lastDayOfMonth(today)}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000;
    const horizon = Math.max(FORECAST_HORIZON_DAYS, daysToMonthEnd + 1);

    const encounters = forecastDaily(fitDays, fit(trends.encounters), horizon);
    const newPatients = forecastDaily(fitDays, fit(trends.newPatients), horizon);
    const revenue = forecastDaily(fitDays, fit(trends.revenue), horizon, 2);

    // Last month's new patients, from the history, for the comparison.
    const lastMonthStart = `${addDays(`${today.slice(0, 7)}-01`, -1).slice(0, 7)}-01`;
    const newPatientsLastMonth = trends.days.reduce(
      (sum, day, i) => (day >= lastMonthStart && day < `${today.slice(0, 7)}-01` ? sum + trends.newPatients[i] : sum),
      0,
    );

    return {
      generatedFor: today,
      horizonDays: horizon,
      encounters,
      newPatients,
      revenue,
      revenueMonthEnd: projectMonthEnd(today, revenueMTD, revenue, revenueLastMonth),
      newPatientsMonthEnd: projectMonthEnd(today, newPatientsMTD, newPatients, newPatientsLastMonth),
    };
  }

  /**
   * Open receivables by days past due, and how much of the last 90 days'
   * billing has been collected.
   */
  private async fetchArAging(tenantId: string): Promise<DashboardArAging> {
    type Row = { bucket: string; count: bigint | number; amount: string | number };
    const [buckets, collection] = await Promise.all([
      this.rcmPrisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          CASE
            WHEN due_date IS NULL OR due_date >= CURRENT_DATE - 30 THEN 'current'
            WHEN due_date >= CURRENT_DATE - 60 THEN 'd31_60'
            WHEN due_date >= CURRENT_DATE - 90 THEN 'd61_90'
            ELSE 'd90_plus'
          END AS bucket,
          COUNT(*) AS count,
          COALESCE(SUM(balance_due), 0) AS amount
        FROM invoices
        WHERE tenant_id = $1::uuid
          AND status IN ('unpaid', 'partial')
          AND balance_due > 0
        GROUP BY 1
        `,
        tenantId,
      ),
      this.rcmPrisma.$queryRawUnsafe<{ billed: string | number; paid: string | number }[]>(
        `
        SELECT COALESCE(SUM(net_amount), 0) AS billed, COALESCE(SUM(amount_paid), 0) AS paid
        FROM invoices
        WHERE tenant_id = $1::uuid
          AND status != 'cancelled'
          AND invoice_date >= CURRENT_DATE - 90
        `,
        tenantId,
      ),
    ]);

    const byKey = new Map(buckets.map((row) => [row.bucket, row]));
    const billed = Number(collection[0]?.billed ?? 0);
    const paid = Number(collection[0]?.paid ?? 0);
    return {
      buckets: AR_BUCKETS.map(({ key, label }) => ({
        key,
        label,
        count: Number(byKey.get(key)?.count ?? 0),
        amount: Number(byKey.get(key)?.amount ?? 0),
      })),
      collectionRate90d: billed > 0 ? Math.round((paid / billed) * 1000) / 10 : null,
    };
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
      // COUNT comes back as bigint and SUM(numeric) as a Prisma Decimal; both
      // must be plain numbers, or arithmetic on them concatenates strings.
      const value = Number(result[0].value);
      return Number.isFinite(value) ? value : definition.defaultValue;
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
