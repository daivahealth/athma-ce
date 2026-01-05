'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAdmissionEvents, useCreateAdmissionEvent } from '@/modules/clinical/hooks/use-inpatient';
import { EventCategory, InpatientEventType, type CreateInpatientEventInput } from '@/modules/clinical/types/inpatient';

const eventSchema = z.object({
  eventType: z.nativeEnum(InpatientEventType),
  eventCategory: z.nativeEnum(EventCategory),
  eventData: z.string().min(2, 'Event data JSON is required'),
  notes: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AdmissionEventsPage({ params }: { params: { locale: string; id: string } }) {
  const { toast } = useToast();
  const { data, isLoading } = useAdmissionEvents(params.id);
  const createEvent = useCreateAdmissionEvent(params.id);
  const [lastEvent, setLastEvent] = useState<any>(null);

  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<EventFormValues>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
        eventType: InpatientEventType.ALERT_RAISED,
        eventCategory: EventCategory.ALERT,
        eventData: '{\n  \n}',
      },
    });

  const onSubmit = async (values: EventFormValues) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(values.eventData);
    } catch {
      setError('eventData', { type: 'manual', message: 'Event data must be valid JSON' });
      return;
    }

    const payload: CreateInpatientEventInput = {
      eventType: values.eventType,
      eventCategory: values.eventCategory,
      eventData: parsed,
      notes: values.notes?.trim() || undefined,
    };

    try {
      const response = await createEvent.mutateAsync(payload);
      setLastEvent(response);
      toast({ title: 'Event created', description: 'Event added to the timeline.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to create event.';
      toast({ title: 'Event failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading events...</p>}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-sm text-muted-foreground">No events recorded.</p>
          )}
          {data && data.length > 0 && (
            <div className="space-y-3">
              {data.map((event: any, index: number) => (
                <div key={event.id ?? index} className="rounded-md border p-3">
                  <p className="text-sm font-semibold">{event.eventType ?? 'Event'}</p>
                  <p className="text-xs text-muted-foreground">{event.eventCategory ?? 'category'}</p>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted/40 p-2 text-xs">
                    {JSON.stringify(event.eventData ?? event, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InpatientEventType).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Event Category *</Label>
                <Controller
                  control={control}
                  name="eventCategory"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventCategory).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="eventData">Event Data (JSON) *</Label>
                <Textarea id="eventData" rows={6} {...register('eventData')} />
                {errors.eventData && <p className="text-sm text-destructive">{errors.eventData.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={3} {...register('notes')} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || createEvent.isPending}>
                {createEvent.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {lastEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Event</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto rounded-md bg-muted/40 p-4 text-xs">
              {JSON.stringify(lastEvent, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
