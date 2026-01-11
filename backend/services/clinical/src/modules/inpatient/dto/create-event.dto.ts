/**
 * DTO for creating inpatient events
 * Supports comprehensive audit trail with explicit state transitions
 */

import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';

// ============================================================================
// Enums matching Prisma schema
// ============================================================================

export enum InpatientAdmissionStatus {
  ADMITTED = 'ADMITTED',
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  DISCHARGE_PLANNING = 'DISCHARGE_PLANNING',
  DISCHARGED = 'DISCHARGED',
  EXPIRED = 'EXPIRED',
  ABSCONDED = 'ABSCONDED',
  CANCELLED = 'CANCELLED',
}

export enum InpatientDischargeStatus {
  NONE = 'NONE',
  FIT_FOR_DISCHARGE = 'FIT_FOR_DISCHARGE',
  INITIATED = 'INITIATED',
  READY = 'READY',
  CONFIRMED = 'CONFIRMED',
}

export enum InpatientAcuity {
  STABLE = 'STABLE',
  WATCH = 'WATCH',
  CRITICAL = 'CRITICAL',
}

export enum InpatientEventType {
  ADMISSION_CREATED = 'ADMISSION_CREATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DISCHARGE_STATUS_CHANGED = 'DISCHARGE_STATUS_CHANGED',
  BED_ASSIGNED = 'BED_ASSIGNED',
  BED_RELEASED = 'BED_RELEASED',
  TRANSFERRED = 'TRANSFERRED',
  FLAG_ADDED = 'FLAG_ADDED',
  FLAG_REMOVED = 'FLAG_REMOVED',
  ACUITY_CHANGED = 'ACUITY_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  DISCHARGE_CONFIRMED = 'DISCHARGE_CONFIRMED',
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Base DTO for creating any inpatient event
 * All fields map to InpatientEvent model
 */
export class CreateEventDto {
  @IsUUID()
  facilityId!: string;

  @IsUUID()
  admissionId!: string;

  @IsUUID()
  encounterId!: string;

  @IsUUID()
  patientId!: string;

  @IsEnum(InpatientEventType)
  eventType!: InpatientEventType;

  // Status Change Tracking (optional)
  @IsEnum(InpatientAdmissionStatus)
  @IsOptional()
  fromAdmissionStatus?: InpatientAdmissionStatus;

  @IsEnum(InpatientAdmissionStatus)
  @IsOptional()
  toAdmissionStatus?: InpatientAdmissionStatus;

  @IsEnum(InpatientDischargeStatus)
  @IsOptional()
  fromDischargeStatus?: InpatientDischargeStatus;

  @IsEnum(InpatientDischargeStatus)
  @IsOptional()
  toDischargeStatus?: InpatientDischargeStatus;

  @IsEnum(InpatientAcuity)
  @IsOptional()
  fromAcuity?: InpatientAcuity;

  @IsEnum(InpatientAcuity)
  @IsOptional()
  toAcuity?: InpatientAcuity;

  // Location Change Tracking (optional, for transfers)
  @IsUUID()
  @IsOptional()
  fromWardId?: string;

  @IsUUID()
  @IsOptional()
  fromSpaceId?: string;

  @IsUUID()
  @IsOptional()
  fromBedId?: string;

  @IsUUID()
  @IsOptional()
  toWardId?: string;

  @IsUUID()
  @IsOptional()
  toSpaceId?: string;

  @IsUUID()
  @IsOptional()
  toBedId?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsUUID()
  performedBy!: string;
}

/**
 * Simplified DTO for logging admission status changes
 */
export class LogAdmissionStatusChangeDto {
  @IsEnum(InpatientAdmissionStatus)
  fromStatus!: InpatientAdmissionStatus;

  @IsEnum(InpatientAdmissionStatus)
  toStatus!: InpatientAdmissionStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * Simplified DTO for logging discharge status changes
 */
export class LogDischargeStatusChangeDto {
  @IsEnum(InpatientDischargeStatus)
  fromStatus!: InpatientDischargeStatus;

  @IsEnum(InpatientDischargeStatus)
  toStatus!: InpatientDischargeStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * Simplified DTO for logging transfers
 */
export class LogTransferDto {
  @IsUUID()
  fromWardId!: string;

  @IsUUID()
  fromSpaceId!: string;

  @IsUUID()
  fromBedId!: string;

  @IsUUID()
  toWardId!: string;

  @IsUUID()
  toSpaceId!: string;

  @IsUUID()
  toBedId!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
