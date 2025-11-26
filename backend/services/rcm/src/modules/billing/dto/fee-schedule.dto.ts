import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsNumber, IsDate, IsObject, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum FeeScheduleType {
  AUTHORITY = 'authority',
  TENANT = 'tenant',
  CONTRACT = 'contract',
}

export enum FeeScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

export enum AuthorityCode {
  DHA = 'DHA',
  DOH = 'DOH',
  MOHAP = 'MOHAP',
  HAAD = 'HAAD',
}

export enum FeeScheduleCodeType {
  INTERNAL = 'INTERNAL',
  CPT = 'CPT',
  DHA = 'DHA',
  DOH = 'DOH',
  HAAD = 'HAAD',
  MOHAP = 'MOHAP',
  LOINC = 'LOINC',
  ICD10 = 'ICD10',
  CUSTOM = 'CUSTOM',
}

// Fee Schedule DTOs
export class CreateFeeScheduleDto {
  @ApiPropertyOptional({ description: 'Tenant ID (null for authority/global schedules)' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ description: 'Schedule name' })
  @IsString()
  @IsNotEmpty()
  scheduleName!: string;

  @ApiProperty({ enum: FeeScheduleType, description: 'Schedule type' })
  @IsEnum(FeeScheduleType)
  @IsNotEmpty()
  scheduleType!: FeeScheduleType;

  @ApiPropertyOptional({ enum: AuthorityCode, description: 'Authority code (for authority schedules)' })
  @IsEnum(AuthorityCode)
  @IsOptional()
  authorityCode?: AuthorityCode;

  @ApiPropertyOptional({ description: 'Version identifier' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Effective from date', type: Date })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  effectiveFrom!: Date;

  @ApiPropertyOptional({ description: 'Effective to date', type: Date })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveTo?: Date;

  @ApiPropertyOptional({ enum: FeeScheduleStatus, description: 'Schedule status', default: FeeScheduleStatus.ACTIVE })
  @IsEnum(FeeScheduleStatus)
  @IsOptional()
  status?: FeeScheduleStatus;

  @ApiPropertyOptional({ description: 'Base fee schedule ID (for derived schedules)' })
  @IsUUID()
  @IsOptional()
  baseFeeScheduleId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata', type: Object })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateFeeScheduleDto extends PartialType(CreateFeeScheduleDto) {}

export interface FeeScheduleResponseDto {
  id: string;
  tenantId?: string | null;
  scheduleName: string;
  scheduleType: FeeScheduleType;
  authorityCode?: string | null;
  version?: string | null;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  status: FeeScheduleStatus;
  baseFeeScheduleId?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  // Relation data
  baseFeeSchedule?: FeeScheduleResponseDto | null;
  feeScheduleItems?: FeeScheduleItemResponseDto[];
}

// Fee Schedule Item DTOs
export class CreateFeeScheduleItemDto {
  @ApiProperty({ description: 'Fee schedule ID' })
  @IsUUID()
  @IsNotEmpty()
  feeScheduleId!: string;

  @ApiPropertyOptional({ description: 'Billing item ID (optional link to catalog)' })
  @IsUUID()
  @IsOptional()
  billingItemId?: string;

  @ApiProperty({ description: 'Billing code (DHA/DOH/CPT code)' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ enum: FeeScheduleCodeType, description: 'Code type' })
  @IsEnum(FeeScheduleCodeType)
  @IsNotEmpty()
  codeType!: FeeScheduleCodeType;

  @ApiProperty({ description: 'Base amount in AED' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  baseAmount!: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: 'Price multiplier for contract overrides' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  multiplier?: number;

  @ApiPropertyOptional({ description: 'Discount percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  discountPct?: number;

  @ApiPropertyOptional({ description: 'Maximum allowed amount (cap)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxAllowedAmount?: number;

  @ApiPropertyOptional({ description: 'Service group (radiology, laboratory, etc.)' })
  @IsString()
  @IsOptional()
  serviceGroup?: string;

  @ApiPropertyOptional({ description: 'Priority for conflict resolution', default: 100 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(1000)
  priority?: number;
}

export class UpdateFeeScheduleItemDto extends PartialType(CreateFeeScheduleItemDto) {}

export interface FeeScheduleItemResponseDto {
  id: string;
  feeScheduleId: string;
  billingItemId?: string | null;
  code: string;
  codeType: FeeScheduleCodeType;
  baseAmount: number;
  currency: string;
  unit?: string | null;
  multiplier?: number | null;
  discountPct?: number | null;
  maxAllowedAmount?: number | null;
  serviceGroup?: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  // Relation data
  feeSchedule?: FeeScheduleResponseDto;
}

// Bulk operations DTOs
export class BulkCreateFeeScheduleItemsDto {
  @ApiProperty({ description: 'Fee schedule ID' })
  @IsUUID()
  @IsNotEmpty()
  feeScheduleId!: string;

  @ApiProperty({ description: 'Array of fee schedule items', type: [CreateFeeScheduleItemDto] })
  @IsNotEmpty()
  items!: Omit<CreateFeeScheduleItemDto, 'feeScheduleId'>[];
}

// Query/Filter DTOs
export class FeeScheduleQueryDto {
  @ApiPropertyOptional({ enum: FeeScheduleType, description: 'Filter by schedule type' })
  @IsEnum(FeeScheduleType)
  @IsOptional()
  scheduleType?: FeeScheduleType;

  @ApiPropertyOptional({ enum: FeeScheduleStatus, description: 'Filter by status' })
  @IsEnum(FeeScheduleStatus)
  @IsOptional()
  status?: FeeScheduleStatus;

  @ApiPropertyOptional({ enum: AuthorityCode, description: 'Filter by authority code' })
  @IsEnum(AuthorityCode)
  @IsOptional()
  authorityCode?: AuthorityCode;

  @ApiPropertyOptional({ description: 'Filter by effective date (find schedules active on this date)', type: Date })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveDate?: Date;
}

export class FeeScheduleItemQueryDto {
  @ApiPropertyOptional({ description: 'Filter by billing code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ enum: FeeScheduleCodeType, description: 'Filter by code type' })
  @IsEnum(FeeScheduleCodeType)
  @IsOptional()
  codeType?: FeeScheduleCodeType;

  @ApiPropertyOptional({ description: 'Filter by service group' })
  @IsString()
  @IsOptional()
  serviceGroup?: string;
}

// Price lookup DTOs
export class PriceLookupDto {
  @ApiProperty({ description: 'Billing code to look up' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ enum: FeeScheduleCodeType, description: 'Code type' })
  @IsEnum(FeeScheduleCodeType)
  @IsNotEmpty()
  codeType!: FeeScheduleCodeType;

  @ApiPropertyOptional({ description: 'Fee schedule ID (optional, will search all active schedules if not provided)' })
  @IsUUID()
  @IsOptional()
  feeScheduleId?: string;

  @ApiPropertyOptional({ description: 'Lookup date (defaults to current date)', type: Date })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lookupDate?: Date;
}

export interface PriceLookupResponseDto {
  code: string;
  codeType: FeeScheduleCodeType;
  baseAmount: number;
  effectiveAmount: number; // After multiplier and discount
  currency: string;
  feeSchedule: {
    id: string;
    scheduleName: string;
    scheduleType: FeeScheduleType;
    authorityCode?: string | null;
  };
  feeScheduleItem: FeeScheduleItemResponseDto;
}
