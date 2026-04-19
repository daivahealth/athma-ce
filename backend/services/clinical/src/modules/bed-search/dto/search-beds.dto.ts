import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum BedType {
  ICU = 'icu',
  GENERAL = 'general',
  ISOLATION = 'isolation',
  PEDIATRIC = 'pediatric',
  MATERNITY = 'maternity',
}

export enum GenderRestriction {
  MALE_ONLY = 'male_only',
  FEMALE_ONLY = 'female_only',
  MIXED = 'mixed',
}

export class SearchBedsDto {
  @IsUUID("all")
  facilityId!: string;

  @IsUUID("all")
  @IsOptional()
  wardId?: string;

  @IsEnum(BedType)
  @IsOptional()
  bedType?: BedType;

  @IsEnum(GenderRestriction)
  @IsOptional()
  genderRestriction?: GenderRestriction;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  requiresIsolation?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredFeatures?: string[]; // ['oxygen', 'ventilator', 'cardiac_monitor', 'iv_pole']

  @IsString()
  @IsOptional()
  patientGender?: string; // For automatic gender matching

  @IsUUID("all")
  @IsOptional()
  specialtyId?: string;
}
