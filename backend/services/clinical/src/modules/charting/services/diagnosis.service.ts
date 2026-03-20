import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from '../dto/diagnosis.dto';
import { ClinicalCodingsService } from './clinical-codings.service';

@Injectable()
export class DiagnosisService {
  private readonly logger = new Logger(DiagnosisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicalCodingsService: ClinicalCodingsService,
  ) {}

  async create(tenantId: string, dto: CreateDiagnosisDto) {
    const diagnosis = await this.prisma.encounterDiagnosis.create({
      data: {
        tenantId,
        ...dto,
      },
    });

    // Auto-populate encounter_clinical_codings for analytics
    this.writeClinicalCoding(tenantId, dto, 'manual').catch((err) => {
      this.logger.error(
        `Failed to write clinical coding for diagnosis ${diagnosis.id}: ${err?.message}`,
        err?.stack,
      );
    });

    return diagnosis;
  }

  async findById(tenantId: string, id: string) {
    const diagnosis = await this.prisma.encounterDiagnosis.findFirst({
      where: { id, tenantId },
    });
    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with ID ${id} not found`);
    }
    return diagnosis;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.encounterDiagnosis.findMany({
      where: { tenantId, encounterId },
      orderBy: [{ diagnosisRank: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    const query: any = {
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    };

    if (limit) {
      query.take = limit;
    }

    return this.prisma.encounterDiagnosis.findMany(query);
  }

  async update(tenantId: string, id: string, dto: UpdateDiagnosisDto) {
    await this.findById(tenantId, id);
    return this.prisma.encounterDiagnosis.update({
      where: { id },
      data: dto,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.encounterDiagnosis.delete({ where: { id } });
    return { message: 'Diagnosis deleted successfully' };
  }

  /**
   * Write a corresponding clinical coding when a diagnosis is created.
   * This populates encounter_clinical_codings for the analytics/NLQ layer.
   */
  private async writeClinicalCoding(
    tenantId: string,
    dto: CreateDiagnosisDto,
    status: string,
  ): Promise<void> {
    await this.clinicalCodingsService.create(tenantId, {
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      code: dto.icdCode,
      codeSystem: dto.icdVersion || 'ICD-10',
      displayName: dto.diagnosisName,
      ...(dto.diagnosisNameAr != null ? { displayNameAr: dto.diagnosisNameAr } : {}),
      codingType: 'diagnosis',
      status,
      reviewedBy: dto.diagnosedBy,
      catalogMatch: true,
      isBillable: true,
    });
  }
}
