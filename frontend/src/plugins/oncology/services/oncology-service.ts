import { clinicalClient } from '@/lib/api/client';
import type {
  CancerDiagnosis, TumorStaging, ChemoProtocol, ChemoOrder, TumorBoardCase, OncologyCarePlan,
  OncologyCancerType, OncologyPrimarySite, OncologyCancerTypeSiteMapping, OncologyHistology,
  RadiationPrescription, RadiationSimulation, RadiationTreatmentPlan,
  RadiationFraction, RadiationOnTreatmentReview, RadiationCompletionSummary,
  CancerTimelineEvent,
} from '../types';

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

  async updateStaging(id: string, staging: Partial<TumorStaging>): Promise<TumorStaging> {
    const { data } = await clinicalClient.put(`${BASE_URL}/staging/${id}`, staging);
    return data.data;
  },

  // Tumor Board
  async listTumorBoardCases(params?: { status?: string; date?: string; patientId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/tumor-board`, { params });
    return data;
  },

  async getTumorBoardCase(id: string): Promise<TumorBoardCase> {
    const { data } = await clinicalClient.get(`${BASE_URL}/tumor-board/${id}`);
    return data.data;
  },

  async createTumorBoardCase(boardCase: Partial<TumorBoardCase>): Promise<TumorBoardCase> {
    const { data } = await clinicalClient.post(`${BASE_URL}/tumor-board`, boardCase);
    return data.data;
  },

  async updateTumorBoardCase(id: string, boardCase: Partial<TumorBoardCase>): Promise<TumorBoardCase> {
    const { data } = await clinicalClient.put(`${BASE_URL}/tumor-board/${id}`, boardCase);
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
  async listProtocols(params?: { cancerType?: string; isActive?: boolean; page?: number; limit?: number }) {
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

  async updateProtocol(id: string, protocol: Partial<ChemoProtocol>): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.put(`${BASE_URL}/protocols/${id}`, protocol);
    return data.data;
  },

  async deactivateProtocol(id: string): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.put(`${BASE_URL}/protocols/${id}/deactivate`);
    return data.data;
  },

  // Chemo Orders
  async listChemoOrders(params?: { patientId?: string; status?: string; date?: string; cancerDiagnosisId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/orders`, { params });
    return data;
  },

  async getChemoOrder(id: string): Promise<ChemoOrder> {
    const { data } = await clinicalClient.get(`${BASE_URL}/orders/${id}`);
    return data.data;
  },

  async createChemoOrder(order: Partial<ChemoOrder>): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders`, order);
    return data.data;
  },

  async updateChemoOrder(id: string, order: Partial<ChemoOrder>): Promise<ChemoOrder> {
    const { data } = await clinicalClient.put(`${BASE_URL}/orders/${id}`, order);
    return data.data;
  },

  async approveChemoOrder(id: string): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/approve`);
    return data.data;
  },

  async verifyChemoOrder(id: string, body: { secondVerifiedBy?: string; nurseVerificationChecklist?: Record<string, unknown>; drugPreparationDetails?: unknown[] }): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/verify`, body);
    return data.data;
  },

  async updateAdministrationProgress(id: string, body: { administrationDetails: unknown[]; adverseReactions: unknown[] }): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/progress`, body);
    return data.data;
  },

  async startAdministration(id: string): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/start`);
    return data.data;
  },

  async completeAdministration(id: string, body: { administrationDetails: unknown[]; adverseReactions: unknown[]; notes?: string }): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/complete`, body);
    return data.data;
  },

  async holdChemoOrder(id: string, reason?: string): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/hold`, { reason });
    return data.data;
  },

  async cancelChemoOrder(id: string, reason?: string): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders/${id}/cancel`, { reason });
    return data.data;
  },

  // ── Catalog: Cancer Types ──────────────────────────────────────
  async listCancerTypes(params?: { search?: string; active?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/cancer-types`, { params });
    return data;
  },
  async getCancerType(id: string): Promise<OncologyCancerType> {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/cancer-types/${id}`);
    return data.data;
  },
  async createCancerType(body: Partial<OncologyCancerType>): Promise<OncologyCancerType> {
    const { data } = await clinicalClient.post(`${BASE_URL}/catalogs/cancer-types`, body);
    return data.data;
  },
  async updateCancerType(id: string, body: Partial<OncologyCancerType>): Promise<OncologyCancerType> {
    const { data } = await clinicalClient.put(`${BASE_URL}/catalogs/cancer-types/${id}`, body);
    return data.data;
  },

  // ── Catalog: Primary Sites ─────────────────────────────────────
  async listPrimarySites(params?: { search?: string; bodySystem?: string; active?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/primary-sites`, { params });
    return data;
  },
  async getPrimarySite(id: string): Promise<OncologyPrimarySite> {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/primary-sites/${id}`);
    return data.data;
  },
  async createPrimarySite(body: Partial<OncologyPrimarySite>): Promise<OncologyPrimarySite> {
    const { data } = await clinicalClient.post(`${BASE_URL}/catalogs/primary-sites`, body);
    return data.data;
  },
  async updatePrimarySite(id: string, body: Partial<OncologyPrimarySite>): Promise<OncologyPrimarySite> {
    const { data } = await clinicalClient.put(`${BASE_URL}/catalogs/primary-sites/${id}`, body);
    return data.data;
  },

  // ── Catalog: Site Mappings ─────────────────────────────────────
  async listSiteMappings(params?: { cancerTypeId?: string; primarySiteId?: string; active?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/site-mappings`, { params });
    return data;
  },
  async createSiteMapping(body: { cancerTypeId: string; primarySiteId: string; isDefault?: boolean }): Promise<OncologyCancerTypeSiteMapping> {
    const { data } = await clinicalClient.post(`${BASE_URL}/catalogs/site-mappings`, body);
    return data.data;
  },
  async updateSiteMapping(id: string, body: { isDefault?: boolean; active?: boolean }): Promise<OncologyCancerTypeSiteMapping> {
    const { data } = await clinicalClient.put(`${BASE_URL}/catalogs/site-mappings/${id}`, body);
    return data.data;
  },
  async deleteSiteMapping(id: string): Promise<{ deleted: boolean; id: string }> {
    const { data } = await clinicalClient.put(`${BASE_URL}/catalogs/site-mappings/${id}/delete`);
    return data.data;
  },

  // ── Catalog: Histologies ───────────────────────────────────────
  async listHistologies(params?: { search?: string; behaviorCode?: string; active?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/histologies`, { params });
    return data;
  },
  async getHistology(id: string): Promise<OncologyHistology> {
    const { data } = await clinicalClient.get(`${BASE_URL}/catalogs/histologies/${id}`);
    return data.data;
  },
  async createHistology(body: Partial<OncologyHistology>): Promise<OncologyHistology> {
    const { data } = await clinicalClient.post(`${BASE_URL}/catalogs/histologies`, body);
    return data.data;
  },
  async updateHistology(id: string, body: Partial<OncologyHistology>): Promise<OncologyHistology> {
    const { data } = await clinicalClient.put(`${BASE_URL}/catalogs/histologies/${id}`, body);
    return data.data;
  },

  // ── Radiation Oncology ─────────────────────────────────────

  async listRadiationPrescriptions(params?: { patientId?: string; status?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/prescriptions`, { params });
    return data;
  },
  async getRadiationPrescription(id: string): Promise<RadiationPrescription> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/prescriptions/${id}`);
    return data.data;
  },
  async createRadiationPrescription(body: Record<string, unknown>): Promise<RadiationPrescription> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/prescriptions`, body);
    return data.data;
  },
  async updateRadiationPrescription(id: string, body: Record<string, unknown>): Promise<RadiationPrescription> {
    const { data } = await clinicalClient.put(`${BASE_URL}/radiation/prescriptions/${id}`, body);
    return data.data;
  },
  async approveRadiationPrescription(id: string): Promise<RadiationPrescription> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/prescriptions/${id}/approve`, {});
    return data.data;
  },
  async activateRadiationPrescription(id: string): Promise<RadiationPrescription> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/prescriptions/${id}/activate`, {});
    return data.data;
  },

  async listRadiationSimulations(prescriptionId: string): Promise<{ data: RadiationSimulation[] }> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/prescriptions/${prescriptionId}/simulations`);
    return data;
  },
  async getRadiationSimulation(id: string): Promise<RadiationSimulation> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/simulations/${id}`);
    return data.data;
  },
  async createRadiationSimulation(body: Record<string, unknown>): Promise<RadiationSimulation> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/simulations`, body);
    return data.data;
  },
  async updateRadiationSimulation(id: string, body: Record<string, unknown>): Promise<RadiationSimulation> {
    const { data } = await clinicalClient.put(`${BASE_URL}/radiation/simulations/${id}`, body);
    return data.data;
  },

  async listRadiationPlans(params?: { prescriptionId?: string; status?: string }): Promise<{ data: RadiationTreatmentPlan[] }> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/plans`, { params });
    return data;
  },
  async getRadiationPlan(id: string): Promise<RadiationTreatmentPlan> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/plans/${id}`);
    return data.data;
  },
  async createRadiationPlan(body: Record<string, unknown>): Promise<RadiationTreatmentPlan> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/plans`, body);
    return data.data;
  },
  async updateRadiationPlan(id: string, body: Record<string, unknown>): Promise<RadiationTreatmentPlan> {
    const { data } = await clinicalClient.put(`${BASE_URL}/radiation/plans/${id}`, body);
    return data.data;
  },
  async approveRadiationPlan(id: string): Promise<RadiationTreatmentPlan> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/plans/${id}/approve`, {});
    return data.data;
  },

  async listRadiationFractions(planId: string): Promise<{ data: RadiationFraction[] }> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/plans/${planId}/fractions`);
    return data;
  },
  async bulkCreateFractions(planId: string, body: Record<string, unknown>): Promise<RadiationFraction[]> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/plans/${planId}/fractions/bulk`, body);
    return data.data;
  },
  async updateRadiationFraction(id: string, body: Record<string, unknown>): Promise<RadiationFraction> {
    const { data } = await clinicalClient.put(`${BASE_URL}/radiation/fractions/${id}`, body);
    return data.data;
  },
  async deliverFraction(id: string, body: Record<string, unknown>): Promise<RadiationFraction> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/fractions/${id}/deliver`, body);
    return data.data;
  },

  async listOnTreatmentReviews(prescriptionId: string): Promise<{ data: RadiationOnTreatmentReview[] }> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/prescriptions/${prescriptionId}/reviews`);
    return data;
  },
  async createOnTreatmentReview(body: Record<string, unknown>): Promise<RadiationOnTreatmentReview> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/reviews`, body);
    return data.data;
  },
  async updateOnTreatmentReview(id: string, body: Record<string, unknown>): Promise<RadiationOnTreatmentReview> {
    const { data } = await clinicalClient.put(`${BASE_URL}/radiation/reviews/${id}`, body);
    return data.data;
  },

  async getCompletionSummary(prescriptionId: string): Promise<RadiationCompletionSummary> {
    const { data } = await clinicalClient.get(`${BASE_URL}/radiation/prescriptions/${prescriptionId}/completion`);
    return data.data;
  },
  async createCompletionSummary(body: Record<string, unknown>): Promise<RadiationCompletionSummary> {
    const { data } = await clinicalClient.post(`${BASE_URL}/radiation/completions`, body);
    return data.data;
  },

  // ── Cancer Patient Timeline ────────────────────────────────────────────────
  async getTimeline(patientId: string, params?: {
    eventType?: string; fromDate?: string; toDate?: string; cancerDiagnosisId?: string;
  }): Promise<CancerTimelineEvent[]> {
    const { data } = await clinicalClient.get(`${BASE_URL}/timeline/${patientId}`, { params });
    return data.data ?? [];
  },

  async createCustomTimelineEvent(body: {
    patientId: string; cancerDiagnosisId?: string;
    eventDate: string; title: string; description?: string;
    /** Only 'custom' | 'surgery' | 'response' | 'follow_up' are accepted by the backend. */
    category?: string;
    severity?: 'milestone' | 'info' | 'warning' | 'adverse';
  }): Promise<CancerTimelineEvent> {
    const { data } = await clinicalClient.post(`${BASE_URL}/timeline`, body);
    return data.data;
  },

  async deleteTimelineEvent(id: string): Promise<void> {
    await clinicalClient.delete(`${BASE_URL}/timeline/${id}`);
  },
};
