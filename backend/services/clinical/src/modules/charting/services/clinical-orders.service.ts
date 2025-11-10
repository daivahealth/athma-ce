import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateClinicalOrderDto, UpdateClinicalOrderDto, AddOrderResultDto, OrderStatus } from '../dto/clinical-order.dto';

@Injectable()
export class ClinicalOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateClinicalOrderDto) {
    return this.prisma.clinicalOrder.create({
      data: {
        tenantId,
        ...dto,
        priority: dto.priority || 'routine',
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id, tenantId },
    });
    if (!order) {
      throw new NotFoundException(`Clinical order with ID ${id} not found`);
    }
    return order;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.clinicalOrder.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    return this.prisma.clinicalOrder.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(tenantId: string, id: string, dto: UpdateClinicalOrderDto) {
    await this.findById(tenantId, id);
    return this.prisma.clinicalOrder.update({
      where: { id },
      data: dto,
    });
  }

  async addResults(tenantId: string, id: string, dto: AddOrderResultDto) {
    const order = await this.findById(tenantId, id);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot add results to a cancelled order');
    }

    return this.prisma.clinicalOrder.update({
      where: { id },
      data: {
        resultStatus: dto.resultStatus,
        resultData: dto.resultData,
        resultNotes: dto.resultNotes,
        performedBy: dto.performedBy,
        performedAt: dto.performedAt ? new Date(dto.performedAt) : undefined,
        resultedAt: new Date(),
        status: OrderStatus.COMPLETED,
      },
    });
  }

  async cancel(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.clinicalOrder.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.clinicalOrder.delete({ where: { id } });
    return { message: 'Clinical order deleted successfully' };
  }
}