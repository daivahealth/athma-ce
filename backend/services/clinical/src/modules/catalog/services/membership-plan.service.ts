import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from '../dto/membership-plan.dto';

@Injectable()
export class MembershipPlanService {
    private readonly logger = new Logger(MembershipPlanService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new membership plan
     */
    async create(tenantId: string, createdBy: string, dto: CreateMembershipPlanDto) {
        // Check if code already exists for this tenant
        const existing = await this.prisma.membershipPlan.findFirst({
            where: {
                tenantId,
                code: dto.code,
            },
        });

        if (existing) {
            throw new BadRequestException(`Membership plan with code ${dto.code} already exists`);
        }

        return this.prisma.membershipPlan.create({
            data: {
                ...dto,
                tenantId,
                createdBy,
                benefits: dto.benefits as any,
            },
        });
    }

    /**
     * Find all membership plans for a tenant
     */
    async findAll(tenantId: string, isActive?: boolean) {
        const where: any = { tenantId };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return this.prisma.membershipPlan.findMany({
            where,
            orderBy: { monthlyPrice: 'asc' },
        });
    }

    /**
     * Get membership plan by ID
     */
    async findOne(tenantId: string, id: string) {
        const plan = await this.prisma.membershipPlan.findFirst({
            where: { id, tenantId },
        });

        if (!plan) {
            throw new NotFoundException(`Membership plan with ID ${id} not found`);
        }

        return plan;
    }

    /**
     * Update membership plan
     */
    async update(tenantId: string, id: string, dto: UpdateMembershipPlanDto) {
        await this.findOne(tenantId, id);

        // Check code uniqueness if changing
        if (dto.code) {
            const existing = await this.prisma.membershipPlan.findFirst({
                where: {
                    tenantId,
                    code: dto.code,
                    id: { not: id },
                },
            });

            if (existing) {
                throw new BadRequestException(`Membership plan with code ${dto.code} already exists`);
            }
        }

        return this.prisma.membershipPlan.update({
            where: { id },
            data: {
                ...dto,
                benefits: dto.benefits ? (dto.benefits as any) : undefined,
            },
        });
    }

    /**
     * Toggle plan status
     */
    async toggleStatus(tenantId: string, id: string) {
        const plan = await this.findOne(tenantId, id);
        return this.prisma.membershipPlan.update({
            where: { id },
            data: { isActive: !plan.isActive },
        });
    }

    /**
     * Delete membership plan
     */
    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        await this.prisma.membershipPlan.delete({
            where: { id },
        });
        return { success: true };
    }
}
