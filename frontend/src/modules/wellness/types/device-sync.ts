// Device Sync Types

export type DeviceType =
  | 'apple_health'
  | 'fitbit'
  | 'oura'
  | 'garmin'
  | 'dexcom'
  | 'libre'
  | 'whoop'
  | 'samsung_health'
  | 'google_fit';

export type MetricType =
  | 'steps'
  | 'heart_rate'
  | 'hrv'
  | 'sleep'
  | 'blood_oxygen'
  | 'blood_glucose'
  | 'blood_pressure'
  | 'body_temperature'
  | 'weight'
  | 'body_fat'
  | 'calories'
  | 'active_minutes'
  | 'distance'
  | 'floors_climbed'
  | 'respiratory_rate'
  | 'stress'
  | 'readiness';

export type ConnectionStatus = 'pending' | 'active' | 'expired' | 'revoked' | 'error';
export type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'partial';

export interface DeviceConnection {
  id: string;
  tenantId: string;
  patientId: string;
  deviceType: DeviceType;
  status: ConnectionStatus;
  syncEnabled: boolean;
  lastSyncAt?: string;
  selectedMetrics?: MetricType[];
  externalUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  connectionId: string;
  status: SyncStatus;
  startedAt: string;
  completedAt?: string;
  recordsProcessed?: number;
  errorMessage?: string;
  syncDetails?: Record<string, unknown>;
}

export interface HealthMetric {
  id: string;
  patientId: string;
  connectionId: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MetricSummary {
  metricType: MetricType;
  latestValue: number;
  averageValue?: number;
  minValue?: number;
  maxValue?: number;
  recordCount: number;
  lastRecordedAt: string;
}

export interface PatientDeviceDashboard {
  patientId: string;
  connections: DeviceConnection[];
  metricSummaries: MetricSummary[];
  recentSyncs?: SyncLog[];
}

export interface CGMSummary {
  averageGlucose: number;
  timeInRange: number;
  timeAboveRange: number;
  timeBelowRange: number;
  glucoseVariability: number;
  estimatedA1C: number;
  periodStart: string;
  periodEnd: string;
  readingCount: number;
}

export interface SupportedDevice {
  deviceType: DeviceType;
  displayName: string;
  supportedMetrics: MetricType[];
  iconUrl?: string;
}

export interface InitiateConnectionInput {
  patientId: string;
  deviceType: DeviceType;
  redirectUri?: string;
}

export interface CompleteConnectionInput {
  authorizationCode: string;
  state?: string;
}

export interface TriggerSyncInput {
  connectionId: string;
  startDate?: string;
  endDate?: string;
  metrics?: MetricType[];
}

export interface MetricFilters {
  patientId: string;
  metricTypes?: MetricType[];
  startDate?: string;
  endDate?: string;
  limit?: number;
}
