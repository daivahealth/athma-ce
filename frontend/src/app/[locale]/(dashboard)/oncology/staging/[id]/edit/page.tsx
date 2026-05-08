'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
  const [grade, setGrade] = useState('');
  const [histology, setHistology] = useState('');
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
      setGrade(staging.grade ?? '');
      setHistology(staging.histology ?? '');
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
        grade: grade || undefined,
        histology: histology || undefined,
        stagingDate,
        status,
        notes: notes || undefined,
      },
    });
    back();
  };

  if (isLoading) return <div className="text-muted-foreground p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Tumor Staging</h1>
          <p className="text-muted-foreground text-sm">
            {staging?.cancer_type && `${staging.cancer_type} · `}{staging?.primary_site}
          </p>
        </div>
      </div>

      <div className="space-y-6">
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
                <Input value={stagingEdition} onChange={(e) => setStagingEdition(e.target.value)} />
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

        <Card>
          <CardHeader><CardTitle>Stage & TNM Categories</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Stage Group</Label>
                <Input value={stageGroup} onChange={(e) => setStageGroup(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>T Category</Label>
                <Input value={tCategory} onChange={(e) => setTCategory(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>N Category</Label>
                <Input value={nCategory} onChange={(e) => setNCategory(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>M Category</Label>
                <Input value={mCategory} onChange={(e) => setMCategory(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Histology</Label>
                <Input value={histology} onChange={(e) => setHistology(e.target.value)} />
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
