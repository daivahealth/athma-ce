import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreatePackageDto, UpdatePackageDto, QueryPackagesDto } from '../dto/package.dto';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCatalogType(value: string) {
    return value.trim().toUpperCase();
  }

  /**
   * Create a new package with items
   */
  async create(tenantId: string, dto: CreatePackageDto) {
    // Check if code already exists for this tenant
    const existing = await this.prisma.package.findFirst({
      where: {
        tenantId,
        code: dto.code,
      },
    });

    if (existing) {
      throw new BadRequestException(`Package with code ${dto.code} already exists`);
    }

    const { items, ...packageData } = dto;

    // Create package with items in a transaction
    return this.prisma.$transaction(async (tx) => {
      const createData: any = {
        ...packageData,
        tenantId,
      };

      if (items) {
        createData.items = {
          create: items.map((item, index) => ({
            catalogType: this.normalizeCatalogType(item.catalogType),
            catalogId: item.catalogId,
            quantity: item.quantity || 1,
            isMandatory: item.isMandatory ?? true,
            clinicalOnly: item.clinicalOnly ?? false,
            groupName: item.groupName || null,
            sortOrder: item.sortOrder ?? index,
            maxUsesPerPackage: item.maxUsesPerPackage || null,
            notes: item.notes || null,
          })),
        };
      }

      const pkg = await tx.package.create({
        data: createData,
        include: {
          items: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

      return pkg;
    });
  }

  /**
   * Find all packages with optional filtering
   */
  async findAll(tenantId: string, query: QueryPackagesDto) {
    const where: any = {
      tenantId,
    };

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.packageType) {
      where.packageType = query.packageType;
    }

    if (query.careSetting) {
      where.careSetting = query.careSetting;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.isPublic !== undefined) {
      where.isPublic = query.isPublic;
    }

    // Filter by gender if specified
    if (query.gender) {
      where.OR = [
        { genderRestriction: null },
        { genderRestriction: query.gender },
      ];
    }

    // Filter by age if specified
    if (query.age !== undefined) {
      where.AND = [
        {
          OR: [
            { minAgeYears: null },
            { minAgeYears: { lte: query.age } },
          ],
        },
        {
          OR: [
            { maxAgeYears: null },
            { maxAgeYears: { gte: query.age } },
          ],
        },
      ];
    }

    const packages = await this.prisma.package.findMany({
      where,
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return packages;
  }

  /**
   * Find package by ID
   */
  async findOne(tenantId: string, id: string) {
    const pkg = await this.prisma.package.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return pkg;
  }

  /**
   * Find package by code
   */
  async findByCode(tenantId: string, code: string) {
    const pkg = await this.prisma.package.findFirst({
      where: {
        code,
        tenantId,
      },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with code ${code} not found`);
    }

    return pkg;
  }

  /**
   * Update package
   */
  async update(tenantId: string, id: string, dto: UpdatePackageDto) {
    const pkg = await this.findOne(tenantId, id);

    // Check if code is being updated and conflicts with another package
    if (dto.code && dto.code !== pkg.code) {
      const existing = await this.prisma.package.findFirst({
        where: {
          tenantId,
          code: dto.code,
          id: { not: id },
        },
      });

      if (existing) {
        throw new BadRequestException(`Package with code ${dto.code} already exists`);
      }
    }

    const { items, ...packageData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // If items are provided, replace all existing items
      if (items) {
        // Delete existing items
        await tx.packageItem.deleteMany({
          where: { packageId: id },
        });

        // Create new items
        await tx.packageItem.createMany({
          data: items.map((item, index) => ({
            packageId: id,
            catalogType: this.normalizeCatalogType(item.catalogType),
            catalogId: item.catalogId,
            quantity: item.quantity || 1,
            isMandatory: item.isMandatory ?? true,
            clinicalOnly: item.clinicalOnly ?? false,
            groupName: item.groupName || null,
            sortOrder: item.sortOrder ?? index,
            maxUsesPerPackage: item.maxUsesPerPackage || null,
            notes: item.notes || null,
          })),
        });
      }

      // Update package
      const updated = await tx.package.update({
        where: { id },
        data: packageData,
        include: {
          items: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

      return updated;
    });
  }

  /**
   * Delete package
   */
  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await this.prisma.package.delete({
      where: { id },
    });

    return { message: 'Package deleted successfully' };
  }

  /**
   * Get package types
   */
  async getPackageTypes() {
    return [
      { code: 'health_check', name: 'Health Checkup' },
      { code: 'surgical_bundle', name: 'Surgical Bundle' },
      { code: 'maternity_bundle', name: 'Maternity Bundle' },
      { code: 'pre_employment', name: 'Pre-Employment Screening' },
      { code: 'annual_checkup', name: 'Annual Checkup' },
      { code: 'custom', name: 'Custom Package' },
    ];
  }

  /**
   * Get catalog types
   */
  async getCatalogTypes() {
    return [
      { code: 'LAB_TEST', name: 'Lab Test' },
      { code: 'IMAGING_STUDY', name: 'Imaging Study' },
      { code: 'PROCEDURE', name: 'Procedure' },
      { code: 'DRUG', name: 'Medication' },
      { code: 'VISIT_TYPE', name: 'Visit Type' },
      { code: 'MISC', name: 'Miscellaneous' },
    ];
  }
}
