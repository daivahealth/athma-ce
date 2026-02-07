import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
    CreateRemittanceDto,
    RemittanceLineDto,
    RemittanceFilterDto,
    RemittanceStatus,
    ReconciliationResultDto,
} from './dto/remittance.dto';

@Injectable()
export class RemittanceService {
    private readonly logger = new Logger(RemittanceService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create/upload a remittance
     */
    async create(tenantId: string, dto: CreateRemittanceDto, lines?: RemittanceLineDto[]) {
        const remittanceNumber = await this.generateRemittanceNumber(tenantId);

        const remittance = await this.prisma.remittance.create({
            data: {
                tenantId,
                remittanceNumber,
                payerId: dto.payerId,
                paymentDate: dto.checkDate ?? new Date(),
                totalPaid: dto.paymentAmount,
                paymentMethod: dto.format,
                paymentRef: dto.checkNumber ?? null,
                sourceFile: dto.fileContent ?? null,
                status: RemittanceStatus.RECEIVED,
            },
            include: { payer: true },
        });

        // Create remittance lines if provided
        if (lines && lines.length > 0) {
            let lineNumber = 1;
            for (const line of lines) {
                await this.prisma.remittanceLine.create({
                    data: {
                        remittanceId: remittance.id,
                        claimId: line.claimId ?? null,
                        claimNumber: line.claimNumber,
                        lineNumber: lineNumber++,
                        chargedAmount: line.billedAmount,
                        allowedAmount: line.allowedAmount ?? 0,
                        paidAmount: line.paidAmount,
                        patientResponsibility: line.patientResponsibility ?? 0,
                        adjustmentCodes: line.adjustmentCodes as object ?? null,
                        remarkCodes: line.remarkCodes ?? [],
                    },
                });
            }
        }

        return this.findById(tenantId, remittance.id);
    }

    /**
     * List remittances
     */
    async findAll(tenantId: string, filters?: RemittanceFilterDto) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.payerId) where.payerId = filters.payerId;
        if (filters?.status) where.status = filters.status;
        if (filters?.dateFrom || filters?.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom) {
                (where.createdAt as Record<string, Date>).gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                (where.createdAt as Record<string, Date>).lte = filters.dateTo;
            }
        }

        const [remittances, total] = await Promise.all([
            this.prisma.remittance.findMany({
                where,
                include: {
                    payer: true,
                    _count: { select: { lines: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.remittance.count({ where }),
        ]);

        return { remittances, total };
    }

    /**
     * Get remittance by ID with lines
     */
    async findById(tenantId: string, id: string) {
        const remittance = await this.prisma.remittance.findFirst({
            where: { id, tenantId },
            include: {
                payer: true,
                lines: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!remittance) {
            throw new NotFoundException(`Remittance with ID ${id} not found`);
        }

        return remittance;
    }

    /**
     * Reconcile remittance with claims
     */
    async reconcile(tenantId: string, id: string): Promise<ReconciliationResultDto> {
        const remittance = await this.findById(tenantId, id);

        if (remittance.status === RemittanceStatus.RECONCILED) {
            throw new Error('Remittance is already reconciled');
        }

        const matchedClaims: ReconciliationResultDto['matchedClaims'] = [];
        const unmatchedLines: { claimNumber: string; reason: string }[] = [];
        let totalPaid = 0;
        let totalAdjusted = 0;

        for (const line of remittance.lines) {
            // Try to find matching claim by claim number
            const claim = await this.prisma.claim.findFirst({
                where: {
                    tenantId,
                    claimNumber: line.claimNumber,
                },
            });

            if (claim) {
                // Update claim with payment info
                await this.prisma.claim.update({
                    where: { id: claim.id },
                    data: {
                        status: Number(line.paidAmount) > 0 ? 'paid' : 'denied',
                        adjudicatedAt: new Date(),
                    },
                });

                // Link line to claim
                await this.prisma.remittanceLine.update({
                    where: { id: line.id },
                    data: { claimId: claim.id },
                });

                matchedClaims.push({
                    claimId: claim.id,
                    claimNumber: claim.claimNumber,
                    paidAmount: Number(line.paidAmount),
                });

                totalPaid += Number(line.paidAmount);
                totalAdjusted += Number(line.chargedAmount) - Number(line.paidAmount);
            } else {
                unmatchedLines.push({
                    claimNumber: line.claimNumber,
                    reason: 'Claim number not found',
                });
            }
        }

        // Update remittance status
        await this.prisma.remittance.update({
            where: { id },
            data: {
                status: RemittanceStatus.RECONCILED,
                processedAt: new Date(),
            },
        });

        return {
            remittanceId: id,
            matchedLines: matchedClaims.length,
            unmatchedLines: unmatchedLines.length,
            totalPaid,
            totalAdjusted,
            matchedClaims,
            unmatchedLines_details: unmatchedLines,
        };
    }

    /**
     * Generate unique remittance number
     */
    private async generateRemittanceNumber(tenantId: string): Promise<string> {
        const date = new Date();
        const prefix = `REM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

        const lastRemittance = await this.prisma.remittance.findFirst({
            where: {
                tenantId,
                remittanceNumber: { startsWith: prefix },
            },
            orderBy: { remittanceNumber: 'desc' },
        });

        let sequence = 1;
        if (lastRemittance) {
            const lastSeq = parseInt(lastRemittance.remittanceNumber.slice(-6), 10);
            sequence = lastSeq + 1;
        }

        return `${prefix}${String(sequence).padStart(6, '0')}`;
    }
}
