'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
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

  const { data: diagnosesData } = useCancerDiagnoses();
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  const createPlan = useCreateOncologyCarePlan();
  const isValid = cancerDiagnosisId && treatmentIntent;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Care Plan</h1>
          <p className="text-muted-foreground text-sm">Create a new oncology treatment care plan</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Diagnosis */}
        <Card>
          <CardHeader><CardTitle>Cancer Diagnosis</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Select Diagnosis *</Label>
            <Select value={cancerDiagnosisId} onValueChange={setCancerDiagnosisId}>
              <SelectTrigger><SelectValue placeholder="Select diagnosis..." /></SelectTrigger>
              <SelectContent>
                {diagnoses.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.patientDisplay?.displayName ? `${d.patientDisplay.displayName} — ` : ''}
                    {d.cancer_type} · {d.primary_site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDiagnosis && (
              <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                {selectedDiagnosis.patientDisplay?.displayName}
                {selectedDiagnosis.patientDisplay?.mrn && ` · MRN: ${selectedDiagnosis.patientDisplay.mrn}`}
                {selectedDiagnosis.patientDisplay?.age != null && ` · ${selectedDiagnosis.patientDisplay.age}y`}
                {` · ${selectedDiagnosis.clinical_status}`}
              </div>
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
