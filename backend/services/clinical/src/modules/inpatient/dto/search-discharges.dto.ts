/**
 * DTO for searching discharge transactions
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
import { DischargeTransactionStatus } from '@zeal/database-clinical';

export class SearchDischargesDto {
  // Search by patient name or MRN
  @IsString()
  @IsOptional()
  searchTerm?: string;

  // Status filter
  @IsEnum(DischargeTransactionStatus)
  @IsOptional()
  status?: DischargeTransactionStatus;

  // Discharge date filters
  @IsDateString()
  @IsOptional()
  dischargeDateFrom?: string; // Actual discharge date start

  @IsDateString()
  @IsOptional()
  dischargeDateTo?: string; // Actual discharge date end

  // Target discharge date filters
  @IsDateString()
  @IsOptional()
  targetDischargeDateFrom?: string;

  @IsDateString()
  @IsOptional()
  targetDischargeDateTo?: string;

  // Ward filter
  @IsString()
  @IsOptional()
  wardId?: string;

  // Facility filter
  @IsString()
  @IsOptional()
  facilityId?: string;

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
  sortBy?: string = 'actualDischargeDate'; // actualDischargeDate, targetDischargeDate, initiatedAt

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  sortOrder?: 'asc' | 'desc' = 'desc';
}
