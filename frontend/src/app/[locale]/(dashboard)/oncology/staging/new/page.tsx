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
import { useCancerDiagnoses, useCreateStaging } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

export default function NewStagingPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/staging`);

  // Step 1 — Patient
  const [selectedPatient, setSelectedPatient] = useState<{ id: string } | null>(null);

  // Step 2 — Diagnosis (auto-listed once patient is selected)
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');

  // Staging fields
  const [stagingSystem, setStagingSystem] = useState('');
  const [stagingEdition, setStagingEdition] = useState('');
  const [stagingType, setStagingType] = useState('clinical');
  const [stageGroup, setStageGroup] = useState('');
  const [tCategory, setTCategory] = useState('');
  const [nCategory, setNCategory] = useState('');
  const [mCategory, setMCategory] = useState('');
  const [grade, setGrade] = useState('');
  const [histology, setHistology] = useState('');
  const [stagingDate, setStagingDate] = useState('');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');

  // Active diagnoses for the selected patient — fetched automatically once patient is chosen
  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient
      ? { patientId: selectedPatient.id, clinicalStatus: 'active' }
      : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  const createStaging = useCreateStaging();
  const isValid = cancerDiagnosisId && stagingSystem && stagingDate;

  const handleSelectPatient = (p: { id: string }) => {
    setSelectedPatient(p);
    setCancerDiagnosisId('');
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setCancerDiagnosisId('');
  };

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
      grade: grade || undefined,
      histology: histology || undefined,
      stagingDate,
      status,
      notes: notes || undefined,
    } as Record<string, unknown>);
    back();
  };

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

        {/* Step 1 — Patient */}
        <Card>
          <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
          <CardContent>
            <PatientSearchSelect
              required
              selectedPatient={selectedPatient}
              onSelect={handleSelectPatient}
              onClear={handleClearPatient}
            />
          </CardContent>
        </Card>

        {/* Step 2 — Cancer Diagnosis (auto-listed once patient selected) */}
        {selectedPatient && (
          <Card>
            <CardHeader><CardTitle>Active Cancer Diagnosis</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active cancer diagnoses found for this patient.{' '}
                  <button
                    className="underline text-primary"
                    onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}
                  >
                    Add one first
                  </button>
                </p>
              ) : (
                <>
                  <Label>Select Diagnosis *</Label>
                  <div className="space-y-2">
                    {diagnoses.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setCancerDiagnosisId(d.id)}
                        className={[
                          'w-full text-left px-4 py-3 rounded-md border text-sm transition-colors',
                          cancerDiagnosisId === d.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:bg-muted/40',
                        ].join(' ')}
                      >
                        <div className="font-medium">{d.cancer_type}</div>
                        <div className="text-muted-foreground mt-0.5">
                          {d.primary_site}
                          {d.primary_site_code && (
                            <span className="ml-2 font-mono text-xs">{d.primary_site_code}</span>
                          )}
                          <span className="ml-3">
                            Diagnosed {new Date(d.diagnosis_date).toLocaleDateString()}
                          </span>
                          {d.grade && <span className="ml-3">{d.grade}</span>}
                        </div>
                        {d.histology_morphology && (
                          <div className="text-xs text-muted-foreground mt-0.5">{d.histology_morphology}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Remaining cards — only shown once a diagnosis is selected */}
        {cancerDiagnosisId && (
          <>
            {/* Staging System */}
            <Card>
              <CardHeader><CardTitle>Staging System</CardTitle></CardHeader>
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
              </CardContent>
            </Card>

            {/* TNM */}
            <Card>
              <CardHeader><CardTitle>Stage & TNM Categories</CardTitle></CardHeader>
              <CardContent className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Input placeholder="e.g. G2" value={grade} onChange={(e) => setGrade(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Histology</Label>
                    <Input
                      placeholder={selectedDiagnosis?.histology_morphology ?? 'e.g. Adenocarcinoma'}
                      value={histology}
                      onChange={(e) => setHistology(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Status */}
            <Card>
              <CardHeader><CardTitle>Date & Status</CardTitle></CardHeader>
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
