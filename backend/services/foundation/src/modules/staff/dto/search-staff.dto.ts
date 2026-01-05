import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum StaffType {
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  TECHNICIAN = 'technician',
  PHARMACIST = 'pharmacist',
  ADMINISTRATIVE = 'administrative',
  SUPPORT = 'support',
  OTHER = 'other',
}

export class SearchStaffDto {
  /**
   * Search by staff display name (case-insensitive)
   */
  @IsString()
  @IsOptional()
  displayName?: string;

  /**
   * Filter by staff type
   */
  @IsEnum(StaffType)
  @IsOptional()
  staffType?: StaffType;

  /**
   * Filter by staff status
   */
  @IsString()
  @IsOptional()
  status?: string;

  /**
   * Filter by specialty ID
   */
  @IsString()
  @IsOptional()
  specialtyId?: string;

  /**
   * Filter by facility ID
   */
  @IsString()
  @IsOptional()
  facilityId?: string;

  /**
   * Page limit (1-100, default 20)
   */
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  /**
   * Page offset (default 0)
   */
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;
}
