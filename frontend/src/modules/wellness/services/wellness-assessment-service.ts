import { clinicalClient } from '@/lib/api/client';
import type {
  WellnessAssessmentTemplate,
  WellnessAssessment,
  WellnessScoreHistory,
  CreateAssessmentTemplateInput,
  CreateAssessmentInput,
  SubmitAssessmentInput,
  AssessmentFilters,
} from '../types/wellness-assessment';

class WellnessAssessmentService {
  // Templates
  async listTemplates(filters?: { category?: string; isActive?: boolean }): Promise<WellnessAssessmentTemplate[]> {
    const response = await clinicalClient.get('/wellness/assessments/templates', { params: filters });
    return response.data;
  }

  async getTemplateById(id: string): Promise<WellnessAssessmentTemplate> {
    const response = await clinicalClient.get(`/wellness/assessments/templates/${id}`);
    return response.data;
  }

  async createTemplate(payload: CreateAssessmentTemplateInput): Promise<WellnessAssessmentTemplate> {
    const response = await clinicalClient.post('/wellness/assessments/templates', payload);
    return response.data;
  }

  async updateTemplate(id: string, payload: Partial<CreateAssessmentTemplateInput>): Promise<WellnessAssessmentTemplate> {
    const response = await clinicalClient.patch(`/wellness/assessments/templates/${id}`, payload);
    return response.data;
  }

  // Assessments
  async listAssessments(filters?: AssessmentFilters): Promise<WellnessAssessment[]> {
    const response = await clinicalClient.get('/wellness/assessments', { params: filters });
    return response.data;
  }

  async getAssessmentById(id: string): Promise<WellnessAssessment> {
    const response = await clinicalClient.get(`/wellness/assessments/${id}`);
    return response.data;
  }

  async getPatientAssessments(patientId: string, filters?: Omit<AssessmentFilters, 'patientId'>): Promise<WellnessAssessment[]> {
    const response = await clinicalClient.get(`/wellness/assessments/patient/${patientId}`, { params: filters });
    return response.data;
  }

  async createAssessment(payload: CreateAssessmentInput): Promise<WellnessAssessment> {
    const response = await clinicalClient.post('/wellness/assessments', payload);
    return response.data;
  }

  async submitAssessment(id: string, payload: SubmitAssessmentInput): Promise<WellnessAssessment> {
    const response = await clinicalClient.post(`/wellness/assessments/${id}/submit`, payload);
    return response.data;
  }

  async cancelAssessment(id: string): Promise<WellnessAssessment> {
    const response = await clinicalClient.post(`/wellness/assessments/${id}/cancel`);
    return response.data;
  }

  // Score History
  async getPatientScoreHistory(patientId: string, daysBack?: number): Promise<WellnessScoreHistory[]> {
    const response = await clinicalClient.get(`/wellness/scores/patient/${patientId}/history`, {
      params: { daysBack },
    });
    return response.data;
  }

  async getPatientScoreTrend(patientId: string): Promise<{
    currentScore: number;
    previousScore: number;
    trend: 'improving' | 'stable' | 'declining';
    categoryTrends: Record<string, { current: number; previous: number; trend: string }>;
  }> {
    const response = await clinicalClient.get(`/wellness/scores/patient/${patientId}/trend`);
    return response.data;
  }
}

export const wellnessAssessmentService = new WellnessAssessmentService();
