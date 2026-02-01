'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useIngestEvent } from '@/modules/prm/hooks/use-events';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { PRM_EVENT_SUBTYPES, PRM_EVENT_TYPES } from '@/modules/prm/constants/event-types';
import { PRM_ENTITY_TYPES } from '@/modules/prm/constants/entity-types';
import type { EventResponse, IngestEventInput, PatientGender } from '@/modules/prm/types/event';

const eventSchema = z.object({
  patient_id: z.string().uuid('Enter a valid patient UUID'),
  source_system: z.string().min(1, 'Source system is required'),
  event_type: z.string().min(1, 'Event type is required'),
  event_subtype: z.string().optional(),
  severity: z.coerce.number().int().min(0).max(2).default(0),
  occurred_at: z.string().min(1, 'Occurred at is required'),
  entity_type: z.string().min(1, 'Entity type is required'),
  entity_id: z.string().uuid('Enter a valid entity UUID'),
  payload: z.string().min(2, 'Payload JSON is required'),
  correlation_id: z.string().optional(),
  dedupe_key: z.string().min(1, 'Dedupe key is required'),
});

type EventFormValues = z.infer<typeof eventSchema>;

const defaultOccurredAt = () => {
  const now = new Date();
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
};

export default function PrmEventNewPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const ingestMutation = useIngestEvent();
  const [lastResponse, setLastResponse] = useState<EventResponse | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      patient_id: '',
      source_system: 'zeal-clinical',
      event_type: '',
      event_subtype: '',
      severity: 0,
      occurred_at: defaultOccurredAt(),
      entity_type: '',
      entity_id: '',
      payload: '{\n  \n}',
      correlation_id: '',
      dedupe_key: '',
    },
  });

  const watchedEventType = watch('event_type');

  const onSubmit = async (values: EventFormValues) => {
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(values.payload);
    } catch (err) {
      setError('payload', { type: 'manual', message: 'Payload must be valid JSON' });
      return;
    }

    const normalize = (value?: string) => (value?.trim() ? value.trim() : undefined);
    const genderFromPatient = () => {
      if (!selectedPatient?.gender) return undefined;
      const normalized = String(selectedPatient.gender).toLowerCase();
      if (normalized === 'male') return 'M';
      if (normalized === 'female') return 'F';
      if (normalized === 'other') return 'O';
      return 'U';
    };

    const request: IngestEventInput = {
      patient_id: values.patient_id.trim(),
      source_system: values.source_system.trim(),
      source_module: values.entity_type.trim(),
      event_type: values.event_type.trim(),
      severity: values.severity as 0 | 1 | 2,
      occurred_at: new Date(values.occurred_at).toISOString(),
      entity_type: values.entity_type.trim(),
      entity_id: values.entity_id.trim(),
      payload,
      dedupe_key: values.dedupe_key.trim(),
      patient_display_name: selectedPatient
        ? normalize(selectedPatient.displayName || `${selectedPatient.firstName} ${selectedPatient.lastName}`)
        : undefined,
      patient_gender: (genderFromPatient() as PatientGender | undefined) ?? undefined,
      patient_dob: normalize(selectedPatient?.dateOfBirth),
      patient_age_years_at_event:
        typeof selectedPatient?.age === 'number' ? selectedPatient.age : undefined,
      patient_mrn: normalize(selectedPatient?.mrn),
      patient_mobile_masked: normalize(selectedPatient?.phoneNumber),
      event_subtype: normalize(values.event_subtype),
      correlation_id: normalize(values.correlation_id),
    };

    try {
      const response = await ingestMutation.mutateAsync(request);
      setLastResponse(response);
      toast({
        title: response.duplicate ? 'Duplicate event skipped' : 'Event ingested',
        description: `${response.jobs_created} jobs created · ${response.rules_evaluated} rules evaluated`,
        variant: response.duplicate ? 'default' : 'success',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to ingest event.';
      toast({ title: 'Ingestion failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/prm/events`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New PRM Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="md:col-span-2">
              <PatientSearchSelect
                required
                selectedPatient={selectedPatient}
                onSelect={(patient) => {
                  setSelectedPatient(patient);
                  setValue('patient_id', patient.id, { shouldValidate: true });
                }}
                onClear={() => {
                  setSelectedPatient(null);
                  setValue('patient_id', '');
                }}
                error={errors.patient_id?.message}
              />
              <input type="hidden" {...register('patient_id')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_system">Source System *</Label>
              <Input id="source_system" {...register('source_system')} />
              {errors.source_system && (
                <p className="text-sm text-destructive">{errors.source_system.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Event Type *</Label>
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="event_type"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue('event_subtype', '');
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRM_EVENT_TYPES.map((eventType) => (
                          <SelectItem key={eventType} value={eventType}>
                            {eventType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setValue('event_type', '');
                    setValue('event_subtype', '');
                  }}
                >
                  Clear
                </Button>
              </div>
              {errors.event_type && (
                <p className="text-sm text-destructive">{errors.event_type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Event Subtype</Label>
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="event_subtype"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchedEventType}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select event subtype" />
                      </SelectTrigger>
                      <SelectContent>
                        {(PRM_EVENT_SUBTYPES[watchedEventType] || []).map((subtype) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('event_subtype', '')}
                  disabled={!watchedEventType}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Severity *</Label>
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Info</SelectItem>
                      <SelectItem value="1">Warning</SelectItem>
                      <SelectItem value="2">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occurred_at">Occurred At *</Label>
              <Input id="occurred_at" type="datetime-local" {...register('occurred_at')} />
              {errors.occurred_at && (
                <p className="text-sm text-destructive">{errors.occurred_at.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Entity Type *</Label>
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="entity_type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRM_ENTITY_TYPES.map((entityType) => (
                          <SelectItem key={entityType} value={entityType}>
                            {entityType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('entity_type', '')}
                >
                  Clear
                </Button>
              </div>
              {errors.entity_type && (
                <p className="text-sm text-destructive">{errors.entity_type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity_id">Entity ID *</Label>
              <Input id="entity_id" {...register('entity_id')} placeholder="UUID" />
              {errors.entity_id && (
                <p className="text-sm text-destructive">{errors.entity_id.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="payload">Payload JSON *</Label>
              <Textarea id="payload" rows={6} {...register('payload')} />
              {errors.payload && (
                <p className="text-sm text-destructive">{errors.payload.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="correlation_id">Correlation ID</Label>
              <Input id="correlation_id" {...register('correlation_id')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dedupe_key">Dedupe Key *</Label>
              <Input id="dedupe_key" {...register('dedupe_key')} />
              {errors.dedupe_key && (
                <p className="text-sm text-destructive">{errors.dedupe_key.message}</p>
              )}
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <Button type="submit" disabled={isSubmitting || ingestMutation.isPending}>
                {ingestMutation.isPending ? 'Submitting...' : 'Ingest Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {lastResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Ingestion</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event ID</p>
              <p className="text-sm font-semibold">{lastResponse.event_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duplicate</p>
              <p className="text-sm font-semibold">{lastResponse.duplicate ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rules Evaluated</p>
              <p className="text-sm font-semibold">{lastResponse.rules_evaluated}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jobs Created</p>
              <p className="text-sm font-semibold">{lastResponse.jobs_created}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
