'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  AlertOctagon,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Info,
  Sparkles,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TONE_CHART, TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
import type {
  DashboardForecastSeries,
  DashboardMetrics,
} from '@/modules/reporting/hooks/use-dashboard-metrics';
import {
  buildDashboardInsights,
  lastFullDays,
  nextDays,
  percentChange,
  sum,
  type InsightSeverity,
} from '@/modules/reporting/lib/dashboard-insights';

type SeriesKey = 'encounters' | 'revenue' | 'newPatients';

const SERIES: Record<SeriesKey, { label: string; tone: BadgeTone; money: boolean }> = {
  encounters: { label: 'Encounters', tone: 'violet', money: false },
  revenue: { label: 'Billing', tone: 'teal', money: true },
  newPatients: { label: 'New patients', tone: 'sky', money: false },
};

/** Days of history drawn before the forecast. */
const HISTORY_SHOWN = 42;

const SEVERITY: Record<InsightSeverity, { icon: LucideIcon; className: string; label: string }> = {
  critical: { icon: AlertOctagon, className: 'bg-destructive/10 text-destructive', label: 'Act now' },
  watch: { icon: Eye, className: 'bg-warning/10 text-warning', label: 'Watch' },
  positive: { icon: ThumbsUp, className: 'bg-success/10 text-success', label: 'On track' },
  info: { icon: Info, className: 'bg-info/10 text-info', label: 'Note' },
};

const SHORT_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const shortDate = (iso: string) => SHORT_DATE.format(new Date(`${iso}T00:00:00Z`));

interface ChartRow {
  date: string;
  actual?: number;
  forecast?: number;
  band?: [number, number];
}

function chartRows(metrics: DashboardMetrics, key: SeriesKey): ChartRow[] {
  const days = metrics.trends?.days ?? [];
  const values = metrics.trends?.[key] ?? [];
  const forecast = metrics.forecast?.[key];
  const rows = new Map<string, ChartRow>();
  days.slice(-HISTORY_SHOWN).forEach((date, i, shown) => {
    rows.set(date, { date, actual: values[values.length - shown.length + i] });
  });
  // Join the forecast to the last full day so the dashed line starts from history.
  const yesterday = days.at(-2);
  if (forecast && yesterday && rows.has(yesterday)) {
    const row = rows.get(yesterday)!;
    row.forecast = row.actual;
    row.band = [row.actual ?? 0, row.actual ?? 0];
  }
  forecast?.points.slice(0, 14).forEach((point) => {
    const row = rows.get(point.date) ?? { date: point.date };
    row.forecast = point.value;
    row.band = [point.low, point.high];
    rows.set(point.date, row);
  });
  return [...rows.values()];
}

interface ProjectionCardProps {
  title: string;
  tone: BadgeTone;
  value: string;
  range?: string;
  change: number | null;
  changeLabel: string;
  progress?: number;
  progressLabel?: string;
  empty?: boolean;
}

function ProjectionCard({ title, tone, value, range, change, changeLabel, progress, progressLabel, empty }: ProjectionCardProps) {
  const up = (change ?? 0) >= 0;
  return (
    <div className={cn('flex flex-col gap-2 rounded-xl border p-4', TONE_WASH[tone])}>
      <span className={cn('text-[11px] font-medium uppercase tracking-wide', TONE_TEXT[tone])}>{title}</span>
      {empty ? (
        <span className="text-sm text-muted-foreground">Not enough recent history to project.</span>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
            {change !== null ? (
              <span
                className={cn(
                  'inline-flex items-center text-xs font-medium',
                  up ? 'text-success' : 'text-destructive',
                )}
              >
                {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(change).toFixed(0)}%
              </span>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {range ? `Likely ${range} · ` : ''}
            {changeLabel}
          </span>
          {progress !== undefined ? (
            <div className="mt-1">
              <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-background/80', TONE_TEXT[tone])}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: 'currentColor' }}
                />
              </div>
              {progressLabel ? <span className="text-[11px] text-muted-foreground">{progressLabel}</span> : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export function DashboardForecast({
  metrics,
  formatMoney,
  isLoading,
  locale,
}: {
  metrics: DashboardMetrics;
  formatMoney: (value: number) => string;
  isLoading: boolean;
  locale: string;
}) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const [seriesKey, setSeriesKey] = useState<SeriesKey>('encounters');
  const series = SERIES[seriesKey];
  const colour = TONE_CHART[series.tone][mode];
  const rows = useMemo(() => chartRows(metrics, seriesKey), [metrics, seriesKey]);
  const insights = useMemo(() => buildDashboardInsights(metrics, formatMoney), [metrics, formatMoney]);
  const format = (value: number) => (series.money ? formatMoney(value) : Math.round(value).toLocaleString('en-GB'));

  const { forecast, trends, arAging } = metrics;
  const revenue = forecast?.revenueMonthEnd ?? null;
  const patients = forecast?.newPatientsMonthEnd ?? null;
  const encounterWeek = forecast?.encounters ? nextDays(forecast.encounters, 7) : null;
  const encounterLastWeek = sum(lastFullDays(trends?.encounters, 7));
  const activeSeries: DashboardForecastSeries | null = forecast?.[seriesKey] ?? null;
  const today = forecast?.generatedFor ?? trends?.days.at(-1);
  const arTotal = arAging ? sum(arAging.buckets.map((bucket) => bucket.amount)) : 0;
  const AR_TONE: Record<string, BadgeTone> = { current: 'green', d31_60: 'amber', d61_90: 'orange', d90_plus: 'red' };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading the forecast">
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <section aria-labelledby="dashboard-forecast" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="dashboard-forecast" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI forecast &amp; insights
          </h2>
          <p className="text-xs text-muted-foreground">
            Weekly-seasonal trend model fitted on the last 90 days · shaded bands are the ≈80% likely range
          </p>
        </div>
      </div>

      {!forecast ? (
        <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          Projections appear once the metrics cache next refreshes.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <ProjectionCard
            title="Billing by month end"
            tone="teal"
            empty={!revenue}
            value={revenue ? formatMoney(revenue.projected) : ''}
            range={revenue ? `${formatMoney(revenue.low)}–${formatMoney(revenue.high)}` : undefined}
            change={revenue?.changeVsComparisonPct ?? null}
            changeLabel={revenue ? `vs ${formatMoney(revenue.comparison)} last month` : ''}
            progress={revenue && revenue.projected > 0 ? (revenue.actualToDate / revenue.projected) * 100 : undefined}
            progressLabel={revenue ? `${formatMoney(revenue.actualToDate)} billed so far` : undefined}
          />
          <ProjectionCard
            title="Encounters next 7 days"
            tone="violet"
            empty={!encounterWeek}
            value={encounterWeek ? Math.round(encounterWeek.value).toLocaleString('en-GB') : ''}
            range={encounterWeek ? `${Math.round(encounterWeek.low)}–${Math.round(encounterWeek.high)}` : undefined}
            change={encounterWeek ? percentChange(encounterWeek.value, encounterLastWeek) : null}
            changeLabel={`vs ${encounterLastWeek.toLocaleString('en-GB')} last 7 days`}
          />
          <ProjectionCard
            title="New patients by month end"
            tone="sky"
            empty={!patients}
            value={patients ? Math.round(patients.projected).toLocaleString('en-GB') : ''}
            range={patients ? `${Math.round(patients.low)}–${Math.round(patients.high)}` : undefined}
            change={patients?.changeVsComparisonPct ?? null}
            changeLabel={patients ? `vs ${Math.round(patients.comparison)} last month` : ''}
            progress={patients && patients.projected > 0 ? (patients.actualToDate / patients.projected) * 100 : undefined}
            progressLabel={patients ? `${Math.round(patients.actualToDate)} registered so far` : undefined}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="text-base">{series.label}: last 6 weeks and next 2</CardTitle>
              <CardDescription>
                {activeSeries
                  ? `Trend ${activeSeries.trendPerWeek >= 0 ? '+' : ''}${format(activeSeries.trendPerWeek)} a week${
                      activeSeries.changeVsPriorPct !== null
                        ? ` · last 4 weeks ${activeSeries.changeVsPriorPct >= 0 ? '+' : ''}${activeSeries.changeVsPriorPct.toFixed(0)}% on the 4 before`
                        : ''
                    }`
                  : 'History only: too few active days in the last 4 weeks to project.'}
              </CardDescription>
            </div>
            <Tabs value={seriesKey} onValueChange={(value) => setSeriesKey(value as SeriesKey)}>
              <TabsList aria-label="Series">
                {(Object.keys(SERIES) as SeriesKey[]).map((key) => (
                  <TabsTrigger key={key} value={key} className="px-3 text-xs">
                    {SERIES[key].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    minTickGap={24}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    width={series.money ? 72 : 36}
                    tickFormatter={(value: number) => (series.money ? formatMoney(value) : String(value))}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    labelFormatter={(label) => shortDate(String(label))}
                    formatter={(value, name) => {
                      if (Array.isArray(value)) return [`${format(Number(value[0]))}–${format(Number(value[1]))}`, 'Likely range'];
                      return [format(Number(value)), name === 'actual' ? 'Actual' : 'Forecast'];
                    }}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Area dataKey="band" stroke="none" fill={colour} fillOpacity={0.15} isAnimationActive={false} />
                  <Bar dataKey="actual" fill={colour} fillOpacity={0.55} radius={[3, 3, 0, 0]} maxBarSize={14} />
                  <Line
                    dataKey="forecast"
                    stroke={colour}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                  {today ? <ReferenceLine x={today} stroke={colour} strokeOpacity={0.5} label={{ value: 'Today', fontSize: 10, position: 'top' }} /> : null}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What needs attention</CardTitle>
            <CardDescription>Ranked from the figures above.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {insights.slice(0, 5).map((insight) => {
                const severity = SEVERITY[insight.severity];
                const Icon = severity.icon;
                const body = (
                  <div className="flex gap-3">
                    <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', severity.className)}>
                      <Icon className="h-3.5 w-3.5" aria-label={severity.label} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.detail}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={insight.id}>
                    {insight.href ? (
                      <Link href={`/${locale}${insight.href}`} className="block rounded-lg p-1 -m-1 hover:bg-muted/60">
                        {body}
                      </Link>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {arAging ? (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="text-base">Receivables by age</CardTitle>
              <CardDescription>
                {formatMoney(arTotal)} open
                {arAging.collectionRate90d !== null
                  ? ` · ${arAging.collectionRate90d.toFixed(0)}% of the last 90 days’ billing collected`
                  : ''}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {arTotal > 0 ? (
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label="Receivables by age">
                {arAging.buckets.map((bucket) =>
                  bucket.amount > 0 ? (
                    <div
                      key={bucket.key}
                      style={{ width: `${(bucket.amount / arTotal) * 100}%`, background: TONE_CHART[AR_TONE[bucket.key]][mode] }}
                    />
                  ) : null,
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No open receivables.</p>
            )}
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {arAging.buckets.map((bucket) => (
                <div key={bucket.key} className="flex flex-col">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: TONE_CHART[AR_TONE[bucket.key]][mode] }} />
                    {bucket.label}
                  </dt>
                  <dd className="text-sm font-semibold tabular-nums text-foreground">{formatMoney(bucket.amount)}</dd>
                  <dd className="text-[11px] text-muted-foreground">
                    {bucket.count} invoice{bucket.count === 1 ? '' : 's'}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
