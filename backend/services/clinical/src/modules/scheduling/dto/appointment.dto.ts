/**
 * Appointment DTOs
 */

import { IsString, IsInt, IsBoolean, IsOptional, IsDate, IsIn, IsUUID, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ========================================
// NESTED DTOs
// ========================================

export class PreferredResourceDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  type!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("all")
  id!: string;

  @ApiPropertyOptional({ description: 'Resource role', example: 'primary_physician' })
  @IsOptional()
  @IsString()
  role?: string;
}

export class PreferredTimeDto {
  @ApiProperty({ description: 'Hour (0-23)', minimum: 0, maximum: 23 })
  @IsInt()
  @Min(0)
  hour!: number;

  @ApiProperty({ description: 'Minute (0-59)', minimum: 0, maximum: 59 })
  @IsInt()
  @Min(0)
  minute!: number;
}

// ========================================
// APPOINTMENT BOOKING DTOs
// ========================================

export class BookAppointmentDto {
  @ApiProperty({ description: 'Patient UUID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Appointment type', example: 'general_checkup' })
  @IsString()
  appointmentType!: string;

  @ApiProperty({ description: 'Appointment start time' })
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @ApiProperty({ description: 'Appointment end time' })
  @Type(() => Date)
  @IsDate()
  endTime!: Date;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID("all")
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Space UUID' })
  @IsOptional()
  @IsUUID("all")
  spaceId?: string;

  @ApiPropertyOptional({ description: 'Staff UUID' })
  @IsOptional()
  @IsUUID("all")
  staffId?: string;

  @ApiPropertyOptional({ description: 'Preferred resources', type: [PreferredResourceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferredResourceDto)
  preferredResources?: PreferredResourceDto[];

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Visit type', example: 'in-person' })
  @IsOptional()
  @IsString()
  visitType?: string;

  @ApiPropertyOptional({ description: 'Auto-allocate resources based on requirements', default: false })
  @IsOptional()
  @IsBoolean()
  autoAllocateResources?: boolean;
}

export class AllocateResourceDto {
  @ApiProperty({ description: 'Appointment UUID' })
  @IsUUID("all")
  appointmentId!: string;

  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("all")
  resourceId!: string;

  @ApiPropertyOptional({ description: 'Resource role', example: 'primary_physician' })
  @IsOptional()
  @IsString()
  resourceRole?: string;

  @ApiProperty({ description: 'Resource start time' })
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @ApiProperty({ description: 'Resource end time' })
  @Type(() => Date)
  @IsDate()
  endTime!: Date;

  @ApiPropertyOptional({ description: 'Preparation start time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  preparationStart?: Date;

  @ApiPropertyOptional({ description: 'Cleanup end time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  cleanupEnd?: Date;
}

export class RescheduleAppointmentDto {
  @ApiProperty({ description: 'New appointment start time' })
  @Type(() => Date)
  @IsDate()
  newStartTime!: Date;

  @ApiProperty({ description: 'New appointment end time' })
  @Type(() => Date)
  @IsDate()
  newEndTime!: Date;

  @ApiPropertyOptional({ description: 'Reason for rescheduling' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CancelAppointmentDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsOptional()
  @IsString()
  reason?: string;
}

// ========================================
// APPOINTMENT SERIES DTOs
// ========================================

export class CreateAppointmentSeriesDto {
  @ApiProperty({ description: 'Patient UUID' })
  @IsUUID("all")
  patientId!: string;

  @ApiPropertyOptional({ description: 'Series name', example: 'Physical Therapy - 8 weeks' })
  @IsOptional()
  @IsString()
  seriesName?: string;

  @ApiProperty({ description: 'Appointment type', example: 'dialysis' })
  @IsString()
  appointmentType!: string;

  @ApiProperty({ description: 'Recurrence pattern', enum: ['daily', 'weekly', 'monthly', 'custom'] })
  @IsIn(['daily', 'weekly', 'monthly', 'custom'])
  recurrencePattern!: 'daily' | 'weekly' | 'monthly' | 'custom';

  @ApiProperty({ description: 'Recurrence rule in RRULE format', example: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24' })
  @IsString()
  recurrenceRule!: string;

  @ApiProperty({ description: 'Series start date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiPropertyOptional({ description: 'Series end date (optional if totalOccurrences specified)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Total number of occurrences' })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalOccurrences?: number;

  @ApiProperty({ description: 'Preferred time for appointments', type: PreferredTimeDto })
  @ValidateNested()
  @Type(() => PreferredTimeDto)
  preferredTime!: PreferredTimeDto;

  @ApiProperty({ description: 'Duration of each appointment in minutes', minimum: 1 })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID("all")
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Preferred resources', type: [PreferredResourceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferredResourceDto)
  preferredResources?: PreferredResourceDto[];

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelAppointmentSeriesDto {
  @ApiProperty({ description: 'Reason for cancelling series' })
  @IsString()
  reason!: string;
}

// ========================================
// QUERY DTOs
// ========================================

export class GetPatientAppointmentsDto {
  @ApiPropertyOptional({ description: 'Start date filter' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date filter' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Status filter', example: 'scheduled' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Include resources', default: false })
  @IsOptional()
  @IsBoolean()
  includeResources?: boolean;
}

export class GetFacilityAppointmentsDto {
  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiPropertyOptional({ description: 'Facility UUID (defaults to user facility)' })
  @IsOptional()
  @IsUUID("all")
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Status filter', example: 'scheduled' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Include resources', default: false })
  @IsOptional()
  @IsBoolean()
  includeResources?: boolean;
}
