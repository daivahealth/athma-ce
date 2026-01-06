import { IsString, IsOptional, IsEnum, IsObject, IsBoolean } from 'class-validator';

export enum BedType {
  ICU = 'icu',
  GENERAL = 'general',
  ISOLATION = 'isolation',
  PEDIATRIC = 'pediatric',
  MATERNITY = 'maternity',
}

export enum BedStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  DECOMMISSIONED = 'decommissioned',
}

export enum IsolationType {
  CONTACT = 'contact',
  DROPLET = 'droplet',
  AIRBORNE = 'airborne',
  PROTECTIVE = 'protective',
}

export enum GenderRestriction {
  MALE_ONLY = 'male_only',
  FEMALE_ONLY = 'female_only',
  MIXED = 'mixed',
}

export class CreateBedDto {
  @IsString()
  bedNumber!: string;

  @IsEnum(BedType)
  bedType!: BedType;

  @IsObject()
  @IsOptional()
  features?: Record<string, any>; // { oxygen: true, ventilator: true, cardiac_monitor: true, iv_pole: true }

  @IsBoolean()
  @IsOptional()
  requiresIsolation?: boolean;

  @IsEnum(IsolationType)
  @IsOptional()
  isolationType?: IsolationType;

  @IsEnum(GenderRestriction)
  @IsOptional()
  genderRestriction?: GenderRestriction;

  @IsString()
  @IsOptional()
  maintenanceNotes?: string;

  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;
}
