import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateVitalSignsTemplateDto,
  UpdateVitalSignsTemplateDto,
  QueryVitalSignsTemplatesDto,
  FindTemplateDto,
  CareSetting,
  AgeGroup,
} from '../dto/vital-signs-template.dto';

@Injectable()
export class VitalSignsTemplateService {
  private readonly logger = new Logger(VitalSignsTemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new vital signs template
   */
  async create(tenantId: string, dto: CreateVitalSignsTemplateDto) {
    // Check if template code already exists for this tenant
    const existing = await this.prisma.vitalSignsTemplate.findFirst({
      where: {
        tenantId,
        templateCode: dto.templateCode,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Template with code "${dto.templateCode}" already exists for this tenant`
      );
    }

    // If this is being set as default, unset other defaults for the same context
    if (dto.isDefault) {
      await this.unsetDefaultsForContext(
        tenantId,
        dto.careSetting,
        dto.ageGroup,
        dto.specialties
      );
    }

    const template = await this.prisma.vitalSignsTemplate.create({
      data: {
        tenantId,
        templateCode: dto.templateCode,
        version: dto.version || 1,
        name: dto.name as any,
        description: dto.description as any,
        careSetting: dto.careSetting,
        ageGroup: dto.ageGroup,
        specialties: dto.specialties,
        groups: dto.groups as any,
        isActive: dto.isActive ?? true,
        isDefault: dto.isDefault ?? false,
        metadata: dto.metadata as any,
      },
    });

    this.logger.log(
      `Created vital signs template: ${dto.templateCode} for tenant: ${tenantId}`
    );

    return template;
  }

  /**
   * Get all vital signs templates with optional filtering
   */
  async findAll(tenantId: string, query: QueryVitalSignsTemplatesDto) {
    const where: any = { tenantId };

    if (query.careSetting) {
      where.careSetting = { has: query.careSetting };
    }

    if (query.ageGroup) {
      where.ageGroup = { has: query.ageGroup };
    }

    if (query.specialty) {
      where.specialties = { has: query.specialty };
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.isDefault !== undefined) {
      where.isDefault = query.isDefault;
    }

    if (query.search) {
      // Search in template name (JSON field)
      where.OR = [
        {
          name: {
            path: ['en'],
            string_contains: query.search,
          },
        },
        {
          name: {
            path: ['ar'],
            string_contains: query.search,
          },
        },
      ];
    }

    const templates = await this.prisma.vitalSignsTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' }, // Default templates first
        { createdAt: 'desc' },
      ],
    });

    return templates;
  }

  /**
   * Get a specific vital signs template by ID
   */
  async findOne(tenantId: string, id: string) {
    const template = await this.prisma.vitalSignsTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`Vital signs template with ID ${id} not found`);
    }

    return template;
  }

  /**
   * Get a specific vital signs template by code
   */
  async findByCode(tenantId: string, templateCode: string) {
    const template = await this.prisma.vitalSignsTemplate.findFirst({
      where: { templateCode, tenantId },
    });

    if (!template) {
      throw new NotFoundException(
        `Vital signs template with code "${templateCode}" not found`
      );
    }

    return template;
  }

  /**
   * Find the best matching template for a specific context
   * Priority: exact match > partial match > default
   */
  async findBestMatch(tenantId: string, dto: FindTemplateDto) {
    // Try to find exact match first
    let template = await this.prisma.vitalSignsTemplate.findFirst({
      where: {
        tenantId,
        isActive: true,
        careSetting: { has: dto.careSetting },
        ageGroup: { has: dto.ageGroup },
        ...(dto.specialty ? { specialties: { has: dto.specialty } } : {}),
      },
      orderBy: [
        { isDefault: 'desc' },
        { version: 'desc' },
      ],
    });

    if (template) {
      this.logger.log(`Found exact match template: ${template.templateCode}`);
      return template;
    }

    // Try partial match (care setting + age group only)
    template = await this.prisma.vitalSignsTemplate.findFirst({
      where: {
        tenantId,
        isActive: true,
        careSetting: { has: dto.careSetting },
        ageGroup: { has: dto.ageGroup },
      },
      orderBy: [
        { isDefault: 'desc' },
        { version: 'desc' },
      ],
    });

    if (template) {
      this.logger.log(`Found partial match template: ${template.templateCode}`);
      return template;
    }

    // Try default template for care setting
    template = await this.prisma.vitalSignsTemplate.findFirst({
      where: {
        tenantId,
        isActive: true,
        isDefault: true,
        careSetting: { has: dto.careSetting },
      },
      orderBy: { version: 'desc' },
    });

    if (template) {
      this.logger.log(`Found default template for care setting: ${template.templateCode}`);
      return template;
    }

    // Try ANY care setting default
    template = await this.prisma.vitalSignsTemplate.findFirst({
      where: {
        tenantId,
        isActive: true,
        isDefault: true,
        careSetting: { has: CareSetting.ANY },
      },
      orderBy: { version: 'desc' },
    });

    if (template) {
      this.logger.log(`Found universal default template: ${template.templateCode}`);
      return template;
    }

    throw new NotFoundException(
      `No vital signs template found for care setting: ${dto.careSetting}, age group: ${dto.ageGroup}`
    );
  }

  /**
   * Update a vital signs template
   */
  async update(tenantId: string, id: string, dto: UpdateVitalSignsTemplateDto) {
    const existing = await this.findOne(tenantId, id);

    // If setting as default, unset other defaults
    if (dto.isDefault && !existing.isDefault) {
      await this.unsetDefaultsForContext(
        tenantId,
        (dto.careSetting || existing.careSetting) as CareSetting[],
        (dto.ageGroup || existing.ageGroup) as AgeGroup[],
        dto.specialties || existing.specialties
      );
    }

    const template = await this.prisma.vitalSignsTemplate.update({
      where: { id },
      data: {
        ...(dto.version && { version: dto.version }),
        ...(dto.name && { name: dto.name as any }),
        ...(dto.description && { description: dto.description as any }),
        ...(dto.careSetting && { careSetting: dto.careSetting }),
        ...(dto.ageGroup && { ageGroup: dto.ageGroup }),
        ...(dto.specialties && { specialties: dto.specialties }),
        ...(dto.groups && { groups: dto.groups as any }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
        ...(dto.metadata && { metadata: dto.metadata as any }),
      },
    });

    this.logger.log(`Updated vital signs template: ${id}`);

    return template;
  }

  /**
   * Delete a vital signs template
   */
  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await this.prisma.vitalSignsTemplate.delete({
      where: { id },
    });

    this.logger.log(`Deleted vital signs template: ${id}`);

    return { message: 'Template deleted successfully' };
  }

  /**
   * Get available care settings
   */
  async getCareSettings() {
    return Object.values(CareSetting);
  }

  /**
   * Get available age groups
   */
  async getAgeGroups() {
    return Object.values(AgeGroup);
  }

  /**
   * Clone a template with a new code
   */
  async clone(tenantId: string, id: string, newTemplateCode: string) {
    const source = await this.findOne(tenantId, id);

    // Check if new code already exists
    const existing = await this.prisma.vitalSignsTemplate.findFirst({
      where: { tenantId, templateCode: newTemplateCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Template with code "${newTemplateCode}" already exists`
      );
    }

    const cloned = await this.prisma.vitalSignsTemplate.create({
      data: {
        tenantId,
        templateCode: newTemplateCode,
        version: 1,
        name: source.name as any,
        description: source.description as any,
        careSetting: source.careSetting as string[],
        ageGroup: source.ageGroup as string[],
        specialties: source.specialties as string[],
        groups: source.groups as any,
        isActive: true,
        isDefault: false, // Cloned templates are not default by default
        metadata: {
          ...(source.metadata as object),
          clonedFrom: id,
          clonedAt: new Date().toISOString(),
        } as any,
      },
    });

    this.logger.log(`Cloned template ${id} to ${newTemplateCode}`);

    return cloned;
  }

  /**
   * Unset default flag for templates matching the context
   */
  private async unsetDefaultsForContext(
    tenantId: string,
    careSetting: CareSetting[],
    ageGroup: AgeGroup[],
    specialties: string[]
  ) {
    // Find overlapping templates and unset their default flag
    await this.prisma.vitalSignsTemplate.updateMany({
      where: {
        tenantId,
        isDefault: true,
        AND: [
          { careSetting: { hasSome: careSetting } },
          { ageGroup: { hasSome: ageGroup } },
          { specialties: { hasSome: specialties } },
        ],
      },
      data: {
        isDefault: false,
      },
    });
  }
}
