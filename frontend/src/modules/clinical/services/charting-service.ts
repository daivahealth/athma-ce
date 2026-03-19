import { clinicalClient } from '@/lib/api/client';
import type {
  ClinicalNote,
  CreateClinicalNoteInput,
  UpdateClinicalNoteInput,
  SignNoteInput,
  Diagnosis,
  CreateDiagnosisInput,
  UpdateDiagnosisInput,
  ClinicalOrder,
  CreateClinicalOrderInput,
  UpdateClinicalOrderInput,
  AddOrderResultInput,
  Prescription,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from '../types/charting';

type LegacySectionsPayload = {
  sections?: unknown;
  content?: Record<string, any>;
};

function normalizeClinicalNotePayload<T extends LegacySectionsPayload>(payload: T): T {
  const { sections, content, ...rest } = payload;

  if (sections === undefined) {
    return payload;
  }

  const normalizedContent = content ?? { sections };

  return {
    ...rest,
    content: normalizedContent,
  } as T;
}

class ChartingService {
  // ========================================
  // CLINICAL NOTES
  // ========================================

  async createClinicalNote(payload: CreateClinicalNoteInput): Promise<ClinicalNote> {
    const response = await clinicalClient.post(
      '/encounter-notes',
      normalizeClinicalNotePayload(payload)
    );
    return response.data;
  }

  async getClinicalNote(id: string): Promise<ClinicalNote> {
    const response = await clinicalClient.get(`/encounter-notes/${id}`);
    return response.data;
  }

  async getClinicalNotesByEncounter(encounterId: string): Promise<ClinicalNote[]> {
    const response = await clinicalClient.get(`/encounter-notes/encounter/${encounterId}`);
    return response.data;
  }

  async getClinicalNotesByPatient(
    patientId: string,
    limit?: number
  ): Promise<ClinicalNote[]> {
    const response = await clinicalClient.get(`/encounter-notes/patient/${patientId}`, {
      params: { limit },
    });
    return response.data;
  }

  async updateClinicalNote(
    id: string,
    payload: UpdateClinicalNoteInput
  ): Promise<ClinicalNote> {
    const response = await clinicalClient.patch(
      `/encounter-notes/${id}`,
      normalizeClinicalNotePayload(payload)
    );
    return response.data;
  }

  async signClinicalNote(id: string, payload: SignNoteInput): Promise<ClinicalNote> {
    const response = await clinicalClient.post(`/encounter-notes/${id}/sign`, payload);
    return response.data;
  }

  async deleteClinicalNote(id: string): Promise<void> {
    await clinicalClient.delete(`/encounter-notes/${id}`);
  }

  async getClinicalNoteStatistics(encounterId: string): Promise<any> {
    const response = await clinicalClient.get(
      `/encounter-notes/encounter/${encounterId}/statistics`
    );
    return response.data;
  }

  // ========================================
  // DIAGNOSES
  // ========================================

  async createDiagnosis(payload: CreateDiagnosisInput): Promise<Diagnosis> {
    const response = await clinicalClient.post('/diagnoses', payload);
    return response.data;
  }

  async getDiagnosis(id: string): Promise<Diagnosis> {
    const response = await clinicalClient.get(`/diagnoses/${id}`);
    return response.data;
  }

  async getDiagnosesByEncounter(encounterId: string): Promise<Diagnosis[]> {
    const response = await clinicalClient.get(`/diagnoses/encounter/${encounterId}`);
    return response.data;
  }

  async getDiagnosesByPatient(patientId: string): Promise<Diagnosis[]> {
    const response = await clinicalClient.get(`/diagnoses/patient/${patientId}`);
    return response.data;
  }

  async updateDiagnosis(id: string, payload: UpdateDiagnosisInput): Promise<Diagnosis> {
    const response = await clinicalClient.patch(`/diagnoses/${id}`, payload);
    return response.data;
  }

  async verifyDiagnosis(id: string, verifiedBy: string): Promise<Diagnosis> {
    const response = await clinicalClient.post(`/diagnoses/${id}/verify`, { verifiedBy });
    return response.data;
  }

  async deleteDiagnosis(id: string): Promise<void> {
    await clinicalClient.delete(`/diagnoses/${id}`);
  }

  // ========================================
  // CLINICAL ORDERS
  // ========================================

  async createClinicalOrder(payload: CreateClinicalOrderInput): Promise<ClinicalOrder> {
    const response = await clinicalClient.post('/clinical-orders', payload);
    return response.data;
  }

  async getClinicalOrder(id: string): Promise<ClinicalOrder> {
    const response = await clinicalClient.get(`/clinical-orders/${id}`);
    return response.data;
  }

  async getClinicalOrdersByEncounter(encounterId: string): Promise<ClinicalOrder[]> {
    const response = await clinicalClient.get(`/clinical-orders/encounter/${encounterId}`);
    return response.data;
  }

  async getClinicalOrdersByPatient(patientId: string): Promise<ClinicalOrder[]> {
    const response = await clinicalClient.get(`/clinical-orders/patient/${patientId}`);
    return response.data;
  }

  async updateClinicalOrder(
    id: string,
    payload: UpdateClinicalOrderInput
  ): Promise<ClinicalOrder> {
    const response = await clinicalClient.patch(`/clinical-orders/${id}`, payload);
    return response.data;
  }

  async addOrderResult(id: string, payload: AddOrderResultInput): Promise<ClinicalOrder> {
    const response = await clinicalClient.post(`/clinical-orders/${id}/result`, payload);
    return response.data;
  }

  async cancelClinicalOrder(id: string, reason: string): Promise<ClinicalOrder> {
    const response = await clinicalClient.post(`/clinical-orders/${id}/cancel`, { reason });
    return response.data;
  }

  async deleteClinicalOrder(id: string): Promise<void> {
    await clinicalClient.delete(`/clinical-orders/${id}`);
  }

  // ========================================
  // PRESCRIPTIONS
  // ========================================

  async createPrescription(payload: CreatePrescriptionInput): Promise<Prescription> {
    console.log('chartingService.createPrescription payload', payload);
    const response = await clinicalClient.post('/prescriptions', payload);
    return response.data;
  }

  async getPrescription(id: string): Promise<Prescription> {
    const response = await clinicalClient.get(`/prescriptions/${id}`);
    return response.data;
  }

  async getPrescriptionsByEncounter(encounterId: string): Promise<Prescription[]> {
    const response = await clinicalClient.get(`/prescriptions/encounter/${encounterId}`);
    return response.data;
  }

  async getActivePrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    const response = await clinicalClient.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  }

  async updatePrescription(
    id: string,
    payload: UpdatePrescriptionInput
  ): Promise<Prescription> {
    const response = await clinicalClient.patch(`/prescriptions/${id}`, payload);
    return response.data;
  }

  async discontinuePrescription(id: string, reason?: string): Promise<Prescription> {
    const response = await clinicalClient.post(`/prescriptions/${id}/discontinue`, {
      reason,
    });
    return response.data;
  }

  async deletePrescription(id: string): Promise<void> {
    await clinicalClient.delete(`/prescriptions/${id}`);
  }
}

export const chartingService = new ChartingService();
