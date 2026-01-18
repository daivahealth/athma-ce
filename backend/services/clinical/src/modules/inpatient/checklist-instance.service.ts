import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  ChecklistInstanceStatus,
  ChecklistContext,
} from '@zeal/database-clinical';

@Injectable()
export class ChecklistInstanceService {
  private readonly logger = new Logger(ChecklistInstanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a checklist instance from a template
   * @param data - Instance creation data
   * @param context - Request context (tenantId, facilityId, userId)
   * @returns Created instance
   */
  async createInstance(data: any, context: any) {
    const { tenantId, facilityId, userId } = context;

    // Verify template exists
    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id: data.templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${data.templateId} not found`);
    }

    // Create instance
    const instance = await this.prisma.checklistInstance.create({
      data: {
        tenantId,
        facilityId,
        templateId: data.templateId,
        patientId: data.patientId,
        encounterId: data.encounterId,
        admissionId: data.admissionId,
        careChannelId: data.careChannelId,
        channelMessageId: data.channelMessageId,
        context: data.context || ChecklistContext.INPATIENT_ADMISSION,
        status: ChecklistInstanceStatus.NOT_STARTED,
        completionPercent: 0,
        dueAt: data.dueAt,
        createdBy: userId,
      },
      include: {
        template: {
          include: {
            items: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    this.logger.log(
      `Created checklist instance: ${instance.id} from template ${template.code}`
    );

    return instance;
  }

  /**
   * Get instance by ID
   * @param instanceId - Instance ID
   * @param tenantId - Tenant ID
   * @returns Instance with template and responses
   */
  async getInstanceById(instanceId: string, tenantId: string) {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
      include: {
        template: {
          include: {
            items: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        responses: {
          include: {
            templateItem: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    return instance;
  }

  /**
   * List instances with filtering
   * @param filters - Filter criteria
   * @param tenantId - Tenant ID
   * @returns List of instances
   */
  async listInstances(filters: any, tenantId: string) {
    const where: any = { tenantId };

    if (filters.admissionId) {
      where.admissionId = filters.admissionId;
    }
    if (filters.careChannelId) {
      where.careChannelId = filters.careChannelId;
    }
    if (filters.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.context) {
      where.context = filters.context;
    }

    const instances = await this.prisma.checklistInstance.findMany({
      where,
      include: {
        template: {
          select: {
            code: true,
            name: true,
            category: true,
          },
        },
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return instances;
  }

  /**
   * Update instance status
   * @param instanceId - Instance ID
   * @param status - New status
   * @param context - Request context
   * @returns Updated instance
   */
  async updateInstanceStatus(
    instanceId: string,
    status: ChecklistInstanceStatus,
    context: any
  ) {
    const { tenantId, userId } = context;

    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    const updateData: any = { status };

    // Update timestamps based on status
    if (status === ChecklistInstanceStatus.IN_PROGRESS && !instance.startedAt) {
      updateData.startedAt = new Date();
    } else if (status === ChecklistInstanceStatus.COMPLETED) {
      updateData.completedAt = new Date();
      updateData.completedBy = userId;
    } else if (status === ChecklistInstanceStatus.VERIFIED) {
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = userId;
    }

    const updated = await this.prisma.checklistInstance.update({
      where: { id: instanceId },
      data: updateData,
    });

    this.logger.log(`Instance ${instanceId} status changed to ${status}`);

    return updated;
  }

  /**
   * Calculate and update completion percentage
   * @param instanceId - Instance ID
   * @param tenantId - Tenant ID
   * @returns Updated instance
   */
  async updateCompletionPercent(instanceId: string, tenantId: string) {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
      include: {
        template: {
          include: {
            items: true,
          },
        },
        responses: true,
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    const totalItems = instance.template.items.length;
    const answeredItems = instance.responses.length;
    const completionPercent = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

    const updated = await this.prisma.checklistInstance.update({
      where: { id: instanceId },
      data: { completionPercent },
    });

    return updated;
  }

  /**
   * Check if instance can be marked as completed
   * @param instanceId - Instance ID
   * @param tenantId - Tenant ID
   * @returns Boolean indicating if instance is ready for completion
   */
  async canComplete(instanceId: string, tenantId: string): Promise<boolean> {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
      include: {
        template: {
          include: {
            items: {
              where: { isRequired: true },
            },
          },
        },
        responses: true,
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    // If template requires all items, check all items are answered
    if (instance.template.requiresAllItems) {
      const totalItems = await this.prisma.checklistTemplateItem.count({
        where: { templateId: instance.templateId },
      });
      const answeredItems = instance.responses.length;
      return answeredItems >= totalItems;
    }

    // Check if all required items are answered
    const requiredItemIds = instance.template.items.map((item) => item.id);
    const answeredRequiredItems = instance.responses.filter((response) =>
      requiredItemIds.includes(response.templateItemId)
    );

    return answeredRequiredItems.length >= requiredItemIds.length;
  }

  /**
   * Mark instance as completed
   * @param instanceId - Instance ID
   * @param context - Request context
   * @returns Updated instance
   */
  async completeInstance(instanceId: string, context: any) {
    const { tenantId, userId } = context;

    const canComplete = await this.canComplete(instanceId, tenantId);

    if (!canComplete) {
      throw new BadRequestException('Cannot complete checklist: required items not answered');
    }

    const updated = await this.updateInstanceStatus(
      instanceId,
      ChecklistInstanceStatus.COMPLETED,
      context
    );

    this.logger.log(`Instance ${instanceId} completed by ${userId}`);

    return updated;
  }

  /**
   * Verify a completed instance
   * @param instanceId - Instance ID
   * @param context - Request context
   * @returns Updated instance
   */
  async verifyInstance(instanceId: string, context: any) {
    const { tenantId, userId } = context;

    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
      include: {
        template: true,
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    if (instance.status !== ChecklistInstanceStatus.COMPLETED) {
      throw new BadRequestException('Can only verify completed checklists');
    }

    // Check self-verification rule
    if (
      !instance.template.allowSelfVerification &&
      instance.completedBy === userId
    ) {
      throw new BadRequestException('You cannot verify your own checklist');
    }

    const updated = await this.updateInstanceStatus(
      instanceId,
      ChecklistInstanceStatus.VERIFIED,
      context
    );

    this.logger.log(`Instance ${instanceId} verified by ${userId}`);

    return updated;
  }

  /**
   * Cancel an instance
   * @param instanceId - Instance ID
   * @param context - Request context
   * @returns Updated instance
   */
  async cancelInstance(instanceId: string, context: any) {
    const updated = await this.updateInstanceStatus(
      instanceId,
      ChecklistInstanceStatus.CANCELLED,
      context
    );

    this.logger.log(`Instance ${instanceId} cancelled`);

    return updated;
  }
}
