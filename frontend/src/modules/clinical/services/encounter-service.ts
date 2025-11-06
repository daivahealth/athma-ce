/**
 * Encounter Service
 * Handles all API operations for encounter management
 */

import { clinicalClient } from '@/lib/api/client';
import type { PaginatedResponse } from '@/lib/api/base-service';
import type {
  Encounter,
  CreateEncounterInput,
  UpdateEncounterInput,
  SearchEncounterParams,
} from '../types/encounter';

class EncounterService {
  private basePath = '/encounters';

  /**
   * Create a new encounter
   */
  async createEncounter(data: CreateEncounterInput): Promise<Encounter> {
    const response = await clinicalClient.post(this.basePath, data);
    return response.data;
  }

  /**
   * Search encounters with filters
   */
  async searchEncounters(params: SearchEncounterParams = {}): Promise<PaginatedResponse<Encounter>> {
    const response = await clinicalClient.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Get encounter by ID
   */
  async getEncounter(id: string): Promise<Encounter> {
    const response = await clinicalClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Update encounter
   */
  async updateEncounter(id: string, data: UpdateEncounterInput): Promise<Encounter> {
    const response = await clinicalClient.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Update encounter status
   */
  async updateEncounterStatus(id: string, status: string): Promise<Encounter> {
    const response = await clinicalClient.patch(`${this.basePath}/${id}/status`, { status });
    return response.data;
  }

  /**
   * Get patient encounters
   */
  async getPatientEncounters(patientId: string): Promise<Encounter[]> {
    const response = await clinicalClient.get(`${this.basePath}/patient/${patientId}`);
    return response.data;
  }

  /**
   * Get today's encounters for a facility
   */
  async getTodayEncounters(facilityId: string): Promise<Encounter[]> {
    const response = await clinicalClient.get(`${this.basePath}/facility/${facilityId}/today`);
    return response.data;
  }
}

// Export singleton instance
export const encounterService = new EncounterService();
