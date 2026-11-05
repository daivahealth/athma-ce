'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Clock, FlaskConical, Pill } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useChartColour } from '@/plugins/oncology/components/cockpit/cockpit-utils';
import type { WorklistDay } from '@/plugins/oncology/types';
import {
  FIRST_START, LANES, UNIT_CLOSE, UNIT_OPEN, chairMinutes, clock, duration, hasPump, isOralOnly, labGateOf, laneOf,
  planChairs, suggestChairs, type LabGate, type LaneKey,
} from './board-model';

const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

function LabGateBadge({ gate, large }: { gate: LabGate; large?: boolean }) {
  if (gate === 'none') return null;
  const cfg = {
    ok: { icon: CheckCircle2, text: 'Labs OK', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' },
    pending: { icon: FlaskConical, text: 'Labs pending', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' },
    out_of_range: { icon: AlertTriangle, text: 'Labs out of range', cls: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300' },
  }[gate];
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium', large ? 'text-xs' : 'text-[11px]', cfg.cls)}>
      <Icon className={large ? 'h-3.5 w-3.5' : 'h-3 w-3'} aria-hidden />{cfg.text}
    </span>
  );
}

function PatientCard({ d, locale, large }: { d: WorklistDay; locale: string; large?: boolean }) {
  const oral = isOralOnly(d);
  const href = d.chemo_order_id ? `/${locale}/oncology/orders/${d.chemo_order_id}` : `/${locale}/oncology/treatment-plans/${d.treatment_plan_id}`;
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border/60 bg-card p-2.5 shadow-sm outline-none transition-colors hover:border-border hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn('font-medium leading-tight', large ? 'text-base' : 'text-sm')}>{d.patientDisplay?.displayName ?? 'Patient'}</div>
      <div className={cn('mt-0.5 text-muted-foreground', large ? 'text-sm' : 'text-xs')}>
        <span className="font-mono">{d.protocol_code}</span> · C{d.cycle_number} D{d.cycle_day}
        {d.dose_level ? <span className="ml-1 font-medium text-amber-700 dark:text-amber-400">DL {d.dose_level}</span> : null}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <LabGateBadge gate={labGateOf(d)} large={large} />
        {oral ? (
          <span className={cn('inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground', large ? 'text-xs' : 'text-[11px]')}>
            <Pill className="h-3 w-3" aria-hidden />Oral — dispense
          </span>
        ) : (
          <span className={cn('inline-flex items-center gap-1 text-muted-foreground', large ? 'text-xs' : 'text-[11px]')}>
            <Clock className="h-3 w-3" aria-hidden />{duration(chairMinutes(d))}{hasPump(d) ? ' + pump' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}

/** Where every patient is in the day: order → approval → pharmacy → ready → infusing → done. */
export function StatusLanes({ days, locale, large }: { days: WorklistDay[]; locale: string; large?: boolean }) {
  const colour = useChartColour();
  const byLane = useMemo(() => {
    const m = new Map<LaneKey, WorklistDay[]>();
    for (const d of days.filter((x) => !isOralOnly(x))) {
      const k = laneOf(d);
      m.set(k, [...(m.get(k) ?? []), d]);
    }
    return m;
  }, [days]);
  // "To order" and "Held" only take a column when someone is in them.
  const lanes = LANES.filter((l) => !['order', 'held'].includes(l.key) || (byLane.get(l.key)?.length ?? 0) > 0);

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(${large ? 12.5 : 10.5}rem, 1fr))` }}>
      {lanes.map((l) => {
        const list = byLane.get(l.key) ?? [];
        return (
          <section key={l.key} className="flex min-w-0 flex-col rounded-xl bg-muted/40 p-2" aria-label={`${l.title}: ${list.length}`}>
            <header className="mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colour(l.tone) }} aria-hidden />
                <h3 className={cn('font-semibold', large ? 'text-base' : 'text-sm')}>{l.title}</h3>
                <span className={cn('ml-auto tabular-nums font-semibold', large ? 'text-lg' : 'text-sm')}>{list.length}</span>
              </div>
              <p className="pl-[1.125rem] text-[11px] text-muted-foreground">{l.hint}</p>
            </header>
            <div className={cn('space-y-2 overflow-y-auto pr-0.5', large ? 'max-h-[46vh]' : 'max-h-[26rem]')}>
              {list.map((d) => <PatientCard key={d.id} d={d} locale={locale} large={large} />)}
              {list.length === 0 && <p className="px-1 py-3 text-center text-xs text-muted-foreground">—</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Chair plan for the day: one row per chair, each patient's block from first pre-med to flush. */
export function ChairTimeline({ days, locale, showNow, large }: { days: WorklistDay[]; locale: string; showNow: boolean; large?: boolean }) {
  const colour = useChartColour();
  const [chairs, setChairs] = useState(() => suggestChairs(days));
  useEffect(() => setChairs(suggestChairs(days)), [days]);
  const blocks = useMemo(() => planChairs(days, chairs), [days, chairs]);
  const [now, setNow] = useState(nowMinutes);
  useEffect(() => { const t = setInterval(() => setNow(nowMinutes()), 60_000); return () => clearInterval(t); }, []);

  const lastEnd = Math.max(UNIT_CLOSE, ...blocks.map((b) => b.end));
  const nowVisible = showNow && now >= UNIT_OPEN && now <= lastEnd;
  const span = lastEnd - UNIT_OPEN;
  const pct = (m: number) => `${((m - UNIT_OPEN) / span) * 100}%`;
  const hours = Array.from({ length: Math.floor(span / 60) + 1 }, (_, i) => UNIT_OPEN + i * 60);
  const used = blocks.reduce((t, b) => t + (b.end - b.start), 0);
  const utilisation = Math.round((used / (chairs * (UNIT_CLOSE - FIRST_START))) * 100);
  const overrun = blocks.filter((b) => b.end > UNIT_CLOSE).length;
  const laneTone = Object.fromEntries(LANES.map((l) => [l.key, l.tone])) as Record<LaneKey, (typeof LANES)[number]['tone']>;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Chairs</span>
            <input
              type="number" min={1} max={40} value={chairs}
              onChange={(e) => setChairs(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
              className="h-8 w-16 rounded-md border bg-background px-2 text-sm tabular-nums"
              aria-label="Number of chairs"
            />
          </label>
          <span className="text-muted-foreground">Utilisation <span className="font-semibold tabular-nums text-foreground">{utilisation}%</span></span>
          {overrun > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" aria-hidden />{overrun} past {clock(UNIT_CLOSE)} — add a chair or move a long infusion
            </span>
          )}
          <span className="text-xs text-muted-foreground">Planned from each day&apos;s infusion and hydration times; adjust chairs to re-plan.</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[56rem]">
            <div className="grid grid-cols-[4.5rem_1fr] gap-2">
              <div />
              <div className="relative h-5">
                {hours.map((h) => (
                  <span key={h} className="absolute -translate-x-1/2 text-[11px] tabular-nums text-muted-foreground" style={{ left: pct(h) }}>{clock(h)}</span>
                ))}
                {nowVisible && (
                  <span className="absolute -translate-x-1/2 rounded bg-primary px-1.5 text-[10px] font-semibold leading-5 text-primary-foreground" style={{ left: pct(now) }}>
                    Now {clock(now)}
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              {Array.from({ length: chairs }, (_, c) => (
                <div key={c} className="grid grid-cols-[4.5rem_1fr] items-center gap-2 border-t border-border/50 first:border-t-0">
                  <div className={cn('py-1.5 text-muted-foreground tabular-nums', large ? 'text-sm' : 'text-xs')}>Chair {c + 1}</div>
                  <div className={cn('relative', large ? 'h-14' : 'h-12')}>
                    {hours.map((h) => <span key={h} className="absolute inset-y-0 w-px bg-border/40" style={{ left: pct(h) }} aria-hidden />)}
                    <span className="absolute inset-y-0 bg-muted/50" style={{ left: pct(UNIT_CLOSE), right: 0 }} aria-hidden />
                    {nowVisible && <span className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary/70" style={{ left: pct(now) }} aria-hidden />}
                    {blocks.filter((b) => b.chair === c).map((b) => {
                      const tone = colour(laneTone[b.lane]);
                      const d = b.day;
                      return (
                        <Tooltip key={d.id}>
                          <TooltipTrigger asChild>
                            <Link
                              href={d.chemo_order_id ? `/${locale}/oncology/orders/${d.chemo_order_id}` : `/${locale}/oncology/treatment-plans/${d.treatment_plan_id}`}
                              className="absolute inset-y-1 overflow-hidden rounded-md border bg-card px-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              style={{
                                left: pct(b.start), width: `calc(${pct(b.end)} - ${pct(b.start)})`,
                                borderColor: `color-mix(in oklab, ${tone} 45%, transparent)`,
                                background: `color-mix(in oklab, ${tone} ${b.lane === 'done' ? 10 : 18}%, hsl(var(--card)))`,
                                boxShadow: `inset 3px 0 0 ${tone}`,
                              }}
                              aria-label={`Chair ${c + 1}, ${clock(b.start)}–${clock(b.end)}: ${d.patientDisplay?.displayName}, ${d.protocol_code}`}
                            >
                              <div className={cn('truncate font-medium leading-tight', large ? 'pt-1.5 text-sm' : 'pt-1.5 text-xs', b.lane === 'done' && 'text-muted-foreground')}>
                                {d.patientDisplay?.displayName}
                              </div>
                              <div className={cn('truncate leading-tight text-muted-foreground', large ? 'text-xs' : 'text-[10.5px]')}>
                                {clock(b.start)} · <span className="font-mono">{d.protocol_code}</span>
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{d.patientDisplay?.displayName} · {d.patientDisplay?.mrn}</p>
                            <p className="text-xs text-muted-foreground">{d.protocol_name} — C{d.cycle_number} D{d.cycle_day}</p>
                            <p className="text-xs text-muted-foreground">{clock(b.start)}–{clock(b.end)} · {duration(b.end - b.start)} · {LANES.find((l) => l.key === b.lane)?.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/** Headline counts for the day. */
export function BoardSummary({ days, large }: { days: WorklistDay[]; large?: boolean }) {
  const counts = useMemo(() => {
    const c = { total: days.length, done: 0, infusing: 0, waiting: 0, labs: 0, oral: 0 };
    for (const d of days) {
      if (isOralOnly(d)) { c.oral += 1; continue; }
      const l = laneOf(d);
      if (l === 'done') c.done += 1;
      else if (l === 'infusing') c.infusing += 1;
      else if (l !== 'held') c.waiting += 1;
      if (labGateOf(d) === 'out_of_range' || (labGateOf(d) === 'pending' && l !== 'done')) c.labs += 1;
    }
    return c;
  }, [days]);
  const tiles: { label: string; value: number; warn?: boolean }[] = [
    { label: 'Chair patients', value: counts.total - counts.oral },
    { label: 'Done', value: counts.done },
    { label: 'Infusing now', value: counts.infusing },
    { label: 'Still to treat', value: counts.waiting },
    { label: 'Labs to clear', value: counts.labs, warn: counts.labs > 0 },
    { label: 'Oral dispenses', value: counts.oral },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-border/60 bg-card px-4 py-3">
          <div className={cn('text-muted-foreground', large ? 'text-sm' : 'text-xs')}>{t.label}</div>
          <div className={cn('mt-0.5 font-semibold tabular-nums tracking-tight', large ? 'text-4xl' : 'text-2xl', t.warn && 'text-amber-700 dark:text-amber-400')}>
            {t.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Oral-only days: dispensed at the pharmacy counter, not in a chair. */
export function OralDispensing({ days, locale, large }: { days: WorklistDay[]; locale: string; large?: boolean }) {
  const oral = days.filter(isOralOnly);
  if (oral.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {oral.map((d) => {
        const done = laneOf(d) === 'done';
        const gate = labGateOf(d);
        return (
          <li key={d.id}>
            <Link
              href={d.chemo_order_id ? `/${locale}/oncology/orders/${d.chemo_order_id}` : `/${locale}/oncology/treatment-plans/${d.treatment_plan_id}`}
              className={cn('inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring',
                large ? 'text-sm' : 'text-xs', done && 'text-muted-foreground')}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-label="Dispensed" />
                : gate === 'out_of_range' ? <AlertTriangle className="h-3.5 w-3.5 text-red-600" aria-label="Labs out of range" />
                : gate === 'pending' ? <FlaskConical className="h-3.5 w-3.5 text-amber-600" aria-label="Labs pending" />
                : <Pill className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
              <span className="font-medium">{d.patientDisplay?.displayName}</span>
              <span className="font-mono text-muted-foreground">{d.protocol_code}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
