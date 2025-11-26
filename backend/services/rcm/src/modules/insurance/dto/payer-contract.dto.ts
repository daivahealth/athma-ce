import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsObject,
  IsUUID,
  IsDateString,
  IsDecimal,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

// ==================== ENUMS ====================

export enum ContractType {
  FEE_FOR_SERVICE = 'fee_for_service',
  CAPITATION = 'capitation',
  BUNDLED = 'bundled',
  VALUE_BASED = 'value_based',
}

export enum ReimbursementMethod {
  PERCENTAGE_OF_TARIFF = 'percentage_of_tariff',
  FIXED_RATE = 'fixed_rate',
  PERCENTAGE_OF_CHARGES = 'percentage_of_charges',
  PER_DIEM = 'per_diem',
  CASE_RATE = 'case_rate',
}

export enum ContractStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DRAFT = 'draft',
  SUSPENDED = 'suspended',
}

export enum AuthorityCode {
  DHA = 'DHA',
  DOH = 'DOH',
  MOHAP = 'MOHAP',
  HAAD = 'HAAD',
}

// ==================== PAYER CONTRACT DTOs ====================

export class CreatePayerContractDto {
  @ApiProperty({ description: 'Payer ID' })
  @IsUUID()
  @IsNotEmpty()
  payerId!: string;

  @ApiProperty({ description: 'Contract name' })
  @IsString()
  @IsNotEmpty()
  contractName!: string;

  @ApiPropertyOptional({ description: 'Contract number (external reference)' })
  @IsString()
  @IsOptional()
  contractNumber?: string;

  @ApiPropertyOptional({ description: 'Authority code', enum: AuthorityCode })
  @IsEnum(AuthorityCode)
  @IsOptional()
  authorityCode?: AuthorityCode;

  @ApiPropertyOptional({ description: 'Base fee schedule ID to reference' })
  @IsUUID()
  @IsOptional()
  baseFeeScheduleId?: string;

  @ApiPropertyOptional({ description: 'Plan code for specific plan within payer' })
  @IsString()
  @IsOptional()
  planCode?: string;

  @ApiPropertyOptional({ description: 'Network type (e.g., PPO, HMO, EPO)' })
  @IsString()
  @IsOptional()
  networkType?: string;

  @ApiPropertyOptional({ description: 'Line of business (e.g., commercial, medicare, medicaid)' })
  @IsString()
  @IsOptional()
  lineOfBusiness?: string;

  @ApiPropertyOptional({ description: 'Contract type', enum: ContractType, default: ContractType.FEE_FOR_SERVICE })
  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @ApiPropertyOptional({
    description: 'Reimbursement method',
    enum: ReimbursementMethod,
    default: ReimbursementMethod.PERCENTAGE_OF_TARIFF,
  })
  @IsEnum(ReimbursementMethod)
  @IsOptional()
  reimbursementMethod?: ReimbursementMethod;

  @ApiProperty({ description: 'Effective from date (ISO 8601 format)' })
  @IsDateString()
  @IsNotEmpty()
  effectiveFrom!: string;

  @ApiPropertyOptional({ description: 'Effective to date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @ApiPropertyOptional({ description: 'Contract status', enum: ContractStatus, default: ContractStatus.ACTIVE })
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Default multiplier applied to base tariff' })
  @IsOptional()
  defaultMultiplier?: number;

  @ApiPropertyOptional({ description: 'Default discount percentage' })
  @IsOptional()
  defaultDiscountPct?: number;

  @ApiPropertyOptional({ description: 'Default maximum allowed amount' })
  @IsOptional()
  defaultMaxAllowedAmount?: number;

  @ApiPropertyOptional({ description: 'Contract terms (JSON)' })
  @IsObject()
  @IsOptional()
  terms?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional metadata (JSON)' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdatePayerContractDto extends PartialType(CreatePayerContractDto) {}

export interface PayerContractResponseDto {
  id: string;
  tenantId: string;
  payerId: string;
  contractName: string;
  contractNumber?: string | null;
  authorityCode?: string | null;
  baseFeeScheduleId?: string | null;
  planCode?: string | null;
  networkType?: string | null;
  lineOfBusiness?: string | null;
  contractType: string;
  reimbursementMethod: string;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  status: string;
  defaultMultiplier?: Decimal | null;
  defaultDiscountPct?: Decimal | null;
  defaultMaxAllowedAmount?: Decimal | null;
  terms?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  // Relations
  payer?: any;
  baseFeeSchedule?: any;
  adjustments?: PayerContractAdjustmentResponseDto[];
}

// ==================== PAYER CONTRACT ADJUSTMENT DTOs ====================

export class CreatePayerContractAdjustmentDto {
  @ApiProperty({ description: 'Contract ID this adjustment belongs to' })
  @IsUUID()
  @IsNotEmpty()
  contractId!: string;

  @ApiPropertyOptional({ description: 'Service group to apply adjustment to' })
  @IsString()
  @IsOptional()
  serviceGroup?: string;

  @ApiPropertyOptional({ description: 'Billing item ID to apply adjustment to' })
  @IsUUID()
  @IsOptional()
  billingItemId?: string;

  @ApiPropertyOptional({ description: 'Fee schedule item ID to apply adjustment to' })
  @IsUUID()
  @IsOptional()
  feeScheduleItemId?: string;

  @ApiPropertyOptional({ description: 'Pricing multiplier override' })
  @IsOptional()
  multiplier?: number;

  @ApiPropertyOptional({ description: 'Discount percentage override' })
  @IsOptional()
  discountPct?: number;

  @ApiPropertyOptional({ description: 'Maximum allowed amount' })
  @IsOptional()
  maxAllowedAmount?: number;

  @ApiPropertyOptional({ description: 'Minimum allowed amount' })
  @IsOptional()
  minAllowedAmount?: number;

  @ApiPropertyOptional({ description: 'Priority (lower = higher specificity)', default: 100 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: 'Effective from date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Effective to date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @ApiPropertyOptional({ description: 'Is this an exclusion rule?', default: false })
  @IsBoolean()
  @IsOptional()
  isExclusion?: boolean;

  @ApiPropertyOptional({ description: 'Notes about this adjustment' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePayerContractAdjustmentDto extends PartialType(CreatePayerContractAdjustmentDto) {}

export interface PayerContractAdjustmentResponseDto {
  id: string;
  contractId: string;
  serviceGroup?: string | null;
  billingItemId?: string | null;
  feeScheduleItemId?: string | null;
  multiplier?: Decimal | null;
  discountPct?: Decimal | null;
  maxAllowedAmount?: Decimal | null;
  minAllowedAmount?: Decimal | null;
  priority: number;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  isExclusion: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  // Relations
  contract?: any;
  billingItem?: any;
  feeScheduleItem?: any;
}

// ==================== BULK OPERATIONS ====================

export class BulkCreatePayerContractAdjustmentsDto {
  @ApiProperty({ description: 'Contract ID for all adjustments' })
  @IsUUID()
  @IsNotEmpty()
  contractId!: string;

  @ApiProperty({ description: 'Array of adjustments to create', type: [CreatePayerContractAdjustmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePayerContractAdjustmentDto)
  adjustments!: Omit<CreatePayerContractAdjustmentDto, 'contractId'>[];
}

// ==================== QUERY/FILTER DTOs ====================

export class PayerContractQueryDto {
  @ApiPropertyOptional({ description: 'Filter by payer ID' })
  @IsUUID()
  @IsOptional()
  payerId?: string;

  @ApiPropertyOptional({ description: 'Filter by contract status', enum: ContractStatus })
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @ApiPropertyOptional({ description: 'Filter by contract type', enum: ContractType })
  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @ApiPropertyOptional({ description: 'Filter by authority code', enum: AuthorityCode })
  @IsEnum(AuthorityCode)
  @IsOptional()
  authorityCode?: AuthorityCode;

  @ApiPropertyOptional({ description: 'Filter by plan code' })
  @IsString()
  @IsOptional()
  planCode?: string;

  @ApiPropertyOptional({ description: 'Filter by network type' })
  @IsString()
  @IsOptional()
  networkType?: string;

  @ApiPropertyOptional({ description: 'Filter by effective date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;
}

export class PayerContractAdjustmentQueryDto {
  @ApiPropertyOptional({ description: 'Filter by contract ID' })
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @ApiPropertyOptional({ description: 'Filter by service group' })
  @IsString()
  @IsOptional()
  serviceGroup?: string;

  @ApiPropertyOptional({ description: 'Filter by billing item ID' })
  @IsUUID()
  @IsOptional()
  billingItemId?: string;

  @ApiPropertyOptional({ description: 'Filter by fee schedule item ID' })
  @IsUUID()
  @IsOptional()
  feeScheduleItemId?: string;

  @ApiPropertyOptional({ description: 'Filter by effective date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Include exclusions?', default: true })
  @IsBoolean()
  @IsOptional()
  includeExclusions?: boolean;
}

// ==================== PRICE CALCULATION DTO ====================

export class CalculateContractPriceDto {
  @ApiProperty({ description: 'Contract ID' })
  @IsUUID()
  @IsNotEmpty()
  contractId!: string;

  @ApiProperty({ description: 'Billing code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: 'Code type (CPT, ICD10, etc.)' })
  @IsString()
  @IsNotEmpty()
  codeType!: string;

  @ApiPropertyOptional({ description: 'Service group' })
  @IsString()
  @IsOptional()
  serviceGroup?: string;

  @ApiPropertyOptional({ description: 'Effective date for calculation (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;
}

export interface ContractPriceCalculationResponseDto {
  contractId: string;
  code: string;
  codeType: string;
  basePrice?: number | null;
  adjustedPrice: number;
  appliedAdjustments: {
    adjustmentId: string;
    type: 'multiplier' | 'discount' | 'cap' | 'floor' | 'exclusion';
    value: number;
    description: string;
  }[];
  effectiveDate: Date;
  currency: string;
}
