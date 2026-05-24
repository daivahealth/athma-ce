import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateClinicalOrderDto,
  CreatePackageOrderDto,
  UpdateClinicalOrderDto,
  AddOrderResultDto,
  OrderStatus,
  OrderType,
  CodeSystem,
} from '../dto/clinical-order.dto';
import { ObservationWriterService } from '../../observations/observation-writer.service';

@Injectable()
export class ClinicalOrdersService {
  private readonly logger = new Logger(ClinicalOrdersService.name);
  private readonly orderInclude = {
    labOrderTests: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
    imagingOrderDetails: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
    procedureOrderDetails: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
  };
  private readonly chartOrderSelect = {
    id: true,
    tenantId: true,
    encounterId: true,
    patientId: true,
    orderType: true,
    orderCode: true,
    codeSystem: true,
    orderName: true,
    orderNameAr: true,
    priority: true,
    status: true,
    clinicalIndication: true,
    specialInstructions: true,
    packageOrderId: true,
    resultStatus: true,
    resultData: true,
    resultNotes: true,
    resultedAt: true,
    orderedBy: true,
    orderedAt: true,
    performedBy: true,
    performedAt: true,
    createdAt: true,
    updatedAt: true,
  };

  private normalizePackageCatalogType(value: string | null | undefined) {
    return value?.trim().toUpperCase() ?? '';
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly observationWriter: ObservationWriterService,
  ) {}

  async create(tenantId: string, dto: CreateClinicalOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const { labTests, imagingDetails, procedureDetails, ...orderData } = dto;

      if (labTests?.length && dto.orderType !== OrderType.LAB) {
        throw new BadRequestException('Lab test detail rows are only valid for lab clinical orders');
      }
      if (imagingDetails?.length && dto.orderType !== OrderType.IMAGING) {
        throw new BadRequestException('Imaging detail rows are only valid for imaging clinical orders');
      }
      if (procedureDetails?.length && dto.orderType !== OrderType.PROCEDURE) {
        throw new BadRequestException('Procedure detail rows are only valid for procedure clinical orders');
      }

      const created = await tx.clinicalOrder.create({
        data: {
          tenantId,
          ...orderData,
          priority: dto.priority || 'routine',
        },
      });

      if (labTests?.length) {
        await tx.labOrderTest.createMany({
          data: labTests.map((labTest, index) => ({
            tenantId,
            orderId: created.id,
            labTestMasterId: labTest.labTestMasterId ?? null,
            testCode: labTest.testCode,
            codeSystem: labTest.codeSystem || CodeSystem.LOINC,
            testName: labTest.testName,
            loincCode: labTest.loincCode ?? null,
            cptCode: labTest.cptCode ?? null,
            specimenType: labTest.specimenType ?? null,
            collectionMethod: labTest.collectionMethod ?? null,
            fastingRequired: labTest.fastingRequired ?? false,
            fastingDurationHours: labTest.fastingDurationHours ?? null,
            quantity: labTest.quantity ?? 1,
            sortOrder: labTest.sortOrder ?? index,
            notes: labTest.notes ?? null,
          })),
        });
      }

      if (imagingDetails?.length) {
        await tx.imagingOrderDetail.createMany({
          data: imagingDetails.map((detail, index) => ({
            tenantId,
            orderId: created.id,
            imagingStudyMasterId: detail.imagingStudyMasterId ?? null,
            studyCode: detail.studyCode,
            codeSystem: detail.codeSystem || CodeSystem.CPT,
            studyName: detail.studyName,
            cptCode: detail.cptCode ?? null,
            modality: detail.modality ?? null,
            bodyPart: detail.bodyPart ?? null,
            contrastRequired: detail.contrastRequired ?? false,
            contrastType: detail.contrastType ?? null,
            preparationInstructions: detail.preparationInstructions ?? null,
            quantity: detail.quantity ?? 1,
            sortOrder: detail.sortOrder ?? index,
            notes: detail.notes ?? null,
          })),
        });
      }

      if (procedureDetails?.length) {
        await tx.procedureOrderDetail.createMany({
          data: procedureDetails.map((detail, index) => ({
            tenantId,
            orderId: created.id,
            procedureMasterId: detail.procedureMasterId ?? null,
            procedureCode: detail.procedureCode,
            codeSystem: detail.codeSystem || CodeSystem.CPT,
            procedureName: detail.procedureName,
            cptCode: detail.cptCode ?? null,
            icd10PcsCode: detail.icd10PcsCode ?? null,
            procedureCategory: detail.procedureCategory ?? null,
            bodySystem: detail.bodySystem ?? null,
            anesthesiaType: detail.anesthesiaType ?? null,
            facilityRequired: detail.facilityRequired ?? null,
            estimatedDurationMinutes: detail.estimatedDurationMinutes ?? null,
            preparationInstructions: detail.preparationInstructions ?? null,
            consentRequired: detail.consentRequired ?? false,
            quantity: detail.quantity ?? 1,
            sortOrder: detail.sortOrder ?? index,
            notes: detail.notes ?? null,
          })),
        });
      }

      return tx.clinicalOrder.findUniqueOrThrow({
        where: { id: created.id },
        include: this.orderInclude,
      });
    });
  }

  async findById(tenantId: string, id: string) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id, tenantId },
      include: this.orderInclude,
    });
    if (!order) {
      throw new NotFoundException(`Clinical order with ID ${id} not found`);
    }
    return order;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.clinicalOrder.findMany({
      where: { tenantId, encounterId },
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findChartViewByEncounter(tenantId: string, encounterId: string) {
    const [standaloneOrders, packageOrders] = await Promise.all([
      this.prisma.clinicalOrder.findMany({
        where: {
          tenantId,
          encounterId,
          packageOrderId: null,
        },
        select: this.chartOrderSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.packageOrder.findMany({
        where: {
          tenantId,
          encounterId,
        },
        include: {
          package: {
            select: {
              code: true,
              name: true,
            },
          },
          clinicalOrders: {
            select: this.chartOrderSelect,
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          orderedAt: 'desc',
        },
      }),
    ]);

    return {
      standaloneOrders,
      packageOrders: packageOrders.map((packageOrder) => {
        const childTypeSummary = packageOrder.clinicalOrders.reduce(
          (summary, order) => {
            if (order.orderType === OrderType.LAB) summary.lab += 1;
            if (order.orderType === OrderType.IMAGING) summary.imaging += 1;
            if (order.orderType === OrderType.PROCEDURE) summary.procedure += 1;
            return summary;
          },
          { lab: 0, imaging: 0, procedure: 0 },
        );

        return {
          id: packageOrder.id,
          packageId: packageOrder.packageId,
          packageCode: packageOrder.package.code,
          packageName: packageOrder.package.name,
          status: this.derivePackageStatus(packageOrder.status, packageOrder.clinicalOrders),
          orderedBy: packageOrder.orderedBy,
          orderedAt: packageOrder.orderedAt,
          childOrderCount: packageOrder.clinicalOrders.length,
          childTypeSummary,
          clinicalOrders: packageOrder.clinicalOrders,
        };
      }),
    };
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    const query: any = {
      where: { tenantId, patientId },
      include: this.orderInclude,
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
      include: this.orderInclude,
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
      include: this.orderInclude,
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
      include: this.orderInclude,
    });
  }

  async cancelPackageOrder(tenantId: string, id: string) {
    const packageOrder = await this.prisma.packageOrder.findFirst({
      where: { id, tenantId },
      include: {
        clinicalOrders: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!packageOrder) {
      throw new NotFoundException(`Package order with ID ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.packageOrder.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });

      await tx.clinicalOrder.updateMany({
        where: {
          tenantId,
          packageOrderId: id,
          status: {
            not: OrderStatus.COMPLETED,
          },
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      const updated = await tx.packageOrder.findUniqueOrThrow({
        where: { id },
        include: {
          package: {
            select: {
              code: true,
              name: true,
            },
          },
          clinicalOrders: {
            include: this.orderInclude,
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return this.mapPackageOrderResponse(updated);
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.clinicalOrder.delete({ where: { id } });
    return { message: 'Clinical order deleted successfully' };
  }

  async createPackageOrder(tenantId: string, dto: CreatePackageOrderDto) {
    const pkg = await this.prisma.package.findFirst({
      where: {
        id: dto.packageId,
        OR: [{ tenantId }, { tenantId: null }],
      },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package ${dto.packageId} not found`);
    }

    const executableCatalogTypes = new Set(['LAB_TEST', 'IMAGING_STUDY', 'PROCEDURE']);
    const executableItems = pkg.items.filter((item) =>
      executableCatalogTypes.has(this.normalizePackageCatalogType(item.catalogType)),
    );

    if (executableItems.length === 0) {
      throw new BadRequestException('Package has no executable clinical order items');
    }

    return this.prisma.$transaction(async (tx) => {
      const packageOrder = await tx.packageOrder.create({
        data: {
          tenantId,
          packageId: dto.packageId,
          encounterId: dto.encounterId,
          patientId: dto.patientId,
          notes: dto.notes ?? null,
          orderedBy: dto.orderedBy,
          status: 'ordered',
        },
      });

      for (const item of executableItems) {
        const catalogType = this.normalizePackageCatalogType(item.catalogType);

        if (catalogType === 'LAB_TEST') {
          const labTest = await tx.labTestMaster.findFirst({
            where: {
              id: item.catalogId,
              OR: [{ tenantId }, { tenantId: null }],
            },
          });

          if (!labTest) {
            throw new NotFoundException(`Lab test catalog item ${item.catalogId} not found`);
          }

          const clinicalOrder = await tx.clinicalOrder.create({
            data: {
              tenantId,
              encounterId: dto.encounterId,
              patientId: dto.patientId,
              packageOrderId: packageOrder.id,
              orderType: OrderType.LAB,
              orderCode: labTest.loincCode || labTest.localCode || labTest.cptCode || labTest.id,
              codeSystem: labTest.loincCode ? CodeSystem.LOINC : labTest.localCode ? CodeSystem.LOCAL : CodeSystem.CPT,
              orderName: labTest.testName,
              priority: dto.priority || 'routine',
              status: 'ordered',
              clinicalIndication: dto.clinicalIndication ?? null,
              specialInstructions: dto.specialInstructions ?? null,
              orderedBy: dto.orderedBy,
            },
          });

          await tx.labOrderTest.create({
            data: {
              tenantId,
              orderId: clinicalOrder.id,
              labTestMasterId: labTest.id,
              testCode: labTest.localCode || labTest.loincCode,
              codeSystem: labTest.loincCode ? CodeSystem.LOINC : CodeSystem.LOCAL,
              testName: labTest.testName,
              loincCode: labTest.loincCode,
              cptCode: labTest.cptCode,
              specimenType: labTest.specimenType,
              collectionMethod: labTest.collectionMethod,
              fastingRequired: labTest.fastingRequired,
              fastingDurationHours: labTest.fastingDurationHours,
              quantity: item.quantity,
              sortOrder: item.sortOrder,
              status: 'ordered',
              notes: item.notes,
            },
          });

          continue;
        }

        if (catalogType === 'IMAGING_STUDY') {
          const imagingStudy = await tx.imagingStudyMaster.findFirst({
            where: {
              id: item.catalogId,
              OR: [{ tenantId }, { tenantId: null }],
            },
          });

          if (!imagingStudy) {
            throw new NotFoundException(`Imaging study catalog item ${item.catalogId} not found`);
          }

          const imagingOrder = await tx.clinicalOrder.create({
            data: {
              tenantId,
              encounterId: dto.encounterId,
              patientId: dto.patientId,
              packageOrderId: packageOrder.id,
              orderType: OrderType.IMAGING,
              orderCode: imagingStudy.cptCode || imagingStudy.localCode || imagingStudy.id,
              codeSystem: imagingStudy.cptCode ? CodeSystem.CPT : CodeSystem.LOCAL,
              orderName: imagingStudy.studyName,
              priority: dto.priority || 'routine',
              status: 'ordered',
              clinicalIndication: dto.clinicalIndication ?? null,
              specialInstructions: dto.specialInstructions ?? null,
              orderedBy: dto.orderedBy,
            },
          });

          await tx.imagingOrderDetail.create({
            data: {
              tenantId,
              orderId: imagingOrder.id,
              imagingStudyMasterId: imagingStudy.id,
              studyCode: imagingStudy.cptCode || imagingStudy.localCode || imagingStudy.id,
              codeSystem: imagingStudy.cptCode ? CodeSystem.CPT : CodeSystem.LOCAL,
              studyName: imagingStudy.studyName,
              cptCode: imagingStudy.cptCode,
              modality: imagingStudy.modality,
              bodyPart: imagingStudy.bodyPart,
              contrastRequired: imagingStudy.contrastRequired,
              contrastType: imagingStudy.contrastType,
              preparationInstructions: imagingStudy.preparationInstructions,
              quantity: item.quantity,
              sortOrder: item.sortOrder,
              status: 'ordered',
              notes: item.notes,
            },
          });

          continue;
        }

        const procedure = await tx.procedureMaster.findFirst({
          where: {
            id: item.catalogId,
            OR: [{ tenantId }, { tenantId: null }],
          },
        });

        if (!procedure) {
          throw new NotFoundException(`Procedure catalog item ${item.catalogId} not found`);
        }

        const procedureOrder = await tx.clinicalOrder.create({
          data: {
            tenantId,
            encounterId: dto.encounterId,
            patientId: dto.patientId,
            packageOrderId: packageOrder.id,
            orderType: OrderType.PROCEDURE,
            orderCode: procedure.cptCode || procedure.localCode || procedure.icd10PcsCode || procedure.id,
            codeSystem: procedure.cptCode ? CodeSystem.CPT : procedure.localCode ? CodeSystem.LOCAL : CodeSystem.SNOMED,
            orderName: procedure.procedureName,
            priority: dto.priority || 'routine',
            status: 'ordered',
            clinicalIndication: dto.clinicalIndication ?? null,
            specialInstructions: dto.specialInstructions ?? null,
            orderedBy: dto.orderedBy,
          },
        });

        await tx.procedureOrderDetail.create({
          data: {
            tenantId,
            orderId: procedureOrder.id,
            procedureMasterId: procedure.id,
            procedureCode:
              procedure.cptCode || procedure.localCode || procedure.icd10PcsCode || procedure.id,
            codeSystem: procedure.cptCode
              ? CodeSystem.CPT
              : procedure.localCode
              ? CodeSystem.LOCAL
              : CodeSystem.SNOMED,
            procedureName: procedure.procedureName,
            cptCode: procedure.cptCode,
            icd10PcsCode: procedure.icd10PcsCode,
            procedureCategory: procedure.procedureCategory,
            bodySystem: procedure.bodySystem,
            anesthesiaType: procedure.anesthesiaType,
            facilityRequired: procedure.facilityRequired,
            estimatedDurationMinutes: procedure.estimatedDurationMinutes,
            preparationInstructions: procedure.preparationInstructions,
            consentRequired: procedure.consentRequired,
            quantity: item.quantity,
            sortOrder: item.sortOrder,
            status: 'ordered',
            notes: item.notes,
          },
        });
      }

      const created = await tx.packageOrder.findUniqueOrThrow({
        where: { id: packageOrder.id },
        include: {
          package: {
            select: {
              code: true,
              name: true,
            },
          },
          clinicalOrders: {
            include: this.orderInclude,
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return this.mapPackageOrderResponse(created);
    });
  }

  async findPackageOrderById(tenantId: string, id: string) {
    const packageOrder = await this.prisma.packageOrder.findFirst({
      where: { id, tenantId },
      include: {
        package: {
          select: {
            code: true,
            name: true,
          },
        },
        clinicalOrders: {
          include: this.orderInclude,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!packageOrder) {
      throw new NotFoundException(`Package order with ID ${id} not found`);
    }

    return this.mapPackageOrderResponse(packageOrder);
  }

  private derivePackageStatus(
    storedStatus: string,
    clinicalOrders: Array<{ status: string; resultStatus?: string | null }>,
  ) {
    if (!clinicalOrders.length) {
      return storedStatus;
    }

    if (clinicalOrders.every((order) => order.status === OrderStatus.CANCELLED)) {
      return OrderStatus.CANCELLED;
    }

    if (clinicalOrders.every((order) => order.status === OrderStatus.COMPLETED)) {
      return OrderStatus.COMPLETED;
    }

    if (
      clinicalOrders.some(
        (order) =>
          order.status === OrderStatus.IN_PROGRESS ||
          order.status === OrderStatus.COMPLETED ||
          Boolean(order.resultStatus),
      )
    ) {
      return OrderStatus.IN_PROGRESS;
    }

    return storedStatus;
  }

  private mapPackageOrderResponse(
    packageOrder: {
      id: string;
      tenantId: string;
      packageId: string;
      encounterId: string;
      patientId: string;
      status: string;
      notes: string | null;
      orderedBy: string;
      orderedAt: Date;
      createdAt: Date;
      updatedAt: Date;
      package?: { code: string; name: string } | null;
      clinicalOrders: unknown[];
    },
  ) {
    return {
      id: packageOrder.id,
      tenantId: packageOrder.tenantId,
      packageId: packageOrder.packageId,
      packageCode: packageOrder.package?.code,
      packageName: packageOrder.package?.name,
      encounterId: packageOrder.encounterId,
      patientId: packageOrder.patientId,
      status: packageOrder.status,
      notes: packageOrder.notes ?? undefined,
      orderedBy: packageOrder.orderedBy,
      orderedAt: packageOrder.orderedAt,
      clinicalOrders: packageOrder.clinicalOrders,
      createdAt: packageOrder.createdAt,
      updatedAt: packageOrder.updatedAt,
    };
  }
}
