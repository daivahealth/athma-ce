import { rcmClient } from '@/lib/api/client';
import type {
  AllocateRefundInput,
  ApproveRefundInput,
  CreateRefundInput,
  ProcessRefundInput,
  Refund,
  RefundFilters,
  RefundStatistics,
  RejectRefundInput,
  UpdateRefundInput,
  VoidRefundInput,
} from '../types/refund';

class RefundService {
  async list(filters?: RefundFilters): Promise<Refund[]> {
    const response = await rcmClient.get('/refunds', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Refund> {
    const response = await rcmClient.get(`/refunds/${id}`);
    return response.data;
  }

  async getByPatient(patientId: string): Promise<Refund[]> {
    const response = await rcmClient.get(`/refunds/patient/${patientId}`);
    return response.data;
  }

  async getByReceipt(receiptId: string): Promise<Refund[]> {
    const response = await rcmClient.get(`/refunds/receipt/${receiptId}`);
    return response.data;
  }

  async getStatistics(filters?: {
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<RefundStatistics> {
    const response = await rcmClient.get('/refunds/statistics', { params: filters });
    return response.data;
  }

  async create(payload: CreateRefundInput): Promise<Refund> {
    const response = await rcmClient.post('/refunds', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}`, payload);
    return response.data;
  }

  async allocate(id: string, payload: AllocateRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}/allocate`, payload);
    return response.data;
  }

  async approve(id: string, payload: ApproveRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}/approve`, payload);
    return response.data;
  }

  async reject(id: string, payload: RejectRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}/reject`, payload);
    return response.data;
  }

  async process(id: string, payload: ProcessRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}/process`, payload);
    return response.data;
  }

  async void(id: string, payload: VoidRefundInput): Promise<Refund> {
    const response = await rcmClient.put(`/refunds/${id}/void`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/refunds/${id}`);
  }
}

export const refundService = new RefundService();
