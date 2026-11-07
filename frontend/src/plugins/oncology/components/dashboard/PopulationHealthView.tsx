'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricTile } from '@/components/ui/metric-tile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { TONE_CHART } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { useOncologyPopulationHealth } from '@/plugins/oncology/hooks/use-oncology';
import { oncologyStatusTone, treatmentIntentTone } from '@/plugins/oncology/lib/oncology-tone';
import type { OncologyPopulationHealth } from '@/plugins/oncology/types';

const PERIODS: Array<{ value: string; label: string }> = [
  { value: '0', label: 'All time' },
  { value: '12', label: 'Last 12 months' },
  { value: '36', label: 'Last 3 years' },
  { value: '60', label: 'Last 5 years' },
];

/**
 * Gender pair, validated with the dataviz palette checks (CVD and
 * normal-vision separation) on the light and dark surfaces.
 */
const GENDER_COLOURS = {
  light: { female: '#ea580c', male: '#2563eb', other: '#64748b' },
  dark: { female: '#ea580c', male: '#3b82f6', other: '#94a3b8' },
};

/** Stage at diagnosis: one hue, light (early) to dark (late); unstaged is neutral. */
const STAGE_FILL: Record<string, string> = {
  '0': 'bg-violet-200 dark:bg-violet-900',
  I: 'bg-violet-300 dark:bg-violet-700',
  II: 'bg-violet-400 dark:bg-violet-500',
  III: 'bg-violet-600 dark:bg-violet-400',
  IV: 'bg-violet-800 dark:bg-violet-200',
  Unstaged: 'bg-slate-200 dark:bg-slate-700',
};

const pctText = (v: number | null) => (v === null ? '—' : `${v}%`);
const label = (value: string) => value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });

function Panel({ title, note, children, className }: { title: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground', className)}>
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {note ? <p className="mt-0.5 text-xs text-muted-foreground">{note}</p> : null}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}

function ChartTooltip({ title, rows }: { title: string; rows: Array<{ label: string; value: number; colour?: string }> }) {
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="text-muted-foreground">{title}</div>
      {rows.map((row) => (
        <div key={row.label} className="mt-0.5 flex items-center gap-2 text-popover-foreground">
          {row.colour ? <span className="h-2 w-2 rounded-sm" style={{ background: row.colour }} /> : null}
          <span>{row.label}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function IncidenceChart({ rows, mode }: { rows: OncologyPopulationHealth['incidenceByMonth']; mode: 'light' | 'dark' }) {
  const fill = TONE_CHART.violet[mode];
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -16 }} barCategoryGap="20%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
          <YAxis allowDecimals={false} domain={[0, max]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as { month: string; count: number };
              const title = new Date(`${p.month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
              return <ChartTooltip title={title} rows={[{ label: 'New diagnoses', value: p.count, colour: fill }]} />;
            }}
          />
          <Bar dataKey="count" fill={fill} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AgeGenderChart({ rows, mode }: { rows: OncologyPopulationHealth['ageGender']; mode: 'light' | 'dark' }) {
  const colours = GENDER_COLOURS[mode];
  const hasOther = rows.some((r) => r.other > 0);
  const series = [
    { key: 'female' as const, label: 'Female' },
    { key: 'male' as const, label: 'Male' },
    ...(hasOther ? [{ key: 'other' as const, label: 'Other / not recorded' }] : []),
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colours[s.key] }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -16 }} barGap={2} barCategoryGap="22%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="band" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as OncologyPopulationHealth['ageGender'][number];
                return (
                  <ChartTooltip
                    title={`Age ${p.band}`}
                    rows={series.map((s) => ({ label: s.label, value: p[s.key], colour: colours[s.key] }))}
                  />
                );
              }}
            />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} fill={colours[s.key]} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** One segmented bar of stage at diagnosis, with a legend that carries the numbers. */
function StageBar({ rows }: { rows: OncologyPopulationHealth['stageAtDiagnosis'] }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  if (total === 0) return <p className="text-sm text-muted-foreground">No diagnoses in this period.</p>;
  const shown = rows.filter((r) => r.count > 0);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Stage at diagnosis">
        {shown.map((r) => (
          <div
            key={r.stage}
            className={cn('h-full first:rounded-l-full last:rounded-r-full', STAGE_FILL[r.stage])}
            style={{ width: `${(r.count / total) * 100}%` }}
            title={`${r.stage === 'Unstaged' ? 'Unstaged' : `Stage ${r.stage}`}: ${r.count} (${Math.round((r.count / total) * 100)}%)`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-2 sm:grid-cols-6">
        {rows.map((r) => (
          <li key={r.stage} className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn('h-2.5 w-2.5 shrink-0 rounded-sm', STAGE_FILL[r.stage])} />
              {r.stage === 'Unstaged' ? 'Unstaged' : `Stage ${r.stage}`}
            </div>
            <div className="text-sm font-medium tabular-nums text-foreground">
              {r.count} <span className="text-xs font-normal text-muted-foreground">{Math.round((r.count / total) * 100)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CountBars({ rows, empty }: { rows: Array<{ key: string; count: number }>; empty: string }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.key} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{row.key}</span>
            <span className="font-medium tabular-nums text-foreground">{row.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-teal-600 dark:bg-teal-400" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Distribution({ rows, toneFor }: { rows: Array<{ key: string; count: number }>; toneFor: (key: string) => BadgeTone }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  if (total === 0) return <p className="text-sm text-muted-foreground">None recorded.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {rows.map((r) => (
        <li key={r.key}>
          <ToneBadge tone={toneFor(r.key)} withDot>
            {label(r.key)} · {r.count} ({Math.round((r.count / total) * 100)}%)
          </ToneBadge>
        </li>
      ))}
    </ul>
  );
}

/**
 * Population health view of cancer care: incidence, who is affected, how
 * they present, how quickly they reach treatment and how they are doing.
 */
export function PopulationHealthView() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const [period, setPeriod] = useState('0');
  const { data, isLoading, error, refetch, isFetching } = useOncologyPopulationHealth(Number(period));
  const s = data?.summary;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? 'All time';

  const tiles: Array<{ key: string; label: string; value: string | number | null; note: string; tone: BadgeTone }> = [
    {
      key: 'cohort',
      label: 'Patients',
      value: s?.patients ?? 0,
      note: `${s?.diagnoses ?? 0} ${s?.diagnoses === 1 ? 'diagnosis' : 'diagnoses'}`,
      tone: 'sky',
    },
    {
      key: 'median-age',
      label: 'Median age at diagnosis',
      value: s?.medianAgeAtDiagnosis ?? null,
      note: 'Years',
      tone: 'slate',
    },
    {
      key: 'late-stage',
      label: 'Late stage at diagnosis',
      value: pctText(s?.lateStagePercent ?? null),
      note: `Stage III–IV · ${pctText(s?.stagedPercent ?? null)} staged`,
      tone: (s?.lateStagePercent ?? 0) >= 50 ? 'orange' : (s?.lateStagePercent ?? 0) >= 30 ? 'amber' : 'green',
    },
    {
      key: 'days-to-treatment',
      label: 'Diagnosis to treatment',
      value: s?.medianDaysToTreatment == null ? null : `${s.medianDaysToTreatment} d`,
      note: `Median · ${s?.withTreatmentDate ?? 0} with a start date`,
      tone: s?.medianDaysToTreatment == null ? 'slate' : s.medianDaysToTreatment > 30 ? 'amber' : 'green',
    },
    {
      key: 'treated-within-30',
      label: 'Treated within 30 days',
      value: pctText(s?.treatedWithin30DaysPercent ?? null),
      note: 'Of those with a start date',
      tone: s?.treatedWithin30DaysPercent == null ? 'slate' : s.treatedWithin30DaysPercent < 70 ? 'amber' : 'green',
    },
    {
      key: 'curative-intent',
      label: 'Curative intent',
      value: pctText(s?.curativeIntentPercent ?? null),
      note: `Remission ${pctText(s?.remissionPercent ?? null)} · recurrence ${pctText(s?.recurrencePercent ?? null)}`,
      tone: 'violet',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cancer population health</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {periodLabel} · diagnoses by date of diagnosis
            {s && s.lateStagePercent !== null ? (
              <>
                {' · '}
                <span className={cn('font-medium', s.lateStagePercent >= 30 ? 'text-warning' : 'text-success')}>
                  {s.lateStagePercent}% present at stage III–IV
                </span>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-40" aria-label="Period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-8">
            <RefreshCw className={cn('mr-1 h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((tile) => (
          <MetricTile key={tile.key} metricKey={tile.key} label={tile.label} value={tile.value} note={tile.note} tone={tile.tone} isLoading={isLoading} />
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[260px] w-full rounded-xl" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            <Panel title="New diagnoses by month" note="Last 12 months">
              <IncidenceChart rows={data.incidenceByMonth} mode={mode} />
            </Panel>
            <Panel title="Age at diagnosis by gender">
              <AgeGenderChart rows={data.ageGender} mode={mode} />
            </Panel>
          </div>

          <Panel title="Stage at diagnosis" note="Earliest staging recorded for each diagnosis. Later stages signal late presentation.">
            <StageBar rows={data.stageAtDiagnosis} />
          </Panel>

          <Panel title="By cancer type" note="Top 10 by number of diagnoses">
            {data.byCancerType.length === 0 ? (
              <p className="text-sm text-muted-foreground">No diagnoses in this period.</p>
            ) : (
              <div className="-mx-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Cancer type</th>
                      <th className="px-2 py-2 text-right font-medium">Diagnoses</th>
                      <th className="px-2 py-2 text-right font-medium">Median age</th>
                      <th className="px-2 py-2 text-right font-medium">Late stage</th>
                      <th className="px-2 py-2 text-right font-medium">Days to treatment</th>
                      <th className="px-4 py-2 text-right font-medium">In remission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.byCancerType.map((row) => (
                      <tr key={row.cancerType}>
                        <td className="px-4 py-2 text-foreground">{row.cancerType}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{row.diagnoses}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{row.medianAge ?? '—'}</td>
                        <td
                          className={cn(
                            'px-2 py-2 text-right tabular-nums',
                            (row.lateStagePercent ?? 0) >= 50 && 'font-medium text-warning',
                          )}
                        >
                          {pctText(row.lateStagePercent)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {row.medianDaysToTreatment == null ? '—' : `${row.medianDaysToTreatment} d`}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums">{pctText(row.remissionPercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <div className="grid gap-3 lg:grid-cols-3">
            <Panel title="Screenable cancers" note="Breast, cervical, oral and colorectal cancers have screening programmes; late stage here points to missed early detection.">
              {data.screenableCancers.length === 0 ? (
                <p className="text-sm text-muted-foreground">None in this period.</p>
              ) : (
                <ul className="divide-y">
                  {data.screenableCancers.map((row) => (
                    <li key={row.programme} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                      <div>
                        <div className="text-sm font-medium text-foreground">{row.programme}</div>
                        <div className="text-xs text-muted-foreground">
                          {row.diagnoses} {row.diagnoses === 1 ? 'diagnosis' : 'diagnoses'}
                        </div>
                      </div>
                      <ToneBadge tone={(row.lateStagePercent ?? 0) >= 50 ? 'orange' : row.lateStagePercent === null ? 'slate' : 'green'}>
                        {pctText(row.lateStagePercent)} late stage
                      </ToneBadge>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Where patients live" note="Distinct patients by city">
              <CountBars rows={data.byCity} empty="No addresses recorded." />
            </Panel>
            <Panel title="Outcomes and intent">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Clinical status</h3>
                  <Distribution rows={data.byClinicalStatus} toneFor={oncologyStatusTone} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Treatment intent</h3>
                  <Distribution rows={data.byTreatmentIntent} toneFor={(k) => (k === 'not_set' ? 'slate' : treatmentIntentTone(k))} />
                </div>
              </div>
            </Panel>
          </div>
        </>
      ) : null}
    </div>
  );
}
