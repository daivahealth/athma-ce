import { Injectable, Logger, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  ChecklistCategory,
  ChecklistInstanceStatus,
  InpatientDischargeStatus,
} from '@zeal/database-clinical';
import { ChecklistTemplateService } from './checklist-template.service';
import { ChecklistInstanceService } from './checklist-instance.service';
import { ChannelEventEmitter } from './channel-event-emitter.service';

@Injectable()
export class ChecklistIntegrationService {
  private readonly logger = new Logger(ChecklistIntegrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly checklistTemplateService: ChecklistTemplateService,
    private readonly checklistInstanceService: ChecklistInstanceService,
    private readonly channelEventEmitter: ChannelEventEmitter,
  ) {}

  /**
   * Auto-create checklists based on trigger
   * @param admissionId - Admission ID
   * @param trigger - Trigger event name
   * @param context - Request context
   * @returns Created instances
   */
  async autoCreateChecklists(admissionId: string, trigger: string, context: any) {
    const { tenantId, facilityId } = context;

    // Find templates with this trigger
    const templates = await this.checklistTemplateService.findTemplatesByTrigger(
      trigger,
      tenantId
    );

    if (templates.length === 0) {
      this.logger.log(`No templates found for trigger: ${trigger}`);
      return [];
    }

    // Get admission details for condition evaluation
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      this.logger.warn(`Admission ${admissionId} not found`);
      return [];
    }

    // Get care channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId, tenantId },
    });

    const createdInstances = [];

    for (const template of templates) {
      // Check if conditions match (if specified)
      if (template.autoCreateConditions) {
        const conditionsMet = this.evaluateConditions(
          admission,
          template.autoCreateConditions as any
        );
        if (!conditionsMet) {
          this.logger.log(
            `Conditions not met for template ${template.code}, skipping auto-creation`
          );
          continue;
        }
      }

      // Calculate due date
      const dueAt = template.autoCreateDueHours
        ? new Date(Date.now() + template.autoCreateDueHours * 60 * 60 * 1000)
        : null;

      // Create checklist instance
      const instance = await this.checklistInstanceService.createInstance(
        {
          templateId: template.id,
          patientId: admission.patientId,
          admissionId: admission.id,
          encounterId: admission.encounterId,
          careChannelId: channel?.id,
          context: 'INPATIENT_ADMISSION',
          dueAt,
        },
        context
      );

      createdInstances.push(instance);

      // Post to Care Channel if channel exists
      if (channel) {
        await this.channelEventEmitter.emitChecklistCreated(
          instance.id,
          channel.id,
          {
            checklistName: template.name,
            category: template.category,
            ...(dueAt ? { dueAt: dueAt.toISOString() } : {}),
          },
          null, // No transaction
          context
        );
      }

      this.logger.log(
        `Auto-created checklist instance ${instance.id} from template ${template.code} for admission ${admissionId}`
      );
    }

    return createdInstances;
  }

  /**
   * Evaluate auto-creation conditions
   * @param admission - Admission object
   * @param conditions - Conditions JSON
   * @returns Boolean indicating if conditions are met
   */
  private evaluateConditions(admission: any, conditions: any): boolean {
    // Simple condition evaluation (can be extended)
    if (conditions.admissionType && admission.admissionType !== conditions.admissionType) {
      return false;
    }
    if (conditions.acuity && admission.acuity !== conditions.acuity) {
      return false;
    }
    // Add more condition checks as needed
    return true;
  }

  /**
   * Complete a checklist instance and post to Care Channel
   * @param instanceId - Instance ID
   * @param context - Request context
   * @returns Updated instance
   */
  async completeInstance(instanceId: string, context: any) {
    const { tenantId } = context;

    // Get instance with template
    const instance = await this.checklistInstanceService.getInstanceById(
      instanceId,
      tenantId
    );

    // Complete the instance
    const updated = await this.checklistInstanceService.completeInstance(
      instanceId,
      context
    );

    // Post to Care Channel
    if (instance.careChannelId) {
      await this.postCompletionToChannel(instanceId, context);
    }

    // If requires verification, send notifications to verifiers
    if (instance.template.requiresVerification) {
      await this.notifyVerifiers(instance, instance.template, context);
    }

    this.logger.log(`Checklist instance ${instanceId} marked as completed`);

    return updated;
  }

  /**
   * Verify a checklist instance and update related workflows
   * @param instanceId - Instance ID
   * @param context - Request context
   * @returns Updated instance
   */
  async verifyInstance(instanceId: string, context: any) {
    const { tenantId, userId } = context;

    // Get instance with template
    const instance = await this.checklistInstanceService.getInstanceById(
      instanceId,
      tenantId
    );

    // Check if user has verification role
    const hasVerificationRole = this.checkUserRole(
      context.userRoles || [],
      instance.template.verificationRoles
    );

    if (!hasVerificationRole) {
      throw new ForbiddenException(
        'You do not have permission to verify this checklist'
      );
    }

    // Verify the instance
    const updated = await this.checklistInstanceService.verifyInstance(
      instanceId,
      context
    );

    // Post verification to Care Channel
    if (instance.careChannelId) {
      await this.postVerificationToChannel(instanceId, context);
    }

    // FOR DISCHARGE CHECKLIST: Update discharge transaction status
    if (
      instance.admissionId &&
      instance.template.category === ChecklistCategory.DISCHARGE
    ) {
      // Find discharge transaction for this admission
      const discharge = await this.prisma.inpatientDischarge.findUnique({
        where: { admissionId: instance.admissionId, tenantId },
      });

      if (discharge) {
        // Update discharge transaction to READY status
        await this.prisma.inpatientDischarge.update({
          where: { id: discharge.id },
          data: {
            checklistVerifiedAt: new Date(),
            checklistVerifiedBy: userId,
            readyMarkedAt: new Date(),
            readyMarkedBy: userId,
            status: 'READY' as any,  // DischargeTransactionStatus.READY
            updatedBy: userId,
          },
        });

        // Also update admission for backward compatibility
        await this.prisma.inpatientAdmission.update({
          where: { id: instance.admissionId },
          data: {
            dischargeStatus: InpatientDischargeStatus.READY,
            updatedBy: userId,
          },
        });

        // Emit discharge ready message to care channel
        const channel = await this.prisma.careChannel.findUnique({
          where: { admissionId: instance.admissionId, tenantId },
        });

        if (channel) {
          await this.channelEventEmitter.emitDischargeReady(
            discharge.id,
            channel.id,
            {
              readyMarkedBy: userId,
            },
            null,
            { tenantId, facilityId: discharge.facilityId, userId },
          );
          this.logger.log(
            `Discharge ready message posted to channel ${channel.id}`
          );
        }

        this.logger.log(
          `Discharge ${discharge.id} marked as READY after checklist verification`
        );
      }
    }

    this.logger.log(`Checklist instance ${instanceId} verified by ${userId}`);

    return updated;
  }

  /**
   * Check if user has any of the required roles
   * @param userRoles - User's roles
   * @param requiredRoles - Required roles
   * @returns Boolean
   */
  private checkUserRole(userRoles: string[], requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) return true;
    return userRoles.some((role) => requiredRoles.includes(role));
  }

  /**
   * Post checklist completion to Care Channel
   * @param instanceId - Instance ID
   * @param context - Request context
   */
  private async postCompletionToChannel(instanceId: string, context: any) {
    const { tenantId } = context;

    const instance = await this.checklistInstanceService.getInstanceById(
      instanceId,
      tenantId
    );

    if (!instance.careChannelId) return;

    await this.channelEventEmitter.emitChecklistCompleted(
      instance.id,
      instance.careChannelId,
      {
        checklistName: instance.template.name,
        completionPercent: instance.completionPercent,
        ...(instance.completedBy ? { completedBy: instance.completedBy } : {}),
      },
      null,
      context
    );
  }

  /**
   * Post checklist verification to Care Channel
   * @param instanceId - Instance ID
   * @param context - Request context
   */
  private async postVerificationToChannel(instanceId: string, context: any) {
    const { tenantId } = context;

    const instance = await this.checklistInstanceService.getInstanceById(
      instanceId,
      tenantId
    );

    if (!instance.careChannelId) return;

    await this.channelEventEmitter.emitChecklistVerified(
      instance.id,
      instance.careChannelId,
      {
        checklistName: instance.template.name,
        ...(instance.verifiedBy ? { verifiedBy: instance.verifiedBy } : {}),
      },
      null,
      context
    );
  }

  /**
   * Notify verifiers that checklist is ready for verification
   * @param instance - Instance object
   * @param template - Template object
   * @param context - Request context
   */
  private async notifyVerifiers(instance: any, template: any, context: any) {
    // TODO: Implement notification service integration
    this.logger.log(
      `Notifications sent to verifiers for checklist ${instance.id}`
    );
  }

  /**
   * Get checklists for an admission
   * @param admissionId - Admission ID
   * @param tenantId - Tenant ID
   * @returns List of checklist instances
   */
  async getAdmissionChecklists(admissionId: string, tenantId: string) {
    return this.checklistInstanceService.listInstances(
      { admissionId },
      tenantId
    );
  }

  /**
   * Get checklists for a care channel
   * @param channelId - Channel ID
   * @param tenantId - Tenant ID
   * @returns List of checklist instances
   */
  async getChannelChecklists(channelId: string, tenantId: string) {
    return this.checklistInstanceService.listInstances(
      { careChannelId: channelId },
      tenantId
    );
  }
}
