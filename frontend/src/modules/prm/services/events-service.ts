import { prmClient } from '@/lib/api/client';
import type { EventResponse, IngestEventInput, ListEventsResponse } from '../types/event';

class EventsService {
  async ingestEvent(payload: IngestEventInput): Promise<EventResponse> {
    const response = await prmClient.post('/v1/events', payload);
    return response.data;
  }

  async listEvents(params: {
    patient_id?: string;
    event_type?: string;
    entity_type?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListEventsResponse> {
    const response = await prmClient.get('/v1/events', { params });
    return response.data;
  }
}

export const eventsService = new EventsService();
