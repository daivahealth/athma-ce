import { rcmClient } from '@/lib/api/client';
import type {
  AllocateReceiptInput,
  CreateReceiptInput,
  Receipt,
  ReceiptFilters,
  ReceiptStatistics,
  UpdateReceiptInput,
} from '../types/receipt';

class ReceiptService {
  async list(filters?: ReceiptFilters): Promise<Receipt[]> {
    const response = await rcmClient.get('/receipts', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Receipt> {
    const response = await rcmClient.get(`/receipts/${id}`);
    return response.data;
  }

  async getByNumber(receiptNumber: string): Promise<Receipt> {
    const response = await rcmClient.get(`/receipts/number/${receiptNumber}`);
    return response.data;
  }

  async getByPatient(patientId: string): Promise<Receipt[]> {
    const response = await rcmClient.get(`/receipts/patient/${patientId}`);
    return response.data;
  }

  async getStatistics(): Promise<ReceiptStatistics> {
    const response = await rcmClient.get('/receipts/statistics');
    return response.data;
  }

  async create(payload: CreateReceiptInput): Promise<Receipt> {
    const response = await rcmClient.post('/receipts', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateReceiptInput): Promise<Receipt> {
    const response = await rcmClient.put(`/receipts/${id}`, payload);
    return response.data;
  }

  async allocate(id: string, payload: AllocateReceiptInput): Promise<Receipt> {
    const response = await rcmClient.put(`/receipts/${id}/allocate`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/receipts/${id}`);
  }
}

export const receiptService = new ReceiptService();
