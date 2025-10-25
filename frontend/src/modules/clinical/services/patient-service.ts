import { clinicalClient } from '@/lib/api/client';
import { BaseApiService, type PaginatedResponse } from '@/lib/api/base-service';
import type {
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  SearchPatientsDto,
} from '../types/patient';

/**
 * Patient Service
 * Handles all API operations for patient management
 */
class PatientService extends BaseApiService<Patient> {
  constructor() {
    super(clinicalClient, '/patients');
  }

  /**
   * Register a new patient
   */
  async registerPatient(data: CreatePatientDto): Promise<Patient> {
    return this.create(data);
  }

  /**
   * Update an existing patient
   */
  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    return this.update(id, data);
  }

  /**
   * Search patients by name, MRN, or contact number
   */
  async searchPatients(params: SearchPatientsDto = {}): Promise<PaginatedResponse<Patient>> {
    const { search, query, ...rest } = params;
    const searchTerm = search || query;

    if (searchTerm) {
      return this.search(searchTerm, rest);
    }

    return this.findAll(rest);
  }

  /**
   * Get patient by MRN
   */
  async getByMrn(mrn: string): Promise<Patient | null> {
    try {
      const response = await this.client.get(`${this.basePath}/mrn/${mrn}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get patient history
   */
  async getPatientHistory(patientId: string) {
    const response = await this.client.get(`${this.basePath}/${patientId}/history`);
    return response.data;
  }

  /**
   * Get patient appointments
   */
  async getPatientAppointments(patientId: string) {
    const response = await this.client.get(`${this.basePath}/${patientId}/appointments`);
    return response.data;
  }

  /**
   * Get patient encounters
   */
  async getPatientEncounters(patientId: string) {
    const response = await this.client.get(`${this.basePath}/${patientId}/encounters`);
    return response.data;
  }

  /**
   * Deactivate a patient (soft delete)
   */
  async deactivatePatient(id: string): Promise<Patient> {
    const response = await this.client.patch(`${this.basePath}/${id}/deactivate`);
    return response.data;
  }

  /**
   * Reactivate a patient
   */
  async reactivatePatient(id: string): Promise<Patient> {
    const response = await this.client.patch(`${this.basePath}/${id}/reactivate`);
    return response.data;
  }
}

// Export singleton instance
export const patientService = new PatientService();
