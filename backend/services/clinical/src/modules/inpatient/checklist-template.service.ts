import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  ChecklistCategory,
  ChecklistTemplateStatus,
  ChecklistItemType,
} from '@zeal/database-clinical';

@Injectable()
export class ChecklistTemplateService {
  private readonly logger = new Logger(ChecklistTemplateService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new checklist template
   * @param data - Template data
   * @param context - Request context (tenantId, facilityId, userId)
   * @returns Created template with items
   */
  async createTemplate(data: any, context: any) {
    const { tenantId, facilityId, userId } = context;

    // Check for duplicate code
    const existingTemplate = await this.prisma.checklistTemplate.findFirst({
      where: {
        tenantId,
        code: data.code,
        version: data.version || 1,
      },
    });

    if (existingTemplate) {
      throw new BadRequestException(
        `Template with code ${data.code} version ${data.version || 1} already exists`
      );
    }

    // Create template with items
    const template = await this.prisma.checklistTemplate.create({
      data: {
        tenantId,
        facilityId,
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category,
        version: data.version || 1,
        status: data.status || ChecklistTemplateStatus.DRAFT,
        applicableToInpatient: data.applicableToInpatient ?? true,
        applicableToOutpatient: data.applicableToOutpatient ?? false,
        applicableEncounterTypes: data.applicableEncounterTypes || [],
        applicableDepartments: data.applicableDepartments || [],
        requiresAllItems: data.requiresAllItems ?? false,
        minimumCompletionPercent: data.minimumCompletionPercent,
        requiresVerification: data.requiresVerification ?? false,
        verificationRoles: data.verificationRoles || [],
        allowSelfVerification: data.allowSelfVerification ?? false,
        autoCreateEnabled: data.autoCreateEnabled ?? false,
        autoCreateOn: data.autoCreateOn || [],
        autoCreateConditions: data.autoCreateConditions,
        autoCreateDueHours: data.autoCreateDueHours,
        allowedRoles: data.allowedRoles || [],
        estimatedMinutes: data.estimatedMinutes,
        createdBy: userId,
        items: {
          create: (data.items || []).map((item: any, index: number) => ({
            tenantId,
            itemKey: item.itemKey,
            itemType: item.itemType,
            label: item.label,
            helpText: item.helpText,
            placeholder: item.placeholder,
            sectionName: item.sectionName,
            sortOrder: item.sortOrder ?? index,
            isRequired: item.isRequired ?? false,
            validationRules: item.validationRules,
            options: item.options,
            showIfCondition: item.showIfCondition,
          })),
        },
      },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    this.logger.log(`Created checklist template: ${template.id} (${template.code} v${template.version})`);

    return template;
  }

  /**
   * Add item to template
   * @param templateId - Template ID
   * @param data - Item data
   * @param context - Request context
   * @returns Updated template
   */
  async addItem(templateId: string, data: any, context: any) {
    const { tenantId } = context;

    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: templateId, tenantId },
      include: { _count: { select: { items: true } } },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Default sort order to end
    const sortOrder = data.sortOrder ?? (template._count.items + 1);

    await this.prisma.checklistTemplateItem.create({
      data: {
        tenantId,
        templateId,
        itemKey: data.itemKey,
        itemType: data.itemType,
        label: data.label,
        helpText: data.helpText,
        placeholder: data.placeholder,
        sectionName: data.sectionName,
        sortOrder,
        isRequired: data.isRequired ?? false,
        validationRules: data.validationRules,
        options: data.options,
        showIfCondition: data.showIfCondition,
      },
    });

    return this.getTemplate(templateId, tenantId);
  }

  /**
   * Get template by ID
   * @param templateId - Template ID
   * @param tenantId - Tenant ID
   * @returns Template with items
   */
  async getTemplate(templateId: string, tenantId: string) {
    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: templateId, tenantId },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    return template;
  }

  /**
   * Get template by code (latest version)
   * @param code - Template code
   * @param tenantId - Tenant ID
   * @returns Template with items
   */
  async getTemplateByCode(code: string, tenantId: string) {
    const template = await this.prisma.checklistTemplate.findFirst({
      where: {
        tenantId,
        code,
        status: ChecklistTemplateStatus.ACTIVE,
      },
      orderBy: { version: 'desc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Active template with code ${code} not found`);
    }

    return template;
  }

  /**
   * List templates with filtering and pagination
   * @param filters - Filter criteria
   * @param tenantId - Tenant ID
   * @param pagination - Pagination options
   * @returns List of templates with pagination metadata
   */
  async listTemplates(
    filters: any,
    tenantId: string,
    pagination?: { skip?: number; take?: number }
  ) {
    const where: any = { tenantId };

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.applicableToInpatient !== undefined) {
      where.applicableToInpatient = filters.applicableToInpatient;
    }
    if (filters.applicableToOutpatient !== undefined) {
      where.applicableToOutpatient = filters.applicableToOutpatient;
    }

    const skip = pagination?.skip || 0;
    const take = pagination?.take || 50; // Default limit of 50

    // Get total count for pagination metadata
    const total = await this.prisma.checklistTemplate.count({ where });

    // Get templates with pagination - simple query without _count
    const templates = await this.prisma.checklistTemplate.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      skip,
      take,
    });

    return {
      data: templates,
      meta: {
        total,
        skip,
        take,
        hasMore: skip + templates.length < total,
      },
    };
  }

  /**
   * Update template
   * @param templateId - Template ID
   * @param data - Update data
   * @param context - Request context
   * @returns Updated template
   */
  async updateTemplate(templateId: string, data: any, context: any) {
    const { tenantId, userId } = context;

    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    const updated = await this.prisma.checklistTemplate.update({
      where: { id: templateId },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    this.logger.log(`Updated checklist template: ${templateId}`);

    return updated;
  }

  /**
   * Change template status
   * @param templateId - Template ID
   * @param status - New status
   * @param context - Request context
   * @returns Updated template
   */
  async changeStatus(
    templateId: string,
    status: ChecklistTemplateStatus,
    context: any
  ) {
    const { tenantId, userId } = context;

    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    const updated = await this.prisma.checklistTemplate.update({
      where: { id: templateId },
      data: {
        status,
        updatedBy: userId,
      },
    });

    this.logger.log(`Template ${templateId} status changed to ${status}`);

    return updated;
  }

  /**
   * Find templates by auto-creation trigger
   * @param trigger - Trigger event name
   * @param tenantId - Tenant ID
   * @returns Matching templates
   */
  async findTemplatesByTrigger(trigger: string, tenantId: string) {
    const templates = await this.prisma.checklistTemplate.findMany({
      where: {
        tenantId,
        status: ChecklistTemplateStatus.ACTIVE,
        autoCreateEnabled: true,
        autoCreateOn: {
          has: trigger,
        },
      },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return templates;
  }
}
