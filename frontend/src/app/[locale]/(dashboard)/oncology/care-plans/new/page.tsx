'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarRange, ClipboardList, FileText, Layers, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
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
import { useCancerDiagnoses, useCreateOncologyCarePlan, useProtocols } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis, ChemoProtocol } from '@/plugins/oncology/types';
import {
  ModalityPlanEditor,
  deriveOverallSchedule,
  emptyModalityRow,
  toPlannedModalitiesPayload,
  type ModalityFormRow,
} from '@/plugins/oncology/components/ModalityPlanEditor';

/** A patient picked in `PatientSearchSelect`; only its id is read here. */
type SelectedPatient = { id: string } & Record<string, unknown>;

export default function NewCarePlanPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/care-plans`);

  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');
  const [treatmentIntent, setTreatmentIntent] = useState('');
  const [subspecialty, setSubspecialty] = useState('');
  const [status, setStatus] = useState('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [modalities, setModalities] = useState<ModalityFormRow[]>([emptyModalityRow(1)]);

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

  // Same query the ModalityPlanEditor uses — shared react-query cache
  const { data: protocolsData } = useProtocols(
    selectedDiagnosis ? { cancerType: selectedDiagnosis.cancer_type } : undefined,
  );
  const protocols: ChemoProtocol[] = protocolsData?.data ?? [];

  const createPlan = useCreateOncologyCarePlan();
  const isValid = cancerDiagnosisId && treatmentIntent;

  const handleSelectPatient = (p: SelectedPatient) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerDiagnosisId(''); };

  const handleSubmit = async () => {
    if (!isValid) return;
    await createPlan.mutateAsync({
      cancerDiagnosisId,
      treatmentIntent,
      oncologySubspecialty: subspecialty || undefined,
      status,
      plannedModalities: toPlannedModalitiesPayload(modalities, protocols),
      ...deriveOverallSchedule(modalities),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes || undefined,
      milestones: [],
      followUpSchedule: [],
    } as Parameters<typeof createPlan.mutateAsync>[0]);
    back();
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create Care Plan"
        subtitle="Create a new oncology treatment care plan"
        icon={FileText}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/care-plans`, label: 'Care Plans' }, { label: 'New' }]} />
        }
      />

      <div className="space-y-6">
        {!selectedPatient ? (
          <PatientPickerCard onSelect={handleSelectPatient} onClear={handleClearPatient} />
        ) : (
          <PatientContextCard patient={patientFromSearch(selectedPatient)} onChange={handleClearPatient} />
        )}

        {selectedPatient && !cancerDiagnosisId && (
          <DiagnosisPickerCard
            diagnoses={diagnoses}
            loading={diagnosesLoading}
            onPick={setCancerDiagnosisId}
            onAddNew={() => router.push(`/${params.locale}/oncology/registry/new`)}
          />
        )}

        {selectedDiagnosis && (
          <DiagnosisContextCard
            diagnosis={diagnosisFromCancerDiagnosis(selectedDiagnosis)}
            onChange={diagnoses.length > 1 ? () => setCancerDiagnosisId('') : undefined}
          />
        )}

        {cancerDiagnosisId && (
          <>
            <FormSection icon={ClipboardList} title="Treatment Plan" description="Intent of treatment and the treating subspecialty">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="treatmentIntent" label="Treatment Intent" required>
                  <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                    <SelectTrigger id="treatmentIntent"><SelectValue placeholder="Select..." /></SelectTrigger>
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
                </FormField>
                <FormField id="subspecialty" label="Oncology Subspecialty">
                  <Select value={subspecialty || '__none'} onValueChange={(v) => setSubspecialty(v === '__none' ? '' : v)}>
                    <SelectTrigger id="subspecialty"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Not specified —</SelectItem>
                      <SelectItem value="medical_oncology">Medical Oncology</SelectItem>
                      <SelectItem value="surgical_oncology">Surgical Oncology</SelectItem>
                      <SelectItem value="radiation_oncology">Radiation Oncology</SelectItem>
                      <SelectItem value="hemato_oncology">Haemato-Oncology</SelectItem>
                      <SelectItem value="gynec_oncology">Gynecologic Oncology</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </FormSection>

            {/* Modalities — each with its own schedule (and protocol for chemo) */}
            <Card className="hover:translate-y-0">
              <CardContent className="pt-6">
                <ModalityPlanEditor
                  rows={modalities}
                  onChange={setModalities}
                  cancerType={selectedDiagnosis?.cancer_type}
                />
              </CardContent>
            </Card>

            <FormSection icon={CalendarRange} title="Overall Schedule" description="Start and end of the whole care plan">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="startDate" label="Start Date">
                  <Input id="startDate" type="date" className={FIELD_CONTROL} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </FormField>
                <FormField id="endDate" label="End Date">
                  <Input id="endDate" type="date" className={FIELD_CONTROL} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={Layers} title="Status & Notes" description="Where the plan stands, with any rationale or instructions">
              <FormField id="status" label="Plan Status">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField id="notes" label="Notes">
                <Textarea
                  id="notes"
                  className="min-h-[80px]"
                  placeholder="Additional notes, rationale, or instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createPlan.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createPlan.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createPlan.isPending ? 'Saving...' : 'Create Care Plan'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
