import type { DashboardMetrics } from '@/modules/reporting/hooks/use-dashboard-metrics';
import { buildDashboardInsights, lastFullDays, nextDays } from './dashboard-insights';

const money = (value: number) => `₹${Math.round(value)}`;

function metrics(overrides: Partial<DashboardMetrics> = {}): DashboardMetrics {
  return {
    revenueMTD: 0,
    revenueLastMonth: 0,
    revenueGrowth: 0,
    totalPatients: 0,
    newPatientsThisMonth: 0,
    patientGrowth: 0,
    appointmentsToday: 0,
    appointmentsThisWeek: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    encountersToday: 0,
    encountersThisWeek: 0,
    avgEncounterDuration: 0,
    unpaidInvoices: 0,
    unpaidAmount: 0,
    overdueInvoices: 0,
    overdueAmount: 0,
    activeFacilities: 0,
    appointmentCompletionRate: 0,
    utilizationRate: 0,
    cachedAt: '2026-11-04T10:00:00Z',
    currency: 'INR',
    ...overrides,
  };
}

const series = (values: number[]) => ({
  method: 'seasonal-holt' as const,
  points: values.map((value, i) => ({ date: `2026-11-${String(4 + i).padStart(2, '0')}`, value, low: value - 1, high: value + 1 })),
  trendPerWeek: 0,
  changeVsPriorPct: null,
  activeDays: 20,
});

describe('lastFullDays', () => {
  it('drops today, the partial last day', () => {
    expect(lastFullDays([1, 2, 3, 4, 99], 3)).toEqual([2, 3, 4]);
  });
  it('is empty without history', () => {
    expect(lastFullDays(undefined, 7)).toEqual([]);
  });
});

describe('nextDays', () => {
  it('combines the daily bands in quadrature and finds the busiest day', () => {
    const result = nextDays(series([3, 9, 4]), 2);
    expect(result.value).toBe(12);
    expect(result.low).toBeCloseTo(12 - Math.SQRT2);
    expect(result.high).toBeCloseTo(12 + Math.SQRT2);
    expect(result.busiest?.date).toBe('2026-11-05');
  });
});

describe('buildDashboardInsights', () => {
  it('says all clear when nothing is waiting and there is no forecast', () => {
    const insights = buildDashboardInsights(metrics(), money);
    expect(insights.map((i) => i.id)).toEqual(['all-clear']);
  });

  it('says when history is too thin to forecast', () => {
    const insights = buildDashboardInsights(
      metrics({
        forecast: {
          generatedFor: '2026-11-04',
          horizonDays: 27,
          encounters: null,
          newPatients: null,
          revenue: null,
          revenueMonthEnd: null,
          newPatientsMonthEnd: null,
        },
      }),
      money,
    );
    expect(insights.map((i) => i.id)).toEqual(['insufficient-history']);
  });

  it('ranks critical receivables and urgent orders above the forecast', () => {
    const insights = buildDashboardInsights(
      metrics({
        trends: { days: [], encounters: [10, 10, 10, 10, 10, 10, 10, 10, 2], newPatients: [], revenue: [] },
        forecast: {
          generatedFor: '2026-11-04',
          horizonDays: 14,
          encounters: series([12, 12, 12, 12, 12, 12, 20]),
          newPatients: null,
          revenue: null,
          revenueMonthEnd: {
            actualToDate: 100,
            projected: 1200,
            low: 1000,
            high: 1400,
            periodEnd: '2026-11-30',
            comparison: 1000,
            changeVsComparisonPct: 20,
          },
          newPatientsMonthEnd: null,
        },
        arAging: {
          buckets: [
            { key: 'current', label: '0–30 days', count: 2, amount: 100 },
            { key: 'd31_60', label: '31–60 days', count: 0, amount: 0 },
            { key: 'd61_90', label: '61–90 days', count: 0, amount: 0 },
            { key: 'd90_plus', label: '90+ days', count: 3, amount: 300 },
          ],
          collectionRate90d: 80,
        },
        worklists: {
          encountersInProgress: 0,
          ordersOpen: 2,
          labOrdersOpen: 2,
          imagingOrdersOpen: 0,
          urgentOrdersOpen: 2,
          labReportsAwaitingSignOff: 0,
          inpatientsCurrent: 0,
          dischargesDue: 0,
          appointmentsNext7Days: 0,
        },
      }),
      money,
    );

    expect(insights.map((i) => i.id)).toEqual([
      'ar-90-plus',
      'urgent-orders',
      'encounters-next-week',
      'revenue-month-end',
    ]);
    expect(insights[0].title).toBe('75% of receivables are over 90 days old');
    // 92 next week against 70 last week: +31%, worth extra cover.
    expect(insights[2]).toMatchObject({ severity: 'watch' });
    expect(insights[2].title).toContain('About 92 encounters');
    expect(insights[3]).toMatchObject({ severity: 'positive' });
  });
});
