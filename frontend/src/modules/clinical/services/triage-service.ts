import type { AxiosError } from 'axios';
import { clinicalClient } from '@/lib/api/client';
import type {
  CreateTriageInput,
  UpdateTriageInput,
  TriageRecord,
} from '../types/triage';

class TriageService {
  async getByEncounter(encounterId: string): Promise<TriageRecord | null> {
    try {
      const { data } = await clinicalClient.get(`/triage/encounter/${encounterId}`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(payload: CreateTriageInput): Promise<TriageRecord> {
    const { data } = await clinicalClient.post('/triage', payload);
    return data;
  }

  async update(id: string, payload: UpdateTriageInput): Promise<TriageRecord> {
    const { data } = await clinicalClient.put(`/triage/${id}`, payload);
    return data;
  }
}

export const triageService = new TriageService();
