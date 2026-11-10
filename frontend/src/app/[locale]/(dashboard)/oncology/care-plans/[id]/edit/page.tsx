'use client';

import { useEffect, useState } from 'react';
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
import { DiagnosisContextCard, PatientContextCard } from '@/plugins/oncology/components/FormContextCards';
import { LoadingState } from '@/plugins/oncology/components/shared';
import { useOncologyCarePlan, PICKER_LIMIT, useProtocols, useUpdateOncologyCarePlan } from '@/plugins/oncology/hooks/use-oncology';
import type { ChemoProtocol } from '@/plugins/oncology/types';
import {
  ModalityPlanEditor,
  deriveOverallSchedule,
  emptyModalityRow,
  fromPlannedModalities,
  toPlannedModalitiesPayload,
  type ModalityFormRow,
} from '@/plugins/oncology/components/ModalityPlanEditor';

export default function EditCarePlanPage() {
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/care-plans`);

  const { data: carePlan, isLoading } = useOncologyCarePlan(params.id);
  const updatePlan = useUpdateOncologyCarePlan();

  const [treatmentIntent, setTreatmentIntent] = useState('');
  const [subspecialty, setSubspecialty] = useState('');
  const [status, setStatus] = useState('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [modalities, setModalities] = useState<ModalityFormRow[]>([emptyModalityRow(1)]);

  useEffect(() => {
    if (carePlan) {
      setTreatmentIntent(carePlan.treatment_intent ?? '');
      setSubspecialty(carePlan.oncology_subspecialty ?? '');
      setStatus(carePlan.status ?? 'draft');
      setStartDate(carePlan.start_date?.substring(0, 10) ?? '');
      setEndDate(carePlan.end_date?.substring(0, 10) ?? '');
      setNotes(carePlan.notes ?? '');
      setModalities(fromPlannedModalities(carePlan.planned_modalities));
    }
  }, [carePlan]);

  // Same query the ModalityPlanEditor uses — shared react-query cache
  const { data: protocolsData } = useProtocols({
    cancerType: carePlan?.cancer_type || undefined,
    limit: PICKER_LIMIT,
  });
  const protocols: ChemoProtocol[] = protocolsData?.data ?? [];

  const isValid = treatmentIntent;

  const handleSubmit = async () => {
    if (!isValid) return;
    await updatePlan.mutateAsync({
      id: params.id,
      data: {
        treatmentIntent,
        oncologySubspecialty: subspecialty || undefined,
        status,
        plannedModalities: toPlannedModalitiesPayload(modalities, protocols),
        ...deriveOverallSchedule(modalities),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes || undefined,
      },
    });
    back();
  };

  const header = (
    <PageHeader
      title="Edit Care Plan"
      subtitle={carePlan?.plan_number ?? undefined}
      icon={FileText}
      breadcrumb={
        <Breadcrumb items={[{ href: `/${params.locale}/oncology/care-plans`, label: 'Care Plans' }, { label: 'Edit' }]} />
      }
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-6 page-transition">
        {header}
        <LoadingState />
      </div>
    );
  }

  const patient = carePlan?.patientDisplay;

  return (
    <div className="space-y-6 page-transition">
      {header}

      {carePlan && (
        <div className="grid gap-4 md:grid-cols-2">
          <PatientContextCard
            patient={{
              name: patient?.displayName || '—',
              mrn: patient?.mrn,
              dateOfBirth: patient?.dateOfBirth,
              gender: patient?.gender,
              phone: patient?.phoneNumber,
            }}
          />
          <DiagnosisContextCard
            diagnosis={{
              cancerType: carePlan.cancer_type || '—',
              primarySite: carePlan.primary_site,
              primarySiteCode: carePlan.primary_site_code,
              laterality: carePlan.laterality,
              diagnosisDate: carePlan.diagnosis_date,
              metastaticStatus: carePlan.metastatic_status,
              clinicalStatus: carePlan.clinical_status,
              grade: carePlan.diagnosis_grade,
              histology: carePlan.diagnosis_histology,
            }}
          />
        </div>
      )}

      <div className="space-y-6">
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
              cancerType={carePlan?.cancer_type}
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
            <Textarea id="notes" className="min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        </FormSection>

        <FormActions onCancel={back} busy={updatePlan.isPending}>
          <Button onClick={handleSubmit} disabled={!isValid || updatePlan.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updatePlan.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </FormActions>
      </div>
    </div>
  );
}
