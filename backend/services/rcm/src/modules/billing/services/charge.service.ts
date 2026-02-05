import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  CreateChargeDto,
  UpdateChargeDto,
  ChargeStatus,
  ChargeSourceType,
} from '../dto/charge.dto';

@Injectable()
export class ChargeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateChargeDto) {
    const data: any = {
      tenantId,
      patientId: dto.patientId,
      encounterId: dto.encounterId ?? null,
      billingItemId: dto.billingItemId,
      chargeDate: dto.chargeDate ?? new Date(),
      quantity: dto.quantity ?? 1,
      unitPrice: dto.unitPrice,
      grossAmount: dto.grossAmount,
      patientResponsibility: dto.patientResponsibility ?? null,
      payerResponsibility: dto.payerResponsibility ?? null,
      status: dto.status ?? ChargeStatus.UNBILLED,
      sourceType: dto.sourceType ?? null,
      sourceId: dto.sourceId ?? null,
      notes: dto.notes ?? null,
    };

    return this.prisma.charge.create({
      data,
      include: {
        billingItem: true,
      },
    });
  }

  async findAll(
    tenantId: string,
    filters?: {
      patientId?: string;
      encounterId?: string;
      status?: ChargeStatus;
      sourceType?: ChargeSourceType;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    const where: any = {
      tenantId,
    };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.encounterId) {
      where.encounterId = filters.encounterId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.sourceType) {
      where.sourceType = filters.sourceType;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.chargeDate = {};
      if (filters.dateFrom) {
        where.chargeDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.chargeDate.lte = filters.dateTo;
      }
    }

    return this.prisma.charge.findMany({
      where,
      include: {
        billingItem: true,
      },
      orderBy: {
        chargeDate: 'desc',
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const charge = await this.prisma.charge.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        billingItem: true,
      },
    });

    if (!charge) {
      throw new NotFoundException(`Charge with ID ${id} not found`);
    }

    return charge;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.charge.findMany({
      where: {
        tenantId,
        encounterId,
      },
      include: {
        billingItem: true,
      },
      orderBy: {
        chargeDate: 'asc',
      },
    });
  }

  async findByPatient(tenantId: string, patientId: string) {
    return this.prisma.charge.findMany({
      where: {
        tenantId,
        patientId,
      },
      include: {
        billingItem: true,
      },
      orderBy: {
        chargeDate: 'desc',
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateChargeDto) {
    // Verify charge exists and belongs to tenant
    await this.findById(tenantId, id);

    const data: any = {};
    if (dto.patientId !== undefined) data.patientId = dto.patientId;
    if (dto.encounterId !== undefined) data.encounterId = dto.encounterId ?? null;
    if (dto.billingItemId !== undefined) data.billingItemId = dto.billingItemId;
    if (dto.chargeDate !== undefined) data.chargeDate = dto.chargeDate;
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) data.unitPrice = dto.unitPrice;
    if (dto.grossAmount !== undefined) data.grossAmount = dto.grossAmount;
    if (dto.patientResponsibility !== undefined) data.patientResponsibility = dto.patientResponsibility ?? null;
    if (dto.payerResponsibility !== undefined) data.payerResponsibility = dto.payerResponsibility ?? null;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sourceType !== undefined) data.sourceType = dto.sourceType ?? null;
    if (dto.sourceId !== undefined) data.sourceId = dto.sourceId ?? null;
    if (dto.notes !== undefined) data.notes = dto.notes ?? null;

    return this.prisma.charge.update({
      where: { id },
      data,
      include: {
        billingItem: true,
      },
    });
  }

  async cancel(tenantId: string, id: string) {
    // Verify charge exists and belongs to tenant
    await this.findById(tenantId, id);

    return this.prisma.charge.update({
      where: { id },
      data: { status: ChargeStatus.CANCELLED },
      include: {
        billingItem: true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    // Verify charge exists and belongs to tenant
    await this.findById(tenantId, id);

    return this.prisma.charge.delete({
      where: { id },
    });
  }

  async getStatistics(tenantId: string, filters?: { patientId?: string; encounterId?: string }) {
    const where: any = {
      tenantId,
    };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.encounterId) {
      where.encounterId = filters.encounterId;
    }

    const [total, byStatus, totalAmount] = await Promise.all([
      this.prisma.charge.count({ where }),
      this.prisma.charge.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: {
          grossAmount: true,
        },
      }),
      this.prisma.charge.aggregate({
        where,
        _sum: {
          grossAmount: true,
          patientResponsibility: true,
          payerResponsibility: true,
        },
      }),
    ]);

    return {
      total,
      totalGrossAmount: totalAmount._sum.grossAmount || 0,
      totalPatientResponsibility: totalAmount._sum.patientResponsibility || 0,
      totalPayerResponsibility: totalAmount._sum.payerResponsibility || 0,
      byStatus: byStatus.reduce(
        (acc: Record<string, { count: number; amount: number }>, item: any) => {
          acc[item.status] = {
            count: item._count,
            amount: item._sum.grossAmount || 0,
          };
          return acc;
        },
        {} as Record<string, { count: number; amount: number }>,
      ),
    };
  }

  // Bulk operations
  async createBulk(tenantId: string, charges: CreateChargeDto[]) {
    return this.prisma.$transaction(
      charges.map((dto) =>
        this.prisma.charge.create({
          data: {
            tenantId,
            patientId: dto.patientId,
            encounterId: dto.encounterId ?? null,
            billingItemId: dto.billingItemId,
            chargeDate: dto.chargeDate ?? new Date(),
            quantity: dto.quantity ?? 1,
            unitPrice: dto.unitPrice,
            grossAmount: dto.grossAmount,
            patientResponsibility: dto.patientResponsibility ?? null,
            payerResponsibility: dto.payerResponsibility ?? null,
            status: dto.status ?? ChargeStatus.UNBILLED,
            sourceType: dto.sourceType ?? null,
            sourceId: dto.sourceId ?? null,
            notes: dto.notes ?? null,
          },
          include: { billingItem: true },
        }),
      ),
    );
  }
}
