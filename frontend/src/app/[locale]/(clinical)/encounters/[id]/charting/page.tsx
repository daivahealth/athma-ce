'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SmartChartingEditor } from '@/modules/clinical/components/charting/smart-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { useTriageByEncounter } from '@/modules/clinical/hooks/use-triage';
import type { TriageAllergy, TriageVitalSigns } from '@/modules/clinical/types/triage';

function formatAge(date?: string | null) {
  if (!date) return '—';
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return '—';
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
    const unit = vitals.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    parts.push(`Temp ${formatNumeric(vitals.temperature)}${unit}`);
  }
  if (isValidNumber(vitals.heartRate)) {
    parts.push(`HR ${formatNumeric(vitals.heartRate)} bpm`);
  }
  if (isValidNumber(vitals.systolicBP) || isValidNumber(vitals.diastolicBP)) {
    const systolic = isValidNumber(vitals.systolicBP) ? formatNumeric(vitals.systolicBP) : '—';
    const diastolic = isValidNumber(vitals.diastolicBP) ? formatNumeric(vitals.diastolicBP) : '—';
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
  if (isValidNumber(vitals.bmi)) {
    parts.push(`BMI ${formatNumeric(vitals.bmi)}`);
  }
  if (isValidNumber(vitals.bloodGlucose)) {
    const unit = vitals.bloodGlucoseUnit === 'mmol/L' ? 'mmol/L' : 'mg/dL';
    parts.push(`BG ${formatNumeric(vitals.bloodGlucose)} ${unit}`);
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
      if (severity && reaction) {
        return `${allergy.allergen} (${severity}, ${reaction})`;
      }
      if (severity) {
        return `${allergy.allergen} (${severity})`;
      }
      if (reaction) {
        return `${allergy.allergen} (${reaction})`;
      }
      return allergy.allergen;
    });
}

export default function ChartingPage() {
  const params = useParams();
  const encounterId = params.id as string;
  const { data: encounter, isLoading } = useEncounter(encounterId);
  const { data: triage } = useTriageByEncounter(encounterId);

  const triageVitalsSummary = useMemo(() => summarizeVitals(triage?.vitalSigns), [triage?.vitalSigns]);
  const triageAllergiesSummary = useMemo(
    () => summarizeAllergies(triage?.allergies),
    [triage?.allergies]
  );

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Loading charting workspace...
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center space-y-2">
        <p className="text-lg font-semibold">Encounter not found</p>
        <p className="text-sm text-muted-foreground">Please return to encounters and select another record.</p>
      </div>
    );
  }

  // Prefer patientDisplay (pre-computed DTO) over patient relation
  const patientDisplay = encounter.patientDisplay;
  const patient = encounter.patient;
  const patientName =
    patientDisplay?.displayName?.trim() ||
    patient?.fullName?.trim() ||
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    'Unknown patient';
  const patientAge = patientDisplay?.age != null ? `${patientDisplay.age} yrs` : formatAge(patient?.dateOfBirth);
  const patientGender = patientDisplay?.gender
    ? patientDisplay.gender[0].toUpperCase() + patientDisplay.gender.slice(1)
    : patient?.gender
    ? patient.gender[0].toUpperCase() + patient.gender.slice(1)
    : '—';
  const patientMrn = patientDisplay?.mrn ?? patient?.mrn ?? '—';

  return (
    <div className="space-y-6">
      <Card className="border border-transparent bg-gradient-to-r from-primary/15 via-primary/5 to-secondary/20 dark:from-primary/30 dark:via-primary/15 dark:to-secondary/35 shadow-md">
        <CardHeader>
          <CardTitle>Clinical Charting</CardTitle>
          <CardDescription>Encounter #{encounter.encounterNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 text-sm lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-muted-foreground">Patient</div>
                <div className="font-medium">{patientName}</div>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-10" />
              <div>
                <div className="text-muted-foreground">Age</div>
                <div className="font-medium">{patientAge}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Gender</div>
                <div className="font-medium">{patientGender}</div>
              </div>
              <div>
                <div className="text-muted-foreground">MRN</div>
                <div className="font-mono">{patientMrn}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <Badge variant="outline" className="capitalize mt-1">
                  {encounter.status}
                </Badge>
              </div>
            </div>
            {triage && (
              <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start lg:text-right lg:max-w-xl lg:justify-end">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Triage vitals
                  </div>
                  <div className="font-medium">
                    {triageVitalsSummary.length
                      ? triageVitalsSummary.join(' · ')
                      : 'No vitals recorded'}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden lg:block h-10" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Allergies
                  </div>
                  <div>
                    {triageAllergiesSummary.length
                      ? triageAllergiesSummary.join(', ')
                      : 'No allergies documented'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SmartChartingEditor
        encounterId={encounterId}
        patientId={encounter.patientId}
        authorStaffId={encounter.primaryStaffId}
      />
    </div>
  );
}
