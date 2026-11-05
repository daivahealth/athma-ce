import type {
  DashboardForecastSeries,
  DashboardTrends,
} from '@/modules/reporting/hooks/use-dashboard-metrics';

/**
 * Weeks and months over the dashboard's daily history (ported from prrapp's
 * dashboard-period). Weeks run Monday to Sunday. Dates are ISO `YYYY-MM-DD`
 * strings handled in UTC so a period never shifts with the browser's zone.
 *
 * A period in progress is counted through yesterday — today is still filling
 * up — and compared like-for-like with the same number of days of the period
 * before it.
 */

export type DashboardView = 'today' | 'week' | 'month';
export type TrendView = Exclude<DashboardView, 'today'>;

export interface DashboardPeriod {
  view: TrendView;
  /** First day, inclusive. */
  from: string;
  /** Last day, inclusive. */
  to: string;
}

export type TrendKey = Exclude<keyof DashboardTrends, 'days'>;

const DAY_MS = 86_400_000;

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);

export function addDays(iso: string, days: number): string {
  return toIso(new Date(toDate(iso).getTime() + days * DAY_MS));
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / DAY_MS);
}

export function parseDashboardView(raw: string | null | undefined): DashboardView {
  return raw === 'week' || raw === 'month' ? raw : 'today';
}

export function periodContaining(view: TrendView, iso: string): DashboardPeriod {
  const date = toDate(iso);
  if (view === 'week') {
    const offset = (date.getUTCDay() + 6) % 7; // Monday = 0
    const from = addDays(iso, -offset);
    return { view, from, to: addDays(from, 6) };
  }
  const from = `${iso.slice(0, 7)}-01`;
  const to = toIso(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)));
  return { view, from, to };
}

export function shiftPeriod(period: DashboardPeriod, by: number): DashboardPeriod {
  if (period.view === 'week') return periodContaining('week', addDays(period.from, 7 * by));
  const date = toDate(period.from);
  return periodContaining('month', toIso(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + by, 1))));
}

/** `2026-11-02` (the Monday) for a week, `2026-11` for a month. */
export function formatPeriodParam(period: DashboardPeriod): string {
  return period.view === 'week' ? period.from : period.from.slice(0, 7);
}

/** Reads `?period=`, falling back to the period containing today; never a future period. */
export function parsePeriodParam(view: TrendView, raw: string | null | undefined, today: string): DashboardPeriod {
  const latest = periodContaining(view, today);
  const pattern = view === 'week' ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}$/;
  if (!raw || !pattern.test(raw)) return latest;
  const iso = view === 'week' ? raw : `${raw}-01`;
  if (Number.isNaN(toDate(iso).getTime())) return latest;
  const period = periodContaining(view, iso);
  return period.from > latest.from ? latest : period;
}

const MONTH = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const DAY_MONTH = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const WEEKDAY_SHORT = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });

/** "2 – 8 Nov 2026" or "November 2026". */
export function formatPeriod(period: DashboardPeriod): string {
  if (period.view === 'month') return MONTH.format(toDate(period.from));
  return `${DAY_MONTH.format(toDate(period.from))} – ${DAY_MONTH_YEAR.format(toDate(period.to))}`;
}

/** Short label for a period on a history axis: "2 Nov" or "Nov". */
export function formatPeriodShort(period: DashboardPeriod): string {
  return period.view === 'week'
    ? DAY_MONTH.format(toDate(period.from))
    : new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(toDate(period.from));
}

export const formatWeekday = (iso: string) => WEEKDAY.format(toDate(iso));
export const formatWeekdayShort = (iso: string) => WEEKDAY_SHORT.format(toDate(iso));
export const formatDayMonth = (iso: string) => DAY_MONTH.format(toDate(iso));

export function isInProgress(period: DashboardPeriod, today: string): boolean {
  return period.from <= today && today <= period.to;
}

/**
 * The last day a period's figures are counted to: its end, or yesterday for
 * the period in progress. Null when the period has no full day yet (it
 * starts today).
 */
export function countedThrough(period: DashboardPeriod, today: string): string | null {
  if (!isInProgress(period, today)) return period.to;
  const yesterday = addDays(today, -1);
  return yesterday >= period.from ? yesterday : null;
}

/** Sum of a series over `[from, to]`, or null when the history does not reach it. */
export function sumRange(trends: DashboardTrends, key: TrendKey, from: string, to: string): number | null {
  const values = trends[key];
  if (!values || trends.days.length === 0 || to < trends.days[0] || from > trends.days[trends.days.length - 1]) {
    return null;
  }
  const start = Math.max(0, daysBetween(trends.days[0], from));
  const end = Math.min(trends.days.length - 1, daysBetween(trends.days[0], to));
  let total = 0;
  for (let i = start; i <= end; i += 1) total += values[i] ?? 0;
  return total;
}

/** Whether the history covers the whole of `[from, to]`. */
export function covers(trends: DashboardTrends, from: string): boolean {
  return trends.days.length > 0 && from >= trends.days[0];
}

export interface Delta {
  /** Percent change; null without a base to compare with. */
  pct: number | null;
  /** For a rate, the change in percentage points. */
  points?: number;
}

export type Aggregate =
  | { kind: 'sum'; key: TrendKey }
  /** numerator / denominator, as a percentage. */
  | { kind: 'rate'; numerator: TrendKey; denominator: TrendKey };

export function aggregate(trends: DashboardTrends, how: Aggregate, from: string, to: string): number | null {
  if (how.kind === 'sum') return sumRange(trends, how.key, from, to);
  const top = sumRange(trends, how.numerator, from, to);
  const bottom = sumRange(trends, how.denominator, from, to);
  if (top === null || bottom === null || bottom === 0) return null;
  return (top / bottom) * 100;
}

export interface Headline {
  value: number | null;
  /** The like-for-like comparison with the period before. */
  previous: number | null;
  delta: Delta | null;
  /** Totals of this and the 7 periods before it, oldest first (this one so far). */
  history: (number | null)[];
  /** Counted to this day; null when the period has no full day yet. */
  through: string | null;
}

export function headline(
  trends: DashboardTrends,
  how: Aggregate,
  period: DashboardPeriod,
  today: string,
  historyLength = 8,
): Headline {
  const through = countedThrough(period, today);
  const value = through ? aggregate(trends, how, period.from, through) : null;

  const before = shiftPeriod(period, -1);
  const elapsed = through ? daysBetween(period.from, through) : -1;
  const beforeTo = elapsed < 0 ? null : addDays(before.from, Math.min(elapsed, daysBetween(before.from, before.to)));
  const previous = beforeTo && covers(trends, before.from) ? aggregate(trends, how, before.from, beforeTo) : null;

  let delta: Delta | null = null;
  if (value !== null && previous !== null) {
    delta =
      how.kind === 'rate'
        ? { pct: previous > 0 ? ((value - previous) / previous) * 100 : null, points: value - previous }
        : { pct: previous > 0 ? ((value - previous) / previous) * 100 : null };
  }

  const history: (number | null)[] = [];
  for (let i = historyLength - 1; i >= 0; i -= 1) {
    const p = shiftPeriod(period, -i);
    const to = countedThrough(p, today);
    history.push(to && covers(trends, p.from) ? aggregate(trends, how, p.from, to) : null);
  }

  return { value, previous, delta, history, through };
}

/**
 * Where a period in progress lands: counted so far plus the forecast for the
 * days still to come (the forecast starts today). Null for a finished period
 * or without a forecast.
 */
export function projectPeriod(
  trends: DashboardTrends,
  key: TrendKey,
  forecast: DashboardForecastSeries | null | undefined,
  period: DashboardPeriod,
  today: string,
): { value: number; low: number; high: number } | null {
  if (!forecast || !isInProgress(period, today)) return null;
  const through = countedThrough(period, today);
  const actual = through ? (sumRange(trends, key, period.from, through) ?? 0) : 0;
  const points = forecast.points.filter((point) => point.date >= today && point.date <= period.to);
  if (points.length === 0) return null;
  const value = points.reduce((total, point) => total + point.value, 0);
  const spread = Math.sqrt(points.reduce((total, point) => total + (point.high - point.value) ** 2, 0));
  return { value: actual + value, low: actual + Math.max(0, value - spread), high: actual + value + spread };
}

/** Each day of a period with this period's value and the same position in the period before. */
export function dayByDay(
  trends: DashboardTrends,
  key: TrendKey,
  period: DashboardPeriod,
  today: string,
): { date: string; label: string; current: number | null; previous: number | null }[] {
  const before = shiftPeriod(period, -1);
  const length = daysBetween(period.from, period.to) + 1;
  const rows = [];
  for (let i = 0; i < length; i += 1) {
    const date = addDays(period.from, i);
    const previousDate = addDays(before.from, i);
    rows.push({
      date,
      label: period.view === 'week' ? formatWeekdayShort(date) : String(i + 1),
      current: date < today ? sumRange(trends, key, date, date) : null,
      previous: previousDate <= before.to && covers(trends, previousDate) ? sumRange(trends, key, previousDate, previousDate) : null,
    });
  }
  return rows;
}

/** Totals for this period and the `count - 1` before it, oldest first. */
export function periodTotals(
  trends: DashboardTrends,
  key: TrendKey,
  period: DashboardPeriod,
  today: string,
  count: number,
): { period: DashboardPeriod; label: string; value: number | null; partial: boolean }[] {
  const rows = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const p = shiftPeriod(period, -i);
    const to = countedThrough(p, today);
    rows.push({
      period: p,
      label: formatPeriodShort(p),
      value: to && covers(trends, p.from) ? sumRange(trends, key, p.from, to) : null,
      partial: isInProgress(p, today),
    });
  }
  return rows;
}
