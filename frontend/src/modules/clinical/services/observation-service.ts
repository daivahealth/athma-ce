/**
 * Observation Service
 * Read access to clinical observations (vitals + labs) for a patient.
 */

import { clinicalClient } from '@/lib/api/client';
import type { ClinicalObservation } from '../types/observation';

// Backend responses may be either a bare array or a { data } envelope.
function unwrap<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const data = (payload as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

class ObservationService {
  private basePath = '/observations';

  /** Latest observation value per code for a patient (e.g. most recent vitals). */
  async getLatestByPatient(patientId: string): Promise<ClinicalObservation[]> {
    const response = await clinicalClient.get(`${this.basePath}/patient/${patientId}/latest`);
    return unwrap<ClinicalObservation>(response.data);
  }
}

export const observationService = new ObservationService();
