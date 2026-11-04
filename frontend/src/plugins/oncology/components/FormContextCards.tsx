'use client';

import type { ReactNode } from 'react';
import { Dna, Search, User, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/plugins/oncology/components/shared';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

/**
 * The patient and cancer-diagnosis context shown at the top of the oncology
 * create/edit pages: a picker while nothing is chosen, a summary card once it
 * is. Colours come from the theme tokens (`primary`, `warning`, `muted`) and
 * the oncology status tone map, so the cards match `/patients/new`.
 */

export interface PatientSummary {
  name: string;
  mrn?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  phone?: string | null;
}

export interface DiagnosisSummary {
  cancerType?: string | null;
  primarySite?: string | null;
  primarySiteCode?: string | null;
  laterality?: string | null;
  diagnosisDate?: string | null;
  metastaticStatus?: string | null;
  clinicalStatus?: string | null;
  icdCode?: string | null;
  grade?: string | null;
  histology?: string | null;
}

/** A patient as returned by `PatientSearchSelect`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- PatientSearchSelect's own contract is `any`
export function patientFromSearch(p: any): PatientSummary {
  return {
    name: p.fullName || `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || '—',
    mrn: p.mrn,
    dateOfBirth: p.dateOfBirth,
    gender: p.gender,
    phone: p.phoneNumber,
  };
}

/** The `patient_*` columns the oncology read models carry. */
export function patientFromRecord(r: {
  patient_display_name?: string | null;
  patient_first_name?: string | null;
  patient_last_name?: string | null;
  patient_mrn?: string | null;
  patient_date_of_birth?: string | null;
  patient_gender?: string | null;
  patient_phone_number?: string | null;
}): PatientSummary {
  return {
    name: r.patient_display_name || `${r.patient_first_name ?? ''} ${r.patient_last_name ?? ''}`.trim() || '—',
    mrn: r.patient_mrn,
    dateOfBirth: r.patient_date_of_birth,
    gender: r.patient_gender,
    phone: r.patient_phone_number,
  };
}

export function diagnosisFromCancerDiagnosis(d: CancerDiagnosis): DiagnosisSummary {
  return {
    cancerType: d.cancer_type,
    primarySite: d.primary_site,
    primarySiteCode: d.primary_site_code,
    laterality: d.laterality,
    diagnosisDate: d.diagnosis_date,
    metastaticStatus: d.metastatic_status,
    clinicalStatus: d.clinical_status,
    grade: d.grade,
    histology: d.histology_morphology,
  };
}

const ageFrom = (dob?: string | null) =>
  dob ? Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000) : null;

const CHIP = 'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs';
const NEUTRAL_CHIP = cn(CHIP, 'border-border bg-muted/50 text-muted-foreground');
const PRIMARY_CHIP = cn(CHIP, 'border-primary/20 bg-primary/10 font-medium text-primary');
const WARNING_CHIP = cn(CHIP, 'border-warning/30 bg-warning/10 font-medium capitalize text-warning');

function ContextCard({
  icon: Icon,
  label,
  action,
  children,
}: {
  icon: LucideIcon;
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="hover:translate-y-0">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

const changeButton = (onClick: () => void) => (
  <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={onClick}>
    Change
  </Button>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- PatientSearchSelect's own contract is `any`
export function PatientPickerCard({ onSelect, onClear }: { onSelect: (p: any) => void; onClear: () => void }) {
  return (
    <ContextCard icon={Search} label="Select Patient">
      <PatientSearchSelect required selectedPatient={null} onSelect={onSelect} onClear={onClear} />
    </ContextCard>
  );
}

export function PatientContextCard({ patient, onChange }: { patient: PatientSummary; onChange?: () => void }) {
  const age = ageFrom(patient.dateOfBirth);
  return (
    <ContextCard icon={User} label="Patient" action={onChange && changeButton(onChange)}>
      <p className="text-base font-semibold leading-tight text-foreground">{patient.name}</p>
      <div className="flex flex-wrap gap-2">
        {patient.mrn && <span className={cn(PRIMARY_CHIP, 'font-mono')}>{patient.mrn}</span>}
        {age !== null && <span className={NEUTRAL_CHIP}>{age} yrs</span>}
        {patient.gender && <span className={cn(NEUTRAL_CHIP, 'capitalize')}>{patient.gender}</span>}
        {patient.phone && <span className={NEUTRAL_CHIP}>{patient.phone}</span>}
      </div>
    </ContextCard>
  );
}

export function DiagnosisContextCard({ diagnosis: d, onChange }: { diagnosis: DiagnosisSummary; onChange?: () => void }) {
  return (
    <ContextCard icon={Dna} label="Cancer Diagnosis" action={onChange && changeButton(onChange)}>
      <p className="text-base font-semibold leading-tight text-foreground">{d.cancerType}</p>
      <div className="flex flex-wrap items-center gap-2">
        {d.primarySite && (
          <span className={PRIMARY_CHIP}>
            {d.primarySite}
            {d.primarySiteCode && <span className="font-mono opacity-70">({d.primarySiteCode})</span>}
          </span>
        )}
        {d.laterality && d.laterality !== 'not_applicable' && (
          <span className={cn(NEUTRAL_CHIP, 'capitalize')}>{d.laterality}</span>
        )}
        {d.diagnosisDate && <span className={NEUTRAL_CHIP}>Dx {new Date(d.diagnosisDate).toLocaleDateString()}</span>}
        {d.metastaticStatus && d.metastaticStatus !== 'unknown' && (
          <span className={WARNING_CHIP}>{d.metastaticStatus}</span>
        )}
        {d.clinicalStatus && <StatusBadge status={d.clinicalStatus} />}
        {d.icdCode && <span className={cn(NEUTRAL_CHIP, 'font-mono')}>{d.icdCode}</span>}
        {d.grade && (
          <span className={NEUTRAL_CHIP}>
            <span className="opacity-70">Grade</span>
            <span className="font-medium text-foreground">{d.grade}</span>
          </span>
        )}
        {d.histology && (
          <span className={NEUTRAL_CHIP}>
            <span className="opacity-70">Histology</span>
            <span className="font-medium text-foreground">{d.histology}</span>
          </span>
        )}
      </div>
    </ContextCard>
  );
}

/** Shown when the chosen patient has no diagnosis picked yet (none, or several active ones). */
export function DiagnosisPickerCard({
  diagnoses,
  loading,
  onPick,
  onAddNew,
}: {
  diagnoses: CancerDiagnosis[];
  loading: boolean;
  onPick: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <ContextCard icon={Dna} label="Select Cancer Diagnosis">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
      ) : diagnoses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No active cancer diagnoses found.{' '}
          <button type="button" className="text-primary underline" onClick={onAddNew}>
            Add one first
          </button>
        </p>
      ) : (
        <div className="space-y-2">
          {diagnoses.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onPick(d.id)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="font-semibold text-foreground">{d.cancer_type}</div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                <span>
                  {d.primary_site}
                  {d.primary_site_code && <span className="ml-1 font-mono">({d.primary_site_code})</span>}
                </span>
                <span>Dx {new Date(d.diagnosis_date).toLocaleDateString()}</span>
                {d.grade && <span>{d.grade}</span>}
              </div>
              {d.histology_morphology && <div className="mt-0.5 text-xs text-muted-foreground">{d.histology_morphology}</div>}
            </button>
          ))}
        </div>
      )}
    </ContextCard>
  );
}
