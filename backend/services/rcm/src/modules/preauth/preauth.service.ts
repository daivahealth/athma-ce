import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
    CreatePreAuthDto,
    UpdatePreAuthDto,
    PreAuthFilterDto,
    PreAuthStatus,
    PreAuthUrgency,
} from './dto/preauth.dto';

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
export class PreAuthService {
    private readonly logger = new Logger(PreAuthService.name);
    private readonly clinicalApiUrl = process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

    constructor(
        private readonly prisma: PrismaService,
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
     * Create a new pre-authorization request
     */
    async create(tenantId: string, dto: CreatePreAuthDto, userId?: string) {
        const internalRef = await this.generateInternalRef(tenantId);

        return this.prisma.preAuthRequest.create({
            data: {
                tenantId,
                internalRef,
                patientId: dto.patientId,
                payerId: dto.payerId,
                policyId: dto.policyId ?? null,
                encounterId: dto.encounterId ?? null,
                urgencyLevel: dto.urgency ?? PreAuthUrgency.ROUTINE,
                requestedServices: dto.requestedServices as object,
                clinicalNotes: dto.clinicalNotes ?? null,
                status: PreAuthStatus.DRAFT,
                createdBy: userId ?? null,
            },
            include: { payer: true, policy: true },
        });
    }

    /**
     * Submit pre-auth request to payer
     */
    async submit(tenantId: string, id: string) {
        const preauth = await this.findById(tenantId, id);

        if (preauth.status !== PreAuthStatus.DRAFT && preauth.status !== PreAuthStatus.PENDING) {
            throw new Error('Pre-auth request is not in a submittable state');
        }

        // In real implementation, this would call payer connector
        // For now, we just update status to pending
        return this.prisma.preAuthRequest.update({
            where: { id },
            data: {
                status: PreAuthStatus.SUBMITTED,
                submittedAt: new Date(),
            },
            include: { payer: true, policy: true },
        });
    }

    /**
     * List pre-auth requests
     */
    async findAll(tenantId: string, filters?: PreAuthFilterDto, authHeader?: string, facilityId?: string, userId?: string) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.patientId) where.patientId = filters.patientId;
        if (filters?.payerId) where.payerId = filters.payerId;
        if (filters?.encounterId) where.encounterId = filters.encounterId;
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

        const [requests, total] = await Promise.all([
            this.prisma.preAuthRequest.findMany({
                where,
                include: { payer: true, policy: true },
                orderBy: { createdAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.preAuthRequest.count({ where }),
        ]);

        // Resolve patient displays from Clinical API
        const patientIds = requests.map((r) => r.patientId);
        const displayMap = await this.fetchPatientDisplayMap(patientIds, tenantId, authHeader, facilityId, userId);

        return {
            requests: requests.map((request) => this.attachPatientDisplay(request, displayMap)),
            total,
        };
    }

    /**
     * Get pre-auth by ID
     */
    async findById(tenantId: string, id: string, authHeader?: string, facilityId?: string, userId?: string) {
        const request = await this.prisma.preAuthRequest.findFirst({
            where: { id, tenantId },
            include: { payer: true, policy: true },
        });

        if (!request) {
            throw new NotFoundException(`Pre-auth request with ID ${id} not found`);
        }

        // Resolve patient display from Clinical API
        const patientDisplay = await this.fetchPatientDisplay(request.patientId, tenantId, authHeader, facilityId, userId);

        return {
            ...request,
            patientDisplay,
        };
    }

    /**
     * Update pre-auth (for manual updates or receiving payer responses)
     */
    async update(tenantId: string, id: string, dto: UpdatePreAuthDto) {
        await this.findById(tenantId, id);

        const data: Record<string, unknown> = {};

        if (dto.status !== undefined) data.status = dto.status;
        if (dto.authorizationNumber !== undefined) data.authorizationNumber = dto.authorizationNumber;
        if (dto.approvedServices !== undefined) data.approvedServices = dto.approvedServices as object[];
        if (dto.denialReason !== undefined) data.denialReason = dto.denialReason;
        if (dto.validFrom !== undefined) data.validFrom = dto.validFrom;
        if (dto.validTo !== undefined) data.validTo = dto.validTo;

        if (dto.status === PreAuthStatus.APPROVED || dto.status === PreAuthStatus.DENIED) {
            data.decidedAt = new Date();
        }

        return this.prisma.preAuthRequest.update({
            where: { id },
            data,
            include: { payer: true, policy: true },
        });
    }

    /**
     * Cancel a pre-auth request
     */
    async cancel(tenantId: string, id: string) {
        await this.findById(tenantId, id);

        return this.prisma.preAuthRequest.update({
            where: { id },
            data: { status: PreAuthStatus.CANCELLED },
            include: { payer: true, policy: true },
        });
    }

    /**
     * Generate unique auth number
     */
    private async generateInternalRef(tenantId: string): Promise<string> {
        const date = new Date();
        const prefix = `PA${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

        const lastRequest = await this.prisma.preAuthRequest.findFirst({
            where: {
                tenantId,
                internalRef: { startsWith: prefix },
            },
            orderBy: { internalRef: 'desc' },
        });

        let sequence = 1;
        if (lastRequest && lastRequest.internalRef) {
            const lastSeq = parseInt(lastRequest.internalRef.slice(-6), 10);
            sequence = lastSeq + 1;
        }

        return `${prefix}${String(sequence).padStart(6, '0')}`;
    }
}
