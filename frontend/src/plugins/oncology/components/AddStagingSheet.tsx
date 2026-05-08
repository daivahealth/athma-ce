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
import { useCancerDiagnoses, useCreateStaging, useUpdateStaging } from '../hooks/use-oncology';
import type { CancerDiagnosis, TumorStaging } from '../types';

interface AddStagingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillDiagnosisId?: string;
  staging?: TumorStaging;
}

const STAGING_SYSTEMS = [
  { value: 'AJCC', label: 'AJCC (TNM)' },
  { value: 'FIGO', label: 'FIGO (Gynecologic)' },
  { value: 'Ann Arbor', label: 'Ann Arbor (Lymphoma)' },
  { value: 'Rai', label: 'Rai (CLL)' },
  { value: 'Binet', label: 'Binet (CLL)' },
  { value: 'Durie-Salmon', label: 'Durie-Salmon (Myeloma)' },
  { value: 'IPSS', label: 'IPSS (MDS)' },
  { value: 'Other', label: 'Other' },
];

const STAGING_TYPES = [
  { value: 'clinical', label: 'Clinical (cTNM)' },
  { value: 'pathological', label: 'Pathological (pTNM)' },
  { value: 'restaging', label: 'Restaging (ycTNM / ypTNM)' },
  { value: 'recurrence', label: 'Recurrence (rTNM)' },
];

const STAGE_GROUPS = [
  'I', 'IA', 'IA1', 'IA2', 'IB', 'IB1', 'IB2',
  'II', 'IIA', 'IIA1', 'IIA2', 'IIB', 'IIC',
  'III', 'IIIA', 'IIIB', 'IIIC', 'IIIC1', 'IIIC2',
  'IV', 'IVA', 'IVB', 'IVC',
  '0', '0a', '0is',
  'A', 'B', 'C',
];

const T_CATEGORIES = ['0', 'is', '1', '1a', '1b', '1c', '2', '2a', '2b', '3', '3a', '3b', '4', '4a', '4b', '4c', 'X'];
const N_CATEGORIES = ['0', '1', '1a', '1b', '1c', '2', '2a', '2b', '2c', '3', '3a', '3b', 'X'];
const M_CATEGORIES = ['0', '1', '1a', '1b', '1c', 'X'];

const GRADES = [
  { value: 'G1', label: 'G1 - Well differentiated' },
  { value: 'G2', label: 'G2 - Moderately differentiated' },
  { value: 'G3', label: 'G3 - Poorly differentiated' },
  { value: 'G4', label: 'G4 - Undifferentiated' },
  { value: 'GX', label: 'GX - Cannot be assessed' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'superseded', label: 'Superseded' },
  { value: 'entered_in_error', label: 'Entered in error' },
];

export function AddStagingSheet({ open, onOpenChange, prefillDiagnosisId, staging }: AddStagingSheetProps) {
  const isEditMode = !!staging;

  const [cancerDiagnosisId, setCancerDiagnosisId] = useState(staging?.cancer_diagnosis_id ?? prefillDiagnosisId ?? '');
  const [stagingSystem, setStagingSystem] = useState(staging?.staging_system ?? 'AJCC');
  const [stagingEdition, setStagingEdition] = useState(staging?.staging_edition ?? '');
  const [stagingType, setStagingType] = useState(staging?.staging_type ?? 'clinical');
  const [stageGroup, setStageGroup] = useState(staging?.stage_group ?? '');
  const [tCategory, setTCategory] = useState(staging?.t_category ?? '');
  const [nCategory, setNCategory] = useState(staging?.n_category ?? '');
  const [mCategory, setMCategory] = useState(staging?.m_category ?? '');
  const [grade, setGrade] = useState(staging?.grade ?? '');
  const [histology, setHistology] = useState(staging?.histology ?? '');
  const [bodysite, setBodysite] = useState(staging?.body_site ?? '');
  const [stagingDate, setStagingDate] = useState(staging?.staging_date ? staging.staging_date.split('T')[0] : '');
  const [status, setStatus] = useState(staging?.status ?? 'active');
  const [notes, setNotes] = useState(staging?.notes ?? '');

  // Re-sync fields when the staging prop changes (e.g. user clicks Edit on a different row)
  useEffect(() => {
    if (staging) {
      setCancerDiagnosisId(staging.cancer_diagnosis_id);
      setStagingSystem(staging.staging_system);
      setStagingEdition(staging.staging_edition ?? '');
      setStagingType(staging.staging_type);
      setStageGroup(staging.stage_group ?? '');
      setTCategory(staging.t_category ?? '');
      setNCategory(staging.n_category ?? '');
      setMCategory(staging.m_category ?? '');
      setGrade(staging.grade ?? '');
      setHistology(staging.histology ?? '');
      setBodysite(staging.body_site ?? '');
      setStagingDate(staging.staging_date ? staging.staging_date.split('T')[0] : '');
      setStatus(staging.status);
      setNotes(staging.notes ?? '');
    }
  }, [staging]);

  const { data: diagnosesData } = useCancerDiagnoses();
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];

  const createStaging = useCreateStaging();
  const updateStaging = useUpdateStaging();

  const isPending = createStaging.isPending || updateStaging.isPending;

  const handleSubmit = async () => {
    if (!cancerDiagnosisId || !stagingSystem || !stagingDate) return;

    const payload: Record<string, unknown> = {
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
      bodySite: bodysite || undefined,
      stagingDate,
      status,
      notes: notes || undefined,
    };

    if (isEditMode && staging) {
      await updateStaging.mutateAsync({ id: staging.id, data: payload });
    } else {
      await createStaging.mutateAsync(payload as Parameters<typeof createStaging.mutateAsync>[0]);
    }

    if (!isEditMode) resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    if (!prefillDiagnosisId) setCancerDiagnosisId('');
    setStagingSystem('AJCC');
    setStagingEdition('');
    setStagingType('clinical');
    setStageGroup('');
    setTCategory('');
    setNCategory('');
    setMCategory('');
    setGrade('');
    setHistology('');
    setBodysite('');
    setStagingDate('');
    setStatus('active');
    setNotes('');
  };

  const isValid = cancerDiagnosisId && stagingSystem && stagingDate;
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[540px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Tumor Staging' : 'Add Tumor Staging'}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Update the staging assessment details'
              : 'Record a new staging assessment linked to a cancer diagnosis'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">

          {/* Cancer Diagnosis Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Cancer Diagnosis *</Label>
            <Select
              value={cancerDiagnosisId}
              onValueChange={setCancerDiagnosisId}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cancer diagnosis..." />
              </SelectTrigger>
              <SelectContent>
                {diagnoses.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.cancer_type} — {d.primary_site}
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({new Date(d.diagnosis_date).toLocaleDateString()})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDiagnosis && (
              <p className="text-xs text-muted-foreground">
                {selectedDiagnosis.primary_site}
                {selectedDiagnosis.icd_code && ` · ICD: ${selectedDiagnosis.icd_code}`}
                {selectedDiagnosis.grade && ` · Grade: ${selectedDiagnosis.grade}`}
              </p>
            )}
            {!isEditMode && diagnoses.length === 0 && (
              <p className="text-xs text-yellow-600">
                No cancer diagnoses found. Add a diagnosis in the Oncology Registry first.
              </p>
            )}
          </div>

          {/* Staging System */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Staging System</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>System *</Label>
                <Select value={stagingSystem} onValueChange={setStagingSystem}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGING_SYSTEMS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Edition</Label>
                <Input
                  placeholder="e.g. AJCC 8th, FIGO 2018"
                  value={stagingEdition}
                  onChange={(e) => setStagingEdition(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Staging Type *</Label>
                <Select value={stagingType} onValueChange={setStagingType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGING_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Staging Date *</Label>
                <Input
                  type="date"
                  value={stagingDate}
                  onChange={(e) => setStagingDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stage Classification */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Stage Classification</h3>

            <div className="space-y-2">
              <Label>Stage Group</Label>
              <Select value={stageGroup || '__none'} onValueChange={(v) => setStageGroup(v === '__none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select stage..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Not set —</SelectItem>
                  {STAGE_GROUPS.map((s) => (
                    <SelectItem key={s} value={s}>Stage {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>T Category</Label>
                <Select value={tCategory || '__none'} onValueChange={(v) => setTCategory(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="T" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {T_CATEGORIES.map((t) => (
                      <SelectItem key={t} value={t}>T{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>N Category</Label>
                <Select value={nCategory || '__none'} onValueChange={(v) => setNCategory(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="N" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {N_CATEGORIES.map((n) => (
                      <SelectItem key={n} value={n}>N{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>M Category</Label>
                <Select value={mCategory || '__none'} onValueChange={(v) => setMCategory(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="M" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {M_CATEGORIES.map((m) => (
                      <SelectItem key={m} value={m}>M{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pathology Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Pathology Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade || '__none'} onValueChange={(v) => setGrade(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not set —</SelectItem>
                    {GRADES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Site</Label>
                <Input
                  placeholder="e.g. Left breast, Upper lobe"
                  value={bodysite}
                  onChange={(e) => setBodysite(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Histology</Label>
              <Input
                placeholder="e.g. Infiltrating duct carcinoma NOS"
                value={histology}
                onChange={(e) => setHistology(e.target.value)}
              />
            </div>
          </div>

          {/* Status (edit only) */}
          {isEditMode && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Additional findings, pathology report references..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isPending}
              className="flex-1"
            >
              {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Staging'}
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
