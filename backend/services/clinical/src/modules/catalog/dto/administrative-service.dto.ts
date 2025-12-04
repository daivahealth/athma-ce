import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  Min,
  IsObject,
} from 'class-validator';

export enum ServiceCategory {
  REGISTRATION = 'registration',
  CONSULTATION = 'consultation',
  ADMISSION = 'admission',
  ROOM_CHARGE = 'room_charge',
  ADMINISTRATIVE = 'administrative',
  NURSING = 'nursing',
  THERAPY = 'therapy',
  EMERGENCY = 'emergency',
  FACILITY = 'facility',
  OTHER = 'other',
}

export enum ServiceType {
  NEW_PATIENT = 'new_patient',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE = 'routine',
  SPECIALIST = 'specialist',
  TELEPHONIC = 'telephonic',
  VIDEO = 'video',
  HOME_VISIT = 'home_visit',
}

export enum CareSetting {
  OP = 'OP',
  IP = 'IP',
  DAYCARE = 'DAYCARE',
  ANY = 'ANY',
}

export class CreateAdministrativeServiceDto {
  @IsString()
  serviceName!: string;

  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsString()
  @IsOptional()
  billingCode?: string;

  @IsString()
  @IsOptional()
  billingCodeType?: string;

  @IsString()
  @IsOptional()
  billingDescription?: string;

  @IsEnum(ServiceCategory)
  serviceCategory!: ServiceCategory;

  @IsEnum(ServiceType)
  @IsOptional()
  serviceType?: ServiceType;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  requiresStaff?: boolean;

  @IsString()
  @IsOptional()
  staffType?: string;

  @IsBoolean()
  @IsOptional()
  requiresRoom?: boolean;

  @IsString()
  @IsOptional()
  roomType?: string;

  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateAdministrativeServiceDto {
  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsString()
  @IsOptional()
  billingCode?: string;

  @IsString()
  @IsOptional()
  billingCodeType?: string;

  @IsString()
  @IsOptional()
  billingDescription?: string;

  @IsEnum(ServiceCategory)
  @IsOptional()
  serviceCategory?: ServiceCategory;

  @IsEnum(ServiceType)
  @IsOptional()
  serviceType?: ServiceType;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  requiresStaff?: boolean;

  @IsString()
  @IsOptional()
  staffType?: string;

  @IsBoolean()
  @IsOptional()
  requiresRoom?: boolean;

  @IsString()
  @IsOptional()
  roomType?: string;

  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class QueryAdministrativeServicesDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ServiceCategory)
  @IsOptional()
  serviceCategory?: ServiceCategory;

  @IsEnum(ServiceType)
  @IsOptional()
  serviceType?: ServiceType;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(CareSetting)
  @IsOptional()
  careSetting?: CareSetting;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresStaff?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresRoom?: boolean;
}
