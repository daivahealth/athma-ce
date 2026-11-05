'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
import { treatmentModalityTone } from '@/plugins/oncology/lib/oncology-tone';
import type { PlannedModality, RadiationPrescription, TreatmentModality, TreatmentPlanSummary } from '@/plugins/oncology/types';
import {
  addDaysMs, dayMs, formatDayMs, formatMonthMs, formatShortMs, monthTicks, todayMs, useChartColour,
} from './cockpit-utils';

interface JourneyItem {
  id: string;
  start: number;
  /** null = ongoing (runs to the edge of the chart). */
  end: number | null;
  kind: 'bar' | 'point';
  /** 0..1 of the bar done; undefined when not measured. */
  progress?: number;
  /** Not yet started and only planned on the care plan. */
  planned?: boolean;
  label: string;
  details: string[];
}

interface JourneyLane {
  modality: TreatmentModality;
  title: string;
  summary?: string;
  items: JourneyItem[];
}

interface JourneyMarker { id: string; at: number; label: string; detail?: string }

export interface TreatmentJourneyProps {
  diagnosisDate?: string | null;
  modalities: PlannedModality[];
  treatmentPlans: TreatmentPlanSummary[];
  radiation: RadiationPrescription[];
  surgeries: { id: string; date: string | null | undefined; label: string; status: string }[];
  boards: { id: string; date: string; status: string; decision?: string | null }[];
}

const LANE_ORDER: TreatmentModality[] = ['surgery', 'chemotherapy', 'radiation', 'immunotherapy', 'targeted', 'hormonal', 'palliative', 'surveillance'];
const LANE_TITLE: Record<TreatmentModality, string> = {
  surgery: 'Surgery', chemotherapy: 'Chemotherapy', radiation: 'Radiotherapy', immunotherapy: 'Immunotherapy',
  targeted: 'Targeted therapy', hormonal: 'Endocrine therapy', palliative: 'Palliative care', surveillance: 'Surveillance',
};

function buildLanes(p: TreatmentJourneyProps): JourneyLane[] {
  const lanes = new Map<TreatmentModality, JourneyLane>();
  const lane = (m: TreatmentModality) => {
    if (!lanes.has(m)) lanes.set(m, { modality: m, title: LANE_TITLE[m] ?? m, items: [] });
    return lanes.get(m)!;
  };

  // Surgery: OT bookings, else the care plan's planned surgery.
  for (const s of p.surgeries) {
    const at = dayMs(s.date);
    if (at == null) continue;
    lane('surgery').items.push({
      id: s.id, start: at, end: at, kind: 'point', label: s.label,
      details: [formatDayMs(at), s.status.replace(/_/g, ' ').toLowerCase()],
    });
  }

  // Chemotherapy: treatment schedules, with cycle progress.
  for (const tp of p.treatmentPlans) {
    const start = dayMs(tp.start_date);
    if (start == null || tp.status === 'cancelled') continue;
    const end = dayMs(tp.end_date) ?? start;
    const done = tp.completed_cycles ?? 0;
    const l = lane('chemotherapy');
    l.items.push({
      id: tp.id, start, end, kind: 'bar', label: tp.protocol_code,
      progress: tp.total_cycles ? done / tp.total_cycles : undefined,
      details: [
        tp.protocol_name,
        `${formatDayMs(start)} → ${formatDayMs(end)}`,
        tp.current_cycle ? `Cycle ${tp.current_cycle} of ${tp.total_cycles} · ${done} done` : `${tp.total_cycles} cycles complete`,
        tp.status === 'on_hold' ? 'On hold' : '',
      ].filter(Boolean),
    });
    l.summary = tp.current_cycle ? `${tp.protocol_code} · C${tp.current_cycle} of ${tp.total_cycles}` : `${tp.protocol_code} · complete`;
  }

  // Radiotherapy: prescriptions, with fractions delivered.
  for (const rx of p.radiation) {
    const start = dayMs(rx.planned_start_date);
    if (start == null || rx.status === 'CANCELLED') continue;
    const end = dayMs(rx.planned_end_date) ?? addDaysMs(start, Math.ceil(((rx.planned_fractions ?? 5) * 7) / 5));
    const planned = rx.planned_fractions ?? 0;
    const delivered = rx.delivered_fractions ?? 0;
    const l = lane('radiation');
    const dose = rx.total_dose_gy != null ? `${Number(rx.total_dose_gy)} Gy / ${planned} fx` : `${planned} fx`;
    l.items.push({
      id: rx.id, start, end, kind: 'bar', label: dose,
      progress: planned ? delivered / planned : undefined,
      details: [
        [rx.technique, dose].filter(Boolean).join(' · '),
        `${formatDayMs(start)} → ${formatDayMs(end)}`,
        `${delivered} of ${planned} fractions delivered`,
      ],
    });
    l.summary = `${delivered}/${planned} fractions`;
  }

  // Everything else (and anything only planned so far) from the care plan.
  for (const m of p.modalities) {
    const start = dayMs(m.startDate);
    if (start == null) continue;
    const covered = (m.modality === 'surgery' && p.surgeries.length > 0)
      || (m.modality === 'chemotherapy' && p.treatmentPlans.length > 0)
      || (m.modality === 'radiation' && p.radiation.length > 0);
    if (covered) continue;
    const end = dayMs(m.endDate);
    const ongoing = !end && ['hormonal', 'targeted', 'immunotherapy', 'surveillance', 'palliative'].includes(m.modality);
    const point = m.modality === 'surgery';
    const l = lane(m.modality);
    l.items.push({
      id: `${m.modality}-${m.sequence}`, start, end: point ? start : (ongoing ? null : (end ?? start)),
      kind: point ? 'point' : 'bar', planned: m.status === 'planned',
      label: m.protocolCode ?? m.details ?? LANE_TITLE[m.modality],
      details: [m.details ?? '', `${formatDayMs(start)}${end ? ` → ${formatDayMs(end)}` : ongoing ? ' → ongoing' : ''}`, m.status.replace(/_/g, ' ')].filter(Boolean),
    });
    if (!l.summary) l.summary = m.status === 'in_progress' ? 'ongoing' : m.status.replace(/_/g, ' ');
  }

  return LANE_ORDER.map((m) => lanes.get(m)).filter((l): l is JourneyLane => !!l && l.items.length > 0);
}

/**
 * The patient's whole treatment on one time axis: one lane per modality,
 * bars filled to the share done (cycles, fractions), today line, and
 * diagnosis / tumour-board markers above.
 */
export function TreatmentJourney(props: TreatmentJourneyProps) {
  const colour = useChartColour();
  const today = todayMs();
  const lanes = useMemo(() => buildLanes(props), [props]);

  const markers: JourneyMarker[] = useMemo(() => {
    const out: JourneyMarker[] = [];
    const dx = dayMs(props.diagnosisDate);
    if (dx != null) out.push({ id: 'dx', at: dx, label: 'Diagnosis', detail: formatDayMs(dx) });
    for (const b of props.boards) {
      const at = dayMs(b.date);
      if (at != null) out.push({ id: b.id, at, label: b.status === 'completed' ? 'Tumour board' : 'Tumour board (scheduled)', detail: b.decision ?? formatDayMs(at) });
    }
    return out;
  }, [props.diagnosisDate, props.boards]);

  const { start, end } = useMemo(() => {
    const times = [today, ...markers.map((m) => m.at)];
    for (const l of lanes) for (const i of l.items) { times.push(i.start); if (i.end != null) times.push(i.end); }
    const lo = Math.min(...times);
    const hi = Math.max(...times);
    const pad = Math.max(10, Math.round((hi - lo) / 86_400_000 / 20));
    return { start: addDaysMs(lo, -pad), end: addDaysMs(Math.max(hi, addDaysMs(today, 30)), pad) };
  }, [lanes, markers, today]);

  if (lanes.length === 0 && markers.length <= 1) {
    return <p className="text-sm text-muted-foreground">No treatment recorded yet — the journey appears once a care plan, schedule or radiotherapy is in place.</p>;
  }

  const span = end - start;
  const pct = (t: number) => `${((t - start) / span) * 100}%`;
  const ticks = monthTicks(start, end);
  const showYear = (t: number, i: number) => i === 0 || new Date(t).getUTCMonth() === 0;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-1" role="img" aria-label={`Treatment journey: ${lanes.map((l) => `${l.title}${l.summary ? ` (${l.summary})` : ''}`).join(', ')}`}>
        {/* Month axis + markers */}
        <div className="grid grid-cols-[9.5rem_1fr] items-end gap-3">
          <div />
          <div className="relative h-9">
            {ticks.map((t, i) => (
              <span key={t} className="absolute bottom-0 -translate-x-1/2 text-[11px] text-muted-foreground tabular-nums" style={{ left: pct(t) }}>
                {formatMonthMs(t, showYear(t, i))}
              </span>
            ))}
            <span className="pointer-events-none absolute bottom-[-6px] h-2 w-0.5 -translate-x-1/2 rounded-full bg-primary" style={{ left: pct(today) }} aria-hidden />
            {markers.map((m) => (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="absolute top-0 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-2 border-background bg-foreground/70 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ left: pct(m.at) }}
                    aria-label={`${m.label}, ${formatDayMs(m.at)}`}
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium">{m.label}</p>
                  {m.detail && <p className="text-xs text-muted-foreground">{m.detail}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {lanes.length === 0 && (
          <p className="py-3 pl-[10.25rem] text-sm text-muted-foreground">No treatment started yet — the plan follows the tumour board.</p>
        )}

        {/* Lanes */}
        <div className="relative">
          {lanes.map((l) => {
            const tone: BadgeTone = treatmentModalityTone(l.modality);
            const c = colour(tone);
            return (
              <div key={l.modality} className="grid grid-cols-[9.5rem_1fr] items-center gap-3 border-t border-border/50 py-2.5 first:border-t-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c }} aria-hidden />
                    <span className="truncate">{l.title}</span>
                  </div>
                  {l.summary && <div className="pl-[1.125rem] text-xs text-muted-foreground truncate">{l.summary}</div>}
                </div>
                <div className="relative h-9">
                  {ticks.map((t) => (
                    <span key={t} className="absolute inset-y-0 w-px bg-border/40" style={{ left: pct(t) }} aria-hidden />
                  ))}
                  {l.items.map((it) => {
                    const left = pct(it.start);
                    if (it.kind === 'point') {
                      return (
                        <Tooltip key={it.id}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={cn('absolute bottom-0.5 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-[3px] border-2 border-background outline-none focus-visible:ring-2 focus-visible:ring-ring', it.planned && 'opacity-50')}
                              style={{ left, background: c }}
                              aria-label={`${it.label}, ${it.details.join(', ')}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{it.label}</p>
                            {it.details.map((d) => <p key={d} className="text-xs text-muted-foreground">{d}</p>)}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    const endAt = it.end ?? end;
                    const width = `max(8px, calc(${((endAt - it.start) / span) * 100}% ))`;
                    const done = it.progress ?? (it.planned ? 0 : (today >= endAt ? 1 : Math.max(0, Math.min(1, (today - it.start) / Math.max(1, endAt - it.start)))));
                    return (
                      <Tooltip key={it.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="group absolute inset-y-0 flex flex-col justify-end text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[4px]"
                            style={{ left, width }}
                            aria-label={`${l.title} ${it.label}: ${it.details.join(', ')}`}
                          >
                            <span
                              className={cn('mb-1 whitespace-nowrap text-[11px] font-medium leading-none text-muted-foreground group-hover:text-foreground',
                                (it.start - start) / span > 0.6 && 'self-end')}
                            >
                              {it.label}
                            </span>
                            <span
                              className="relative block h-2.5 w-full overflow-hidden rounded-[4px]"
                              style={{
                                background: it.planned ? 'transparent' : `color-mix(in oklab, ${c} 26%, transparent)`,
                                boxShadow: it.planned ? `inset 0 0 0 1.5px ${c}` : undefined,
                                maskImage: it.end == null ? 'linear-gradient(to right, black 75%, transparent)' : undefined,
                              }}
                            >
                              <span className="absolute inset-y-0 left-0 rounded-[4px]" style={{ width: `${done * 100}%`, background: c }} />
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium">{it.label}</p>
                          {it.details.map((d) => <p key={d} className="text-xs text-muted-foreground">{d}</p>)}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  <span className="pointer-events-none absolute bottom-[-3px] h-4 w-0.5 -translate-x-1/2 rounded-full bg-primary" style={{ left: pct(today) }} aria-hidden />
                </div>
              </div>
            );
          })}

          {/* Today */}
          <div className="pointer-events-none absolute inset-y-0 grid w-full grid-cols-[9.5rem_1fr] gap-3" aria-hidden>
            <div />
            <div className="relative">
              <span className="absolute -bottom-5 -translate-x-1/2 rounded bg-primary px-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground" style={{ left: pct(today) }}>
                Today · {formatShortMs(today)}
              </span>
            </div>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </TooltipProvider>
  );
}
