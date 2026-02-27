import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { MembershipPlanService } from './membership-plan.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ChangePlanDto,
  CancelSubscriptionDto,
  RenewSubscriptionDto,
  SubscriptionStatus,
  BillingEventType,
  BenefitBalanceDto,
} from '../dto/subscription.dto';
import { BillingCycle } from '../dto/membership-plan.dto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: MembershipPlanService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateSubscriptionDto) {
    // Check for existing active subscription
    const existingActive = await this.prisma.memberSubscription.findFirst({
      where: {
        tenantId,
        patientId: dto.patientId,
        status: 'ACTIVE',
      },
    });

    if (existingActive) {
      throw new BadRequestException('Patient already has an active subscription');
    }

    // Get plan details
    const plan = await this.planService.findById(tenantId, dto.planId);

    if (!plan.isActive) {
      throw new BadRequestException('This membership plan is no longer available');
    }

    // Check max members
    if (plan.maxMembers && plan.currentMembers >= plan.maxMembers) {
      throw new BadRequestException('This membership plan has reached its maximum capacity');
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const currentPeriodEnd = this.planService.getNextBillingDate(
      startDate,
      plan.billingCycle as BillingCycle,
    );

    // Generate subscription number
    const subscriptionNumber = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create subscription
    const subscription = await this.prisma.memberSubscription.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        planId: dto.planId,
        subscriptionNumber,
        billingCycle: plan.billingCycle,
        status: 'ACTIVE',
        startDate,
        currentPeriodStart: startDate,
        currentPeriodEnd,
        nextBillingDate: currentPeriodEnd,
        recurringAmount: plan.basePrice,
        currency: plan.currency,
        enrollmentFeeCharged: dto.applySetupFee ? plan.enrollmentFee : 0,
        autoRenew: true,
        notes: dto.notes ?? null,
        createdBy: dto.enrolledBy || userId,
      },
    });

    // Create billing event
    await this.createBillingEvent(subscription.id, BillingEventType.SUBSCRIPTION_CREATED, {
      planId: plan.id,
      planName: plan.planName,
      price: plan.basePrice,
    });

    // Create initial invoice
    const invoiceAmount = Number(plan.basePrice) + (dto.applySetupFee ? Number(plan.enrollmentFee || 0) : 0);
    await this.createInvoice(tenantId, subscription.id, dto.patientId, startDate, currentPeriodEnd, invoiceAmount);

    return this.findById(tenantId, subscription.id);
  }

  async findById(tenantId: string, id: string) {
    const subscription = await this.prisma.memberSubscription.findFirst({
      where: { id, tenantId },
      include: {
        plan: {
          include: { benefits: true },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription ${id} not found`);
    }

    // Get benefit balances
    const benefitBalances = await this.getBenefitBalances(subscription);

    return {
      ...subscription,
      planName: subscription.plan.planName,
      tier: subscription.plan.tier,
      benefitBalances,
    };
  }

  async findByPatient(tenantId: string, patientId: string) {
    const subscriptions = await this.prisma.memberSubscription.findMany({
      where: { tenantId, patientId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((s) => ({
      ...s,
      planName: s.plan.planName,
      tier: s.plan.tier,
    }));
  }

  async findActiveByPatient(tenantId: string, patientId: string) {
    const subscription = await this.prisma.memberSubscription.findFirst({
      where: { tenantId, patientId, status: 'ACTIVE' },
      include: {
        plan: {
          include: { benefits: true },
        },
      },
    });

    if (!subscription) return null;

    const benefitBalances = await this.getBenefitBalances(subscription);

    return {
      ...subscription,
      planName: subscription.plan.planName,
      tier: subscription.plan.tier,
      benefitBalances,
    };
  }

  async findAll(
    tenantId: string,
    options?: {
      status?: SubscriptionStatus;
      planId?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { tenantId };
    if (options?.status) where.status = options.status;
    if (options?.planId) where.planId = options.planId;

    const [subscriptions, total] = await Promise.all([
      this.prisma.memberSubscription.findMany({
        where,
        include: { plan: true },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.memberSubscription.count({ where }),
    ]);

    return {
      data: subscriptions.map((s) => ({
        ...s,
        planName: s.plan.planName,
        tier: s.plan.tier,
      })),
      total,
      limit: options?.limit || 50,
      offset: options?.offset || 0,
    };
  }

  async update(tenantId: string, id: string, dto: UpdateSubscriptionDto) {
    await this.findById(tenantId, id);

    const updateData: any = {};
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.autoRenew !== undefined) updateData.autoRenew = dto.autoRenew;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    return this.prisma.memberSubscription.update({
      where: { id },
      data: updateData,
    });
  }

  async changePlan(tenantId: string, id: string, dto: ChangePlanDto) {
    const subscription = await this.findById(tenantId, id);
    const newPlan = await this.planService.findById(tenantId, dto.newPlanId);

    if (!newPlan.isActive) {
      throw new BadRequestException('Target plan is not active');
    }

    const effectiveDate = dto.effectiveDate
      ? new Date(dto.effectiveDate)
      : subscription.currentPeriodEnd;

    const isUpgrade = this.isUpgrade(subscription.plan.tier, newPlan.tier);
    const eventType = isUpgrade
      ? BillingEventType.SUBSCRIPTION_UPGRADED
      : BillingEventType.SUBSCRIPTION_DOWNGRADED;

    // Calculate proration if needed
    let prorationAmount = 0;
    if (dto.prorate && new Date() < effectiveDate) {
      const daysRemaining = Math.ceil(
        (effectiveDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
      );
      const totalDays = this.planService.getBillingCycleDays(
        subscription.plan.billingCycle as BillingCycle,
      );
      const dailyRate = Number(subscription.recurringAmount) / totalDays;
      prorationAmount = Math.round(dailyRate * daysRemaining * 100) / 100;
    }

    // Update subscription
    const newPeriodEnd = this.planService.getNextBillingDate(
      effectiveDate,
      newPlan.billingCycle as BillingCycle,
    );

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        planId: newPlan.id,
        billingCycle: newPlan.billingCycle,
        recurringAmount: newPlan.basePrice,
        currentPeriodStart: effectiveDate,
        currentPeriodEnd: newPeriodEnd,
        nextBillingDate: newPeriodEnd,
      },
    });

    await this.createBillingEvent(id, eventType, {
      previousPlanId: subscription.planId,
      newPlanId: newPlan.id,
      prorationAmount,
    });

    return this.findById(tenantId, id);
  }

  async pause(tenantId: string, id: string) {
    const subscription = await this.findById(tenantId, id);

    if (subscription.status !== 'ACTIVE') {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    // Store the remaining days by adjusting the period end date to reflect when paused
    // When resumed, we'll calculate remaining days from currentPeriodEnd
    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'PAUSED',
      },
    });

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_PAUSED, {
      pausedAt: new Date().toISOString(),
      pausedPeriodRemaining: Math.ceil(
        (subscription.currentPeriodEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
      ),
    });

    return updated;
  }

  async resume(tenantId: string, id: string) {
    const subscription = await this.findById(tenantId, id);

    if (subscription.status !== 'PAUSED') {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    // Calculate remaining days from the stored period end
    const pausedDaysRemaining = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
    );
    const newPeriodEnd = new Date(
      Date.now() + Math.max(0, pausedDaysRemaining) * 24 * 60 * 60 * 1000,
    );

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: newPeriodEnd,
        nextBillingDate: newPeriodEnd,
      },
    });

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_RESUMED);

    return updated;
  }

  async cancel(tenantId: string, id: string, dto: CancelSubscriptionDto) {
    const subscription = await this.findById(tenantId, id);

    if (['CANCELLED', 'EXPIRED'].includes(subscription.status)) {
      throw new BadRequestException('Subscription is already cancelled or expired');
    }

    const endDate = dto.immediate ? new Date() : subscription.currentPeriodEnd;

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        endDate,
        cancelledAt: new Date(),
        cancellationReason: dto.reason ?? null,
        autoRenew: false,
      },
    });

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_CANCELLED, {
      reason: dto.reason,
      immediate: dto.immediate,
      requestRefund: dto.requestRefund,
    });

    return updated;
  }

  async renew(tenantId: string, id: string, dto?: RenewSubscriptionDto) {
    const subscription = await this.findById(tenantId, id);

    if (!['ACTIVE', 'PAST_DUE'].includes(subscription.status)) {
      throw new BadRequestException('Subscription cannot be renewed in current state');
    }

    const renewalDate = dto?.renewalDate
      ? new Date(dto.renewalDate)
      : subscription.currentPeriodEnd;
    const newPeriodEnd = this.planService.getNextBillingDate(
      renewalDate,
      subscription.plan.billingCycle as BillingCycle,
    );
    const amount = dto?.overridePrice ?? Number(subscription.recurringAmount);

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: renewalDate,
        currentPeriodEnd: newPeriodEnd,
        nextBillingDate: newPeriodEnd,
        recurringAmount: amount,
      },
    });

    // Create invoice for renewal
    await this.createInvoice(tenantId, id, subscription.patientId, renewalDate, newPeriodEnd, amount);

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_RENEWED, {
      amount,
      periodStart: renewalDate,
      periodEnd: newPeriodEnd,
    });

    return updated;
  }

  // ============================================
  // Benefit Usage
  // ============================================

  async getBenefitBalances(subscription: any): Promise<BenefitBalanceDto[]> {
    const benefits = subscription.plan.benefits;
    const balances: BenefitBalanceDto[] = [];

    for (const benefit of benefits) {
      const usageCount = await this.prisma.benefitUsage.aggregate({
        where: {
          subscriptionId: subscription.id,
          benefitId: benefit.id,
          usedAt: {
            gte: subscription.currentPeriodStart,
            lte: subscription.currentPeriodEnd,
          },
        },
        _sum: { quantity: true },
      });

      const used = usageCount._sum.quantity || 0;
      const limit = benefit.quantityIncluded ?? -1; // null means unlimited
      const remaining = limit === -1 ? -1 : Math.max(0, limit - used);

      balances.push({
        benefitId: benefit.id,
        benefitType: benefit.benefitType,
        benefitName: benefit.benefitName,
        limit,
        used,
        remaining,
        cycleStart: subscription.currentPeriodStart,
        cycleEnd: subscription.currentPeriodEnd,
      });
    }

    return balances;
  }

  async recordBenefitUsage(
    tenantId: string,
    subscriptionId: string,
    benefitId: string,
    data: {
      serviceCode?: string;
      encounterId?: string;
      quantity?: number;
      notes?: string;
    },
  ) {
    const subscription = await this.findById(tenantId, subscriptionId);

    if (subscription.status !== 'ACTIVE') {
      throw new BadRequestException('Subscription is not active');
    }

    // Verify benefit exists and belongs to the plan
    const benefit = subscription.plan.benefits.find((b: any) => b.id === benefitId);
    if (!benefit) {
      throw new BadRequestException('Benefit not found in subscription plan');
    }

    // Check usage limit
    const balances = await this.getBenefitBalances(subscription);
    const balance = balances.find((b) => b.benefitId === benefitId);
    const currentUsed = balance?.used || 0;

    if (balance && balance.limit !== -1 && balance.remaining < (data.quantity || 1)) {
      throw new BadRequestException(
        `Benefit usage limit exceeded. Remaining: ${balance.remaining}`,
      );
    }

    const quantity = data.quantity || 1;

    const usage = await this.prisma.benefitUsage.create({
      data: {
        tenantId,
        subscriptionId,
        benefitId,
        encounterId: data.encounterId ?? null,
        quantity,
        usedAt: new Date(),
        notes: data.notes ?? null,
        billingPeriodStart: subscription.currentPeriodStart,
        billingPeriodEnd: subscription.currentPeriodEnd,
        usedQuantityBefore: currentUsed,
        usedQuantityAfter: currentUsed + quantity,
        remainingQuantity: balance?.limit === -1 ? null : (balance?.remaining || 0) - quantity,
        createdBy: subscription.createdBy,
      },
    });

    await this.createBillingEvent(subscriptionId, BillingEventType.BENEFIT_USED, {
      benefitId,
      benefitType: benefit.benefitType,
      quantity,
    });

    return usage;
  }

  async getBenefitUsageHistory(
    tenantId: string,
    subscriptionId: string,
    options?: { benefitId?: string; limit?: number },
  ) {
    await this.findById(tenantId, subscriptionId);

    const where: any = { tenantId, subscriptionId };
    if (options?.benefitId) where.benefitId = options.benefitId;

    return this.prisma.benefitUsage.findMany({
      where,
      orderBy: { usedAt: 'desc' },
      take: options?.limit || 50,
    });
  }

  // ============================================
  // Invoices
  // ============================================

  async createInvoice(
    tenantId: string,
    subscriptionId: string,
    patientId: string,
    periodStart: Date,
    periodEnd: Date,
    amount: number,
    createdBy?: string,
  ) {
    const invoiceNumber = `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Get subscription for createdBy fallback
    const subscription = await this.prisma.memberSubscription.findUnique({
      where: { id: subscriptionId },
    });

    return this.prisma.subscriptionInvoice.create({
      data: {
        tenantId,
        subscriptionId,
        patientId,
        invoiceNumber,
        periodStart,
        periodEnd,
        subtotal: amount,
        totalAmount: amount,
        balanceDue: amount,
        currency: 'AED',
        status: 'pending',
        dueDate: periodStart,
        createdBy: createdBy || subscription?.createdBy || 'system',
      },
    });
  }

  async getInvoices(tenantId: string, subscriptionId: string) {
    await this.findById(tenantId, subscriptionId);

    return this.prisma.subscriptionInvoice.findMany({
      where: { tenantId, subscriptionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markInvoicePaid(tenantId: string, invoiceId: string, paymentMethod: string) {
    const invoice = await this.prisma.subscriptionInvoice.findFirst({
      where: { id: invoiceId, tenantId },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice ${invoiceId} not found`);
    }

    const updated = await this.prisma.subscriptionInvoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        paymentMethod,
      },
    });

    await this.createBillingEvent(
      invoice.subscriptionId,
      BillingEventType.PAYMENT_RECEIVED,
      { invoiceId, amount: invoice.totalAmount, paymentMethod },
    );

    return updated;
  }

  // ============================================
  // Helpers
  // ============================================

  private async createBillingEvent(
    subscriptionId: string,
    eventType: BillingEventType,
    eventData?: any,
  ) {
    const subscription = await this.prisma.memberSubscription.findUnique({
      where: { id: subscriptionId },
    });

    return this.prisma.subscriptionBillingEvent.create({
      data: {
        tenantId: subscription!.tenantId,
        subscriptionId,
        eventType,
        amount: eventData?.amount || eventData?.price,
        invoiceId: eventData?.invoiceId,
        eventData: eventData || {},
      },
    });
  }

  private isUpgrade(currentTier: string, newTier: string): boolean {
    const tierOrder = ['BASIC', 'STANDARD', 'PREMIUM', 'PLATINUM', 'VIP'];
    return tierOrder.indexOf(newTier) > tierOrder.indexOf(currentTier);
  }
}
