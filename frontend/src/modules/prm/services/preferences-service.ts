import { prmClient } from '@/lib/api/client';
import type { PatientPreferences } from '../types/preference';

class PreferencesService {
  async get(patientId: string): Promise<PatientPreferences> {
    const response = await prmClient.get(`/v1/patients/${patientId}/preferences`);
    return response.data;
  }

  async update(patientId: string, payload: PatientPreferences): Promise<PatientPreferences> {
    const response = await prmClient.put(`/v1/patients/${patientId}/preferences`, payload);
    return response.data;
  }
}

export const preferencesService = new PreferencesService();
