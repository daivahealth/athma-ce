'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pill } from 'lucide-react';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { useTriageByEncounter } from '@/modules/clinical/hooks/use-triage';
import type { TriageAllergy, TriageVitalSigns } from '@/modules/clinical/types/triage';
import type { PharmacyDispensing } from '@/modules/pharmacy/types/dispensing';

/* ─── Status badge colours (mirror the lab report status styles) ─────── */
const STATUS_CLASSES: Record<string, string> = {
  queued:
    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
  verified:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  dispensed:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  partially_dispensed:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  cancelled:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  returned:
    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
};

/* ─── Helpers (copied from ReportPatientHeader) ──────────────────────── */
function formatAge(date?: string | null) {
  if (!date) return '-';
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return '-';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return `${age} yrs`;
}

const formatNumeric = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function summarizeVitals(vitals?: TriageVitalSigns | null): string[] {
  if (!vitals) return [];
  const p: string[] = [];
  if (isNum(vitals.temperature)) {
    const u = vitals.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    p.push(`Temp ${formatNumeric(vitals.temperature)}${u}`);
  }
  if (isNum(vitals.heartRate)) p.push(`HR ${formatNumeric(vitals.heartRate)} bpm`);
  if (isNum(vitals.systolicBP) || isNum(vitals.diastolicBP)) {
    const s = isNum(vitals.systolicBP) ? formatNumeric(vitals.systolicBP) : '-';
    const d = isNum(vitals.diastolicBP) ? formatNumeric(vitals.diastolicBP) : '-';
    p.push(`BP ${s}/${d}`);
  }
  if (isNum(vitals.respiratoryRate)) p.push(`RR ${formatNumeric(vitals.respiratoryRate)} rpm`);
  if (isNum(vitals.oxygenSaturation)) p.push(`SpO2 ${formatNumeric(vitals.oxygenSaturation)}%`);
  if (isNum(vitals.weight)) {
    const u = vitals.weightUnit === 'lbs' ? 'lb' : 'kg';
    p.push(`Wt ${formatNumeric(vitals.weight)} ${u}`);
  }
  if (isNum(vitals.height)) {
    const u = vitals.heightUnit === 'in' ? 'in' : 'cm';
    p.push(`Ht ${formatNumeric(vitals.height)} ${u}`);
  }
  return p;
}

function summarizeAllergies(allergies?: TriageAllergy[] | null): string[] {
  if (!allergies || allergies.length === 0) return [];
  return allergies
    .filter((a) => a.allergen?.trim())
    .map((a) => {
      const sev = a.severity?.trim();
      const rxn = a.reaction?.trim();
      if (sev && rxn) return `${a.allergen} (${sev}, ${rxn})`;
      if (sev) return `${a.allergen} (${sev})`;
      if (rxn) return `${a.allergen} (${rxn})`;
      return a.allergen;
    });
}

/* ─── Component ──────────────────────────────────────────────────────── */
interface DispensingPatientHeaderProps {
  dispensing: PharmacyDispensing;
}

export function DispensingPatientHeader({ dispensing }: DispensingPatientHeaderProps) {
  const router = useRouter();

  const { data: encounter } = useEncounter(dispensing.encounterId ?? '');
  const { data: triage } = useTriageByEncounter(dispensing.encounterId ?? '');

  const vitalsSummary = useMemo(() => summarizeVitals(triage?.vitalSigns), [triage?.vitalSigns]);
  const allergiesSummary = useMemo(
    () => summarizeAllergies(triage?.allergies),
    [triage?.allergies],
  );

  /* Patient fields — prefer encounter lookup, fall back to dispensing data */
  const patientDisplay = encounter?.patientDisplay;
  const patient = encounter?.patient;

  const patientName =
    patientDisplay?.displayName?.trim() ||
    patient?.fullName?.trim() ||
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    dispensing.patientDisplayName ||
    '—';

  const patientAge =
    patientDisplay?.age != null ? `${patientDisplay.age} yrs` : formatAge(patient?.dateOfBirth);

  const patientGender = (() => {
    const g = patientDisplay?.gender ?? patient?.gender;
    return g ? g[0].toUpperCase() + g.slice(1) : '-';
  })();

  const patientMrn = patientDisplay?.mrn ?? patient?.mrn ?? dispensing.mrn ?? '-';

  const statusKey = dispensing.status?.toLowerCase() ?? '';

  return (
    <Card className="border border-transparent bg-gradient-to-r from-primary/15 via-primary/5 to-secondary/20 dark:from-primary/30 dark:via-primary/15 dark:to-secondary/35 shadow-md">
      <CardContent className="pt-5 pb-4">
        {/* Top row: back · icon · title · dispensing # · status · encounter # */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Pill className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dispensing</h2>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground font-medium">
            {dispensing.dispensingNumber}
          </span>
          {dispensing.status && (
            <Badge
              variant="outline"
              className={STATUS_CLASSES[statusKey] ?? 'capitalize'}
            >
              {dispensing.status}
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
            {dispensing.dispensingChannel && (
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wide">Channel</div>
                <div className="font-medium capitalize">
                  {dispensing.dispensingChannel.replace(/_/g, ' ')}
                </div>
              </div>
            )}
            {dispensing.wardName && (
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wide">Ward</div>
                <div className="font-medium">
                  {dispensing.wardName}
                  {dispensing.bedNumber ? ` · Bed ${dispensing.bedNumber}` : ''}
                </div>
              </div>
            )}
          </div>

          {triage && (
            <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start lg:text-right lg:max-w-xl lg:justify-end">
              {vitalsSummary.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Triage Vitals
                  </div>
                  <div className="font-medium text-xs">{vitalsSummary.join(' · ')}</div>
                </div>
              )}
              {allergiesSummary.length > 0 && (
                <>
                  {vitalsSummary.length > 0 && (
                    <Separator orientation="vertical" className="hidden lg:block h-10" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Allergies
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {allergiesSummary.join(', ')}
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
