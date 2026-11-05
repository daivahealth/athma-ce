'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CalendarRange, ClipboardList, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  usePatientCancerSummary, usePatientOncologyLabHistory, useRadiationPrescriptions, useTreatmentPlans,
} from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, EmptyState, StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';
import { useOtRequests } from '@/modules/ot/hooks/use-ot';
import { OtRequestStatusBadge, OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';
import { formatDayMonthYear } from '@/plugins/oncology/lib/treatment-day';
import { DiseaseOverview } from '@/plugins/oncology/components/cockpit/DiseaseOverview';
import { TreatmentJourney } from '@/plugins/oncology/components/cockpit/TreatmentJourney';
import { MarkerTrends, type TreatmentPeriod } from '@/plugins/oncology/components/cockpit/MarkerTrends';
import { NextUp, buildNextUp } from '@/plugins/oncology/components/cockpit/NextUp';
import { dayMs } from '@/plugins/oncology/components/cockpit/cockpit-utils';
import type {
  CancerDiagnosis, OncologyCarePlan, OncologyPatientDisplay, RadiationPrescription, TreatmentPlanSummary,
  TumorBoardCase, TumorStaging,
} from '@/plugins/oncology/types';

function Section({ title, description, actions, children, className }: {
  title: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn('rounded-xl border border-border/60 bg-card p-5', className)} aria-label={title}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

const OPEN_PLAN = ['active', 'on_hold', 'draft'];

/**
 * Patient cancer cockpit: disease overview, the treatment journey on one
 * time axis, tumour-marker trends, what is next, and the detailed history.
 */
export default function PatientCancerProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const patientId = params.patientId as string;
  const { data, isLoading } = usePatientCancerSummary(patientId);
  const { data: labHistory = [] } = usePatientOncologyLabHistory(patientId);
  const { data: otRequests = [] } = useOtRequests({ patientId });
  const { data: planData } = useTreatmentPlans({ patientId }, !!patientId);
  const { data: rxData } = useRadiationPrescriptions({ patientId });

  const treatmentPlans: TreatmentPlanSummary[] = useMemo(() => planData?.data ?? [], [planData]);
  const radiation: RadiationPrescription[] = useMemo(() => rxData?.data ?? [], [rxData]);

  const { diagnoses, stagings, tumorBoardCases, carePlans } = useMemo(() => ({
    diagnoses: (data?.diagnoses ?? []) as (CancerDiagnosis & { patientDisplay?: OncologyPatientDisplay })[],
    stagings: (data?.stagings ?? []) as TumorStaging[],
    tumorBoardCases: (data?.tumorBoardCases ?? []) as TumorBoardCase[],
    carePlans: (data?.carePlans ?? []) as OncologyCarePlan[],
  }), [data]);

  const primary = diagnoses.find((d) => d.clinical_status === 'active') ?? diagnoses[0];
  const others = diagnoses.filter((d) => d !== primary);
  const patient = diagnoses[0]?.patientDisplay;
  const forPrimary = <T extends { cancer_diagnosis_id?: string }>(rows: T[]) =>
    primary ? rows.filter((r) => !r.cancer_diagnosis_id || r.cancer_diagnosis_id === primary.id) : rows;
  const latestStaging = forPrimary(stagings)[0]; // newest first
  const plansForPrimary = forPrimary(carePlans);
  const carePlan = plansForPrimary.find((cp) => OPEN_PLAN.includes(cp.status)) ?? plansForPrimary[0];

  const surgeries = useMemo(() => otRequests.map((r) => ({
    id: r.id, date: r.preferredDate, label: r.procedureName, status: r.status,
  })), [otRequests]);
  const boards = useMemo(() => tumorBoardCases.map((b) => ({
    id: b.id, date: b.meeting_date, status: b.status, decision: b.decision ?? b.mdt_recommendation,
  })), [tumorBoardCases]);

  const periods: TreatmentPeriod[] = useMemo(() => {
    const out: TreatmentPeriod[] = [];
    for (const tp of treatmentPlans) {
      const s = dayMs(tp.start_date); const e = dayMs(tp.end_date);
      if (s != null && e != null && tp.status !== 'cancelled') out.push({ start: s, end: e, kind: 'chemotherapy' });
    }
    for (const rx of radiation) {
      const s = dayMs(rx.planned_start_date); const e = dayMs(rx.planned_end_date);
      if (s != null && e != null && rx.status !== 'CANCELLED') out.push({ start: s, end: e, kind: 'radiation' });
    }
    return out;
  }, [treatmentPlans, radiation]);

  const nextUp = useMemo(() => buildNextUp({ locale, treatmentPlans, radiation, surgeries, boards, carePlan }),
    [locale, treatmentPlans, radiation, surgeries, boards, carePlan]);

  if (isLoading) return <LoadingState />;
  if (!data || !primary) return <EmptyState message="Patient not found in oncology registry" />;

  const activePlan = treatmentPlans.find((tp) => ['active', 'on_hold'].includes(tp.status));

  return (
    <div className="space-y-6">
      {/* Patient header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Patient cancer profile</p>
          <h1 className="mt-0.5 text-2xl font-bold">{patient?.displayName ?? 'Patient'}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {patient?.mrn && <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-primary">{patient.mrn}</span>}
            {patient && (
              <span className="rounded-md bg-muted px-2 py-0.5 capitalize">
                {[patient.age != null ? `${patient.age} yrs` : null, patient.gender].filter(Boolean).join(' · ')}
              </span>
            )}
            <span className="rounded-md bg-muted px-2 py-0.5">{primary.cancer_type}</span>
            {latestStaging?.stage_group && (
              <span className="rounded-md bg-muted px-2 py-0.5">Stage <span className="font-semibold">{latestStaging.stage_group}</span></span>
            )}
            {carePlan?.treatment_intent && <TreatmentIntentBadge intent={carePlan.treatment_intent} />}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {activePlan && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/oncology/treatment-plans/${activePlan.id}`}><CalendarRange className="mr-2 h-4 w-4" />Treatment schedule</Link>
            </Button>
          )}
          {carePlan && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/oncology/care-plans/${carePlan.id}/edit`}><ClipboardList className="mr-2 h-4 w-4" />Care plan</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/oncology/timeline/${patientId}`}><History className="mr-2 h-4 w-4" />Timeline</Link>
          </Button>
        </div>
      </div>

      {others.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Also on file: {others.map((d) => `${d.cancer_type} (${d.clinical_status})`).join(', ')}
        </p>
      )}

      <DiseaseOverview diagnosis={primary} staging={latestStaging} carePlan={carePlan} locale={locale} />

      <Section title="Treatment journey" description="Every modality on one time axis — filled to the share delivered. Hover for details.">
        <TreatmentJourney
          diagnosisDate={primary.diagnosis_date}
          modalities={carePlan?.planned_modalities ?? []}
          treatmentPlans={treatmentPlans}
          radiation={radiation}
          surgeries={surgeries}
          boards={boards}
        />
      </Section>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Section title="Tumour markers" description="Trend against the upper limit of normal, with treatment periods shaded" className="lg:col-span-2">
          <MarkerTrends points={labHistory} periods={periods} />
        </Section>
        <Section title="Next up" description="Upcoming treatment, meetings and milestones">
          <NextUp items={nextUp} followUp={carePlan?.follow_up_schedule?.[0]?.type} />
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Staging history">
          {stagings.length === 0 ? <EmptyState message="No staging records found" /> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Stage</th><th className="pb-2 font-medium">TNM</th><th className="pb-2 font-medium">System</th>
              </tr></thead>
              <tbody className="divide-y">
                {stagings.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 whitespace-nowrap">{formatDayMonthYear(String(s.staging_date))}</td>
                    <td className="py-2 capitalize">{(s.staging_type || 'clinical').replace(/_/g, ' ')}</td>
                    <td className="py-2 font-semibold">{s.stage_group || '—'}</td>
                    <td className="py-2 font-mono text-xs">
                      {s.t_category || s.n_category || s.m_category ? `T${s.t_category ?? '?'} N${s.n_category ?? '?'} M${s.m_category ?? '?'}` : '—'}
                    </td>
                    <td className="py-2 text-muted-foreground">{s.staging_system}{s.staging_edition ? ` ${s.staging_edition}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="Tumour board decisions">
          {tumorBoardCases.length === 0 ? <EmptyState message="No tumor board cases found" /> : (
            <ul className="divide-y">
              {tumorBoardCases.map((c) => (
                <li key={c.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{formatDayMonthYear(String(c.meeting_date))}</span>
                    {c.treatment_intent && <TreatmentIntentBadge intent={c.treatment_intent} />}
                    <span className="ml-auto"><StatusBadge status={c.status} /></span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.mdt_recommendation || 'Awaiting discussion'}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Surgical history">
          {otRequests.length === 0 ? <EmptyState message="No OT requests on file" /> : (
            <ul className="divide-y">
              {otRequests.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0 text-sm">
                  <span className="min-w-0 flex-1 font-medium">{r.procedureName}</span>
                  <span className="text-muted-foreground">{r.preferredDate ? formatDayMonthYear(String(r.preferredDate)) : '—'}</span>
                  <OtRequestStatusBadge status={r.status} />
                  {r.reports?.length ? <OtReportStatusBadge status={r.reports[0].reportStatus} /> : null}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Care plans">
          {carePlans.length === 0 ? <EmptyState message="No care plans found" /> : (
            <ul className="divide-y">
              {carePlans.map((cp) => (
                <li key={cp.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0 text-sm">
                  <Link href={`/${locale}/oncology/care-plans/${cp.id}/edit`} className="font-mono text-xs text-primary hover:underline">{cp.plan_number}</Link>
                  <span className="text-xs text-muted-foreground">v{cp.version}</span>
                  <TreatmentIntentBadge intent={cp.treatment_intent} />
                  {cp.oncology_subspecialty && <span className="text-xs capitalize text-muted-foreground">{cp.oncology_subspecialty.replace(/_/g, ' ')}</span>}
                  <span className="ml-auto"><StatusBadge status={cp.status} /></span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
