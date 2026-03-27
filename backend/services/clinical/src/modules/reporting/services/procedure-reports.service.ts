import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateProcedureReportDto, UpdateProcedureReportDto } from '../dto/procedure-report.dto';
import { ReportStatus, ReportType } from '../dto/report-status.dto';
import { ReportStatusService } from './report-status.service';

@Injectable()
export class ProcedureReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportStatusService: ReportStatusService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateProcedureReportDto) {
    const order = await this.prisma.clinicalOrder.findFirst({
      where: { id: dto.orderId, tenantId, orderType: 'procedure' },
    });
    if (!order) {
      throw new NotFoundException(`Procedure order ${dto.orderId} not found`);
    }

    const existing = await this.prisma.procedureReport.findFirst({
      where: {
        tenantId,
        orderId: dto.orderId,
        reportStatus: { in: [ReportStatus.DRAFT, ReportStatus.PRELIMINARY] },
      },
    });
    if (existing) {
      throw new BadRequestException('An active procedure report already exists for this order');
    }

    const report = await this.prisma.procedureReport.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        encounterId: order.encounterId,
        patientId: order.patientId,
        indication: dto.indication ?? null,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PROCEDURE,
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
    const report = await this.prisma.procedureReport.findFirst({
      where: { id, tenantId },
    });
    if (!report) {
      throw new NotFoundException(`Procedure report ${id} not found`);
    }
    return report;
  }

  async findByOrder(tenantId: string, orderId: string) {
    return this.prisma.procedureReport.findMany({
      where: { tenantId, orderId },
      orderBy: { version: 'desc' },
    });
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateProcedureReportDto) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.DRAFT && report.reportStatus !== ReportStatus.PRELIMINARY) {
      throw new BadRequestException('Can only update DRAFT or PRELIMINARY reports');
    }

    const data: Record<string, any> = { updatedBy: userId };
    if (dto.indication !== undefined) data.indication = dto.indication;
    if (dto.procedureDescription !== undefined) data.procedureDescription = dto.procedureDescription;
    if (dto.findings !== undefined) data.findings = dto.findings;
    if (dto.complications !== undefined) data.complications = dto.complications;
    if (dto.specimens !== undefined) data.specimens = dto.specimens;
    if (dto.postProcedureInstructions !== undefined) data.postProcedureInstructions = dto.postProcedureInstructions;
    if (dto.anesthesiaType !== undefined) data.anesthesiaType = dto.anesthesiaType;
    if (dto.anesthesiaProvider !== undefined) data.anesthesiaProvider = dto.anesthesiaProvider;
    if (dto.startTime !== undefined) data.startTime = dto.startTime ? new Date(dto.startTime) : null;
    if (dto.endTime !== undefined) data.endTime = dto.endTime ? new Date(dto.endTime) : null;
    if (dto.durationMinutes !== undefined) data.durationMinutes = dto.durationMinutes;
    if (dto.primaryPerformer !== undefined) data.primaryPerformer = dto.primaryPerformer;
    if (dto.assistants !== undefined) data.assistants = dto.assistants;
    if (dto.estimatedBloodLoss !== undefined) data.estimatedBloodLoss = dto.estimatedBloodLoss;
    if (dto.implantsUsed !== undefined) data.implantsUsed = dto.implantsUsed;
    if (dto.comments !== undefined) data.comments = dto.comments;

    return this.prisma.procedureReport.update({
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

    const updated = await this.prisma.procedureReport.update({
      where: { id },
      data,
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PROCEDURE,
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

    return this.prisma.procedureReport.update({
      where: { id },
      data: {
        reportedBy: userId,
        reportedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async amend(tenantId: string, id: string, userId: string, reason: string) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== ReportStatus.FINAL) {
      throw new BadRequestException('Can only amend FINAL reports');
    }

    await this.prisma.procedureReport.update({
      where: { id },
      data: { reportStatus: ReportStatus.AMENDED, updatedBy: userId },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PROCEDURE,
      reportId: id,
      fromStatus: ReportStatus.FINAL,
      toStatus: ReportStatus.AMENDED,
      changedBy: userId,
      reason,
      version: report.version,
    });

    const newReport = await this.prisma.procedureReport.create({
      data: {
        tenantId,
        orderId: report.orderId,
        encounterId: report.encounterId,
        patientId: report.patientId,
        reportStatus: ReportStatus.DRAFT,
        version: report.version + 1,
        previousVersionId: id,
        indication: report.indication,
        procedureDescription: report.procedureDescription,
        findings: report.findings,
        complications: report.complications,
        specimens: report.specimens as any,
        postProcedureInstructions: report.postProcedureInstructions,
        anesthesiaType: report.anesthesiaType,
        anesthesiaProvider: report.anesthesiaProvider,
        startTime: report.startTime,
        endTime: report.endTime,
        durationMinutes: report.durationMinutes,
        primaryPerformer: report.primaryPerformer,
        assistants: report.assistants,
        estimatedBloodLoss: report.estimatedBloodLoss,
        implantsUsed: report.implantsUsed as any,
        reportedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.reportStatusService.recordTransition({
      tenantId,
      reportType: ReportType.PROCEDURE,
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
    return this.reportStatusService.getHistory(tenantId, ReportType.PROCEDURE, id);
  }
}
