import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { MessageType, MessageVisibility, MessagePriority } from '@zeal/database-clinical';

type PrismaTransaction = Parameters<Parameters<typeof PrismaService.prototype.$transaction>[0]>[0];

@Injectable()
export class ChannelEventEmitter {
  private readonly logger = new Logger(ChannelEventEmitter.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Emit admission created message
   * @param admissionId - Admission ID
   * @param channelId - Channel ID
   * @param context - Request context
   * @param tx - Optional transaction context
   */
  async emitAdmissionCreated(
    admissionId: string,
    channelId: string,
    context: any,
    tx?: PrismaTransaction,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `admission_created:${admissionId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Create admission created message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'admission_created',
        bodyText: 'Patient admission created',
        payloadJson: {
          admissionId,
        },
        linkedEntityType: 'inpatient_admission',
        linkedEntityId: admissionId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit bed transfer message
   * @param bedAssignmentId - Bed assignment ID
   * @param channelId - Channel ID
   * @param transferDetails - Transfer details (from/to ward/bed)
   * @param tx - Transaction context (required)
   * @param context - Request context
   */
  async emitBedTransfer(
    bedAssignmentId: string,
    channelId: string,
    transferDetails: {
      fromBedId?: string;
      toBedId: string;
      fromWardId?: string;
      toWardId: string;
      transferReason?: string;
    },
    tx: PrismaTransaction,
    context: any,
  ) {
    const idempotencyKey = `bed_transfer:${bedAssignmentId}`;

    // Check if message already exists
    const existing = await tx.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = transferDetails.fromWardId
      ? `Patient transferred from ward ${transferDetails.fromWardId} to ward ${transferDetails.toWardId}`
      : `Patient assigned to ward ${transferDetails.toWardId}`;

    // Create transfer message
    return tx.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'bed_transfer',
        bodyText,
        payloadJson: transferDetails,
        linkedEntityType: 'bed_assignment',
        linkedEntityId: bedAssignmentId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }

  /**
   * Emit discharge planning initiated message
   * @param dischargeId - Discharge transaction ID
   * @param channelId - Channel ID
   * @param dischargeDetails - Discharge planning details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitDischargePlanningInitiated(
    dischargeId: string,
    channelId: string,
    dischargeDetails: {
      targetDischargeDate?: Date;
      targetDischargeTime?: string;
      initiatedBy: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `discharge_planning_initiated:${dischargeId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    let bodyText = 'Discharge planning initiated';
    if (dischargeDetails.targetDischargeDate) {
      const targetDate = new Date(dischargeDetails.targetDischargeDate).toLocaleDateString();
      const targetTime = dischargeDetails.targetDischargeTime || '';
      bodyText = `Discharge planning initiated - Target: ${targetDate} ${targetTime}`;
    }

    // Create discharge planning message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_planning_initiated',
        bodyText,
        payloadJson: dischargeDetails,
        linkedEntityType: 'inpatient_discharge',
        linkedEntityId: dischargeId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit discharge ready message
   * @param dischargeId - Discharge transaction ID
   * @param channelId - Channel ID
   * @param readyDetails - Ready details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitDischargeReady(
    dischargeId: string,
    channelId: string,
    readyDetails: {
      readyMarkedBy: string;
      readyRemarks?: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `discharge_ready:${dischargeId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = 'Patient is ready for discharge - All checklist items verified';

    // Create discharge ready message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_ready',
        bodyText,
        payloadJson: readyDetails,
        linkedEntityType: 'inpatient_discharge',
        linkedEntityId: dischargeId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }

  /**
   * Emit discharge approved message
   * @param dischargeId - Discharge transaction ID
   * @param channelId - Channel ID
   * @param approvalDetails - Approval details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitDischargeApproved(
    dischargeId: string,
    channelId: string,
    approvalDetails: {
      approvedBy: string;
      approvalRemarks?: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `discharge_approved:${dischargeId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = 'Discharge approved - Patient can be discharged';

    // Create discharge approved message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_approved',
        bodyText,
        payloadJson: approvalDetails,
        linkedEntityType: 'inpatient_discharge',
        linkedEntityId: dischargeId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }

  /**
   * Emit discharge cancelled message
   * @param dischargeId - Discharge transaction ID
   * @param channelId - Channel ID
   * @param cancellationDetails - Cancellation details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitDischargeCancelled(
    dischargeId: string,
    channelId: string,
    cancellationDetails: {
      cancelledBy: string;
      cancellationReason: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `discharge_cancelled:${dischargeId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = `Discharge cancelled - Reason: ${cancellationDetails.cancellationReason}`;

    // Create discharge cancelled message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_cancelled',
        bodyText,
        payloadJson: cancellationDetails,
        linkedEntityType: 'inpatient_discharge',
        linkedEntityId: dischargeId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit discharge intimation message (LEGACY - for old DischargeChecklist)
   * @param checklistId - Discharge checklist ID
   * @param channelId - Channel ID
   * @param tx - Transaction context (required)
   * @param context - Request context
   */
  async emitDischargeIntimation(
    checklistId: string,
    channelId: string,
    tx: PrismaTransaction,
    context: any,
  ) {
    const idempotencyKey = `discharge_intimation:${checklistId}`;

    // Check if message already exists
    const existing = await tx.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Create discharge intimation message
    return tx.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_intimation',
        bodyText: 'Patient is ready for discharge',
        payloadJson: {
          checklistId,
        },
        linkedEntityType: 'discharge_checklist',
        linkedEntityId: checklistId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }

  /**
   * Emit discharge confirmed message
   * @param admissionId - Admission ID
   * @param channelId - Channel ID
   * @param dischargeDetails - Discharge details
   * @param tx - Transaction context (required)
   * @param context - Request context
   */
  async emitDischargeConfirmed(
    admissionId: string,
    channelId: string,
    dischargeDetails: {
      dischargeType?: string;
      dischargeDestination?: string;
      lengthOfStayDays?: number;
    },
    tx: PrismaTransaction,
    context: any,
  ) {
    const idempotencyKey = `discharge_confirmed:${admissionId}`;

    // Check if message already exists
    const existing = await tx.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const destination = dischargeDetails.dischargeDestination || 'home';
    const los = dischargeDetails.lengthOfStayDays
      ? ` after ${dischargeDetails.lengthOfStayDays} days`
      : '';
    const bodyText = `Patient discharged to ${destination}${los}`;

    // Create discharge confirmed message
    return tx.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'discharge_confirmed',
        bodyText,
        payloadJson: dischargeDetails,
        linkedEntityType: 'inpatient_admission',
        linkedEntityId: admissionId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }

  /**
   * Emit clinical order created message (Future)
   * @param orderId - Order ID
   * @param channelId - Channel ID
   * @param orderDetails - Order details
   * @param tx - Transaction context
   * @param context - Request context
   */
  async emitOrderCreated(
    orderId: string,
    channelId: string,
    orderDetails: {
      orderType: string;
      orderName: string;
      priority?: string;
    },
    tx: PrismaTransaction,
    context: any,
  ) {
    const idempotencyKey = `order_created:${orderId}`;

    // Check if message already exists
    const existing = await tx.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = `${orderDetails.orderType} order: ${orderDetails.orderName}`;

    // Create order created message
    return tx.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.CLINICAL_EVENT,
        messageSubtype: 'order_created',
        bodyText,
        payloadJson: orderDetails,
        linkedEntityType: 'clinical_order',
        linkedEntityId: orderId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: orderDetails.priority === 'stat' ? MessagePriority.URGENT : MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit medication administered message (Future)
   * @param medId - Medication administration ID
   * @param channelId - Channel ID
   * @param medDetails - Medication details
   * @param tx - Transaction context
   * @param context - Request context
   */
  async emitMedicationAdministered(
    medId: string,
    channelId: string,
    medDetails: {
      drugName: string;
      dose: string;
      route: string;
      administeredBy?: string;
    },
    tx: PrismaTransaction,
    context: any,
  ) {
    const idempotencyKey = `medication_administered:${medId}`;

    // Check if message already exists
    const existing = await tx.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = `Medication administered: ${medDetails.drugName} ${medDetails.dose} ${medDetails.route}`;

    // Create medication administered message
    return tx.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.CLINICAL_EVENT,
        messageSubtype: 'medication_administered',
        bodyText,
        payloadJson: medDetails,
        linkedEntityType: 'prescription_order',
        linkedEntityId: medId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit checklist created message
   * @param checklistInstanceId - Checklist instance ID
   * @param channelId - Channel ID
   * @param checklistDetails - Checklist details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitChecklistCreated(
    checklistInstanceId: string,
    channelId: string,
    checklistDetails: {
      checklistName: string;
      category: string;
      dueAt?: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `checklist_created:${checklistInstanceId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const dueText = checklistDetails.dueAt
      ? ` - Due: ${new Date(checklistDetails.dueAt).toLocaleString()}`
      : '';
    const bodyText = `Checklist created: ${checklistDetails.checklistName}${dueText}`;

    // Create checklist created message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.CHECKLIST,
        messageSubtype: 'checklist_created',
        bodyText,
        payloadJson: checklistDetails,
        linkedEntityType: 'checklist_instance',
        linkedEntityId: checklistInstanceId,
        checklistInstanceId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit checklist completed message
   * @param checklistInstanceId - Checklist instance ID
   * @param channelId - Channel ID
   * @param checklistDetails - Checklist details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitChecklistCompleted(
    checklistInstanceId: string,
    channelId: string,
    checklistDetails: {
      checklistName: string;
      completionPercent: number;
      completedBy?: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `checklist_completed:${checklistInstanceId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = `Checklist completed: ${checklistDetails.checklistName} (${checklistDetails.completionPercent}%)`;

    // Create checklist completed message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'checklist_completed',
        bodyText,
        payloadJson: checklistDetails,
        linkedEntityType: 'checklist_instance',
        linkedEntityId: checklistInstanceId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.NORMAL,
      },
    });
  }

  /**
   * Emit checklist verified message
   * @param checklistInstanceId - Checklist instance ID
   * @param channelId - Channel ID
   * @param checklistDetails - Checklist details
   * @param tx - Optional transaction context
   * @param context - Request context
   */
  async emitChecklistVerified(
    checklistInstanceId: string,
    channelId: string,
    checklistDetails: {
      checklistName: string;
      verifiedBy?: string;
    },
    tx: PrismaTransaction | null,
    context: any,
  ) {
    const prisma = tx || this.prisma;
    const idempotencyKey = `checklist_verified:${checklistInstanceId}`;

    // Check if message already exists
    const existing = await prisma.channelMessage.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`Duplicate idempotency key: ${idempotencyKey}`);
      return existing;
    }

    // Build human-readable message
    const bodyText = `Checklist verified: ${checklistDetails.checklistName} - Patient ready for discharge`;

    // Create checklist verified message
    return prisma.channelMessage.create({
      data: {
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        channelId,
        messageType: MessageType.SYSTEM,
        messageSubtype: 'checklist_verified',
        bodyText,
        payloadJson: checklistDetails,
        linkedEntityType: 'checklist_instance',
        linkedEntityId: checklistInstanceId,
        isSystemMessage: true,
        idempotencyKey,
        visibility: MessageVisibility.CARE_TEAM,
        priority: MessagePriority.HIGH,
      },
    });
  }
}
