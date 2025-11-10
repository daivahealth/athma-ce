/**
 * Catalog Service
 *
 * Manages master catalog tables for medications, lab tests, imaging studies, and procedures.
 * Supports both global (tenant_id = NULL) and tenant-specific catalog entries.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

export interface CatalogFilters {
  tenantId?: string | undefined;
  isActive?: boolean | undefined;
  search?: string | undefined; // Searches across name fields
  includeGlobal?: boolean | undefined; // Include global entries (tenant_id = NULL)
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
}
