import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { SubscriptionService } from './subscription.service';
import { MembershipPlanService } from './membership-plan.service';
import { SubscriptionStatus, BillingEventType } from '../dto/subscription.dto';
import { BillingCycle } from '../dto/membership-plan.dto';

export interface BillingRunResult {
  processed: number;
  renewed: number;
  failed: number;
  expired: number;
  errors: Array<{ subscriptionId: string; error: string }>;
}

@Injectable()
export class RecurringBillingService {
  private readonly logger = new Logger(RecurringBillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: MembershipPlanService,
  ) {}

  /**
   * Process all subscriptions due for billing
   * Should be called by a scheduled job (e.g., daily)
   */
  async processRecurringBilling(tenantId?: string): Promise<BillingRunResult> {
    const result: BillingRunResult = {
      processed: 0,
      renewed: 0,
      failed: 0,
      expired: 0,
      errors: [],
    };

    const where: any = {
      status: 'ACTIVE',
      autoRenew: true,
      nextBillingDate: { lte: new Date() },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const subscriptions = await this.prisma.memberSubscription.findMany({
      where,
      include: { plan: true },
    });

    this.logger.log(`Processing ${subscriptions.length} subscriptions for billing`);
    result.processed = subscriptions.length;

    for (const subscription of subscriptions) {
      try {
        // In a real implementation, this would integrate with a payment gateway
        // For now, we assume payment is successful and create the invoice

        const newPeriodStart = subscription.currentPeriodEnd;
        const newPeriodEnd = this.planService.getNextBillingDate(
          newPeriodStart,
          subscription.plan.billingCycle as BillingCycle,
        );

        const amount = Number(subscription.recurringAmount);

        // Create invoice
        await this.subscriptionService.createInvoice(
          subscription.tenantId,
          subscription.id,
          subscription.patientId,
          newPeriodStart,
          newPeriodEnd,
          amount,
        );

        // Update subscription periods
        await this.prisma.memberSubscription.update({
          where: { id: subscription.id },
          data: {
            currentPeriodStart: newPeriodStart,
            currentPeriodEnd: newPeriodEnd,
            nextBillingDate: newPeriodEnd,
          },
        });

        // Create billing event
        await this.prisma.subscriptionBillingEvent.create({
          data: {
            tenantId: subscription.tenantId,
            subscriptionId: subscription.id,
            eventType: 'SUBSCRIPTION_RENEWED',
            eventData: {
              amount,
              periodStart: newPeriodStart,
              periodEnd: newPeriodEnd,
              automated: true,
            },
          },
        });

        result.renewed++;
        this.logger.log(`Renewed subscription ${subscription.id}`);
      } catch (error: any) {
        result.failed++;
        result.errors.push({
          subscriptionId: subscription.id,
          error: error.message,
        });
        this.logger.error(`Failed to renew subscription ${subscription.id}`, error);

        // Mark subscription as past_due after billing failure
        await this.prisma.memberSubscription.update({
          where: { id: subscription.id },
          data: { status: 'PAST_DUE' },
        });

        await this.prisma.subscriptionBillingEvent.create({
          data: {
            tenantId: subscription.tenantId,
            subscriptionId: subscription.id,
            eventType: 'PAYMENT_FAILED',
            eventData: { error: error.message },
          },
        });
      }
    }

    return result;
  }

  /**
   * Process expired subscriptions (cancelled but end date has passed)
   */
  async processExpiredSubscriptions(tenantId?: string): Promise<number> {
    const where: any = {
      status: 'CANCELLED',
      endDate: { lte: new Date() },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const expired = await this.prisma.memberSubscription.updateMany({
      where,
      data: { status: 'EXPIRED' },
    });

    // Create billing events for each expired subscription
    const expiredSubs = await this.prisma.memberSubscription.findMany({
      where: {
        ...where,
        status: 'EXPIRED',
        updatedAt: { gte: new Date(Date.now() - 60 * 1000) }, // Updated in last minute
      },
    });

    for (const sub of expiredSubs) {
      await this.prisma.subscriptionBillingEvent.create({
        data: {
          tenantId: sub.tenantId,
          subscriptionId: sub.id,
          eventType: 'SUBSCRIPTION_EXPIRED',
          eventData: { expiredAt: new Date().toISOString() },
        },
      });
    }

    this.logger.log(`Marked ${expired.count} subscriptions as expired`);
    return expired.count;
  }

  /**
   * Process past due subscriptions (grace period handling)
   */
  async processPastDueSubscriptions(
    tenantId?: string,
    gracePeriodDays = 7,
  ): Promise<number> {
    const gracePeriodEnd = new Date(
      Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000,
    );

    const where: any = {
      status: 'PAST_DUE',
      updatedAt: { lte: gracePeriodEnd },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    // Cancel subscriptions that have been past due beyond grace period
    const cancelled = await this.prisma.memberSubscription.updateMany({
      where,
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: 'Payment failure - grace period expired',
        autoRenew: false,
      },
    });

    // Create billing events for cancelled subscriptions
    const cancelledSubs = await this.prisma.memberSubscription.findMany({
      where: {
        ...where,
        status: 'CANCELLED',
        cancelledAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    for (const sub of cancelledSubs) {
      await this.prisma.subscriptionBillingEvent.create({
        data: {
          tenantId: sub.tenantId,
          subscriptionId: sub.id,
          eventType: 'SUBSCRIPTION_CANCELLED',
          eventData: {
            reason: 'Payment failure - grace period expired',
            automated: true,
          },
        },
      });
    }

    this.logger.log(`Cancelled ${cancelled.count} past due subscriptions`);
    return cancelled.count;
  }

  /**
   * Get upcoming renewals for notification purposes
   */
  async getUpcomingRenewals(
    tenantId: string,
    daysAhead = 7,
  ): Promise<Array<{
    subscriptionId: string;
    patientId: string;
    planName: string;
    renewalDate: Date | null;
    amount: number;
  }>> {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    const subscriptions = await this.prisma.memberSubscription.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        autoRenew: true,
        nextBillingDate: { lte: futureDate, gte: new Date() },
      },
      include: { plan: true },
    });

    return subscriptions.map((s) => ({
      subscriptionId: s.id,
      patientId: s.patientId,
      planName: s.plan.planName,
      renewalDate: s.nextBillingDate,
      amount: Number(s.recurringAmount),
    }));
  }

  /**
   * Get billing dashboard statistics
   */
  async getBillingDashboard(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalActive,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      newSubscriptions,
      cancellations,
      upcomingRenewals,
      pastDue,
      subscriptionsByTier,
    ] = await Promise.all([
      // Total active subscriptions
      this.prisma.memberSubscription.count({
        where: { tenantId, status: 'ACTIVE' },
      }),

      // Total lifetime revenue
      this.prisma.subscriptionInvoice.aggregate({
        where: { tenantId, status: 'paid' },
        _sum: { totalAmount: true },
      }),

      // Revenue this month
      this.prisma.subscriptionInvoice.aggregate({
        where: {
          tenantId,
          status: 'paid',
          paidAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),

      // Revenue last month
      this.prisma.subscriptionInvoice.aggregate({
        where: {
          tenantId,
          status: 'paid',
          paidAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),

      // New subscriptions this month
      this.prisma.memberSubscription.count({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Cancellations this month
      this.prisma.memberSubscription.count({
        where: {
          tenantId,
          status: 'CANCELLED',
          cancelledAt: { gte: startOfMonth },
        },
      }),

      // Upcoming renewals (next 7 days)
      this.prisma.memberSubscription.count({
        where: {
          tenantId,
          status: 'ACTIVE',
          autoRenew: true,
          nextBillingDate: {
            gte: now,
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Past due subscriptions
      this.prisma.memberSubscription.count({
        where: { tenantId, status: 'PAST_DUE' },
      }),

      // Subscriptions by tier
      this.prisma.memberSubscription.groupBy({
        by: ['planId'],
        where: { tenantId, status: 'ACTIVE' },
        _count: true,
      }),
    ]);

    // Get plan names for tier breakdown
    const planIds = subscriptionsByTier.map((s) => s.planId);
    const plans = await this.prisma.membershipPlan.findMany({
      where: { id: { in: planIds } },
      select: { id: true, tier: true, basePrice: true },
    });

    const planMap = new Map(plans.map((p) => [p.id, p]));
    const byTier: Record<string, number> = {};
    const revenueByTier: Record<string, number> = {};

    for (const sub of subscriptionsByTier) {
      const plan = planMap.get(sub.planId);
      if (plan) {
        byTier[plan.tier] = (byTier[plan.tier] || 0) + sub._count;
        revenueByTier[plan.tier] = (revenueByTier[plan.tier] || 0) + Number(plan.basePrice) * sub._count;
      }
    }

    const totalRevenueAmount = totalRevenue._sum?.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0;
    const thisMonthAmount = revenueThisMonth._sum?.totalAmount ? Number(revenueThisMonth._sum.totalAmount) : 0;
    const lastMonthAmount = revenueLastMonth._sum?.totalAmount ? Number(revenueLastMonth._sum.totalAmount) : 0;

    return {
      totalActiveSubscriptions: totalActive,
      totalRevenue: totalRevenueAmount,
      revenueThisMonth: thisMonthAmount,
      revenueLastMonth: lastMonthAmount,
      revenueGrowth:
        lastMonthAmount > 0
          ? Math.round((thisMonthAmount / lastMonthAmount - 1) * 100)
          : 0,
      newSubscriptionsThisMonth: newSubscriptions,
      cancellationsThisMonth: cancellations,
      upcomingRenewals,
      pastDueSubscriptions: pastDue,
      subscriptionsByTier: byTier,
      revenueByTier,
    };
  }
}
