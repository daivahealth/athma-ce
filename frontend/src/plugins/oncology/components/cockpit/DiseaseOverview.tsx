'use client';

import Link from 'next/link';
import { Activity, Dna, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';
import { treatmentModalityTone } from '@/plugins/oncology/lib/oncology-tone';
import type { CancerDiagnosis, OncologyCarePlan, PlannedModality, TumorStaging } from '@/plugins/oncology/types';
import { formatDayMs, dayMs, useChartColour } from './cockpit-utils';

function Panel({ icon: Icon, label, children, className }: { icon: LucideIcon; label: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-xl border border-border/60 bg-card p-5', className)} aria-label={label}>
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />{label}
      </div>
      {children}
    </section>
  );
}

const ROMAN = ['I', 'II', 'III', 'IV'] as const;

/** 1-4 for a stage group that is (or contains) a roman stage, else null. */
function stageLevel(group?: string | null): number | null {
  if (!group) return null;
  const m = group.toUpperCase().match(/(?:^|[\s-])(IV|III|II|I)(?=[A-C]?\d?\b|[A-C]|$)/) ?? group.toUpperCase().match(/^(IV|III|II|I)/);
  return m ? ROMAN.indexOf(m[1] as (typeof ROMAN)[number]) + 1 : null;
}

/** c / p prefix for a TNM category. M stays clinical (cM0) unless metastasis is pathologically proven. */
const tnmPrefix = (type: string | undefined, k: 'T' | 'N' | 'M', v: string) =>
  type === 'pathological' && (k !== 'M' || v.startsWith('1')) ? 'p' : 'c';

const bio = (b: unknown): [string, string][] =>
  b && typeof b === 'object' ? Object.entries(b as Record<string, unknown>).map(([k, v]) => [k, String(v)]) : [];

export function DiseaseOverview({ diagnosis: d, staging: s, carePlan: cp, locale }: {
  diagnosis: CancerDiagnosis;
  staging?: TumorStaging | null;
  carePlan?: OncologyCarePlan | null;
  locale: string;
}) {
  const colour = useChartColour();
  const level = stageLevel(s?.stage_group);
  const biomarkers = bio(d.biomarkers);
  const modalities: PlannedModality[] = [...(cp?.planned_modalities ?? [])].sort((a, b) => a.sequence - b.sequence);
  const done = modalities.filter((m) => m.status === 'completed').length;
  const dx = dayMs(d.diagnosis_date);
  const stageColour = colour('rose');

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel icon={Dna} label="Diagnosis">
        <h2 className="text-lg font-semibold leading-snug">{d.cancer_type}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {d.primary_site}{d.laterality && d.laterality !== 'not_applicable' ? ` · ${d.laterality}` : ''}
        </p>
        <p className="mt-2 text-sm">
          {d.histology_morphology}
          {d.grade && !/^not applicable$/i.test(d.grade) && <span className="text-muted-foreground"> · {d.grade}</span>}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {d.icd_code && <span className="rounded-md bg-muted px-2 py-0.5 font-mono">{d.icd_code}</span>}
          {d.morphology_code && <span className="rounded-md bg-muted px-2 py-0.5 font-mono">{d.morphology_code}</span>}
          {dx != null && <span className="rounded-md bg-muted px-2 py-0.5">Dx {formatDayMs(dx)}</span>}
        </div>
        {biomarkers.length > 0 && (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-sm">
            {biomarkers.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Panel>

      <Panel icon={Layers} label="Stage">
        {s ? (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-semibold leading-none tracking-tight">{s.stage_group ?? '—'}</div>
                <div className="mt-2 text-xs text-muted-foreground capitalize">
                  {s.staging_type} · {s.staging_system}{s.staging_edition ? ` ${s.staging_edition}` : ''}
                </div>
              </div>
              {level != null && (
                <div className="flex items-end gap-1" role="img" aria-label={`Stage ${ROMAN[level - 1]} of IV`}>
                  {ROMAN.map((r, i) => (
                    <div key={r} className="flex flex-col items-center gap-1">
                      <span
                        className="w-5 rounded-[3px]"
                        style={{
                          height: 10 + i * 7,
                          background: i < level ? `color-mix(in oklab, ${stageColour} ${30 + i * 23}%, transparent)` : 'hsl(var(--muted))',
                        }}
                      />
                      <span className={cn('text-[10px]', i + 1 === level ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(s.t_category || s.n_category || s.m_category) && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {([['T', s.t_category], ['N', s.n_category], ['M', s.m_category]] as const).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-muted/60 px-3 py-2 text-center">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
                    <div className="font-mono text-base font-semibold">{v ? `${tnmPrefix(s.staging_type, k, v)}${k}${v}` : '—'}</div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Staged {formatDayMs(dayMs(s.staging_date) ?? 0)}{s.notes ? ` · ${s.notes}` : ''}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Not staged yet.</p>
        )}
      </Panel>

      <Panel icon={Activity} label="Status">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={d.clinical_status} />
          {d.metastatic_status && d.metastatic_status !== 'unknown' && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{d.metastatic_status}</span>
          )}
          {d.ecog_at_diagnosis != null && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">ECOG {d.ecog_at_diagnosis}</span>}
        </div>
        {cp ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <TreatmentIntentBadge intent={cp.treatment_intent} />
              <span className="text-muted-foreground">intent ·</span>
              <Link href={`/${locale}/oncology/care-plans/${cp.id}/edit`} className="font-mono text-xs text-primary hover:underline">{cp.plan_number}</Link>
              <StatusBadge status={cp.status} />
            </div>
            {modalities.length > 0 && (
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Treatment plan</span><span className="tabular-nums">{done} of {modalities.length} steps done</span>
                </div>
                <div className="flex gap-0.5" role="img" aria-label={modalities.map((m) => `${m.modality} ${m.status.replace(/_/g, ' ')}`).join(', ')}>
                  {modalities.map((m) => {
                    const c = colour(treatmentModalityTone(m.modality));
                    return (
                      <span key={`${m.modality}-${m.sequence}`} className="h-2 flex-1 overflow-hidden rounded-[3px]" style={{ background: `color-mix(in oklab, ${c} 22%, transparent)` }} title={`${m.modality}: ${m.status.replace(/_/g, ' ')}`}>
                        <span className="block h-full" style={{ width: m.status === 'completed' ? '100%' : m.status === 'in_progress' ? '50%' : '0%', background: c }} />
                      </span>
                    );
                  })}
                </div>
                <ol className="mt-2 space-y-1 text-xs">
                  {modalities.map((m) => (
                    <li key={`${m.modality}-${m.sequence}-l`} className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: colour(treatmentModalityTone(m.modality)) }} aria-hidden />
                      <span className="truncate first-letter:uppercase">{m.details ?? m.modality}</span>
                      <span className="ml-auto shrink-0 text-muted-foreground">{m.status.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No care plan yet — awaiting tumour board.</p>
        )}
      </Panel>
    </div>
  );
}
