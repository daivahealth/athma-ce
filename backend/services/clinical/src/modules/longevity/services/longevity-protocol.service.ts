import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateLongevityProtocolDto,
  UpdateLongevityProtocolDto,
  ScheduleTreatmentDto,
  StartTreatmentDto,
  CompleteTreatmentDto,
  LongevityTreatmentStatus,
} from '../dto/longevity-treatment.dto';

@Injectable()
export class LongevityProtocolService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findProtocolById(tenantId: string, id: string) {
    const protocol = await this.prisma.longevityProtocol.findFirst({
      where: { id, tenantId },
    });
    if (!protocol) {
      throw new NotFoundException(`Protocol with ID ${id} not found`);
    }
    return protocol;
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

  async updateProtocol(tenantId: string, id: string, dto: UpdateLongevityProtocolDto) {
    await this.findProtocolById(tenantId, id);
    return this.prisma.longevityProtocol.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================
  // Treatment Methods
  // ============================================

  async scheduleTreatment(tenantId: string, userId: string, dto: ScheduleTreatmentDto) {
    const protocol = await this.findProtocolById(tenantId, dto.protocolId);

    // Generate treatment number
    const treatmentNumber = await this.generateTreatmentNumber(tenantId);

    return this.prisma.longevityTreatment.create({
      data: {
        tenantId,
        facilityId: dto.facilityId,
        patientId: dto.patientId,
        protocolId: dto.protocolId,
        encounterId: dto.encounterId ?? null,
        treatmentNumber,
        sessionInSeries: dto.sessionInSeries || 1,
        scheduledAt: new Date(dto.scheduledAt),
        providerId: dto.providerId ?? null,
        nurseId: dto.nurseId ?? null,
        status: 'SCHEDULED',
        createdBy: userId,
      },
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
      throw new NotFoundException(`Treatment with ID ${id} not found`);
    }
    return treatment;
  }

  async findTreatmentsByPatient(
    tenantId: string,
    patientId: string,
    options?: { protocolId?: string; status?: LongevityTreatmentStatus; limit?: number },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.protocolId) where.protocolId = options.protocolId;
    if (options?.status) where.status = options.status;

    return this.prisma.longevityTreatment.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      ...(options?.limit && { take: options.limit }),
      include: {
        protocol: {
          select: {
            id: true,
            code: true,
            name: true,
            protocolType: true,
          },
        },
      },
    });
  }

  async startTreatment(tenantId: string, id: string, dto: StartTreatmentDto) {
    const treatment = await this.findTreatmentById(tenantId, id);

    if (treatment.status !== 'SCHEDULED') {
      throw new BadRequestException('Treatment can only be started from scheduled status');
    }

    // Check if consent is required
    if (treatment.protocol.consentRequired && !dto.consentObtained) {
      throw new BadRequestException('Consent is required for this treatment');
    }

    return this.prisma.longevityTreatment.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        ...(dto.preVitals !== undefined && { preVitals: dto.preVitals }),
        ...(dto.preTreatmentNotes !== undefined && { preTreatmentNotes: dto.preTreatmentNotes }),
        consentObtained: dto.consentObtained || false,
        ...(dto.consentId !== undefined && { consentId: dto.consentId }),
      },
    });
  }

  async completeTreatment(tenantId: string, id: string, dto: CompleteTreatmentDto) {
    const treatment = await this.findTreatmentById(tenantId, id);

    if (treatment.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Treatment can only be completed from in-progress status');
    }

    const status = dto.adverseEventOccurred ? 'ADVERSE_EVENT' : 'COMPLETED';

    return this.prisma.longevityTreatment.update({
      where: { id },
      data: {
        status,
        completedAt: new Date(),
        ...(dto.actualComponents !== undefined && { actualComponents: dto.actualComponents }),
        ...(dto.lotNumbers !== undefined && { lotNumbers: dto.lotNumbers }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.postVitals !== undefined && { postVitals: dto.postVitals }),
        ...(dto.immediateReactions !== undefined && { immediateReactions: dto.immediateReactions }),
        ...(dto.postTreatmentNotes !== undefined && { postTreatmentNotes: dto.postTreatmentNotes }),
        adverseEventOccurred: dto.adverseEventOccurred || false,
        ...(dto.adverseEventDetails !== undefined && { adverseEventDetails: dto.adverseEventDetails }),
      },
    });
  }

  async cancelTreatment(tenantId: string, id: string, reason?: string) {
    const treatment = await this.findTreatmentById(tenantId, id);

    if (['COMPLETED', 'CANCELLED', 'ADVERSE_EVENT'].includes(treatment.status)) {
      throw new BadRequestException('Treatment cannot be cancelled in current status');
    }

    return this.prisma.longevityTreatment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        ...(reason !== undefined && { postTreatmentNotes: reason }),
      },
    });
  }

  async getTreatmentHistory(
    tenantId: string,
    patientId: string,
    protocolId?: string,
  ) {
    const where: any = { tenantId, patientId, status: 'COMPLETED' };
    if (protocolId) where.protocolId = protocolId;

    const treatments = await this.prisma.longevityTreatment.findMany({
      where,
      orderBy: { completedAt: 'asc' },
      include: {
        protocol: {
          select: {
            id: true,
            code: true,
            name: true,
            protocolType: true,
          },
        },
      },
    });

    // Group by protocol
    const byProtocol = treatments.reduce((acc: any, t: any) => {
      const key = t.protocolId;
      if (!acc[key]) {
        acc[key] = {
          protocol: t.protocol,
          treatments: [],
          totalSessions: 0,
          lastTreatment: null,
        };
      }
      acc[key].treatments.push(t);
      acc[key].totalSessions++;
      acc[key].lastTreatment = t.completedAt;
      return acc;
    }, {});

    return Object.values(byProtocol);
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
