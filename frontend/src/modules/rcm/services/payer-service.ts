import { rcmClient } from '@/lib/api/client';
import type {
  Payer,
  CreatePayerInput,
  UpdatePayerInput,
  PayerFilters,
  PayerStatistics,
} from '../types/payer';

class PayerService {
  async list(filters?: PayerFilters): Promise<Payer[]> {
    const response = await rcmClient.get('/payers', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Payer> {
    const response = await rcmClient.get(`/payers/${id}`);
    return response.data;
  }

  async create(payload: CreatePayerInput): Promise<Payer> {
    const response = await rcmClient.post('/payers', payload);
    return response.data;
  }

  async update(id: string, payload: UpdatePayerInput): Promise<Payer> {
    const response = await rcmClient.put(`/payers/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/payers/${id}`);
  }

  async getStatistics(): Promise<PayerStatistics> {
    const response = await rcmClient.get('/payers/statistics');
    return response.data;
  }
}

export const payerService = new PayerService();
