'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Sparkles, FlaskConical, ShieldCheck, PanelLeftOpen, Phone, MessageSquare, ClipboardPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { useSidebar } from '@/lib/contexts/sidebar-context';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { PatientContextRail } from './patient-context-rail';
import { CareTimelinePanel } from './care-timeline-panel';
import { EncounterDetailPanel } from './encounter-detail-panel';
import { CARE_CONTEXT_MIN_ENCOUNTERS } from './care-context-entry-button';

function calcAge(dob?: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function CareContextView({ locale, patientId }: { locale: string; patientId: string }) {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(patientId);
  const { data: encounters, isLoading: encountersLoading } = usePatientEncounters(patientId);

  // Collapse the left navbar once when the workspace opens, to maximise space.
  const didCollapse = React.useRef(false);
  React.useEffect(() => {
    if (!didCollapse.current && !isCollapsed) {
      didCollapse.current = true;
      toggleSidebar();
    }
  }, [isCollapsed, toggleSidebar]);

  // Gate: Care Context is only for information-rich patients. If a patient with a
  // thin history is reached directly, fall back to the existing Patient 360 view.
  const encountersReady = !encountersLoading && encounters !== undefined;
  const belowThreshold = encountersReady && (encounters?.length ?? 0) < CARE_CONTEXT_MIN_ENCOUNTERS;
  React.useEffect(() => {
    if (belowThreshold) {
      router.replace(`/${locale}/patients/${patientId}/360`);
    }
  }, [belowThreshold, router, locale, patientId]);

  const orderedEncounters = React.useMemo<Encounter[]>(
    () =>
      [...(encounters ?? [])].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      ),
    [encounters],
  );

  const [selectedEncounterId, setSelectedEncounterId] = React.useState<string | undefined>(undefined);
  const [railOpen, setRailOpen] = React.useState(true);

  // Default selection to the most recent encounter once loaded.
  React.useEffect(() => {
    if (!selectedEncounterId && orderedEncounters.length > 0) {
      setSelectedEncounterId(orderedEncounters[0].id);
    }
  }, [orderedEncounters, selectedEncounterId]);

  const selectedEncounter = orderedEncounters.find((e) => e.id === selectedEncounterId);

  if (patientLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading care context..." />
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load care context. {(patientError as Error)?.message}
      </div>
    );
  }

  if (belowThreshold) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner size="lg" text="Opening patient view..." />
      </div>
    );
  }

  const patientName = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');
  const patientAge = calcAge(patient.dateOfBirth);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/patients`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to patients
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Care Context</h1>
          <p className="text-sm text-muted-foreground">
            {patientName} · <span className="font-mono">{patient.mrn}</span>
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients/${patientId}`}>
              <ClipboardList className="mr-2 h-4 w-4" /> View chart
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients-ai/${patientId}`}>
              <Sparkles className="mr-2 h-4 w-4" /> Patient AI+
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients/${patientId}/results`}>
              <FlaskConical className="mr-2 h-4 w-4" /> Results
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/patients/${patientId}/policies`}>
              <ShieldCheck className="mr-2 h-4 w-4" /> Policies
            </Link>
          </Button>
        </div>
      </div>

      {/* 3-pane workspace */}
      <div
        className={cn(
          'grid gap-4',
          railOpen
            ? 'lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)_minmax(0,1.15fr)]'
            : 'lg:grid-cols-[52px_minmax(0,1fr)_minmax(0,1.15fr)]',
        )}
      >
        {railOpen ? (
          <Card>
            <CardContent className="p-4">
              <PatientContextRail patient={patient} onCollapse={() => setRailOpen(false)} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-2 pt-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Expand patient panel"
                title="Expand patient panel"
                onClick={() => setRailOpen(true)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
              {/* Vertical top-to-bottom summary: glyph tops face right (vertical-rl). */}
              <div
                className="text-[0.825rem] font-bold text-foreground leading-relaxed"
                style={{ writingMode: 'vertical-rl' }}
              >
                <span className="font-mono">{patient.mrn}</span>
                <span className="text-muted-foreground">{'   ·   '}</span>
                <span>{patientName}</span>
                <span className="text-muted-foreground">{'   ·   '}</span>
                <span>
                  {patientAge != null ? `${patientAge}y` : '—'}
                  {'   ·   '}
                  <span className="capitalize">{patient.gender}</span>
                </span>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  aria-label="Call"
                  title="Call"
                  disabled={!patient.phoneNumber}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  aria-label="Message"
                  title="Message"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  aria-label="New encounter"
                  title="New encounter"
                >
                  <ClipboardPlus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <CareTimelinePanel
              patient={patient}
              encounters={orderedEncounters}
              isLoading={encountersLoading}
              selectedEncounterId={selectedEncounterId}
              onSelectEncounter={setSelectedEncounterId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <EncounterDetailPanel encounter={selectedEncounter} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
