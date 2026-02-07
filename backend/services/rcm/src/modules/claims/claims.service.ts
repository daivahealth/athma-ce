import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
    CreateClaimDto,
    UpdateClaimDto,
    GenerateClaimsDto,
    ClaimFilterDto,
    ClaimStatus,
} from './dto/claim.dto';
import { ClaimGeneratorFactory } from './generators/claim-generator.factory';
import { ClaimWithDetails } from './generators/claim-generator.interface';

export interface PatientDisplayDto {
    patientId: string;
    mrn: string;
    firstName: string;
    lastName: string;
    displayName: string;
    age: number;
    dateOfBirth: string;
    gender: string;
    nationalId?: string;
    nationalIdType?: string;
    phoneNumber?: string;
    email?: string;
    nationality?: string;
    preferredLanguage?: string;
}

@Injectable()
export class ClaimsService {
    private readonly logger = new Logger(ClaimsService.name);
    private readonly clinicalApiUrl = process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

    constructor(
        private readonly prisma: PrismaService,
        private readonly generatorFactory: ClaimGeneratorFactory,
        private readonly httpService: HttpService,
    ) { }

    // ---------------------------------------------------------------------------
    // Patient display helpers
    // ---------------------------------------------------------------------------

    private calculateAge(dateOfBirth: Date | string): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    private buildPatientDisplay(patient: any): PatientDisplayDto {
        return {
            patientId: patient.id,
            mrn: patient.mrn,
            firstName: patient.firstName,
            lastName: patient.lastName,
            displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
            age: this.calculateAge(patient.dateOfBirth),
            dateOfBirth: typeof patient.dateOfBirth === 'string'
                ? patient.dateOfBirth.split('T')[0]
                : new Date(patient.dateOfBirth).toISOString().split('T')[0],
            gender: patient.gender,
            nationalId: patient.nationalId || undefined,
            nationalIdType: patient.nationalIdType || undefined,
            phoneNumber: patient.phoneNumber || undefined,
            email: patient.email || undefined,
            nationality: patient.nationality || undefined,
            preferredLanguage: patient.preferredLanguage || undefined,
        };
    }

    private async fetchPatientDisplay(
        patientId: string,
        tenantId: string,
        authHeader?: string,
        facilityId?: string,
        userId?: string,
    ): Promise<PatientDisplayDto | null> {
        try {
            const headers: Record<string, string> = { 'x-tenant-id': tenantId };
            if (authHeader) {
                headers['authorization'] = authHeader;
            }
            if (facilityId) {
                headers['x-facility-id'] = facilityId;
            }
            if (userId) {
                headers['x-user-id'] = userId;
            }
            const response = await firstValueFrom(
                this.httpService.get(`${this.clinicalApiUrl}/patients/${patientId}`, { headers }),
            );
            return response?.data ? this.buildPatientDisplay(response.data) : null;
        } catch (error) {
            this.logger.warn(`Failed to fetch patient ${patientId} from Clinical API: ${(error as Error).message}`);
            return null;
        }
    }

    private async fetchPatientDisplayMap(
        patientIds: string[],
        tenantId: string,
        authHeader?: string,
        facilityId?: string,
        userId?: string,
    ): Promise<Map<string, PatientDisplayDto>> {
        const unique = [...new Set(patientIds)];
        const results = await Promise.all(
            unique.map((id) => this.fetchPatientDisplay(id, tenantId, authHeader, facilityId, userId)),
        );
        const map = new Map<string, PatientDisplayDto>();
        unique.forEach((id, index) => {
            if (results[index]) {
                map.set(id, results[index]!);
            }
        });
        return map;
    }

    private attachPatientDisplay(record: any, displayMap: Map<string, PatientDisplayDto>) {
        return {
            ...record,
            patientDisplay: displayMap.get(record.patientId) ?? null,
        };
    }

    /**
     * Create a new claim manually
     */
    async create(tenantId: string, dto: CreateClaimDto) {
        const claimNumber = await this.generateClaimNumber(tenantId);

        return this.prisma.claim.create({
            data: {
                tenantId,
                claimNumber,
                patientId: dto.patientId,
                encounterId: dto.encounterId ?? null,
                payerId: dto.payerId ?? null,
                serviceDate: dto.serviceDate,
                currency: dto.currency ?? 'AED',
                status: ClaimStatus.DRAFT,
                totalAmount: 0,
            },
            include: {
                payer: true,
                claimLines: true,
                claimDiagnoses: true,
            },
        });
    }

    /**
     * Generate claims from encounters/charges
     */
    async generateClaims(tenantId: string, dto: GenerateClaimsDto) {
        const generatedClaims: string[] = [];

        // Find encounters with unbilled charges
        const whereClause: Record<string, unknown> = {
            tenantId,
            status: 'unbilled',
        };

        if (dto.encounterIds && dto.encounterIds.length > 0) {
            whereClause.encounterId = { in: dto.encounterIds };
        }
        if (dto.patientId) {
            whereClause.patientId = dto.patientId;
        }
        if (dto.dateFrom || dto.dateTo) {
            whereClause.chargeDate = {};
            if (dto.dateFrom) {
                (whereClause.chargeDate as Record<string, Date>).gte = dto.dateFrom;
            }
            if (dto.dateTo) {
                (whereClause.chargeDate as Record<string, Date>).lte = dto.dateTo;
            }
        }

        // Group charges by encounter
        const charges = await this.prisma.charge.findMany({
            where: whereClause,
            include: { billingItem: true },
            orderBy: { chargeDate: 'asc' },
        });

        // Group by encounter
        const chargesByEncounter = new Map<string, typeof charges>();
        for (const charge of charges) {
            const key = charge.encounterId || `patient_${charge.patientId}`;
            if (!chargesByEncounter.has(key)) {
                chargesByEncounter.set(key, []);
            }
            chargesByEncounter.get(key)!.push(charge);
        }

        // Create a claim for each group
        for (const [key, encounterCharges] of chargesByEncounter) {
            if (encounterCharges.length === 0) continue;

            const firstCharge = encounterCharges[0];
            const claimNumber = await this.generateClaimNumber(tenantId);
            const totalAmount = encounterCharges.reduce(
                (sum, c) => sum + Number(c.grossAmount),
                0,
            );

            const claim = await this.prisma.claim.create({
                data: {
                    tenantId,
                    claimNumber,
                    patientId: firstCharge!.patientId,
                    encounterId: firstCharge!.encounterId,
                    payerId: dto.payerId ?? null,
                    serviceDate: firstCharge!.chargeDate,
                    currency: 'AED',
                    status: ClaimStatus.PENDING,
                    totalAmount,
                },
            });

            // Create claim lines from charges
            let lineNumber = 1;
            for (const charge of encounterCharges) {
                await this.prisma.claimLine.create({
                    data: {
                        claimId: claim.id,
                        chargeId: charge.id,
                        lineNumber: lineNumber++,
                        procedureCode: charge.billingItem.billingCode,
                        procedureCodeType: charge.billingItem.billingCodeType,
                        procedureDescription: charge.billingItem.billingDescription,
                        serviceDate: charge.chargeDate,
                        units: charge.quantity,
                        chargedAmount: charge.grossAmount,
                    },
                });

                // Update charge status
                await this.prisma.charge.update({
                    where: { id: charge.id },
                    data: { status: 'invoiced' },
                });
            }

            generatedClaims.push(claim.id);
            this.logger.log(`Generated claim ${claimNumber} for ${key}`);
        }

        return {
            generatedCount: generatedClaims.length,
            claimIds: generatedClaims,
        };
    }

    /**
     * List claims with filters
     */
    async findAll(tenantId: string, filters?: ClaimFilterDto, authHeader?: string, facilityId?: string, userId?: string) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.patientId) where.patientId = filters.patientId;
        if (filters?.encounterId) where.encounterId = filters.encounterId;
        if (filters?.payerId) where.payerId = filters.payerId;
        if (filters?.status) where.status = filters.status;
        if (filters?.batchId) where.batchId = filters.batchId;
        if (filters?.dateFrom || filters?.dateTo) {
            where.serviceDate = {};
            if (filters.dateFrom) {
                (where.serviceDate as Record<string, Date>).gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                (where.serviceDate as Record<string, Date>).lte = filters.dateTo;
            }
        }

        const [claims, total] = await Promise.all([
            this.prisma.claim.findMany({
                where,
                include: {
                    payer: true,
                    batch: true,
                    _count: {
                        select: {
                            claimLines: true,
                            claimDiagnoses: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.claim.count({ where }),
        ]);

        // Resolve patient displays from Clinical API
        const patientIds = claims.map((c) => c.patientId);
        const displayMap = await this.fetchPatientDisplayMap(patientIds, tenantId, authHeader, facilityId, userId);

        return {
            claims: claims.map((claim) => this.attachPatientDisplay(claim, displayMap)),
            total,
        };
    }

    /**
     * Get claim by ID with full details
     */
    async findById(tenantId: string, id: string, authHeader?: string, facilityId?: string, userId?: string): Promise<ClaimWithDetails & { patientDisplay: PatientDisplayDto | null }> {
        const claim = await this.prisma.claim.findFirst({
            where: { id, tenantId },
            include: {
                payer: true,
                batch: true,
                claimLines: {
                    orderBy: { lineNumber: 'asc' },
                },
                claimDiagnoses: {
                    orderBy: { sequence: 'asc' },
                },
            },
        });

        if (!claim) {
            throw new NotFoundException(`Claim with ID ${id} not found`);
        }

        // Resolve patient display from Clinical API
        const patientDisplay = await this.fetchPatientDisplay(claim.patientId, tenantId, authHeader, facilityId, userId);

        return {
            ...(claim as ClaimWithDetails),
            patientDisplay,
        };
    }

    /**
     * Update claim
     */
    async update(tenantId: string, id: string, dto: UpdateClaimDto) {
        await this.findById(tenantId, id);

        const data: Record<string, unknown> = {};
        if (dto.status !== undefined) data.status = dto.status;
        if (dto.payerId !== undefined) data.payerId = dto.payerId;
        if (dto.totalAmount !== undefined) data.totalAmount = dto.totalAmount;
        if (dto.currency !== undefined) data.currency = dto.currency;

        return this.prisma.claim.update({
            where: { id },
            data,
            include: {
                payer: true,
                claimLines: true,
                claimDiagnoses: true,
            },
        });
    }

    /**
     * Validate claim using appropriate generator
     */
    async validateClaim(tenantId: string, id: string) {
        const claim = await this.findById(tenantId, id);
        const payerConfig = claim.payer?.configuration as Record<string, unknown> | null;
        const generator = this.generatorFactory.getGeneratorForPayer(payerConfig);

        return generator.validate(claim);
    }

    /**
     * Submit claim - generate file and update status
     */
    async submitClaim(tenantId: string, id: string) {
        const claim = await this.findById(tenantId, id);
        const payerConfig = claim.payer?.configuration as Record<string, unknown> | null;
        const generator = this.generatorFactory.getGeneratorForPayer(payerConfig);

        // Validate first
        const validation = await generator.validate(claim);
        if (!validation.isValid) {
            await this.prisma.claim.update({
                where: { id },
                data: { status: ClaimStatus.FAILED_VALIDATION },
            });
            return {
                success: false,
                claimId: id,
                validation,
                error: 'Claim failed validation',
            };
        }

        // Generate claim file
        const generatedFile = await generator.generate(claim);

        // Update claim status
        await this.prisma.claim.update({
            where: { id },
            data: {
                status: ClaimStatus.SUBMITTED,
                submittedAt: new Date(),
            },
        });

        return {
            success: true,
            claimId: id,
            submittedAt: new Date(),
            generatedFile: {
                format: generatedFile.format,
                filename: generatedFile.filename,
                mimeType: generatedFile.mimeType,
            },
            validation,
        };
    }

    /**
     * Cancel/void a claim
     */
    async cancel(tenantId: string, id: string) {
        await this.findById(tenantId, id);

        return this.prisma.claim.update({
            where: { id },
            data: { status: ClaimStatus.CANCELLED },
            include: {
                payer: true,
                claimLines: true,
            },
        });
    }

    /**
     * Get claim statistics
     */
    async getStatistics(tenantId: string) {
        const [total, byStatus, amounts] = await Promise.all([
            this.prisma.claim.count({ where: { tenantId } }),
            this.prisma.claim.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: true,
                _sum: { totalAmount: true },
            }),
            this.prisma.claim.aggregate({
                where: { tenantId },
                _sum: { totalAmount: true },
            }),
        ]);

        return {
            total,
            totalAmount: Number(amounts._sum.totalAmount) || 0,
            byStatus: byStatus.reduce(
                (acc, item) => {
                    acc[item.status] = {
                        count: item._count,
                        amount: Number(item._sum.totalAmount) || 0,
                    };
                    return acc;
                },
                {} as Record<string, { count: number; amount: number }>,
            ),
        };
    }

    /**
     * List available claim formats
     */
    listFormats() {
        return this.generatorFactory.listAvailableFormats();
    }

    /**
     * Generate unique claim number
     */
    private async generateClaimNumber(tenantId: string): Promise<string> {
        const date = new Date();
        const prefix = `CLM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

        const lastClaim = await this.prisma.claim.findFirst({
            where: {
                tenantId,
                claimNumber: { startsWith: prefix },
            },
            orderBy: { claimNumber: 'desc' },
        });

        let sequence = 1;
        if (lastClaim) {
            const lastSeq = parseInt(lastClaim.claimNumber.slice(-6), 10);
            sequence = lastSeq + 1;
        }

        return `${prefix}${String(sequence).padStart(6, '0')}`;
    }
}
