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

// Import Prisma-generated enums to avoid type mismatches
import {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
  InpatientEventType,
} from '@zeal/database-clinical';

// Re-export for convenience
export {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
  InpatientEventType,
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * Base DTO for creating any inpatient event
 * All fields map to InpatientEvent model
 */
export class CreateEventDto {
  @IsUUID("all")
  facilityId!: string;

  @IsUUID("all")
  admissionId!: string;

  @IsUUID("all")
  encounterId!: string;

  @IsUUID("all")
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
  @IsUUID("all")
  @IsOptional()
  fromWardId?: string;

  @IsUUID("all")
  @IsOptional()
  fromSpaceId?: string;

  @IsUUID("all")
  @IsOptional()
  fromBedId?: string;

  @IsUUID("all")
  @IsOptional()
  toWardId?: string;

  @IsUUID("all")
  @IsOptional()
  toSpaceId?: string;

  @IsUUID("all")
  @IsOptional()
  toBedId?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsUUID("all")
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
  @IsUUID("all")
  fromWardId!: string;

  @IsUUID("all")
  fromSpaceId!: string;

  @IsUUID("all")
  fromBedId!: string;

  @IsUUID("all")
  toWardId!: string;

  @IsUUID("all")
  toSpaceId!: string;

  @IsUUID("all")
  toBedId!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
