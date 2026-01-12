import { clinicalClient } from '@/lib/api/client';
import type {
  BedBoardResponse,
  MultiWardBoardResponse,
  AdmissionsSearchResponse,
  CreateAdmissionInput,
  CreateInpatientEventInput,
  DischargeChecklist,
  DischargePatientInput,
  InpatientAdmission,
  InpatientEvent,
  UpdateAdmissionInput,
  UpdateDischargeChecklistInput,
  WardDashboardResponse,
  WardPatientsResponse,
  TransferPatientInput,
  SearchAdmissionsParams,
} from '../types/inpatient';

class InpatientService {
  async createAdmission(payload: CreateAdmissionInput): Promise<InpatientAdmission> {
    const response = await clinicalClient.post('/v1/inpatient/admissions', payload);
    return response.data;
  }

  async getAdmission(admissionId: string): Promise<InpatientAdmission> {
    const response = await clinicalClient.get(`/v1/inpatient/admissions/${admissionId}`);
    return response.data;
  }

  async searchAdmissions(params: SearchAdmissionsParams): Promise<AdmissionsSearchResponse> {
    const response = await clinicalClient.get('/v1/inpatient/admissions', { params });
    return response.data;
  }

  async updateAdmission(admissionId: string, payload: UpdateAdmissionInput): Promise<InpatientAdmission> {
    const response = await clinicalClient.patch(`/v1/inpatient/admissions/${admissionId}`, payload);
    return response.data;
  }

  async transferPatient(admissionId: string, payload: TransferPatientInput): Promise<InpatientAdmission> {
    const response = await clinicalClient.post(`/v1/inpatient/admissions/${admissionId}/transfer`, payload);
    return response.data;
  }

  async getAdmissionEvents(admissionId: string): Promise<InpatientEvent[]> {
    const response = await clinicalClient.get(`/v1/inpatient/admissions/${admissionId}/events`);
    return response.data;
  }

  async createAdmissionEvent(admissionId: string, payload: CreateInpatientEventInput): Promise<InpatientEvent> {
    const response = await clinicalClient.post(`/v1/inpatient/admissions/${admissionId}/events`, payload);
    return response.data;
  }

  async getDischargeChecklist(admissionId: string): Promise<DischargeChecklist> {
    const response = await clinicalClient.get(`/v1/inpatient/admissions/${admissionId}/discharge-checklist`);
    return response.data;
  }

  async updateDischargeChecklist(
    admissionId: string,
    payload: UpdateDischargeChecklistInput
  ): Promise<DischargeChecklist> {
    const response = await clinicalClient.patch(
      `/v1/inpatient/admissions/${admissionId}/discharge-checklist`,
      payload
    );
    return response.data;
  }

  async dischargePatient(admissionId: string, payload: DischargePatientInput): Promise<InpatientAdmission> {
    const response = await clinicalClient.post(`/v1/inpatient/admissions/${admissionId}/discharge`, payload);
    return response.data;
  }

  async getWardBedBoard(wardId: string, includeDischargedToday?: boolean): Promise<BedBoardResponse> {
    const response = await clinicalClient.get(`/v1/inpatient/wards/${wardId}/bed-board`, {
      params: { includeDischargedToday },
    });
    return response.data;
  }

  async getMultiWardBedBoard(params: {
    wardIds?: string[];
    includeDischargedToday?: boolean;
    statusFilter?: string[];
    acuityFilter?: string[];
    includeEmptyWards?: boolean;
  }): Promise<MultiWardBoardResponse> {
    const response = await clinicalClient.get('/v1/inpatient/wards/multi-board', {
      params: {
        wardIds: params.wardIds?.length ? params.wardIds.join(',') : undefined,
        includeDischargedToday: params.includeDischargedToday,
        statusFilter: params.statusFilter?.length ? params.statusFilter.join(',') : undefined,
        acuityFilter: params.acuityFilter?.length ? params.acuityFilter.join(',') : undefined,
        includeEmptyWards: params.includeEmptyWards,
      },
    });
    return response.data;
  }

  async getWardDashboard(wardId: string): Promise<WardDashboardResponse> {
    const response = await clinicalClient.get(`/v1/inpatient/wards/${wardId}/dashboard`);
    return response.data;
  }

  async getWardPatients(wardId: string): Promise<WardPatientsResponse> {
    const response = await clinicalClient.get(`/v1/inpatient/wards/${wardId}/patients`);
    return response.data;
  }
}

export const inpatientService = new InpatientService();
