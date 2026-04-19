import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MembershipTier, BillingCycle, BenefitType } from './membership-plan.dto';

// ============================================
// Enums
// ============================================

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum BillingEventType {
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_ACTIVATED = 'SUBSCRIPTION_ACTIVATED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  SUBSCRIPTION_PAUSED = 'SUBSCRIPTION_PAUSED',
  SUBSCRIPTION_RESUMED = 'SUBSCRIPTION_RESUMED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_ISSUED = 'REFUND_ISSUED',
  PLAN_UPGRADED = 'PLAN_UPGRADED',
  PLAN_DOWNGRADED = 'PLAN_DOWNGRADED',
  BENEFIT_USED = 'BENEFIT_USED',
  BENEFIT_RESET = 'BENEFIT_RESET',
  // Keep these for backwards compatibility in service layer
  PAYMENT_RECEIVED = 'PAYMENT_PROCESSED',
  SUBSCRIPTION_UPGRADED = 'PLAN_UPGRADED',
  SUBSCRIPTION_DOWNGRADED = 'PLAN_DOWNGRADED',
}

// ============================================
// Subscription DTOs
// ============================================

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Membership plan ID' })
  @IsUUID("all")
  planId!: string;

  @ApiPropertyOptional({ description: 'Start date (defaults to now)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Apply setup fee' })
  @IsOptional()
  @IsBoolean()
  applySetupFee?: boolean;

  @ApiPropertyOptional({ description: 'Promo code' })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Enrolled by staff ID' })
  @IsOptional()
  @IsUUID("all")
  enrolledBy?: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: SubscriptionStatus, description: 'Subscription status' })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ description: 'Auto-renew enabled' })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ChangePlanDto {
  @ApiProperty({ description: 'New plan ID' })
  @IsUUID("all")
  newPlanId!: string;

  @ApiPropertyOptional({ description: 'Effective date (defaults to next billing cycle)' })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Prorate current period' })
  @IsOptional()
  @IsBoolean()
  prorate?: boolean;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ description: 'Cancellation reason' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Cancel immediately (vs end of period)' })
  @IsOptional()
  @IsBoolean()
  immediate?: boolean;

  @ApiPropertyOptional({ description: 'Request refund' })
  @IsOptional()
  @IsBoolean()
  requestRefund?: boolean;
}

export class RenewSubscriptionDto {
  @ApiPropertyOptional({ description: 'Override renewal date' })
  @IsOptional()
  @IsDateString()
  renewalDate?: string;

  @ApiPropertyOptional({ description: 'Override price (for special renewals)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  overridePrice?: number;
}

// ============================================
// Benefit Usage DTOs
// ============================================

export class RecordBenefitUsageDto {
  @ApiProperty({ description: 'Subscription ID' })
  @IsUUID("all")
  subscriptionId!: string;

  @ApiProperty({ description: 'Benefit ID' })
  @IsUUID("all")
  benefitId!: string;

  @ApiPropertyOptional({ description: 'Service code used' })
  @IsOptional()
  @IsString()
  serviceCode?: string;

  @ApiPropertyOptional({ description: 'Encounter/visit ID' })
  @IsOptional()
  @IsUUID("all")
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Usage quantity' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BenefitUsageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subscriptionId!: string;

  @ApiProperty()
  benefitId!: string;

  @ApiProperty({ enum: BenefitType })
  benefitType!: BenefitType;

  @ApiProperty()
  benefitName!: string;

  @ApiPropertyOptional()
  serviceCode?: string;

  @ApiPropertyOptional()
  encounterId?: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  usedAt!: Date;

  @ApiPropertyOptional()
  notes?: string;
}

export class BenefitBalanceDto {
  @ApiProperty()
  benefitId!: string;

  @ApiProperty({ enum: BenefitType })
  benefitType!: BenefitType;

  @ApiProperty()
  benefitName!: string;

  @ApiProperty({ description: '-1 means unlimited' })
  limit!: number;

  @ApiProperty()
  used!: number;

  @ApiProperty()
  remaining!: number;

  @ApiProperty()
  cycleStart!: Date;

  @ApiProperty()
  cycleEnd!: Date;
}

// ============================================
// Response DTOs
// ============================================

export class SubscriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  planId!: string;

  @ApiProperty()
  planName!: string;

  @ApiProperty({ enum: MembershipTier })
  tier!: MembershipTier;

  @ApiProperty({ enum: SubscriptionStatus })
  status!: SubscriptionStatus;

  @ApiProperty()
  startDate!: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  currentPeriodStart!: Date;

  @ApiProperty()
  currentPeriodEnd!: Date;

  @ApiProperty()
  nextBillingDate!: Date;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  autoRenew!: boolean;

  @ApiPropertyOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional()
  cancellationReason?: string;

  @ApiProperty({ type: [BenefitBalanceDto] })
  benefitBalances!: BenefitBalanceDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class SubscriptionSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  patientName!: string;

  @ApiProperty()
  planName!: string;

  @ApiProperty({ enum: MembershipTier })
  tier!: MembershipTier;

  @ApiProperty({ enum: SubscriptionStatus })
  status!: SubscriptionStatus;

  @ApiProperty()
  nextBillingDate!: Date;

  @ApiProperty()
  price!: number;
}

// ============================================
// Invoice DTOs
// ============================================

export class SubscriptionInvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subscriptionId!: string;

  @ApiProperty()
  invoiceNumber!: string;

  @ApiProperty()
  periodStart!: Date;

  @ApiProperty()
  periodEnd!: Date;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  paidAt?: Date;

  @ApiPropertyOptional()
  paymentMethod?: string;

  @ApiProperty()
  dueDate!: Date;

  @ApiProperty()
  createdAt!: Date;
}

// ============================================
// Billing Event DTOs
// ============================================

export class BillingEventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subscriptionId!: string;

  @ApiProperty({ enum: BillingEventType })
  eventType!: BillingEventType;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  invoiceId?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt!: Date;
}

// ============================================
// Dashboard DTOs
// ============================================

export class MembershipDashboardDto {
  @ApiProperty()
  totalActiveSubscriptions!: number;

  @ApiProperty()
  totalRevenue!: number;

  @ApiProperty()
  revenueThisMonth!: number;

  @ApiProperty()
  newSubscriptionsThisMonth!: number;

  @ApiProperty()
  cancellationsThisMonth!: number;

  @ApiProperty()
  upcomingRenewals!: number;

  @ApiProperty()
  pastDueSubscriptions!: number;

  @ApiProperty()
  subscriptionsByTier!: Record<string, number>;

  @ApiProperty()
  revenueByTier!: Record<string, number>;
}

export class PatientMembershipDto {
  @ApiPropertyOptional({ type: SubscriptionResponseDto })
  activeSubscription?: SubscriptionResponseDto;

  @ApiProperty({ type: [SubscriptionSummaryDto] })
  subscriptionHistory!: SubscriptionSummaryDto[];

  @ApiProperty()
  totalSpent!: number;

  @ApiProperty()
  memberSince?: Date;
}
