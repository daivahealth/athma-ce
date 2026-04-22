'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, ShoppingBag, Activity, Info } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientSearchSelect } from '@/components/patient-search-select';

import { useActivePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useCreateDispensing } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { DispensingSource, DispensingChannel } from '@/modules/pharmacy/types/dispensing';
import type { Encounter } from '@/modules/clinical/types/encounter';

/* ─── Helpers ────────────────────────────────────────────────────────── */
const INPATIENT_CLASSES = new Set(['IMP', 'ACUTE', 'NONAC', 'SS', 'OBSENC']);
const EMERGENCY_CLASSES = new Set(['EMER']);

function isInpatient(encounterClass: string) {
  return INPATIENT_CLASSES.has(encounterClass);
}

function isEmergency(encounterClass: string) {
  return EMERGENCY_CLASSES.has(encounterClass);
}

function defaultSourceForEncounter(enc: Encounter): DispensingSource {
  if (isInpatient(enc.encounterClass)) return DispensingSource.PAPER_WARD;
  if (isEmergency(enc.encounterClass)) return DispensingSource.OTC;
  return DispensingSource.PAPER_OP; // outpatient default
}

function channelForSource(source: DispensingSource): DispensingChannel {
  if (source === DispensingSource.PAPER_WARD) return DispensingChannel.INPATIENT_WARD;
  return DispensingChannel.OUTPATIENT_COUNTER;
}

function encounterTypelabel(encounterClass: string): string {
  if (isInpatient(encounterClass)) return 'Inpatient';
  if (isEmergency(encounterClass)) return 'Emergency';
  return 'Outpatient';
}

/* ─── Source options ─────────────────────────────────────────────────── */
const SOURCE_OPTIONS = [
  {
    value: DispensingSource.OTC,
    label: 'Over the Counter (OTC)',
    description: 'Direct sale without a prescription',
    Icon: ShoppingBag,
    showFor: ['outpatient', 'emergency', 'none'],
  },
  {
    value: DispensingSource.PAPER_OP,
    label: 'Paper OP Prescription',
    description: 'Paper prescription from outpatient doctor',
    Icon: FileText,
    showFor: ['outpatient', 'none'],
  },
  {
    value: DispensingSource.PAPER_WARD,
    label: 'Paper Ward Prescription',
    description: 'Paper prescription from ward / inpatient',
    Icon: FileText,
    showFor: ['inpatient', 'none'],
  },
];

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function DirectDispensePage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [source, setSource] = useState<DispensingSource>(DispensingSource.OTC);
  const [paperRef, setPaperRef] = useState('');

  const createDispensing = useCreateDispensing();

  /* ── Active encounters for the selected patient ── */
  const {
    data: activeEncounters = [],
    isLoading: encountersLoading,
  } = useActivePatientEncounters(selectedPatient?.id ?? '', !!selectedPatient);

  /* ── Auto-select first active encounter and derive source ── */
  useEffect(() => {
    if (!selectedPatient) {
      setSelectedEncounter(null);
      setSource(DispensingSource.OTC);
      return;
    }
    if (encountersLoading) return;

    if (activeEncounters.length > 0) {
      const enc = activeEncounters[0];
      setSelectedEncounter(enc);
      setSource(defaultSourceForEncounter(enc));
    } else {
      setSelectedEncounter(null);
      // keep current source
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient?.id, encountersLoading, activeEncounters]);

  /* ── Context string for visible source options ── */
  const encounterContext = selectedEncounter
    ? isInpatient(selectedEncounter.encounterClass)
      ? 'inpatient'
      : isEmergency(selectedEncounter.encounterClass)
      ? 'emergency'
      : 'outpatient'
    : 'none';

  const visibleOptions = SOURCE_OPTIONS.filter((o) =>
    o.showFor.includes(encounterContext),
  );

  /* ── Derived ── */
  const isPaperSource =
    source === DispensingSource.PAPER_OP || source === DispensingSource.PAPER_WARD;

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setSelectedEncounter(null);
    setPaperRef('');
  };

  const handlePatientClear = () => {
    setSelectedPatient(null);
    setSelectedEncounter(null);
    setPaperRef('');
    setSource(DispensingSource.OTC);
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return;

    const result = await createDispensing.mutateAsync({
      patientId: selectedPatient.id,
      ...(selectedEncounter ? { encounterId: selectedEncounter.id } : {}),
      dispensingSource: source,
      dispensingChannel: channelForSource(source),
      patientDisplayName:
        `${selectedPatient.firstName} ${selectedPatient.lastName}`.trim(),
      mrn: selectedPatient.mrn,
      ...(isPaperSource && paperRef ? { paperPrescriptionRef: paperRef } : {}),
    });

    router.push(`/${locale}/pharmacy/dispensings/${result.id}`);
  };

  const canSubmit =
    !!selectedPatient && (!isPaperSource || paperRef.trim().length > 0);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Direct Dispense</h1>
          <p className="text-sm text-muted-foreground">
            Dispense medications for OTC sales or paper prescriptions
          </p>
        </div>
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientSearchSelect
            label=""
            required
            selectedPatient={selectedPatient}
            onSelect={handlePatientSelect}
            onClear={handlePatientClear}
          />

          {/* Active encounter status */}
          {selectedPatient && (
            <>
              {encountersLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : selectedEncounter ? (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Active {encounterTypelabel(selectedEncounter.encounterClass)} Encounter
                      </span>
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:text-blue-300">
                        #{selectedEncounter.encounterNumber}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-300 text-blue-700 dark:text-blue-300 capitalize"
                      >
                        {selectedEncounter.status.replace(/-/g, ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                      Started {format(new Date(selectedEncounter.startTime), 'dd MMM yyyy HH:mm')}
                      {' · '}Dispensing type pre-selected based on encounter
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  No active encounter found for this patient
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dispensing Source — only shown after patient is selected */}
      {selectedPatient && !encountersLoading && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dispensing Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {visibleOptions.map(({ value, label, description, Icon }) => {
                const isSelected = source === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSource(value)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/30'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isSelected ? 'text-primary' : ''}`}>
                        {label}
                      </div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                    {isSelected && (
                      <Badge className="mt-0.5" variant="default">
                        Selected
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Paper prescription ref */}
            {isPaperSource && (
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="paper-ref">
                  Paper Prescription Reference <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paper-ref"
                  placeholder="e.g. RX-2024-001234"
                  value={paperRef}
                  onChange={(e) => setPaperRef(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The reference number written on the paper prescription
                </p>
              </div>
            )}

            {/* Channel badge */}
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span>Dispensing channel:</span>
              <Badge variant="outline" className="text-xs">
                {source === DispensingSource.PAPER_WARD ? 'Inpatient Ward' : 'Outpatient Counter'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {selectedPatient && !encountersLoading && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || createDispensing.isPending}
            className="min-w-36"
          >
            {createDispensing.isPending ? 'Creating...' : 'Create & Process'}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      )}

      {!canSubmit && selectedPatient && !encountersLoading && isPaperSource && !paperRef.trim() && (
        <p className="text-sm text-destructive">Paper prescription reference is required</p>
      )}
    </div>
  );
}
