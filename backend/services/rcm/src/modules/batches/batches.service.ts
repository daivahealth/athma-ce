import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
    CreateBatchDto,
    UpdateBatchDto,
    AddClaimsToBatchDto,
    BatchFilterDto,
    BatchStatus,
    BatchType,
} from './dto/batch.dto';
import { ClaimGeneratorFactory } from '../claims/generators/claim-generator.factory';
import { ClaimWithDetails } from '../claims/generators/claim-generator.interface';

@Injectable()
export class BatchesService {
    private readonly logger = new Logger(BatchesService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly generatorFactory: ClaimGeneratorFactory,
    ) { }

    /**
     * Create a new batch
     */
    async create(tenantId: string, dto: CreateBatchDto) {
        const batchNumber = await this.generateBatchNumber(tenantId);

        return this.prisma.claimBatch.create({
            data: {
                tenantId,
                batchNumber,
                batchType: dto.batchType ?? BatchType.PROFESSIONAL,
                claimFormat: dto.claimFormat,
                payerId: dto.payerId ?? null,
                status: BatchStatus.OPEN,
                claimCount: 0,
                totalAmount: 0,
            },
            include: {
                payer: true,
                _count: { select: { claims: true } },
            },
        });
    }

    /**
     * List batches with filters
     */
    async findAll(tenantId: string, filters?: BatchFilterDto) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.payerId) where.payerId = filters.payerId;
        if (filters?.status) where.status = filters.status;
        if (filters?.batchType) where.batchType = filters.batchType;
        if (filters?.dateFrom || filters?.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom) {
                (where.createdAt as Record<string, Date>).gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                (where.createdAt as Record<string, Date>).lte = filters.dateTo;
            }
        }

        const [batches, total] = await Promise.all([
            this.prisma.claimBatch.findMany({
                where,
                include: {
                    payer: true,
                    _count: { select: { claims: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.claimBatch.count({ where }),
        ]);

        return { batches, total };
    }

    /**
     * Get batch by ID with claims
     */
    async findById(tenantId: string, id: string) {
        const batch = await this.prisma.claimBatch.findFirst({
            where: { id, tenantId },
            include: {
                payer: true,
                claims: {
                    include: {
                        payer: true,
                        claimLines: true,
                        claimDiagnoses: true,
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!batch) {
            throw new NotFoundException(`Batch with ID ${id} not found`);
        }

        return batch;
    }

    /**
     * Add claims to batch
     */
    async addClaims(tenantId: string, batchId: string, dto: AddClaimsToBatchDto) {
        const batch = await this.findById(tenantId, batchId);

        if (batch.status !== BatchStatus.OPEN) {
            throw new BadRequestException('Cannot add claims to a closed or submitted batch');
        }

        // Update claims to point to this batch
        await this.prisma.claim.updateMany({
            where: {
                id: { in: dto.claimIds },
                tenantId,
                batchId: null, // Only unbatched claims
            },
            data: { batchId },
        });

        // Recalculate batch totals
        await this.recalculateBatchTotals(batchId);

        return this.findById(tenantId, batchId);
    }

    /**
     * Remove claims from batch
     */
    async removeClaims(tenantId: string, batchId: string, dto: AddClaimsToBatchDto) {
        const batch = await this.findById(tenantId, batchId);

        if (batch.status !== BatchStatus.OPEN) {
            throw new BadRequestException('Cannot remove claims from a closed or submitted batch');
        }

        await this.prisma.claim.updateMany({
            where: {
                id: { in: dto.claimIds },
                tenantId,
                batchId,
            },
            data: { batchId: null },
        });

        await this.recalculateBatchTotals(batchId);

        return this.findById(tenantId, batchId);
    }

    /**
     * Close batch (no more claims can be added)
     */
    async closeBatch(tenantId: string, id: string) {
        const batch = await this.findById(tenantId, id);

        if (batch.status !== BatchStatus.OPEN) {
            throw new BadRequestException('Batch is not in OPEN status');
        }

        if (batch.claims.length === 0) {
            throw new BadRequestException('Cannot close an empty batch');
        }

        return this.prisma.claimBatch.update({
            where: { id },
            data: { status: BatchStatus.CLOSED },
            include: { payer: true },
        });
    }

    /**
     * Generate batch submission file
     */
    async generateFile(tenantId: string, id: string) {
        const batch = await this.findById(tenantId, id);

        if (batch.status === BatchStatus.OPEN) {
            throw new BadRequestException('Batch must be closed before generating file');
        }

        const generator = this.generatorFactory.getGenerator(batch.claimFormat);

        // Validate all claims
        const validationResults = await Promise.all(
            batch.claims.map(async (claim) => ({
                claimId: claim.id,
                claimNumber: claim.claimNumber,
                validation: await generator.validate(claim as unknown as ClaimWithDetails),
            })),
        );

        const failedClaims = validationResults.filter((r) => !r.validation.isValid);
        if (failedClaims.length > 0) {
            return {
                success: false,
                error: 'Some claims failed validation',
                failedClaims,
            };
        }

        // Generate batch file if generator supports it
        let generatedFile;
        if (generator.generateBatch) {
            generatedFile = await generator.generateBatch(
                batch.claims as unknown as ClaimWithDetails[],
            );
        } else {
            // Fall back to generating individual files
            const files = await Promise.all(
                batch.claims.map((claim) =>
                    generator.generate(claim as unknown as ClaimWithDetails),
                ),
            );
            generatedFile = {
                format: generator.format,
                content: JSON.stringify(files.map((f) => JSON.parse(f.content as string))),
                filename: `batch_${batch.batchNumber}_${Date.now()}.json`,
                mimeType: 'application/json',
            };
        }

        // Update batch with generated file info
        await this.prisma.claimBatch.update({
            where: { id },
            data: {
                generatedFile: generatedFile.filename,
            },
        });

        return {
            success: true,
            generatedFile: {
                format: generatedFile.format,
                filename: generatedFile.filename,
                mimeType: generatedFile.mimeType,
            },
            validationResults,
        };
    }

    /**
     * Submit batch
     */
    async submitBatch(tenantId: string, id: string) {
        const batch = await this.findById(tenantId, id);

        if (batch.status !== BatchStatus.CLOSED) {
            throw new BadRequestException('Batch must be closed before submission');
        }

        // In a real implementation, this would send to clearinghouse/payer
        // For now, we just update the status
        return this.prisma.claimBatch.update({
            where: { id },
            data: {
                status: BatchStatus.SUBMITTED,
                submittedAt: new Date(),
                submissionRef: `SUB-${Date.now()}`,
            },
            include: { payer: true },
        });
    }

    /**
     * Recalculate batch totals
     */
    private async recalculateBatchTotals(batchId: string) {
        const claims = await this.prisma.claim.findMany({
            where: { batchId },
            select: { totalAmount: true },
        });

        const claimCount = claims.length;
        const totalAmount = claims.reduce((sum, c) => sum + Number(c.totalAmount), 0);

        await this.prisma.claimBatch.update({
            where: { id: batchId },
            data: { claimCount, totalAmount },
        });
    }

    /**
     * Generate unique batch number
     */
    private async generateBatchNumber(tenantId: string): Promise<string> {
        const date = new Date();
        const prefix = `BAT${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

        const lastBatch = await this.prisma.claimBatch.findFirst({
            where: {
                tenantId,
                batchNumber: { startsWith: prefix },
            },
            orderBy: { batchNumber: 'desc' },
        });

        let sequence = 1;
        if (lastBatch) {
            const lastSeq = parseInt(lastBatch.batchNumber.slice(-4), 10);
            sequence = lastSeq + 1;
        }

        return `${prefix}${String(sequence).padStart(4, '0')}`;
    }
}
