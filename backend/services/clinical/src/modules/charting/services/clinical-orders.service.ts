import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateClinicalOrderDto, UpdateClinicalOrderDto, AddOrderResultDto, OrderStatus } from '../dto/clinical-order.dto';
import { ObservationWriterService } from '../../observations/observation-writer.service';

@Injectable()
export class ClinicalOrdersService {
  private readonly logger = new Logger(ClinicalOrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly observationWriter: ObservationWriterService,
  ) {}

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
    const query: any = {
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    };

    if (limit) {
      query.take = limit;
    }

    return this.prisma.clinicalOrder.findMany(query);
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

    const data: any = {
      resultStatus: dto.resultStatus,
      resultData: dto.resultData,
      resultedAt: new Date(),
      status: OrderStatus.COMPLETED,
    };

    if (dto.resultNotes) data.resultNotes = dto.resultNotes;
    if (dto.performedBy) data.performedBy = dto.performedBy;
    if (dto.performedAt) data.performedAt = new Date(dto.performedAt);

    const updated = await this.prisma.clinicalOrder.update({
      where: { id },
      data,
    });

    // Write structured observations from result data (async, non-blocking)
    if (dto.resultData && typeof dto.resultData === 'object') {
      const context = {
        tenantId,
        patientId: order.patientId,
        encounterId: order.encounterId,
        orderId: id,
        orderType: order.orderType,
        resultData: dto.resultData,
        resultedAt: updated.resultedAt || new Date(),
        ...(dto.performedBy ? { performedBy: dto.performedBy } : {}),
      };

      this.observationWriter.writeOrderResults(context).catch((err) => {
        this.logger.error(`Failed to write observations for order ${id}: ${err?.message}`, err?.stack);
      });
    }

    return updated;
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
