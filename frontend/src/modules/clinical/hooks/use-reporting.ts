import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportingService } from '../services/reporting-service';
import type {
  CreateLabReportInput,
  UpdateLabReportInput,
  LabResultItemInput,
  CreatePathologyReportInput,
  UpdatePathologyReportInput,
  CreateImagingReportInput,
  UpdateImagingReportInput,
  CreateProcedureReportInput,
  UpdateProcedureReportInput,
  ReportStatusTransitionInput,
  AmendReportInput,
} from '../types/reporting';

// ========================================
// LAB REPORT HOOKS
// ========================================

export function useLabReportsByOrder(orderId: string) {
  return useQuery({
    queryKey: ['lab-reports', 'order', orderId],
    queryFn: () => reportingService.getLabReportsByOrder(orderId),
    enabled: !!orderId,
  });
}

export function useLabReport(id: string) {
  return useQuery({
    queryKey: ['lab-reports', id],
    queryFn: () => reportingService.getLabReport(id),
    enabled: !!id,
  });
}

export function useCreateLabReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLabReportInput) =>
      reportingService.createLabReport(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', 'order', variables.orderId] });
    },
  });
}

export function useUpdateLabReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabReportInput }) =>
      reportingService.updateLabReport(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['lab-reports', result.id] });
    },
  });
}

export function useSaveLabResultItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, items }: { reportId: string; items: LabResultItemInput[] }) =>
      reportingService.saveLabResultItems(reportId, items),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', variables.reportId] });
    },
  });
}

export function useTransitionLabReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ReportStatusTransitionInput) =>
      reportingService.transitionLabReportStatus(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['lab-reports', result.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
      queryClient.invalidateQueries({ queryKey: ['encounter-results'] });
    },
  });
}

export function useVerifyLabReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportingService.verifyLabReport(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', result.id] });
    },
  });
}

export function useAmendLabReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & AmendReportInput) =>
      reportingService.amendLabReport(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
    },
  });
}

export function useLabReportHistory(id: string) {
  return useQuery({
    queryKey: ['lab-reports', id, 'history'],
    queryFn: () => reportingService.getLabReportHistory(id),
    enabled: !!id,
  });
}

// ========================================
// PATHOLOGY REPORT HOOKS
// ========================================

export function usePathologyReportsByOrder(orderId: string) {
  return useQuery({
    queryKey: ['pathology-reports', 'order', orderId],
    queryFn: () => reportingService.getPathologyReportsByOrder(orderId),
    enabled: !!orderId,
  });
}

export function usePathologyReport(id: string) {
  return useQuery({
    queryKey: ['pathology-reports', id],
    queryFn: () => reportingService.getPathologyReport(id),
    enabled: !!id,
  });
}

export function useCreatePathologyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePathologyReportInput) =>
      reportingService.createPathologyReport(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', 'order', variables.orderId] });
    },
  });
}

export function useUpdatePathologyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePathologyReportInput }) =>
      reportingService.updatePathologyReport(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', result.id] });
    },
  });
}

export function useTransitionPathologyReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ReportStatusTransitionInput) =>
      reportingService.transitionPathologyReportStatus(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', result.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
      queryClient.invalidateQueries({ queryKey: ['encounter-results'] });
    },
  });
}

export function useVerifyPathologyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportingService.verifyPathologyReport(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', result.id] });
    },
  });
}

export function useAmendPathologyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & AmendReportInput) =>
      reportingService.amendPathologyReport(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['pathology-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
    },
  });
}

export function usePathologyReportHistory(id: string) {
  return useQuery({
    queryKey: ['pathology-reports', id, 'history'],
    queryFn: () => reportingService.getPathologyReportHistory(id),
    enabled: !!id,
  });
}

// ========================================
// IMAGING REPORT HOOKS
// ========================================

export function useImagingReportsByOrder(orderId: string) {
  return useQuery({
    queryKey: ['imaging-reports', 'order', orderId],
    queryFn: () => reportingService.getImagingReportsByOrder(orderId),
    enabled: !!orderId,
  });
}

export function useImagingReport(id: string) {
  return useQuery({
    queryKey: ['imaging-reports', id],
    queryFn: () => reportingService.getImagingReport(id),
    enabled: !!id,
  });
}

export function useCreateImagingReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateImagingReportInput) =>
      reportingService.createImagingReport(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', 'order', variables.orderId] });
    },
  });
}

export function useUpdateImagingReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateImagingReportInput }) =>
      reportingService.updateImagingReport(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', result.id] });
    },
  });
}

export function useTransitionImagingReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ReportStatusTransitionInput) =>
      reportingService.transitionImagingReportStatus(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', result.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
      queryClient.invalidateQueries({ queryKey: ['encounter-results'] });
    },
  });
}

export function useVerifyImagingReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportingService.verifyImagingReport(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', result.id] });
    },
  });
}

export function useAmendImagingReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & AmendReportInput) =>
      reportingService.amendImagingReport(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['imaging-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
    },
  });
}

export function useImagingReportHistory(id: string) {
  return useQuery({
    queryKey: ['imaging-reports', id, 'history'],
    queryFn: () => reportingService.getImagingReportHistory(id),
    enabled: !!id,
  });
}

// ========================================
// PROCEDURE REPORT HOOKS
// ========================================

export function useProcedureReportsByOrder(orderId: string) {
  return useQuery({
    queryKey: ['procedure-reports', 'order', orderId],
    queryFn: () => reportingService.getProcedureReportsByOrder(orderId),
    enabled: !!orderId,
  });
}

export function useProcedureReport(id: string) {
  return useQuery({
    queryKey: ['procedure-reports', id],
    queryFn: () => reportingService.getProcedureReport(id),
    enabled: !!id,
  });
}

export function useCreateProcedureReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProcedureReportInput) =>
      reportingService.createProcedureReport(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', 'order', variables.orderId] });
    },
  });
}

export function useUpdateProcedureReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcedureReportInput }) =>
      reportingService.updateProcedureReport(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', result.id] });
    },
  });
}

export function useTransitionProcedureReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ReportStatusTransitionInput) =>
      reportingService.transitionProcedureReportStatus(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', result.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
      queryClient.invalidateQueries({ queryKey: ['encounter-results'] });
    },
  });
}

export function useVerifyProcedureReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportingService.verifyProcedureReport(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', result.id] });
    },
  });
}

export function useAmendProcedureReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & AmendReportInput) =>
      reportingService.amendProcedureReport(id, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['procedure-reports', 'order', result.orderId] });
      queryClient.invalidateQueries({ queryKey: ['patient-results'] });
    },
  });
}

export function useProcedureReportHistory(id: string) {
  return useQuery({
    queryKey: ['procedure-reports', id, 'history'],
    queryFn: () => reportingService.getProcedureReportHistory(id),
    enabled: !!id,
  });
}

// ========================================
// AGGREGATED PATIENT RESULTS HOOKS
// ========================================

export function useAllResults(
  params?: { type?: string; status?: string; search?: string; page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ['all-results', params],
    queryFn: () => reportingService.getAllResults(params),
  });
}

export function usePatientResults(
  patientId: string,
  params?: { type?: string; status?: string; page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ['patient-results', patientId, params],
    queryFn: () => reportingService.getPatientResults(patientId, params),
    enabled: !!patientId,
  });
}

export function useEncounterResults(encounterId: string) {
  return useQuery({
    queryKey: ['encounter-results', encounterId],
    queryFn: () => reportingService.getEncounterResults(encounterId),
    enabled: !!encounterId,
  });
}

export function useReportableOrders(
  orderType: string,
  params?: { search?: string; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: ['reportable-orders', orderType, params],
    queryFn: () => reportingService.getReportableOrders(orderType, params),
    enabled: !!orderType && enabled,
  });
}
