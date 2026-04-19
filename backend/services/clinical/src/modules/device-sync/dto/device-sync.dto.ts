import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsObject,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// Enums
// ============================================

export enum DeviceType {
  APPLE_HEALTH = 'apple_health',
  FITBIT = 'fitbit',
  OURA = 'oura',
  GARMIN = 'garmin',
  DEXCOM = 'dexcom',
  LIBRE = 'libre',
  WHOOP = 'whoop',
  SAMSUNG_HEALTH = 'samsung_health',
  GOOGLE_FIT = 'google_fit',
}

export enum MetricType {
  STEPS = 'steps',
  HEART_RATE = 'heart_rate',
  HRV = 'hrv',
  SLEEP = 'sleep',
  BLOOD_OXYGEN = 'blood_oxygen',
  BLOOD_GLUCOSE = 'blood_glucose',
  BLOOD_PRESSURE = 'blood_pressure',
  BODY_TEMPERATURE = 'body_temperature',
  WEIGHT = 'weight',
  BODY_FAT = 'body_fat',
  CALORIES = 'calories',
  ACTIVE_MINUTES = 'active_minutes',
  DISTANCE = 'distance',
  FLOORS_CLIMBED = 'floors_climbed',
  RESPIRATORY_RATE = 'respiratory_rate',
  STRESS = 'stress',
  READINESS = 'readiness',
}

export enum ConnectionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  ERROR = 'error',
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

// ============================================
// Device Connection DTOs
// ============================================

export class InitiateConnectionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  patientId!: string;

  @ApiProperty({ enum: DeviceType, description: 'Device/platform type' })
  @IsEnum(DeviceType)
  deviceType!: DeviceType;

  @ApiPropertyOptional({ description: 'Redirect URI after OAuth' })
  @IsOptional()
  @IsString()
  redirectUri?: string;
}

export class CompleteConnectionDto {
  @ApiProperty({ description: 'OAuth authorization code' })
  @IsString()
  authorizationCode!: string;

  @ApiPropertyOptional({ description: 'OAuth state parameter' })
  @IsOptional()
  @IsString()
  state?: string;
}

export class UpdateConnectionDto {
  @ApiPropertyOptional({ enum: ConnectionStatus, description: 'Connection status' })
  @IsOptional()
  @IsEnum(ConnectionStatus)
  status?: ConnectionStatus;

  @ApiPropertyOptional({ description: 'Sync enabled' })
  @IsOptional()
  @IsBoolean()
  syncEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Selected metric types to sync' })
  @IsOptional()
  @IsArray()
  selectedMetrics?: MetricType[];
}

export class DeviceConnectionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty({ enum: DeviceType })
  deviceType!: DeviceType;

  @ApiProperty({ enum: ConnectionStatus })
  status!: ConnectionStatus;

  @ApiProperty()
  syncEnabled!: boolean;

  @ApiPropertyOptional()
  lastSyncAt?: Date;

  @ApiPropertyOptional()
  selectedMetrics?: MetricType[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

// ============================================
// Sync DTOs
// ============================================

export class TriggerSyncDto {
  @ApiProperty({ description: 'Connection ID' })
  @IsUUID("loose" as any)
  connectionId!: string;

  @ApiPropertyOptional({ description: 'Start date for sync range' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for sync range' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Specific metrics to sync' })
  @IsOptional()
  @IsArray()
  metrics?: MetricType[];
}

export class SyncLogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  connectionId!: string;

  @ApiProperty({ enum: SyncStatus })
  status!: SyncStatus;

  @ApiProperty()
  startedAt!: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  recordsProcessed?: number;

  @ApiPropertyOptional()
  errorMessage?: string;

  @ApiPropertyOptional()
  syncDetails?: Record<string, any>;
}

// ============================================
// Health Metric DTOs
// ============================================

export class HealthMetricDto {
  @ApiProperty({ enum: MetricType })
  @IsEnum(MetricType)
  metricType!: MetricType;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value!: number;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Timestamp of measurement' })
  @IsDateString()
  recordedAt!: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class BulkMetricsDto {
  @ApiProperty({ description: 'Connection ID' })
  @IsUUID("loose" as any)
  connectionId!: string;

  @ApiProperty({ type: [HealthMetricDto] })
  @IsArray()
  metrics!: HealthMetricDto[];
}

export class HealthMetricResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  connectionId!: string;

  @ApiProperty({ enum: MetricType })
  metricType!: MetricType;

  @ApiProperty()
  value!: number;

  @ApiPropertyOptional()
  unit?: string;

  @ApiProperty()
  recordedAt!: Date;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt!: Date;
}

export class MetricSummaryDto {
  @ApiProperty({ enum: MetricType })
  metricType!: MetricType;

  @ApiProperty()
  latestValue!: number;

  @ApiPropertyOptional()
  averageValue?: number;

  @ApiPropertyOptional()
  minValue?: number;

  @ApiPropertyOptional()
  maxValue?: number;

  @ApiProperty()
  recordCount!: number;

  @ApiProperty()
  lastRecordedAt!: Date;
}

export class PatientDeviceDashboardDto {
  @ApiProperty()
  patientId!: string;

  @ApiProperty({ type: [DeviceConnectionResponseDto] })
  connections!: DeviceConnectionResponseDto[];

  @ApiProperty({ type: [MetricSummaryDto] })
  metricSummaries!: MetricSummaryDto[];

  @ApiPropertyOptional()
  recentSyncs?: SyncLogResponseDto[];
}

// ============================================
// CGM-Specific DTOs
// ============================================

export class CGMReadingDto {
  @ApiProperty({ description: 'Glucose value in mg/dL' })
  @IsNumber()
  glucoseValue!: number;

  @ApiProperty({ description: 'Timestamp of reading' })
  @IsDateString()
  recordedAt!: string;

  @ApiPropertyOptional({ description: 'Trend direction' })
  @IsOptional()
  @IsString()
  trend?: 'rising' | 'stable' | 'falling' | 'rising_rapidly' | 'falling_rapidly';

  @ApiPropertyOptional({ description: 'Is calibration reading' })
  @IsOptional()
  @IsBoolean()
  isCalibration?: boolean;
}

export class CGMSummaryDto {
  @ApiProperty()
  averageGlucose!: number;

  @ApiProperty()
  timeInRange!: number; // percentage

  @ApiProperty()
  timeAboveRange!: number;

  @ApiProperty()
  timeBelowRange!: number;

  @ApiProperty()
  glucoseVariability!: number;

  @ApiProperty()
  estimatedA1C!: number;

  @ApiProperty()
  periodStart!: Date;

  @ApiProperty()
  periodEnd!: Date;

  @ApiProperty()
  readingCount!: number;
}
