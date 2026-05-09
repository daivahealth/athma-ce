import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaService } from '@zeal/database-clinical';
import {
  AmendOtReportDto,
  CreateOtReportDto,
  ListOtReportsDto,
  UpdateOtReportDto,
} from '../dto/ot-report.dto';
import { OtReportStatus } from '../ot.constants';

@Injectable()
export class OtReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateOtReportDto) {
    const schedule = await this.prisma.otSchedule.findFirst({
      where: { id: dto.scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException(`OT schedule ${dto.scheduleId} not found`);
    }

    const existing = await this.prisma.otReport.findFirst({
      where: {
        tenantId,
        scheduleId: dto.scheduleId,
        reportStatus: { not: OtReportStatus.CANCELLED },
      },
    });

    if (existing) {
      throw new BadRequestException(`An active OT report already exists for schedule ${dto.scheduleId}`);
    }

    const reportNumber = await this.generateReportNumber(tenantId);

    return this.prisma.$transaction(async (tx) => {
      const report = await tx.otReport.create({
        data: {
          tenantId,
          scheduleId: schedule.id,
          otRequestId: schedule.otRequestId,
          patientId: schedule.patientId,
          encounterId: schedule.encounterId,
          reportNumber,
          remarks: dto.remarks ?? null,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      await tx.otReportVersion.create({
        data: {
          tenantId,
          reportId: report.id,
          versionNo: 1,
          reportData: dto.reportData as Prisma.InputJsonValue,
          createdBy: userId,
          isCurrent: true,
        },
      });

      return tx.otReport.findUnique({
        where: { id: report.id },
        include: {
          versions: {
            orderBy: { versionNo: 'desc' },
          },
        },
      });
    });
  }

  async list(tenantId: string, query: ListOtReportsDto) {
    return this.prisma.otReport.findMany({
      where: {
        tenantId,
        ...(query.reportStatus ? { reportStatus: query.reportStatus as any } : {}),
        ...(query.patientId ? { patientId: query.patientId } : {}),
        ...(query.scheduleId ? { scheduleId: query.scheduleId } : {}),
      },
      include: {
        versions: {
          where: { isCurrent: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const report = await this.prisma.otReport.findFirst({
      where: { id, tenantId },
      include: {
        versions: {
          orderBy: { versionNo: 'desc' },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`OT report ${id} not found`);
    }

    return report;
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateOtReportDto) {
    const report = await this.findById(tenantId, id);
    if (![OtReportStatus.DRAFT, OtReportStatus.AMENDED].includes(report.reportStatus as OtReportStatus)) {
      throw new BadRequestException(`Cannot update OT report in status ${report.reportStatus}`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.reportData) {
        const current = await tx.otReportVersion.findFirst({
          where: { reportId: id, isCurrent: true },
          orderBy: { versionNo: 'desc' },
        });

        if (!current) {
          throw new NotFoundException(`Current version for OT report ${id} not found`);
        }

        await tx.otReportVersion.update({
          where: { id: current.id },
          data: { isCurrent: false },
        });

        await tx.otReportVersion.create({
          data: {
            tenantId,
            reportId: id,
            versionNo: current.versionNo + 1,
            reportData: dto.reportData as Prisma.InputJsonValue,
            createdBy: userId,
            isCurrent: true,
          },
        });
      }

      await tx.otReport.update({
        where: { id },
        data: {
          updatedBy: userId,
          ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
        },
      });

      return tx.otReport.findUnique({
        where: { id },
        include: {
          versions: {
            orderBy: { versionNo: 'desc' },
          },
        },
      });
    });
  }

  async sign(tenantId: string, id: string, userId: string, remarks?: string) {
    const report = await this.findById(tenantId, id);
    if (![OtReportStatus.DRAFT, OtReportStatus.AMENDED].includes(report.reportStatus as OtReportStatus)) {
      throw new BadRequestException(`Cannot sign OT report in status ${report.reportStatus}`);
    }

    return this.prisma.otReport.update({
      where: { id },
      data: {
        reportStatus: OtReportStatus.SIGNED,
        signedBy: userId,
        signedAt: new Date(),
        updatedBy: userId,
        ...(remarks !== undefined ? { remarks } : {}),
      },
    });
  }

  async amend(tenantId: string, id: string, userId: string, dto: AmendOtReportDto) {
    const report = await this.findById(tenantId, id);
    if (report.reportStatus !== OtReportStatus.SIGNED) {
      throw new BadRequestException('Only signed OT reports can be amended');
    }

    return this.prisma.$transaction(async (tx) => {
      const current = await tx.otReportVersion.findFirst({
        where: { reportId: id, isCurrent: true },
        orderBy: { versionNo: 'desc' },
      });

      if (!current) {
        throw new NotFoundException(`Current version for OT report ${id} not found`);
      }

      await tx.otReportVersion.update({
        where: { id: current.id },
        data: { isCurrent: false },
      });

      await tx.otReportVersion.create({
        data: {
          tenantId,
          reportId: id,
          versionNo: current.versionNo + 1,
          reportData: dto.reportData as Prisma.InputJsonValue,
          createdBy: userId,
          isCurrent: true,
        },
      });

      return tx.otReport.update({
        where: { id },
        data: {
          reportStatus: OtReportStatus.AMENDED,
          updatedBy: userId,
          ...(dto.remarks !== undefined
            ? { remarks: dto.remarks }
            : dto.reason !== undefined
              ? { remarks: dto.reason }
              : {}),
        },
      });
    });
  }

  async cancel(tenantId: string, id: string, userId: string, remarks?: string) {
    await this.findById(tenantId, id);
    return this.prisma.otReport.update({
      where: { id },
      data: {
        reportStatus: OtReportStatus.CANCELLED,
        updatedBy: userId,
        ...(remarks !== undefined ? { remarks } : {}),
      },
    });
  }

  async getVersions(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.otReportVersion.findMany({
      where: { tenantId, reportId: id },
      orderBy: { versionNo: 'desc' },
    });
  }

  async getVersion(tenantId: string, id: string, versionNo: number) {
    const version = await this.prisma.otReportVersion.findFirst({
      where: { tenantId, reportId: id, versionNo },
    });

    if (!version) {
      throw new NotFoundException(`OT report version ${versionNo} not found`);
    }

    return version;
  }

  private async generateReportNumber(tenantId: string) {
    const count = await this.prisma.otReport.count({ where: { tenantId } });
    return `OTR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(count + 1).padStart(4, '0')}`;
  }
}
