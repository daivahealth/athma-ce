/**
 * DTO for searching encounters
 */

import { IsOptional, IsString, IsEnum, IsUUID, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EncounterStatus, EncounterClass } from './create-encounter.dto';

export class SearchEncounterDto {
  @IsUUID("all")
  @IsOptional()
  patientId?: string;

  @IsUUID("all")
  @IsOptional()
  primaryStaffId?: string;

  @IsUUID("all")
  @IsOptional()
  facilityId?: string;

  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @IsEnum(EncounterClass)
  @IsOptional()
  encounterClass?: EncounterClass;

  @IsString()
  @IsOptional()
  encounterNumber?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  search?: string;

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
