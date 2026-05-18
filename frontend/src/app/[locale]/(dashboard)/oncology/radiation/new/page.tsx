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
import {
  useCancerDiagnoses,
  useCreateRadiationPrescription,
} from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

const MODALITIES = ['PHOTON', 'ELECTRON', 'PROTON', 'BRACHY'];
const TECHNIQUES = ['3DCRT', 'IMRT', 'VMAT', 'SBRT', 'SRS', 'ELECTRON', 'HDR', 'LDR'];

export default function NewRadiationPrescriptionPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/radiation`);

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [cancerProfileId, setCancerProfileId] = useState('');

  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [treatmentIntent, setTreatmentIntent] = useState('');
  const [laterality, setLaterality] = useState('');
  const [modality, setModality] = useState('');
  const [technique, setTechnique] = useState('');
  const [totalDoseGy, setTotalDoseGy] = useState('');
  const [dosePerFractionGy, setDosePerFractionGy] = useState('');
  const [plannedFractions, setPlannedFractions] = useState('');
  const [concurrentChemo, setConcurrentChemo] = useState(false);
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerProfileId);

  // Auto-select when patient has exactly one active diagnosis
  useEffect(() => {
    if (!diagnosesLoading && diagnoses.length === 1 && !cancerProfileId) {
      setCancerProfileId(diagnoses[0].id);
    }
  }, [diagnosesLoading, diagnoses.length, cancerProfileId]);

  const createPrescription = useCreateRadiationPrescription();
  const isValid = selectedPatient && treatmentIntent && modality && totalDoseGy && dosePerFractionGy && plannedStartDate;

  const handleSelectPatient = (p: any) => { setSelectedPatient(p); setCancerProfileId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerProfileId(''); };

  const calcFractions = () => {
    const total = parseFloat(totalDoseGy);
    const perFx = parseFloat(dosePerFractionGy);
    if (total > 0 && perFx > 0) setPlannedFractions(String(Math.round(total / perFx)));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    const rx = await createPrescription.mutateAsync({
      patientId: selectedPatient.id,
      encounterId: selectedPatient.id,
      cancerProfileId: cancerProfileId || undefined,
      prescriptionNumber: prescriptionNumber || undefined,
      treatmentIntent,
      laterality: laterality || undefined,
      modality,
      technique: technique || undefined,
      totalDoseGy: parseFloat(totalDoseGy),
      dosePerFractionGy: parseFloat(dosePerFractionGy),
      plannedFractions: plannedFractions ? parseInt(plannedFractions, 10) : undefined,
      concurrentChemo,
      plannedStartDate,
      plannedEndDate: plannedEndDate || undefined,
      prescriptionNotes: prescriptionNotes || undefined,
    });
    router.push(`/${params.locale}/oncology/radiation/${rx.id}`);
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
          <h1 className="text-2xl font-bold">New Radiation Prescription</h1>
          <p className="text-muted-foreground text-sm">Create a new radiation therapy prescription</p>
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

        {/* Step 2 — Cancer Diagnosis (optional, shown after patient selected) */}
        {selectedPatient && !cancerProfileId && diagnoses.length > 1 && (
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                    <Dna className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
                </div>
                <span className="text-xs text-muted-foreground italic">optional — skip to proceed</span>
              </div>
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : (
                <div className="space-y-2">
                  {diagnoses.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setCancerProfileId(d.id)}
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
                    onClick={() => setCancerProfileId('')}
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

        {/* Prescription form — gated on patient selection (diagnosis is optional) */}
        {selectedPatient && (
          <>
            {/* Treatment Intent & Site */}
            <Card>
              <CardHeader><CardTitle>Treatment Intent</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Intent *</Label>
                    <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        <SelectItem value="CURATIVE">Curative</SelectItem>
                        <SelectItem value="ADJUVANT">Adjuvant</SelectItem>
                        <SelectItem value="NEOADJUVANT">Neoadjuvant</SelectItem>
                        <SelectItem value="PALLIATIVE">Palliative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Laterality</Label>
                    <Select value={laterality || '__none'} onValueChange={(v) => setLaterality(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Not applicable —</SelectItem>
                        <SelectItem value="LEFT">Left</SelectItem>
                        <SelectItem value="RIGHT">Right</SelectItem>
                        <SelectItem value="BILATERAL">Bilateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prescription #</Label>
                    <Input placeholder="e.g. RX-2024-001" value={prescriptionNumber} onChange={(e) => setPrescriptionNumber(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modality & Technique */}
            <Card>
              <CardHeader><CardTitle>Modality &amp; Technique</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Modality *</Label>
                    <Select value={modality || '__none'} onValueChange={(v) => setModality(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select modality..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        {MODALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Technique</Label>
                    <Select value={technique || '__none'} onValueChange={(v) => setTechnique(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select technique..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        {TECHNIQUES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dose */}
            <Card>
              <CardHeader><CardTitle>Dose Prescription</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Dose (Gy) *</Label>
                    <Input
                      type="number" step="0.01" placeholder="e.g. 60"
                      value={totalDoseGy}
                      onChange={(e) => setTotalDoseGy(e.target.value)}
                      onBlur={calcFractions}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dose / Fraction (Gy) *</Label>
                    <Input
                      type="number" step="0.01" placeholder="e.g. 2"
                      value={dosePerFractionGy}
                      onChange={(e) => setDosePerFractionGy(e.target.value)}
                      onBlur={calcFractions}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Planned Fractions <span className="text-xs text-muted-foreground">auto-calculated</span></Label>
                    <Input
                      type="number" placeholder="Auto-calculated"
                      value={plannedFractions}
                      onChange={(e) => setPlannedFractions(e.target.value)}
                      className={plannedFractions ? 'bg-muted/30' : ''}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox" id="concurrentChemo"
                    checked={concurrentChemo}
                    onChange={(e) => setConcurrentChemo(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="concurrentChemo">Concurrent chemotherapy</Label>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Planned Start Date *</Label>
                    <Input type="date" value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Planned End Date</Label>
                    <Input type="date" value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Prescription Notes</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Clinical rationale, special instructions..."
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={back} disabled={createPrescription.isPending}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!isValid || createPrescription.isPending}>
                {createPrescription.isPending ? 'Saving...' : 'Create Prescription'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
