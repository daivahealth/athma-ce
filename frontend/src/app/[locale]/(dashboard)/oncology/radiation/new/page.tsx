'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, Gauge, Radiation, Save, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FIELD_CONTROL, FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import {
  DiagnosisContextCard,
  DiagnosisPickerCard,
  PatientContextCard,
  PatientPickerCard,
  diagnosisFromCancerDiagnosis,
  patientFromSearch,
} from '@/plugins/oncology/components/FormContextCards';
import {
  useCancerDiagnoses,
  useCreateRadiationPrescription,
} from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

const MODALITIES = ['PHOTON', 'ELECTRON', 'PROTON', 'BRACHY'];
const TECHNIQUES = ['3DCRT', 'IMRT', 'VMAT', 'SBRT', 'SRS', 'ELECTRON', 'HDR', 'LDR'];

/** A patient as `PatientSearchSelect` returns it; only the id is read here. */
type SearchPatient = { id: string } & Record<string, unknown>;

export default function NewRadiationPrescriptionPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/radiation`);

  const [selectedPatient, setSelectedPatient] = useState<SearchPatient | null>(null);
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

  const handleSelectPatient = (p: SearchPatient) => { setSelectedPatient(p); setCancerProfileId(''); };
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

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New Radiation Prescription"
        subtitle="Create a new radiation therapy prescription"
        icon={Radiation}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/radiation`, label: 'Radiation Oncology' }, { label: 'New' }]} />
        }
      />

      <div className="space-y-6">
        {!selectedPatient ? (
          <PatientPickerCard onSelect={handleSelectPatient} onClear={handleClearPatient} />
        ) : (
          <PatientContextCard patient={patientFromSearch(selectedPatient)} onChange={handleClearPatient} />
        )}

        {/* Cancer diagnosis is optional here; the picker only shows when there is more than one to choose from */}
        {selectedPatient && !cancerProfileId && diagnoses.length > 1 && (
          <div className="space-y-2">
            <DiagnosisPickerCard
              diagnoses={diagnoses}
              loading={diagnosesLoading}
              onPick={setCancerProfileId}
              onAddNew={() => router.push(`/${params.locale}/oncology/registry/new`)}
            />
            <p className="text-xs italic text-muted-foreground">Cancer diagnosis is optional — skip to proceed.</p>
          </div>
        )}

        {selectedDiagnosis && (
          <DiagnosisContextCard
            diagnosis={diagnosisFromCancerDiagnosis(selectedDiagnosis)}
            onChange={diagnoses.length > 1 ? () => setCancerProfileId('') : undefined}
          />
        )}

        {selectedPatient && (
          <>
            <FormSection icon={Target} title="Treatment Intent" description="Why the course is given and which side is treated">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="treatmentIntent" label="Intent" required>
                  <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                    <SelectTrigger id="treatmentIntent"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Select —</SelectItem>
                      <SelectItem value="CURATIVE">Curative</SelectItem>
                      <SelectItem value="ADJUVANT">Adjuvant</SelectItem>
                      <SelectItem value="NEOADJUVANT">Neoadjuvant</SelectItem>
                      <SelectItem value="PALLIATIVE">Palliative</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="laterality" label="Laterality">
                  <Select value={laterality || '__none'} onValueChange={(v) => setLaterality(v === '__none' ? '' : v)}>
                    <SelectTrigger id="laterality"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Not applicable —</SelectItem>
                      <SelectItem value="LEFT">Left</SelectItem>
                      <SelectItem value="RIGHT">Right</SelectItem>
                      <SelectItem value="BILATERAL">Bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="prescriptionNumber" label="Prescription #">
                  <Input id="prescriptionNumber" placeholder="e.g. RX-2024-001" value={prescriptionNumber} onChange={(e) => setPrescriptionNumber(e.target.value)} />
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={Radiation} title="Modality & Technique" description="Beam type and delivery technique">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="modality" label="Modality" required>
                  <Select value={modality || '__none'} onValueChange={(v) => setModality(v === '__none' ? '' : v)}>
                    <SelectTrigger id="modality"><SelectValue placeholder="Select modality..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Select —</SelectItem>
                      {MODALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="technique" label="Technique">
                  <Select value={technique || '__none'} onValueChange={(v) => setTechnique(v === '__none' ? '' : v)}>
                    <SelectTrigger id="technique"><SelectValue placeholder="Select technique..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Select —</SelectItem>
                      {TECHNIQUES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={Gauge} title="Dose Prescription" description="Total dose, dose per fraction and the resulting fraction count">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="totalDoseGy" label="Total Dose (Gy)" required>
                  <Input
                    id="totalDoseGy"
                    type="number" step="0.01" placeholder="e.g. 60"
                    value={totalDoseGy}
                    onChange={(e) => setTotalDoseGy(e.target.value)}
                    onBlur={calcFractions}
                  />
                </FormField>
                <FormField id="dosePerFractionGy" label="Dose / Fraction (Gy)" required>
                  <Input
                    id="dosePerFractionGy"
                    type="number" step="0.01" placeholder="e.g. 2"
                    value={dosePerFractionGy}
                    onChange={(e) => setDosePerFractionGy(e.target.value)}
                    onBlur={calcFractions}
                  />
                </FormField>
                <FormField id="plannedFractions" label={<>Planned Fractions <span className="text-xs text-muted-foreground">auto-calculated</span></>}>
                  <Input
                    id="plannedFractions"
                    type="number" placeholder="Auto-calculated"
                    value={plannedFractions}
                    onChange={(e) => setPlannedFractions(e.target.value)}
                    className={plannedFractions ? 'bg-muted/30' : ''}
                  />
                </FormField>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id="concurrentChemo"
                  checked={concurrentChemo}
                  onChange={(e) => setConcurrentChemo(e.target.checked)}
                  className="rounded border-input accent-primary"
                />
                <Label htmlFor="concurrentChemo">Concurrent chemotherapy</Label>
              </div>
            </FormSection>

            <FormSection icon={CalendarDays} title="Schedule" description="Planned course dates and prescription notes">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="plannedStartDate" label="Planned Start Date" required>
                  <Input id="plannedStartDate" type="date" className={FIELD_CONTROL} value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} />
                </FormField>
                <FormField id="plannedEndDate" label="Planned End Date">
                  <Input id="plannedEndDate" type="date" className={FIELD_CONTROL} value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} />
                </FormField>
              </div>
              <FormField id="prescriptionNotes" label="Prescription Notes">
                <Textarea
                  id="prescriptionNotes"
                  className="min-h-[80px]"
                  placeholder="Clinical rationale, special instructions..."
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createPrescription.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createPrescription.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createPrescription.isPending ? 'Saving...' : 'Create Prescription'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
