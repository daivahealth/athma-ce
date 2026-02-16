import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { biomarkerService } from '../services/biomarker-service';
import type {
  BiomarkerCategory,
  CreateBiomarkerInput,
  RecordBiomarkerResultInput,
  BiomarkerFilters,
} from '../types/biomarker';

// Definitions
export function useBiomarkers(filters?: { category?: BiomarkerCategory; isActive?: boolean }) {
  return useQuery({
    queryKey: ['biomarkers', filters],
    queryFn: () => biomarkerService.listBiomarkers(filters),
  });
}

export function useBiomarker(id?: string) {
  return useQuery({
    queryKey: ['biomarker', id],
    queryFn: () => biomarkerService.getBiomarkerById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBiomarker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBiomarkerInput) => biomarkerService.createBiomarker(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarkers'] });
    },
  });
}

export function useUpdateBiomarker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateBiomarkerInput> }) =>
      biomarkerService.updateBiomarker(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['biomarkers'] });
      queryClient.invalidateQueries({ queryKey: ['biomarker', data.id] });
    },
  });
}

// Results
export function useRecordBiomarkerResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordBiomarkerResultInput) => biomarkerService.recordResult(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['biomarker-results', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-latest', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-trends', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-dashboard', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-alerts', data.patientId] });
    },
  });
}

export function usePatientBiomarkerResults(patientId?: string, filters?: Omit<BiomarkerFilters, 'patientId'>) {
  return useQuery({
    queryKey: ['biomarker-results', patientId, filters],
    queryFn: () => biomarkerService.getPatientResults(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function usePatientLatestBiomarkers(patientId?: string) {
  return useQuery({
    queryKey: ['biomarker-latest', patientId],
    queryFn: () => biomarkerService.getPatientLatestResults(patientId!),
    enabled: Boolean(patientId),
  });
}

// Trends
export function usePatientBiomarkerTrends(patientId?: string, daysBack?: number) {
  return useQuery({
    queryKey: ['biomarker-trends', patientId, daysBack],
    queryFn: () => biomarkerService.getPatientTrends(patientId!, daysBack),
    enabled: Boolean(patientId),
  });
}

export function useBiomarkerTrend(patientId?: string, biomarkerId?: string, daysBack?: number) {
  return useQuery({
    queryKey: ['biomarker-trend', patientId, biomarkerId, daysBack],
    queryFn: () => biomarkerService.getBiomarkerTrend(patientId!, biomarkerId!, daysBack),
    enabled: Boolean(patientId) && Boolean(biomarkerId),
  });
}

// Alerts
export function usePatientBiomarkerAlerts(patientId?: string, status?: 'active' | 'acknowledged' | 'resolved') {
  return useQuery({
    queryKey: ['biomarker-alerts', patientId, status],
    queryFn: () => biomarkerService.getPatientAlerts(patientId!, status),
    enabled: Boolean(patientId),
  });
}

export function useActiveBiomarkerAlerts() {
  return useQuery({
    queryKey: ['biomarker-alerts-active'],
    queryFn: () => biomarkerService.getActiveAlerts(),
  });
}

export function useAcknowledgeBiomarkerAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => biomarkerService.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarker-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-alerts-active'] });
    },
  });
}

export function useResolveBiomarkerAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, notes }: { alertId: string; notes?: string }) =>
      biomarkerService.resolveAlert(alertId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarker-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['biomarker-alerts-active'] });
    },
  });
}

// Dashboard
export function usePatientBiomarkerDashboard(patientId?: string) {
  return useQuery({
    queryKey: ['biomarker-dashboard', patientId],
    queryFn: () => biomarkerService.getPatientBiomarkerDashboard(patientId!),
    enabled: Boolean(patientId),
  });
}
