import { clinicalClient } from '@/lib/api/client';
import type { DischargeSummary, DischargeSummaryVersion } from '@/modules/clinical/types/discharge-summary';

class DischargeSummaryService {
  async getByAdmission(admissionId: string): Promise<DischargeSummary> {
    const response = await clinicalClient.get(`/inpatient/admissions/${admissionId}/discharge-summary`);
    return response.data;
  }

  async getById(summaryId: string): Promise<DischargeSummary> {
    const response = await clinicalClient.get(`/inpatient/discharge-summaries/${summaryId}`);
    return response.data;
  }

  async listVersions(summaryId: string): Promise<DischargeSummaryVersion[]> {
    const response = await clinicalClient.get(`/inpatient/discharge-summaries/${summaryId}/versions`);
    return response.data;
  }

  async createVersion(
    summaryId: string,
    payload: { data: Record<string, unknown>; changeReason?: string }
  ): Promise<DischargeSummaryVersion> {
    const response = await clinicalClient.post(`/inpatient/discharge-summaries/${summaryId}/versions`, payload);
    return response.data;
  }
}

export const dischargeSummaryService = new DischargeSummaryService();
