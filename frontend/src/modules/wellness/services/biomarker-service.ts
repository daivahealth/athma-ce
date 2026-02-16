import { clinicalClient } from '@/lib/api/client';
import type {
  BiomarkerDefinition,
  BiomarkerResult,
  BiomarkerAlert,
  BiomarkerTrend,
  BiomarkerCategory,
  CreateBiomarkerInput,
  RecordBiomarkerResultInput,
  BiomarkerFilters,
} from '../types/biomarker';

class BiomarkerService {
  // Definitions
  async listBiomarkers(filters?: { category?: BiomarkerCategory; isActive?: boolean }): Promise<BiomarkerDefinition[]> {
    const response = await clinicalClient.get('/wellness/biomarkers/definitions', { params: filters });
    return response.data;
  }

  async getBiomarkerById(id: string): Promise<BiomarkerDefinition> {
    const response = await clinicalClient.get(`/wellness/biomarkers/${id}`);
    return response.data;
  }

  async createBiomarker(payload: CreateBiomarkerInput): Promise<BiomarkerDefinition> {
    const response = await clinicalClient.post('/wellness/biomarkers', payload);
    return response.data;
  }

  async updateBiomarker(id: string, payload: Partial<CreateBiomarkerInput>): Promise<BiomarkerDefinition> {
    const response = await clinicalClient.patch(`/wellness/biomarkers/${id}`, payload);
    return response.data;
  }

  // Results
  async recordResult(payload: RecordBiomarkerResultInput): Promise<BiomarkerResult> {
    const response = await clinicalClient.post('/wellness/biomarkers/results', payload);
    return response.data;
  }

  async getPatientResults(patientId: string, filters?: Omit<BiomarkerFilters, 'patientId'>): Promise<BiomarkerResult[]> {
    const response = await clinicalClient.get(`/wellness/biomarkers/results/patient/${patientId}`, { params: filters });
    return response.data;
  }

  async getPatientLatestResults(patientId: string): Promise<BiomarkerResult[]> {
    const response = await clinicalClient.get(`/wellness/biomarkers/results/patient/${patientId}/latest`);
    return response.data;
  }

  // Trends
  async getPatientTrends(patientId: string, daysBack?: number): Promise<BiomarkerTrend[]> {
    const response = await clinicalClient.get(`/wellness/biomarkers/trends/patient/${patientId}`, {
      params: { daysBack },
    });
    return response.data;
  }

  async getBiomarkerTrend(patientId: string, biomarkerId: string, daysBack?: number): Promise<BiomarkerTrend> {
    const response = await clinicalClient.get(`/wellness/biomarkers/trends/patient/${patientId}/${biomarkerId}`, {
      params: { daysBack },
    });
    return response.data;
  }

  // Alerts
  async getPatientAlerts(patientId: string, status?: 'active' | 'acknowledged' | 'resolved'): Promise<BiomarkerAlert[]> {
    const response = await clinicalClient.get(`/wellness/biomarkers/alerts/patient/${patientId}`, {
      params: { status },
    });
    return response.data;
  }

  async getActiveAlerts(): Promise<BiomarkerAlert[]> {
    const response = await clinicalClient.get('/wellness/biomarkers/alerts/active');
    return response.data;
  }

  async acknowledgeAlert(alertId: string): Promise<BiomarkerAlert> {
    const response = await clinicalClient.post(`/wellness/biomarkers/alerts/${alertId}/acknowledge`);
    return response.data;
  }

  async resolveAlert(alertId: string, notes?: string): Promise<BiomarkerAlert> {
    const response = await clinicalClient.post(`/wellness/biomarkers/alerts/${alertId}/resolve`, { notes });
    return response.data;
  }

  // Dashboard
  async getPatientBiomarkerDashboard(patientId: string): Promise<{
    latestResults: BiomarkerResult[];
    activeAlerts: BiomarkerAlert[];
    trends: BiomarkerTrend[];
    categories: Record<BiomarkerCategory, { count: number; optimalCount: number }>;
  }> {
    const response = await clinicalClient.get(`/wellness/biomarkers/dashboard/patient/${patientId}`);
    return response.data;
  }
}

export const biomarkerService = new BiomarkerService();
