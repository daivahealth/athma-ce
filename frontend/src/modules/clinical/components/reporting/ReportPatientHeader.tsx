'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ToneBadge } from '@/components/ui/tone-badge';
import { patientInitials } from '@/modules/clinical/components/lab-operations/lab-ui';
import { ResultStatusBadge } from './ResultStatusBadge';
import { Separator } from '@/components/ui/separator';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { useTriageByEncounter } from '@/modules/clinical/hooks/use-triage';
import type { TriageAllergy, TriageVitalSigns } from '@/modules/clinical/types/triage';
import { ArrowLeft, FlaskConical, ScanLine, Scissors } from 'lucide-react';
import type { ReportType } from '@/modules/clinical/types/reporting';

interface ReportPatientHeaderProps {
  encounterId: string;
  reportType: ReportType;
  orderName?: string;
  reportStatus?: string;
}

const reportTypeConfig: Record<ReportType, { label: string; icon: React.ElementType; backPath: string }> = {
  lab: { label: 'Lab Report', icon: FlaskConical, backPath: '/results/lab' },
  pathology: { label: 'Pathology Report', icon: FlaskConical, backPath: '/results/lab' },
  imaging: { label: 'Imaging Report', icon: ScanLine, backPath: '/results/imaging' },
  procedure: { label: 'Procedure Report', icon: Scissors, backPath: '/results/procedure' },
};

function formatAge(date?: string | null) {
  if (!date) return '-';
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return '-';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return `${age} yrs`;
}

const formatNumeric = (value: number) => (Number.isInteger(value) ? `${value}` : value.toFixed(1));
const isValidNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function summarizeVitals(vitals?: TriageVitalSigns | null) {
  if (!vitals) return [] as string[];
  const parts: string[] = [];
  if (isValidNumber(vitals.temperature)) {
    const unit = vitals.temperatureUnit === 'fahrenheit' ? '\u00b0F' : '\u00b0C';
    parts.push(`Temp ${formatNumeric(vitals.temperature)}${unit}`);
  }
  if (isValidNumber(vitals.heartRate)) {
    parts.push(`HR ${formatNumeric(vitals.heartRate)} bpm`);
  }
  if (isValidNumber(vitals.systolicBP) || isValidNumber(vitals.diastolicBP)) {
    const systolic = isValidNumber(vitals.systolicBP) ? formatNumeric(vitals.systolicBP) : '-';
    const diastolic = isValidNumber(vitals.diastolicBP) ? formatNumeric(vitals.diastolicBP) : '-';
    parts.push(`BP ${systolic}/${diastolic}`);
  }
  if (isValidNumber(vitals.respiratoryRate)) {
    parts.push(`RR ${formatNumeric(vitals.respiratoryRate)} rpm`);
  }
  if (isValidNumber(vitals.oxygenSaturation)) {
    parts.push(`SpO2 ${formatNumeric(vitals.oxygenSaturation)}%`);
  }
  if (isValidNumber(vitals.weight)) {
    const unit = vitals.weightUnit === 'lbs' ? 'lb' : 'kg';
    parts.push(`Wt ${formatNumeric(vitals.weight)} ${unit}`);
  }
  if (isValidNumber(vitals.height)) {
    const unit = vitals.heightUnit === 'in' ? 'in' : 'cm';
    parts.push(`Ht ${formatNumeric(vitals.height)} ${unit}`);
  }
  return parts;
}

function summarizeAllergies(allergies?: TriageAllergy[] | null) {
  if (!allergies || allergies.length === 0) return [] as string[];
  return allergies
    .filter((allergy) => allergy.allergen?.trim())
    .map((allergy) => {
      const severity = allergy.severity?.trim();
      const reaction = allergy.reaction?.trim();
      if (severity && reaction) return `${allergy.allergen} (${severity}, ${reaction})`;
      if (severity) return `${allergy.allergen} (${severity})`;
      if (reaction) return `${allergy.allergen} (${reaction})`;
      return allergy.allergen;
    });
}

export function ReportPatientHeader({
  encounterId,
  reportType,
  orderName,
  reportStatus,
}: ReportPatientHeaderProps) {
  const params = useParams();
  const locale = params.locale as string;
  const config = reportTypeConfig[reportType];
  const Icon = config.icon;

  const { data: encounter } = useEncounter(encounterId);
  const { data: triage } = useTriageByEncounter(encounterId);

  const triageVitalsSummary = useMemo(() => summarizeVitals(triage?.vitalSigns), [triage?.vitalSigns]);
  const triageAllergiesSummary = useMemo(() => summarizeAllergies(triage?.allergies), [triage?.allergies]);

  const patientDisplay = encounter?.patientDisplay;
  const patient = encounter?.patient;
  const patientName =
    patientDisplay?.displayName?.trim() ||
    patient?.fullName?.trim() ||
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    'Loading...';
  const patientAge = patientDisplay?.age != null ? `${patientDisplay.age} yrs` : formatAge(patient?.dateOfBirth);
  const patientGender = patientDisplay?.gender
    ? patientDisplay.gender[0].toUpperCase() + patientDisplay.gender.slice(1)
    : patient?.gender
      ? patient.gender[0].toUpperCase() + patient.gender.slice(1)
      : '-';
  const patientMrn = patientDisplay?.mrn ?? patient?.mrn ?? '-';

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-card shadow-sm dark:from-primary/20">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            href={`/${locale}${config.backPath}`}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground print:hidden"
            aria-label={`Back to ${config.label.replace(' Report', '')} results`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-semibold tracking-tight">{config.label}</h2>
          {orderName && (
            <>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm font-medium text-muted-foreground">{orderName}</span>
            </>
          )}
          {reportStatus && <ResultStatusBadge status={reportStatus} />}
          {encounter?.encounterNumber && (
            <span className="ml-auto rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-xs text-muted-foreground">
              Encounter <span className="font-mono text-foreground/80">{encounter.encounterNumber}</span>
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              {patientInitials(patientName)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xl font-semibold leading-tight text-foreground">{patientName}</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span>{patientAge}</span>
                <span aria-hidden="true">·</span>
                <span>{patientGender}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-foreground/80">{patientMrn}</span>
              </div>
            </div>
          </div>

          {triage && (triageVitalsSummary.length > 0 || triageAllergiesSummary.length > 0) && (
            <div className="flex flex-col gap-2 lg:items-end">
              {triageVitalsSummary.length > 0 && (
                <div className="flex flex-wrap gap-1.5 lg:justify-end" aria-label="Triage vitals">
                  {triageVitalsSummary.map((vital) => (
                    <span
                      key={vital}
                      className="rounded-md border border-border/60 bg-background/70 px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {vital}
                    </span>
                  ))}
                </div>
              )}
              {triageAllergiesSummary.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Allergies</span>
                  {triageAllergiesSummary.map((allergy) => (
                    <ToneBadge key={allergy} tone="red">
                      {allergy}
                    </ToneBadge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
