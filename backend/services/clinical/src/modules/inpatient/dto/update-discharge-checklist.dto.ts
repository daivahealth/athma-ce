/**
 * DTO for updating discharge checklist
 */

import {
  IsOptional,
  IsBoolean,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdateDischargeChecklistDto {
  @IsBoolean()
  @IsOptional()
  clinicalSummaryCompleted?: boolean;

  @IsBoolean()
  @IsOptional()
  dischargeMedicationsOrdered?: boolean;

  @IsBoolean()
  @IsOptional()
  followUpAppointmentBooked?: boolean;

  @IsBoolean()
  @IsOptional()
  patientEducationProvided?: boolean;

  @IsBoolean()
  @IsOptional()
  billingCleared?: boolean;

  @IsBoolean()
  @IsOptional()
  transportArranged?: boolean;

  @IsBoolean()
  @IsOptional()
  medicalRecordsFinalized?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  readyForDischarge?: boolean;
}
