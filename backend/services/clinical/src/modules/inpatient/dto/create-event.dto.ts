/**
 * DTO for creating an inpatient event
 */

import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
} from 'class-validator';

export enum InpatientEventType {
  ADMISSION_CREATED = 'admission_created',
  BED_ASSIGNED = 'bed_assigned',
  PATIENT_TRANSFERRED = 'patient_transferred',
  ALERT_RAISED = 'alert_raised',
  VITALS_RECORDED = 'vitals_recorded',
  DISCHARGE_INITIATED = 'discharge_initiated',
  DISCHARGE_COMPLETED = 'discharge_completed',
}

export enum EventCategory {
  ADMISSION = 'admission',
  TRANSFER = 'transfer',
  CLINICAL = 'clinical',
  DISCHARGE = 'discharge',
  ALERT = 'alert',
}

export class CreateEventDto {
  @IsEnum(InpatientEventType)
  eventType!: InpatientEventType;

  @IsEnum(EventCategory)
  eventCategory!: EventCategory;

  @IsObject()
  eventData!: Record<string, any>;

  @IsString()
  @IsOptional()
  notes?: string;
}
