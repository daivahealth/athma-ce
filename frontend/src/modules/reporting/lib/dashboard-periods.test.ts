import type { DashboardTrends } from '@/modules/reporting/hooks/use-dashboard-metrics';
import {
  addDays,
  countedThrough,
  dayByDay,
  formatPeriod,
  headline,
  parseDashboardView,
  parsePeriodParam,
  periodContaining,
  periodTotals,
  projectPeriod,
  shiftPeriod,
} from './dashboard-periods';

/** `n` days ending on `end`, each value from `valueOf(dayIndex)`. */
function trendsOf(end: string, n: number, valueOf: (i: number) => number): DashboardTrends {
  const days = Array.from({ length: n }, (_, i) => addDays(end, i - n + 1));
  const values = days.map((_, i) => valueOf(i));
  return {
    days,
    encounters: values,
    newPatients: values.map(() => 1),
    appointments: values.map(() => 10),
    noShows: values.map(() => 1),
    admissions: values,
    discharges: values,
    revenue: values,
  };
}

describe('periods', () => {
  it('runs weeks Monday to Sunday', () => {
    // 2026-11-05 is a Thursday.
    expect(periodContaining('week', '2026-11-05')).toEqual({ view: 'week', from: '2026-11-02', to: '2026-11-08' });
    expect(periodContaining('week', '2026-11-08')).toMatchObject({ from: '2026-11-02' });
    expect(periodContaining('week', '2026-11-09')).toMatchObject({ from: '2026-11-09' });
  });

  it('runs months over their own length', () => {
    expect(periodContaining('month', '2026-02-14')).toEqual({ view: 'month', from: '2026-02-01', to: '2026-02-28' });
    expect(shiftPeriod(periodContaining('month', '2026-01-31'), 1)).toMatchObject({ from: '2026-02-01', to: '2026-02-28' });
    expect(shiftPeriod(periodContaining('month', '2026-01-15'), -1)).toMatchObject({ from: '2025-12-01', to: '2025-12-31' });
  });

  it('formats periods', () => {
    expect(formatPeriod(periodContaining('week', '2026-11-05'))).toBe('2 Nov – 8 Nov 2026');
    expect(formatPeriod(periodContaining('month', '2026-11-05'))).toBe('November 2026');
  });

  it('parses the view and the period, never past the current one', () => {
    expect(parseDashboardView('week')).toBe('week');
    expect(parseDashboardView('year')).toBe('today');
    expect(parsePeriodParam('month', '2026-09', '2026-11-05')).toMatchObject({ from: '2026-09-01' });
    expect(parsePeriodParam('month', '2027-01', '2026-11-05')).toMatchObject({ from: '2026-11-01' });
    expect(parsePeriodParam('week', 'nonsense', '2026-11-05')).toMatchObject({ from: '2026-11-02' });
    // Any day in a week finds its Monday.
    expect(parsePeriodParam('week', '2026-10-29', '2026-11-05')).toMatchObject({ from: '2026-10-26' });
  });

  it('counts a period in progress through yesterday', () => {
    const week = periodContaining('week', '2026-11-05');
    expect(countedThrough(week, '2026-11-05')).toBe('2026-11-04');
    expect(countedThrough(week, '2026-11-02')).toBeNull();
    expect(countedThrough(shiftPeriod(week, -1), '2026-11-05')).toBe('2026-11-01');
  });
});

describe('headline', () => {
  const today = '2026-11-05';
  // 70 days ending today, every day worth 2.
  const flat = trendsOf(today, 70, () => 2);

  it('compares a week in progress like-for-like with the week before', () => {
    const result = headline(flat, { kind: 'sum', key: 'encounters' }, periodContaining('week', today), today);
    // Mon–Wed of each week: 3 days × 2.
    expect(result.value).toBe(6);
    expect(result.previous).toBe(6);
    expect(result.delta?.pct).toBe(0);
    expect(result.through).toBe('2026-11-04');
    expect(result.history).toHaveLength(8);
    expect(result.history.slice(0, 7)).toEqual([14, 14, 14, 14, 14, 14, 14]);
  });

  it('works out a rate in percentage points', () => {
    const result = headline(flat, { kind: 'rate', numerator: 'noShows', denominator: 'appointments' }, periodContaining('week', '2026-10-28'), today);
    expect(result.value).toBeCloseTo(10);
    expect(result.delta?.points).toBeCloseTo(0);
  });

  it('has no comparison where history does not reach', () => {
    const short = trendsOf(today, 5, () => 1);
    const result = headline(short, { kind: 'sum', key: 'encounters' }, periodContaining('week', today), today);
    expect(result.value).toBe(3);
    expect(result.previous).toBeNull();
    expect(result.delta).toBeNull();
  });
});

describe('projectPeriod', () => {
  it('adds the forecast for the rest of the period to what is counted', () => {
    const today = '2026-11-05';
    const trends = trendsOf(today, 30, () => 2);
    const forecast = {
      method: 'seasonal-holt' as const,
      points: Array.from({ length: 10 }, (_, i) => ({ date: addDays(today, i), value: 3, low: 2, high: 4 })),
      trendPerWeek: 0,
      changeVsPriorPct: null,
      activeDays: 28,
    };
    // Mon–Wed counted (6), Thu–Sun forecast (4 × 3).
    const result = projectPeriod(trends, 'encounters', forecast, periodContaining('week', today), today);
    expect(result?.value).toBe(18);
    expect(result?.high).toBeCloseTo(18 + 2); // four spreads of 1 in quadrature
    expect(projectPeriod(trends, 'encounters', forecast, periodContaining('week', '2026-10-28'), today)).toBeNull();
  });
});

describe('dayByDay and periodTotals', () => {
  const today = '2026-11-05';
  const rising = trendsOf(today, 60, (i) => i);

  it('lines each day up with the same day of the period before', () => {
    const rows = dayByDay(rising, 'encounters', periodContaining('week', today), today);
    expect(rows.map((row) => row.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(rows[0].current! - rows[0].previous!).toBe(7);
    // Today and later are not drawn as history.
    expect(rows[3].current).toBeNull();
  });

  it('totals the periods before, marking the one in progress', () => {
    const rows = periodTotals(rising, 'encounters', periodContaining('month', today), today, 3);
    expect(rows.map((row) => row.label)).toEqual(['Sept', 'Oct', 'Nov']);
    expect(rows[0].value).toBeNull(); // history starts in September, after the 1st
    expect(rows[2].partial).toBe(true);
  });
});
