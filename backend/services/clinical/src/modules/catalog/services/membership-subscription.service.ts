import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateMembershipSubscriptionDto, UpdateMembershipSubscriptionDto, SubscriptionStatus } from '../dto/membership-subscription.dto';

@Injectable()
export class MembershipSubscriptionService {
    private readonly logger = new Logger(MembershipSubscriptionService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new membership subscription
     */
    async create(tenantId: string, createdBy: string, dto: CreateMembershipSubscriptionDto) {
        // Enforce only one active subscription per patient for now
        const activeSub = await this.prisma.membershipSubscription.findFirst({
            where: {
                tenantId,
                patientId: dto.patientId,
                status: SubscriptionStatus.ACTIVE,
                isActive: true,
            },
        });

        if (activeSub) {
            throw new BadRequestException('Patient already has an active subscription');
        }

        // Verify plan exists
        const plan = await this.prisma.membershipPlan.findFirst({
            where: { id: dto.planId, tenantId },
        });

        if (!plan) {
            throw new NotFoundException(`Membership plan with ID ${dto.planId} not found`);
        }

        return this.prisma.membershipSubscription.create({
            data: {
                ...dto,
                tenantId,
                createdBy,
                status: SubscriptionStatus.ACTIVE,
                isActive: true,
            },
            include: {
                plan: true,
                patient: true,
            },
        });
    }

    /**
     * Find all subscriptions for a tenant
     */
    async findAll(tenantId: string, patientId?: string, status?: string) {
        const where: any = { tenantId };
        if (patientId) where.patientId = patientId;
        if (status) where.status = status;

        return this.prisma.membershipSubscription.findMany({
            where,
            include: {
                plan: true,
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mrn: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get subscription by ID
     */
    async findOne(tenantId: string, id: string) {
        const subscription = await this.prisma.membershipSubscription.findFirst({
            where: { id, tenantId },
            include: {
                plan: true,
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mrn: true,
                    },
                },
            },
        });

        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }

        return subscription;
    }

    /**
     * Update subscription
     */
    async update(tenantId: string, id: string, dto: UpdateMembershipSubscriptionDto) {
        await this.findOne(tenantId, id);

        return this.prisma.membershipSubscription.update({
            where: { id },
            data: {
                ...dto,
            },
            include: {
                plan: true,
                patient: true,
            },
        });
    }

    /**
     * Cancel subscription
     */
    async cancel(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.membershipSubscription.update({
            where: { id },
            data: {
                status: SubscriptionStatus.CANCELLED,
                autoRenew: false,
            },
        });
    }

    /**
     * Delete subscription (hard delete)
     */
    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        await this.prisma.membershipSubscription.delete({
            where: { id },
        });
        return { success: true };
    }
}
