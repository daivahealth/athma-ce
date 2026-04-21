import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreatePrescriptionWithItemsDto,
  AmendPrescriptionDto,
  PrescriptionItemDto,
} from '../dto/prescription-header.dto';

// Regex: RX-YYYYMM-NNNNN
const RX_NUMBER_RE = /^RX-(\d{6})-(\d{5})$/;

@Injectable()
export class PrescriptionHeadersService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Prescription number generator ─────────────────────────────────────────

  private async generatePrescriptionNumber(tenantId: string): Promise<string> {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `RX-${ym}-`;

    // Find the highest sequence number this month for this tenant
    const latest = await this.prisma.prescription.findFirst({
      where: {
        tenantId,
        prescriptionNumber: { startsWith: prefix },
      },
      orderBy: { prescriptionNumber: 'desc' },
      select: { prescriptionNumber: true },
    });

    let seq = 1;
    if (latest) {
      const match = latest.prescriptionNumber.match(RX_NUMBER_RE);
      if (match) seq = parseInt(match[2]!, 10) + 1;
    }

    return `${prefix}${String(seq).padStart(5, '0')}`;
  }

  // ── Create header + drug lines ─────────────────────────────────────────────

  async createWithItems(tenantId: string, dto: CreatePrescriptionWithItemsDto) {
    const prescriptionNumber = await this.generatePrescriptionNumber(tenantId);

    const prescription = await this.prisma.prescription.create({
      data: {
        tenantId,
        prescriptionNumber,
        encounterId: dto.encounterId,
        patientId: dto.patientId,
        prescribedBy: dto.prescribedBy,
        ...(dto.notes && { notes: dto.notes }),
        orders: {
          create: dto.items.map((item) => this.mapItemToOrderData(tenantId, dto, item)),
        },
      },
      include: {
        orders: true,
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

    return this.flattenPrescription(prescription);
  }

  // ── Find all headers (for queue feed) ─────────────────────────────────────

  async findAll(
    tenantId: string,
    filters: { status?: string; facilityId?: string; limit?: number },
  ) {
    const { status, limit = 200 } = filters;

    const rows = await this.prisma.prescription.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
      },
      include: {
        orders: true,
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

    return rows.map((p) => this.flattenPrescription(p));
  }

  // ── Find one header by ID ──────────────────────────────────────────────────

  async findById(tenantId: string, id: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
      include: {
        orders: true,
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

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return this.flattenPrescription(prescription);
  }

  // ── Find headers by encounter ──────────────────────────────────────────────

  async findByEncounter(tenantId: string, encounterId: string) {
    const rows = await this.prisma.prescription.findMany({
      where: { tenantId, encounterId },
      include: {
        orders: true,
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
      orderBy: { prescribedAt: 'desc' },
    });

    return rows.map((p) => this.flattenPrescription(p));
  }

  // ── Find headers by patient ────────────────────────────────────────────────

  async findByPatient(tenantId: string, patientId: string) {
    const rows = await this.prisma.prescription.findMany({
      where: { tenantId, patientId, status: 'active' },
      include: {
        orders: true,
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
      orderBy: { prescribedAt: 'desc' },
    });

    return rows.map((p) => this.flattenPrescription(p));
  }

  // ── Amend (creates new version, marks original as amended) ────────────────

  async amend(tenantId: string, id: string, dto: AmendPrescriptionDto) {
    const original = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
      include: { orders: true },
    });

    if (!original) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    if (original.status !== 'active') {
      throw new BadRequestException(
        `Only active prescriptions can be amended. Current status: ${original.status}`,
      );
    }

    const prescriptionNumber = await this.generatePrescriptionNumber(tenantId);

    // Determine items for the new version
    const newItems: PrescriptionItemDto[] = dto.items
      ? dto.items
      : original.orders.map((order) => ({
          drugCode: order.drugCode,
          codeSystem: order.codeSystem as any,
          drugName: order.drugName,
          ...(order.drugNameAr && { drugNameAr: order.drugNameAr }),
          ...(order.genericName && { genericName: order.genericName }),
          dosage: order.dosage,
          route: order.route,
          frequency: order.frequency,
          ...(order.duration && { duration: order.duration }),
          ...(order.quantity && { quantity: order.quantity }),
          refills: order.refills,
          ...(order.instructions && { instructions: order.instructions }),
          ...(order.instructionsAr && { instructionsAr: order.instructionsAr }),
        }));

    // Transaction: mark original as amended, create new version
    const [, amended] = await this.prisma.$transaction([
      this.prisma.prescription.update({
        where: { id },
        data: { status: 'amended' },
      }),
      this.prisma.prescription.create({
        data: {
          tenantId,
          prescriptionNumber,
          version: original.version + 1,
          parentId: original.id,
          encounterId: original.encounterId,
          patientId: original.patientId,
          prescribedBy: original.prescribedBy,
          status: 'active',
          ...(dto.notes !== undefined ? { notes: dto.notes } : original.notes ? { notes: original.notes } : {}),
          orders: {
            create: newItems.map((item) =>
              this.mapItemToOrderData(tenantId, { encounterId: original.encounterId, patientId: original.patientId, prescribedBy: original.prescribedBy } as any, item),
            ),
          },
        },
        include: {
          orders: true,
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
      }),
    ]);

    return this.flattenPrescription(amended);
  }

  // ── Cancel ─────────────────────────────────────────────────────────────────

  async cancel(tenantId: string, id: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    if (!['active'].includes(prescription.status)) {
      throw new BadRequestException(
        `Only active prescriptions can be cancelled. Current status: ${prescription.status}`,
      );
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  // ── Mark as completed ──────────────────────────────────────────────────────

  async complete(tenantId: string, id: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { status: 'completed' },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private mapItemToOrderData(
    tenantId: string,
    header: { encounterId: string; patientId: string; prescribedBy: string },
    item: PrescriptionItemDto,
  ) {
    return {
      tenantId,
      encounterId: header.encounterId,
      patientId: header.patientId,
      prescribedBy: header.prescribedBy,
      drugCode: item.drugCode,
      codeSystem: item.codeSystem ?? 'NDC',
      drugName: item.drugName,
      ...(item.drugNameAr && { drugNameAr: item.drugNameAr }),
      ...(item.genericName && { genericName: item.genericName }),
      dosage: item.dosage,
      route: item.route,
      frequency: item.frequency,
      ...(item.duration && { duration: item.duration }),
      ...(item.quantity && { quantity: item.quantity }),
      refills: item.refills ?? 0,
      ...(item.instructions && { instructions: item.instructions }),
      ...(item.instructionsAr && { instructionsAr: item.instructionsAr }),
    };
  }

  private flattenPrescription(p: any) {
    const patient = p.encounter?.patient;
    return {
      id: p.id,
      tenantId: p.tenantId,
      prescriptionNumber: p.prescriptionNumber,
      version: p.version,
      parentId: p.parentId ?? null,
      encounterId: p.encounterId,
      patientId: p.patientId,
      status: p.status,
      prescribedBy: p.prescribedBy,
      prescribedAt: p.prescribedAt,
      notes: p.notes ?? null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      // Flattened patient context
      mrn: patient?.mrn ?? null,
      patientDisplayName:
        (patient?.displayName ??
          `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim()) ||
        null,
      dateOfBirth: patient?.dateOfBirth ?? null,
      gender: patient?.gender ?? null,
      encounterNumber: p.encounter?.encounterNumber ?? null,
      encounterType: p.encounter?.encounterType ?? null,
      // Drug lines
      items: (p.orders ?? []).map((o: any) => ({
        id: o.id,
        drugCode: o.drugCode,
        codeSystem: o.codeSystem,
        drugName: o.drugName,
        drugNameAr: o.drugNameAr ?? null,
        genericName: o.genericName ?? null,
        dosage: o.dosage,
        route: o.route,
        frequency: o.frequency,
        duration: o.duration ?? null,
        quantity: o.quantity ?? null,
        refills: o.refills,
        instructions: o.instructions ?? null,
        instructionsAr: o.instructionsAr ?? null,
        status: o.status,
      })),
    };
  }
}
