import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface CreateClinicalCodingDto {
  encounterId: string;
  patientId: string;
  code: string;
  codeSystem: string;
  displayName: string;
  displayNameAr?: string;
  snomedCode?: string;
  snomedDisplay?: string;
  codingType: string; // diagnosis, symptom, finding, procedure, medication
  confidence?: number;
  rationale?: string;
  aiSuggestionId?: string;
  sourceBlockType?: string;
  sourceText?: string;
  status: string; // accepted, rejected, modified, manual
  reviewedBy?: string;
  catalogMatch?: boolean;
  isBillable?: boolean;
}

export interface UpdateClinicalCodingDto {
  status?: string;
  reviewedBy?: string;
  code?: string;
  codeSystem?: string;
  displayName?: string;
}

@Injectable()
export class ClinicalCodingsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildCodingCreateData(tenantId: string, dto: CreateClinicalCodingDto) {
    return {
      tenantId,
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      code: dto.code,
      codeSystem: dto.codeSystem,
      displayName: dto.displayName,
      displayNameAr: dto.displayNameAr ?? null,
      snomedCode: dto.snomedCode ?? null,
      snomedDisplay: dto.snomedDisplay ?? null,
      codingType: dto.codingType,
      confidence: dto.confidence ?? null,
      rationale: dto.rationale ?? null,
      aiSuggestionId: dto.aiSuggestionId ?? null,
      sourceBlockType: dto.sourceBlockType ?? null,
      sourceText: dto.sourceText ?? null,
      status: dto.status,
      reviewedBy: dto.reviewedBy ?? null,
      reviewedAt: dto.reviewedBy ? new Date() : null,
      catalogMatch: dto.catalogMatch ?? false,
      isBillable: dto.isBillable ?? null,
    };
  }

  async create(tenantId: string, dto: CreateClinicalCodingDto) {
    return this.prisma.encounterClinicalCoding.create({
      data: this.buildCodingCreateData(tenantId, dto),
    });
  }

  async createMany(tenantId: string, dtos: CreateClinicalCodingDto[]) {
    return this.prisma.encounterClinicalCoding.createMany({
      data: dtos.map((dto) => this.buildCodingCreateData(tenantId, dto)),
    });
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.encounterClinicalCoding.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    const query: any = {
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    };
    if (limit) query.take = limit;
    return this.prisma.encounterClinicalCoding.findMany(query);
  }

  async findById(tenantId: string, id: string) {
    const coding = await this.prisma.encounterClinicalCoding.findFirst({
      where: { id, tenantId },
    });
    if (!coding) {
      throw new NotFoundException(`Clinical coding with ID ${id} not found`);
    }
    return coding;
  }

  async update(tenantId: string, id: string, dto: UpdateClinicalCodingDto) {
    await this.findById(tenantId, id);
    const data: any = { ...dto };
    if (dto.status) {
      data.reviewedAt = new Date();
    }
    return this.prisma.encounterClinicalCoding.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    await this.prisma.encounterClinicalCoding.delete({ where: { id } });
    return { message: 'Clinical coding deleted successfully' };
  }
}
