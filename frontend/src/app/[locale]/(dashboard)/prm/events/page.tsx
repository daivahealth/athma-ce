'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useIngestEvent } from '@/modules/prm/hooks/use-events';
import type { EventResponse, IngestEventInput, PatientGender } from '@/modules/prm/types/event';

const eventSchema = z.object({
  patient_id: z.string().uuid('Enter a valid patient UUID'),
  patient_display_name: z.string().optional(),
  patient_gender: z.enum(['M', 'F', 'O', 'U']).optional(),
  patient_dob: z.string().optional(),
  patient_age_years_at_event: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).max(130).optional()
  ),
  patient_ref: z.string().optional(),
  patient_mobile_masked: z.string().optional(),
  source_system: z.string().min(1, 'Source system is required'),
  source_module: z.string().min(1, 'Source module is required'),
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

export default function PrmEventsPage() {
  const { toast } = useToast();
  const ingestMutation = useIngestEvent();
  const [lastResponse, setLastResponse] = useState<EventResponse | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      patient_id: '',
      patient_display_name: '',
      patient_gender: undefined,
      patient_dob: '',
      patient_age_years_at_event: undefined,
      patient_ref: '',
      patient_mobile_masked: '',
      source_system: 'zeal-clinical',
      source_module: '',
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

  const onSubmit = async (values: EventFormValues) => {
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(values.payload);
    } catch (err) {
      setError('payload', { type: 'manual', message: 'Payload must be valid JSON' });
      return;
    }

    const normalize = (value?: string) => (value?.trim() ? value.trim() : undefined);

    const request: IngestEventInput = {
      patient_id: values.patient_id.trim(),
      source_system: values.source_system.trim(),
      source_module: values.source_module.trim(),
      event_type: values.event_type.trim(),
      severity: values.severity as 0 | 1 | 2,
      occurred_at: new Date(values.occurred_at).toISOString(),
      entity_type: values.entity_type.trim(),
      entity_id: values.entity_id.trim(),
      payload,
      dedupe_key: values.dedupe_key.trim(),
      patient_display_name: normalize(values.patient_display_name),
      patient_gender: values.patient_gender as PatientGender | undefined,
      patient_dob: normalize(values.patient_dob),
      patient_age_years_at_event: values.patient_age_years_at_event,
      patient_ref: normalize(values.patient_ref),
      patient_mobile_masked: normalize(values.patient_mobile_masked),
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
      <Card>
        <CardHeader>
          <CardTitle>PRM Event Ingestion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient ID *</Label>
              <Input id="patient_id" {...register('patient_id')} placeholder="UUID" />
              {errors.patient_id && (
                <p className="text-sm text-destructive">{errors.patient_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_display_name">Patient Display Name</Label>
              <Input id="patient_display_name" {...register('patient_display_name')} />
            </div>
            <div className="space-y-2">
              <Label>Patient Gender</Label>
              <Controller
                control={control}
                name="patient_gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                      <SelectItem value="U">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_dob">Patient DOB</Label>
              <Input id="patient_dob" type="date" {...register('patient_dob')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_age_years_at_event">Patient Age (Years)</Label>
              <Input id="patient_age_years_at_event" type="number" {...register('patient_age_years_at_event')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_ref">Patient Reference</Label>
              <Input id="patient_ref" {...register('patient_ref')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_mobile_masked">Patient Mobile (Masked)</Label>
              <Input id="patient_mobile_masked" {...register('patient_mobile_masked')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_system">Source System *</Label>
              <Input id="source_system" {...register('source_system')} />
              {errors.source_system && (
                <p className="text-sm text-destructive">{errors.source_system.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_module">Source Module *</Label>
              <Input id="source_module" {...register('source_module')} />
              {errors.source_module && (
                <p className="text-sm text-destructive">{errors.source_module.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type *</Label>
              <Input id="event_type" {...register('event_type')} />
              {errors.event_type && (
                <p className="text-sm text-destructive">{errors.event_type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_subtype">Event Subtype</Label>
              <Input id="event_subtype" {...register('event_subtype')} />
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
              <Label htmlFor="entity_type">Entity Type *</Label>
              <Input id="entity_type" {...register('entity_type')} />
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
