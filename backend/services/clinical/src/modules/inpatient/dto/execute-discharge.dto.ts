/**
 * DTO for executing discharge
 */

import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DischargeType,
  DischargeDestination,
} from '@zeal/database-clinical';

export class ExecuteDischargeDto {
  @IsEnum(DischargeType)
  dischargeType!: DischargeType;

  @IsEnum(DischargeDestination)
  dischargeDestination!: DischargeDestination;

  @IsString()
  @IsOptional()
  dischargeDisposition?: string;

  @IsString()
  @IsOptional()
  dischargeSummaryId?: string;

  @IsOptional()
  finalDiagnosis?: any;

  @IsOptional()
  dischargeMedications?: any;

  @IsString()
  @IsOptional()
  followUpInstructions?: string;

  @IsOptional()
  followUpAppointments?: any;

  @IsString()
  @IsOptional()
  dietInstructions?: string;

  @IsString()
  @IsOptional()
  activityRestrictions?: string;
}
