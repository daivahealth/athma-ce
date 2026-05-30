import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateLabReportDto, UpdateLabReportDto, LabResultItemDto } from '../dto/lab-report.dto';
import { ReportStatus, ReportType } from '../dto/report-status.dto';
import { ReportStatusService } from './report-status.service';

@Injectable()
export class LabReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportStatusService: ReportStatusService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateLabReportDto) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id: dto.orderId, tenantId, orderType: 'lab' },
    });
    if (!order) {
      throw new NotFoundException(`Lab order ${dto.orderId} not found`);
    }

    const existing = await this.prisma.labReport.findFirst({
      where: {
        tenantId,
        orderId: dto.orderId,
        reportStatus: { in: [ReportStatus.DRAFT, ReportStatus.PRELIMINARY] },
      },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });
    if (existing) {
      return existing;
    }

    const report = await this.prisma.labReport.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        encounterId: order.encounterId,
        patientId: order.patientId,
        specimenType: dto.specimenType ?? null,
        collectionDate: dto.collectionDate ? new Date(dto.collectionDate) : null,
        receivedDate: dto.receivedDate ? new Date(dto.receivedDate) : null,
        comments: dto.comments ?? null,
        internalNotes: dto.internalNotes ?? null,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.LAB,
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
    const report = await this.prisma.labReport.findFirst({
      where: { id, tenantId },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!report) {
      throw new NotFoundException(`Lab report ${id} not found`);
    }
    return report;
  }

  async findByOrder(tenantId: string, orderId: string) {
    return this.prisma.labReport.findMany({
      where: { tenantId, orderId },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ version: 'desc' }, { updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateLabReportDto) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.DRAFT && report.reportStatus !== ReportStatus.PRELIMINARY) {
      throw new BadRequestException('Can only update DRAFT or PRELIMINARY reports');
    }

    return this.prisma.labReport.update({
      where: { id },
      data: {
        ...(dto.specimenType !== undefined ? { specimenType: dto.specimenType } : {}),
        ...(dto.comments !== undefined ? { comments: dto.comments } : {}),
        ...(dto.internalNotes !== undefined ? { internalNotes: dto.internalNotes } : {}),
        ...(dto.collectionDate !== undefined ? { collectionDate: dto.collectionDate ? new Date(dto.collectionDate) : null } : {}),
        ...(dto.receivedDate !== undefined ? { receivedDate: dto.receivedDate ? new Date(dto.receivedDate) : null } : {}),
        updatedBy: userId,
      },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async saveItems(tenantId: string, reportId: string, userId: string, items: LabResultItemDto[]) {
    const report = await this.findById(tenantId, reportId);
    if (report.reportStatus !== ReportStatus.DRAFT && report.reportStatus !== ReportStatus.PRELIMINARY) {
      throw new BadRequestException('Can only modify items on DRAFT or PRELIMINARY reports');
    }

    // Delete existing items and re-create (simpler than individual upserts for batch)
    await this.prisma.labResultItem.deleteMany({
      where: { labReportId: reportId, tenantId },
    });

    const created = await Promise.all(
      items.map((item, index) =>
        this.prisma.labResultItem.create({
          data: {
            tenantId,
            labReportId: reportId,
            sortOrder: item.sortOrder ?? index,
            testCode: item.testCode,
            codeSystem: item.codeSystem || 'LOINC',
            testName: item.testName,
            testNameAr: item.testNameAr ?? null,
            valueNumeric: item.valueNumeric ?? null,
            valueString: item.valueString ?? null,
            valueCode: item.valueCode ?? null,
            unit: item.unit ?? null,
            refRangeLow: item.refRangeLow ?? null,
            refRangeHigh: item.refRangeHigh ?? null,
            refRangeText: item.refRangeText ?? null,
            interpretation: item.interpretation ?? null,
            abnormalFlag: item.abnormalFlag ?? false,
            criticalFlag: item.criticalFlag ?? false,
            comment: item.comment ?? null,
          },
        }),
      ),
    );

    await this.prisma.labReport.update({
      where: { id: reportId },
      data: { updatedBy: userId },
    });

    return created;
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

    const updated = await this.prisma.labReport.update({
      where: { id },
      data,
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.LAB,
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

    return this.prisma.labReport.update({
      where: { id },
      data: {
        verifiedBy: userId,
        verifiedAt: new Date(),
        updatedBy: userId,
      },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async amend(tenantId: string, id: string, userId: string, reason: string) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.FINAL) {
      throw new BadRequestException('Can only amend FINAL reports');
    }

    // Mark current report as amended
    await this.prisma.labReport.update({
      where: { id },
      data: { reportStatus: ReportStatus.AMENDED, updatedBy: userId },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.LAB,
      reportId: id,
      fromStatus: ReportStatus.FINAL,
      toStatus: ReportStatus.AMENDED,
      changedBy: userId,
      reason,
      version: report.version,
    });

    // Create new version as DRAFT with cloned items
    const newReport = await this.prisma.labReport.create({
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
        comments: report.comments,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    // Clone items to new report
    if (report.items.length > 0) {
      await Promise.all(
        report.items.map((item) =>
          this.prisma.labResultItem.create({
            data: {
              tenantId,
              labReportId: newReport.id,
              sortOrder: item.sortOrder,
              testCode: item.testCode,
              codeSystem: item.codeSystem,
              testName: item.testName,
              testNameAr: item.testNameAr,
              valueNumeric: item.valueNumeric,
              valueString: item.valueString,
              valueCode: item.valueCode,
              unit: item.unit,
              refRangeLow: item.refRangeLow,
              refRangeHigh: item.refRangeHigh,
              refRangeText: item.refRangeText,
              interpretation: item.interpretation,
              abnormalFlag: item.abnormalFlag,
              criticalFlag: item.criticalFlag,
              comment: item.comment,
            },
          }),
        ),
      );
    }

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.LAB,
      reportId: newReport.id,
      fromStatus: null,
      toStatus: ReportStatus.DRAFT,
      changedBy: userId,
      reason: `Amendment of version ${report.version}: ${reason}`,
      version: newReport.version,
    });

    return this.findById(tenantId, newReport.id);
  }

  async getHistory(tenantId: string, id: string) {
    return this.reportStatusService.getHistory(tenantId, ReportType.LAB, id);
  }
}
