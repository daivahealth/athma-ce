import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService, Prisma } from '@zeal/database-rcm';
import {
  CreateMembershipPlanDto,
  UpdateMembershipPlanDto,
  MembershipTier,
  BillingCycle,
} from '../dto/membership-plan.dto';

@Injectable()
export class MembershipPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateMembershipPlanDto) {
    // Check if plan name already exists
    const existing = await this.prisma.membershipPlan.findFirst({
      where: { tenantId, planName: dto.planName },
    });

    if (existing) {
      throw new BadRequestException(`Plan with name "${dto.planName}" already exists`);
    }

    // Generate planCode from planName if not provided
    const planCode = dto.planName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    // Create plan with benefits
    const plan = await this.prisma.membershipPlan.create({
      data: {
        tenantId,
        planCode,
        planName: dto.planName,
        description: dto.description ?? null,
        tier: dto.tier,
        billingCycle: dto.billingCycle,
        basePrice: dto.price,
        currency: dto.currency || 'AED',
        enrollmentFee: dto.setupFee || 0,
        isActive: true,
        isPublic: dto.isPublic ?? true,
        maxMembers: dto.maxMembers ?? null,
        availableFacilities: dto.availableFacilities || [],
        termsAndConditions: dto.termsAndConditions ?? null,
        metadata: dto.metadata || {},
        createdBy: userId,
        benefits: {
          create: dto.benefits.map((benefit) => ({
            tenantId,
            benefitType: benefit.benefitType,
            benefitName: benefit.name,
            description: benefit.description ?? null,
            quantityIncluded: benefit.usageLimit === -1 ? null : (benefit.usageLimit ?? null),
            discountPercent: benefit.discountPercent ?? null,
            applicableTo: benefit.applicableServiceCodes
              ? { services: benefit.applicableServiceCodes }
              : Prisma.JsonNull,
            metadata: benefit.metadata || {},
          })),
        },
      },
      include: {
        benefits: true,
      },
    });

    return plan;
  }

  async findById(tenantId: string, id: string) {
    const plan = await this.prisma.membershipPlan.findFirst({
      where: { id, tenantId },
      include: {
        benefits: true,
        _count: {
          select: { subscriptions: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(`Membership plan with ID ${id} not found`);
    }

    return {
      ...plan,
      currentMembers: plan._count.subscriptions,
    };
  }

  async findAll(
    tenantId: string,
    options?: {
      tier?: MembershipTier;
      isActive?: boolean;
      isPublic?: boolean;
      facilityId?: string;
    },
  ) {
    const where: any = { tenantId };

    if (options?.tier) where.tier = options.tier;
    if (options?.isActive !== undefined) where.isActive = options.isActive;
    if (options?.isPublic !== undefined) where.isPublic = options.isPublic;
    if (options?.facilityId) {
      where.OR = [
        { availableFacilities: { isEmpty: true } },
        { availableFacilities: { has: options.facilityId } },
      ];
    }

    const plans = await this.prisma.membershipPlan.findMany({
      where,
      include: {
        benefits: true,
        _count: {
          select: { subscriptions: { where: { status: 'ACTIVE' } } },
        },
      },
      orderBy: [{ tier: 'asc' }, { basePrice: 'asc' }],
    });

    return plans.map((plan) => ({
      ...plan,
      currentMembers: plan._count.subscriptions,
    }));
  }

  async findPublicPlans(tenantId: string, facilityId?: string) {
    const options: { isActive: boolean; isPublic: boolean; facilityId?: string } = {
      isActive: true,
      isPublic: true,
    };
    if (facilityId) {
      options.facilityId = facilityId;
    }
    return this.findAll(tenantId, options);
  }

  async update(tenantId: string, id: string, dto: UpdateMembershipPlanDto) {
    await this.findById(tenantId, id);

    // If updating benefits, we need to handle this separately
    if (dto.benefits) {
      // Delete existing benefits
      await this.prisma.planBenefit.deleteMany({
        where: { planId: id },
      });

      // Create new benefits
      await this.prisma.planBenefit.createMany({
        data: dto.benefits.map((benefit) => ({
          tenantId,
          planId: id,
          benefitType: benefit.benefitType,
          benefitName: benefit.name,
          description: benefit.description ?? null,
          quantityIncluded: benefit.usageLimit === -1 ? null : (benefit.usageLimit ?? null),
          discountPercent: benefit.discountPercent ?? null,
          applicableTo: benefit.applicableServiceCodes
            ? { services: benefit.applicableServiceCodes }
            : Prisma.JsonNull,
          metadata: benefit.metadata || {},
        })),
      });
    }

    const { benefits: _, ...updateData } = dto;

    return this.prisma.membershipPlan.update({
      where: { id },
      data: updateData,
      include: {
        benefits: true,
      },
    });
  }

  async deactivate(tenantId: string, id: string) {
    const plan = await this.findById(tenantId, id);

    // Check if there are active subscriptions
    const activeSubscriptions = await this.prisma.memberSubscription.count({
      where: { planId: id, status: 'ACTIVE' },
    });

    if (activeSubscriptions > 0) {
      throw new BadRequestException(
        `Cannot deactivate plan with ${activeSubscriptions} active subscriptions. Cancel or migrate subscriptions first.`,
      );
    }

    return this.prisma.membershipPlan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async reactivate(tenantId: string, id: string) {
    await this.findById(tenantId, id);

    return this.prisma.membershipPlan.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async comparePlans(tenantId: string, planIds: string[]) {
    const plans = await this.prisma.membershipPlan.findMany({
      where: { id: { in: planIds }, tenantId },
      include: { benefits: true },
      orderBy: { tier: 'asc' },
    });

    // Build comparison matrix
    const allBenefitTypes = new Set<string>();
    for (const plan of plans) {
      for (const benefit of plan.benefits) {
        allBenefitTypes.add(benefit.benefitType);
      }
    }

    const comparison: Record<string, Record<string, any>> = {};
    for (const benefitType of allBenefitTypes) {
      comparison[benefitType] = {};
      for (const plan of plans) {
        const benefit = plan.benefits.find((b) => b.benefitType === benefitType);
        comparison[benefitType][plan.id] = benefit
          ? {
              included: true,
              name: benefit.benefitName,
              limit: benefit.quantityIncluded,
              discount: benefit.discountPercent,
            }
          : { included: false };
      }
    }

    return {
      plans: plans.map((p) => ({
        id: p.id,
        planName: p.planName,
        tier: p.tier,
        price: p.basePrice,
        billingCycle: p.billingCycle,
      })),
      comparison,
    };
  }

  async getPlanStatistics(tenantId: string, planId: string) {
    const plan = await this.findById(tenantId, planId);

    const subscriptions = await this.prisma.memberSubscription.groupBy({
      by: ['status'],
      where: { planId, tenantId },
      _count: true,
    });

    const revenue = await this.prisma.subscriptionInvoice.aggregate({
      where: {
        subscription: { planId, tenantId },
        status: 'paid',
      },
      _sum: { totalAmount: true },
    });

    const recentEnrollments = await this.prisma.memberSubscription.count({
      where: {
        planId,
        tenantId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    const recentCancellations = await this.prisma.memberSubscription.count({
      where: {
        planId,
        tenantId,
        status: 'CANCELLED',
        cancelledAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      planId,
      planName: plan.planName,
      subscriptionsByStatus: Object.fromEntries(
        subscriptions.map((s) => [s.status, s._count]),
      ),
      totalRevenue: revenue._sum?.totalAmount ? Number(revenue._sum.totalAmount) : 0,
      recentEnrollments,
      recentCancellations,
      churnRate:
        recentEnrollments > 0
          ? Math.round((recentCancellations / recentEnrollments) * 100)
          : 0,
    };
  }

  getBillingCycleDays(cycle: BillingCycle): number {
    switch (cycle) {
      case BillingCycle.MONTHLY:
        return 30;
      case BillingCycle.QUARTERLY:
        return 90;
      case BillingCycle.SEMI_ANNUAL:
        return 180;
      case BillingCycle.ANNUAL:
        return 365;
      default:
        return 30;
    }
  }

  getNextBillingDate(startDate: Date, cycle: BillingCycle): Date {
    const days = this.getBillingCycleDays(cycle);
    return new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
}
