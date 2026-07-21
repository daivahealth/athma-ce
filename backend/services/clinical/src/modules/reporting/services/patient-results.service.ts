import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface PatientResultSummary {
  id: string;
  reportType: 'lab' | 'imaging' | 'procedure';
  orderId: string;
  orderName: string;
  orderNameAr?: string | null;
  patientId: string;
  patientName: string;
  encounterId: string;
  reportStatus: string;
  reportedAt: Date | null;
  version: number;
  createdAt: Date;
  labSummary?: {
    itemCount: number;
    abnormalCount: number;
    criticalCount: number;
    specimenType?: string | null;
    specimenNumber?: string | null;
    reportStyle?: string | null;
    labDiscipline?: string | null;
  };
  imagingSummary?: {
    modality?: string | null;
    bodyPart?: string | null;
    impression?: string | null;
    criticalFinding: boolean;
  };
  procedureSummary?: {
    procedureDescription?: string | null;
    complications?: string | null;
    durationMinutes?: number | null;
  };
}

const orderSelect = { select: { orderName: true, orderNameAr: true } } as const;

function pickPreferredResult<T extends Omit<PatientResultSummary, 'patientName'>>(
  current: T | undefined,
  candidate: T,
): T {
  if (!current) return candidate;
  if (candidate.version !== current.version) {
    return candidate.version > current.version ? candidate : current;
  }
  const candidateReportedAt = candidate.reportedAt?.getTime() ?? 0;
  const currentReportedAt = current.reportedAt?.getTime() ?? 0;
  if (candidateReportedAt !== currentReportedAt) {
    return candidateReportedAt > currentReportedAt ? candidate : current;
  }
  if (candidate.createdAt.getTime() !== current.createdAt.getTime()) {
    return candidate.createdAt.getTime() > current.createdAt.getTime() ? candidate : current;
  }
  return candidate.id > current.id ? candidate : current;
}

function collapseResultsByOrder<T extends Omit<PatientResultSummary, 'patientName'>>(
  results: T[],
): T[] {
  const byOrder = new Map<string, T>();

  for (const result of results) {
    byOrder.set(result.orderId, pickPreferredResult(byOrder.get(result.orderId), result));
  }

  return Array.from(byOrder.values());
}

@Injectable()
export class PatientResultsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolvePatientNames(
    tenantId: string,
    patientIds: string[],
  ): Promise<Map<string, string>> {
    const unique = [...new Set(patientIds)];
    if (unique.length === 0) return new Map();

    const patients = await this.prisma.patient.findMany({
      where: { tenantId, id: { in: unique } },
      select: { id: true, firstName: true, lastName: true },
    });

    const map = new Map<string, string>();
    for (const p of patients) {
      map.set(p.id, [p.firstName, p.lastName].filter(Boolean).join(' '));
    }
    return map;
  }

  private async resolveLabSpecimenNumbersByOrder(
    tenantId: string,
    orderIds: string[],
  ): Promise<Map<string, string>> {
    const unique = [...new Set(orderIds)];
    if (unique.length === 0) return new Map();

    const specimenLinks = await this.prisma.labSpecimenTest.findMany({
      where: {
        tenantId,
        labOrderTest: {
          orderId: { in: unique },
        },
      },
      include: {
        labOrderTest: {
          select: {
            orderId: true,
          },
        },
        specimen: {
          select: {
            id: true,
            barcode: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
        { specimen: { createdAt: 'desc' } },
        { id: 'desc' },
      ],
    });

    const map = new Map<string, string>();
    for (const link of specimenLinks) {
      const orderId = link.labOrderTest.orderId;
      if (map.has(orderId)) continue;
      map.set(orderId, link.specimen.barcode || link.specimen.id);
    }
    return map;
  }

  private async resolveLabReportConfigByOrder(
    tenantId: string,
    orderIds: string[],
  ): Promise<Map<string, { reportStyle: string; labDiscipline: string | null }>> {
    const unique = [...new Set(orderIds)];
    if (unique.length === 0) return new Map();

    const orderTests = await this.prisma.labOrderTest.findMany({
      where: {
        tenantId,
        orderId: { in: unique },
      },
      select: {
        orderId: true,
        labTestMasterId: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    const labTestMasterIds = [...new Set(orderTests.map((test) => test.labTestMasterId).filter(Boolean))] as string[];
    const masters = await this.prisma.labTestMaster.findMany({
      where: { id: { in: labTestMasterIds } },
      select: {
        id: true,
        reportStyle: true,
        labDiscipline: true,
      },
    });

    const masterMap = new Map(
      masters.map((master) => [master.id, { reportStyle: master.reportStyle, labDiscipline: master.labDiscipline }]),
    );

    const configMap = new Map<string, { reportStyle: string; labDiscipline: string | null }>();
    for (const orderTest of orderTests) {
      if (configMap.has(orderTest.orderId)) continue;
      const config = orderTest.labTestMasterId ? masterMap.get(orderTest.labTestMasterId) : null;
      configMap.set(orderTest.orderId, config ?? { reportStyle: 'structured', labDiscipline: null });
    }

    return configMap;
  }

  private async buildSearchFilter(
    tenantId: string,
    search: string | undefined,
  ): Promise<Record<string, unknown> | null> {
    if (!search?.trim()) return null;

    const matchingPatients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { mrn: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });

    return {
      OR: [
        { order: { orderName: { contains: search, mode: 'insensitive' } } },
        ...(matchingPatients.length > 0
          ? [{ patientId: { in: matchingPatients.map((p) => p.id) } }]
          : []),
      ],
    };
  }

  async getAll(
    tenantId: string,
    options?: {
      reportType?: string | undefined;
      reportStatus?: string | undefined;
      search?: string | undefined;
      page?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<{ results: PatientResultSummary[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const searchFilter = await this.buildSearchFilter(tenantId, options?.search);

    const results: Omit<PatientResultSummary, 'patientName'>[] = [];

    if (!options?.reportType || options.reportType === 'lab') {
      const where: any = { tenantId, ...(searchFilter ?? {}) };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const labReports = await this.prisma.labReport.findMany({
        where,
        include: {
          order: orderSelect,
          items: { select: { abnormalFlag: true, criticalFlag: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      for (const lr of labReports) {
        results.push({
          id: lr.id,
          reportType: 'lab',
          orderId: lr.orderId,
          orderName: lr.order.orderName,
          orderNameAr: lr.order.orderNameAr,
          patientId: lr.patientId,
          encounterId: lr.encounterId,
          reportStatus: lr.reportStatus,
          reportedAt: lr.reportedAt,
          version: lr.version,
          createdAt: lr.createdAt,
          labSummary: {
            itemCount: lr.items.length,
            abnormalCount: lr.items.filter((i) => i.abnormalFlag).length,
            criticalCount: lr.items.filter((i) => i.criticalFlag).length,
            specimenType: lr.specimenType,
          },
        });
      }

      const pathologyReports = await this.prisma.pathologyReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });
      const pathologyConfigs = await this.resolveLabReportConfigByOrder(
        tenantId,
        pathologyReports.map((report) => report.orderId),
      );

      for (const pr of pathologyReports) {
        const reportConfig = pathologyConfigs.get(pr.orderId);
        results.push({
          id: pr.id,
          reportType: 'lab',
          orderId: pr.orderId,
          orderName: pr.order.orderName,
          orderNameAr: pr.order.orderNameAr,
          patientId: pr.patientId,
          encounterId: pr.encounterId,
          reportStatus: pr.reportStatus,
          reportedAt: pr.reportedAt,
          version: pr.version,
          createdAt: pr.createdAt,
          labSummary: {
            itemCount: 0,
            abnormalCount: 0,
            criticalCount: 0,
            specimenType: pr.specimenType,
            reportStyle: reportConfig?.reportStyle ?? 'narrative',
            labDiscipline: reportConfig?.labDiscipline ?? null,
          },
        });
      }

      const dedupedLabResults = collapseResultsByOrder(
        results.filter((result) => result.reportType === 'lab') as Omit<PatientResultSummary, 'patientName'>[],
      );
      const nonLabResults = results.filter((result) => result.reportType !== 'lab');
      results.length = 0;
      results.push(...nonLabResults, ...dedupedLabResults);
    }

    if (!options?.reportType || options.reportType === 'imaging') {
      const where: any = { tenantId, ...(searchFilter ?? {}) };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const imagingReports = await this.prisma.imagingReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });

      for (const ir of imagingReports) {
        results.push({
          id: ir.id,
          reportType: 'imaging',
          orderId: ir.orderId,
          orderName: ir.order.orderName,
          orderNameAr: ir.order.orderNameAr,
          patientId: ir.patientId,
          encounterId: ir.encounterId,
          reportStatus: ir.reportStatus,
          reportedAt: ir.reportedAt,
          version: ir.version,
          createdAt: ir.createdAt,
          imagingSummary: {
            modality: ir.modality,
            bodyPart: ir.bodyPart,
            impression: ir.impression,
            criticalFinding: ir.criticalFinding,
          },
        });
      }
    }

    if (!options?.reportType || options.reportType === 'procedure') {
      const where: any = { tenantId, ...(searchFilter ?? {}) };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const procedureReports = await this.prisma.procedureReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });

      for (const pr of procedureReports) {
        results.push({
          id: pr.id,
          reportType: 'procedure',
          orderId: pr.orderId,
          orderName: pr.order.orderName,
          orderNameAr: pr.order.orderNameAr,
          patientId: pr.patientId,
          encounterId: pr.encounterId,
          reportStatus: pr.reportStatus,
          reportedAt: pr.reportedAt,
          version: pr.version,
          createdAt: pr.createdAt,
          procedureSummary: {
            procedureDescription: pr.procedureDescription,
            complications: pr.complications,
            durationMinutes: pr.durationMinutes,
          },
        });
      }
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = results.length;
    const paged = results.slice(skip, skip + limit);

    // Resolve patient names for the current page only
    const [nameMap, specimenNumberMap] = await Promise.all([
      this.resolvePatientNames(
        tenantId,
        paged.map((r) => r.patientId),
      ),
      this.resolveLabSpecimenNumbersByOrder(
        tenantId,
        paged.filter((r) => r.reportType === 'lab').map((r) => r.orderId),
      ),
    ]);

    const withNames: PatientResultSummary[] = paged.map((r) => ({
      ...r,
      patientName: nameMap.get(r.patientId) || 'Unknown',
      ...(r.reportType === 'lab' && r.labSummary
        ? {
            labSummary: {
              ...r.labSummary,
              specimenNumber: specimenNumberMap.get(r.orderId) ?? null,
            },
          }
        : {}),
    }));

    return { results: withNames, total };
  }

  async getByPatient(
    tenantId: string,
    patientId: string,
    options?: {
      reportType?: string | undefined;
      reportStatus?: string | undefined;
      page?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<{ results: PatientResultSummary[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const results: Omit<PatientResultSummary, 'patientName'>[] = [];

    if (!options?.reportType || options.reportType === 'lab') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const labReports = await this.prisma.labReport.findMany({
        where,
        include: {
          order: orderSelect,
          items: { select: { abnormalFlag: true, criticalFlag: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      for (const lr of labReports) {
        results.push({
          id: lr.id,
          reportType: 'lab',
          orderId: lr.orderId,
          orderName: lr.order.orderName,
          orderNameAr: lr.order.orderNameAr,
          patientId: lr.patientId,
          encounterId: lr.encounterId,
          reportStatus: lr.reportStatus,
          reportedAt: lr.reportedAt,
          version: lr.version,
          createdAt: lr.createdAt,
          labSummary: {
            itemCount: lr.items.length,
            abnormalCount: lr.items.filter((i) => i.abnormalFlag).length,
            criticalCount: lr.items.filter((i) => i.criticalFlag).length,
            specimenType: lr.specimenType,
          },
        });
      }

      const pathologyReports = await this.prisma.pathologyReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });
      const pathologyConfigs = await this.resolveLabReportConfigByOrder(
        tenantId,
        pathologyReports.map((report) => report.orderId),
      );

      for (const pr of pathologyReports) {
        const reportConfig = pathologyConfigs.get(pr.orderId);
        results.push({
          id: pr.id,
          reportType: 'lab',
          orderId: pr.orderId,
          orderName: pr.order.orderName,
          orderNameAr: pr.order.orderNameAr,
          patientId: pr.patientId,
          encounterId: pr.encounterId,
          reportStatus: pr.reportStatus,
          reportedAt: pr.reportedAt,
          version: pr.version,
          createdAt: pr.createdAt,
          labSummary: {
            itemCount: 0,
            abnormalCount: 0,
            criticalCount: 0,
            specimenType: pr.specimenType,
            reportStyle: reportConfig?.reportStyle ?? 'narrative',
            labDiscipline: reportConfig?.labDiscipline ?? null,
          },
        });
      }

      const dedupedLabResults = collapseResultsByOrder(
        results.filter((result) => result.reportType === 'lab') as Omit<PatientResultSummary, 'patientName'>[],
      );
      const nonLabResults = results.filter((result) => result.reportType !== 'lab');
      results.length = 0;
      results.push(...nonLabResults, ...dedupedLabResults);
    }

    if (!options?.reportType || options.reportType === 'imaging') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const imagingReports = await this.prisma.imagingReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });

      for (const ir of imagingReports) {
        results.push({
          id: ir.id,
          reportType: 'imaging',
          orderId: ir.orderId,
          orderName: ir.order.orderName,
          orderNameAr: ir.order.orderNameAr,
          patientId: ir.patientId,
          encounterId: ir.encounterId,
          reportStatus: ir.reportStatus,
          reportedAt: ir.reportedAt,
          version: ir.version,
          createdAt: ir.createdAt,
          imagingSummary: {
            modality: ir.modality,
            bodyPart: ir.bodyPart,
            impression: ir.impression,
            criticalFinding: ir.criticalFinding,
          },
        });
      }
    }

    if (!options?.reportType || options.reportType === 'procedure') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const procedureReports = await this.prisma.procedureReport.findMany({
        where,
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      });

      for (const pr of procedureReports) {
        results.push({
          id: pr.id,
          reportType: 'procedure',
          orderId: pr.orderId,
          orderName: pr.order.orderName,
          orderNameAr: pr.order.orderNameAr,
          patientId: pr.patientId,
          encounterId: pr.encounterId,
          reportStatus: pr.reportStatus,
          reportedAt: pr.reportedAt,
          version: pr.version,
          createdAt: pr.createdAt,
          procedureSummary: {
            procedureDescription: pr.procedureDescription,
            complications: pr.complications,
            durationMinutes: pr.durationMinutes,
          },
        });
      }
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = results.length;
    const paged = results.slice(skip, skip + limit);

    const [nameMap, specimenNumberMap] = await Promise.all([
      this.resolvePatientNames(
        tenantId,
        paged.map((r) => r.patientId),
      ),
      this.resolveLabSpecimenNumbersByOrder(
        tenantId,
        paged.filter((r) => r.reportType === 'lab').map((r) => r.orderId),
      ),
    ]);

    const withNames: PatientResultSummary[] = paged.map((r) => ({
      ...r,
      patientName: nameMap.get(r.patientId) || 'Unknown',
      ...(r.reportType === 'lab' && r.labSummary
        ? {
            labSummary: {
              ...r.labSummary,
              specimenNumber: specimenNumberMap.get(r.orderId) ?? null,
            },
          }
        : {}),
    }));

    return { results: withNames, total };
  }

  async getByEncounter(tenantId: string, encounterId: string): Promise<PatientResultSummary[]> {
    const partial: Omit<PatientResultSummary, 'patientName'>[] = [];

    const [labReports, pathologyReports, imagingReports, procedureReports] = await Promise.all([
      this.prisma.labReport.findMany({
        where: { tenantId, encounterId },
        include: {
          order: orderSelect,
          items: { select: { abnormalFlag: true, criticalFlag: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pathologyReport.findMany({
        where: { tenantId, encounterId },
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.imagingReport.findMany({
        where: { tenantId, encounterId },
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.procedureReport.findMany({
        where: { tenantId, encounterId },
        include: { order: orderSelect },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    const pathologyConfigs = await this.resolveLabReportConfigByOrder(
      tenantId,
      pathologyReports.map((report) => report.orderId),
    );

    for (const lr of labReports) {
      partial.push({
        id: lr.id,
        reportType: 'lab',
        orderId: lr.orderId,
        orderName: lr.order.orderName,
        orderNameAr: lr.order.orderNameAr,
        patientId: lr.patientId,
        encounterId: lr.encounterId,
        reportStatus: lr.reportStatus,
        reportedAt: lr.reportedAt,
        version: lr.version,
        createdAt: lr.createdAt,
        labSummary: {
          itemCount: lr.items.length,
          abnormalCount: lr.items.filter((i: { abnormalFlag: boolean }) => i.abnormalFlag).length,
          criticalCount: lr.items.filter((i: { criticalFlag: boolean }) => i.criticalFlag).length,
          specimenType: lr.specimenType,
        },
      });
    }

    for (const pr of pathologyReports) {
      const reportConfig = pathologyConfigs.get(pr.orderId);
      partial.push({
        id: pr.id,
        reportType: 'lab',
        orderId: pr.orderId,
        orderName: pr.order.orderName,
        orderNameAr: pr.order.orderNameAr,
        patientId: pr.patientId,
        encounterId: pr.encounterId,
        reportStatus: pr.reportStatus,
        reportedAt: pr.reportedAt,
        version: pr.version,
        createdAt: pr.createdAt,
        labSummary: {
          itemCount: 0,
          abnormalCount: 0,
          criticalCount: 0,
          specimenType: pr.specimenType,
          reportStyle: reportConfig?.reportStyle ?? 'narrative',
          labDiscipline: reportConfig?.labDiscipline ?? null,
        },
      });
    }

    const dedupedLabResults = collapseResultsByOrder(
      partial.filter((result) => result.reportType === 'lab') as Omit<PatientResultSummary, 'patientName'>[],
    );
    const nonLabResults = partial.filter((result) => result.reportType !== 'lab');
    partial.length = 0;
    partial.push(...nonLabResults, ...dedupedLabResults);

    for (const ir of imagingReports) {
      partial.push({
        id: ir.id,
        reportType: 'imaging',
        orderId: ir.orderId,
        orderName: ir.order.orderName,
        orderNameAr: ir.order.orderNameAr,
        patientId: ir.patientId,
        encounterId: ir.encounterId,
        reportStatus: ir.reportStatus,
        reportedAt: ir.reportedAt,
        version: ir.version,
        createdAt: ir.createdAt,
        imagingSummary: {
          modality: ir.modality,
          bodyPart: ir.bodyPart,
          impression: ir.impression,
          criticalFinding: ir.criticalFinding,
        },
      });
    }

    for (const pr of procedureReports) {
      partial.push({
        id: pr.id,
        reportType: 'procedure',
        orderId: pr.orderId,
        orderName: pr.order.orderName,
        orderNameAr: pr.order.orderNameAr,
        patientId: pr.patientId,
        encounterId: pr.encounterId,
        reportStatus: pr.reportStatus,
        reportedAt: pr.reportedAt,
        version: pr.version,
        createdAt: pr.createdAt,
        procedureSummary: {
          procedureDescription: pr.procedureDescription,
          complications: pr.complications,
          durationMinutes: pr.durationMinutes,
        },
      });
    }

    partial.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const [nameMap, specimenNumberMap] = await Promise.all([
      this.resolvePatientNames(
        tenantId,
        partial.map((r) => r.patientId),
      ),
      this.resolveLabSpecimenNumbersByOrder(
        tenantId,
        partial.filter((r) => r.reportType === 'lab').map((r) => r.orderId),
      ),
    ]);

    return partial.map((r) => ({
      ...r,
      patientName: nameMap.get(r.patientId) || 'Unknown',
      ...(r.reportType === 'lab' && r.labSummary
        ? {
            labSummary: {
              ...r.labSummary,
              specimenNumber: specimenNumberMap.get(r.orderId) ?? null,
            },
          }
        : {}),
    }));
  }

  /**
   * Get orders of a given type that do NOT yet have a report.
   * Used by the "New Report" dialog on listing pages.
   */
  async getReportableOrders(
    tenantId: string,
    orderType: string,
    options?: { search?: string; limit?: number },
  ): Promise<
    {
      id: string;
      orderName: string;
      orderNameAr: string | null;
      patientId: string;
      patientName: string;
      encounterId: string;
      status: string;
      orderedAt: Date;
    }[]
  > {
    const limit = options?.limit || 50;

    // Get all order IDs that already have a report for this type
    let existingOrderIds: string[] = [];
    if (orderType === 'lab') {
      const [structuredExisting, pathologyExisting] = await Promise.all([
        this.prisma.labReport.findMany({
          where: { tenantId },
          select: { orderId: true },
          distinct: ['orderId'],
        }),
        this.prisma.pathologyReport.findMany({
          where: { tenantId },
          select: { orderId: true },
          distinct: ['orderId'],
        }),
      ]);
      existingOrderIds = [
        ...structuredExisting.map((r: { orderId: string }) => r.orderId),
        ...pathologyExisting.map((r: { orderId: string }) => r.orderId),
      ];
    } else if (orderType === 'imaging') {
      const existing = await this.prisma.imagingReport.findMany({
        where: { tenantId },
        select: { orderId: true },
        distinct: ['orderId'],
      });
      existingOrderIds = existing.map((r) => r.orderId);
    } else if (orderType === 'procedure') {
      const existing = await this.prisma.procedureReport.findMany({
        where: { tenantId },
        select: { orderId: true },
        distinct: ['orderId'],
      });
      existingOrderIds = existing.map((r) => r.orderId);
    }

    const where: any = {
      tenantId,
      orderType,
      status: { notIn: ['cancelled'] },
    };

    if (existingOrderIds.length > 0) {
      where.id = { notIn: existingOrderIds };
    }

    if (options?.search) {
      where.orderName = { contains: options.search, mode: 'insensitive' };
    }

    const orders = await this.prisma.clinicalOrder.findMany({
      where,
      select: {
        id: true,
        orderName: true,
        orderNameAr: true,
        patientId: true,
        encounterId: true,
        status: true,
        orderedAt: true,
      },
      orderBy: { orderedAt: 'desc' },
      take: limit,
    });

    const nameMap = await this.resolvePatientNames(
      tenantId,
      orders.map((o) => o.patientId),
    );

    return orders.map((o) => ({
      id: o.id,
      orderName: o.orderName,
      orderNameAr: o.orderNameAr,
      patientId: o.patientId,
      patientName: nameMap.get(o.patientId) || 'Unknown',
      encounterId: o.encounterId,
      status: o.status,
      orderedAt: o.orderedAt,
    }));
  }
}
