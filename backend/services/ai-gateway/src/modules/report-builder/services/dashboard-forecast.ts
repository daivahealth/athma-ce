/**
 * Dashboard forecasting
 *
 * Pure, dependency-free projections for the HealthAI+ dashboard. Each series
 * is a daily count or amount, oldest first. The model is a weekly-seasonal
 * Holt (double exponential smoothing) forecast:
 *
 *   1. A day-of-week index is taken from the last eight weeks, so a clinic
 *      that is quiet on Sundays is projected quiet on Sundays.
 *   2. The deseasonalised series is smoothed into a level and a trend, with
 *      the smoothing weights picked from a small grid by one-step-ahead error.
 *   3. The projection is level + damped trend (φ 0.9 per day), reseasonalised
 *      and clamped at 0.
 *   4. The band is ±1.28σ (≈80%) of the one-step-ahead errors over the last
 *      four weeks, widening with the horizon. Totals over several days combine
 *      the daily spreads in quadrature.
 *
 * It is deliberately explainable: every figure on the dashboard can be traced
 * back to these steps, and a series with too little history returns `null`
 * instead of a confident-looking guess.
 */

import type {
  DashboardForecastPoint,
  DashboardForecastSeries,
  DashboardRunRateProjection,
} from '../types/dashboard-cache.types';

/** Level (α) and trend (β) smoothing candidates; the best one-step fit wins. */
const GRID = [0.1, 0.2, 0.3, 0.5].flatMap((alpha) => [0.05, 0.15].map((beta) => ({ alpha, beta })));
/** Trend damping per day ahead. */
const PHI = 0.9;
const Z_80 = 1.28;
const SEASON = 7;

/** Days with any activity needed in the last four weeks before a series is forecast. */
export const MIN_ACTIVE_DAYS = 6;

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dayOfWeek(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

/** Turns sparse `{ day, value }` rows into a dense daily series ending on `endDate`. */
export function densify(
  rows: { day: string; value: number }[],
  endDate: string,
  length: number,
): { days: string[]; values: number[] } {
  const byDay = new Map(rows.map((row) => [row.day, row.value]));
  const days: string[] = [];
  const values: number[] = [];
  for (let offset = length - 1; offset >= 0; offset -= 1) {
    const day = addDays(endDate, -offset);
    days.push(day);
    values.push(byDay.get(day) ?? 0);
  }
  return { days, values };
}

/** Day-of-week multipliers (Sunday = 0), averaging 1, from the last eight weeks. */
export function seasonalIndex(days: string[], values: number[]): number[] {
  const window = Math.min(values.length, SEASON * 8);
  const sums = new Array<number>(SEASON).fill(0);
  const counts = new Array<number>(SEASON).fill(0);
  for (let i = values.length - window; i < values.length; i += 1) {
    const dow = dayOfWeek(days[i]);
    sums[dow] += values[i];
    counts[dow] += 1;
  }
  const means = sums.map((sum, dow) => (counts[dow] > 0 ? sum / counts[dow] : 0));
  const overall = means.reduce((a, b) => a + b, 0) / SEASON;
  if (overall <= 0) return new Array<number>(SEASON).fill(1);
  // A floor keeps a closed day from dividing the level by zero when deseasonalising.
  return means.map((mean) => Math.max(mean / overall, 0.05));
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Forecasts `horizon` days after the last day of `days`.
 * Returns `null` when the last four weeks are too sparse to say anything.
 */
export function forecastDaily(
  days: string[],
  values: number[],
  horizon: number,
  digits = 1,
): DashboardForecastSeries | null {
  if (days.length !== values.length || values.length < SEASON * 2) return null;
  const recent = values.slice(-SEASON * 4);
  const activeDays = recent.filter((value) => value > 0).length;
  if (activeDays < MIN_ACTIVE_DAYS) return null;

  const index = seasonalIndex(days, values);
  const deseasoned = values.map((value, i) => value / index[dayOfWeek(days[i])]);

  // Choose the smoothing that would have predicted this series best, one
  // day ahead, over its own history (a small grid: cheap and explainable).
  let fit = runHolt(days, values, deseasoned, index, GRID[0].alpha, GRID[0].beta);
  for (const { alpha, beta } of GRID.slice(1)) {
    const candidate = runHolt(days, values, deseasoned, index, alpha, beta);
    if (candidate.sse < fit.sse) fit = candidate;
  }
  const { level, trend, errors } = fit;

  const meanError = errors.reduce((a, b) => a + b, 0) / Math.max(errors.length, 1);
  const sigma = Math.sqrt(
    errors.reduce((sum, error) => sum + (error - meanError) ** 2, 0) / Math.max(errors.length - 1, 1),
  );

  const lastDay = days[days.length - 1];
  const points: DashboardForecastPoint[] = [];
  for (let k = 1; k <= horizon; k += 1) {
    const date = addDays(lastDay, k);
    // Damped trend: the slope fades with the horizon instead of running away.
    const dampedSteps = (PHI * (1 - PHI ** k)) / (1 - PHI);
    const value = Math.max(0, (level + dampedSteps * trend) * index[dayOfWeek(date)]);
    const spread = Z_80 * sigma * Math.sqrt(1 + (k - 1) * 0.15);
    points.push({
      date,
      value: round(value, digits),
      low: round(Math.max(0, value - spread), digits),
      high: round(value + spread, digits),
    });
  }

  const lastFourWeeks = recent.reduce((a, b) => a + b, 0);
  const priorFourWeeks = values.slice(-SEASON * 8, -SEASON * 4).reduce((a, b) => a + b, 0);

  return {
    method: 'seasonal-holt',
    points,
    trendPerWeek: round(trend * SEASON, digits),
    changeVsPriorPct:
      priorFourWeeks > 0 ? round(((lastFourWeeks - priorFourWeeks) / priorFourWeeks) * 100, 1) : null,
    activeDays,
  };
}

function runHolt(
  days: string[],
  values: number[],
  deseasoned: number[],
  index: number[],
  alpha: number,
  beta: number,
): { level: number; trend: number; errors: number[]; sse: number } {
  // Initialise from the first two weeks: level is week one's mean, trend the weekly change.
  const week1 = deseasoned.slice(0, SEASON).reduce((a, b) => a + b, 0) / SEASON;
  const week2 = deseasoned.slice(SEASON, SEASON * 2).reduce((a, b) => a + b, 0) / SEASON;
  let level = week1;
  let trend = (week2 - week1) / SEASON;
  const errors: number[] = [];
  let sse = 0;
  for (let i = 0; i < deseasoned.length; i += 1) {
    const predicted = (level + PHI * trend) * index[dayOfWeek(days[i])];
    const error = values[i] - predicted;
    if (i >= SEASON * 2) sse += error * error;
    if (i >= deseasoned.length - SEASON * 4) errors.push(error);
    const previousLevel = level;
    level = alpha * deseasoned[i] + (1 - alpha) * (level + PHI * trend);
    trend = beta * (level - previousLevel) + (1 - beta) * PHI * trend;
  }
  return { level, trend, errors, sse };
}

/** Sums the forecast points whose date falls in `[from, to]` (inclusive). */
export function sumForecast(
  series: DashboardForecastSeries,
  from: string,
  to: string,
): { value: number; low: number; high: number } {
  const points = series.points.filter((point) => point.date >= from && point.date <= to);
  const value = points.reduce((total, point) => total + point.value, 0);
  // Daily errors are roughly independent, so their spreads add in quadrature;
  // summing each day's low and high would overstate the range.
  const spread = Math.sqrt(points.reduce((total, point) => total + (point.high - point.value) ** 2, 0));
  return { value, low: Math.max(0, value - spread), high: value + spread };
}

/**
 * Where a month-to-date figure lands by the end of the month: what has
 * happened so far plus the forecast for the days still to come.
 */
export function projectMonthEnd(
  today: string,
  actualToDate: number,
  series: DashboardForecastSeries | null,
  lastMonthTotal: number,
): DashboardRunRateProjection | null {
  if (!series) return null;
  const monthEnd = lastDayOfMonth(today);
  const remaining = today < monthEnd ? sumForecast(series, addDays(today, 1), monthEnd) : { value: 0, low: 0, high: 0 };
  const projected = actualToDate + remaining.value;
  return {
    actualToDate: round(actualToDate, 2),
    projected: round(projected, 2),
    low: round(actualToDate + remaining.low, 2),
    high: round(actualToDate + remaining.high, 2),
    periodEnd: monthEnd,
    comparison: round(lastMonthTotal, 2),
    changeVsComparisonPct:
      lastMonthTotal > 0 ? round(((projected - lastMonthTotal) / lastMonthTotal) * 100, 1) : null,
  };
}

export function lastDayOfMonth(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  return end.toISOString().slice(0, 10);
}
