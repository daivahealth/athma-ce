'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { usePatientAppointments } from '@/modules/clinical/hooks/use-appointments';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { Activity, AlertTriangle, ClipboardList, ClipboardCheck, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { CareContextEntryButton } from '@/modules/clinical/components/care-context/care-context-entry-button';

interface PatientAiPlusPageProps {
  params: {
    locale: string;
    patientId: string;
  };
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return 'Unknown';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy • h:mm a');
  } catch {
    return 'Invalid date';
  }
};

const calculateAge = (dob?: string | null) => {
  if (!dob) return null;
  const birthDate = parseISO(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function PatientAiPlusPage({ params }: PatientAiPlusPageProps) {
  const { data: patient, isLoading, error } = usePatient(params.patientId);
  const { data: appointments } = usePatientAppointments(params.patientId);
  const { data: encounters } = usePatientEncounters(params.patientId);

  const upcomingAppointment = useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const now = Date.now();
    return (
      appointments
        .filter((appointment) => new Date(appointment.startTime).getTime() >= now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] || null
    );
  }, [appointments]);

  const previousEncounter = useMemo(() => {
    if (!encounters || encounters.length === 0) return null;
    return [...encounters].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] || null;
  }, [encounters]);

  const aiSummary = useMemo(() => {
    if (!patient) return 'AI summary will appear once patient data is available.';
    const age = calculateAge(patient.dateOfBirth);
    const parts = [
      `${patient.firstName} ${patient.lastName}`,
      age ? `${age}-year-old ${patient.gender}` : patient.gender,
      patient.chronicConditions ? `with chronic history of ${patient.chronicConditions}` : null,
      patient.allergies ? `allergies: ${patient.allergies}` : null,
    ].filter(Boolean);

    const appointmentBit = upcomingAppointment
      ? `Next visit scheduled for ${formatDateTime(upcomingAppointment.startTime)}.`
      : 'No upcoming appointments scheduled.';

    const encounterBit = previousEncounter
      ? `Last encounter recorded ${formatDateTime(previousEncounter.startTime)}.`
      : 'No prior encounters logged yet.';

    return `${parts.join(', ')}. ${appointmentBit} ${encounterBit}`;
  }, [patient, upcomingAppointment, previousEncounter]);

  const aiActionItems = useMemo(() => {
    if (!patient) return [] as string[];
    const actions: string[] = [];
    if (!upcomingAppointment) {
      actions.push('Book a follow-up appointment to maintain continuity of care.');
    }
    if (patient.chronicConditions) {
      actions.push('Review chronic condition care plans for possible adjustments.');
    }
    if (!patient.insuranceExpiryDate) {
      actions.push('Confirm insurance coverage and attach policy details.');
    }
    if (previousEncounter && !previousEncounter.endTime) {
      actions.push('Close the last encounter with disposition notes.');
    }
    if (actions.length === 0) {
      actions.push('All critical tasks look up to date. Keep monitoring vitals and adherence.');
    }
    return actions;
  }, [patient, upcomingAppointment, previousEncounter]);

  const riskFlags = useMemo(() => {
    if (!patient) return [] as { label: string; severity: 'low' | 'moderate' | 'high' }[];
    const flags: { label: string; severity: 'low' | 'moderate' | 'high' }[] = [];
    const age = calculateAge(patient.dateOfBirth);
    if (age && age >= 65) {
      flags.push({ label: 'Senior patient – monitor fall risk & polypharmacy', severity: 'moderate' });
    }
    if (patient.chronicConditions) {
      flags.push({ label: 'Chronic conditions documented', severity: 'moderate' });
    }
    if (patient.allergies) {
      flags.push({ label: 'Allergy profile present – verify before prescribing', severity: 'high' });
    }
    if (!patient.emergencyContactNumber) {
      flags.push({ label: 'Missing emergency contact number', severity: 'low' });
    }
    return flags;
  }, [patient]);

  const dataGaps = useMemo(() => {
    if (!patient) return [] as string[];
    const gaps: string[] = [];
    if (!patient.email) gaps.push('Email address not on file');
    if (!patient.address) gaps.push('Mailing address incomplete');
    if (!patient.insuranceProvider) gaps.push('Insurance provider not captured');
    if (!patient.bloodGroup) gaps.push('Blood group undocumented');
    return gaps;
  }, [patient]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Generating AI insights..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load AI insights</CardTitle>
          <CardDescription>Please refresh or try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const patientAge = calculateAge(patient.dateOfBirth);

  return (
    <div className="space-y-6">
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4 text-primary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Patient AI+</CardTitle>
            </div>
            <Badge variant="secondary" className="text-primary">
              Beta · AI generated
            </Badge>
          </div>
          <CardDescription>Unified patient identity + AI briefing for instant context.</CardDescription>
          <div className="mt-3 flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={`/${params.locale}/patients/${params.patientId}/360`}>
                <Compass className="mr-2 h-4 w-4" /> View Patient 360
              </Link>
            </Button>
            <CareContextEntryButton patientId={params.patientId} locale={params.locale as string} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These insights are generated automatically from the latest charted data, encounters, and scheduling
            context. Validate recommendations before acting.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mt-1 text-2xl font-semibold">
                {patient.firstName} {patient.middleName && `${patient.middleName} `}
                {patient.lastName}
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">MRN</dt>
                  <dd className="font-medium">{patient.mrn}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{patient.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Age / Gender</dt>
                  <dd className="font-medium">
                    {patientAge ? `${patientAge} yrs` : '—'} · {patient.gender}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{patient.phoneNumber || 'No phone on file'}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h3 className="mt-1 text-lg font-semibold">AI Snapshot</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Upcoming:</span>{' '}
                  {upcomingAppointment
                    ? `${upcomingAppointment.appointmentType || 'Visit'} · ${formatDateTime(
                        upcomingAppointment.startTime
                      )}`
                    : 'No appointment scheduled'}
                </li>
                <li>
                  <span className="font-medium text-foreground">Last encounter:</span>{' '}
                  {previousEncounter
                    ? `${previousEncounter.encounterClass} · ${formatDateTime(previousEncounter.startTime)}`
                    : 'No encounter history yet'}
                </li>
                <li>
                  <span className="font-medium text-foreground">Primary focus:</span>{' '}
                  {patient.chronicConditions || patient.allergies || 'Monitoring general wellness'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              AI Clinical Summary
            </CardTitle>
            <CardDescription>Context-aware overview for quick preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">{aiSummary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Suggested Next Actions
            </CardTitle>
            <CardDescription>AI-prioritized to-do list based on current data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {aiActionItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Risk Flags
            </CardTitle>
            <CardDescription>Automatically detected considerations.</CardDescription>
          </CardHeader>
          <CardContent>
            {riskFlags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No elevated risks detected.</p>
            ) : (
              <ul className="space-y-2">
                {riskFlags.map((flag, index) => (
                  <li key={`${flag.label}-${index}`} className="flex items-center gap-3 rounded-md border p-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{flag.label}</p>
                      <p className="text-xs uppercase text-muted-foreground">Severity: {flag.severity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Data Quality + Gaps
            </CardTitle>
            <CardDescription>Areas to enrich for better AI outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            {dataGaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">All core demographic and coverage fields are populated.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {dataGaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
