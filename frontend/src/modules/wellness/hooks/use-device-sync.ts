import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deviceSyncService } from '../services/device-sync-service';
import type {
  InitiateConnectionInput,
  CompleteConnectionInput,
  TriggerSyncInput,
  MetricFilters,
  MetricType,
} from '../types/device-sync';

// Supported Devices
export function useSupportedDevices() {
  return useQuery({
    queryKey: ['supported-devices'],
    queryFn: () => deviceSyncService.getSupportedDevices(),
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
  });
}

// Connections
export function useInitiateDeviceConnection() {
  return useMutation({
    mutationFn: (payload: InitiateConnectionInput) => deviceSyncService.initiateConnection(payload),
  });
}

export function useCompleteDeviceConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ connectionId, payload }: { connectionId: string; payload: CompleteConnectionInput }) =>
      deviceSyncService.completeConnection(connectionId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-connections', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['device-dashboard', data.patientId] });
    },
  });
}

export function useDeviceConnection(connectionId?: string) {
  return useQuery({
    queryKey: ['device-connection', connectionId],
    queryFn: () => deviceSyncService.getConnection(connectionId!),
    enabled: Boolean(connectionId),
  });
}

export function usePatientDeviceConnections(patientId?: string) {
  return useQuery({
    queryKey: ['device-connections', patientId],
    queryFn: () => deviceSyncService.getPatientConnections(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useUpdateDeviceConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      connectionId,
      payload,
    }: {
      connectionId: string;
      payload: { syncEnabled?: boolean; selectedMetrics?: MetricType[] };
    }) => deviceSyncService.updateConnection(connectionId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-connection', data.id] });
      queryClient.invalidateQueries({ queryKey: ['device-connections', data.patientId] });
    },
  });
}

export function useDisconnectDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => deviceSyncService.disconnectDevice(connectionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-connections', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['device-dashboard', data.patientId] });
    },
  });
}

// Sync
export function useTriggerDeviceSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TriggerSyncInput) => deviceSyncService.triggerSync(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sync-logs', variables.connectionId] });
      queryClient.invalidateQueries({ queryKey: ['device-connection', variables.connectionId] });
    },
  });
}

export function useDeviceSyncLogs(connectionId?: string, limit?: number) {
  return useQuery({
    queryKey: ['sync-logs', connectionId, limit],
    queryFn: () => deviceSyncService.getSyncLogs(connectionId!, limit),
    enabled: Boolean(connectionId),
  });
}

// Metrics
export function usePatientHealthMetrics(patientId?: string, filters?: Omit<MetricFilters, 'patientId'>) {
  return useQuery({
    queryKey: ['health-metrics', patientId, filters],
    queryFn: () => deviceSyncService.getPatientMetrics(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function usePatientMetricSummaries(patientId?: string, daysBack?: number) {
  return useQuery({
    queryKey: ['metric-summaries', patientId, daysBack],
    queryFn: () => deviceSyncService.getPatientMetricSummaries(patientId!, daysBack),
    enabled: Boolean(patientId),
  });
}

// Dashboard
export function usePatientDeviceDashboard(patientId?: string) {
  return useQuery({
    queryKey: ['device-dashboard', patientId],
    queryFn: () => deviceSyncService.getPatientDeviceDashboard(patientId!),
    enabled: Boolean(patientId),
  });
}

// CGM
export function useCGMSummary(patientId?: string, daysBack?: number) {
  return useQuery({
    queryKey: ['cgm-summary', patientId, daysBack],
    queryFn: () => deviceSyncService.getCGMSummary(patientId!, daysBack),
    enabled: Boolean(patientId),
  });
}

export function useCGMReadings(patientId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['cgm-readings', patientId, startDate, endDate],
    queryFn: () => deviceSyncService.getCGMReadings(patientId!, startDate!, endDate!),
    enabled: Boolean(patientId) && Boolean(startDate) && Boolean(endDate),
  });
}
