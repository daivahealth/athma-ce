import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ReportStatus, ReportType } from '../dto/report-status.dto';

const VALID_TRANSITIONS: Record<string, string[]> = {
  [ReportStatus.DRAFT]: [ReportStatus.PRELIMINARY, ReportStatus.FINAL, ReportStatus.CANCELLED],
  [ReportStatus.PRELIMINARY]: [ReportStatus.FINAL, ReportStatus.CANCELLED],
  [ReportStatus.FINAL]: [ReportStatus.AMENDED, ReportStatus.CORRECTED],
  [ReportStatus.AMENDED]: [ReportStatus.FINAL],
  [ReportStatus.CORRECTED]: [ReportStatus.FINAL],
  [ReportStatus.CANCELLED]: [],
};

@Injectable()
export class ReportStatusService {
  constructor(private readonly prisma: PrismaService) {}

  validateTransition(fromStatus: string, toStatus: string): void {
    const allowed = VALID_TRANSITIONS[fromStatus];
    if (!allowed || !allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${fromStatus}' to '${toStatus}'`,
      );
    }

    if (
      (toStatus === ReportStatus.AMENDED || toStatus === ReportStatus.CORRECTED)
    ) {
      // Caller must provide reason — validated at DTO level
    }
  }

  async recordTransition(params: {
    tenantId: string;
    reportType: ReportType;
    reportId: string;
    fromStatus: string | null;
    toStatus: string;
    changedBy: string;
    reason?: string | undefined;
    version: number;
  }): Promise<void> {
    await this.prisma.reportStatusHistory.create({
      data: {
        tenantId: params.tenantId,
        reportType: params.reportType,
        reportId: params.reportId,
        fromStatus: params.fromStatus,
        toStatus: params.toStatus,
        changedBy: params.changedBy,
        reason: params.reason ?? null,
        version: params.version,
      },
    });
  }

  async getHistory(tenantId: string, reportType: ReportType, reportId: string) {
    return this.prisma.reportStatusHistory.findMany({
      where: { tenantId, reportType, reportId },
      orderBy: { changedAt: 'asc' },
    });
  }

  mapToOrderResultStatus(reportStatus: string): string | null {
    switch (reportStatus) {
      case ReportStatus.DRAFT:
        return 'pending';
      case ReportStatus.PRELIMINARY:
        return 'preliminary';
      case ReportStatus.FINAL:
        return 'final';
      case ReportStatus.AMENDED:
      case ReportStatus.CORRECTED:
        return 'amended';
      default:
        return null;
    }
  }

  async syncOrderStatus(
    tenantId: string,
    orderId: string,
    reportStatus: string,
  ): Promise<void> {
    const resultStatus = this.mapToOrderResultStatus(reportStatus);
    if (!resultStatus) return;

    const data: any = { resultStatus };

    if (reportStatus === ReportStatus.FINAL) {
      data.status = 'completed';
      data.resultedAt = new Date();
    }

    await this.prisma.clinicalOrder.updateMany({
      where: { id: orderId, tenantId },
      data,
    });
  }
}
