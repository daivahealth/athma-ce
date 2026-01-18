import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsInt, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChecklistCategory, ChecklistTemplateStatus, ChecklistItemType } from '@zeal/database-clinical';

export class CreateChecklistTemplateItemDto {
  @IsString()
  itemKey!: string;

  @IsEnum(ChecklistItemType)
  itemType!: ChecklistItemType;

  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  sectionName?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsObject()
  validationRules?: any;

  @IsOptional()
  @IsObject()
  options?: any;

  @IsOptional()
  @IsObject()
  showIfCondition?: any;
}

export class CreateChecklistTemplateDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ChecklistCategory)
  category!: ChecklistCategory;

  @IsOptional()
  @IsInt()
  version?: number;

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
  @IsObject()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistTemplateItemDto)
  items!: CreateChecklistTemplateItemDto[];
}
