import { clinicalClient } from '@/lib/api/client';
import type { CancerDiagnosis, TumorStaging, ChemoProtocol, ChemoOrder, TumorBoardCase, OncologyCarePlan } from '../types';

const BASE_URL = '/plugins/oncology';

export const oncologyService = {
  // Cancer Diagnosis
  async listDiagnoses(params?: { patientId?: string; clinicalStatus?: string; cancerType?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/diagnoses`, { params });
    return data;
  },

  async getDiagnosis(id: string): Promise<CancerDiagnosis> {
    const { data } = await clinicalClient.get(`${BASE_URL}/diagnoses/${id}`);
    return data.data;
  },

  async createDiagnosis(diagnosis: Partial<CancerDiagnosis>): Promise<CancerDiagnosis> {
    const { data } = await clinicalClient.post(`${BASE_URL}/diagnoses`, diagnosis);
    return data.data;
  },

  async updateDiagnosis(id: string, diagnosis: Partial<CancerDiagnosis>): Promise<CancerDiagnosis> {
    const { data } = await clinicalClient.put(`${BASE_URL}/diagnoses/${id}`, diagnosis);
    return data.data;
  },

  // Oncology Registry
  async listRegistry(params?: { cancerType?: string; clinicalStatus?: string; search?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/registry`, { params });
    return data;
  },

  async getRegistrySummary(patientId: string) {
    const { data } = await clinicalClient.get(`${BASE_URL}/registry/${patientId}/summary`);
    return data.data;
  },

  // Tumor Staging
  async listStagings(params?: { patientId?: string; cancerDiagnosisId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/staging`, { params });
    return data;
  },

  async getStaging(id: string): Promise<TumorStaging> {
    const { data } = await clinicalClient.get(`${BASE_URL}/staging/${id}`);
    return data.data;
  },

  async createStaging(staging: Partial<TumorStaging>): Promise<TumorStaging> {
    const { data } = await clinicalClient.post(`${BASE_URL}/staging`, staging);
    return data.data;
  },

  // Tumor Board
  async listTumorBoardCases(params?: { status?: string; date?: string; patientId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/tumor-board`, { params });
    return data;
  },

  async createTumorBoardCase(boardCase: Partial<TumorBoardCase>): Promise<TumorBoardCase> {
    const { data } = await clinicalClient.post(`${BASE_URL}/tumor-board`, boardCase);
    return data.data;
  },

  // Oncology Care Plans
  async listCarePlans(params?: { patientId?: string; status?: string; treatmentIntent?: string; cancerDiagnosisId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/care-plans`, { params });
    return data;
  },

  async getCarePlan(id: string): Promise<OncologyCarePlan> {
    const { data } = await clinicalClient.get(`${BASE_URL}/care-plans/${id}`);
    return data.data;
  },

  async createCarePlan(plan: Partial<OncologyCarePlan>): Promise<OncologyCarePlan> {
    const { data } = await clinicalClient.post(`${BASE_URL}/care-plans`, plan);
    return data.data;
  },

  async updateCarePlan(id: string, plan: Partial<OncologyCarePlan>): Promise<OncologyCarePlan> {
    const { data } = await clinicalClient.put(`${BASE_URL}/care-plans/${id}`, plan);
    return data.data;
  },

  async approveCarePlan(id: string, approvedBy: string): Promise<OncologyCarePlan> {
    const { data } = await clinicalClient.post(`${BASE_URL}/care-plans/${id}/approve`, { approvedBy });
    return data.data;
  },

  async reviseCarePlan(id: string, revisionData: Record<string, unknown>): Promise<OncologyCarePlan> {
    const { data } = await clinicalClient.post(`${BASE_URL}/care-plans/${id}/revise`, revisionData);
    return data.data;
  },

  // Chemo Protocols (Phase 2)
  async listProtocols(params?: { cancerType?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/protocols`, { params });
    return data;
  },

  async getProtocol(id: string): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.get(`${BASE_URL}/protocols/${id}`);
    return data.data;
  },

  async createProtocol(protocol: Partial<ChemoProtocol>): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.post(`${BASE_URL}/protocols`, protocol);
    return data.data;
  },

  // Chemo Orders (Phase 2)
  async listChemoOrders(params?: { patientId?: string; status?: string; date?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/orders`, { params });
    return data;
  },

  async createChemoOrder(order: Partial<ChemoOrder>): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders`, order);
    return data.data;
  },
};
