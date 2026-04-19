import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PackageType {
  HEALTH_CHECK = 'health_check',
  SURGICAL_BUNDLE = 'surgical_bundle',
  MATERNITY_BUNDLE = 'maternity_bundle',
  PRE_EMPLOYMENT = 'pre_employment',
  ANNUAL_CHECKUP = 'annual_checkup',
  CUSTOM = 'custom',
}

export enum CareSetting {
  OP = 'OP',
  IP = 'IP',
  DAYCARE = 'DAYCARE',
  ANY = 'ANY',
}

export enum CatalogType {
  LAB_TEST = 'LAB_TEST',
  IMAGING_STUDY = 'IMAGING_STUDY',
  PROCEDURE = 'PROCEDURE',
  DRUG = 'DRUG',
  VISIT_TYPE = 'VISIT_TYPE',
  MISC = 'MISC',
}

export class PackageItemDto {
  @IsEnum(CatalogType)
  catalogType!: CatalogType;

  @IsUUID("loose" as any)
  catalogId!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean;

  @IsBoolean()
  @IsOptional()
  clinicalOnly?: boolean;

  @IsString()
  @IsOptional()
  groupName?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsInt()
  @IsOptional()
  maxUsesPerPackage?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePackageDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PackageType)
  @IsOptional()
  packageType?: PackageType;

  @IsString()
  @IsOptional()
  genderRestriction?: string;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  minAgeYears?: number;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  maxAgeYears?: number;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsInt()
  @IsOptional()
  validityDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItemDto)
  @IsOptional()
  items?: PackageItemDto[];
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PackageType)
  @IsOptional()
  packageType?: PackageType;

  @IsString()
  @IsOptional()
  genderRestriction?: string;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  minAgeYears?: number;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  maxAgeYears?: number;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsInt()
  @IsOptional()
  validityDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItemDto)
  @IsOptional()
  items?: PackageItemDto[];
}

export class QueryPackagesDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(PackageType)
  @IsOptional()
  packageType?: PackageType;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;
}
