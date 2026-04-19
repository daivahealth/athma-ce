import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WellnessProgramStatus {
  ENROLLED = 'ENROLLED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum WellnessSessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export class CreateWellnessProgramTemplateDto {
  @ApiProperty({ description: 'Program code' })
  @IsString()
  code!: string;

  @ApiProperty({ description: 'Program name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Program description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Program type (weight_loss, detox, stress_management, etc.)' })
  @IsString()
  programType!: string;

  @ApiProperty({ description: 'Duration in weeks' })
  @IsInt()
  durationWeeks!: number;

  @ApiProperty({ description: 'Total number of sessions' })
  @IsInt()
  totalSessions!: number;

  @ApiPropertyOptional({ description: 'Sessions per week' })
  @IsOptional()
  @IsInt()
  sessionsPerWeek?: number;

  @ApiProperty({ description: 'Program phases' })
  @IsArray()
  phases!: Array<{
    name: string;
    weekStart: number;
    weekEnd: number;
    goals?: string[];
    sessionTypes?: string[];
  }>;

  @ApiProperty({ description: 'Program milestones' })
  @IsArray()
  milestones!: Array<{
    name: string;
    weekNumber: number;
    criteria?: Record<string, any>;
    assessments?: string[];
  }>;

  @ApiPropertyOptional({ description: 'Prerequisites' })
  @IsOptional()
  @IsObject()
  prerequisites?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Estimated cost' })
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional({ description: 'Required membership tier' })
  @IsOptional()
  @IsString()
  membershipTierRequired?: string;
}

export class UpdateWellnessProgramTemplateDto {
  @ApiPropertyOptional({ description: 'Program name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Program description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Program phases' })
  @IsOptional()
  @IsArray()
  phases?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Program milestones' })
  @IsOptional()
  @IsArray()
  milestones?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  isActive?: boolean;
}

export class EnrollInProgramDto {
  @ApiProperty({ description: 'Facility ID' })
  @IsUUID("all")
  facilityId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Program template ID' })
  @IsUUID("all")
  programTemplateId!: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ description: 'Primary coach ID' })
  @IsOptional()
  @IsUUID("all")
  primaryCoachId?: string;

  @ApiPropertyOptional({ description: 'Initial assessment ID' })
  @IsOptional()
  @IsUUID("all")
  initialAssessmentId?: string;

  @ApiPropertyOptional({ description: 'Subscription ID (from RCM)' })
  @IsOptional()
  @IsUUID("all")
  subscriptionId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ description: 'Enrollment status', enum: WellnessProgramStatus })
  @IsOptional()
  @IsEnum(WellnessProgramStatus)
  status?: WellnessProgramStatus;

  @ApiPropertyOptional({ description: 'Current phase' })
  @IsOptional()
  @IsInt()
  currentPhase?: number;

  @ApiPropertyOptional({ description: 'Current week' })
  @IsOptional()
  @IsInt()
  currentWeek?: number;

  @ApiPropertyOptional({ description: 'Primary coach ID' })
  @IsOptional()
  @IsUUID("all")
  primaryCoachId?: string;

  @ApiPropertyOptional({ description: 'Outcome notes' })
  @IsOptional()
  @IsString()
  outcomeNotes?: string;

  @ApiPropertyOptional({ description: 'Final assessment ID' })
  @IsOptional()
  @IsUUID("all")
  finalAssessmentId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ScheduleSessionDto {
  @ApiProperty({ description: 'Session type' })
  @IsString()
  sessionType!: string;

  @ApiProperty({ description: 'Scheduled date' })
  @IsDateString()
  scheduledDate!: string;

  @ApiPropertyOptional({ description: 'Scheduled time (HH:MM)' })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiPropertyOptional({ description: 'Provider ID' })
  @IsOptional()
  @IsUUID("all")
  providerId?: string;

  @ApiPropertyOptional({ description: 'Appointment ID' })
  @IsOptional()
  @IsUUID("all")
  appointmentId?: string;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({ description: 'Session status', enum: WellnessSessionStatus })
  @IsOptional()
  @IsEnum(WellnessSessionStatus)
  status?: WellnessSessionStatus;

  @ApiPropertyOptional({ description: 'Actual date/time' })
  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({ description: 'Session notes' })
  @IsOptional()
  @IsString()
  sessionNotes?: string;

  @ApiPropertyOptional({ description: 'Interventions performed' })
  @IsOptional()
  @IsObject()
  interventions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Homework assigned' })
  @IsOptional()
  @IsObject()
  homework?: Record<string, any>;
}

export class CompleteMilestoneDto {
  @ApiPropertyOptional({ description: 'Assessment ID' })
  @IsOptional()
  @IsUUID("all")
  assessmentId?: string;

  @ApiPropertyOptional({ description: 'Outcome data' })
  @IsOptional()
  @IsObject()
  outcomeData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class WellnessProgramTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  programType!: string;

  @ApiProperty()
  durationWeeks!: number;

  @ApiProperty()
  totalSessions!: number;

  @ApiProperty()
  sessionsPerWeek!: number;

  @ApiProperty()
  phases!: Array<Record<string, any>>;

  @ApiProperty()
  milestones!: Array<Record<string, any>>;

  @ApiPropertyOptional()
  prerequisites?: Record<string, any>;

  @ApiPropertyOptional()
  estimatedCost?: number;

  @ApiPropertyOptional()
  membershipTierRequired?: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WellnessProgramEnrollmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  facilityId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  programTemplateId!: string;

  @ApiProperty()
  enrollmentNumber!: string;

  @ApiProperty({ enum: WellnessProgramStatus })
  status!: WellnessProgramStatus;

  @ApiProperty()
  enrolledAt!: Date;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  expectedEndDate!: Date;

  @ApiPropertyOptional()
  actualEndDate?: Date;

  @ApiProperty()
  currentPhase!: number;

  @ApiProperty()
  currentWeek!: number;

  @ApiProperty()
  sessionsCompleted!: number;

  @ApiProperty()
  milestonesCompleted!: number;

  @ApiProperty()
  completionPercent!: number;

  @ApiPropertyOptional()
  primaryCoachId?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WellnessProgramSessionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  sessionNumber!: number;

  @ApiProperty()
  sessionType!: string;

  @ApiProperty()
  phase!: number;

  @ApiProperty()
  week!: number;

  @ApiPropertyOptional()
  appointmentId?: string;

  @ApiPropertyOptional()
  scheduledDate?: Date;

  @ApiPropertyOptional()
  scheduledTime?: string;

  @ApiProperty({ enum: WellnessSessionStatus })
  status!: WellnessSessionStatus;

  @ApiPropertyOptional()
  actualDate?: Date;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  providerId?: string;

  @ApiPropertyOptional()
  sessionNotes?: string;

  @ApiPropertyOptional()
  interventions?: Record<string, any>;

  @ApiPropertyOptional()
  homework?: Record<string, any>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WellnessProgramMilestoneResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  milestoneName!: string;

  @ApiProperty()
  milestoneWeek!: number;

  @ApiPropertyOptional()
  criteria?: Record<string, any>;

  @ApiProperty()
  isCompleted!: boolean;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  assessmentId?: string;

  @ApiPropertyOptional()
  outcomeData?: Record<string, any>;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
