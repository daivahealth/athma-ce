// Subscription Types

import type { MembershipTier, BenefitType } from './membership-plan';

export type SubscriptionStatus = 'pending' | 'active' | 'paused' | 'past_due' | 'cancelled' | 'expired';

export type BillingEventType =
  | 'subscription_created'
  | 'payment_received'
  | 'payment_failed'
  | 'subscription_renewed'
  | 'subscription_upgraded'
  | 'subscription_downgraded'
  | 'subscription_paused'
  | 'subscription_resumed'
  | 'subscription_cancelled'
  | 'subscription_expired'
  | 'benefit_used'
  | 'refund_issued';

export interface BenefitBalance {
  benefitId: string;
  benefitType: BenefitType;
  benefitName: string;
  limit: number; // -1 means unlimited
  used: number;
  remaining: number;
  cycleStart: string;
  cycleEnd: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  patientId: string;
  planId: string;
  planName: string;
  tier: MembershipTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  price: number;
  currency: string;
  autoRenew: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  benefitBalances: BenefitBalance[];
  enrolledBy?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionSummary {
  id: string;
  patientId: string;
  patientName?: string;
  planName: string;
  tier: MembershipTier;
  status: SubscriptionStatus;
  nextBillingDate: string;
  price: number;
}

export interface CreateSubscriptionInput {
  patientId: string;
  planId: string;
  startDate?: string;
  applySetupFee?: boolean;
  promoCode?: string;
  notes?: string;
  enrolledBy?: string;
}

export interface UpdateSubscriptionInput {
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  notes?: string;
}

export interface ChangePlanInput {
  newPlanId: string;
  effectiveDate?: string;
  prorate?: boolean;
}

export interface CancelSubscriptionInput {
  reason?: string;
  immediate?: boolean;
  requestRefund?: boolean;
}

export interface RenewSubscriptionInput {
  renewalDate?: string;
  overridePrice?: number;
}

export interface RecordBenefitUsageInput {
  subscriptionId: string;
  benefitId: string;
  serviceCode?: string;
  encounterId?: string;
  quantity?: number;
  notes?: string;
}

export interface BenefitUsage {
  id: string;
  subscriptionId: string;
  benefitId: string;
  benefitType: BenefitType;
  benefitName?: string;
  serviceCode?: string;
  encounterId?: string;
  quantity: number;
  usedAt: string;
  notes?: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paidAt?: string;
  paymentMethod?: string;
  dueDate: string;
  createdAt: string;
}

export interface BillingEvent {
  id: string;
  subscriptionId: string;
  eventType: BillingEventType;
  amount?: number;
  invoiceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MembershipDashboard {
  totalActiveSubscriptions: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth?: number;
  revenueGrowth?: number;
  newSubscriptionsThisMonth: number;
  cancellationsThisMonth: number;
  upcomingRenewals: number;
  pastDueSubscriptions: number;
  subscriptionsByTier: Record<string, number>;
  revenueByTier: Record<string, number>;
}

export interface PatientMembership {
  activeSubscription?: Subscription;
  subscriptionHistory: SubscriptionSummary[];
  totalSpent: number;
  memberSince?: string;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus;
  planId?: string;
  limit?: number;
  offset?: number;
}

export interface UpcomingRenewal {
  subscriptionId: string;
  patientId: string;
  planName: string;
  renewalDate: string;
  amount: number;
}
