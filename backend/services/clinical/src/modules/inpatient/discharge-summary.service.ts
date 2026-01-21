/**
 * Discharge Summary Service
 * Manages versioned discharge summary documents stored as JSONB
 */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, DischargeSummaryStatus, Prisma } from '@zeal/database-clinical';

@Injectable()
export class DischargeSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getByAdmission(admissionId: string, tenantId: string) {
    const summary = await this.prisma.clinicalDischargeSummary.findFirst({
      where: { admissionId, tenantId },
      include: { currentVersion: true },
    });

    if (!summary) {
      throw new NotFoundException(`Discharge summary not found for admission ${admissionId}`);
    }

    return summary;
  }

  async getById(summaryId: string, tenantId: string) {
    const summary = await this.prisma.clinicalDischargeSummary.findUnique({
      where: { id: summaryId, tenantId },
      include: { currentVersion: true },
    });

    if (!summary) {
      throw new NotFoundException(`Discharge summary ${summaryId} not found`);
    }

    return summary;
  }

  async listVersions(summaryId: string, tenantId: string) {
    return this.prisma.clinicalDischargeSummaryVersion.findMany({
      where: { dischargeSummaryId: summaryId, tenantId },
      orderBy: { versionNo: 'desc' },
    });
  }

  async createVersion(
    summaryId: string,
    data: Record<string, unknown>,
    changeReason: string | undefined,
    context: { tenantId: string; facilityId: string; userId: string }
  ) {
    const { tenantId, facilityId, userId } = context;

    const summary = await this.prisma.clinicalDischargeSummary.findUnique({
      where: { id: summaryId, tenantId },
    });

    if (!summary) {
      throw new NotFoundException(`Discharge summary ${summaryId} not found`);
    }

    if (summary.isLocked) {
      throw new BadRequestException('Discharge summary is locked');
    }

    const latestVersion = await this.prisma.clinicalDischargeSummaryVersion.findFirst({
      where: { dischargeSummaryId: summaryId, tenantId },
      orderBy: { versionNo: 'desc' },
    });

    const nextVersionNo = (latestVersion?.versionNo ?? 0) + 1;

    return this.prisma.$transaction(async (tx) => {
      const version = await tx.clinicalDischargeSummaryVersion.create({
        data: {
          tenantId,
          facilityId,
          dischargeSummaryId: summaryId,
          versionNo: nextVersionNo,
          data: data as Prisma.InputJsonValue,
          changeReason: changeReason || null,
          createdBy: userId,
          amendedFromVersionId: latestVersion?.id ?? null,
        },
      });

      await tx.clinicalDischargeSummary.update({
        where: { id: summaryId },
        data: {
          currentVersionId: version.id,
          updatedBy: userId,
          status: summary.status ?? DischargeSummaryStatus.DRAFT,
        },
      });

      return version;
    });
  }

  async createInitialSummaryWithTx(
    tx: Prisma.TransactionClient,
    params: {
      admissionId: string;
      encounterId: string;
      patientId: string;
      context: { tenantId: string; facilityId: string; userId: string };
    }
  ) {
    const { admissionId, encounterId, patientId, context } = params;
    const { tenantId, facilityId, userId } = context;

    const summary = await tx.clinicalDischargeSummary.create({
      data: {
        tenantId,
        facilityId,
        admissionId,
        encounterId,
        patientId,
        status: DischargeSummaryStatus.DRAFT,
        initiatedAt: new Date(),
        initiatedBy: userId,
        createdBy: userId,
      },
    });

    const version = await tx.clinicalDischargeSummaryVersion.create({
      data: {
        tenantId,
        facilityId,
        dischargeSummaryId: summary.id,
        versionNo: 1,
        data: {} as Prisma.InputJsonValue,
        createdBy: userId,
      },
    });

    await tx.clinicalDischargeSummary.update({
      where: { id: summary.id },
      data: { currentVersionId: version.id, updatedBy: userId },
    });

    return { summary, version };
  }

  async createInitialSummary(params: {
    admissionId: string;
    encounterId: string;
    patientId: string;
    context: { tenantId: string; facilityId: string; userId: string };
  }) {
    return this.prisma.$transaction((tx) => this.createInitialSummaryWithTx(tx, params));
  }
}
