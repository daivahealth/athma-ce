import { clinicalClient } from '@/lib/api/client';
import { UpdateVitalsInput, VitalsResponse } from '../types/vitals';

class VitalsService {
  /**
   * Get vitals for an encounter
   */
  async getVitals(encounterId: string): Promise<VitalsResponse> {
    const response = await clinicalClient.get(`/encounters/${encounterId}/vitals`);
    return response.data;
  }

  /**
   * Update vitals for an encounter
   */
  async updateVitals(encounterId: string, data: UpdateVitalsInput): Promise<VitalsResponse> {
    const response = await clinicalClient.patch(`/encounters/${encounterId}/vitals`, data);
    return response.data;
  }
}

export const vitalsService = new VitalsService();
