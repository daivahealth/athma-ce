import { useMutation, useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/events-service';
import type { EventResponse, IngestEventInput, ListEventsResponse } from '../types/event';

export function useIngestEvent() {
  return useMutation<EventResponse, Error, IngestEventInput>({
    mutationFn: (payload) => eventsService.ingestEvent(payload),
  });
}

const EVENT_KEYS = {
  all: ['prm-events'] as const,
  list: (params: Record<string, unknown>) => [...EVENT_KEYS.all, params] as const,
};

export function useEvents(params: {
  patient_id?: string;
  event_type?: string;
  entity_type?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<ListEventsResponse>({
    queryKey: EVENT_KEYS.list(params),
    queryFn: () => eventsService.listEvents(params),
  });
}
