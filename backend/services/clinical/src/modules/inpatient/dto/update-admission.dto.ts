/**
 * DTO for updating an admission
 */

import {
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { IsolationType, VitalsFrequency } from './create-admission.dto';

export class UpdateAdmissionDto {
  @IsUUID()
  @IsOptional()
  attendingPhysicianId?: string;

  @IsUUID()
  @IsOptional()
  primaryNurseId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  clinicalAlerts?: string[];

  @IsEnum(IsolationType)
  @IsOptional()
  isolationType?: IsolationType;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  fallRiskScore?: number;

  @IsEnum(VitalsFrequency)
  @IsOptional()
  vitalsFrequency?: VitalsFrequency;

  @IsDateString()
  @IsOptional()
  expectedDischargeDate?: string;

  @IsString()
  @IsOptional()
  dischargeNotes?: string;

  @IsString()
  @IsOptional()
  insuranceAuthNumber?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;
}
