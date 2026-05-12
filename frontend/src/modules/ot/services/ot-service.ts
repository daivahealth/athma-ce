import { clinicalClient } from '@/lib/api/client';
import type {
  AmendOtReportInput,
  CheckOtScheduleConflictsInput,
  CreateOtReportInput,
  CreateOtRequestInput,
  CreateOtScheduleInput,
  OtConflictsResponse,
  OtReport,
  OtReportListFilters,
  OtReportVersion,
  OtRequest,
  OtRequestListFilters,
  OtRequestStatusEvent,
  OtRoomConfig,
  OtSchedule,
  OtScheduleListFilters,
  OtScheduleStatusEvent,
  OtTransitionInput,
  TransitionOtScheduleInput,
  UpdateOtReportInput,
  UpdateOtRequestInput,
  UpdateOtRoomConfigInput,
  UpdateOtScheduleInput,
  UpsertOtRoomConfigInput,
} from '../types';

class OtService {
  async listRequests(filters?: OtRequestListFilters): Promise<OtRequest[]> {
    const response = await clinicalClient.get('/ot/requests', { params: filters });
    return response.data;
  }

  async getRequest(id: string): Promise<OtRequest> {
    const response = await clinicalClient.get(`/ot/requests/${id}`);
    return response.data;
  }

  async createRequest(payload: CreateOtRequestInput): Promise<OtRequest> {
    const response = await clinicalClient.post('/ot/requests', payload);
    return response.data;
  }

  async updateRequest(id: string, payload: UpdateOtRequestInput): Promise<OtRequest> {
    const response = await clinicalClient.patch(`/ot/requests/${id}`, payload);
    return response.data;
  }

  async transitionRequest(id: string, action: string, payload?: OtTransitionInput): Promise<OtRequest> {
    const response = await clinicalClient.post(`/ot/requests/${id}/${action}`, payload ?? {});
    return response.data;
  }

  async getRequestHistory(id: string): Promise<OtRequestStatusEvent[]> {
    const response = await clinicalClient.get(`/ot/requests/${id}/history`);
    return response.data;
  }

  async listSchedules(filters?: OtScheduleListFilters): Promise<OtSchedule[]> {
    const response = await clinicalClient.get('/ot/schedules', { params: filters });
    return response.data;
  }

  async getSchedule(id: string): Promise<OtSchedule> {
    const response = await clinicalClient.get(`/ot/schedules/${id}`);
    return response.data;
  }

  async createSchedule(payload: CreateOtScheduleInput): Promise<OtSchedule> {
    const response = await clinicalClient.post('/ot/schedules', payload);
    return response.data;
  }

  async updateSchedule(id: string, payload: UpdateOtScheduleInput): Promise<OtSchedule> {
    const response = await clinicalClient.patch(`/ot/schedules/${id}`, payload);
    return response.data;
  }

  async transitionSchedule(
    id: string,
    action: string,
    payload?: TransitionOtScheduleInput
  ): Promise<OtSchedule> {
    const response = await clinicalClient.post(`/ot/schedules/${id}/${action}`, payload ?? {});
    return response.data;
  }

  async getScheduleHistory(id: string): Promise<OtScheduleStatusEvent[]> {
    const response = await clinicalClient.get(`/ot/schedules/${id}/history`);
    return response.data;
  }

  async checkScheduleConflicts(
    payload: CheckOtScheduleConflictsInput
  ): Promise<OtConflictsResponse> {
    const response = await clinicalClient.post('/ot/schedules/conflicts/check', payload);
    return response.data;
  }

  async listReports(filters?: OtReportListFilters): Promise<OtReport[]> {
    const response = await clinicalClient.get('/ot/reports', { params: filters });
    return response.data;
  }

  async getReport(id: string): Promise<OtReport> {
    const response = await clinicalClient.get(`/ot/reports/${id}`);
    return response.data;
  }

  async createReport(payload: CreateOtReportInput): Promise<OtReport> {
    const response = await clinicalClient.post('/ot/reports', payload);
    return response.data;
  }

  async updateReport(id: string, payload: UpdateOtReportInput): Promise<OtReport> {
    const response = await clinicalClient.patch(`/ot/reports/${id}`, payload);
    return response.data;
  }

  async signReport(id: string, payload?: OtTransitionInput): Promise<OtReport> {
    const response = await clinicalClient.post(`/ot/reports/${id}/sign`, payload ?? {});
    return response.data;
  }

  async amendReport(id: string, payload: AmendOtReportInput): Promise<OtReport> {
    const response = await clinicalClient.post(`/ot/reports/${id}/amend`, payload);
    return response.data;
  }

  async cancelReport(id: string, payload?: OtTransitionInput): Promise<OtReport> {
    const response = await clinicalClient.post(`/ot/reports/${id}/cancel`, payload ?? {});
    return response.data;
  }

  async getReportVersions(id: string): Promise<OtReportVersion[]> {
    const response = await clinicalClient.get(`/ot/reports/${id}/versions`);
    return response.data;
  }

  async getReportVersion(id: string, versionNo: number): Promise<OtReportVersion> {
    const response = await clinicalClient.get(`/ot/reports/${id}/versions/${versionNo}`);
    return response.data;
  }

  async listRooms(params?: {
    facilityId?: string;
    includeInactive?: boolean;
  }): Promise<OtRoomConfig[]> {
    const response = await clinicalClient.get('/ot/rooms', { params });
    return response.data;
  }

  async upsertRoomConfig(payload: UpsertOtRoomConfigInput): Promise<OtRoomConfig> {
    const response = await clinicalClient.post('/ot/rooms/config', payload);
    return response.data;
  }

  async updateRoomConfig(spaceId: string, payload: UpdateOtRoomConfigInput): Promise<OtRoomConfig> {
    const response = await clinicalClient.patch(`/ot/rooms/config/${spaceId}`, payload);
    return response.data;
  }
}

export const otService = new OtService();
