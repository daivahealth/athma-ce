import { IsString, IsOptional, IsEnum, IsInt, Min, IsUUID } from 'class-validator';

export enum WardType {
  GENERAL = 'general',
  ICU = 'icu',
  NICU = 'nicu',
  PICU = 'picu',
  ISOLATION = 'isolation',
  MATERNITY = 'maternity',
  SURGICAL = 'surgical',
  PEDIATRIC = 'pediatric',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
}

export enum GenderRestriction {
  MALE_ONLY = 'male_only',
  FEMALE_ONLY = 'female_only',
  MIXED = 'mixed',
}

export class CreateWardDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(WardType)
  wardType!: WardType;

  @IsEnum(GenderRestriction)
  @IsOptional()
  genderRestriction?: GenderRestriction;

  @IsUUID("loose" as any)
  @IsOptional()
  specialtyId?: string;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalBeds?: number;

  @IsString()
  @IsOptional()
  nursingStation?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
