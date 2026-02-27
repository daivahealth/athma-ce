import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// Enums
// ============================================

export enum MembershipTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum BenefitType {
  CONSULTATION = 'CONSULTATION',
  ASSESSMENT = 'ASSESSMENT',
  LAB_TEST = 'LAB_TEST',
  TREATMENT = 'TREATMENT',
  PROGRAM_ACCESS = 'PROGRAM_ACCESS',
  DISCOUNT = 'DISCOUNT',
  FACILITY_ACCESS = 'FACILITY_ACCESS',
  PRIORITY_BOOKING = 'PRIORITY_BOOKING',
  COACHING = 'COACHING',
  NUTRITION = 'NUTRITION',
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
  OTHER = 'OTHER',
}

// ============================================
// Plan Benefit DTO
// ============================================

export class PlanBenefitDto {
  @ApiProperty({ enum: BenefitType, description: 'Type of benefit' })
  @IsEnum(BenefitType)
  benefitType!: BenefitType;

  @ApiProperty({ description: 'Benefit name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Benefit description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Usage limit per billing cycle (-1 for unlimited)' })
  @IsOptional()
  @IsNumber()
  @Min(-1)
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Discount percentage (for discount benefits)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'Service codes this benefit applies to' })
  @IsOptional()
  @IsArray()
  applicableServiceCodes?: string[];

  @ApiPropertyOptional({ description: 'Additional benefit metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ============================================
// Create Membership Plan DTO
// ============================================

export class CreateMembershipPlanDto {
  @ApiProperty({ description: 'Plan name' })
  @IsString()
  planName!: string;

  @ApiPropertyOptional({ description: 'Plan description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: MembershipTier, description: 'Membership tier' })
  @IsEnum(MembershipTier)
  tier!: MembershipTier;

  @ApiProperty({ enum: BillingCycle, description: 'Billing cycle' })
  @IsEnum(BillingCycle)
  billingCycle!: BillingCycle;

  @ApiProperty({ description: 'Price per billing cycle' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ description: 'Currency code (default: AED)' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Setup fee (one-time)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  setupFee?: number;

  @ApiProperty({ type: [PlanBenefitDto], description: 'Plan benefits' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanBenefitDto)
  benefits!: PlanBenefitDto[];

  @ApiPropertyOptional({ description: 'Is plan publicly visible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Maximum members allowed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxMembers?: number;

  @ApiPropertyOptional({ description: 'Facilities where plan is available' })
  @IsOptional()
  @IsArray()
  availableFacilities?: string[];

  @ApiPropertyOptional({ description: 'Plan terms and conditions' })
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiPropertyOptional({ description: 'Additional plan metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ============================================
// Update Membership Plan DTO
// ============================================

export class UpdateMembershipPlanDto {
  @ApiPropertyOptional({ description: 'Plan name' })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiPropertyOptional({ description: 'Plan description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Price per billing cycle' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ type: [PlanBenefitDto], description: 'Plan benefits' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanBenefitDto)
  benefits?: PlanBenefitDto[];

  @ApiPropertyOptional({ description: 'Is plan active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is plan publicly visible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Maximum members allowed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxMembers?: number;

  @ApiPropertyOptional({ description: 'Facilities where plan is available' })
  @IsOptional()
  @IsArray()
  availableFacilities?: string[];

  @ApiPropertyOptional({ description: 'Plan terms and conditions' })
  @IsOptional()
  @IsString()
  termsAndConditions?: string;
}

// ============================================
// Response DTOs
// ============================================

export class PlanBenefitResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: BenefitType })
  benefitType!: BenefitType;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  usageLimit?: number;

  @ApiPropertyOptional()
  discountPercent?: number;

  @ApiPropertyOptional()
  applicableServiceCodes?: string[];

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class MembershipPlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  planName!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: MembershipTier })
  tier!: MembershipTier;

  @ApiProperty({ enum: BillingCycle })
  billingCycle!: BillingCycle;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional()
  setupFee?: number;

  @ApiProperty({ type: [PlanBenefitResponseDto] })
  benefits!: PlanBenefitResponseDto[];

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  isPublic!: boolean;

  @ApiPropertyOptional()
  maxMembers?: number;

  @ApiPropertyOptional()
  currentMembers?: number;

  @ApiPropertyOptional()
  availableFacilities?: string[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class MembershipPlanSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  planName!: string;

  @ApiProperty({ enum: MembershipTier })
  tier!: MembershipTier;

  @ApiProperty({ enum: BillingCycle })
  billingCycle!: BillingCycle;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  benefitCount!: number;

  @ApiProperty()
  isActive!: boolean;
}
