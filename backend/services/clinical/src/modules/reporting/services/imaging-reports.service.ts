import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateImagingReportDto, UpdateImagingReportDto } from '../dto/imaging-report.dto';
import { ReportStatus, ReportType } from '../dto/report-status.dto';
import { ReportStatusService } from './report-status.service';

@Injectable()
export class ImagingReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportStatusService: ReportStatusService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateImagingReportDto) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id: dto.orderId, tenantId, orderType: 'imaging' },
    });
    if (!order) {
      throw new NotFoundException(`Imaging order ${dto.orderId} not found`);
    }

    const existing = await this.prisma.imagingReport.findFirst({
      where: {
        tenantId,
        orderId: dto.orderId,
        reportStatus: { in: [ReportStatus.DRAFT, ReportStatus.PRELIMINARY] },
      },
    });
    if (existing) {
      throw new BadRequestException('An active imaging report already exists for this order');
    }

    const report = await this.prisma.imagingReport.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        encounterId: order.encounterId,
        patientId: order.patientId,
        modality: dto.modality ?? null,
        bodyPart: dto.bodyPart ?? null,
        accessionNumber: dto.accessionNumber ?? null,
        studyInstanceUid: dto.studyInstanceUid ?? null,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.IMAGING,
      reportId: report.id,
      fromStatus: null,
      toStatus: ReportStatus.DRAFT,
      changedBy: userId,
      version: 1,
    });

    await this.reportStatusService.syncOrderStatus(tenantId, dto.orderId, ReportStatus.DRAFT);

    return report;
  }

  async findById(tenantId: string, id: string) {
    const report = await this.prisma.imagingReport.findFirst({
      where: { id, tenantId },
    });
    if (!report) {
      throw new NotFoundException(`Imaging report ${id} not found`);
    }
    return report;
  }

  async findByOrder(tenantId: string, orderId: string) {
    return this.prisma.imagingReport.findMany({
      where: { tenantId, orderId },
      orderBy: { version: 'desc' },
    });
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateImagingReportDto) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.DRAFT && report.reportStatus !== ReportStatus.PRELIMINARY) {
      throw new BadRequestException('Can only update DRAFT or PRELIMINARY reports');
    }

    const data: Record<string, any> = { updatedBy: userId };
    if (dto.technique !== undefined) data.technique = dto.technique ?? null;
    if (dto.comparison !== undefined) data.comparison = dto.comparison ?? null;
    if (dto.findings !== undefined) data.findings = dto.findings ?? null;
    if (dto.impression !== undefined) data.impression = dto.impression ?? null;
    if (dto.recommendations !== undefined) data.recommendations = dto.recommendations ?? null;
    if (dto.criticalFinding !== undefined) data.criticalFinding = dto.criticalFinding ?? false;
    if (dto.comments !== undefined) data.comments = dto.comments ?? null;
    if (dto.accessionNumber !== undefined) data.accessionNumber = dto.accessionNumber ?? null;
    if (dto.studyInstanceUid !== undefined) data.studyInstanceUid = dto.studyInstanceUid ?? null;
    if (dto.reportContent !== undefined) data.reportContent = dto.reportContent ?? null;

    return this.prisma.imagingReport.update({
      where: { id },
      data,
    });
  }

  async transitionStatus(
    tenantId: string,
    id: string,
    userId: string,
    toStatus: ReportStatus,
    reason?: string,
  ) {
    const report = await this.findById(tenantId, id);
    this.reportStatusService.validateTransition(report.reportStatus, toStatus);

    if ((toStatus === ReportStatus.AMENDED || toStatus === ReportStatus.CORRECTED) && !reason) {
      throw new BadRequestException('Reason is required for amendments and corrections');
    }

    const data: any = { reportStatus: toStatus, updatedBy: userId };

    if (toStatus === ReportStatus.FINAL || toStatus === ReportStatus.PRELIMINARY) {
      data.reportedAt = new Date();
      data.reportedBy = userId;
    }

    const updated = await this.prisma.imagingReport.update({
      where: { id },
      data,
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.IMAGING,
      reportId: id,
      fromStatus: report.reportStatus,
      toStatus,
      changedBy: userId,
      reason,
      version: report.version,
    });

    await this.reportStatusService.syncOrderStatus(tenantId, report.orderId, toStatus);

    return updated;
  }

  async verify(tenantId: string, id: string, userId: string) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.PRELIMINARY && report.reportStatus !== ReportStatus.FINAL) {
      throw new BadRequestException('Can only verify PRELIMINARY or FINAL reports');
    }

    return this.prisma.imagingReport.update({
      where: { id },
      data: {
        reviewedBy: userId,
        reviewedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async recordCriticalFinding(tenantId: string, id: string, userId: string, notifiedTo: string) {
    const report = await this.findById(tenantId, id);
    if (!report.criticalFinding) {
      throw new BadRequestException('Report is not flagged as having a critical finding');
    }

    return this.prisma.imagingReport.update({
      where: { id },
      data: {
        criticalFindingNotifiedTo: notifiedTo,
        criticalFindingNotifiedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async acknowledgeCriticalFinding(tenantId: string, id: string) {
    const report = await this.findById(tenantId, id);
    if (!report.criticalFindingNotifiedAt) {
      throw new BadRequestException('Critical finding has not been notified yet');
    }

    return this.prisma.imagingReport.update({
      where: { id },
      data: { criticalFindingAcknowledgedAt: new Date() },
    });
  }

  async amend(tenantId: string, id: string, userId: string, reason: string) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.FINAL) {
      throw new BadRequestException('Can only amend FINAL reports');
    }

    await this.prisma.imagingReport.update({
      where: { id },
      data: { reportStatus: ReportStatus.AMENDED, updatedBy: userId },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.IMAGING,
      reportId: id,
      fromStatus: ReportStatus.FINAL,
      toStatus: ReportStatus.AMENDED,
      changedBy: userId,
      reason,
      version: report.version,
    });

    const newReport = await this.prisma.imagingReport.create({
      data: {
        tenantId,
        orderId: report.orderId,
        encounterId: report.encounterId,
        patientId: report.patientId,
        reportStatus: ReportStatus.DRAFT,
        version: report.version + 1,
        previousVersionId: id,
        modality: report.modality,
        bodyPart: report.bodyPart,
        technique: report.technique,
        comparison: report.comparison,
        findings: report.findings,
        impression: report.impression,
        recommendations: report.recommendations,
        criticalFinding: report.criticalFinding,
        accessionNumber: report.accessionNumber,
        studyInstanceUid: report.studyInstanceUid,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.IMAGING,
      reportId: newReport.id,
      fromStatus: null,
      toStatus: ReportStatus.DRAFT,
      changedBy: userId,
      reason: `Amendment of version ${report.version}: ${reason}`,
      version: newReport.version,
    });

    return newReport;
  }

  async getHistory(tenantId: string, id: string) {
    return this.reportStatusService.getHistory(tenantId, ReportType.IMAGING, id);
  }
}
