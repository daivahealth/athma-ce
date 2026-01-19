/**
 * DTO for initiating discharge planning
 */

import {
  IsDateString,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class InitiateDischargeDto {
  @IsDateString()
  @IsOptional()
  targetDischargeDate?: string;

  @IsString()
  @IsOptional()
  targetDischargeTime?: string;

  @IsBoolean()
  @IsOptional()
  approvalRequired?: boolean;

  @IsString()
  @IsOptional()
  internalNotes?: string;
}
