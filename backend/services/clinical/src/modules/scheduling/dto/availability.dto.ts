/**
 * Availability DTOs
 */

import { IsString, IsInt, IsBoolean, IsOptional, IsDate, IsIn, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindAvailableSlotsDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("loose" as any)
  resourceId!: string;

  @ApiProperty({ description: 'Search start date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: 'Search end date' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({ description: 'Required duration in minutes', minimum: 1 })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID("loose" as any)
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Slot interval in minutes', default: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  slotInterval?: number;

  @ApiPropertyOptional({ description: 'Include preparation time', default: false })
  @IsOptional()
  @IsBoolean()
  includePreparationTime?: boolean;

  @ApiPropertyOptional({ description: 'Preparation time in minutes', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  preparationMinutes?: number;

  @ApiPropertyOptional({ description: 'Cleanup time in minutes', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  cleanupMinutes?: number;
}

export class CheckSlotAvailabilityDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("loose" as any)
  resourceId!: string;

  @ApiProperty({ description: 'Slot start time' })
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @ApiProperty({ description: 'Slot end time' })
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

export class FindSlotsForAppointmentTypeDto {
  @ApiProperty({ description: 'Appointment type', example: 'mri_scan' })
  @IsString()
  appointmentType!: string;

  @ApiProperty({ description: 'Search start date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: 'Search end date' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID("loose" as any)
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Preferred staff UUIDs', isArray: true })
  @IsOptional()
  @IsUUID('4', { each: true })
  preferredStaffIds?: string[];

  @ApiPropertyOptional({ description: 'Preferred time of day', enum: ['morning', 'afternoon', 'evening'] })
  @IsOptional()
  @IsIn(['morning', 'afternoon', 'evening'])
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';

  @ApiPropertyOptional({ description: 'Slot interval in minutes', default: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  slotInterval?: number;
}

export class GetResourceUtilizationDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("loose" as any)
  resourceId!: string;

  @ApiProperty({ description: 'Period start date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: 'Period end date' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}

export class FindNextAvailableSlotDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("loose" as any)
  resourceId!: string;

  @ApiProperty({ description: 'Required duration in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({ description: 'Start searching from this date (default: now)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startFrom?: Date;

  @ApiPropertyOptional({ description: 'Maximum days to search', default: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxDaysToSearch?: number;
}

export class SuggestAlternativeSlotsDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID("loose" as any)
  resourceId!: string;

  @ApiProperty({ description: 'Preferred start time' })
  @Type(() => Date)
  @IsDate()
  preferredStartTime!: Date;

  @ApiProperty({ description: 'Required duration in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({ description: 'Maximum number of alternatives', default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAlternatives?: number;

  @ApiPropertyOptional({ description: 'Search window in days', default: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  searchWindowDays?: number;
}
