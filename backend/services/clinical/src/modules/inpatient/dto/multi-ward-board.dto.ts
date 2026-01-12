/**
 * DTOs for multi-ward bed board
 * Supports viewing combined board for multiple wards or entire facility
 */

import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { InpatientAdmissionStatus, InpatientAcuity } from './create-event.dto';
import type { WardBoardBed, WardBoardSummary, WardInfo } from './ward-board.dto';

/**
 * Query parameters for multi-ward board
 */
export class MultiWardBoardQueryDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  wardIds?: string[]; // If omitted, returns all wards in facility

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDischargedToday?: boolean = false;

  @IsArray()
  @IsEnum(InpatientAdmissionStatus, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  statusFilter?: InpatientAdmissionStatus[];

  @IsArray()
  @IsEnum(InpatientAcuity, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  acuityFilter?: InpatientAcuity[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeEmptyWards?: boolean = true; // Include wards with no patients
}

/**
 * Ward board data with ward info
 */
export interface WardBoardData {
  ward: WardInfo;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

/**
 * Combined summary across all wards
 */
export interface FacilitySummary {
  totalWards: number;
  totalBeds: number;
  occupied: number;
  empty: number;
  cleaning: number;
  reserved: number;
  critical: number;
  pendingDischarge: number;
  occupancyRate: number; // Percentage (0-100)
}

/**
 * Response for multi-ward board
 */
export interface MultiWardBoardResponse {
  facilityId: string;
  summary: FacilitySummary;
  wards: WardBoardData[];
  timestamp: string; // ISO 8601 timestamp
}
