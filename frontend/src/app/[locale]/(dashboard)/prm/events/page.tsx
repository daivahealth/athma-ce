'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/modules/prm/hooks/use-events';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { PRM_EVENT_TYPES } from '@/modules/prm/constants/event-types';
import { PRM_ENTITY_TYPES } from '@/modules/prm/constants/entity-types';

export default function PrmEventsPage({ params }: { params: { locale: string } }) {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [eventType, setEventType] = useState('all');
  const [entityType, setEntityType] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filters = useMemo(() => {
    return {
      patient_id: patientId || undefined,
      event_type: eventType !== 'all' ? eventType : undefined,
      entity_type: entityType !== 'all' ? entityType : undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };
  }, [patientId, eventType, entityType, page]);

  const { data, isLoading } = useEvents(filters);
  const events = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">PRM Events</h1>
          <p className="text-sm text-muted-foreground">View ingestion events across patients.</p>
        </div>
        <Button asChild>
          <Link href={`/${params.locale}/prm/events/new`}>New Event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <PatientSearchSelect
              selectedPatient={selectedPatient}
              onSelect={(patient) => {
                setSelectedPatient(patient);
                setPatientId(patient.id);
                setPage(1);
              }}
              onClear={() => {
                setSelectedPatient(null);
                setPatientId('');
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select
              value={eventType}
              onValueChange={(value) => {
                setEventType(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {PRM_EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select
              value={entityType}
              onValueChange={(value) => {
                setEntityType(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {PRM_ENTITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading events...</p>}
          {!isLoading && events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events found.</p>
          )}
          {!isLoading && events.length > 0 && (
            <div className="divide-y rounded-md border">
              {events.map((event) => (
                <div key={event.id} className="grid gap-3 p-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Occurred</p>
                    <p className="text-sm font-semibold">
                      {new Date(event.occurred_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Patient</p>
                    <p className="text-sm font-semibold">
                      {event.patient_display_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">MRN: {event.patient_mrn ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Event</p>
                    <p className="text-sm font-semibold">{event.event_type}</p>
                    <p className="text-xs text-muted-foreground">{event.event_subtype ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Entity</p>
                    <p className="text-sm font-semibold">{event.entity_type}</p>
                    <p className="text-xs text-muted-foreground">Severity: {event.severity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + (events.length ? 1 : 0)}-
              {(page - 1) * pageSize + events.length} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!canPrevious}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={!canNext}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
