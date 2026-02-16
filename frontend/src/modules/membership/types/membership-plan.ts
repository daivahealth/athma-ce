// Membership Plan Types

export type MembershipTier = 'basic' | 'standard' | 'premium' | 'platinum' | 'vip';
export type BillingCycle = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
export type BenefitType =
  | 'consultation'
  | 'assessment'
  | 'treatment'
  | 'lab_test'
  | 'screening'
  | 'discount'
  | 'program_access'
  | 'priority_booking'
  | 'device_sync'
  | 'dedicated_support';

export interface PlanBenefit {
  id: string;
  benefitType: BenefitType;
  name: string;
  description?: string;
  usageLimit?: number; // -1 for unlimited
  discountPercent?: number;
  applicableServiceCodes?: string[];
  metadata?: Record<string, unknown>;
}

export interface MembershipPlan {
  id: string;
  tenantId: string;
  planName: string;
  description?: string;
  tier: MembershipTier;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  setupFee?: number;
  benefits: PlanBenefit[];
  isActive: boolean;
  isPublic: boolean;
  maxMembers?: number;
  currentMembers?: number;
  availableFacilities?: string[];
  termsAndConditions?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipPlanInput {
  planName: string;
  description?: string;
  tier: MembershipTier;
  billingCycle: BillingCycle;
  price: number;
  currency?: string;
  setupFee?: number;
  benefits: Omit<PlanBenefit, 'id'>[];
  isPublic?: boolean;
  maxMembers?: number;
  availableFacilities?: string[];
  termsAndConditions?: string;
}

export interface UpdateMembershipPlanInput {
  planName?: string;
  description?: string;
  price?: number;
  benefits?: Omit<PlanBenefit, 'id'>[];
  isActive?: boolean;
  isPublic?: boolean;
  maxMembers?: number;
  availableFacilities?: string[];
  termsAndConditions?: string;
}

export interface PlanStatistics {
  planId: string;
  planName: string;
  subscriptionsByStatus: Record<string, number>;
  totalRevenue: number;
  recentEnrollments: number;
  recentCancellations: number;
  churnRate: number;
}

export interface PlanComparison {
  plans: Array<{
    id: string;
    planName: string;
    tier: MembershipTier;
    price: number;
    billingCycle: BillingCycle;
  }>;
  comparison: Record<string, Record<string, {
    included: boolean;
    name?: string;
    limit?: number;
    discount?: number;
  }>>;
}

export interface PlanFilters {
  tier?: MembershipTier;
  isActive?: boolean;
  isPublic?: boolean;
  facilityId?: string;
}
