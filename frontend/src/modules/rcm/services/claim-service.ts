import { rcmClaimsClient } from '@/lib/api/client';
import type {
  Claim,
  ClaimFilters,
  ClaimFormat,
  ClaimStatistics,
  CreateClaimInput,
  GenerateClaimsInput,
  GenerateClaimsResponse,
  SubmitClaimResponse,
  ValidateClaimResult,
} from '../types/claims';

class ClaimService {
  async list(filters?: ClaimFilters): Promise<{ claims: Claim[]; total: number }> {
    const response = await rcmClaimsClient.get('/claims', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Claim> {
    const response = await rcmClaimsClient.get(`/claims/${id}`);
    return response.data;
  }

  async create(payload: CreateClaimInput): Promise<Claim> {
    const response = await rcmClaimsClient.post('/claims', payload);
    return response.data;
  }

  async generate(payload: GenerateClaimsInput): Promise<GenerateClaimsResponse> {
    const response = await rcmClaimsClient.post('/claims/generate', payload);
    return response.data;
  }

  async validate(id: string): Promise<ValidateClaimResult> {
    const response = await rcmClaimsClient.post(`/claims/${id}/validate`);
    return response.data;
  }

  async submit(id: string): Promise<SubmitClaimResponse> {
    const response = await rcmClaimsClient.post(`/claims/${id}/submit`);
    return response.data;
  }

  async getStatistics(): Promise<ClaimStatistics> {
    const response = await rcmClaimsClient.get('/claims/statistics');
    return response.data;
  }

  async listFormats(): Promise<ClaimFormat[]> {
    const response = await rcmClaimsClient.get('/claims/formats');
    return response.data;
  }
}

export const claimService = new ClaimService();
