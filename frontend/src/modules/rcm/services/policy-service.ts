import { rcmClient } from '@/lib/api/client';
import type { Policy, PolicyStatus } from '../types/policy';

class PolicyService {
  async listByPatient(patientId: string, status?: PolicyStatus): Promise<Policy[]> {
    if (status) {
      const response = await rcmClient.get('/policies', { params: { patientId, status } });
      return response.data;
    }
    const response = await rcmClient.get(`/policies/patient/${patientId}`);
    return response.data;
  }

  async create(payload: any): Promise<Policy> {
    const response = await rcmClient.post('/policies', payload);
    return response.data;
  }

  async archive(id: string): Promise<void> {
    await rcmClient.delete(`/policies/${id}`);
  }
}

export const policyService = new PolicyService();
