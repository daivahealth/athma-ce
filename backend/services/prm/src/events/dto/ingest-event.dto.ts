/**
 * Event Ingestion DTO
 * Replaces Joi schema for POST /v1/events
 */

import { IsString, IsUUID, IsOptional, IsEnum, IsInt, IsDateString, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PatientGender {
  M = 'M',
  F = 'F',
  O = 'O',
  U = 'U',
}

export class IngestEventDto {
  @ApiProperty({ description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  patient_id: string;

  @ApiPropertyOptional({ description: 'Patient display name' })
  @IsOptional()
  @IsString()
  patient_display_name?: string;

  @ApiPropertyOptional({ description: 'Patient gender', enum: PatientGender })
  @IsOptional()
  @IsEnum(PatientGender)
  patient_gender?: PatientGender;

  @ApiPropertyOptional({ description: 'Patient date of birth', type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  patient_dob?: string;

  @ApiPropertyOptional({ description: 'Patient age at event', example: 45 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  patient_age_years_at_event?: number;

  @ApiPropertyOptional({ description: 'Patient MRN' })
  @IsOptional()
  @IsString()
  patient_mrn?: string;

  @ApiPropertyOptional({ description: 'Masked mobile number' })
  @IsOptional()
  @IsString()
  patient_mobile_masked?: string;

  @ApiProperty({ description: 'Source system', example: 'zeal-clinical' })
  @IsString()
  source_system: string;

  @ApiProperty({ description: 'Source module', example: 'appointment' })
  @IsString()
  source_module: string;

  @ApiProperty({ description: 'Event type', example: 'appointment_confirmed' })
  @IsString()
  event_type: string;

  @ApiPropertyOptional({ description: 'Event subtype' })
  @IsOptional()
  @IsString()
  event_subtype?: string;

  @ApiPropertyOptional({ description: 'Severity: 0=info, 1=warning, 2=critical', enum: [0, 1, 2], default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  severity?: number;

  @ApiProperty({ description: 'When event occurred', type: String, format: 'date-time' })
  @IsDateString()
  occurred_at: string;

  @ApiProperty({ description: 'Entity type', example: 'appointment' })
  @IsString()
  entity_type: string;

  @ApiProperty({ description: 'Entity UUID', example: 'f1e2d3c4-b5a6-7890-cdef-123456789abc' })
  @IsUUID()
  entity_id: string;

  @ApiProperty({ description: 'Event payload (flexible JSON)', type: 'object' })
  @IsObject()
  payload: Record<string, any>;

  @ApiPropertyOptional({ description: 'Correlation ID for tracing' })
  @IsOptional()
  @IsString()
  correlation_id?: string;

  @ApiProperty({ description: 'Deduplication key (idempotency)', example: 'apt-confirm-f1e2d3c4-2026-01-15' })
  @IsString()
  dedupe_key: string;
}
