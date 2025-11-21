'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, ActivitySquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { usePatientAppointments } from '@/modules/clinical/hooks/use-appointments';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { usePatientPolicies } from '@/modules/rcm/hooks/use-policies';
import { PolicyStatus } from '@/modules/rcm/types/policy';

const calculateAge = (dob?: string | null) => {
  if (!dob) return null;
  try {
    const birth = parseISO(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy • h:mm a');
  } catch {
    return value;
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy');
  } catch {
    return value;
  }
};

export default function Patient360Page() {
  const params = useParams();
  const locale = params.locale as string;
  const patientId = params.patientId as string;
  const router = useRouter();

  const { data: patient, isLoading: isPatientLoading, error: patientError } = usePatient(patientId);
  const { data: appointments } = usePatientAppointments(patientId);
  const { data: encounters } = usePatientEncounters(patientId);
  const { data: policies, isLoading: isPoliciesLoading } = usePatientPolicies(patientId);

  const upcomingAppointments = useMemo(() => {
    if (!appointments) return [] as typeof appointments;
    const now = Date.now();
    return appointments
      .filter((appointment) => new Date(appointment.startTime).getTime() >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
  }, [appointments]);

  const recentEncounters = useMemo(() => {
    if (!encounters) return [] as typeof encounters;
    return [...encounters]
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 3);
  }, [encounters]);

  if (isPatientLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading patient..." />
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load patient 360. {(patientError as Error)?.message}
      </div>
    );
  }

  const patientName = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');
  const patientAge = calculateAge(patient.dateOfBirth);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/patients`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to patients
        </Button>
        <h1 className="text-3xl font-bold">Patient 360</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients/${patientId}`}>
              View chart
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients-ai/${patientId}`}>
              <ActivitySquare className="mr-2 h-4 w-4" /> Patient AI+
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Patient summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-semibold">{patientName}</p>
              </div>
              <Badge variant={patient.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {patient.status}
              </Badge>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">MRN</p>
                <p className="font-mono text-sm">{patient.mrn}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age / Gender</p>
                <p>{patientAge ? `${patientAge} yrs` : '—'} · {patient.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood group</p>
                <p>{patient.bloodGroup || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nationality</p>
                <p>{patient.nationality || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p>{patient.phoneNumber || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{patient.email || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Allergies</p>
              <p>{patient.allergies || 'No allergies documented'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Chronic conditions</p>
              <p>{patient.chronicConditions || 'No chronic conditions on file'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Medications</p>
              <p>{patient.currentMedications || 'No medications recorded'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency & address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Emergency contact</p>
              <p>
                {patient.emergencyContactName || '—'}
                {patient.emergencyContactRelation ? ` (${patient.emergencyContactRelation})` : ''}
              </p>
              <p>{patient.emergencyContactNumber || 'No number on file'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <p>
                {patient.address
                  ? `${patient.address}${patient.city ? `, ${patient.city}` : ''}${patient.country ? `, ${patient.country}` : ''}`
                  : 'Address not provided'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments scheduled.</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded border p-3">
                  <div className="font-medium">{appointment.reason || 'General visit'}</div>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(appointment.startTime)} at {appointment.facilityName || 'Facility'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Provider: {appointment.providerName || 'Unassigned'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent encounters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEncounters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recorded encounters.</p>
            ) : (
              recentEncounters.map((encounter) => (
                <div key={encounter.id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{encounter.encounterNumber}</span>
                    <Badge variant="outline" className="capitalize">
                      {encounter.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDateTime(encounter.startTime)}</p>
                  <p className="text-xs text-muted-foreground">
                    {encounter.encounterClass} • {encounter.priority}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isPoliciesLoading ? (
              <LoadingSpinner size="sm" text="Loading policies..." />
            ) : !policies || policies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No policies on file.</p>
            ) : (
              policies.map((policy) => (
                <div key={policy.id} className="rounded border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{policy.payerName}</div>
                      <p className="text-xs text-muted-foreground">Policy #{policy.policyNumber}</p>
                    </div>
                    <Badge
                      variant={
                        policy.status === PolicyStatus.ACTIVE
                          ? 'default'
                          : policy.status === PolicyStatus.EXPIRED
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="capitalize"
                    >
                      {policy.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Effective {formatDate(policy.effectiveDate)} → Expires {formatDate(policy.expirationDate)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
