import { prmClient } from '@/lib/api/client';
import type { EventResponse, IngestEventInput } from '../types/event';

class EventsService {
  async ingestEvent(payload: IngestEventInput): Promise<EventResponse> {
    const response = await prmClient.post('/v1/events', payload);
    return response.data;
  }
}

export const eventsService = new EventsService();
