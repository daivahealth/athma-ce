/**
 * DTO for discharging a patient
 */

import {
  IsDateString,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';

export enum DischargeType {
  ROUTINE = 'routine',
  AGAINST_MEDICAL_ADVICE = 'against_medical_advice',
  TRANSFER = 'transfer',
  DECEASED = 'deceased',
  ABSCONDED = 'absconded',
}

export enum DischargeDestination {
  HOME = 'home',
  TRANSFER_FACILITY = 'transfer_facility',
  NURSING_HOME = 'nursing_home',
  REHABILITATION = 'rehabilitation',
  DECEASED = 'deceased',
}

export class DischargePatientDto {
  @IsDateString()
  actualDischargeDate!: string;

  @IsEnum(DischargeType)
  dischargeType!: DischargeType;

  @IsEnum(DischargeDestination)
  dischargeDestination!: DischargeDestination;

  @IsString()
  @IsOptional()
  dischargeNotes?: string;
}
