/**
 * DTO for creating a new inpatient admission
 */

import {
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsArray,
  IsNumber,
  IsDecimal,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AdmissionType {
  ELECTIVE = 'elective',
  EMERGENCY = 'emergency',
  MATERNITY = 'maternity',
  DAY_CASE = 'day_case',
  TRANSFER = 'transfer',
}

export enum AdmissionSource {
  EMERGENCY_ROOM = 'emergency_room',
  OUTPATIENT_DEPT = 'outpatient_dept',
  TRANSFER_IN = 'transfer_in',
  DIRECT = 'direct',
  PHYSICIAN_REFERRAL = 'physician_referral',
}

export enum IsolationType {
  CONTACT = 'contact',
  DROPLET = 'droplet',
  AIRBORNE = 'airborne',
  PROTECTIVE = 'protective',
}

export enum VitalsFrequency {
  Q1H = 'q1h',
  Q2H = 'q2h',
  Q4H = 'q4h',
  Q8H = 'q8h',
  Q12H = 'q12h',
  DAILY = 'daily',
}

export class CreateAdmissionDto {
  // Patient & Encounter
  @IsUUID()
  patientId!: string;

  @IsUUID()
  @IsOptional()
  encounterId?: string; // Optional: create new if not provided

  // Admission Details
  @IsDateString()
  admissionDate!: string;

  @IsEnum(AdmissionType)
  admissionType!: AdmissionType;

  @IsEnum(AdmissionSource)
  admissionSource!: AdmissionSource;

  // Clinical Team
  @IsUUID()
  attendingPhysicianId!: string;

  @IsUUID()
  @IsOptional()
  primaryNurseId?: string;

  // Initial Location
  @IsUUID()
  initialWardId!: string;

  @IsUUID()
  initialBedId!: string;

  // Alerts (optional)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  clinicalAlerts?: string[]; // ['isolation', 'fall_risk', 'critical', 'npo', 'allergies', 'dnr', 'covid']

  @IsEnum(IsolationType)
  @IsOptional()
  isolationType?: IsolationType;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  fallRiskScore?: number;

  // Initial acuity level (optional)
  @IsString()
  @IsOptional()
  acuity?: string; // STABLE, WATCH, CRITICAL - will be validated against InpatientAcuity enum

  // Vitals Schedule (optional)
  @IsEnum(VitalsFrequency)
  @IsOptional()
  vitalsFrequency?: VitalsFrequency;

  // Insurance (optional)
  @IsString()
  @IsOptional()
  insuranceAuthNumber?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;
}
