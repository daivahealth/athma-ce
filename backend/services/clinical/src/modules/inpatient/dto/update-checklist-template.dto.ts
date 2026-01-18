import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { ChecklistTemplateStatus } from '@zeal/database-clinical';

export class UpdateChecklistTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ChecklistTemplateStatus)
  status?: ChecklistTemplateStatus;

  @IsOptional()
  @IsBoolean()
  applicableToInpatient?: boolean;

  @IsOptional()
  @IsBoolean()
  applicableToOutpatient?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableEncounterTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableDepartments?: string[];

  @IsOptional()
  @IsBoolean()
  requiresAllItems?: boolean;

  @IsOptional()
  @IsInt()
  minimumCompletionPercent?: number;

  @IsOptional()
  @IsBoolean()
  requiresVerification?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verificationRoles?: string[];

  @IsOptional()
  @IsBoolean()
  allowSelfVerification?: boolean;

  @IsOptional()
  @IsBoolean()
  autoCreateEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  autoCreateOn?: string[];

  @IsOptional()
  autoCreateConditions?: any;

  @IsOptional()
  @IsInt()
  autoCreateDueHours?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedRoles?: string[];

  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;
}
