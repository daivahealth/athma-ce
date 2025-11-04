/**
 * Schedule DTOs
 */

import { IsString, IsInt, IsBoolean, IsOptional, IsDate, IsIn, Min, Max, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ========================================
// STAFF SCHEDULE DTOs
// ========================================

export class CreateStaffScheduleDto {
  @ApiProperty({ description: 'Staff UUID' })
  @IsUUID()
  staffId!: string;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  // Denormalized fields from Foundation database (populated automatically from staffId/facilityId)
  @ApiPropertyOptional({ description: 'Staff display name (denormalized from Foundation DB)', maxLength: 200 })
  @IsOptional()
  @IsString()
  staffDisplayName?: string;

  @ApiPropertyOptional({ description: 'Employee identifier (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Staff type (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  staffType?: string;

  @ApiPropertyOptional({ description: 'Facility code (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  facilityCode?: string;

  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ description: 'Start time in HH:MM:SS format', example: '09:00:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ description: 'End time in HH:MM:SS format', example: '17:00:00' })
  @IsString()
  endTime!: string;

  @ApiProperty({ description: 'Is staff available during this time' })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: 'Schedule type', enum: ['regular', 'on-call', 'special'], default: 'regular' })
  @IsOptional()
  @IsIn(['regular', 'on-call', 'special'])
  scheduleType?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Effective from date' })
  @Type(() => Date)
  @IsDate()
  effectiveFrom!: Date;

  @ApiPropertyOptional({ description: 'Effective until date (null = indefinite)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

export class UpdateStaffScheduleDto {
  // Denormalized fields from Foundation database
  @ApiPropertyOptional({ description: 'Staff display name (denormalized from Foundation DB)', maxLength: 200 })
  @IsOptional()
  @IsString()
  staffDisplayName?: string;

  @ApiPropertyOptional({ description: 'Employee identifier (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Staff type (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  staffType?: string;

  @ApiPropertyOptional({ description: 'Facility code (denormalized from Foundation DB)', maxLength: 50 })
  @IsOptional()
  @IsString()
  facilityCode?: string;

  @ApiPropertyOptional({ description: 'Day of week', minimum: 0, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({ description: 'Start time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Is staff available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Schedule type', enum: ['regular', 'on-call', 'special'] })
  @IsOptional()
  @IsIn(['regular', 'on-call', 'special'])
  scheduleType?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Effective from date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

// ========================================
// EQUIPMENT SCHEDULE DTOs
// ========================================

export class CreateEquipmentScheduleDto {
  @ApiProperty({ description: 'Equipment UUID' })
  @IsUUID()
  equipmentId!: string;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ description: 'Start time in HH:MM:SS format', example: '08:00:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ description: 'End time in HH:MM:SS format', example: '20:00:00' })
  @IsString()
  endTime!: string;

  @ApiProperty({ description: 'Is equipment available' })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: 'Maintenance type', enum: ['scheduled_maintenance', 'emergency_repair', 'calibration'] })
  @IsOptional()
  @IsIn(['scheduled_maintenance', 'emergency_repair', 'calibration'])
  maintenanceType?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Effective from date' })
  @Type(() => Date)
  @IsDate()
  effectiveFrom!: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

export class UpdateEquipmentScheduleDto {
  @ApiPropertyOptional({ description: 'Day of week', minimum: 0, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({ description: 'Start time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Is equipment available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Maintenance type' })
  @IsOptional()
  @IsIn(['scheduled_maintenance', 'emergency_repair', 'calibration'])
  maintenanceType?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Effective from date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

// ========================================
// SPACE SCHEDULE DTOs
// ========================================

export class CreateSpaceScheduleDto {
  @ApiProperty({ description: 'Space UUID' })
  @IsUUID()
  spaceId!: string;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ description: 'Start time in HH:MM:SS format', example: '07:00:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ description: 'End time in HH:MM:SS format', example: '21:00:00' })
  @IsString()
  endTime!: string;

  @ApiProperty({ description: 'Is space available' })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: 'Block reason', enum: ['maintenance', 'cleaning', 'renovation'] })
  @IsOptional()
  @IsIn(['maintenance', 'cleaning', 'renovation'])
  blockReason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Effective from date' })
  @Type(() => Date)
  @IsDate()
  effectiveFrom!: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

export class UpdateSpaceScheduleDto {
  @ApiPropertyOptional({ description: 'Day of week', minimum: 0, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({ description: 'Start time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:MM:SS format' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Is space available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Block reason' })
  @IsOptional()
  @IsIn(['maintenance', 'cleaning', 'renovation'])
  blockReason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Effective from date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

// ========================================
// RESOURCE BLOCK DTOs
// ========================================

export class CreateResourceBlockDto {
  @ApiProperty({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] })
  @IsIn(['staff', 'equipment', 'space'])
  resourceType!: 'staff' | 'equipment' | 'space';

  @ApiProperty({ description: 'Resource UUID' })
  @IsUUID()
  resourceId!: string;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiProperty({ description: 'Block type', enum: ['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event'] })
  @IsIn(['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event'])
  blockType!: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';

  @ApiProperty({ description: 'Block start datetime' })
  @Type(() => Date)
  @IsDate()
  startDatetime!: Date;

  @ApiProperty({ description: 'Block end datetime' })
  @Type(() => Date)
  @IsDate()
  endDatetime!: Date;

  @ApiProperty({ description: 'Is resource available during block (usually false)', default: false })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: 'Reason for block' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateResourceBlockDto {
  @ApiPropertyOptional({ description: 'Block type' })
  @IsOptional()
  @IsIn(['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event'])
  blockType?: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';

  @ApiPropertyOptional({ description: 'Block start datetime' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDatetime?: Date;

  @ApiPropertyOptional({ description: 'Block end datetime' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDatetime?: Date;

  @ApiPropertyOptional({ description: 'Is resource available during block' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Reason for block' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RejectResourceBlockDto {
  @ApiProperty({ description: 'Reason for rejection' })
  @IsString()
  reason!: string;
}

// ========================================
// BULK OPERATIONS DTOs
// ========================================

export class CreateWeeklyScheduleDto {
  @ApiProperty({ description: 'Staff UUID' })
  @IsUUID()
  staffId!: string;

  @ApiPropertyOptional({ description: 'Staff display name (denormalized)', maxLength: 200 })
  @IsOptional()
  @IsString()
  staffDisplayName?: string;

  @ApiPropertyOptional({ description: 'Employee identifier (denormalized)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Staff type (denormalized)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  staffType?: string;

  @ApiProperty({ description: 'Array of days (0=Sunday, 6=Saturday)', example: [1, 2, 3, 4, 5], isArray: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  days!: number[];

  @ApiProperty({ description: 'Start time in HH:MM:SS format', example: '09:00:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ description: 'End time in HH:MM:SS format', example: '17:00:00' })
  @IsString()
  endTime!: string;

  @ApiProperty({ description: 'Is staff available' })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: 'Schedule type', default: 'regular' })
  @IsOptional()
  @IsIn(['regular', 'on-call', 'special'])
  scheduleType?: string;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiProperty({ description: 'Effective from date' })
  @Type(() => Date)
  @IsDate()
  effectiveFrom!: Date;

  @ApiPropertyOptional({ description: 'Effective until date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
