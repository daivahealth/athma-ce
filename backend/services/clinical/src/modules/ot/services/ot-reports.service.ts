import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaService } from '@zeal/database-clinical';
import { STANDARD_PATIENT_SELECT } from '../../common/constants/patient-select.constant';
import {
  AmendOtReportDto,
  CreateOtReportDto,
  ListOtReportsDto,
  UpdateOtReportDto,
} from '../dto/ot-report.dto';
import { OtReportStatus } from '../ot.constants';
import { buildOtPatientDisplay } from '../ot-patient-display.util';

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

    const reportId = await this.prisma.$transaction(async (tx) => {
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

      return report.id;
    });
    return this.findById(tenantId, reportId);
  }

  async list(tenantId: string, query: ListOtReportsDto) {
    const patientIds = await this.resolvePatientIdsBySearch(tenantId, query.search);
    const reports = await this.prisma.otReport.findMany({
      where: {
        tenantId,
        ...(query.search ? { patientId: { in: patientIds } } : {}),
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
    const patientDisplayMap = await this.fetchPatientDisplayMap(
      tenantId,
      reports.map((report) => report.patientId)
    );
    return reports.map((report) => this.serializeReport(report, patientDisplayMap));
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

    const patientDisplayMap = await this.fetchPatientDisplayMap(tenantId, [report.patientId]);
    return this.serializeReport(report, patientDisplayMap);
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

      return id;
    });
    return this.findById(tenantId, id);
  }

  async sign(tenantId: string, id: string, userId: string, remarks?: string) {
    const report = await this.findById(tenantId, id);
    if (![OtReportStatus.DRAFT, OtReportStatus.AMENDED].includes(report.reportStatus as OtReportStatus)) {
      throw new BadRequestException(`Cannot sign OT report in status ${report.reportStatus}`);
    }

    await this.prisma.otReport.update({
      where: { id },
      data: {
        reportStatus: OtReportStatus.SIGNED,
        signedBy: userId,
        signedAt: new Date(),
        updatedBy: userId,
        ...(remarks !== undefined ? { remarks } : {}),
      },
    });
    return this.findById(tenantId, id);
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

      await tx.otReport.update({
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
      return id;
    });
    return this.findById(tenantId, id);
  }

  async cancel(tenantId: string, id: string, userId: string, remarks?: string) {
    await this.findById(tenantId, id);
    await this.prisma.otReport.update({
      where: { id },
      data: {
        reportStatus: OtReportStatus.CANCELLED,
        updatedBy: userId,
        ...(remarks !== undefined ? { remarks } : {}),
      },
    });
    return this.findById(tenantId, id);
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

  private async fetchPatientDisplayMap(tenantId: string, patientIds: string[]) {
    const uniquePatientIds = [...new Set(patientIds.filter(Boolean))];
    if (uniquePatientIds.length === 0) {
      return new Map<string, ReturnType<typeof buildOtPatientDisplay>>();
    }

    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        id: { in: uniquePatientIds },
      },
      select: STANDARD_PATIENT_SELECT,
    });

    return new Map(
      patients.map((patient) => [patient.id, buildOtPatientDisplay(patient)])
    );
  }

  private async resolvePatientIdsBySearch(tenantId: string, search?: string) {
    const term = search?.trim();
    if (!term) {
      return [];
    }

    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
          { displayName: { contains: term, mode: 'insensitive' } },
          { mrn: { contains: term, mode: 'insensitive' } },
          { phoneNumber: { contains: term } },
        ],
      },
      select: { id: true },
    });

    return patients.map((patient) => patient.id);
  }

  private serializeReport(
    report: any,
    patientDisplayMap: Map<string, ReturnType<typeof buildOtPatientDisplay>>
  ) {
    return {
      ...report,
      patientDisplay: patientDisplayMap.get(report.patientId) ?? null,
    };
  }
}
