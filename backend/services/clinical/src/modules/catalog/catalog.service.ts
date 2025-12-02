/**
 * Catalog Service
 *
 * Manages master catalog tables for medications, lab tests, imaging studies, and procedures.
 * Supports both global (tenant_id = NULL) and tenant-specific catalog entries.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface CatalogFilters {
  tenantId?: string | undefined;
  isActive?: boolean | undefined;
  search?: string | undefined; // Searches across name fields
  includeGlobal?: boolean | undefined; // Include global entries (tenant_id = NULL)
}

interface DiagnosisFilters extends CatalogFilters {
  versionId?: string | undefined;
  codeSet?: string | undefined;
}

interface DiagnosisVersionFilters {
  tenantId?: string | undefined;
  codeSet?: string | undefined;
  importStatus?: string | undefined;
  isActive?: boolean | undefined;
}

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // ========================================
  // MEDICATION MASTER
  // ========================================

  async listMedications(filters: CatalogFilters = {}) {
    const where: any = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    // Handle tenant filtering - catalogs are tenant-specific
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.search) {
      where.OR = [
        { medicationName: { contains: filters.search, mode: 'insensitive' } },
        { genericName: { contains: filters.search, mode: 'insensitive' } },
        { brandName: { contains: filters.search, mode: 'insensitive' } },
        { ndcCode: { contains: filters.search, mode: 'insensitive' } },
        { atcCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.medicationMaster.findMany({
      where,
      orderBy: { medicationName: 'asc' },
    });
  }

  async getMedicationById(id: string) {
    const medication = await this.prisma.medicationMaster.findUnique({
      where: { id },
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  async createMedication(data: any) {
    return this.prisma.medicationMaster.create({
      data,
    });
  }

  async updateMedication(id: string, data: any) {
    await this.getMedicationById(id); // Verify exists
    return this.prisma.medicationMaster.update({
      where: { id },
      data,
    });
  }

  async deactivateMedication(id: string) {
    return this.updateMedication(id, { isActive: false });
  }

  // ========================================
  // LAB TEST MASTER
  // ========================================

  async listLabTests(filters: CatalogFilters = {}) {
    const where: any = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    // Handle tenant filtering - catalogs are tenant-specific
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.search) {
      where.OR = [
        { testName: { contains: filters.search, mode: 'insensitive' } },
        { loincCode: { contains: filters.search, mode: 'insensitive' } },
        { cptCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.labTestMaster.findMany({
      where,
      orderBy: { testName: 'asc' },
    });
  }

  async getLabTestById(id: string) {
    const labTest = await this.prisma.labTestMaster.findUnique({
      where: { id },
    });

    if (!labTest) {
      throw new NotFoundException(`Lab test with ID ${id} not found`);
    }

    return labTest;
  }

  async createLabTest(data: any) {
    return this.prisma.labTestMaster.create({
      data,
    });
  }

  async updateLabTest(id: string, data: any) {
    await this.getLabTestById(id); // Verify exists
    return this.prisma.labTestMaster.update({
      where: { id },
      data,
    });
  }

  async deactivateLabTest(id: string) {
    return this.updateLabTest(id, { isActive: false });
  }

  // ========================================
  // IMAGING STUDY MASTER
  // ========================================

  async listImagingStudies(filters: CatalogFilters = {}) {
    const where: any = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    // Handle tenant filtering - catalogs are tenant-specific
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.search) {
      where.OR = [
        { studyName: { contains: filters.search, mode: 'insensitive' } },
        { modality: { contains: filters.search, mode: 'insensitive' } },
        { bodyPart: { contains: filters.search, mode: 'insensitive' } },
        { cptCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.imagingStudyMaster.findMany({
      where,
      orderBy: { studyName: 'asc' },
    });
  }

  async getImagingStudyById(id: string) {
    const study = await this.prisma.imagingStudyMaster.findUnique({
      where: { id },
    });

    if (!study) {
      throw new NotFoundException(`Imaging study with ID ${id} not found`);
    }

    return study;
  }

  async createImagingStudy(data: any) {
    return this.prisma.imagingStudyMaster.create({
      data,
    });
  }

  async updateImagingStudy(id: string, data: any) {
    await this.getImagingStudyById(id); // Verify exists
    return this.prisma.imagingStudyMaster.update({
      where: { id },
      data,
    });
  }

  async deactivateImagingStudy(id: string) {
    return this.updateImagingStudy(id, { isActive: false });
  }

  // ========================================
  // PROCEDURE MASTER
  // ========================================

  async listProcedures(filters: CatalogFilters = {}) {
    const where: any = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    // Handle tenant filtering - catalogs are tenant-specific
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.search) {
      where.OR = [
        { procedureName: { contains: filters.search, mode: 'insensitive' } },
        { cptCode: { contains: filters.search, mode: 'insensitive' } },
        { icd10PcsCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.procedureMaster.findMany({
      where,
      orderBy: { procedureName: 'asc' },
    });
  }

  async getProcedureById(id: string) {
    const procedure = await this.prisma.procedureMaster.findUnique({
      where: { id },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${id} not found`);
    }

    return procedure;
  }

  async createProcedure(data: any) {
    return this.prisma.procedureMaster.create({
      data,
    });
  }

  async updateProcedure(id: string, data: any) {
    await this.getProcedureById(id); // Verify exists
    return this.prisma.procedureMaster.update({
      where: { id },
      data,
    });
  }

  async deactivateProcedure(id: string) {
    return this.updateProcedure(id, { isActive: false });
  }

  // ========================================
  // DIAGNOSIS MASTER
  // ========================================

  async listDiagnoses(filters: DiagnosisFilters = {}) {
    const where: any = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.versionId) {
      where.versionId = filters.versionId;
    }

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } },
        { chapter: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.codeSet) {
      where.version = {
        codeSet: filters.codeSet,
      };
    }

    return this.prisma.diagnosisMaster.findMany({
      where,
      include: { version: true },
      orderBy: { code: 'asc' },
    });
  }

  async getDiagnosisById(id: string) {
    const diagnosis = await this.prisma.diagnosisMaster.findUnique({
      where: { id },
      include: { version: true },
    });

    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with ID ${id} not found`);
    }

    return diagnosis;
  }

  private async ensureDiagnosisVersion(versionId: string) {
    const version = await this.prisma.diagnosisVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      throw new BadRequestException(`Diagnosis version ${versionId} not found`);
    }

    return version;
  }

  async createDiagnosis(data: any) {
    const version = await this.ensureDiagnosisVersion(data.versionId);

    if (version.tenantId && data.tenantId && version.tenantId !== data.tenantId) {
      throw new BadRequestException('Diagnosis tenant must match version tenant');
    }

    return this.prisma.diagnosisMaster.create({
      data: {
        clinicalConcepts: data.clinicalConcepts ?? [],
        synonyms: data.synonyms ?? [],
        searchTerms: data.searchTerms ?? [],
        ...data,
        tenantId: data.tenantId ?? version.tenantId,
      },
    });
  }

  async updateDiagnosis(id: string, data: any) {
    const existing = await this.getDiagnosisById(id);

    if (data.versionId && data.versionId !== existing.versionId) {
      const version = await this.ensureDiagnosisVersion(data.versionId);
      if (version.tenantId && existing.tenantId && version.tenantId !== existing.tenantId) {
        throw new BadRequestException('Diagnosis tenant must match version tenant');
      }
    }

    return this.prisma.diagnosisMaster.update({
      where: { id },
      data,
    });
  }

  async deactivateDiagnosis(id: string) {
    return this.updateDiagnosis(id, { isActive: false });
  }

  // ========================================
  // DIAGNOSIS VERSIONS
  // ========================================

  async listDiagnosisVersions(filters: DiagnosisVersionFilters = {}) {
    const where: any = {};

    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.codeSet) {
      where.codeSet = filters.codeSet;
    }

    if (filters.importStatus) {
      where.importStatus = filters.importStatus;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.diagnosisVersion.findMany({
      where,
      orderBy: { releaseDate: 'desc' },
    });
  }

  async getDiagnosisVersionById(id: string) {
    const version = await this.prisma.diagnosisVersion.findUnique({
      where: { id },
    });

    if (!version) {
      throw new NotFoundException(`Diagnosis version ${id} not found`);
    }

    return version;
  }

  async createDiagnosisVersion(data: any) {
    return this.prisma.diagnosisVersion.create({
      data,
    });
  }

  async updateDiagnosisVersion(id: string, data: any) {
    await this.getDiagnosisVersionById(id);
    return this.prisma.diagnosisVersion.update({
      where: { id },
      data,
    });
  }

  async deactivateDiagnosisVersion(id: string) {
    return this.updateDiagnosisVersion(id, { isActive: false });
  }

  async importDiagnosisCodes(versionId: string, records: any[]) {
    if (!Array.isArray(records) || records.length === 0) {
      throw new BadRequestException('No diagnosis records provided for import');
    }

    const version = await this.ensureDiagnosisVersion(versionId);

    const data = records.map((record) => {
      if (!record.code || !record.description) {
        throw new BadRequestException('Diagnosis import requires code and description');
      }

      if (version.tenantId && record.tenantId && version.tenantId !== record.tenantId) {
        throw new BadRequestException('Diagnosis tenant must match version tenant');
      }

      return {
        versionId,
        tenantId: record.tenantId ?? version.tenantId,
        code: record.code,
        codeType: record.codeType,
        shortDescription: record.shortDescription,
        description: record.description,
        chapter: record.chapter,
        block: record.block,
        category: record.category,
        subcategory: record.subcategory,
        clinicalConcepts: record.clinicalConcepts ?? [],
        synonyms: record.synonyms ?? [],
        searchTerms: record.searchTerms ?? [],
        genderRestriction: record.genderRestriction,
        ageRange: record.ageRange,
        isBillable: record.isBillable ?? true,
        isActive: record.isActive ?? true,
        effectiveFrom: record.effectiveFrom,
        effectiveTo: record.effectiveTo,
      };
    });

    const result = await this.prisma.diagnosisMaster.createMany({
      data,
      skipDuplicates: true,
    });

    await this.prisma.diagnosisVersion.update({
      where: { id: versionId },
      data: {
        importStatus: 'completed',
        importedAt: new Date(),
        importedBy: version.importedBy,
        totalCodes: {
          increment: result.count,
        },
      },
    });

    return { inserted: result.count };
  }
}
