'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useStaging, useUpdateStaging } from '@/plugins/oncology/hooks/use-oncology';

export default function EditStagingPage({ params }: { params: { locale: string; id: string } }) {
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

  if (isLoading) return <div className="text-muted-foreground p-8">Loading...</div>;

  const age = staging?.patient_date_of_birth
    ? Math.floor((Date.now() - new Date(staging.patient_date_of_birth).getTime()) / 31557600000)
    : null;

  const grade = staging?.diagnosis_grade || staging?.grade;
  const histology = staging?.diagnosis_histology || staging?.histology;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Tumor Staging</h1>
          <p className="text-muted-foreground text-sm">
            {staging?.cancer_type && `${staging.cancer_type} · `}{staging?.primary_site}
          </p>
        </div>
      </div>

      {/* Patient + Diagnosis context banner */}
      {staging && (
        <div className="grid grid-cols-2 gap-4">

          {/* Patient card — blue accent */}
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            {/* decorative circle */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">
                {staging.patient_display_name ||
                  `${staging.patient_first_name ?? ''} ${staging.patient_last_name ?? ''}`.trim() ||
                  '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {staging.patient_mrn && (
                  <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                    {staging.patient_mrn}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {age} yrs
                  </span>
                )}
                {staging.patient_gender && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {staging.patient_gender}
                  </span>
                )}
                {staging.patient_phone_number && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {staging.patient_phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cancer Diagnosis card — rose/purple accent */}
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                  <Dna className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">{staging.cancer_type}</p>
              <div className="flex flex-wrap gap-2">
                {staging.primary_site && (
                  <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                    {staging.primary_site}
                    {staging.primary_site_code && (
                      <span className="font-mono ml-1 opacity-70">({staging.primary_site_code})</span>
                    )}
                  </span>
                )}
                {staging.laterality && staging.laterality !== 'not_applicable' && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {staging.laterality}
                  </span>
                )}
                {staging.diagnosis_date && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    Dx {new Date(staging.diagnosis_date).toLocaleDateString()}
                  </span>
                )}
                {staging.metastatic_status && staging.metastatic_status !== 'unknown' && (
                  <span className="inline-flex items-center rounded-md bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 text-xs capitalize font-medium text-amber-700 dark:text-amber-400">
                    {staging.metastatic_status}
                  </span>
                )}
                {staging.clinical_status && (
                  <span className="inline-flex items-center rounded-md bg-emerald-100/70 dark:bg-emerald-900/30 px-2 py-0.5 text-xs capitalize font-medium text-emerald-700 dark:text-emerald-400">
                    {staging.clinical_status}
                  </span>
                )}
                {staging.icd_code && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    {staging.icd_code}
                  </span>
                )}
                {grade && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                    <span className="opacity-70">Grade</span> {grade}
                  </span>
                )}
                {histology && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    <span className="opacity-70">Histology</span>
                    <span className="font-medium text-foreground">{histology}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Staging</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Framework */}
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
                <Input value={stagingEdition} onChange={(e) => setStagingEdition(e.target.value)} placeholder="e.g. 8th" />
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
            {/* Values */}
            <div className="grid grid-cols-4 gap-4 pt-1">
              <div className="space-y-2">
                <Label>Stage Group</Label>
                <Input value={stageGroup} onChange={(e) => setStageGroup(e.target.value)} placeholder="e.g. IIA" />
              </div>
              <div className="space-y-2">
                <Label>T</Label>
                <Input value={tCategory} onChange={(e) => setTCategory(e.target.value)} placeholder="e.g. T2" />
              </div>
              <div className="space-y-2">
                <Label>N</Label>
                <Input value={nCategory} onChange={(e) => setNCategory(e.target.value)} placeholder="e.g. N1" />
              </div>
              <div className="space-y-2">
                <Label>M</Label>
                <Input value={mCategory} onChange={(e) => setMCategory(e.target.value)} placeholder="e.g. M0" />
              </div>
            </div>
          </CardContent>
        </Card>

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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={back} disabled={updateStaging.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || updateStaging.isPending}>
            {updateStaging.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
