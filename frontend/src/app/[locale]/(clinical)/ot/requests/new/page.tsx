'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useActivePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import type { Procedure } from '@/modules/foundation/types/catalog';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { useOtRooms, useCreateOtRequest } from '@/modules/ot/hooks/use-ot';
import { OT_REQUEST_PRIORITIES, type CreateOtRequestInput } from '@/modules/ot/types';
import type { Patient } from '@/modules/clinical/types/patient';
import { usePatientCancerSummary } from '@/plugins/oncology/hooks/use-oncology';

const EMPTY_FORM: CreateOtRequestInput = {
  patientId: '',
  encounterId: '',
  procedureName: '',
  surgeryType: '',
  procedureCode: '',
  diagnosis: '',
  priority: 'ELECTIVE',
  expectedDurationMinutes: 90,
  preferredDate: '',
  preferredOtRoomSpaceId: '',
  primarySurgeonId: '',
  anaesthetistRequired: false,
  anaesthesiaTypePlanned: '',
  specialEquipmentRequired: [],
  bloodRequired: false,
  implantsRequired: [],
  remarks: '',
};

function parseCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function NewOtRequestPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [equipmentText, setEquipmentText] = useState('');
  const [implantsText, setImplantsText] = useState('');
  const [procedureQuery, setProcedureQuery] = useState('');
  const [procedurePickerOpen, setProcedurePickerOpen] = useState(false);
  const debouncedProcedureQuery = useDebouncedValue(procedureQuery.trim(), 250);

  const { data: activeEncounters } = useActivePatientEncounters(
    selectedPatient?.id ?? '',
    Boolean(selectedPatient?.id)
  );
  const { data: procedures, isLoading: proceduresLoading } = useProcedures({
    procedureCategory: 'surgical',
    search: debouncedProcedureQuery || undefined,
  });
  const { data: staff } = useStaffList();
  const { data: rooms } = useOtRooms({ includeInactive: false });
  const createRequest = useCreateOtRequest();
  const { data: cancerSummary } = usePatientCancerSummary(selectedPatient?.id ?? '');
  const oncologyDiagnosis = cancerSummary?.diagnoses?.[0] as Record<string, unknown> | undefined;
  const latestStaging = cancerSummary?.stagings?.[0] as Record<string, unknown> | undefined;

  const setField = <K extends keyof CreateOtRequestInput>(key: K, value: CreateOtRequestInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setForm(EMPTY_FORM);
    setEquipmentText('');
    setImplantsText('');
    setProcedureQuery('');
    setProcedurePickerOpen(false);
  };

  const handleProcedureSelect = (procedure: Procedure) => {
    setField('procedureName', procedure.procedureName);
    setField(
      'procedureCode',
      procedure.cptCode ?? procedure.icd10PcsCode ?? procedure.localCode ?? ''
    );
    if (procedure.procedureType) {
      setField('surgeryType', procedure.procedureType);
    }
    if (procedure.estimatedDurationMinutes) {
      setField('expectedDurationMinutes', procedure.estimatedDurationMinutes);
    }
    if (procedure.anesthesiaType) {
      setField('anaesthesiaTypePlanned', procedure.anesthesiaType);
    }
    setProcedureQuery(procedure.procedureName);
    setProcedurePickerOpen(false);
  };

  const handleCreate = async () => {
    if (!form.patientId || !form.encounterId || !form.procedureName.trim()) {
      publishToast({
        variant: 'destructive',
        title: 'Missing required fields',
        description: 'Patient, encounter, and procedure name are required.',
      });
      return;
    }

    try {
      await createRequest.mutateAsync({
        ...form,
        procedureName: form.procedureName.trim(),
        surgeryType: form.surgeryType || undefined,
        procedureCode: form.procedureCode || undefined,
        diagnosis: form.diagnosis || undefined,
        expectedDurationMinutes: form.expectedDurationMinutes || undefined,
        preferredDate: form.preferredDate || undefined,
        preferredOtRoomSpaceId: form.preferredOtRoomSpaceId || undefined,
        primarySurgeonId: form.primarySurgeonId || undefined,
        anaesthesiaTypePlanned: form.anaesthesiaTypePlanned || undefined,
        specialEquipmentRequired: parseCsv(equipmentText),
        implantsRequired: parseCsv(implantsText),
        remarks: form.remarks || undefined,
      });

      publishToast({
        title: 'OT request created',
        description: 'The request was saved in draft status.',
      });
      router.push(`/${params.locale}/ot/requests`);
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to create OT request',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/ot/requests`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create OT Request</CardTitle>
          <CardDescription>Capture the surgical plan before theatre scheduling.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientSearchSelect
            label="Patient"
            selectedPatient={selectedPatient}
            onSelect={(patient) => {
              setSelectedPatient(patient);
              setField('patientId', patient.id);
              setField('encounterId', '');
            }}
            onClear={() => {
              setSelectedPatient(null);
              setField('patientId', '');
              setField('encounterId', '');
            }}
          />

          {oncologyDiagnosis && (
            <div className="rounded-md bg-muted/40 px-3 py-2 text-xs space-y-1">
              <div className="font-medium">
                Oncology context: {oncologyDiagnosis.cancer_type as string}
                {Boolean(oncologyDiagnosis.primary_site) && ` — ${oncologyDiagnosis.primary_site as string}`}
              </div>
              <div className="text-muted-foreground">
                {latestStaging?.stage_group ? `Stage ${latestStaging.stage_group as string} · ` : ''}
                Clinical status: {(oncologyDiagnosis.clinical_status as string)?.replace(/_/g, ' ')}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Active Encounter</Label>
            <Select value={form.encounterId || undefined} onValueChange={(value) => setField('encounterId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select encounter" />
              </SelectTrigger>
              <SelectContent>
                {(activeEncounters ?? []).map((encounter) => (
                  <SelectItem key={encounter.id} value={encounter.id}>
                    {encounter.encounterNumber} • {encounter.encounterClass} • {encounter.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Procedure Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={procedureQuery}
                  onChange={(e) => {
                    setProcedureQuery(e.target.value);
                    setProcedurePickerOpen(true);
                    if (!e.target.value) {
                      setField('procedureName', '');
                      setField('procedureCode', '');
                    }
                  }}
                  onFocus={() => setProcedurePickerOpen(true)}
                  onBlur={() => setTimeout(() => setProcedurePickerOpen(false), 150)}
                  placeholder="Search surgical procedures..."
                  className="pl-10"
                />

                {procedurePickerOpen && (
                  <div className="absolute z-50 mt-2 max-h-72 w-full divide-y overflow-y-auto rounded-xl border border-border/50 bg-background shadow-lg">
                    {!debouncedProcedureQuery && !form.procedureName && (
                      <p className="p-3 text-sm text-muted-foreground">
                        Start typing to search surgical procedures.
                      </p>
                    )}
                    {proceduresLoading && (
                      <p className="p-3 text-sm text-muted-foreground">Loading procedures...</p>
                    )}
                    {!proceduresLoading &&
                      (procedures ?? []).map((procedure) => {
                        const code =
                          procedure.cptCode ?? procedure.icd10PcsCode ?? procedure.localCode ?? 'No code';
                        const subLabel = [
                          procedure.procedureCategory,
                          procedure.bodySystem,
                          procedure.procedureType,
                        ]
                          .filter(Boolean)
                          .join(' • ');

                        return (
                          <button
                            key={procedure.id}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleProcedureSelect(procedure)}
                          >
                            <div className="font-medium">{procedure.procedureName}</div>
                            <div className="text-xs text-muted-foreground">
                              {code}
                              {subLabel ? ` • ${subLabel}` : ''}
                            </div>
                          </button>
                        );
                      })}
                    {!proceduresLoading && debouncedProcedureQuery && (procedures ?? []).length === 0 && (
                      <p className="p-3 text-sm text-muted-foreground">
                        No surgical procedures found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Procedure Code</Label>
              <Input value={form.procedureCode ?? ''} readOnly />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Surgery Type</Label>
              <Input value={form.surgeryType ?? ''} onChange={(e) => setField('surgeryType', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(value) => setField('priority', value as CreateOtRequestInput['priority'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OT_REQUEST_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Diagnosis</Label>
            <Textarea value={form.diagnosis ?? ''} onChange={(e) => setField('diagnosis', e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Expected Duration (minutes)</Label>
              <Input type="number" value={form.expectedDurationMinutes ?? ''} onChange={(e) => setField('expectedDurationMinutes', e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <Input type="date" value={form.preferredDate ?? ''} onChange={(e) => setField('preferredDate', e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred OT Room</Label>
              <Select value={form.preferredOtRoomSpaceId || undefined} onValueChange={(value) => setField('preferredOtRoomSpaceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {(rooms ?? []).map((room) => (
                    <SelectItem key={room.spaceId} value={room.spaceId}>
                      {room.space?.name || room.spaceId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Surgeon</Label>
              <Select value={form.primarySurgeonId || undefined} onValueChange={(value) => setField('primarySurgeonId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select surgeon" />
                </SelectTrigger>
                <SelectContent>
                  {(staff ?? []).map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Anaesthesia Plan</Label>
              <Input value={form.anaesthesiaTypePlanned ?? ''} onChange={(e) => setField('anaesthesiaTypePlanned', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Special Equipment</Label>
              <Input value={equipmentText} onChange={(e) => setEquipmentText(e.target.value)} placeholder="C-arm, microscope" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Implants Required</Label>
            <Input value={implantsText} onChange={(e) => setImplantsText(e.target.value)} placeholder="Implant A, Implant B" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <Checkbox checked={form.anaesthetistRequired ?? false} onChange={(event) => setField('anaesthetistRequired', event.target.checked)} />
              Anaesthetist required
            </label>
            <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <Checkbox checked={form.bloodRequired ?? false} onChange={(event) => setField('bloodRequired', event.target.checked)} />
              Blood required
            </label>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea value={form.remarks ?? ''} onChange={(e) => setField('remarks', e.target.value)} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCreate} disabled={createRequest.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
