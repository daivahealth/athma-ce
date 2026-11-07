'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, Save, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useCancerDiagnoses, useCreateStaging } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

type SelectedPatient = { id: string } & Record<string, unknown>;

export default function NewStagingPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/staging`);

  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');

  const [stagingSystem, setStagingSystem] = useState('');
  const [stagingEdition, setStagingEdition] = useState('');
  const [stagingType, setStagingType] = useState('clinical');
  const [stageGroup, setStageGroup] = useState('');
  const [tCategory, setTCategory] = useState('');
  const [nCategory, setNCategory] = useState('');
  const [mCategory, setMCategory] = useState('');
  const [stagingDate, setStagingDate] = useState('');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');

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

  const createStaging = useCreateStaging();
  const isValid = cancerDiagnosisId && stagingSystem && stagingDate;

  const handleSelectPatient = (p: SelectedPatient) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerDiagnosisId(''); };

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
      stagingDate,
      status,
      notes: notes || undefined,
    } as Record<string, unknown>);
    back();
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Add Tumor Staging"
        subtitle="Record a TNM staging assessment for a cancer diagnosis"
        icon={Target}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/staging`, label: 'Tumor Staging' }, { label: 'New' }]} />
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
            <FormSection icon={Target} title="Staging" description="Staging system, type and TNM categories">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="stagingSystem" label="System" required>
                  <Select value={stagingSystem || '__none'} onValueChange={(v) => setStagingSystem(v === '__none' ? '' : v)}>
                    <SelectTrigger id="stagingSystem"><SelectValue placeholder="Select..." /></SelectTrigger>
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
                </FormField>
                <FormField id="stagingEdition" label="Edition">
                  <Input id="stagingEdition" placeholder="e.g. 8th" value={stagingEdition} onChange={(e) => setStagingEdition(e.target.value)} />
                </FormField>
                <FormField id="stagingType" label="Staging Type">
                  <Select value={stagingType} onValueChange={setStagingType}>
                    <SelectTrigger id="stagingType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinical">Clinical</SelectItem>
                      <SelectItem value="pathological">Pathological</SelectItem>
                      <SelectItem value="restaging">Restaging</SelectItem>
                      <SelectItem value="recurrence">Recurrence</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <FormField id="stageGroup" label="Stage Group">
                  <Input id="stageGroup" placeholder="e.g. IIIA" value={stageGroup} onChange={(e) => setStageGroup(e.target.value)} />
                </FormField>
                <FormField id="tCategory" label="T Category">
                  <Input id="tCategory" placeholder="e.g. T2" value={tCategory} onChange={(e) => setTCategory(e.target.value)} />
                </FormField>
                <FormField id="nCategory" label="N Category">
                  <Input id="nCategory" placeholder="e.g. N1" value={nCategory} onChange={(e) => setNCategory(e.target.value)} />
                </FormField>
                <FormField id="mCategory" label="M Category">
                  <Input id="mCategory" placeholder="e.g. M0" value={mCategory} onChange={(e) => setMCategory(e.target.value)} />
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={CalendarDays} title="Date & Status" description="When the assessment was made and whether it is current">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="stagingDate" label="Staging Date" required>
                  <Input id="stagingDate" type="date" className={FIELD_CONTROL} value={stagingDate} onChange={(e) => setStagingDate(e.target.value)} />
                </FormField>
                <FormField id="status" label="Status">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="superseded">Superseded</SelectItem>
                      <SelectItem value="entered_in_error">Entered in Error</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField id="notes" label="Notes">
                <Textarea
                  id="notes"
                  className="min-h-[80px]"
                  placeholder="Staging notes or clinical context..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createStaging.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createStaging.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createStaging.isPending ? 'Saving...' : 'Add Staging'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
