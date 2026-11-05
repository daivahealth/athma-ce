'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TONE_CHART, TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
import type { DashboardMetrics } from '@/modules/reporting/hooks/use-dashboard-metrics';
import {
  dayByDay,
  formatDayMonth,
  formatPeriod,
  formatWeekday,
  headline,
  isInProgress,
  periodContaining,
  periodTotals,
  projectPeriod,
  shiftPeriod,
  type Aggregate,
  type DashboardPeriod,
  type TrendKey,
  type TrendView,
} from '@/modules/reporting/lib/dashboard-periods';

type Sentiment = 'up-good' | 'up-bad' | 'neutral';

interface HeadlineSpec {
  id: string;
  label: string;
  tone: BadgeTone;
  href: string;
  how: Aggregate;
  sentiment: Sentiment;
  money?: boolean;
  /** Projected to the end of a period in progress from this forecast series. */
  forecast?: 'encounters' | 'newPatients' | 'revenue';
}

const HEADLINES: HeadlineSpec[] = [
  { id: 'encounters', label: 'Encounters', tone: 'violet', href: '/encounters', how: { kind: 'sum', key: 'encounters' }, sentiment: 'up-good', forecast: 'encounters' },
  { id: 'appointments', label: 'Appointments', tone: 'blue', href: '/scheduling/appointments', how: { kind: 'sum', key: 'appointments' }, sentiment: 'up-good' },
  { id: 'no-show-rate', label: 'No-show rate', tone: 'amber', href: '/scheduling/appointments', how: { kind: 'rate', numerator: 'noShows', denominator: 'appointments' }, sentiment: 'up-bad' },
  { id: 'new-patients', label: 'New patients', tone: 'sky', href: '/patients', how: { kind: 'sum', key: 'newPatients' }, sentiment: 'up-good', forecast: 'newPatients' },
  { id: 'admissions', label: 'Admissions', tone: 'teal', href: '/inpatient/admissions', how: { kind: 'sum', key: 'admissions' }, sentiment: 'neutral' },
  { id: 'billed', label: 'Billed', tone: 'green', href: '/invoices', how: { kind: 'sum', key: 'revenue' }, sentiment: 'up-good', money: true, forecast: 'revenue' },
];

type ChartKey = 'encounters' | 'appointments' | 'revenue' | 'newPatients';
const CHART_SERIES: Record<ChartKey, { label: string; tone: BadgeTone; money: boolean }> = {
  encounters: { label: 'Encounters', tone: 'violet', money: false },
  appointments: { label: 'Appointments', tone: 'blue', money: false },
  revenue: { label: 'Billing', tone: 'green', money: true },
  newPatients: { label: 'New patients', tone: 'sky', money: false },
};

const SENTIMENT_CLASS = {
  good: 'text-success',
  bad: 'text-destructive',
  neutral: 'text-muted-foreground',
} as const;

function sentimentOf(spec: HeadlineSpec, change: number): keyof typeof SENTIMENT_CLASS {
  if (spec.sentiment === 'neutral' || Math.abs(change) < 0.5) return 'neutral';
  const up = change > 0;
  return (spec.sentiment === 'up-good') === up ? 'good' : 'bad';
}

function Sparkline({ values, colour }: { values: (number | null)[]; colour: string }) {
  const data = values.map((value, i) => ({ i, value }));
  return (
    <div className="h-8 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <Line dataKey="value" stroke={colour} strokeWidth={1.75} dot={false} isAnimationActive={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PeriodPicker({
  period,
  latest,
  earliest,
  onChange,
}: {
  period: DashboardPeriod;
  latest: DashboardPeriod;
  earliest: string | undefined;
  onChange: (period: DashboardPeriod) => void;
}) {
  const noun = period.view === 'week' ? 'week' : 'month';
  const previous = shiftPeriod(period, -1);
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Choose the ${noun}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label={`Previous ${noun}`}
        disabled={!earliest || previous.to < earliest}
        onClick={() => onChange(previous)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-40 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {formatPeriod(period)}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label={`Next ${noun}`}
        disabled={period.from >= latest.from}
        onClick={() => onChange(shiftPeriod(period, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * The Week and Month dashboards (after prrapp#470): headline figures for the
 * chosen period against the one before, day by day and over the last twelve
 * periods, from the daily history in the cached dashboard metrics.
 */
export function DashboardTrendsView({
  view,
  period,
  onPeriodChange,
  metrics,
  isLoading,
  formatMoney,
  locale,
}: {
  view: TrendView;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  metrics: DashboardMetrics;
  isLoading: boolean;
  formatMoney: (value: number) => string;
  locale: string;
}) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const [chartKey, setChartKey] = useState<ChartKey>('encounters');
  const trends = metrics.trends;
  const today = trends?.days.at(-1) ?? new Date().toISOString().slice(0, 10);
  const latest = periodContaining(view, today);
  const inProgress = isInProgress(period, today);
  const noun = view === 'week' ? 'Week' : 'Month';
  const previousNoun = view === 'week' ? 'last week' : 'last month';
  const hasWeekMonthSeries = Boolean(trends?.appointments);

  const series = CHART_SERIES[chartKey];
  const colour = TONE_CHART[series.tone][mode];
  const muted = TONE_CHART.slate[mode];
  const formatSeries = (value: number) => (series.money ? formatMoney(value) : Math.round(value).toLocaleString('en-GB'));

  const headlines = useMemo(
    () => (trends ? HEADLINES.map((spec) => ({ spec, figure: headline(trends, spec.how, period, today) })) : []),
    [trends, period, today],
  );
  const daily = useMemo(
    () => (trends ? dayByDay(trends, chartKey as TrendKey, period, today) : []),
    [trends, chartKey, period, today],
  );
  const totals = useMemo(
    () => (trends ? periodTotals(trends, chartKey as TrendKey, period, today, 12) : []),
    [trends, chartKey, period, today],
  );
  const wardFlow = useMemo(() => {
    if (!trends) return [];
    const admissions = dayByDay(trends, 'admissions', period, today);
    const discharges = dayByDay(trends, 'discharges', period, today);
    return admissions.map((row, i) => ({ label: row.label, date: row.date, admissions: row.current, discharges: discharges[i].current }));
  }, [trends, period, today]);

  const forecastFor = (key: HeadlineSpec['forecast']) => (key ? metrics.forecast?.[key] : null);
  const chartProjection =
    chartKey !== 'appointments' && trends
      ? projectPeriod(trends, chartKey, forecastFor(chartKey), period, today)
      : null;
  const totalsRows = totals.map((row) => ({
    label: row.label,
    value: row.value,
    projectedRest: row.partial && chartProjection && row.value !== null ? Math.max(0, chartProjection.value - row.value) : null,
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading the trends">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {HEADLINES.map((spec) => (
            <Skeleton key={spec.id} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  const through = headlines[0]?.figure.through;

  return (
    <section className="flex flex-col gap-6" data-dashboard-view={view}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{noun}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPeriod(period)}
            {inProgress
              ? through
                ? ` · so far, to ${formatWeekday(through)} ${formatDayMonth(through)} · compared with the same days ${previousNoun}`
                : ' · starts today: figures appear tomorrow'
              : null}
          </p>
        </div>
        <PeriodPicker period={period} latest={latest} earliest={trends?.days[0]} onChange={onPeriodChange} />
      </header>

      {!trends || !hasWeekMonthSeries ? (
        <p role="status" className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          The week and month figures appear once the metrics cache next refreshes. Press Refresh on the Today tab.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Headline figures">
            {headlines.map(({ spec, figure }) => {
              const format = (value: number) =>
                spec.how.kind === 'rate'
                  ? `${value.toFixed(1)}%`
                  : spec.money
                    ? formatMoney(value)
                    : Math.round(value).toLocaleString('en-GB');
              const change = figure.delta
                ? spec.how.kind === 'rate'
                  ? (figure.delta.points ?? null)
                  : figure.delta.pct
                : null;
              const projection =
                spec.forecast && spec.how.kind === 'sum'
                  ? projectPeriod(trends, spec.how.key, forecastFor(spec.forecast), period, today)
                  : null;
              return (
                <Link
                  key={spec.id}
                  href={`/${locale}${spec.href}`}
                  data-metric={spec.id}
                  className={cn(
                    'flex min-h-32 flex-col justify-between gap-1 rounded-xl border px-4 py-3 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    TONE_WASH[spec.tone],
                  )}
                >
                  <span className={cn('text-[11px] font-medium uppercase tracking-wide', TONE_TEXT[spec.tone])}>
                    {spec.label}
                  </span>
                  <span className="text-2xl font-semibold tabular-nums text-foreground">
                    {figure.value === null ? '—' : format(figure.value)}
                  </span>
                  <Sparkline values={figure.history} colour={TONE_CHART[spec.tone][mode]} />
                  <span className="flex flex-col text-[11px]">
                    {change !== null ? (
                      <span className={SENTIMENT_CLASS[sentimentOf(spec, change)]}>
                        {change >= 0 ? '▲' : '▼'}{' '}
                        {spec.how.kind === 'rate'
                          ? `${Math.abs(change).toFixed(1)} pts`
                          : `${Math.abs(change).toFixed(0)}%`}{' '}
                        vs {previousNoun}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No comparison</span>
                    )}
                    {projection ? (
                      <span className="text-muted-foreground">On course for ~{format(projection.value)}</span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">Activity</h2>
            <Tabs value={chartKey} onValueChange={(value) => setChartKey(value as ChartKey)}>
              <TabsList aria-label="Series">
                {(Object.keys(CHART_SERIES) as ChartKey[]).map((key) => (
                  <TabsTrigger key={key} value={key} className="px-3 text-xs">
                    {CHART_SERIES[key].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{series.label} day by day</CardTitle>
                <CardDescription>
                  Bars: {view === 'week' ? 'this week' : formatPeriod(period)} · line: the same {view === 'week' ? 'weekday' : 'date'} {previousNoun}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={view === 'week' ? 0 : 2} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        width={series.money ? 72 : 36}
                        tickFormatter={(value: number) => (series.money ? formatMoney(value) : String(value))}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        labelFormatter={(_, payload) => {
                          const date = payload?.[0]?.payload?.date as string | undefined;
                          return date ? `${formatWeekday(date)} ${formatDayMonth(date)}` : '';
                        }}
                        formatter={(value, name) => [formatSeries(Number(value)), name === 'current' ? 'This period' : 'Period before']}
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Bar dataKey="current" fill={colour} fillOpacity={0.7} radius={[3, 3, 0, 0]} maxBarSize={view === 'week' ? 36 : 14} />
                      <Line dataKey="previous" stroke={muted} strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} connectNulls />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {series.label}: last 12 {view === 'week' ? 'weeks' : 'months'}
                </CardTitle>
                <CardDescription>
                  {chartProjection
                    ? `Shaded: the forecast for the rest of this ${view} (on course for ~${formatSeries(chartProjection.value)})`
                    : `Totals per ${view}; the current one so far`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={totalsRows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={12} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        width={series.money ? 72 : 40}
                        tickFormatter={(value: number) => (series.money ? formatMoney(value) : String(value))}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(value, name) => [formatSeries(Number(value)), name === 'value' ? 'Counted' : 'Forecast to period end']}
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Bar dataKey="value" stackId="total" fill={colour} fillOpacity={0.75} maxBarSize={32} />
                      <Bar dataKey="projectedRest" stackId="total" fill={colour} fillOpacity={0.2} radius={[3, 3, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ward flow</CardTitle>
              <CardDescription>Admissions and discharges each day of {formatPeriod(period)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardFlow} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={view === 'week' ? 0 : 2} />
                    <YAxis tick={{ fontSize: 11 }} width={28} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(_, payload) => {
                        const date = payload?.[0]?.payload?.date as string | undefined;
                        return date ? `${formatWeekday(date)} ${formatDayMonth(date)}` : '';
                      }}
                      formatter={(value, name) => [Number(value), name === 'admissions' ? 'Admissions' : 'Discharges']}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="admissions" fill={TONE_CHART.teal[mode]} radius={[3, 3, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="discharges" fill={TONE_CHART.orange[mode]} radius={[3, 3, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
