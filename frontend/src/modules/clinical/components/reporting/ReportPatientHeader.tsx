'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <Card className="border border-transparent bg-gradient-to-r from-primary/15 via-primary/5 to-secondary/20 dark:from-primary/30 dark:via-primary/15 dark:to-secondary/35 shadow-md">
      <CardContent className="pt-5 pb-4">
        {/* Top row: back link + report type + order name + status */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/${locale}${config.backPath}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Icon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{config.label}</h2>
          {orderName && (
            <>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm text-muted-foreground font-medium">{orderName}</span>
            </>
          )}
          {reportStatus && (
            <Badge
              variant="outline"
              className={
                reportStatus === 'FINAL'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : reportStatus === 'DRAFT'
                    ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'
                    : reportStatus === 'PRELIMINARY'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                      : reportStatus === 'AMENDED'
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                        : 'capitalize'
              }
            >
              {reportStatus}
            </Badge>
          )}
          {encounter?.encounterNumber && (
            <span className="text-xs text-muted-foreground ml-auto">
              Encounter #{encounter.encounterNumber}
            </span>
          )}
        </div>

        {/* Patient info row */}
        <div className="flex flex-col gap-4 text-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">Patient</div>
              <div className="font-medium">{patientName}</div>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-10" />
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">Age</div>
              <div className="font-medium">{patientAge}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">Gender</div>
              <div className="font-medium">{patientGender}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide">MRN</div>
              <div className="font-mono">{patientMrn}</div>
            </div>
          </div>

          {triage && (
            <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start lg:text-right lg:max-w-xl lg:justify-end">
              {triageVitalsSummary.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Triage Vitals
                  </div>
                  <div className="font-medium text-xs">
                    {triageVitalsSummary.join(' \u00b7 ')}
                  </div>
                </div>
              )}
              {triageAllergiesSummary.length > 0 && (
                <>
                  {triageVitalsSummary.length > 0 && (
                    <Separator orientation="vertical" className="hidden lg:block h-10" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Allergies
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {triageAllergiesSummary.join(', ')}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
