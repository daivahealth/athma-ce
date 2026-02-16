import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
    CreateLongevityProtocolDto,
    CreateLongevityTreatmentDto,
    LongevityTreatmentStatus,
} from '../dto/longevity.dto';

@Injectable()
export class LongevityService {
    constructor(private readonly prisma: PrismaService) { }

    // ============================================
    // Protocol Methods
    // ============================================

    async createProtocol(tenantId: string, userId: string, dto: CreateLongevityProtocolDto) {
        return this.prisma.longevityProtocol.create({
            data: {
                tenantId,
                ...dto,
                createdBy: userId,
            },
        });
    }

    async findAllProtocols(tenantId: string, options?: { protocolType?: string; isActive?: boolean }) {
        const where: any = { tenantId };
        if (options?.protocolType) where.protocolType = options.protocolType;
        if (options?.isActive !== undefined) where.isActive = options.isActive;

        return this.prisma.longevityProtocol.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }

    async findProtocolById(tenantId: string, id: string) {
        const protocol = await this.prisma.longevityProtocol.findFirst({
            where: { id, tenantId },
        });
        if (!protocol) {
            throw new NotFoundException(`Longevity protocol with ID ${id} not found`);
        }
        return protocol;
    }

    // ============================================
    // Treatment Methods
    // ============================================

    async createTreatment(tenantId: string, userId: string, dto: CreateLongevityTreatmentDto) {
        const protocol = await this.findProtocolById(tenantId, dto.protocolId);

        // Generate treatment number
        const treatmentNumber = await this.generateTreatmentNumber(tenantId);

        // Get session in series for this patient and protocol
        const sessionCount = await this.prisma.longevityTreatment.count({
            where: {
                tenantId,
                patientId: dto.patientId,
                protocolId: dto.protocolId,
            },
        });

        return this.prisma.longevityTreatment.create({
            data: {
                tenantId,
                facilityId: dto.facilityId,
                patientId: dto.patientId,
                protocolId: dto.protocolId,
                encounterId: dto.encounterId ?? null,
                treatmentNumber,
                sessionInSeries: sessionCount + 1,
                status: LongevityTreatmentStatus.SCHEDULED,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                providerId: dto.providerId ?? null,
                preTreatmentNotes: dto.preTreatmentNotes ?? null,
                createdBy: userId,
            },
        });
    }

    async findAllTreatments(tenantId: string, options?: { status?: LongevityTreatmentStatus }) {
        const where: any = { tenantId };
        if (options?.status) where.status = options.status;

        return this.prisma.longevityTreatment.findMany({
            where,
            include: {
                protocol: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findTreatmentById(tenantId: string, id: string) {
        const treatment = await this.prisma.longevityTreatment.findFirst({
            where: { id, tenantId },
            include: {
                protocol: true,
            },
        });
        if (!treatment) {
            throw new NotFoundException(`Longevity treatment with ID ${id} not found`);
        }
        return treatment;
    }

    async findTreatmentsByPatient(tenantId: string, patientId: string) {
        return this.prisma.longevityTreatment.findMany({
            where: { tenantId, patientId },
            include: {
                protocol: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateTreatmentStatus(
        tenantId: string,
        id: string,
        status: LongevityTreatmentStatus,
        notes?: string
    ) {
        const treatment = await this.findTreatmentById(tenantId, id);

        const updateData: any = { status };

        if (status === LongevityTreatmentStatus.IN_PROGRESS && !treatment.startedAt) {
            updateData.startedAt = new Date();
        }

        if (status === LongevityTreatmentStatus.COMPLETED && !treatment.completedAt) {
            updateData.completedAt = new Date();
        }

        if (notes) {
            updateData.treatmentNotes = notes;
        }

        return this.prisma.longevityTreatment.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================
    // Helper Methods
    // ============================================

    private async generateTreatmentNumber(tenantId: string): Promise<string> {
        const count = await this.prisma.longevityTreatment.count({
            where: { tenantId },
        });
        const year = new Date().getFullYear();
        return `LT-${year}-${String(count + 1).padStart(6, '0')}`;
    }
}
