'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, User, Dna, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCancerDiagnoses, useCreateOncologyCarePlan } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis, TreatmentModality } from '@/plugins/oncology/types';

interface ModalityRow {
  modality: TreatmentModality | '';
  sequence: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  details: string;
}

export default function NewCarePlanPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/care-plans`);

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');
  const [treatmentIntent, setTreatmentIntent] = useState('');
  const [subspecialty, setSubspecialty] = useState('');
  const [status, setStatus] = useState('draft');
  const [plannedCycles, setPlannedCycles] = useState('');
  const [cycleDurationDays, setCycleDurationDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [modalities, setModalities] = useState<ModalityRow[]>([
    { modality: '', sequence: 1, status: 'planned', details: '' },
  ]);

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

  const createPlan = useCreateOncologyCarePlan();
  const isValid = cancerDiagnosisId && treatmentIntent;

  const handleSelectPatient = (p: any) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerDiagnosisId(''); };

  const addModality = () =>
    setModalities((p) => [...p, { modality: '', sequence: p.length + 1, status: 'planned', details: '' }]);
  const removeModality = (i: number) =>
    setModalities((p) => p.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, sequence: idx + 1 })));
  const updateModality = (i: number, field: keyof ModalityRow, value: string | number) =>
    setModalities((p) => p.map((m, idx) => idx === i ? { ...m, [field]: value } : m));

  const handleSubmit = async () => {
    if (!isValid) return;
    const filledModalities = modalities.filter((m) => m.modality).map((m) => ({
      modality: m.modality, sequence: m.sequence, status: m.status,
      details: m.details || undefined,
    }));
    await createPlan.mutateAsync({
      cancerDiagnosisId,
      treatmentIntent,
      oncologySubspecialty: subspecialty || undefined,
      status,
      plannedModalities: filledModalities,
      plannedCycles: plannedCycles ? parseInt(plannedCycles, 10) : undefined,
      cycleDurationDays: cycleDurationDays ? parseInt(cycleDurationDays, 10) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes || undefined,
      milestones: [],
      followUpSchedule: [],
    } as Parameters<typeof createPlan.mutateAsync>[0]);
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
          <h1 className="text-2xl font-bold">Create Care Plan</h1>
          <p className="text-muted-foreground text-sm">Create a new oncology treatment care plan</p>
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
          /* Blue patient banner (selected state) */
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

        {/* Step 2 — Diagnosis selection (only when patient has multiple active diagnoses) */}
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

        {/* Form cards — gated on both patient + diagnosis */}
        {cancerDiagnosisId && (
          <>
            {/* Treatment Plan */}
            <Card>
              <CardHeader><CardTitle>Treatment Plan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Treatment Intent *</Label>
                    <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        <SelectItem value="curative">Curative</SelectItem>
                        <SelectItem value="adjuvant">Adjuvant</SelectItem>
                        <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
                        <SelectItem value="palliative">Palliative</SelectItem>
                        <SelectItem value="surveillance">Surveillance</SelectItem>
                        <SelectItem value="supportive">Supportive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Oncology Subspecialty</Label>
                    <Select value={subspecialty || '__none'} onValueChange={(v) => setSubspecialty(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Not specified —</SelectItem>
                        <SelectItem value="medical_oncology">Medical Oncology</SelectItem>
                        <SelectItem value="surgical_oncology">Surgical Oncology</SelectItem>
                        <SelectItem value="radiation_oncology">Radiation Oncology</SelectItem>
                        <SelectItem value="hemato_oncology">Haemato-Oncology</SelectItem>
                        <SelectItem value="gynec_oncology">Gynecologic Oncology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modalities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Planned Modalities</CardTitle>
                  <Button type="button" variant="ghost" size="sm" onClick={addModality}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {modalities.map((m, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={m.modality || '__none'} onValueChange={(v) => updateModality(i, 'modality', v === '__none' ? '' : v)}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Modality" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">— Modality —</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="chemotherapy">Chemotherapy</SelectItem>
                            <SelectItem value="radiation">Radiation</SelectItem>
                            <SelectItem value="immunotherapy">Immunotherapy</SelectItem>
                            <SelectItem value="hormonal">Hormonal Therapy</SelectItem>
                            <SelectItem value="targeted">Targeted Therapy</SelectItem>
                            <SelectItem value="palliative">Palliative Care</SelectItem>
                            <SelectItem value="surveillance">Surveillance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={m.status} onValueChange={(v) => updateModality(i, 'status', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        className="h-9"
                        placeholder="Details (optional)"
                        value={m.details}
                        onChange={(e) => updateModality(i, 'details', e.target.value)}
                      />
                    </div>
                    {modalities.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive mt-0" onClick={() => removeModality(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Planned Cycles</Label>
                    <Input type="number" min={1} placeholder="e.g. 6" value={plannedCycles} onChange={(e) => setPlannedCycles(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cycle Duration (days)</Label>
                    <Input type="number" min={1} placeholder="e.g. 21" value={cycleDurationDays} onChange={(e) => setCycleDurationDays(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status & Notes */}
            <Card>
              <CardHeader><CardTitle>Status & Notes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Plan Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Additional notes, rationale, or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={back} disabled={createPlan.isPending}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!isValid || createPlan.isPending}>
                {createPlan.isPending ? 'Saving...' : 'Create Care Plan'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
