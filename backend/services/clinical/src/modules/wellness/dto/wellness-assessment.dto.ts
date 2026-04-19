import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WellnessAssessmentStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateWellnessAssessmentTemplateDto {
  @ApiProperty({ description: 'Template code' })
  @IsString()
  code!: string;

  @ApiProperty({ description: 'Template name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Assessment category' })
  @IsString()
  category!: string;

  @ApiPropertyOptional({ description: 'Estimated time in minutes' })
  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;

  @ApiProperty({ description: 'Sections with questions' })
  @IsArray()
  sections!: Record<string, any>[];

  @ApiPropertyOptional({ description: 'Scoring algorithm' })
  @IsOptional()
  @IsString()
  scoringAlgorithm?: string;

  @ApiPropertyOptional({ description: 'Scoring configuration' })
  @IsOptional()
  @IsObject()
  scoringConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Maximum score' })
  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @ApiPropertyOptional({ description: 'Include biological age calculation' })
  @IsOptional()
  includesBioAge?: boolean;

  @ApiPropertyOptional({ description: 'Biological age formula configuration' })
  @IsOptional()
  @IsObject()
  bioAgeFormula?: Record<string, any>;
}

export class UpdateWellnessAssessmentTemplateDto {
  @ApiPropertyOptional({ description: 'Template name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sections with questions' })
  @IsOptional()
  @IsObject()
  sections?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Scoring configuration' })
  @IsOptional()
  @IsObject()
  scoringConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  isActive?: boolean;
}

export class CreateWellnessAssessmentDto {
  @ApiProperty({ description: 'Facility ID' })
  @IsUUID("loose" as any)
  facilityId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  patientId!: string;

  @ApiPropertyOptional({ description: 'Encounter ID' })
  @IsOptional()
  @IsUUID("loose" as any)
  encounterId?: string;

  @ApiProperty({ description: 'Template ID' })
  @IsUUID("loose" as any)
  templateId!: string;

  @ApiProperty({ description: 'Template version' })
  @IsInt()
  templateVersion!: number;

  @ApiPropertyOptional({ description: 'Assessment responses' })
  @IsOptional()
  @IsObject()
  responses?: Record<string, any>;
}

export class UpdateWellnessAssessmentDto {
  @ApiPropertyOptional({ description: 'Assessment responses' })
  @IsOptional()
  @IsObject()
  responses?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Assessment status', enum: WellnessAssessmentStatus })
  @IsOptional()
  @IsEnum(WellnessAssessmentStatus)
  status?: WellnessAssessmentStatus;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsObject()
  recommendations?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteWellnessAssessmentDto {
  @ApiProperty({ description: 'Final responses' })
  @IsObject()
  responses!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsObject()
  recommendations?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class WellnessAssessmentTemplateResponseDto {
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
  category!: string;

  @ApiPropertyOptional()
  estimatedMinutes?: number;

  @ApiProperty()
  sections!: Record<string, any>;

  @ApiProperty()
  scoringAlgorithm!: string;

  @ApiPropertyOptional()
  scoringConfig?: Record<string, any>;

  @ApiProperty()
  maxScore!: number;

  @ApiProperty()
  includesBioAge!: boolean;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WellnessAssessmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  facilityId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiPropertyOptional()
  encounterId?: string;

  @ApiProperty()
  templateId!: string;

  @ApiProperty()
  templateVersion!: number;

  @ApiProperty()
  responses!: Record<string, any>;

  @ApiPropertyOptional()
  overallScore?: number;

  @ApiPropertyOptional()
  categoryScores?: Record<string, any>;

  @ApiPropertyOptional()
  biologicalAge?: number;

  @ApiPropertyOptional()
  chronologicalAge?: number;

  @ApiProperty({ enum: WellnessAssessmentStatus })
  status!: WellnessAssessmentStatus;

  @ApiPropertyOptional()
  recommendations?: Record<string, any>;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WellnessScoreHistoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  scoreType!: string;

  @ApiProperty()
  scoreValue!: number;

  @ApiProperty()
  recordedAt!: Date;

  @ApiProperty()
  source!: string;
}
