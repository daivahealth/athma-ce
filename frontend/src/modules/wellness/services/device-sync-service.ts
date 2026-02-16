import { clinicalClient } from '@/lib/api/client';
import type {
  DeviceConnection,
  SyncLog,
  HealthMetric,
  MetricSummary,
  PatientDeviceDashboard,
  CGMSummary,
  SupportedDevice,
  InitiateConnectionInput,
  CompleteConnectionInput,
  TriggerSyncInput,
  MetricFilters,
  MetricType,
} from '../types/device-sync';

class DeviceSyncService {
  // Supported Devices
  async getSupportedDevices(): Promise<SupportedDevice[]> {
    const response = await clinicalClient.get('/device-sync/supported-devices');
    return response.data;
  }

  // Connections
  async initiateConnection(payload: InitiateConnectionInput): Promise<{
    connectionId: string;
    authorizationUrl: string;
    state: string;
  }> {
    const response = await clinicalClient.post('/device-sync/connections/initiate', payload);
    return response.data;
  }

  async completeConnection(connectionId: string, payload: CompleteConnectionInput): Promise<DeviceConnection> {
    const response = await clinicalClient.post(`/device-sync/connections/${connectionId}/complete`, payload);
    return response.data;
  }

  async getConnection(connectionId: string): Promise<DeviceConnection> {
    const response = await clinicalClient.get(`/device-sync/connections/${connectionId}`);
    return response.data;
  }

  async getPatientConnections(patientId: string): Promise<DeviceConnection[]> {
    const response = await clinicalClient.get(`/device-sync/connections/patient/${patientId}`);
    return response.data;
  }

  async updateConnection(connectionId: string, payload: {
    syncEnabled?: boolean;
    selectedMetrics?: MetricType[];
  }): Promise<DeviceConnection> {
    const response = await clinicalClient.patch(`/device-sync/connections/${connectionId}`, payload);
    return response.data;
  }

  async disconnectDevice(connectionId: string): Promise<DeviceConnection> {
    const response = await clinicalClient.delete(`/device-sync/connections/${connectionId}`);
    return response.data;
  }

  // Sync
  async triggerSync(payload: TriggerSyncInput): Promise<{
    syncLogId: string;
    success: boolean;
    recordsProcessed: number;
    errors?: string[];
  }> {
    const response = await clinicalClient.post('/device-sync/sync', payload);
    return response.data;
  }

  async getSyncLogs(connectionId: string, limit?: number): Promise<SyncLog[]> {
    const response = await clinicalClient.get(`/device-sync/sync/logs/${connectionId}`, {
      params: { limit },
    });
    return response.data;
  }

  // Metrics
  async getPatientMetrics(patientId: string, filters?: Omit<MetricFilters, 'patientId'>): Promise<HealthMetric[]> {
    const response = await clinicalClient.get(`/device-sync/metrics/patient/${patientId}`, {
      params: filters,
    });
    return response.data;
  }

  async getPatientMetricSummaries(patientId: string, daysBack?: number): Promise<MetricSummary[]> {
    const response = await clinicalClient.get(`/device-sync/metrics/patient/${patientId}/summary`, {
      params: { daysBack },
    });
    return response.data;
  }

  // Dashboard
  async getPatientDeviceDashboard(patientId: string): Promise<PatientDeviceDashboard> {
    const response = await clinicalClient.get(`/device-sync/dashboard/patient/${patientId}`);
    return response.data;
  }

  // CGM-specific
  async getCGMSummary(patientId: string, daysBack?: number): Promise<CGMSummary> {
    const response = await clinicalClient.get(`/device-sync/metrics/patient/${patientId}/cgm-summary`, {
      params: { daysBack },
    });
    return response.data;
  }

  async getCGMReadings(patientId: string, startDate: string, endDate: string): Promise<HealthMetric[]> {
    const response = await clinicalClient.get(`/device-sync/metrics/patient/${patientId}`, {
      params: {
        metricTypes: ['blood_glucose'],
        startDate,
        endDate,
      },
    });
    return response.data;
  }
}

export const deviceSyncService = new DeviceSyncService();
