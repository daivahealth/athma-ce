import { useMutation } from '@tanstack/react-query';
import { eventsService } from '../services/events-service';
import type { EventResponse, IngestEventInput } from '../types/event';

export function useIngestEvent() {
  return useMutation<EventResponse, Error, IngestEventInput>({
    mutationFn: (payload) => eventsService.ingestEvent(payload),
  });
}
