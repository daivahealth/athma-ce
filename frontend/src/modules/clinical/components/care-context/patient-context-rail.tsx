'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Phone, MessageSquare, Plus, PanelLeftClose, AlertTriangle, Stethoscope } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Patient } from '@/modules/clinical/types/patient';
import { usePatientPolicies } from '@/modules/rcm/hooks/use-policies';
import { usePatientAppointments } from '@/modules/clinical/hooks/use-appointments';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useLatestObservations, deriveVitals } from '@/modules/clinical/hooks/use-observations';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { SectionLabel, Field, StatTile, ChipList, EmptyState } from './parts';

function titleCase(value?: string | null): string {
  if (!value) return 'Visit';
  const s = value.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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

function fmtDateTime(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy · HH:mm');
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


export function PatientContextRail({
  patient,
  onCollapse,
}: {
  patient: Patient;
  onCollapse?: () => void;
}) {
  const router = useRouter();
  const locale = (useParams().locale as string) ?? 'en';
  const newEncounterHref = `/${locale}/encounters/new?patientId=${patient.id}`;

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

  const { data: encounters } = usePatientEncounters(patient.id);
  const previousEncounter = React.useMemo(() => {
    if (!encounters) return undefined;
    const now = Date.now();
    return [...encounters]
      .filter((e) => new Date(e.startTime).getTime() <= now)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
  }, [encounters]);

  // Patient-level clinical summary is sourced from the most recent encounter that
  // carries it (the patients table has no allergy/problem/medication columns).
  const clinicalEncounter = React.useMemo(() => {
    return [...(encounters ?? [])]
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .find(
        (e) =>
          (e.allergies?.length ?? 0) > 0 ||
          (e.currentMedications?.length ?? 0) > 0 ||
          !!e.medicalHistory,
      );
  }, [encounters]);
  const riskFlags = clinicalEncounter?.allergies ?? [];

  // Care Team — every clinician the patient has seen, most-recent first, with the
  // context (encounter type) and visit count for why they were involved.
  const { data: staff } = useStaffList();
  const staffMap = React.useMemo(() => {
    const m = new Map<string, NonNullable<typeof staff>[number]>();
    (staff ?? []).forEach((s) => m.set(s.id, s));
    return m;
  }, [staff]);

  const careTeam = React.useMemo(() => {
    const byStaff = new Map<
      string,
      { staffId: string; lastTime: number; lastEncounter: NonNullable<typeof encounters>[number]; count: number }
    >();
    for (const e of encounters ?? []) {
      const id = e.primaryStaffId;
      if (!id) continue;
      const when = new Date(e.startTime).getTime();
      const existing = byStaff.get(id);
      if (!existing) {
        byStaff.set(id, { staffId: id, lastTime: when, lastEncounter: e, count: 1 });
      } else {
        existing.count += 1;
        if (when > existing.lastTime) {
          existing.lastTime = when;
          existing.lastEncounter = e;
        }
      }
    }
    return [...byStaff.values()].sort((a, b) => b.lastTime - a.lastTime);
  }, [encounters]);

  const address = [patient.address, patient.city, patient.state, patient.country, patient.postalCode]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-5">
      {/* Fixed identity header — stays put while everything below scrolls */}
      <div className="sticky top-0 z-20 -mx-4 space-y-3 border-b border-border/60 bg-card/95 px-4 pb-3 pt-4 backdrop-blur">
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
          {onCollapse ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground"
              aria-label="Collapse patient panel"
              title="Collapse panel"
              onClick={onCollapse}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {/* Risk flags (replaces Coverage) */}
        <div className="space-y-1.5">
          <SectionLabel className="text-destructive/80">
            <span className="inline-flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Risk Flags
            </span>
          </SectionLabel>
          {riskFlags.length === 0 ? (
            <EmptyState>No risk flags on file.</EmptyState>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {riskFlags.map((flag, i) => (
                <span
                  key={`${flag}-${i}`}
                  className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={!patient.phoneNumber}>
            <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message
          </Button>
          <Button variant="default" size="sm" onClick={() => router.push(newEncounterHref)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New
          </Button>
        </div>
      </div>

      {/* Vitals */}
      <div className="space-y-2">
        <SectionLabel>Vitals{lastCaptured ? ` · last captured ${fmtDate(lastCaptured)}` : ''}</SectionLabel>
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

      {/* Personal Information */}
      <div className="space-y-2.5">
        <SectionLabel>Personal Information</SectionLabel>
        <Field label="Date of birth" value={fmtDate(patient.dateOfBirth)} />
        <Field label="Gender" value={<span className="capitalize">{patient.gender}</span>} />
        <Field label="Blood group" value={patient.bloodGroup || '—'} />
        <Field label="Nationality" value={patient.nationality || '—'} />
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-2.5">
        <SectionLabel>Contact Information</SectionLabel>
        <Field label="Phone" value={patient.phoneNumber || '—'} />
        <Field label="Alternate" value={patient.alternateContactNumber || '—'} />
        <Field label="Email" value={patient.email || '—'} />
        <Field label="Address" value={address || 'Address not provided'} />
      </div>

      <Separator />

      {/* Emergency Contact */}
      <div className="space-y-2.5">
        <SectionLabel>Emergency Contact</SectionLabel>
        <Field
          label="Name"
          value={
            patient.emergencyContactName
              ? `${patient.emergencyContactName}${patient.emergencyContactRelation ? ` (${patient.emergencyContactRelation})` : ''}`
              : '—'
          }
        />
        <Field label="Number" value={patient.emergencyContactNumber || 'No number on file'} />
      </div>

      <Separator />

      {/* Medical Information */}
      <div className="space-y-3">
        <SectionLabel>Medical Information</SectionLabel>
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Allergies</p>
          <ChipList value={clinicalEncounter?.allergies} empty="No allergies documented" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Active conditions</p>
          <ChipList value={clinicalEncounter?.medicalHistory} empty="No conditions on file." />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Active medications</p>
          <ChipList value={clinicalEncounter?.currentMedications} empty="No medications recorded." />
        </div>
      </div>

      <Separator />

      {/* Care Team — clinicians seen, reverse-chronological, with context */}
      <div className="space-y-2.5">
        <SectionLabel>
          <span className="inline-flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" /> Care Team
          </span>
        </SectionLabel>
        {careTeam.length === 0 ? (
          <EmptyState>No care team recorded yet.</EmptyState>
        ) : (
          <div className="space-y-2">
            {careTeam.map((member) => {
              const s = staffMap.get(member.staffId);
              // displayName already carries the title (e.g. "Dr Omar Al-Ketbi"),
              // so use it directly rather than re-prepending the prefix.
              const name = s?.displayName?.trim() || 'Clinician';
              const specialty =
                s?.staffSpecialties?.find((x) => x.primaryFlag)?.specialty?.name ??
                s?.staffSpecialties?.[0]?.specialty?.name;
              const role = [s?.staffType, specialty].filter(Boolean).join(' · ');
              const context = titleCase(
                member.lastEncounter.encounterType || member.lastEncounter.encounterClass,
              );
              return (
                <div key={member.staffId} className="rounded-lg border border-border/60 bg-card/60 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-foreground">{name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {fmtDate(member.lastEncounter.startTime)}
                    </span>
                  </div>
                  {role ? <p className="truncate text-xs text-muted-foreground">{role}</p> : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seen for {context}
                    {member.count > 1 ? ` · ${member.count} visits` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Insurance Information */}
      <div className="space-y-2.5">
        <SectionLabel>Insurance Information</SectionLabel>
        {primaryPolicy ? (
          <>
            <Field label="Payer" value={primaryPolicy.payerName} />
            <Field label="Policy #" value={<span className="font-mono">{primaryPolicy.policyNumber}</span>} />
            {primaryPolicy.groupNumber ? <Field label="Group" value={primaryPolicy.groupNumber} /> : null}
            {primaryPolicy.expirationDate ? (
              <Field label="Expires" value={fmtDate(primaryPolicy.expirationDate)} />
            ) : null}
          </>
        ) : patient.insuranceProvider ? (
          <>
            <Field label="Provider" value={patient.insuranceProvider} />
            <Field label="Policy #" value={<span className="font-mono">{patient.insurancePolicyNumber || '—'}</span>} />
            {patient.insuranceExpiryDate ? (
              <Field label="Expires" value={fmtDate(patient.insuranceExpiryDate)} />
            ) : null}
          </>
        ) : (
          <EmptyState>No insurance on file.</EmptyState>
        )}
      </div>

      <Separator />

      {/* Identity Documents */}
      <div className="space-y-2.5">
        <SectionLabel>Identity Documents</SectionLabel>
        <Field
          label="National ID"
          value={patient.nationalId ? `${patient.nationalId}${patient.nationalIdType ? ` (${patient.nationalIdType})` : ''}` : '—'}
        />
        <Field label="Passport" value={patient.passportNumber || '—'} />
      </div>

      <Separator />

      {/* Previous Encounter */}
      <div className="space-y-2">
        <SectionLabel>Previous Encounter</SectionLabel>
        {previousEncounter ? (
          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
            <p className="text-sm font-semibold text-foreground">
              {previousEncounter.encounterType || previousEncounter.encounterClass}
            </p>
            <p className="font-mono text-xs text-muted-foreground">{previousEncounter.encounterNumber}</p>
            <p className="text-xs text-muted-foreground">{fmtDate(previousEncounter.startTime)}</p>
          </div>
        ) : (
          <EmptyState>No previous encounters.</EmptyState>
        )}
      </div>

      <Separator />

      {/* Next Appointment */}
      <div className="space-y-2">
        <SectionLabel>Next Appointment</SectionLabel>
        {nextAppointment ? (
          <div className="rounded-lg border border-border/60 bg-card/60 p-3">
            <p className="text-sm font-semibold text-foreground">{fmtDateTime(nextAppointment.startTime)}</p>
            <p className="text-xs text-muted-foreground">
              {nextAppointment.visitType || nextAppointment.appointmentType || 'Appointment'}
            </p>
          </div>
        ) : (
          <EmptyState>No upcoming appointments scheduled.</EmptyState>
        )}
      </div>

      <Separator />

      {/* Audit Information */}
      <div className="space-y-2.5">
        <SectionLabel>Audit Information</SectionLabel>
        <Field label="Created" value={fmtDateTime(patient.createdAt)} />
        <Field label="Last updated" value={fmtDateTime(patient.updatedAt)} />
      </div>
    </div>
  );
}
