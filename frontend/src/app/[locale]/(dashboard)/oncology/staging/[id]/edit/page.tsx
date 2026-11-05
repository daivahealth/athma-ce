'use client';

import { useEffect, useState } from 'react';
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
import { DiagnosisContextCard, PatientContextCard, patientFromRecord } from '@/plugins/oncology/components/FormContextCards';
import { LoadingState } from '@/plugins/oncology/components/shared';
import { useStaging, useUpdateStaging } from '@/plugins/oncology/hooks/use-oncology';

export default function EditStagingPage() {
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/staging`);

  const { data: staging, isLoading } = useStaging(params.id);
  const updateStaging = useUpdateStaging();

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

  useEffect(() => {
    if (staging) {
      setStagingSystem(staging.staging_system ?? '');
      setStagingEdition(staging.staging_edition ?? '');
      setStagingType(staging.staging_type ?? 'clinical');
      setStageGroup(staging.stage_group ?? '');
      setTCategory(staging.t_category ?? '');
      setNCategory(staging.n_category ?? '');
      setMCategory(staging.m_category ?? '');
      setStagingDate(staging.staging_date?.substring(0, 10) ?? '');
      setStatus(staging.status ?? 'active');
      setNotes(staging.notes ?? '');
    }
  }, [staging]);

  const isValid = stagingSystem && stagingDate;

  const handleSubmit = async () => {
    if (!isValid) return;
    await updateStaging.mutateAsync({
      id: params.id,
      data: {
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
      },
    });
    back();
  };

  const header = (
    <PageHeader
      title="Edit Tumor Staging"
      subtitle={staging ? `${staging.cancer_type ? `${staging.cancer_type} · ` : ''}${staging.primary_site ?? ''}` : undefined}
      icon={Target}
      breadcrumb={
        <Breadcrumb items={[{ href: `/${params.locale}/oncology/staging`, label: 'Tumor Staging' }, { label: 'Edit' }]} />
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

  return (
    <div className="space-y-6 page-transition">
      {header}

      {staging && (
        <div className="grid gap-4 md:grid-cols-2">
          <PatientContextCard patient={patientFromRecord(staging)} />
          <DiagnosisContextCard
            diagnosis={{
              cancerType: staging.cancer_type,
              primarySite: staging.primary_site,
              primarySiteCode: staging.primary_site_code,
              laterality: staging.laterality,
              diagnosisDate: staging.diagnosis_date,
              metastaticStatus: staging.metastatic_status,
              clinicalStatus: staging.clinical_status,
              icdCode: staging.icd_code,
              grade: staging.diagnosis_grade || staging.grade,
              histology: staging.diagnosis_histology || staging.histology,
            }}
          />
        </div>
      )}

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
            <Input id="stagingEdition" value={stagingEdition} onChange={(e) => setStagingEdition(e.target.value)} placeholder="e.g. 8th" />
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
            <Input id="stageGroup" value={stageGroup} onChange={(e) => setStageGroup(e.target.value)} placeholder="e.g. IIA" />
          </FormField>
          <FormField id="tCategory" label="T">
            <Input id="tCategory" value={tCategory} onChange={(e) => setTCategory(e.target.value)} placeholder="e.g. T2" />
          </FormField>
          <FormField id="nCategory" label="N">
            <Input id="nCategory" value={nCategory} onChange={(e) => setNCategory(e.target.value)} placeholder="e.g. N1" />
          </FormField>
          <FormField id="mCategory" label="M">
            <Input id="mCategory" value={mCategory} onChange={(e) => setMCategory(e.target.value)} placeholder="e.g. M0" />
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
          <Textarea id="notes" className="min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </FormSection>

      <FormActions onCancel={back} busy={updateStaging.isPending}>
        <Button onClick={handleSubmit} disabled={!isValid || updateStaging.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {updateStaging.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </FormActions>
    </div>
  );
}
