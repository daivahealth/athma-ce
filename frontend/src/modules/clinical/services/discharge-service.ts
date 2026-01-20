import { clinicalClient } from '@/lib/api/client';

export interface DischargeSearchParams {
  searchTerm?: string;
  status?: string;
  dischargeDateFrom?: string;
  dischargeDateTo?: string;
  targetDischargeDateFrom?: string;
  targetDischargeDateTo?: string;
  wardId?: string;
  facilityId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DischargeSearchResponse {
  data: any[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const dischargeService = {
  /**
   * Search discharge transactions
   */
  async search(params: DischargeSearchParams): Promise<DischargeSearchResponse> {
    const response = await clinicalClient.get('/inpatient/discharges', {
      params,
    });
    return response.data;
  },

  /**
   * Get discharge by ID
   */
  async getById(dischargeId: string): Promise<any> {
    const response = await clinicalClient.get(`/inpatient/discharges/${dischargeId}`);
    return response.data;
  },

  /**
   * Get discharge by admission ID
   */
  async getByAdmissionId(admissionId: string): Promise<any> {
    const response = await clinicalClient.get(`/inpatient/admissions/${admissionId}/discharge`);
    return response.data;
  },

  /**
   * Initiate discharge planning
   */
  async initiate(admissionId: string, data: {
    targetDischargeDate?: string;
    targetDischargeTime?: string;
    approvalRequired?: boolean;
    internalNotes?: string;
  }): Promise<any> {
    const response = await clinicalClient.post(
      `/inpatient/admissions/${admissionId}/discharge/initiate`,
      data
    );
    return response.data;
  },

  /**
   * Mark discharge as ready
   */
  async markReady(dischargeId: string, data: {
    readyRemarks?: string;
  }): Promise<any> {
    const response = await clinicalClient.patch(
      `/inpatient/discharges/${dischargeId}/ready`,
      data
    );
    return response.data;
  },

  /**
   * Approve discharge
   */
  async approve(dischargeId: string, data: {
    approvalRemarks?: string;
  }): Promise<any> {
    const response = await clinicalClient.patch(
      `/inpatient/discharges/${dischargeId}/approve`,
      data
    );
    return response.data;
  },

  /**
   * Execute discharge
   */
  async execute(dischargeId: string, data: {
    dischargeType: string;
    dischargeDestination: string;
    dischargeDisposition?: string;
    dischargeSummaryId?: string;
    finalDiagnosis?: string;
    dischargeMedications?: any;
    followUpInstructions?: string;
    followUpAppointments?: any;
    dietInstructions?: string;
    activityRestrictions?: string;
  }): Promise<any> {
    const response = await clinicalClient.patch(
      `/inpatient/discharges/${dischargeId}/execute`,
      data
    );
    return response.data;
  },

  /**
   * Cancel discharge
   */
  async cancel(dischargeId: string, data: {
    cancellationReason: string;
  }): Promise<any> {
    const response = await clinicalClient.patch(
      `/inpatient/discharges/${dischargeId}/cancel`,
      data
    );
    return response.data;
  },
};
