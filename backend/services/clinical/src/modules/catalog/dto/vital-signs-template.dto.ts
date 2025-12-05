import {
  IsString,
  IsInt,
  IsArray,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS
// ============================================================================

export enum CareSetting {
  OPD = 'OPD',
  ER = 'ER',
  IPD = 'IPD',
  ICU = 'ICU',
  DAYCARE = 'DAYCARE',
  ANY = 'ANY',
}

export enum AgeGroup {
  NEWBORN = 'newborn', // 0-28 days
  INFANT = 'infant', // 29 days - 1 year
  CHILD = 'child', // 1-12 years
  ADOLESCENT = 'adolescent', // 13-17 years
  ADULT = 'adult', // 18-64 years
  ELDERLY = 'elderly', // 65+ years
  ALL = 'all', // All age groups
}

export enum VitalItemType {
  NUMBER = 'number',
  TEXT = 'text',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  BOOLEAN = 'boolean',
  CALCULATED = 'calculated',
}

// ============================================================================
// SUB-DTOS FOR NESTED STRUCTURES
// ============================================================================

export class I18nText {
  @IsString()
  en!: string;

  @IsString()
  ar!: string;
}

export class NormalRange {
  @IsNumber()
  min!: number;

  @IsNumber()
  max!: number;
}

export class VitalItemDto {
  @IsString()
  id!: string; // e.g., "heart_rate"

  @IsString()
  code!: string; // e.g., "HR"

  @IsString()
  @IsOptional()
  loincCode?: string; // LOINC code for standardization

  @IsEnum(VitalItemType)
  type!: VitalItemType;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nText)
  label!: I18nText;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  unitOptions?: string[]; // ["bpm", "beats/min"]

  @IsString()
  @IsOptional()
  defaultUnit?: string;

  @IsNumber()
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @IsOptional()
  maxValue?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => NormalRange)
  normalRange?: NormalRange;

  @IsInt()
  @IsOptional()
  decimals?: number;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsInt()
  @Min(1)
  sortOrder!: number;

  @IsBoolean()
  @IsOptional()
  captureTimeRequired?: boolean;

  @IsString()
  @IsOptional()
  displayWith?: string; // For compound displays like BP (systolic/diastolic)

  // For calculated fields
  @IsString()
  @IsOptional()
  formula?: string; // e.g., "weight_kg / ((height_cm/100) ^ 2)"

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependsOn?: string[]; // Dependencies for calculated fields

  @IsBoolean()
  @IsOptional()
  readOnly?: boolean;

  // For select/multiselect
  @IsArray()
  @IsOptional()
  options?: any[]; // Array of {value, label: {en, ar}}

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class VitalGroupDto {
  @IsString()
  id!: string; // e.g., "basic_vitals"

  @IsObject()
  @ValidateNested()
  @Type(() => I18nText)
  label!: I18nText;

  @IsInt()
  @Min(1)
  sortOrder!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VitalItemDto)
  items!: VitalItemDto[];
}

export class VitalTemplateContext {
  @IsArray()
  @IsEnum(CareSetting, { each: true })
  careSetting!: CareSetting[];

  @IsArray()
  @IsEnum(AgeGroup, { each: true })
  ageGroup!: AgeGroup[];

  @IsArray()
  @IsString({ each: true })
  specialties!: string[]; // e.g., ["GEN_MED", "CARDIO"]
}

// ============================================================================
// MAIN DTOS
// ============================================================================

export class CreateVitalSignsTemplateDto {
  @IsString()
  templateCode!: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  version?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nText)
  name!: I18nText;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nText)
  description?: I18nText;

  @IsArray()
  @IsEnum(CareSetting, { each: true })
  careSetting!: CareSetting[];

  @IsArray()
  @IsEnum(AgeGroup, { each: true })
  ageGroup!: AgeGroup[];

  @IsArray()
  @IsString({ each: true })
  specialties!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VitalGroupDto)
  groups!: VitalGroupDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateVitalSignsTemplateDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  version?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nText)
  name?: I18nText;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nText)
  description?: I18nText;

  @IsArray()
  @IsEnum(CareSetting, { each: true })
  @IsOptional()
  careSetting?: CareSetting[];

  @IsArray()
  @IsEnum(AgeGroup, { each: true })
  @IsOptional()
  ageGroup?: AgeGroup[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VitalGroupDto)
  @IsOptional()
  groups?: VitalGroupDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class QueryVitalSignsTemplatesDto {
  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsEnum(AgeGroup)
  @IsOptional()
  ageGroup?: AgeGroup;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsString()
  @IsOptional()
  search?: string; // Search in template name
}

export class FindTemplateDto {
  @IsEnum(CareSetting)
  careSetting!: CareSetting;

  @IsEnum(AgeGroup)
  ageGroup!: AgeGroup;

  @IsString()
  @IsOptional()
  specialty?: string;
}
