import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreatePrescriptionDto, UpdatePrescriptionDto, PrescriptionStatus } from '../dto/prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePrescriptionDto) {
    // Auto-create or reuse a Prescription header so this order appears in the pharmacy queue
    const header = await this.findOrCreateHeader(
      tenantId,
      dto.encounterId,
      dto.patientId,
      dto.prescribedBy,
      dto.prescribedByName,
    );

    const { prescribedByName: _name, ...orderData } = dto;
    return this.prisma.prescriptionOrder.create({
      data: {
        tenantId,
        ...orderData,
        codeSystem: dto.codeSystem || 'NDC',
        refills: dto.refills || 0,
        prescriptionId: header.id,
      },
    });
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /**
   * Find an existing active Prescription header for the encounter, or create one.
   * This groups all drugs added in the same encounter session under one prescription
   * so the pharmacy queue shows a single card.
   */
  private async findOrCreateHeader(
    tenantId: string,
    encounterId: string,
    patientId: string,
    prescribedBy: string,
    prescribedByName?: string,
  ): Promise<{ id: string }> {
    const existing = await this.prisma.prescription.findFirst({
      where: { tenantId, encounterId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (existing) return existing;

    const prescriptionNumber = await this.generatePrescriptionNumber(tenantId);
    return this.prisma.prescription.create({
      data: {
        tenantId,
        prescriptionNumber,
        encounterId,
        patientId,
        prescribedBy,
        ...(prescribedByName && { prescribedByName }),
        status: 'active',
      },
      select: { id: true },
    });
  }

  private async generatePrescriptionNumber(tenantId: string): Promise<string> {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `RX-${ym}-`;
    const latest = await this.prisma.prescription.findFirst({
      where: { tenantId, prescriptionNumber: { startsWith: prefix } },
      orderBy: { prescriptionNumber: 'desc' },
      select: { prescriptionNumber: true },
    });
    let seq = 1;
    if (latest) {
      const match = latest.prescriptionNumber.match(/^RX-(\d{6})-(\d{5})$/);
      if (match) seq = parseInt(match[2]!, 10) + 1;
    }
    return `${prefix}${String(seq).padStart(5, '0')}`;
  }

  async findById(tenantId: string, id: string) {
    const rx = await this.prisma.prescriptionOrder.findFirst({
      where: { id, tenantId },
      include: {
        encounter: {
          select: {
            encounterNumber: true,
            encounterType: true,
            patient: {
              select: {
                mrn: true,
                firstName: true,
                lastName: true,
                displayName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
    });
    if (!rx) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    return {
      ...rx,
      mrn: rx.encounter?.patient?.mrn ?? null,
      patientDisplayName:
        (rx.encounter?.patient?.displayName ??
        `${rx.encounter?.patient?.firstName ?? ''} ${rx.encounter?.patient?.lastName ?? ''}`.trim()) ||
        null,
      dateOfBirth: rx.encounter?.patient?.dateOfBirth ?? null,
      gender: rx.encounter?.patient?.gender ?? null,
      encounterNumber: rx.encounter?.encounterNumber ?? null,
      encounterType: rx.encounter?.encounterType ?? 'outpatient',
    };
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.prescriptionOrder.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(tenantId: string, filters: { status?: string; facilityId?: string; limit?: number }) {
    const { status, limit = 200 } = filters;
    const rows = await this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
      },
      include: {
        encounter: {
          select: {
            encounterNumber: true,
            encounterType: true,
            facilityId: true,
            patient: {
              select: {
                mrn: true,
                firstName: true,
                lastName: true,
                displayName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
      orderBy: { prescribedAt: 'desc' },
      take: limit,
    });

    return rows.map((rx) => ({
      ...rx,
      mrn: rx.encounter?.patient?.mrn ?? null,
      patientDisplayName:
        (rx.encounter?.patient?.displayName ??
        `${rx.encounter?.patient?.firstName ?? ''} ${rx.encounter?.patient?.lastName ?? ''}`.trim()) ||
        null,
      dateOfBirth: rx.encounter?.patient?.dateOfBirth ?? null,
      gender: rx.encounter?.patient?.gender ?? null,
      encounterNumber: rx.encounter?.encounterNumber ?? null,
      encounterType: rx.encounter?.encounterType ?? 'outpatient',
    }));
  }

  async findByPatient(tenantId: string, patientId: string, activeOnly: boolean = false) {
    return this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        patientId,
        ...(activeOnly ? { status: PrescriptionStatus.ACTIVE } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdatePrescriptionDto) {
    await this.findById(tenantId, id);
    return this.prisma.prescriptionOrder.update({
      where: { id },
      data: dto,
    });
  }

  async discontinue(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.prescriptionOrder.update({
      where: { id },
      data: { status: PrescriptionStatus.DISCONTINUED },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.prescriptionOrder.delete({ where: { id } });
    return { message: 'Prescription deleted successfully' };
  }

}