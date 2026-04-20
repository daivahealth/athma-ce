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
    const prescription = await this.prisma.prescriptionOrder.findFirst({
      where: { id, tenantId },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    return prescription;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.prescriptionOrder.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(tenantId: string, filters: { status?: string; facilityId?: string; limit?: number }) {
    const { status, limit = 200 } = filters;
    return this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
      },
      orderBy: { prescribedAt: 'desc' },
      take: limit,
    });
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
    return this.prisma.prescriptionOrder.findMany({
      where: {
        tenantId,
        status: PrescriptionStatus.ACTIVE,
        dispensingQueueStatus: 'not_queued',
      },
      orderBy: { prescribedAt: 'asc' }, // FIFO — oldest first
      take: limit,
    });
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