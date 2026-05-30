import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreatePathologyReportDto, UpdatePathologyReportDto } from '../dto/pathology-report.dto';
import { ReportStatus, ReportType } from '../dto/report-status.dto';
import { ReportStatusService } from './report-status.service';

@Injectable()
export class PathologyReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportStatusService: ReportStatusService,
  ) {}

  private async getPrimaryLabTestConfig(
    tenantId: string,
    orderId: string,
  ): Promise<{ reportStyle: string; labDiscipline: string | null }> {
    const orderTest = await this.prisma.labOrderTest.findFirst({
      where: { tenantId, orderId },
      orderBy: { sortOrder: 'asc' },
    });

    if (!orderTest?.labTestMasterId) {
      return { reportStyle: 'structured', labDiscipline: null };
    }

    const master = await this.prisma.labTestMaster.findUnique({
      where: { id: orderTest.labTestMasterId },
      select: {
        reportStyle: true,
        labDiscipline: true,
      },
    });

    return {
      reportStyle: master?.reportStyle ?? 'structured',
      labDiscipline: master?.labDiscipline ?? null,
    };
  }

  async create(tenantId: string, userId: string, dto: CreatePathologyReportDto) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id: dto.orderId, tenantId, orderType: 'lab' },
    });
    if (!order) {
      throw new NotFoundException(`Lab order ${dto.orderId} not found`);
    }

    const reportConfig = await this.getPrimaryLabTestConfig(tenantId, dto.orderId);
    if (reportConfig.reportStyle !== 'narrative') {
      throw new BadRequestException('Pathology reports are only supported for narrative lab tests');
    }

    const existing = await this.prisma.pathologyReport.findFirst({
      where: {
        tenantId,
        orderId: dto.orderId,
        reportStatus: { in: [ReportStatus.DRAFT, ReportStatus.PRELIMINARY] },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });
    if (existing) {
      return existing;
    }

    const report = await this.prisma.pathologyReport.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        encounterId: order.encounterId,
        patientId: order.patientId,
        specimenType: dto.specimenType ?? null,
        collectionDate: dto.collectionDate ? new Date(dto.collectionDate) : null,
        receivedDate: dto.receivedDate ? new Date(dto.receivedDate) : null,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PATHOLOGY,
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
    const report = await this.prisma.pathologyReport.findFirst({
      where: { id, tenantId },
    });
    if (!report) {
      throw new NotFoundException(`Pathology report ${id} not found`);
    }
    return report;
  }

  async findByOrder(tenantId: string, orderId: string) {
    return this.prisma.pathologyReport.findMany({
      where: { tenantId, orderId },
      orderBy: [{ version: 'desc' }, { updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdatePathologyReportDto) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.DRAFT && report.reportStatus !== ReportStatus.PRELIMINARY) {
      throw new BadRequestException('Can only update DRAFT or PRELIMINARY reports');
    }

    const data: Record<string, any> = { updatedBy: userId };
    if (dto.specimenType !== undefined) data.specimenType = dto.specimenType ?? null;
    if (dto.collectionDate !== undefined) {
      data.collectionDate = dto.collectionDate ? new Date(dto.collectionDate) : null;
    }
    if (dto.receivedDate !== undefined) {
      data.receivedDate = dto.receivedDate ? new Date(dto.receivedDate) : null;
    }
    if (dto.clinicalHistory !== undefined) data.clinicalHistory = dto.clinicalHistory ?? null;
    if (dto.specimenReceived !== undefined) data.specimenReceived = dto.specimenReceived ?? null;
    if (dto.grossDescription !== undefined) data.grossDescription = dto.grossDescription ?? null;
    if (dto.microscopicDescription !== undefined) {
      data.microscopicDescription = dto.microscopicDescription ?? null;
    }
    if (dto.diagnosis !== undefined) data.diagnosis = dto.diagnosis ?? null;
    if (dto.comment !== undefined) data.comment = dto.comment ?? null;
    if (dto.internalNotes !== undefined) data.internalNotes = dto.internalNotes ?? null;

    return this.prisma.pathologyReport.update({
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

    const data: Record<string, any> = {
      reportStatus: toStatus,
      updatedBy: userId,
    };

    if (toStatus === ReportStatus.FINAL || toStatus === ReportStatus.PRELIMINARY) {
      data.reportedAt = new Date();
      data.reportedBy = userId;
    }

    const updated = await this.prisma.pathologyReport.update({
      where: { id },
      data,
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PATHOLOGY,
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

    return this.prisma.pathologyReport.update({
      where: { id },
      data: {
        verifiedBy: userId,
        verifiedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async amend(tenantId: string, id: string, userId: string, reason: string) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.FINAL) {
      throw new BadRequestException('Can only amend FINAL reports');
    }

    await this.prisma.pathologyReport.update({
      where: { id },
      data: { reportStatus: ReportStatus.AMENDED, updatedBy: userId },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PATHOLOGY,
      reportId: id,
      fromStatus: ReportStatus.FINAL,
      toStatus: ReportStatus.AMENDED,
      changedBy: userId,
      reason,
      version: report.version,
    });

    const newReport = await this.prisma.pathologyReport.create({
      data: {
        tenantId,
        orderId: report.orderId,
        encounterId: report.encounterId,
        patientId: report.patientId,
        reportStatus: ReportStatus.DRAFT,
        version: report.version + 1,
        previousVersionId: id,
        specimenType: report.specimenType,
        collectionDate: report.collectionDate,
        receivedDate: report.receivedDate,
        clinicalHistory: report.clinicalHistory,
        specimenReceived: report.specimenReceived,
        grossDescription: report.grossDescription,
        microscopicDescription: report.microscopicDescription,
        diagnosis: report.diagnosis,
        comment: report.comment,
        internalNotes: report.internalNotes,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PATHOLOGY,
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
    return this.reportStatusService.getHistory(tenantId, ReportType.PATHOLOGY, id);
  }
}
