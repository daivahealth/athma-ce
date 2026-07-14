import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
    CreateDenialDto,
    CreateAppealDto,
    FileAppealDto,
    DenialFilterDto,
    DenialStatus,
    AppealStatus,
} from './dto/denial.dto';

@Injectable()
export class DenialsService {
    private readonly logger = new Logger(DenialsService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Record a denial against a claim
     */
    async create(tenantId: string, dto: CreateDenialDto, userId?: string) {
        // Ensure the claim exists in this tenant
        const claim = await this.prisma.claim.findFirst({
            where: { id: dto.claimId, tenantId },
        });
        if (!claim) {
            throw new NotFoundException(`Claim with ID ${dto.claimId} not found`);
        }

        return this.prisma.denial.create({
            data: {
                tenantId,
                claimId: dto.claimId,
                denialCode: dto.denialCode,
                denialReason: dto.denialReason,
                ...(dto.remarkCodes !== undefined ? { remarkCodes: dto.remarkCodes as object } : {}),
                deniedAmount: dto.deniedAmount,
                currency: dto.currency ?? claim.currency ?? 'AED',
                status: dto.status ?? DenialStatus.OPEN,
                deniedAt: dto.deniedAt ?? new Date(),
                appealDeadline: dto.appealDeadline ?? null,
                createdBy: userId ?? null,
            },
            include: { claim: true, appeals: true },
        });
    }

    /**
     * List denials with filters (claimId, encounterId, patientId, status)
     */
    async findAll(tenantId: string, filters?: DenialFilterDto) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.claimId) where.claimId = filters.claimId;
        if (filters?.status) where.status = filters.status;

        // encounterId / patientId live on the related claim
        const claimFilter: Record<string, unknown> = {};
        if (filters?.encounterId) claimFilter.encounterId = filters.encounterId;
        if (filters?.patientId) claimFilter.patientId = filters.patientId;
        if (Object.keys(claimFilter).length > 0) {
            where.claim = claimFilter;
        }

        const [denials, total] = await Promise.all([
            this.prisma.denial.findMany({
                where,
                include: {
                    claim: true,
                    appeals: { orderBy: { createdAt: 'desc' } },
                },
                orderBy: { deniedAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.denial.count({ where }),
        ]);

        return { denials, total };
    }

    /**
     * Get denial by ID with its appeals
     */
    async findById(tenantId: string, id: string) {
        const denial = await this.prisma.denial.findFirst({
            where: { id, tenantId },
            include: {
                claim: true,
                appeals: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!denial) {
            throw new NotFoundException(`Denial with ID ${id} not found`);
        }

        return denial;
    }

    /**
     * Draft an appeal against a denial
     */
    async draftAppeal(tenantId: string, denialId: string, dto: CreateAppealDto, userId?: string) {
        const denial = await this.findById(tenantId, denialId);

        if (denial.status === DenialStatus.UPHELD || denial.status === DenialStatus.OVERTURNED) {
            throw new BadRequestException(
                `Denial ${denialId} is already resolved (${denial.status}) and cannot be appealed`,
            );
        }

        const appeal = await this.prisma.appeal.create({
            data: {
                tenantId,
                denialId,
                status: AppealStatus.DRAFT,
                narrative: dto.narrative,
                justification: dto.justification ?? null,
                supportingRefs: (dto.supportingRefs ?? []) as object,
                createdBy: userId ?? null,
            },
        });

        // Move the denial into the appealing state
        await this.prisma.denial.update({
            where: { id: denialId },
            data: { status: DenialStatus.APPEALING },
        });

        this.logger.log(`Drafted appeal ${appeal.id} for denial ${denialId}`);

        return appeal;
    }

    /**
     * File a drafted appeal with the payer
     */
    async fileAppeal(tenantId: string, appealId: string, dto?: FileAppealDto) {
        const appeal = await this.prisma.appeal.findFirst({
            where: { id: appealId, tenantId },
            include: { denial: true },
        });

        if (!appeal) {
            throw new NotFoundException(`Appeal with ID ${appealId} not found`);
        }

        if (appeal.status !== AppealStatus.DRAFT) {
            throw new BadRequestException(
                `Appeal ${appealId} is not in a fileable state (current status: ${appeal.status})`,
            );
        }

        const data: Record<string, unknown> = {
            status: AppealStatus.FILED,
            filedAt: new Date(),
        };
        if (dto?.narrative !== undefined) data.narrative = dto.narrative;
        if (dto?.justification !== undefined) data.justification = dto.justification;
        if (dto?.supportingRefs !== undefined) data.supportingRefs = dto.supportingRefs as object;

        const filed = await this.prisma.appeal.update({
            where: { id: appealId },
            data,
            include: { denial: true },
        });

        this.logger.log(`Filed appeal ${appealId} for denial ${appeal.denialId}`);

        return filed;
    }
}
