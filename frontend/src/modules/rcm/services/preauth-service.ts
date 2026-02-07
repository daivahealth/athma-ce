import { rcmClaimsClient } from '@/lib/api/client';
import type {
  CreatePreAuthInput,
  PreAuthFilters,
  PreAuthListResponse,
  PreAuthRequest,
  UpdatePreAuthInput,
} from '../types/preauth';

class PreAuthService {
  async list(filters?: PreAuthFilters): Promise<PreAuthListResponse> {
    const response = await rcmClaimsClient.get('/preauth', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<PreAuthRequest> {
    const response = await rcmClaimsClient.get(`/preauth/${id}`);
    return response.data;
  }

  async create(payload: CreatePreAuthInput): Promise<PreAuthRequest> {
    const response = await rcmClaimsClient.post('/preauth', payload);
    return response.data;
  }

  async update(id: string, payload: UpdatePreAuthInput): Promise<PreAuthRequest> {
    const response = await rcmClaimsClient.put(`/preauth/${id}`, payload);
    return response.data;
  }

  async submit(id: string): Promise<PreAuthRequest> {
    const response = await rcmClaimsClient.post(`/preauth/${id}/submit`);
    return response.data;
  }

  async cancel(id: string): Promise<void> {
    await rcmClaimsClient.delete(`/preauth/${id}`);
  }
}

export const preAuthService = new PreAuthService();
