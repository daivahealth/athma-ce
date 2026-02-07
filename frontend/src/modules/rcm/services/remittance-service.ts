import { rcmClaimsClient } from '@/lib/api/client';
import type {
  CreateRemittanceInput,
  Remittance,
  RemittanceFilters,
  RemittanceListResponse,
  ReconcileRemittanceResponse,
} from '../types/remittance';

class RemittanceService {
  async list(filters?: RemittanceFilters): Promise<RemittanceListResponse> {
    const response = await rcmClaimsClient.get('/remittance', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Remittance> {
    const response = await rcmClaimsClient.get(`/remittance/${id}`);
    return response.data;
  }

  async create(payload: CreateRemittanceInput): Promise<Remittance> {
    const response = await rcmClaimsClient.post('/remittance', payload);
    return response.data;
  }

  async reconcile(id: string): Promise<ReconcileRemittanceResponse> {
    const response = await rcmClaimsClient.post(`/remittance/${id}/reconcile`);
    return response.data;
  }
}

export const remittanceService = new RemittanceService();
