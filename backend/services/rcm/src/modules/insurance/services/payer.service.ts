import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { CreatePayerDto, UpdatePayerDto, PayerStatus } from '../dto/payer.dto';

@Injectable()
export class PayerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePayerDto) {
    return this.prisma.payer.create({
      data: {
        tenantId,
        payerName: dto.payerName,
        payerId: dto.payerId ?? null,
        payerType: dto.payerType ?? null,
        contactInfo: dto.contactInfo || {},
        configuration: dto.configuration || {},
        status: dto.status || PayerStatus.ACTIVE,
      },
    });
  }

  async findAll(tenantId: string, status?: PayerStatus) {
    const where: any = { tenantId };

    if (status) {
      where.status = status;
    }

    return this.prisma.payer.findMany({
      where,
      orderBy: { payerName: 'asc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const payer = await this.prisma.payer.findFirst({
      where: { id, tenantId },
      include: {
        policies: {
          where: { status: 'active' },
          take: 10,
        },
      },
    });

    if (!payer) {
      throw new NotFoundException(`Payer with ID ${id} not found`);
    }

    return payer;
  }

  async update(tenantId: string, id: string, dto: UpdatePayerDto) {
    // Verify payer exists and belongs to tenant
    await this.findById(tenantId, id);

    const data: any = {};
    if (dto.payerName !== undefined) data.payerName = dto.payerName;
    if (dto.payerId !== undefined) data.payerId = dto.payerId ?? null;
    if (dto.payerType !== undefined) data.payerType = dto.payerType ?? null;
    if (dto.contactInfo !== undefined) data.contactInfo = dto.contactInfo;
    if (dto.configuration !== undefined) data.configuration = dto.configuration;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.payer.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    // Verify payer exists and belongs to tenant
    await this.findById(tenantId, id);

    // Soft delete by updating status
    await this.prisma.payer.update({
      where: { id },
      data: { status: PayerStatus.INACTIVE },
    });

    return { message: 'Payer deactivated successfully' };
  }

  async getPayerStatistics(tenantId: string) {
    const payers = await this.prisma.payer.findMany({
      where: { tenantId },
    });

    const policyCounts = await this.prisma.policy.groupBy({
      by: ['payerId'],
      where: { tenantId },
      _count: true,
    });

    return {
      total: payers.length,
      byStatus: payers.reduce((acc: Record<string, number>, payer) => {
        acc[payer.status] = (acc[payer.status] || 0) + 1;
        return acc;
      }, {}),
      policyCounts: policyCounts.reduce((acc: Record<string, number>, item) => {
        acc[item.payerId] = item._count;
        return acc;
      }, {}),
    };
  }
}
