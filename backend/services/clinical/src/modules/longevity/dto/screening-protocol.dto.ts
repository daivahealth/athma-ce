import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ScreeningStatus {
  DUE = 'DUE',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  DECLINED = 'DECLINED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export class CreateScreeningProtocolDto {
  @ApiProperty({ description: 'Protocol code' })
  @IsString()
  code!: string;

  @ApiProperty({ description: 'Protocol name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category (cardiovascular, cancer, metabolic, etc.)' })
  @IsString()
  category!: string;

  @ApiProperty({ description: 'Screening type' })
  @IsString()
  screeningType!: string;

  @ApiPropertyOptional({ description: 'Minimum age' })
  @IsOptional()
  @IsInt()
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maximum age' })
  @IsOptional()
  @IsInt()
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Gender (male, female, all)' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Risk factors' })
  @IsOptional()
  @IsObject()
  riskFactors?: Record<string, any>;

  @ApiProperty({ description: 'Frequency in months' })
  @IsInt()
  frequencyMonths!: number;

  @ApiProperty({ description: 'Required tests' })
  @IsArray()
  requiredTests!: Array<{
    labTestId?: string;
    name: string;
    mandatory: boolean;
  }>;

  @ApiPropertyOptional({ description: 'Required assessments' })
  @IsOptional()
  @IsObject()
  requiredAssessments?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Guideline source (USPSTF, WHO, etc.)' })
  @IsOptional()
  @IsString()
  guidelineSource?: string;

  @ApiPropertyOptional({ description: 'Guideline version' })
  @IsOptional()
  @IsString()
  guidelineVersion?: string;
}

export class UpdateScreeningProtocolDto {
  @ApiPropertyOptional({ description: 'Protocol name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Frequency in months' })
  @IsOptional()
  @IsInt()
  frequencyMonths?: number;

  @ApiPropertyOptional({ description: 'Required tests' })
  @IsOptional()
  @IsArray()
  requiredTests?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ScheduleScreeningDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  patientId!: string;

  @ApiProperty({ description: 'Protocol ID' })
  @IsUUID("loose" as any)
  protocolId!: string;

  @ApiProperty({ description: 'Due date' })
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({ description: 'Risk level (low, moderate, high)' })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiPropertyOptional({ description: 'Risk score' })
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiPropertyOptional({ description: 'Risk factors present' })
  @IsOptional()
  @IsObject()
  riskFactorsPresent?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteScreeningDto {
  @ApiPropertyOptional({ description: 'Encounter ID' })
  @IsOptional()
  @IsUUID("loose" as any)
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Results' })
  @IsOptional()
  @IsObject()
  results?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Findings' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional({ description: 'Next due date' })
  @IsOptional()
  @IsDateString()
  nextDueDate?: string;
}

export class DeclineScreeningDto {
  @ApiProperty({ description: 'Decline reason' })
  @IsString()
  declineReason!: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ScreeningProtocolResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional()
  tenantId?: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  screeningType!: string;

  @ApiPropertyOptional()
  minAge?: number;

  @ApiPropertyOptional()
  maxAge?: number;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  riskFactors?: Record<string, any>;

  @ApiProperty()
  frequencyMonths!: number;

  @ApiProperty()
  requiredTests!: Array<Record<string, any>>;

  @ApiPropertyOptional()
  guidelineSource?: string;

  @ApiPropertyOptional()
  guidelineVersion?: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PatientScreeningScheduleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  protocolId!: string;

  @ApiProperty({ enum: ScreeningStatus })
  status!: ScreeningStatus;

  @ApiProperty()
  dueDate!: Date;

  @ApiPropertyOptional()
  riskLevel?: string;

  @ApiPropertyOptional()
  riskScore?: number;

  @ApiPropertyOptional()
  riskFactorsPresent?: Record<string, any>;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  encounterId?: string;

  @ApiPropertyOptional()
  results?: Record<string, any>;

  @ApiPropertyOptional()
  findings?: string;

  @ApiPropertyOptional()
  recommendations?: string;

  @ApiPropertyOptional()
  nextDueDate?: Date;

  @ApiPropertyOptional()
  reminderSentAt?: Date;

  @ApiProperty()
  reminderCount!: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  declineReason?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
