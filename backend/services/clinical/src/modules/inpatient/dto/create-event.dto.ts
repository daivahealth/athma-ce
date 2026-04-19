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
  @IsUUID("loose" as any)
  facilityId!: string;

  @IsUUID("loose" as any)
  admissionId!: string;

  @IsUUID("loose" as any)
  encounterId!: string;

  @IsUUID("loose" as any)
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
  @IsUUID("loose" as any)
  @IsOptional()
  fromWardId?: string;

  @IsUUID("loose" as any)
  @IsOptional()
  fromSpaceId?: string;

  @IsUUID("loose" as any)
  @IsOptional()
  fromBedId?: string;

  @IsUUID("loose" as any)
  @IsOptional()
  toWardId?: string;

  @IsUUID("loose" as any)
  @IsOptional()
  toSpaceId?: string;

  @IsUUID("loose" as any)
  @IsOptional()
  toBedId?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsUUID("loose" as any)
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
  @IsUUID("loose" as any)
  fromWardId!: string;

  @IsUUID("loose" as any)
  fromSpaceId!: string;

  @IsUUID("loose" as any)
  fromBedId!: string;

  @IsUUID("loose" as any)
  toWardId!: string;

  @IsUUID("loose" as any)
  toSpaceId!: string;

  @IsUUID("loose" as any)
  toBedId!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
