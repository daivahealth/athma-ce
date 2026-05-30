import { clinicalClient } from '@/lib/api/client';
import type {
  LabReport,
  CreateLabReportInput,
  UpdateLabReportInput,
  LabResultItem,
  LabResultItemInput,
  PathologyReport,
  CreatePathologyReportInput,
  UpdatePathologyReportInput,
  ImagingReport,
  CreateImagingReportInput,
  UpdateImagingReportInput,
  ProcedureReport,
  CreateProcedureReportInput,
  UpdateProcedureReportInput,
  ReportStatusTransitionInput,
  AmendReportInput,
  ReportStatusHistoryEntry,
  PatientResult,
  PatientResultsResponse,
  ReportableOrder,
} from '../types/reporting';

class ReportingService {
  // ========================================
  // LAB REPORTS
  // ========================================

  async createLabReport(payload: CreateLabReportInput): Promise<LabReport> {
    const response = await clinicalClient.post('/lab-reports', payload);
    return response.data;
  }

  async getLabReport(id: string): Promise<LabReport> {
    const response = await clinicalClient.get(`/lab-reports/${id}`);
    return response.data;
  }

  async getLabReportsByOrder(orderId: string): Promise<LabReport[]> {
    const response = await clinicalClient.get(`/lab-reports/order/${orderId}`);
    return response.data;
  }

  async updateLabReport(id: string, payload: UpdateLabReportInput): Promise<LabReport> {
    const response = await clinicalClient.patch(`/lab-reports/${id}`, payload);
    return response.data;
  }

  async saveLabResultItems(reportId: string, items: LabResultItemInput[]): Promise<LabResultItem[]> {
    const response = await clinicalClient.post(`/lab-reports/${reportId}/items`, { items });
    return response.data;
  }

  async transitionLabReportStatus(id: string, payload: ReportStatusTransitionInput): Promise<LabReport> {
    const response = await clinicalClient.post(`/lab-reports/${id}/status`, payload);
    return response.data;
  }

  async verifyLabReport(id: string): Promise<LabReport> {
    const response = await clinicalClient.post(`/lab-reports/${id}/verify`);
    return response.data;
  }

  async amendLabReport(id: string, payload: AmendReportInput): Promise<LabReport> {
    const response = await clinicalClient.post(`/lab-reports/${id}/amend`, payload);
    return response.data;
  }

  async getLabReportHistory(id: string): Promise<ReportStatusHistoryEntry[]> {
    const response = await clinicalClient.get(`/lab-reports/${id}/history`);
    return response.data;
  }

  // ========================================
  // PATHOLOGY REPORTS
  // ========================================

  async createPathologyReport(payload: CreatePathologyReportInput): Promise<PathologyReport> {
    const response = await clinicalClient.post('/pathology-reports', payload);
    return response.data;
  }

  async getPathologyReport(id: string): Promise<PathologyReport> {
    const response = await clinicalClient.get(`/pathology-reports/${id}`);
    return response.data;
  }

  async getPathologyReportsByOrder(orderId: string): Promise<PathologyReport[]> {
    const response = await clinicalClient.get(`/pathology-reports/order/${orderId}`);
    return response.data;
  }

  async updatePathologyReport(id: string, payload: UpdatePathologyReportInput): Promise<PathologyReport> {
    const response = await clinicalClient.patch(`/pathology-reports/${id}`, payload);
    return response.data;
  }

  async transitionPathologyReportStatus(id: string, payload: ReportStatusTransitionInput): Promise<PathologyReport> {
    const response = await clinicalClient.post(`/pathology-reports/${id}/status`, payload);
    return response.data;
  }

  async verifyPathologyReport(id: string): Promise<PathologyReport> {
    const response = await clinicalClient.post(`/pathology-reports/${id}/verify`);
    return response.data;
  }

  async amendPathologyReport(id: string, payload: AmendReportInput): Promise<PathologyReport> {
    const response = await clinicalClient.post(`/pathology-reports/${id}/amend`, payload);
    return response.data;
  }

  async getPathologyReportHistory(id: string): Promise<ReportStatusHistoryEntry[]> {
    const response = await clinicalClient.get(`/pathology-reports/${id}/history`);
    return response.data;
  }

  // ========================================
  // IMAGING REPORTS
  // ========================================

  async createImagingReport(payload: CreateImagingReportInput): Promise<ImagingReport> {
    const response = await clinicalClient.post('/imaging-reports', payload);
    return response.data;
  }

  async getImagingReport(id: string): Promise<ImagingReport> {
    const response = await clinicalClient.get(`/imaging-reports/${id}`);
    return response.data;
  }

  async getImagingReportsByOrder(orderId: string): Promise<ImagingReport[]> {
    const response = await clinicalClient.get(`/imaging-reports/order/${orderId}`);
    return response.data;
  }

  async updateImagingReport(id: string, payload: UpdateImagingReportInput): Promise<ImagingReport> {
    const response = await clinicalClient.patch(`/imaging-reports/${id}`, payload);
    return response.data;
  }

  async transitionImagingReportStatus(id: string, payload: ReportStatusTransitionInput): Promise<ImagingReport> {
    const response = await clinicalClient.post(`/imaging-reports/${id}/status`, payload);
    return response.data;
  }

  async verifyImagingReport(id: string): Promise<ImagingReport> {
    const response = await clinicalClient.post(`/imaging-reports/${id}/verify`);
    return response.data;
  }

  async recordCriticalFinding(id: string, notifiedTo: string): Promise<ImagingReport> {
    const response = await clinicalClient.post(`/imaging-reports/${id}/critical-finding`, { notifiedTo });
    return response.data;
  }

  async acknowledgeCriticalFinding(id: string): Promise<ImagingReport> {
    const response = await clinicalClient.post(`/imaging-reports/${id}/critical-finding/acknowledge`);
    return response.data;
  }

  async amendImagingReport(id: string, payload: AmendReportInput): Promise<ImagingReport> {
    const response = await clinicalClient.post(`/imaging-reports/${id}/amend`, payload);
    return response.data;
  }

  async getImagingReportHistory(id: string): Promise<ReportStatusHistoryEntry[]> {
    const response = await clinicalClient.get(`/imaging-reports/${id}/history`);
    return response.data;
  }

  // ========================================
  // PROCEDURE REPORTS
  // ========================================

  async createProcedureReport(payload: CreateProcedureReportInput): Promise<ProcedureReport> {
    const response = await clinicalClient.post('/procedure-reports', payload);
    return response.data;
  }

  async getProcedureReport(id: string): Promise<ProcedureReport> {
    const response = await clinicalClient.get(`/procedure-reports/${id}`);
    return response.data;
  }

  async getProcedureReportsByOrder(orderId: string): Promise<ProcedureReport[]> {
    const response = await clinicalClient.get(`/procedure-reports/order/${orderId}`);
    return response.data;
  }

  async updateProcedureReport(id: string, payload: UpdateProcedureReportInput): Promise<ProcedureReport> {
    const response = await clinicalClient.patch(`/procedure-reports/${id}`, payload);
    return response.data;
  }

  async transitionProcedureReportStatus(id: string, payload: ReportStatusTransitionInput): Promise<ProcedureReport> {
    const response = await clinicalClient.post(`/procedure-reports/${id}/status`, payload);
    return response.data;
  }

  async verifyProcedureReport(id: string): Promise<ProcedureReport> {
    const response = await clinicalClient.post(`/procedure-reports/${id}/verify`);
    return response.data;
  }

  async amendProcedureReport(id: string, payload: AmendReportInput): Promise<ProcedureReport> {
    const response = await clinicalClient.post(`/procedure-reports/${id}/amend`, payload);
    return response.data;
  }

  async getProcedureReportHistory(id: string): Promise<ReportStatusHistoryEntry[]> {
    const response = await clinicalClient.get(`/procedure-reports/${id}/history`);
    return response.data;
  }

  // ========================================
  // PATIENT RESULTS (Aggregated)
  // ========================================

  async getAllResults(
    params?: { type?: string; status?: string; page?: number; limit?: number },
  ): Promise<PatientResultsResponse> {
    const response = await clinicalClient.get('/patient-results', { params });
    return response.data;
  }

  async getPatientResults(
    patientId: string,
    params?: { type?: string; status?: string; page?: number; limit?: number },
  ): Promise<PatientResultsResponse> {
    const response = await clinicalClient.get(`/patient-results/patient/${patientId}`, { params });
    return response.data;
  }

  async getEncounterResults(encounterId: string): Promise<PatientResult[]> {
    const response = await clinicalClient.get(`/patient-results/encounter/${encounterId}`);
    return response.data;
  }

  async getReportableOrders(
    orderType: string,
    params?: { search?: string; limit?: number },
  ): Promise<ReportableOrder[]> {
    const response = await clinicalClient.get(`/patient-results/reportable-orders/${orderType}`, { params });
    return response.data;
  }
}

export const reportingService = new ReportingService();
