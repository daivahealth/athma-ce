import { IsString, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';

export enum StaffType {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  TECHNICIAN = 'technician',
  SUPPORT = 'support',
}

export class SearchStaffBySpecialtyDto {
  @IsString()
  @IsOptional()
  specialtyCode?: string;

  @IsUUID()
  @IsOptional()
  specialtyId?: string;

  @IsEnum(StaffType)
  @IsOptional()
  staffType?: StaffType;

  @IsBoolean()
  @IsOptional()
  primaryOnly?: boolean;

  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean;

  @IsUUID()
  @IsOptional()
  facilityId?: string;

  @IsString()
  @IsOptional()
  locale?: string; // For translations (e.g., 'ar', 'en')
}
