'use client';

import Link from 'next/link';
import { CalendarClock, Flag, Radiation, Scissors, Syringe, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OncologyCarePlan, RadiationPrescription, TreatmentPlanSummary } from '@/plugins/oncology/types';
import { dayMs, formatDayMs, relativeDay, todayMs } from './cockpit-utils';

export interface NextUpItem {
  id: string;
  at: number;
  icon: LucideIcon;
  title: string;
  detail?: string;
  href?: string;
}

/** What is coming for this patient, soonest first. */
export function buildNextUp(input: {
  locale: string;
  treatmentPlans: TreatmentPlanSummary[];
  radiation: RadiationPrescription[];
  surgeries: { id: string; date: string | null | undefined; label: string; status: string }[];
  boards: { id: string; date: string; status: string }[];
  carePlan?: OncologyCarePlan | null;
}): NextUpItem[] {
  const today = todayMs();
  const items: NextUpItem[] = [];

  for (const tp of input.treatmentPlans) {
    const at = dayMs(tp.next_date);
    if (at == null || at < today || !['active', 'on_hold'].includes(tp.status)) continue;
    items.push({
      id: `tp-${tp.id}`, at, icon: Syringe,
      title: tp.status === 'on_hold' ? `${tp.protocol_code} — on hold` : `${tp.protocol_code} · cycle ${tp.current_cycle ?? '—'} of ${tp.total_cycles}`,
      detail: tp.protocol_name,
      href: `/${input.locale}/oncology/treatment-plans/${tp.id}`,
    });
  }

  for (const rx of input.radiation) {
    const start = dayMs(rx.planned_start_date);
    if (start == null) continue;
    if (rx.status === 'ACTIVE') {
      const next = (rx.delivered_fractions ?? 0) + 1;
      if (rx.planned_fractions && next > rx.planned_fractions) continue;
      items.push({
        id: `rx-${rx.id}`, at: Math.max(today, start), icon: Radiation,
        title: `Radiotherapy · fraction ${next} of ${rx.planned_fractions ?? '—'}`,
        detail: [rx.technique, rx.total_dose_gy != null ? `${Number(rx.total_dose_gy)} Gy` : null].filter(Boolean).join(' · ') || undefined,
        href: `/${input.locale}/oncology/radiation/${rx.id}`,
      });
    } else if (['APPROVED', 'DRAFT'].includes(rx.status) && start >= today) {
      items.push({
        id: `rx-${rx.id}`, at: start, icon: Radiation, title: 'Radiotherapy starts',
        detail: [rx.technique, rx.total_dose_gy != null ? `${Number(rx.total_dose_gy)} Gy / ${rx.planned_fractions} fx` : null].filter(Boolean).join(' · ') || undefined,
        href: `/${input.locale}/oncology/radiation/${rx.id}`,
      });
    }
  }

  for (const s of input.surgeries) {
    const at = dayMs(s.date);
    if (at == null || at < today || ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(s.status)) continue;
    items.push({ id: `ot-${s.id}`, at, icon: Scissors, title: 'Surgery', detail: s.label });
  }

  for (const b of input.boards) {
    const at = dayMs(b.date);
    if (at == null || at < today || !['scheduled', 'in_review'].includes(b.status)) continue;
    items.push({ id: `tb-${b.id}`, at, icon: UsersRound, title: 'Multidisciplinary tumour board', href: `/${input.locale}/oncology/tumor-board/${b.id}/edit` });
  }

  for (const m of input.carePlan?.milestones ?? []) {
    const at = dayMs(m.targetDate);
    if (at == null || at < today || m.status === 'completed') continue;
    items.push({ id: `ms-${m.name}-${m.targetDate}`, at, icon: Flag, title: m.name, detail: 'Care-plan milestone' });
  }

  return items.sort((a, b) => a.at - b.at);
}

export function NextUp({ items, followUp }: { items: NextUpItem[]; followUp?: string | null }) {
  const today = todayMs();
  if (items.length === 0) {
    return (
      <div className="flex items-start gap-3 text-sm text-muted-foreground">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>Nothing scheduled.{followUp ? ` Follow-up per plan: ${followUp}.` : ''}</p>
      </div>
    );
  }
  return (
    <ol className="space-y-1">
      {items.slice(0, 6).map((it) => {
        const isToday = it.at === today;
        const Icon = it.icon;
        const body = (
          <div className={cn('flex items-start gap-3 rounded-lg px-2.5 py-2 transition-colors', it.href && 'hover:bg-muted/60', isToday && 'bg-primary/5')}>
            <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium">{it.title}</span>
                <span className={cn('shrink-0 text-xs tabular-nums', isToday ? 'font-semibold text-primary' : 'text-muted-foreground')} title={formatDayMs(it.at)}>
                  {relativeDay(it.at, today)}
                </span>
              </div>
              {it.detail && <div className="truncate text-xs text-muted-foreground">{it.detail}</div>}
            </div>
          </div>
        );
        return <li key={it.id}>{it.href ? <Link href={it.href} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">{body}</Link> : body}</li>;
      })}
    </ol>
  );
}
