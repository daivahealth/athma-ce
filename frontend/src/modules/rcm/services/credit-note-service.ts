import { rcmClient } from '@/lib/api/client';
import type {
  CreditNote,
  CreditNoteFilters,
  CreateCreditNoteInput,
  UpdateCreditNoteInput,
  VoidCreditNoteInput,
} from '../types/credit-note';

class CreditNoteService {
  async list(filters?: CreditNoteFilters): Promise<CreditNote[]> {
    const response = await rcmClient.get('/credit-notes', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<CreditNote> {
    const response = await rcmClient.get(`/credit-notes/${id}`);
    return response.data;
  }

  async create(payload: CreateCreditNoteInput): Promise<CreditNote> {
    const response = await rcmClient.post('/credit-notes', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateCreditNoteInput): Promise<CreditNote> {
    const response = await rcmClient.put(`/credit-notes/${id}`, payload);
    return response.data;
  }

  async post(id: string): Promise<CreditNote> {
    const response = await rcmClient.post(`/credit-notes/${id}/post`);
    return response.data;
  }

  async void(id: string, payload: VoidCreditNoteInput): Promise<CreditNote> {
    const response = await rcmClient.post(`/credit-notes/${id}/void`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/credit-notes/${id}`);
  }
}

export const creditNoteService = new CreditNoteService();
