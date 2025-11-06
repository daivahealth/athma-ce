/**
 * DTO for searching encounters
 */

import { IsOptional, IsString, IsEnum, IsUUID, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EncounterStatus, EncounterClass } from './create-encounter.dto';

export class SearchEncounterDto {
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsUUID()
  @IsOptional()
  primaryStaffId?: string;

  @IsUUID()
  @IsOptional()
  facilityId?: string;

  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @IsEnum(EncounterClass)
  @IsOptional()
  encounterClass?: EncounterClass;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  search?: string; // Search in chief complaint, presenting symptoms

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
