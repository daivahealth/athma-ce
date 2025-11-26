import { rcmClient } from '@/lib/api/client';
import type {
  CodingDiagnosis,
  CodingProcedure,
  CodingSession,
  CodingSessionFilters,
  CodingAuditEntry,
  CoderProductivityStats,
  CodingSessionSummaryStats,
  CreateDiagnosisInput,
  CreateProcedureInput,
  UpdateCodingSessionInput,
  UpdateDiagnosisInput,
  UpdateProcedureInput,
} from '../types/medical-coding';

class MedicalCodingService {
  async listSessions(filters?: CodingSessionFilters): Promise<CodingSession[]> {
    const response = await rcmClient.get('/medical-coding/sessions', { params: filters });
    return response.data;
  }

  async listPendingSessions(): Promise<CodingSession[]> {
    const response = await rcmClient.get('/medical-coding/sessions/pending');
    return response.data;
  }

  async getSession(id: string): Promise<CodingSession> {
    const response = await rcmClient.get(`/medical-coding/sessions/${id}`);
    return response.data;
  }

  async startReview(id: string): Promise<CodingSession> {
    const response = await rcmClient.put(`/medical-coding/sessions/${id}/start-review`, {});
    return response.data;
  }

  async updateSession(id: string, payload: UpdateCodingSessionInput): Promise<CodingSession> {
    const response = await rcmClient.put(`/medical-coding/sessions/${id}`, payload);
    return response.data;
  }

  async submitSession(id: string): Promise<CodingSession> {
    const response = await rcmClient.post(`/medical-coding/sessions/${id}/submit`, {});
    return response.data;
  }

  async addDiagnosis(sessionId: string, payload: CreateDiagnosisInput): Promise<CodingDiagnosis> {
    const response = await rcmClient.post(`/medical-coding/sessions/${sessionId}/diagnoses`, payload);
    return response.data;
  }

  async updateDiagnosis(id: string, payload: UpdateDiagnosisInput): Promise<CodingDiagnosis> {
    const response = await rcmClient.put(`/medical-coding/diagnoses/${id}`, payload);
    return response.data;
  }

  async deleteDiagnosis(id: string): Promise<void> {
    await rcmClient.delete(`/medical-coding/diagnoses/${id}`);
  }

  async addProcedure(sessionId: string, payload: CreateProcedureInput): Promise<CodingProcedure> {
    const response = await rcmClient.post(`/medical-coding/sessions/${sessionId}/procedures`, payload);
    return response.data;
  }

  async updateProcedure(id: string, payload: UpdateProcedureInput): Promise<CodingProcedure> {
    const response = await rcmClient.put(`/medical-coding/procedures/${id}`, payload);
    return response.data;
  }

  async deleteProcedure(id: string): Promise<void> {
    await rcmClient.delete(`/medical-coding/procedures/${id}`);
  }

  async getSessionAudit(sessionId: string): Promise<CodingAuditEntry[]> {
    const response = await rcmClient.get(`/medical-coding/sessions/${sessionId}/audit`);
    return response.data;
  }

  async getAuditLogs(): Promise<CodingAuditEntry[]> {
    const response = await rcmClient.get('/medical-coding/audit');
    return response.data;
  }

  async getCoderProductivity(): Promise<CoderProductivityStats[]> {
    const response = await rcmClient.get('/medical-coding/statistics/coder-productivity');
    return response.data;
  }

  async getSessionSummary(): Promise<CodingSessionSummaryStats> {
    const response = await rcmClient.get('/medical-coding/statistics/session-summary');
    return response.data;
  }
}

export const medicalCodingService = new MedicalCodingService();
