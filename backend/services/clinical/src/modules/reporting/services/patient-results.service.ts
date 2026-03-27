import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface PatientResultSummary {
  id: string;
  reportType: 'lab' | 'imaging' | 'procedure';
  orderId: string;
  orderName: string;
  orderNameAr?: string | null;
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

@Injectable()
export class PatientResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByPatient(
    tenantId: string,
    patientId: string,
    options?: {
      reportType?: string;
      reportStatus?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ results: PatientResultSummary[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const results: PatientResultSummary[] = [];

    // Fetch lab reports
    if (!options?.reportType || options.reportType === 'lab') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const labReports = await this.prisma.labReport.findMany({
        where,
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
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
    }

    // Fetch imaging reports
    if (!options?.reportType || options.reportType === 'imaging') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const imagingReports = await this.prisma.imagingReport.findMany({
        where,
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      for (const ir of imagingReports) {
        results.push({
          id: ir.id,
          reportType: 'imaging',
          orderId: ir.orderId,
          orderName: ir.order.orderName,
          orderNameAr: ir.order.orderNameAr,
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

    // Fetch procedure reports
    if (!options?.reportType || options.reportType === 'procedure') {
      const where: any = { tenantId, patientId };
      if (options?.reportStatus) where.reportStatus = options.reportStatus;

      const procedureReports = await this.prisma.procedureReport.findMany({
        where,
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      for (const pr of procedureReports) {
        results.push({
          id: pr.id,
          reportType: 'procedure',
          orderId: pr.orderId,
          orderName: pr.order.orderName,
          orderNameAr: pr.order.orderNameAr,
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

    // Sort all results by date descending
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = results.length;
    const paged = results.slice(skip, skip + limit);

    return { results: paged, total };
  }

  async getByEncounter(tenantId: string, encounterId: string): Promise<PatientResultSummary[]> {
    const results: PatientResultSummary[] = [];

    const [labReports, imagingReports, procedureReports] = await Promise.all([
      this.prisma.labReport.findMany({
        where: { tenantId, encounterId },
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
          items: { select: { abnormalFlag: true, criticalFlag: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.imagingReport.findMany({
        where: { tenantId, encounterId },
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.procedureReport.findMany({
        where: { tenantId, encounterId },
        include: {
          order: { select: { orderName: true, orderNameAr: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    for (const lr of labReports) {
      results.push({
        id: lr.id,
        reportType: 'lab',
        orderId: lr.orderId,
        orderName: lr.order.orderName,
        orderNameAr: lr.order.orderNameAr,
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

    for (const ir of imagingReports) {
      results.push({
        id: ir.id,
        reportType: 'imaging',
        orderId: ir.orderId,
        orderName: ir.order.orderName,
        orderNameAr: ir.order.orderNameAr,
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
      results.push({
        id: pr.id,
        reportType: 'procedure',
        orderId: pr.orderId,
        orderName: pr.order.orderName,
        orderNameAr: pr.order.orderNameAr,
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

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return results;
  }
}
