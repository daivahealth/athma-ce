import { IsString, IsOptional, IsNotEmpty, IsEnum, IsObject, IsBoolean, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum FinancialClass {
  INSURANCE = 'insurance',
  CORPORATE = 'corporate',
  TPA = 'tpa',
  CASH = 'cash',
  GOVERNMENT = 'government',
}

export enum CoverageLevel {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  SELF_PAY = 'self_pay',
}

export class CreateEncounterCoverageDto {
  @ApiProperty({ description: 'Encounter ID (from Clinical database)' })
  @IsUUID()
  @IsNotEmpty()
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID (from Clinical database)' })
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Policy ID (may be null for self-pay)' })
  @IsUUID()
  @IsOptional()
  policyId?: string;

  @ApiPropertyOptional({ description: 'Payer ID' })
  @IsUUID()
  @IsOptional()
  payerId?: string;

  @ApiProperty({ enum: FinancialClass, description: 'Financial class (insurance, corporate, tpa, cash, government)' })
  @IsEnum(FinancialClass)
  @IsNotEmpty()
  financialClass!: FinancialClass;

  @ApiPropertyOptional({ enum: CoverageLevel, default: CoverageLevel.PRIMARY, description: 'Coverage level (primary, secondary, tertiary, self_pay)' })
  @IsEnum(CoverageLevel)
  @IsOptional()
  coverageLevel?: CoverageLevel;

  @ApiPropertyOptional({ description: 'Plan name snapshot' })
  @IsString()
  @IsOptional()
  planName?: string;

  @ApiPropertyOptional({ description: 'Member ID snapshot' })
  @IsString()
  @IsOptional()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Member name snapshot' })
  @IsString()
  @IsOptional()
  memberName?: string;

  @ApiPropertyOptional({ description: 'Network name snapshot' })
  @IsString()
  @IsOptional()
  networkName?: string;

  @ApiPropertyOptional({ description: 'Copay amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  copayAmount?: number;

  @ApiPropertyOptional({ description: 'Coinsurance percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  coinsurancePct?: number;

  @ApiPropertyOptional({ description: 'Deductible snapshot (JSON)' })
  @IsObject()
  @IsOptional()
  deductibleSnapshot?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Benefits snapshot (JSON)' })
  @IsObject()
  @IsOptional()
  benefitsSnapshot?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Eligibility request ID' })
  @IsUUID()
  @IsOptional()
  eligibilityRequestId?: string;

  @ApiPropertyOptional({ description: 'Pre-authorization request ID' })
  @IsUUID()
  @IsOptional()
  preauthRequestId?: string;

  @ApiPropertyOptional({ description: 'Cost estimate ID' })
  @IsUUID()
  @IsOptional()
  costEstimateId?: string;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateEncounterCoverageDto extends PartialType(CreateEncounterCoverageDto) {}

export interface EncounterCoverageResponseDto {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  policyId?: string | null;
  payerId?: string | null;
  financialClass: FinancialClass;
  coverageLevel: CoverageLevel;
  planName?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  networkName?: string | null;
  copayAmount?: number | null;
  coinsurancePct?: number | null;
  deductibleSnapshot?: Record<string, any> | null;
  benefitsSnapshot?: Record<string, any> | null;
  eligibilityRequestId?: string | null;
  preauthRequestId?: string | null;
  costEstimateId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  policy?: any;
  payer?: any;
}
