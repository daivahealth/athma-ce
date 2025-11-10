import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from '../dto/diagnosis.dto';

@Injectable()
export class DiagnosisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateDiagnosisDto) {
    return this.prisma.encounterDiagnosis.create({
      data: {
        tenantId,
        ...dto,
      },
    });
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
    return this.prisma.encounterDiagnosis.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
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
}