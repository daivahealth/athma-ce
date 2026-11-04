/**
 * Dashboard Cache Types
 * Type definitions for cached dashboard metrics
 */

/**
 * Dashboard metrics structure cached in Redis
 * Contains all predefined metrics for the HealthAI+ dashboard
 */
export interface DashboardMetrics {
  // Revenue metrics
  revenueMTD: number;
  revenueLastMonth: number;
  revenueGrowth: number;

  // Patient metrics
  totalPatients: number;
  newPatientsThisMonth: number;
  patientGrowth: number;

  // Appointment metrics
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;

  // Encounter metrics
  encountersToday: number;
  encountersThisWeek: number;
  avgEncounterDuration: number;

  // Invoice metrics
  unpaidInvoices: number;
  unpaidAmount: number;
  overdueInvoices: number;
  overdueAmount: number;

  // Facility metrics
  activeFacilities: number;

  // Calculated metrics
  appointmentCompletionRate: number;
  utilizationRate: number;

  // Worklists, history and projections (absent in caches written before they existed)
  worklists?: DashboardWorklists;
  trends?: DashboardTrends;
  forecast?: DashboardForecast;
  arAging?: DashboardArAging;

  // Metadata
  cachedAt: string;
  currency: string;
}

/** What is waiting on someone right now: each figure is the read its own page makes. */
export interface DashboardWorklists {
  encountersInProgress: number;
  ordersOpen: number;
  labOrdersOpen: number;
  imagingOrdersOpen: number;
  urgentOrdersOpen: number;
  labReportsAwaitingSignOff: number;
  inpatientsCurrent: number;
  dischargesDue: number;
  appointmentsNext7Days: number;
}

/** Daily history, oldest first, ending today (today is a partial day). */
export interface DashboardTrends {
  days: string[];
  encounters: number[];
  newPatients: number[];
  revenue: number[];
}

export interface DashboardForecastPoint {
  date: string;
  value: number;
  /** ≈80% band. */
  low: number;
  high: number;
}

export interface DashboardForecastSeries {
  method: 'seasonal-holt';
  /** Starts today; fitted on history through yesterday. */
  points: DashboardForecastPoint[];
  /** Smoothed trend, per week, in the series' unit. */
  trendPerWeek: number;
  /** Last four weeks against the four before, in percent; null without a base. */
  changeVsPriorPct: number | null;
  /** Days with activity in the last four weeks that the fit rests on. */
  activeDays: number;
}

export interface DashboardRunRateProjection {
  actualToDate: number;
  projected: number;
  low: number;
  high: number;
  periodEnd: string;
  comparison: number;
  changeVsComparisonPct: number | null;
}

/** A series is null when its last four weeks are too sparse to forecast. */
export interface DashboardForecast {
  generatedFor: string;
  horizonDays: number;
  encounters: DashboardForecastSeries | null;
  newPatients: DashboardForecastSeries | null;
  revenue: DashboardForecastSeries | null;
  revenueMonthEnd: DashboardRunRateProjection | null;
  newPatientsMonthEnd: DashboardRunRateProjection | null;
}

export interface DashboardArAgingBucket {
  key: 'current' | 'd31_60' | 'd61_90' | 'd90_plus';
  label: string;
  count: number;
  amount: number;
}

/** Open receivables by days past due. */
export interface DashboardArAging {
  buckets: DashboardArAgingBucket[];
  /** Share of open balance paid on invoices raised in the last 90 days, in percent. */
  collectionRate90d: number | null;
}

/**
 * Cache key generation helper
 */
export function getDashboardCacheKey(tenantId: string, currency: string): string {
  return `dashboard:metrics:${tenantId}:${currency}`;
}

/**
 * Default cache configuration
 */
export const DASHBOARD_CACHE_CONFIG = {
  /** Default TTL in seconds (30 minutes) */
  DEFAULT_TTL_SECONDS: 30 * 60,

  /** Minimum TTL in seconds (1 minute) */
  MIN_TTL_SECONDS: 60,

  /** Maximum TTL in seconds (24 hours) */
  MAX_TTL_SECONDS: 24 * 60 * 60,

  /** Default currency if not specified */
  DEFAULT_CURRENCY: 'INR',

  /** Configuration key for TTL in Foundation config */
  CONFIG_KEY_TTL_MINUTES: 'dashboard.cache_ttl_minutes',
} as const;

/**
 * Metric definition for direct SQL execution
 */
export interface MetricDefinition {
  /** Unique metric name */
  name: keyof Omit<DashboardMetrics, 'cachedAt' | 'currency'>;

  /** Target database */
  database: 'clinical' | 'rcm' | 'foundation' | 'analytics';

  /** SQL query template with $1 as tenantId parameter */
  sql: string;

  /** Default value if query fails or returns null */
  defaultValue: number;

  /** Whether this metric requires currency formatting */
  isCurrency?: boolean;
}

/**
 * Result from cache operation
 */
export interface CacheResult<T> {
  /** Whether the data was retrieved from cache */
  fromCache: boolean;

  /** The data */
  data: T;

  /** TTL remaining in seconds (if from cache) */
  ttlSeconds?: number;
}

/**
 * DTO for dashboard metrics response
 */
export interface DashboardMetricsResponseDto {
  metrics: DashboardMetrics;
  fromCache: boolean;
  ttlSeconds?: number;
}

/**
 * DTO for dashboard refresh response
 */
export interface DashboardRefreshResponseDto {
  success: boolean;
  message: string;
  refreshedAt: string;
}
