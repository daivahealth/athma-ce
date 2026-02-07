import { rcmClaimsClient } from '@/lib/api/client';
import type {
  CheckEligibilityInput,
  CheckEligibilityResponse,
  EligibilityFilters,
  EligibilityListResponse,
  EligibilityRequest,
} from '../types/eligibility';

class EligibilityService {
  async check(payload: CheckEligibilityInput): Promise<CheckEligibilityResponse> {
    const response = await rcmClaimsClient.post('/eligibility/check', payload);
    return response.data;
  }

  async list(filters?: EligibilityFilters): Promise<EligibilityListResponse> {
    const response = await rcmClaimsClient.get('/eligibility/requests', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<EligibilityRequest> {
    const response = await rcmClaimsClient.get(`/eligibility/requests/${id}`);
    return response.data;
  }
}

export const eligibilityService = new EligibilityService();
