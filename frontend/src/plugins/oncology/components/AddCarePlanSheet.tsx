'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useCancerDiagnoses, useCreateOncologyCarePlan, useUpdateOncologyCarePlan } from '../hooks/use-oncology';
import type { CancerDiagnosis, OncologyCarePlan, TreatmentModality, OncologySubspecialty } from '../types';

interface AddCarePlanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carePlan?: OncologyCarePlan;
}

interface ModalityRow {
  modality: TreatmentModality | '';
  sequence: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  details: string;
}

const TREATMENT_INTENTS = [
  { value: 'curative', label: 'Curative' },
  { value: 'adjuvant', label: 'Adjuvant' },
  { value: 'neoadjuvant', label: 'Neoadjuvant' },
  { value: 'palliative', label: 'Palliative' },
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'supportive', label: 'Supportive' },
];

const SUBSPECIALTIES: { value: OncologySubspecialty; label: string }[] = [
  { value: 'medical_oncology', label: 'Medical Oncology' },
  { value: 'surgical_oncology', label: 'Surgical Oncology' },
  { value: 'radiation_oncology', label: 'Radiation Oncology' },
  { value: 'hemato_oncology', label: 'Haemato-Oncology' },
  { value: 'gynec_oncology', label: 'Gynecologic Oncology' },
];

const MODALITIES: { value: TreatmentModality; label: string }[] = [
  { value: 'surgery', label: 'Surgery' },
  { value: 'chemotherapy', label: 'Chemotherapy' },
  { value: 'radiation', label: 'Radiation' },
  { value: 'immunotherapy', label: 'Immunotherapy' },
  { value: 'hormonal', label: 'Hormonal Therapy' },
  { value: 'targeted', label: 'Targeted Therapy' },
  { value: 'palliative', label: 'Palliative Care' },
  { value: 'surveillance', label: 'Surveillance' },
];

const PLAN_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function defaultModalities(plan?: OncologyCarePlan): ModalityRow[] {
  if (plan?.planned_modalities?.length) {
    return plan.planned_modalities.map((m) => ({
      modality: m.modality,
      sequence: m.sequence,
      status: m.status,
      details: m.details ?? '',
    }));
  }
  return [{ modality: '', sequence: 1, status: 'planned', details: '' }];
}

export function AddCarePlanSheet({ open, onOpenChange, carePlan }: AddCarePlanSheetProps) {
  const isEditMode = !!carePlan;

  const [cancerDiagnosisId, setCancerDiagnosisId] = useState(carePlan?.cancer_diagnosis_id ?? '');
  const [treatmentIntent, setTreatmentIntent] = useState(carePlan?.treatment_intent ?? '');
  const [subspecialty, setSubspecialty] = useState<string>(carePlan?.oncology_subspecialty ?? '');
  const [status, setStatus] = useState<string>(carePlan?.status ?? 'draft');
  const [plannedCycles, setPlannedCycles] = useState(carePlan?.planned_cycles?.toString() ?? '');
  const [cycleDurationDays, setCycleDurationDays] = useState(carePlan?.cycle_duration_days?.toString() ?? '');
  const [startDate, setStartDate] = useState(carePlan?.start_date?.substring(0, 10) ?? '');
  const [endDate, setEndDate] = useState(carePlan?.end_date?.substring(0, 10) ?? '');
  const [notes, setNotes] = useState(carePlan?.notes ?? '');
  const [modalities, setModalities] = useState<ModalityRow[]>(defaultModalities(carePlan));

  useEffect(() => {
    if (carePlan) {
      setCancerDiagnosisId(carePlan.cancer_diagnosis_id);
      setTreatmentIntent(carePlan.treatment_intent);
      setSubspecialty(carePlan.oncology_subspecialty ?? '');
      setStatus(carePlan.status);
      setPlannedCycles(carePlan.planned_cycles?.toString() ?? '');
      setCycleDurationDays(carePlan.cycle_duration_days?.toString() ?? '');
      setStartDate(carePlan.start_date?.substring(0, 10) ?? '');
      setEndDate(carePlan.end_date?.substring(0, 10) ?? '');
      setNotes(carePlan.notes ?? '');
      setModalities(defaultModalities(carePlan));
    }
  }, [carePlan]);

  const { data: diagnosesData } = useCancerDiagnoses();
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  const createPlan = useCreateOncologyCarePlan();
  const updatePlan = useUpdateOncologyCarePlan();
  const isPending = createPlan.isPending || updatePlan.isPending;

  const addModality = () =>
    setModalities((prev) => [
      ...prev,
      { modality: '', sequence: prev.length + 1, status: 'planned', details: '' },
    ]);

  const removeModality = (i: number) =>
    setModalities((prev) =>
      prev
        .filter((_, idx) => idx !== i)
        .map((m, idx) => ({ ...m, sequence: idx + 1 })),
    );

  const updateModality = (i: number, field: keyof ModalityRow, value: string | number) => {
    setModalities((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async () => {
    if (!cancerDiagnosisId || !treatmentIntent) return;

    const filledModalities = modalities
      .filter((m) => m.modality)
      .map((m) => ({
        modality: m.modality,
        sequence: m.sequence,
        status: m.status,
        details: m.details || undefined,
      }));

    const payload = {
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
    };

    if (isEditMode && carePlan) {
      await updatePlan.mutateAsync({ id: carePlan.id, data: payload });
    } else {
      await createPlan.mutateAsync(payload as Parameters<typeof createPlan.mutateAsync>[0]);
      resetForm();
    }
    onOpenChange(false);
  };

  const resetForm = () => {
    setCancerDiagnosisId('');
    setTreatmentIntent('');
    setSubspecialty('');
    setStatus('draft');
    setPlannedCycles('');
    setCycleDurationDays('');
    setStartDate('');
    setEndDate('');
    setNotes('');
    setModalities([{ modality: '', sequence: 1, status: 'planned', details: '' }]);
  };

  const isValid = cancerDiagnosisId && treatmentIntent;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[580px] sm:max-w-[580px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Care Plan' : 'Create Care Plan'}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Update the oncology care plan details'
              : 'Create a new treatment care plan linked to a cancer diagnosis'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">

          {/* Cancer Diagnosis */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Cancer Diagnosis *</Label>
            <Select
              value={cancerDiagnosisId}
              onValueChange={setCancerDiagnosisId}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diagnosis..." />
              </SelectTrigger>
              <SelectContent>
                {diagnoses.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex flex-col">
                      <span>
                        {d.patientDisplay?.displayName
                          ? `${d.patientDisplay.displayName} — `
                          : ''}
                        {d.cancer_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {d.primary_site} · {new Date(d.diagnosis_date).toLocaleDateString()}
                        {d.patientDisplay?.mrn ? ` · MRN: ${d.patientDisplay.mrn}` : ''}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDiagnosis && (
              <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
                {selectedDiagnosis.patientDisplay && (
                  <p className="text-xs font-medium">
                    {selectedDiagnosis.patientDisplay.displayName}
                    {selectedDiagnosis.patientDisplay.mrn && (
                      <span className="ml-2 font-normal text-muted-foreground">
                        MRN: {selectedDiagnosis.patientDisplay.mrn}
                      </span>
                    )}
                    {selectedDiagnosis.patientDisplay.gender && (
                      <span className="ml-2 font-normal text-muted-foreground capitalize">
                        {selectedDiagnosis.patientDisplay.gender}
                        {selectedDiagnosis.patientDisplay.age != null
                          ? `, ${selectedDiagnosis.patientDisplay.age}y`
                          : ''}
                      </span>
                    )}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {selectedDiagnosis.clinical_status} · {selectedDiagnosis.metastatic_status}
                  {selectedDiagnosis.grade && ` · Grade: ${selectedDiagnosis.grade}`}
                </p>
              </div>
            )}
            {!isEditMode && diagnoses.length === 0 && (
              <p className="text-xs text-yellow-600">
                No diagnoses found. Add one in the Oncology Registry first.
              </p>
            )}
          </div>

          {/* Intent & Subspecialty */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Treatment Plan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Treatment Intent *</Label>
                <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Select —</SelectItem>
                    {TREATMENT_INTENTS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Oncology Subspecialty</Label>
                <Select value={subspecialty || '__none'} onValueChange={(v) => setSubspecialty(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not specified —</SelectItem>
                    {SUBSPECIALTIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Planned Modalities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-sm font-semibold">Planned Modalities</h3>
              <Button type="button" variant="ghost" size="sm" onClick={addModality}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>

            {modalities.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Select
                    value={m.modality || '__none'}
                    onValueChange={(v) => updateModality(i, 'modality', v === '__none' ? '' : v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Modality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Modality —</SelectItem>
                      {MODALITIES.map((mod) => (
                        <SelectItem key={mod.value} value={mod.value}>{mod.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={m.status}
                    onValueChange={(v) => updateModality(i, 'status', v)}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="h-8 text-xs col-span-2"
                    placeholder="Details (optional)"
                    value={m.details}
                    onChange={(e) => updateModality(i, 'details', e.target.value)}
                  />
                </div>
                {modalities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeModality(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Cycle & Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Planned Cycles</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 6"
                  value={plannedCycles}
                  onChange={(e) => setPlannedCycles(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cycle Duration (days)</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 21"
                  value={cycleDurationDays}
                  onChange={(e) => setCycleDurationDays(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Status & Notes</h3>
            <div className="space-y-2">
              <Label>Plan Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLAN_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
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
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSubmit} disabled={!isValid || isPending} className="flex-1">
              {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Care Plan'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
