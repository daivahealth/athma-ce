import { IsString, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';

export enum StaffType {
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  TECHNICIAN = 'technician',
  PHARMACIST = 'pharmacist',
  ADMINISTRATIVE = 'administrative',
  SUPPORT = 'support',
  OTHER = 'other',
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
