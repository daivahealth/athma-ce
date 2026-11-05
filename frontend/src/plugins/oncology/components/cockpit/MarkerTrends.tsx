'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OncologyLabPoint } from '@/plugins/oncology/types';
import { dayMs, formatDayMs, formatMonthMs, monthTicks, num, useChartColour } from './cockpit-utils';

export interface TreatmentPeriod { start: number; end: number; kind: 'chemotherapy' | 'radiation' }

interface Series {
  code: string;
  name: string;
  unit: string;
  uln: number | null;
  points: { t: number; value: number }[];
}

function toSeries(points: OncologyLabPoint[]): Series[] {
  const by = new Map<string, Series>();
  for (const p of points) {
    const t = dayMs(p.observed_at);
    const value = num(p.value_numeric);
    if (t == null || value == null) continue;
    let s = by.get(p.test_code);
    if (!s) {
      s = { code: p.test_code, name: p.test_name, unit: p.unit ?? '', uln: null, points: [] };
      by.set(p.test_code, s);
    }
    s.points.push({ t, value });
    s.uln = num(p.ref_range_high) ?? s.uln;
  }
  return [...by.values()]
    .map((s) => ({ ...s, points: s.points.sort((a, b) => a.t - b.t) }))
    .filter((s) => s.points.length > 0);
}

/**
 * Tumour-marker trends: one small chart per marker (never two units on one
 * axis), upper limit of normal dashed, treatment periods shaded behind.
 */
export function MarkerTrends({ points, periods }: { points: OncologyLabPoint[]; periods: TreatmentPeriod[] }) {
  const series = useMemo(() => toSeries(points), [points]);
  if (series.length === 0) {
    return <p className="text-sm text-muted-foreground">No tumour-marker results on file. Markers appear here as lab reports are finalised.</p>;
  }
  return (
    <div className="space-y-6">
      {series.map((s) => <MarkerChart key={s.code} series={s} periods={periods} />)}
    </div>
  );
}

function MarkerChart({ series: s, periods }: { series: Series; periods: TreatmentPeriod[] }) {
  const colour = useChartColour();
  const [showTable, setShowTable] = useState(false);
  const line = colour('blue');
  const latest = s.points[s.points.length - 1];
  const peak = s.points.reduce((m, p) => (p.value > m.value ? p : m), s.points[0]);
  const high = s.uln != null && latest.value > s.uln;
  const fromPeak = peak.value > 0 && peak !== latest ? Math.round(((latest.value - peak.value) / peak.value) * 100) : null;

  const tMin = s.points[0].t;
  const tMax = s.points[s.points.length - 1].t;
  const pad = Math.max(7 * 86_400_000, (tMax - tMin) * 0.04);
  const domain: [number, number] = [tMin - pad, tMax + pad];
  const ticks = monthTicks(domain[0], domain[1]);
  const yMax = Math.max(peak.value, s.uln ?? 0) * 1.12;
  const shaded = periods.filter((p) => p.end >= domain[0] && p.start <= domain[1]);
  const fmt = (v: number) => (v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(1));

  return (
    <figure className="space-y-2">
      <figcaption className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <div className="text-sm font-medium">{s.name}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tabular-nums tracking-tight">{fmt(latest.value)}</span>
            <span className="text-sm text-muted-foreground">{s.unit}</span>
            <span className="text-xs text-muted-foreground">· {formatDayMs(latest.t)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {s.uln != null && (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium',
              high ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300')}>
              {high ? <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
              {high ? `Above normal (≤ ${fmt(s.uln)})` : `Within normal (≤ ${fmt(s.uln)})`}
            </span>
          )}
          {fromPeak != null && fromPeak !== 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
              {fromPeak < 0 ? <TrendingDown className="h-3.5 w-3.5" aria-hidden /> : <TrendingUp className="h-3.5 w-3.5" aria-hidden />}
              {fromPeak < 0 ? `${-fromPeak}% below peak` : `${fromPeak}% above peak`} ({fmt(peak.value)}, {formatDayMs(peak.t)})
            </span>
          )}
        </div>
      </figcaption>

      <div className="h-44 w-full" aria-hidden={showTable}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={s.points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            {shaded.map((p, i) => (
              <ReferenceArea
                key={i}
                x1={Math.max(p.start, domain[0])}
                x2={Math.min(p.end, domain[1])}
                fill={colour(p.kind === 'chemotherapy' ? 'violet' : 'amber')}
                fillOpacity={0.09}
                strokeOpacity={0}
                ifOverflow="hidden"
              />
            ))}
            <XAxis
              dataKey="t" type="number" scale="time" domain={domain} ticks={ticks}
              tickFormatter={(t: number) => formatMonthMs(t, new Date(t).getUTCMonth() === 0)}
              tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
            />
            <YAxis
              domain={[0, yMax]} width={44} tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v: number) => (yMax > 20 ? Math.round(v).toLocaleString() : fmt(v))} allowDecimals={yMax <= 20}
            />
            {s.uln != null && (
              <ReferenceLine
                y={s.uln} stroke={colour('slate')} strokeDasharray="4 4" strokeWidth={1}
                label={{ value: 'ULN', position: 'insideTopRight', fontSize: 10, fill: colour('slate') }}
              />
            )}
            <Tooltip
              cursor={{ stroke: colour('slate'), strokeWidth: 1, strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as { t: number; value: number };
                return (
                  <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
                    <div className="text-muted-foreground">{formatDayMs(p.t)}</div>
                    <div className="mt-0.5 font-semibold tabular-nums text-popover-foreground">{fmt(p.value)} {s.unit}</div>
                  </div>
                );
              }}
            />
            <Line
              dataKey="value" type="monotone" stroke={line} strokeWidth={2} isAnimationActive={false}
              dot={{ r: 4, fill: line, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: line, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {shaded.some((p) => p.kind === 'chemotherapy') && (
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm" style={{ background: colour('violet'), opacity: 0.35 }} />Chemotherapy</span>
          )}
          {shaded.some((p) => p.kind === 'radiation') && (
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm" style={{ background: colour('amber'), opacity: 0.35 }} />Radiotherapy</span>
          )}
          {s.uln != null && (
            <span className="inline-flex items-center gap-1.5"><span className="w-3 border-t border-dashed" style={{ borderColor: colour('slate') }} />Upper limit of normal</span>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}>
          {showTable ? 'Hide values' : `View ${s.points.length} values`}
        </Button>
      </div>

      {showTable && (
        <div className="max-h-56 overflow-auto rounded-md border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur">
              <tr><th className="p-2 text-left font-medium">Date</th><th className="p-2 text-right font-medium">{s.name} ({s.unit})</th><th className="p-2 text-left font-medium">Flag</th></tr>
            </thead>
            <tbody className="divide-y">
              {[...s.points].reverse().map((p) => (
                <tr key={p.t}>
                  <td className="p-2">{formatDayMs(p.t)}</td>
                  <td className="p-2 text-right tabular-nums">{fmt(p.value)}</td>
                  <td className="p-2 text-muted-foreground">{s.uln != null && p.value > s.uln ? 'High' : 'Normal'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
