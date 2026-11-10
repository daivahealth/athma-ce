import { prmClient } from '@/lib/api/client';
import type { Message } from '../types/message';

export interface MessageFilters {
  patientId?: string;
  channel?: string;
  status?: string;
  /** Page size; the server defaults to 50 and caps at 200. */
  limit?: number;
  offset?: number;
}

export interface ListMessagesResponse {
  data: Message[];
  total: number;
  limit: number;
  offset: number;
}

class MessagesService {
  async list(filters?: MessageFilters): Promise<ListMessagesResponse> {
    const response = await prmClient.get('/v1/messages', { params: filters });
    return response.data;
  }

  async get(messageId: string): Promise<Message> {
    const response = await prmClient.get(`/v1/messages/${messageId}`);
    return response.data;
  }
}

export const messagesService = new MessagesService();
