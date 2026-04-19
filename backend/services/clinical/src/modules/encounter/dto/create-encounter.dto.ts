/**
 * DTO for creating a new encounter
 */

import {
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsObject,
  IsString,
} from 'class-validator';

export enum EncounterClass {
  AMB = 'AMB', // Ambulatory
  EMER = 'EMER', // Emergency
  FLD = 'FLD', // Field
  HH = 'HH', // Home Health
  IMP = 'IMP', // Inpatient Encounter
  ACUTE = 'ACUTE', // Inpatient Acute
  NONAC = 'NONAC', // Inpatient Non-acute
  OBSENC = 'OBSENC', // Observation Encounter
  PRENC = 'PRENC', // Pre-admission
  SS = 'SS', // Short Stay
  VR = 'VR', // Virtual
}

export enum EncounterStatus {
  PLANNED = 'planned',
  ARRIVED = 'arrived',
  TRIAGED = 'triaged',
  IN_PROGRESS = 'in-progress',
  ON_LEAVE = 'onleave',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  ENTERED_IN_ERROR = 'entered-in-error',
  UNKNOWN = 'unknown',
}

export enum EncounterPriority {
  STAT = 'stat', // Immediate
  ASAP = 'asap', // As soon as possible
  URGENT = 'urgent', // Urgent
  ROUTINE = 'routine', // Routine
  ELECTIVE = 'elective', // Elective
}

export enum EncounterSource {
  APPOINTMENT = 'appointment',
  WALK_IN = 'walk-in',
  REFERRAL = 'referral',
  EMERGENCY = 'emergency',
  TRANSFER = 'transfer',
}

export class CreateEncounterDto {
  @IsUUID("loose" as any)
  patientId!: string;

  @IsUUID("loose" as any)
  @IsOptional()
  appointmentId?: string;

  @IsUUID("loose" as any)
  primaryStaffId!: string;

  @IsEnum(EncounterClass)
  @IsOptional()
  encounterClass?: EncounterClass;

  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @IsEnum(EncounterPriority)
  @IsOptional()
  priority?: EncounterPriority;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsEnum(EncounterSource)
  @IsOptional()
  encounterSource?: EncounterSource;

  @IsString()
  @IsOptional()
  encounterNumber?: string;

  @IsObject()
  @IsOptional()
  walkInDetails?: {
    arrivalTime?: string;
    arrivalMode?: string;
    reasonForVisit?: string;
  };

}
