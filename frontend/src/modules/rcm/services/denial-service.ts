import { rcmClaimsClient } from '@/lib/api/client';
import type {
  Appeal,
  CreateAppealInput,
  CreateDenialInput,
  Denial,
  DenialFilters,
  DenialListResponse,
  FileAppealInput,
} from '../types/denial';

class DenialService {
  async list(filters?: DenialFilters): Promise<DenialListResponse> {
    const response = await rcmClaimsClient.get('/denials', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Denial> {
    const response = await rcmClaimsClient.get(`/denials/${id}`);
    return response.data;
  }

  async create(payload: CreateDenialInput): Promise<Denial> {
    const response = await rcmClaimsClient.post('/denials', payload);
    return response.data;
  }

  async draftAppeal(denialId: string, payload: CreateAppealInput): Promise<Appeal> {
    const response = await rcmClaimsClient.post(`/denials/${denialId}/appeals`, payload);
    return response.data;
  }

  async fileAppeal(appealId: string, payload?: FileAppealInput): Promise<Appeal> {
    const response = await rcmClaimsClient.post(`/appeals/${appealId}/file`, payload ?? {});
    return response.data;
  }
}

export const denialService = new DenialService();
