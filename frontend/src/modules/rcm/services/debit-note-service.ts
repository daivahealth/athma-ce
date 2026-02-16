import { rcmClient } from '@/lib/api/client';
import type {
  DebitNote,
  DebitNoteFilters,
  CreateDebitNoteInput,
  UpdateDebitNoteInput,
  VoidDebitNoteInput,
} from '../types/debit-note';

class DebitNoteService {
  async list(filters?: DebitNoteFilters): Promise<DebitNote[]> {
    const response = await rcmClient.get('/debit-notes', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<DebitNote> {
    const response = await rcmClient.get(`/debit-notes/${id}`);
    return response.data;
  }

  async create(payload: CreateDebitNoteInput): Promise<DebitNote> {
    const response = await rcmClient.post('/debit-notes', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateDebitNoteInput): Promise<DebitNote> {
    const response = await rcmClient.put(`/debit-notes/${id}`, payload);
    return response.data;
  }

  async post(id: string): Promise<DebitNote> {
    const response = await rcmClient.post(`/debit-notes/${id}/post`);
    return response.data;
  }

  async void(id: string, payload: VoidDebitNoteInput): Promise<DebitNote> {
    const response = await rcmClient.post(`/debit-notes/${id}/void`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/debit-notes/${id}`);
  }
}

export const debitNoteService = new DebitNoteService();
