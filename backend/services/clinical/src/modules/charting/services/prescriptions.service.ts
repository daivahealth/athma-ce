import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreatePrescriptionDto, UpdatePrescriptionDto, PrescriptionStatus } from '../dto/prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePrescriptionDto) {
    return this.prisma.prescriptionOrder.create({
      data: {
        tenantId,
        ...dto,
        codeSystem: dto.codeSystem || 'NDC',
        refills: dto.refills || 0,
      },
    });
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
        rx.encounter?.patient?.displayName ??
        `${rx.encounter?.patient?.firstName ?? ''} ${rx.encounter?.patient?.lastName ?? ''}`.trim() ||
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
        rx.encounter?.patient?.displayName ??
        `${rx.encounter?.patient?.firstName ?? ''} ${rx.encounter?.patient?.lastName ?? ''}`.trim() ||
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

  // ─── Internal: Pharmacy Queue Scheduler ────────────────────────────────────

  /**
   * Returns active prescriptions that have not yet been pushed to the RCM
   * dispensing queue (dispensingQueueStatus = 'not_queued').
   * Called exclusively by the RCM pharmacy queue scheduler via internal API key.
   */
  async findPendingQueue(tenantId: string, limit = 100) {
    const rows = await this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        status: PrescriptionStatus.ACTIVE,
        dispensingQueueStatus: 'not_queued',
      },
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
      orderBy: { prescribedAt: 'asc' }, // FIFO — oldest first
      take: limit,
    });

    return rows.map((rx) => ({
      ...rx,
      mrn: rx.encounter?.patient?.mrn ?? null,
      patientDisplayName:
        rx.encounter?.patient?.displayName ??
        `${rx.encounter?.patient?.firstName ?? ''} ${rx.encounter?.patient?.lastName ?? ''}`.trim() ||
        null,
      dateOfBirth: rx.encounter?.patient?.dateOfBirth ?? null,
      gender: rx.encounter?.patient?.gender ?? null,
      encounterNumber: rx.encounter?.encounterNumber ?? null,
      encounterType: rx.encounter?.encounterType ?? 'outpatient',
    }));
  }

  /**
   * Updates the dispensingQueueStatus on a prescription order.
   * Called by the RCM scheduler after successfully creating a dispensing record.
   * Valid values: 'queued' | 'not_queued' | 'cancelled'
   */
  async updateDispensingQueueStatus(tenantId: string, id: string, status: string) {
    await this.findById(tenantId, id);
    await this.prisma.prescriptionOrder.update({
      where: { id },
      data: {
        dispensingQueueStatus: status,
        dispensingQueuedAt: status === 'queued' ? new Date() : null,
      },
    });
    return { id, dispensingQueueStatus: status };
  }
}