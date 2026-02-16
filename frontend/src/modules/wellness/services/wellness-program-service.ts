import { clinicalClient } from '@/lib/api/client';
import type {
  WellnessProgramTemplate,
  WellnessProgramEnrollment,
  WellnessProgramSession,
  WellnessProgramMilestone,
  EnrollPatientInput,
  ScheduleSessionInput,
  CompleteSessionInput,
  ProgramFilters,
  ProgramProgress,
} from '../types/wellness-program';

class WellnessProgramService {
  // Templates
  async listTemplates(filters?: { programType?: string; isActive?: boolean }): Promise<WellnessProgramTemplate[]> {
    const response = await clinicalClient.get('/wellness/programs/templates', { params: filters });
    return response.data;
  }

  async getTemplateById(id: string): Promise<WellnessProgramTemplate> {
    const response = await clinicalClient.get(`/wellness/programs/templates/${id}`);
    return response.data;
  }

  async createTemplate(payload: Partial<WellnessProgramTemplate>): Promise<WellnessProgramTemplate> {
    const response = await clinicalClient.post('/wellness/programs/templates', payload);
    return response.data;
  }

  async updateTemplate(id: string, payload: Partial<WellnessProgramTemplate>): Promise<WellnessProgramTemplate> {
    const response = await clinicalClient.patch(`/wellness/programs/templates/${id}`, payload);
    return response.data;
  }

  // Enrollments
  async listEnrollments(filters?: ProgramFilters): Promise<WellnessProgramEnrollment[]> {
    const response = await clinicalClient.get('/wellness/programs/enrollments', { params: filters });
    return response.data;
  }

  async getEnrollmentById(id: string): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/${id}`);
    return response.data;
  }

  async getPatientEnrollments(patientId: string, filters?: Omit<ProgramFilters, 'patientId'>): Promise<WellnessProgramEnrollment[]> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/patient/${patientId}`, { params: filters });
    return response.data;
  }

  async getPatientActiveEnrollment(patientId: string): Promise<WellnessProgramEnrollment | null> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/patient/${patientId}/active`);
    return response.data;
  }

  async enrollPatient(payload: EnrollPatientInput): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.post('/wellness/programs/enrollments', payload);
    return response.data;
  }

  async pauseEnrollment(id: string): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.post(`/wellness/programs/enrollments/${id}/pause`);
    return response.data;
  }

  async resumeEnrollment(id: string): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.post(`/wellness/programs/enrollments/${id}/resume`);
    return response.data;
  }

  async completeEnrollment(id: string): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.post(`/wellness/programs/enrollments/${id}/complete`);
    return response.data;
  }

  async cancelEnrollment(id: string, reason?: string): Promise<WellnessProgramEnrollment> {
    const response = await clinicalClient.post(`/wellness/programs/enrollments/${id}/cancel`, { reason });
    return response.data;
  }

  // Sessions
  async getEnrollmentSessions(enrollmentId: string): Promise<WellnessProgramSession[]> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/${enrollmentId}/sessions`);
    return response.data;
  }

  async scheduleSession(payload: ScheduleSessionInput): Promise<WellnessProgramSession> {
    const response = await clinicalClient.post('/wellness/programs/sessions', payload);
    return response.data;
  }

  async startSession(sessionId: string): Promise<WellnessProgramSession> {
    const response = await clinicalClient.post(`/wellness/programs/sessions/${sessionId}/start`);
    return response.data;
  }

  async completeSession(sessionId: string, payload: CompleteSessionInput): Promise<WellnessProgramSession> {
    const response = await clinicalClient.post(`/wellness/programs/sessions/${sessionId}/complete`, payload);
    return response.data;
  }

  async cancelSession(sessionId: string, reason?: string): Promise<WellnessProgramSession> {
    const response = await clinicalClient.post(`/wellness/programs/sessions/${sessionId}/cancel`, { reason });
    return response.data;
  }

  async markSessionMissed(sessionId: string): Promise<WellnessProgramSession> {
    const response = await clinicalClient.post(`/wellness/programs/sessions/${sessionId}/missed`);
    return response.data;
  }

  // Milestones
  async getEnrollmentMilestones(enrollmentId: string): Promise<WellnessProgramMilestone[]> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/${enrollmentId}/milestones`);
    return response.data;
  }

  async achieveMilestone(milestoneId: string, actualValue?: number): Promise<WellnessProgramMilestone> {
    const response = await clinicalClient.post(`/wellness/programs/milestones/${milestoneId}/achieve`, { actualValue });
    return response.data;
  }

  // Progress
  async getEnrollmentProgress(enrollmentId: string): Promise<ProgramProgress> {
    const response = await clinicalClient.get(`/wellness/programs/enrollments/${enrollmentId}/progress`);
    return response.data;
  }

  async getPatientProgramHistory(patientId: string): Promise<{
    enrollments: WellnessProgramEnrollment[];
    completedPrograms: number;
    totalSessions: number;
    milestonesAchieved: number;
  }> {
    const response = await clinicalClient.get(`/wellness/programs/patient/${patientId}/history`);
    return response.data;
  }
}

export const wellnessProgramService = new WellnessProgramService();
