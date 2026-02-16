export interface MembershipBenefit {
    name: string;
    description?: string;
    value?: string;
    included: boolean;
}

export interface MembershipPlan {
    id: string;
    tenantId: string;
    name: string;
    code: string;
    description?: string;
    tier: string;
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
    benefits: MembershipBenefit[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CreateMembershipPlanInput {
    name: string;
    code: string;
    description?: string;
    tier: string;
    monthlyPrice: number;
    yearlyPrice: number;
    currency?: string;
    benefits: MembershipBenefit[];
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    PENDING = 'pending',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export interface MembershipSubscription {
    id: string;
    tenantId: string;
    patientId: string;
    planId: string;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    startDate: string;
    endDate?: string;
    nextBillingDate?: string;
    autoRenew: boolean;
    metadata?: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;

    // Virtual/included fields
    plan?: MembershipPlan;
    patient?: {
        id: string;
        firstName: string;
        lastName: string;
        mrn: string;
    };
}

export interface CreateMembershipSubscriptionInput {
    patientId: string;
    planId: string;
    billingCycle: BillingCycle;
    startDate: Date;
    endDate?: Date;
    nextBillingDate?: Date;
    autoRenew?: boolean;
    metadata?: any;
}
