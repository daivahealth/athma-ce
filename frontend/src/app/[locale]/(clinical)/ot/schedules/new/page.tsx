'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, CalendarCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import {
  useCheckOtScheduleConflicts,
  useCreateOtSchedule,
  useOtRequests,
  useOtRooms,
} from '@/modules/ot/hooks/use-ot';
import type { CreateOtScheduleInput } from '@/modules/ot/types';

const EMPTY_FORM: CreateOtScheduleInput = {
  otRequestId: '',
  otRoomSpaceId: '',
  scheduledStartTime: '',
  scheduledEndTime: '',
  primarySurgeonId: '',
  assistantSurgeonIds: [],
  anaesthetistId: '',
  scrubNurseId: '',
  circulatingNurseId: '',
  technicianId: '',
  anaesthesiaType: '',
  teamMembers: [],
};

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function NewOtSchedulePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [notes, setNotes] = useState('');

  const { data: requests } = useOtRequests();
  const { data: rooms } = useOtRooms({ includeInactive: false });
  const { data: staff } = useStaffList();

  const eligibleRequests = useMemo(
    () => (requests ?? []).filter((request) => ['APPROVED', 'SCHEDULED'].includes(request.status)),
    [requests]
  );

  const conflictPayload =
    form.otRoomSpaceId && form.scheduledStartTime && form.scheduledEndTime
      ? {
          otRoomSpaceId: form.otRoomSpaceId,
          scheduledStartTime: new Date(form.scheduledStartTime).toISOString(),
          scheduledEndTime: new Date(form.scheduledEndTime).toISOString(),
          staffIds: [
            form.primarySurgeonId,
            form.anaesthetistId,
            form.scrubNurseId,
            form.circulatingNurseId,
            form.technicianId,
          ].filter(Boolean) as string[],
        }
      : undefined;

  const { data: conflicts } = useCheckOtScheduleConflicts(conflictPayload);
  const createSchedule = useCreateOtSchedule();

  const setField = <K extends keyof CreateOtScheduleInput>(key: K, value: CreateOtScheduleInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setNotes('');
  };

  const handleCreate = async () => {
    if (!form.otRequestId || !form.otRoomSpaceId || !form.scheduledStartTime || !form.scheduledEndTime) {
      publishToast({
        variant: 'destructive',
        title: 'Missing required fields',
        description: 'Request, room, start time, and end time are required.',
      });
      return;
    }

    try {
      await createSchedule.mutateAsync({
        ...form,
        scheduledStartTime: new Date(form.scheduledStartTime).toISOString(),
        scheduledEndTime: new Date(form.scheduledEndTime).toISOString(),
        primarySurgeonId: form.primarySurgeonId || undefined,
        anaesthetistId: form.anaesthetistId || undefined,
        scrubNurseId: form.scrubNurseId || undefined,
        circulatingNurseId: form.circulatingNurseId || undefined,
        technicianId: form.technicianId || undefined,
        anaesthesiaType: form.anaesthesiaType || undefined,
      });

      publishToast({
        title: 'OT schedule created',
        description: 'The OT request is now scheduled.',
      });
      router.push(`/${params.locale}/ot/schedules`);
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to create OT schedule',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/ot/schedules`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule OT Case</CardTitle>
          <CardDescription>Create a current OT slot for an approved request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>OT Request</Label>
            <Select value={form.otRequestId || undefined} onValueChange={(value) => setField('otRequestId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select approved request" />
              </SelectTrigger>
              <SelectContent>
                {eligibleRequests.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.procedureName} •{' '}
                    {request.patientDisplay?.displayName || request.patientId}
                    {request.patientDisplay?.mrn ? ` • MRN: ${request.patientDisplay.mrn}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>OT Room</Label>
            <Select value={form.otRoomSpaceId || undefined} onValueChange={(value) => setField('otRoomSpaceId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select OT room" />
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Scheduled Start</Label>
              <Input type="datetime-local" value={toDateTimeInput(form.scheduledStartTime)} onChange={(e) => setField('scheduledStartTime', e.target.value ? new Date(e.target.value).toISOString() : '')} />
            </div>
            <div className="space-y-2">
              <Label>Scheduled End</Label>
              <Input type="datetime-local" value={toDateTimeInput(form.scheduledEndTime)} onChange={(e) => setField('scheduledEndTime', e.target.value ? new Date(e.target.value).toISOString() : '')} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
            <div className="space-y-2">
              <Label>Anaesthetist</Label>
              <Select value={form.anaesthetistId || undefined} onValueChange={(value) => setField('anaesthetistId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select anaesthetist" />
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
              <Label>Scrub Nurse</Label>
              <Select value={form.scrubNurseId || undefined} onValueChange={(value) => setField('scrubNurseId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scrub nurse" />
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
            <div className="space-y-2">
              <Label>Circulating Nurse</Label>
              <Select value={form.circulatingNurseId || undefined} onValueChange={(value) => setField('circulatingNurseId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select circulating nurse" />
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
              <Label>Technician</Label>
              <Select value={form.technicianId || undefined} onValueChange={(value) => setField('technicianId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
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
            <div className="space-y-2">
              <Label>Anaesthesia Type</Label>
              <Input value={form.anaesthesiaType ?? ''} onChange={(e) => setField('anaesthesiaType', e.target.value)} />
            </div>
          </div>

          {conflicts?.hasConflicts ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4" />
                Scheduling conflicts detected
              </div>
              <ul className="space-y-1">
                {conflicts.conflicts.map((conflict, index) => (
                  <li key={`${conflict.resourceId}-${index}`}>{conflict.message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional workflow notes" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCreate} disabled={createSchedule.isPending || conflicts?.hasConflicts}>
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
