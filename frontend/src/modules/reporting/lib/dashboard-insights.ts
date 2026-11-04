import type {
  DashboardForecastSeries,
  DashboardMetrics,
} from '@/modules/reporting/hooks/use-dashboard-metrics';

/**
 * The dashboard's insights: plain sentences read off the cached metrics and
 * the ai-gateway forecast, ranked so what needs someone comes first. Every
 * sentence is traceable to a figure on the page; nothing here guesses.
 */

export type InsightSeverity = 'critical' | 'watch' | 'positive' | 'info';

export interface DashboardInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  detail: string;
  href?: string;
}

const RANK: Record<InsightSeverity, number> = { critical: 0, watch: 1, positive: 2, info: 3 };

const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });

/** Last `n` days of a history, excluding today (a partial day). */
export function lastFullDays(values: number[] | undefined, n: number): number[] {
  if (!values || values.length < 2) return [];
  return values.slice(Math.max(0, values.length - 1 - n), values.length - 1);
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** Projected total over the next `days` days from today, with the band. */
export function nextDays(series: DashboardForecastSeries, days: number) {
  const points = series.points.slice(0, days);
  const value = sum(points.map((point) => point.value));
  // Daily errors are roughly independent: spreads add in quadrature (as in ai-gateway's sumForecast).
  const spread = Math.sqrt(sum(points.map((point) => (point.high - point.value) ** 2)));
  return {
    value,
    low: Math.max(0, value - spread),
    high: value + spread,
    busiest: points.reduce<(typeof points)[number] | undefined>(
      (best, point) => (!best || point.value > best.value ? point : best),
      undefined,
    ),
  };
}

export function percentChange(next: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((next - previous) / previous) * 100;
}

function signed(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
}

export function buildDashboardInsights(
  metrics: DashboardMetrics,
  formatMoney: (value: number) => string,
): DashboardInsight[] {
  const insights: DashboardInsight[] = [];
  const { forecast, trends, arAging, worklists } = metrics;

  // Revenue: where the month lands against last month.
  const revenue = forecast?.revenueMonthEnd;
  if (revenue && revenue.changeVsComparisonPct !== null) {
    const pct = revenue.changeVsComparisonPct;
    insights.push({
      id: 'revenue-month-end',
      severity: pct <= -10 ? 'watch' : pct >= 5 ? 'positive' : 'info',
      title: `Month on course for ${formatMoney(revenue.projected)} (${signed(pct)} vs last month)`,
      detail: `${formatMoney(revenue.actualToDate)} billed so far; the likely range by month end is ${formatMoney(revenue.low)}–${formatMoney(revenue.high)}.`,
      href: '/invoices',
    });
  }

  // Encounters: the coming week against the week just gone.
  if (forecast?.encounters) {
    const week = nextDays(forecast.encounters, 7);
    const lastWeek = sum(lastFullDays(trends?.encounters, 7));
    const pct = percentChange(week.value, lastWeek);
    const busiest = week.busiest ? WEEKDAY.format(new Date(`${week.busiest.date}T00:00:00Z`)) : null;
    insights.push({
      id: 'encounters-next-week',
      severity: pct !== null && pct >= 15 ? 'watch' : 'info',
      title: `About ${Math.round(week.value)} encounters expected in the next 7 days${pct !== null ? ` (${signed(pct)})` : ''}`,
      detail: `${busiest ? `${busiest} looks busiest at ~${Math.round(week.busiest!.value)}. ` : ''}${
        pct !== null && pct >= 15 ? 'Plan extra clinic and front-desk cover.' : 'Staffing at last week’s level should hold.'
      }`,
      href: '/encounters',
    });
  }

  // Receivables: the old end of the ledger.
  if (arAging) {
    const open = sum(arAging.buckets.map((bucket) => bucket.amount));
    const old = arAging.buckets.find((bucket) => bucket.key === 'd90_plus');
    const oldShare = open > 0 && old ? (old.amount / open) * 100 : 0;
    if (old && old.amount > 0) {
      insights.push({
        id: 'ar-90-plus',
        severity: oldShare >= 25 ? 'critical' : 'watch',
        title: `${oldShare.toFixed(0)}% of receivables are over 90 days old`,
        detail: `${old.count} invoice${old.count === 1 ? '' : 's'} worth ${formatMoney(old.amount)} — recovery odds fall sharply past 90 days. Prioritise these for follow-up.`,
        href: '/invoices',
      });
    }
    if (arAging.collectionRate90d !== null && arAging.collectionRate90d < 70) {
      insights.push({
        id: 'collection-rate',
        severity: arAging.collectionRate90d < 50 ? 'critical' : 'watch',
        title: `Only ${arAging.collectionRate90d.toFixed(0)}% of the last 90 days’ billing is collected`,
        detail: 'Check payer remittances and patient balances before they age further.',
        href: '/revenue-cycle',
      });
    }
  }

  // Worklists that are waiting on someone now.
  if (worklists?.urgentOrdersOpen) {
    insights.push({
      id: 'urgent-orders',
      severity: 'critical',
      title: `${worklists.urgentOrdersOpen} urgent order${worklists.urgentOrdersOpen === 1 ? '' : 's'} still open`,
      detail: 'STAT and urgent orders that have not been completed.',
      href: '/results/lab',
    });
  }
  if (worklists?.dischargesDue) {
    insights.push({
      id: 'discharges-due',
      severity: 'watch',
      title: `${worklists.dischargesDue} discharge${worklists.dischargesDue === 1 ? '' : 's'} due`,
      detail: 'Planned or past their expected date — clearing them frees beds for today’s admissions.',
      href: '/inpatient/discharges',
    });
  }

  // Today's clinics.
  const missed = metrics.noShowAppointments + metrics.cancelledAppointments;
  if (metrics.appointmentsToday >= 5 && missed / metrics.appointmentsToday >= 0.15) {
    insights.push({
      id: 'missed-appointments',
      severity: 'watch',
      title: `${((missed / metrics.appointmentsToday) * 100).toFixed(0)}% of today’s appointments missed or cancelled`,
      detail: `${metrics.noShowAppointments} no-show, ${metrics.cancelledAppointments} cancelled. Consider day-before reminders for tomorrow’s list.`,
      href: '/scheduling/appointments',
    });
  }

  // Patient growth.
  const patients = forecast?.newPatientsMonthEnd;
  if (patients && patients.changeVsComparisonPct !== null) {
    const pct = patients.changeVsComparisonPct;
    insights.push({
      id: 'new-patients',
      severity: pct <= -15 ? 'watch' : pct >= 10 ? 'positive' : 'info',
      title: `~${Math.round(patients.projected)} new patients projected this month (${signed(pct)})`,
      detail: `${Math.round(patients.actualToDate)} registered so far against ${Math.round(patients.comparison)} last month.`,
      href: '/patients',
    });
  }

  if (forecast && !forecast.encounters && !forecast.revenue) {
    insights.push({
      id: 'insufficient-history',
      severity: 'info',
      title: 'Not enough recent activity to forecast yet',
      detail: 'Projections start once encounters or billing appear on at least six of the last 28 days.',
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'all-clear',
      severity: 'positive',
      title: 'Nothing needs attention',
      detail: 'Every worklist is clear and the trends are within their usual range.',
    });
  }

  return insights.sort((a, b) => RANK[a.severity] - RANK[b.severity]);
}
