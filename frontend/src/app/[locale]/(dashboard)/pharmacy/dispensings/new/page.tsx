'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, ShoppingBag, Activity, Info, Upload, X, Paperclip } from 'lucide-react';
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
import { patientDocumentService } from '@/modules/clinical/services/patient-document-service';
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

  // File upload state
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    clearUpload();
  };

  const handlePatientClear = () => {
    setSelectedPatient(null);
    setSelectedEncounter(null);
    setPaperRef('');
    setSource(DispensingSource.OTC);
    clearUpload();
  };

  /* ── File upload helpers ── */
  const clearUpload = () => {
    setPrescriptionFile(null);
    setUploadedDocumentId(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    // Validate type and size (max 10MB)
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only PDF, JPEG, PNG, or WebP files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be smaller than 10 MB');
      return;
    }

    setUploadError(null);
    setPrescriptionFile(file);
    setIsUploading(true);
    setUploadedDocumentId(null);

    try {
      const doc = await patientDocumentService.uploadDocument(selectedPatient.id, {
        file,
        documentType: 'paper_prescription',
        documentNumber: '',
        issuingCountry: 'AE',
      });
      setUploadedDocumentId(doc.id);
    } catch {
      setUploadError('Upload failed. Please try again.');
      setPrescriptionFile(null);
    } finally {
      setIsUploading(false);
    }
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
      ...(uploadedDocumentId ? { paperPrescriptionDocumentId: uploadedDocumentId } : {}),
    });

    router.push(`/${locale}/pharmacy/dispensings/${result.id}`);
  };

  const canSubmit = !!selectedPatient && !isUploading;

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

            {/* Paper prescription details — shown for paper sources */}
            {isPaperSource && (
              <div className="space-y-4 pt-2">
                {/* Reference number (optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="paper-ref">
                    Paper Prescription Reference{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
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

                {/* Prescription scan / photo upload (optional) */}
                <div className="space-y-2">
                  <Label>
                    Upload Prescription Scan{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {!prescriptionFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                    >
                      <Upload className="h-5 w-5 flex-shrink-0" />
                      <span>Click to upload a photo or PDF of the prescription</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
                      <Paperclip className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{prescriptionFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isUploading
                            ? 'Uploading…'
                            : uploadedDocumentId
                            ? 'Uploaded successfully'
                            : 'Pending upload'}
                        </p>
                      </div>
                      {isUploading ? (
                        <span className="text-xs text-muted-foreground animate-pulse">uploading…</span>
                      ) : uploadedDocumentId ? (
                        <Badge variant="secondary" className="text-xs shrink-0">Saved</Badge>
                      ) : null}
                      <button
                        type="button"
                        onClick={clearUpload}
                        className="ml-1 rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-destructive">{uploadError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Accepted: PDF, JPEG, PNG, WebP · Max 10 MB
                  </p>
                </div>
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
    </div>
  );
}
