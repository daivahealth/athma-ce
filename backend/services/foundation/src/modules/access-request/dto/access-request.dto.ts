import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const ORGANISATION_TYPES = [
  'hospital',
  'multi_specialty_hospital',
  'cancer_centre',
  'clinic',
  'diagnostic_centre',
  'day_care',
  'other',
] as const;

export const ACCESS_REQUEST_MODULES = [
  'patient_access',
  'clinical',
  'operating_theatre',
  'lab',
  'imaging',
  'inpatient',
  'pharmacy',
  'billing',
  'revenue_cycle',
  'oncology',
  'analytics',
  'abdm',
] as const;

export const ACCESS_REQUEST_STATUSES = ['new', 'contacted', 'approved', 'declined'] as const;
export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateAccessRequestDto {
  @Transform(trim)
  @IsString()
  @Length(2, 200)
  organisationName!: string;

  @IsIn(ORGANISATION_TYPES)
  organisationType!: (typeof ORGANISATION_TYPES)[number];

  @Transform(trim)
  @IsString()
  @Length(2, 120)
  contactName!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @Matches(/^[+0-9 ()-]{6,30}$/, { message: 'phone must be 6-30 digits, spaces, +, ( ) or -' })
  phone?: string;

  @Transform(trim)
  @IsString()
  @Length(2, 80)
  country!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  facilityCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100000)
  bedCount?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(ACCESS_REQUEST_MODULES.length)
  @IsIn(ACCESS_REQUEST_MODULES, { each: true })
  modules?: string[];

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(2000)
  message?: string;

  /** Must be true: the requester agrees to be contacted about their request. */
  @IsBoolean()
  @Equals(true, { message: 'consent must be given' })
  consent!: boolean;

  /** Honeypot: hidden from people, filled in by bots. Requests that fill it are dropped silently. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}

export class UpdateAccessRequestDto {
  @IsOptional()
  @IsIn(ACCESS_REQUEST_STATUSES)
  status?: AccessRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  adminNotes?: string;
}

export class ListAccessRequestsQueryDto {
  @IsOptional()
  @IsIn(ACCESS_REQUEST_STATUSES)
  status?: AccessRequestStatus;
}
