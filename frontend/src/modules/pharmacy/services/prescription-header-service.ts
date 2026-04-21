import { clinicalClient } from '@/lib/api/client';

export interface PrescriptionDrugItemResponse {
  id: string;
  drugCode: string;
  codeSystem: string;
  drugName: string;
  drugNameAr?: string | null;
  genericName?: string | null;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string | null;
  quantity?: string | null;
  refills: number;
  instructions?: string | null;
  instructionsAr?: string | null;
  status: string;
}

export interface PrescriptionHeaderResponse {
  id: string;
  tenantId: string;
  prescriptionNumber: string;
  version: number;
  parentId?: string | null;
  encounterId: string;
  patientId: string;
  status: string;
  prescribedBy: string;
  prescribedByName?: string | null;
  prescribedAt: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  mrn?: string | null;
  patientDisplayName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  encounterNumber?: string | null;
  encounterType?: string | null;
  items: PrescriptionDrugItemResponse[];
}

class PrescriptionHeaderService {
  async getById(id: string): Promise<PrescriptionHeaderResponse> {
    const response = await clinicalClient.get(`/prescription-headers/${id}`);
    return response.data;
  }

  async listByEncounter(encounterId: string): Promise<PrescriptionHeaderResponse[]> {
    const response = await clinicalClient.get(`/prescription-headers/encounter/${encounterId}`);
    return response.data;
  }
}

export const prescriptionHeaderService = new PrescriptionHeaderService();
