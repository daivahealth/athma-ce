import { rcmClaimsClient } from '@/lib/api/client';
import type {
  Batch,
  BatchFilters,
  BatchGenerateResponse,
  BatchListResponse,
  CreateBatchInput,
} from '../types/batches';

class BatchService {
  async list(filters?: BatchFilters): Promise<BatchListResponse> {
    const response = await rcmClaimsClient.get('/batches', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Batch> {
    const response = await rcmClaimsClient.get(`/batches/${id}`);
    return response.data;
  }

  async create(payload: CreateBatchInput): Promise<Batch> {
    const response = await rcmClaimsClient.post('/batches', payload);
    return response.data;
  }

  async addClaims(id: string, claimIds: string[]): Promise<Batch> {
    const response = await rcmClaimsClient.post(`/batches/${id}/add-claims`, { claimIds });
    return response.data;
  }

  async removeClaims(id: string, claimIds: string[]): Promise<Batch> {
    const response = await rcmClaimsClient.post(`/batches/${id}/remove-claims`, { claimIds });
    return response.data;
  }

  async close(id: string): Promise<Batch> {
    const response = await rcmClaimsClient.post(`/batches/${id}/close`);
    return response.data;
  }

  async generate(id: string): Promise<BatchGenerateResponse> {
    const response = await rcmClaimsClient.post(`/batches/${id}/generate`);
    return response.data;
  }

  async submit(id: string): Promise<Batch> {
    const response = await rcmClaimsClient.post(`/batches/${id}/submit`);
    return response.data;
  }
}

export const batchService = new BatchService();
