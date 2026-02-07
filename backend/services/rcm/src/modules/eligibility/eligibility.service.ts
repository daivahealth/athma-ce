import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
    CheckEligibilityDto,
    EligibilityFilterDto,
    EligibilityStatus,
    EligibilityRequestType,
} from './dto/eligibility.dto';
import { MockEligibilityConnector } from './connectors/mock.connector';
import { EligibilityConnector } from './connectors/eligibility-connector.interface';

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
export class EligibilityService {
    private readonly logger = new Logger(EligibilityService.name);
    private readonly connectors: Map<string, EligibilityConnector> = new Map();
    private readonly clinicalApiUrl = process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

    constructor(
        private readonly prisma: PrismaService,
        private readonly mockConnector: MockEligibilityConnector,
        private readonly httpService: HttpService,
    ) {
        // Register available connectors
        this.registerConnector(mockConnector);
    }

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
     * Register an eligibility connector
     */
    registerConnector(connector: EligibilityConnector): void {
        this.connectors.set(connector.connectorId, connector);
        this.logger.log(`Registered eligibility connector: ${connector.connectorId}`);
    }

    /**
     * Check eligibility for a patient
     */
    async checkEligibility(tenantId: string, dto: CheckEligibilityDto, userId?: string) {
        // Get payer to determine connector
        const payer = await this.prisma.payer.findFirst({
            where: { id: dto.payerId, tenantId },
        });

        if (!payer) {
            throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
        }

        // Get policy if provided
        let policy = null;
        if (dto.policyId) {
            policy = await this.prisma.policy.findFirst({
                where: { id: dto.policyId, tenantId },
            });
        }

        // Create eligibility request record
        const request = await this.prisma.eligibilityRequest.create({
            data: {
                tenantId,
                patientId: dto.patientId,
                payerId: dto.payerId,
                policyId: dto.policyId ?? null,
                encounterId: dto.encounterId ?? null,
                requestType: dto.requestType ?? EligibilityRequestType.ELIGIBILITY,
                serviceTypes: dto.serviceTypes ?? [],
                serviceDate: dto.serviceDate ?? new Date(),
                status: EligibilityStatus.PENDING,
                createdBy: userId ?? null,
            },
        });

        // Get connector based on payer configuration
        const payerConfig = payer.configuration as Record<string, unknown> | null;
        const connectorId = (payerConfig?.eligibilityConnector as string) || 'MOCK';
        const connector = this.connectors.get(connectorId) || this.mockConnector;

        try {
            // Call connector
            const payload = {
                patientId: dto.patientId,
                payerId: dto.payerId,
                requestType: dto.requestType ?? EligibilityRequestType.ELIGIBILITY,
                serviceTypes: dto.serviceTypes ?? [],
            } as const;

            const eligibilityPayload: typeof payload & {
                policyId?: string;
                memberId?: string;
                serviceDate?: Date;
            } = { ...payload };

            if (dto.policyId) {
                eligibilityPayload.policyId = dto.policyId;
            }

            if (policy?.policyNumber) {
                eligibilityPayload.memberId = policy.policyNumber;
            }

            if (dto.serviceDate) {
                eligibilityPayload.serviceDate = dto.serviceDate;
            }

            const response = await connector.checkEligibility(eligibilityPayload);

            // Update request with response
            const updatedRequest = await this.prisma.eligibilityRequest.update({
                where: { id: request.id },
                data: {
                    status: response.success ? EligibilityStatus.ACCEPTED : EligibilityStatus.REJECTED,
                    isEligible: response.isEligible ?? null,
                    eligibilityStart: response.eligibilityStart ?? null,
                    eligibilityEnd: response.eligibilityEnd ?? null,
                    benefitsSummary: response.benefitsSummary as object ?? null,
                    responsePayload: response.rawResponse as object ?? null,
                    respondedAt: new Date(),
                    submittedAt: new Date(),
                    errorCode: response.errors?.[0]?.code ?? null,
                    errorMessage: response.errors?.[0]?.message ?? null,
                },
                include: { payer: true, policy: true },
            });

            return {
                requestId: updatedRequest.id,
                status: updatedRequest.status,
                isEligible: updatedRequest.isEligible,
                eligibilityStart: updatedRequest.eligibilityStart,
                eligibilityEnd: updatedRequest.eligibilityEnd,
                benefitsSummary: updatedRequest.benefitsSummary,
                errors: response.errors,
            };
        } catch (error) {
            // Update request with error
            await this.prisma.eligibilityRequest.update({
                where: { id: request.id },
                data: {
                    status: EligibilityStatus.ERROR,
                    errorCode: 'CONNECTOR_ERROR',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error',
                    respondedAt: new Date(),
                },
            });

            throw error;
        }
    }

    /**
     * List eligibility requests
     */
    async findAll(tenantId: string, filters?: EligibilityFilterDto, authHeader?: string, facilityId?: string, userId?: string) {
        const where: Record<string, unknown> = { tenantId };

        if (filters?.patientId) where.patientId = filters.patientId;
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

        const [requests, total] = await Promise.all([
            this.prisma.eligibilityRequest.findMany({
                where,
                include: { payer: true, policy: true },
                orderBy: { createdAt: 'desc' },
                take: filters?.limit ?? 50,
                skip: filters?.offset ?? 0,
            }),
            this.prisma.eligibilityRequest.count({ where }),
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
     * Get eligibility request by ID
     */
    async findById(tenantId: string, id: string, authHeader?: string, facilityId?: string, userId?: string) {
        const request = await this.prisma.eligibilityRequest.findFirst({
            where: { id, tenantId },
            include: { payer: true, policy: true },
        });

        if (!request) {
            throw new NotFoundException(`Eligibility request with ID ${id} not found`);
        }

        // Resolve patient display from Clinical API
        const patientDisplay = await this.fetchPatientDisplay(request.patientId, tenantId, authHeader, facilityId, userId);

        return {
            ...request,
            patientDisplay,
        };
    }
}
