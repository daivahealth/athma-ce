'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Phone, MessageSquare, Plus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Patient } from '@/modules/clinical/types/patient';
import { usePatientPolicies } from '@/modules/rcm/hooks/use-policies';
import { usePatientAppointments } from '@/modules/clinical/hooks/use-appointments';
import { useLatestObservations, deriveVitals } from '@/modules/clinical/hooks/use-observations';
import { SectionLabel, Field, StatTile, ChipList, EmptyState } from './parts';

function calculateAge(dob?: string | null): number | null {
  if (!dob) return null;
  try {
    const birth = parseISO(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  } catch {
    return null;
  }
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy');
  } catch {
    return value;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'P';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PatientContextRail({ patient }: { patient: Patient }) {
  const name = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');
  const age = calculateAge(patient.dateOfBirth);

  const { data: observations } = useLatestObservations(patient.id);
  const { vitals, lastCaptured } = React.useMemo(() => deriveVitals(observations ?? []), [observations]);

  const { data: policies } = usePatientPolicies(patient.id);
  const primaryPolicy = policies?.find((p) => p.isPrimary) ?? policies?.[0];

  const { data: appointments } = usePatientAppointments(patient.id);
  const nextAppointment = React.useMemo(() => {
    if (!appointments) return undefined;
    const now = Date.now();
    return [...appointments]
      .filter((a) => new Date(a.startTime).getTime() >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  }, [appointments]);

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-foreground">{name}</h2>
              <Badge variant={patient.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {patient.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {age != null ? `${age}y` : '—'} · <span className="capitalize">{patient.gender}</span>
            </p>
            <p className="font-mono text-xs text-muted-foreground">{patient.mrn}</p>
          </div>
        </div>

        <ChipList value={patient.allergies} empty="No allergies documented" />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={!patient.phoneNumber}>
            <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message
          </Button>
          <Button variant="default" size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New
          </Button>
        </div>
      </div>

      <Separator />

      {/* Vitals */}
      <div className="space-y-2">
        <SectionLabel>
          Vitals{lastCaptured ? ` · last captured ${fmtDate(lastCaptured)}` : ''}
        </SectionLabel>
        {vitals.length === 0 ? (
          <EmptyState>No vitals recorded.</EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {vitals.map((v) => (
              <StatTile key={v.label} label={v.label} value={v.value} unit={v.unit} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Demographics */}
      <div className="space-y-2.5">
        <SectionLabel>Demographics</SectionLabel>
        <Field label="DOB" value={fmtDate(patient.dateOfBirth)} />
        <Field label="Phone" value={patient.phoneNumber || '—'} />
        <Field label="Email" value={patient.email || '—'} />
        <Field label="Nationality" value={patient.nationality || '—'} />
      </div>

      <Separator />

      {/* Coverage */}
      <div className="space-y-2.5">
        <SectionLabel>Coverage</SectionLabel>
        {primaryPolicy ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{primaryPolicy.payerName}</p>
            <p className="font-mono text-xs text-muted-foreground">{primaryPolicy.policyNumber}</p>
            {primaryPolicy.groupNumber ? (
              <p className="text-xs text-muted-foreground">Group {primaryPolicy.groupNumber}</p>
            ) : null}
          </div>
        ) : patient.insuranceProvider ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{patient.insuranceProvider}</p>
            <p className="font-mono text-xs text-muted-foreground">{patient.insurancePolicyNumber || '—'}</p>
          </div>
        ) : (
          <EmptyState>No coverage on file.</EmptyState>
        )}
      </div>

      <Separator />

      {/* Active conditions */}
      <div className="space-y-2">
        <SectionLabel>Active Conditions</SectionLabel>
        <ChipList value={patient.chronicConditions} empty="No conditions on file." />
      </div>

      <Separator />

      {/* Active medications */}
      <div className="space-y-2">
        <SectionLabel>Active Medications</SectionLabel>
        <ChipList value={patient.currentMedications} empty="No medications recorded." />
      </div>

      <Separator />

      {/* Next appointment */}
      <div className="space-y-2">
        <SectionLabel>Next Appointment</SectionLabel>
        {nextAppointment ? (
          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
            <p className="text-sm font-semibold text-foreground">
              {(() => {
                try {
                  return format(parseISO(nextAppointment.startTime), 'MMM dd, yyyy · HH:mm');
                } catch {
                  return nextAppointment.startTime;
                }
              })()}
            </p>
            <p className="text-xs text-muted-foreground">
              {nextAppointment.visitType || nextAppointment.appointmentType || 'Appointment'}
            </p>
          </div>
        ) : (
          <EmptyState>No upcoming appointments scheduled.</EmptyState>
        )}
      </div>
    </div>
  );
}
