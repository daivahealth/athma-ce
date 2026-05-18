'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Dna, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCancerDiagnoses, useCreateStaging } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

export default function NewStagingPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/staging`);

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');

  const [stagingSystem, setStagingSystem] = useState('');
  const [stagingEdition, setStagingEdition] = useState('');
  const [stagingType, setStagingType] = useState('clinical');
  const [stageGroup, setStageGroup] = useState('');
  const [tCategory, setTCategory] = useState('');
  const [nCategory, setNCategory] = useState('');
  const [mCategory, setMCategory] = useState('');
  const [stagingDate, setStagingDate] = useState('');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');

  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  // Auto-select when patient has exactly one active diagnosis
  useEffect(() => {
    if (!diagnosesLoading && diagnoses.length === 1 && !cancerDiagnosisId) {
      setCancerDiagnosisId(diagnoses[0].id);
    }
  }, [diagnosesLoading, diagnoses.length, cancerDiagnosisId]);

  const createStaging = useCreateStaging();
  const isValid = cancerDiagnosisId && stagingSystem && stagingDate;

  const handleSelectPatient = (p: any) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerDiagnosisId(''); };

  const handleSubmit = async () => {
    if (!isValid) return;
    await createStaging.mutateAsync({
      cancerDiagnosisId,
      stagingSystem,
      stagingEdition: stagingEdition || undefined,
      stagingType,
      stageGroup: stageGroup || undefined,
      tCategory: tCategory || undefined,
      nCategory: nCategory || undefined,
      mCategory: mCategory || undefined,
      stagingDate,
      status,
      notes: notes || undefined,
    } as Record<string, unknown>);
    back();
  };

  const age = selectedPatient?.dateOfBirth
    ? Math.floor((Date.now() - new Date(selectedPatient.dateOfBirth).getTime()) / 31557600000)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Tumor Staging</h1>
          <p className="text-muted-foreground text-sm">Record a TNM staging assessment for a cancer diagnosis</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Step 1 — Patient (search card or blue banner) */}
        {!selectedPatient ? (
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Select Patient</span>
              </div>
              <PatientSearchSelect
                required
                selectedPatient={selectedPatient}
                onSelect={handleSelectPatient}
                onClear={handleClearPatient}
              />
            </div>
          </div>
        ) : (
          /* Blue patient banner */
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
                </div>
                <Button
                  type="button" variant="outline" size="sm"
                  className="h-7 text-xs bg-white/70 dark:bg-white/10 border-blue-200 dark:border-blue-800"
                  onClick={handleClearPatient}
                >
                  Change
                </Button>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">
                {selectedPatient.fullName ||
                  `${selectedPatient.firstName ?? ''} ${selectedPatient.lastName ?? ''}`.trim() || '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.mrn && (
                  <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                    {selectedPatient.mrn}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {age} yrs
                  </span>
                )}
                {selectedPatient.gender && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {selectedPatient.gender}
                  </span>
                )}
                {selectedPatient.phoneNumber && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {selectedPatient.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Diagnosis selection card (only when multiple active diagnoses) */}
        {selectedPatient && !cancerDiagnosisId && (
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                  <Dna className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Select Cancer Diagnosis</span>
              </div>
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active cancer diagnoses found.{' '}
                  <button className="underline text-primary" onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}>
                    Add one first
                  </button>
                </p>
              ) : (
                <div className="space-y-2">
                  {diagnoses.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setCancerDiagnosisId(d.id)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-rose-200/60 bg-white/60 dark:bg-white/5 dark:border-rose-900/30 hover:bg-white/90 dark:hover:bg-white/10 text-sm transition-colors"
                    >
                      <div className="font-semibold text-foreground">{d.cancer_type}</div>
                      <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-muted-foreground">
                        <span>{d.primary_site}{d.primary_site_code && <span className="font-mono ml-1">({d.primary_site_code})</span>}</span>
                        <span>Dx {new Date(d.diagnosis_date).toLocaleDateString()}</span>
                        {d.grade && <span>{d.grade}</span>}
                      </div>
                      {d.histology_morphology && (
                        <div className="text-xs text-muted-foreground mt-0.5">{d.histology_morphology}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rose/purple diagnosis banner (after selection) */}
        {selectedDiagnosis && (
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                    <Dna className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
                </div>
                {diagnoses.length > 1 && (
                  <Button
                    type="button" variant="outline" size="sm"
                    className="h-7 text-xs bg-white/70 dark:bg-white/10 border-rose-200 dark:border-rose-800"
                    onClick={() => setCancerDiagnosisId('')}
                  >
                    Change
                  </Button>
                )}
              </div>
              <p className="text-base font-bold text-foreground leading-tight">{selectedDiagnosis.cancer_type}</p>
              <div className="flex flex-wrap gap-2">
                {selectedDiagnosis.primary_site && (
                  <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                    {selectedDiagnosis.primary_site}
                    {selectedDiagnosis.primary_site_code && (
                      <span className="font-mono ml-1 opacity-70">({selectedDiagnosis.primary_site_code})</span>
                    )}
                  </span>
                )}
                {selectedDiagnosis.laterality && selectedDiagnosis.laterality !== 'not_applicable' && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {selectedDiagnosis.laterality}
                  </span>
                )}
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                  Dx {new Date(selectedDiagnosis.diagnosis_date).toLocaleDateString()}
                </span>
                {selectedDiagnosis.metastatic_status && selectedDiagnosis.metastatic_status !== 'unknown' && (
                  <span className="inline-flex items-center rounded-md bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 text-xs capitalize font-medium text-amber-700 dark:text-amber-400">
                    {selectedDiagnosis.metastatic_status}
                  </span>
                )}
                {selectedDiagnosis.clinical_status && (
                  <span className="inline-flex items-center rounded-md bg-emerald-100/70 dark:bg-emerald-900/30 px-2 py-0.5 text-xs capitalize font-medium text-emerald-700 dark:text-emerald-400">
                    {selectedDiagnosis.clinical_status}
                  </span>
                )}
                {selectedDiagnosis.grade && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                    <span className="opacity-70">Grade</span> {selectedDiagnosis.grade}
                  </span>
                )}
                {selectedDiagnosis.histology_morphology && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    <span className="opacity-70">Histology</span>
                    <span className="font-medium text-foreground">{selectedDiagnosis.histology_morphology}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form cards — gated on diagnosis selection */}
        {cancerDiagnosisId && (
          <>
            {/* Staging — system + TNM combined */}
            <Card>
              <CardHeader><CardTitle>Staging</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>System *</Label>
                    <Select value={stagingSystem || '__none'} onValueChange={(v) => setStagingSystem(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        <SelectItem value="AJCC TNM">AJCC TNM</SelectItem>
                        <SelectItem value="UICC TNM">UICC TNM</SelectItem>
                        <SelectItem value="FIGO">FIGO</SelectItem>
                        <SelectItem value="Ann Arbor">Ann Arbor</SelectItem>
                        <SelectItem value="Dukes">Dukes</SelectItem>
                        <SelectItem value="Gleason">Gleason</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Edition</Label>
                    <Input placeholder="e.g. 8th" value={stagingEdition} onChange={(e) => setStagingEdition(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Staging Type</Label>
                    <Select value={stagingType} onValueChange={setStagingType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinical">Clinical</SelectItem>
                        <SelectItem value="pathological">Pathological</SelectItem>
                        <SelectItem value="restaging">Restaging</SelectItem>
                        <SelectItem value="recurrence">Recurrence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Stage Group</Label>
                    <Input placeholder="e.g. IIIA" value={stageGroup} onChange={(e) => setStageGroup(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>T Category</Label>
                    <Input placeholder="e.g. T2" value={tCategory} onChange={(e) => setTCategory(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>N Category</Label>
                    <Input placeholder="e.g. N1" value={nCategory} onChange={(e) => setNCategory(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>M Category</Label>
                    <Input placeholder="e.g. M0" value={mCategory} onChange={(e) => setMCategory(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Status */}
            <Card>
              <CardHeader><CardTitle>Date &amp; Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Staging Date *</Label>
                    <Input type="date" value={stagingDate} onChange={(e) => setStagingDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="superseded">Superseded</SelectItem>
                        <SelectItem value="entered_in_error">Entered in Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Staging notes or clinical context..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={back} disabled={createStaging.isPending}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!isValid || createStaging.isPending}>
                {createStaging.isPending ? 'Saving...' : 'Add Staging'}
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
