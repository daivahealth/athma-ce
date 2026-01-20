/**
 * DTO for searching admissions
 */

import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum AdmissionStatus {
  ADMITTED = 'admitted',
  TRANSFERRED = 'transferred',
  DISCHARGED = 'discharged',
  DECEASED = 'deceased',
  ABSCONDED = 'absconded',
}

export class SearchAdmissionsDto {
  // Patient search (name or MRN)
  @IsString()
  @IsOptional()
  searchTerm?: string; // Searches in patient name or MRN

  // Specific filters
  @IsString()
  @IsOptional()
  patientName?: string; // Search by patient name

  @IsString()
  @IsOptional()
  mrn?: string; // Search by MRN

  @IsString()
  @IsOptional()
  admissionNumber?: string; // Search by admission number

  // Status filter
  @IsEnum(AdmissionStatus)
  @IsOptional()
  status?: AdmissionStatus;

  // Date filters
  @IsDateString()
  @IsOptional()
  admissionDateFrom?: string; // Start date

  @IsDateString()
  @IsOptional()
  admissionDateTo?: string; // End date

  @IsDateString()
  @IsOptional()
  admissionDate?: string; // Specific date

  // Discharge date filters
  @IsDateString()
  @IsOptional()
  dischargeDateFrom?: string; // Discharge start date

  @IsDateString()
  @IsOptional()
  dischargeDateTo?: string; // Discharge end date

  // Ward filter
  @IsString()
  @IsOptional()
  wardId?: string;

  // Physician filter
  @IsString()
  @IsOptional()
  attendingPhysicianId?: string;

  // Pagination
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;

  // Sorting
  @IsString()
  @IsOptional()
  sortBy?: string = 'admissionDate'; // admissionDate, patientName, admissionNumber

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  sortOrder?: 'asc' | 'desc' = 'desc';
}
