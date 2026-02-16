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
        status: 'active',
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

    // Create subscription
    const subscription = await this.prisma.memberSubscription.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        planId: dto.planId,
        status: 'active',
        startDate,
        currentPeriodStart: startDate,
        currentPeriodEnd,
        nextBillingDate: currentPeriodEnd,
        price: plan.price,
        currency: plan.currency,
        autoRenew: true,
        enrolledBy: dto.enrolledBy || userId,
        notes: dto.notes,
        metadata: {
          promoCode: dto.promoCode,
          applySetupFee: dto.applySetupFee,
        },
      },
    });

    // Create billing event
    await this.createBillingEvent(subscription.id, BillingEventType.SUBSCRIPTION_CREATED, {
      planId: plan.id,
      planName: plan.planName,
      price: plan.price,
    });

    // Create initial invoice
    const invoiceAmount = plan.price + (dto.applySetupFee ? (plan.setupFee || 0) : 0);
    await this.createInvoice(tenantId, subscription.id, startDate, currentPeriodEnd, invoiceAmount);

    // Increment plan member count
    await this.prisma.membershipPlan.update({
      where: { id: plan.id },
      data: { currentMembers: { increment: 1 } },
    });

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
      where: { tenantId, patientId, status: 'active' },
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

    return this.prisma.memberSubscription.update({
      where: { id },
      data: dto,
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
      const dailyRate = subscription.price / totalDays;
      prorationAmount = Math.round(dailyRate * daysRemaining * 100) / 100;
    }

    // Update member counts
    await this.prisma.membershipPlan.update({
      where: { id: subscription.planId },
      data: { currentMembers: { decrement: 1 } },
    });

    await this.prisma.membershipPlan.update({
      where: { id: newPlan.id },
      data: { currentMembers: { increment: 1 } },
    });

    // Update subscription
    const newPeriodEnd = this.planService.getNextBillingDate(
      effectiveDate,
      newPlan.billingCycle as BillingCycle,
    );

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        planId: newPlan.id,
        price: newPlan.price,
        currentPeriodStart: effectiveDate,
        currentPeriodEnd: newPeriodEnd,
        nextBillingDate: newPeriodEnd,
        metadata: {
          ...(subscription.metadata as object || {}),
          previousPlanId: subscription.planId,
          planChangedAt: new Date().toISOString(),
          prorationAmount,
        },
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

    if (subscription.status !== 'active') {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'paused',
        metadata: {
          ...(subscription.metadata as object || {}),
          pausedAt: new Date().toISOString(),
          pausedPeriodRemaining: Math.ceil(
            (subscription.currentPeriodEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
          ),
        },
      },
    });

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_PAUSED);

    return updated;
  }

  async resume(tenantId: string, id: string) {
    const subscription = await this.findById(tenantId, id);

    if (subscription.status !== 'paused') {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    const metadata = subscription.metadata as any;
    const pausedDaysRemaining = metadata?.pausedPeriodRemaining || 0;
    const newPeriodEnd = new Date(
      Date.now() + pausedDaysRemaining * 24 * 60 * 60 * 1000,
    );

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'active',
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

    if (['cancelled', 'expired'].includes(subscription.status)) {
      throw new BadRequestException('Subscription is already cancelled or expired');
    }

    const endDate = dto.immediate ? new Date() : subscription.currentPeriodEnd;

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'cancelled',
        endDate,
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
        autoRenew: false,
      },
    });

    // Decrement plan member count
    await this.prisma.membershipPlan.update({
      where: { id: subscription.planId },
      data: { currentMembers: { decrement: 1 } },
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

    if (!['active', 'past_due'].includes(subscription.status)) {
      throw new BadRequestException('Subscription cannot be renewed in current state');
    }

    const renewalDate = dto?.renewalDate
      ? new Date(dto.renewalDate)
      : subscription.currentPeriodEnd;
    const newPeriodEnd = this.planService.getNextBillingDate(
      renewalDate,
      subscription.plan.billingCycle as BillingCycle,
    );
    const price = dto?.overridePrice ?? subscription.price;

    const updated = await this.prisma.memberSubscription.update({
      where: { id },
      data: {
        status: 'active',
        currentPeriodStart: renewalDate,
        currentPeriodEnd: newPeriodEnd,
        nextBillingDate: newPeriodEnd,
        price,
      },
    });

    // Create invoice for renewal
    await this.createInvoice(tenantId, id, renewalDate, newPeriodEnd, price);

    await this.createBillingEvent(id, BillingEventType.SUBSCRIPTION_RENEWED, {
      price,
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
      const limit = benefit.usageLimit;
      const remaining = limit === -1 ? -1 : Math.max(0, limit - used);

      balances.push({
        benefitId: benefit.id,
        benefitType: benefit.benefitType,
        benefitName: benefit.name,
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

    if (subscription.status !== 'active') {
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

    if (balance && balance.limit !== -1 && balance.remaining < (data.quantity || 1)) {
      throw new BadRequestException(
        `Benefit usage limit exceeded. Remaining: ${balance.remaining}`,
      );
    }

    const usage = await this.prisma.benefitUsage.create({
      data: {
        tenantId,
        subscriptionId,
        benefitId,
        benefitType: benefit.benefitType,
        serviceCode: data.serviceCode,
        encounterId: data.encounterId,
        quantity: data.quantity || 1,
        usedAt: new Date(),
        notes: data.notes,
      },
    });

    await this.createBillingEvent(subscriptionId, BillingEventType.BENEFIT_USED, {
      benefitId,
      benefitType: benefit.benefitType,
      quantity: data.quantity || 1,
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
    periodStart: Date,
    periodEnd: Date,
    amount: number,
  ) {
    const invoiceNumber = `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    return this.prisma.subscriptionInvoice.create({
      data: {
        tenantId,
        subscriptionId,
        invoiceNumber,
        periodStart,
        periodEnd,
        amount,
        currency: 'AED',
        status: 'pending',
        dueDate: periodStart,
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
      { invoiceId, amount: invoice.amount, paymentMethod },
    );

    return updated;
  }

  // ============================================
  // Helpers
  // ============================================

  private async createBillingEvent(
    subscriptionId: string,
    eventType: BillingEventType,
    metadata?: any,
  ) {
    const subscription = await this.prisma.memberSubscription.findUnique({
      where: { id: subscriptionId },
    });

    return this.prisma.subscriptionBillingEvent.create({
      data: {
        tenantId: subscription!.tenantId,
        subscriptionId,
        eventType,
        amount: metadata?.amount || metadata?.price,
        invoiceId: metadata?.invoiceId,
        metadata: metadata || {},
      },
    });
  }

  private isUpgrade(currentTier: string, newTier: string): boolean {
    const tierOrder = ['basic', 'standard', 'premium', 'platinum', 'vip'];
    return tierOrder.indexOf(newTier) > tierOrder.indexOf(currentTier);
  }
}
