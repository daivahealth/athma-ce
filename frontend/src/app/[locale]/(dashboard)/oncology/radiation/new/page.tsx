'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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

  // Step 1 — Patient
  const [selectedPatient, setSelectedPatient] = useState<{ id: string } | null>(null);

  // Step 2 — Cancer Profile (active diagnoses)
  const [cancerProfileId, setCancerProfileId] = useState('');

  // Prescription fields
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

  // Auto-calc fractions when dose and dose/fx change
  const calcFractions = () => {
    const total = parseFloat(totalDoseGy);
    const perFx = parseFloat(dosePerFractionGy);
    if (total > 0 && perFx > 0) {
      setPlannedFractions(String(Math.round(total / perFx)));
    }
  };

  // Active diagnoses for selected patient
  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];

  const createPrescription = useCreateRadiationPrescription();
  const isValid = selectedPatient && treatmentIntent && modality && totalDoseGy && dosePerFractionGy && plannedStartDate;

  const handleSelectPatient = (p: { id: string }) => {
    setSelectedPatient(p);
    setCancerProfileId('');
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    const rx = await createPrescription.mutateAsync({
      patientId: selectedPatient!.id,
      encounterId: selectedPatient!.id, // placeholder — encounter resolved at prescription time
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

        {/* Step 1 — Patient */}
        <Card>
          <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
          <CardContent>
            <PatientSearchSelect
              required
              selectedPatient={selectedPatient}
              onSelect={handleSelectPatient}
              onClear={() => { setSelectedPatient(null); setCancerProfileId(''); }}
            />
          </CardContent>
        </Card>

        {/* Step 2 — Cancer Profile */}
        {selectedPatient && (
          <Card>
            <CardHeader><CardTitle>Cancer Profile (Optional)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active cancer diagnoses for this patient.</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Link to an active cancer diagnosis (optional).</p>
                  <div className="space-y-2">
                    {diagnoses.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setCancerProfileId(cancerProfileId === d.id ? '' : d.id)}
                        className={[
                          'w-full text-left px-4 py-3 rounded-md border text-sm transition-colors',
                          cancerProfileId === d.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:bg-muted/40',
                        ].join(' ')}
                      >
                        <div className="font-medium">{d.cancer_type}</div>
                        <div className="text-muted-foreground mt-0.5">
                          {d.primary_site}
                          {d.primary_site_code && <span className="ml-2 font-mono text-xs">{d.primary_site_code}</span>}
                          <span className="ml-3">Diagnosed {new Date(d.diagnosis_date).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prescription fields — shown once patient selected */}
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
              <CardHeader><CardTitle>Modality & Technique</CardTitle></CardHeader>
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
                    <Label>Planned Fractions</Label>
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
