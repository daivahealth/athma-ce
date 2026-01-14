import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ChannelStatus } from '@zeal/database-clinical';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a care channel for an admission
   * @param admissionId - The admission ID
   * @param context - Request context (tenantId, facilityId, userId)
   * @returns Created channel
   */
  async createChannel(admissionId: string, context: any) {
    const { tenantId, facilityId, userId } = context;

    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
      select: {
        id: true,
        patientId: true,
        encounterId: true,
        admissionNumber: true,
      },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Check if channel already exists
    const existingChannel = await this.prisma.careChannel.findUnique({
      where: { admissionId },
    });

    if (existingChannel) {
      this.logger.warn(`Channel already exists for admission ${admissionId}`);
      return existingChannel;
    }

    // Create channel
    const channel = await this.prisma.careChannel.create({
      data: {
        tenantId,
        facilityId,
        admissionId,
        patientId: admission.patientId,
        encounterId: admission.encounterId,
        channelName: `Admission ${admission.admissionNumber}`,
        status: ChannelStatus.ACTIVE,
        createdBy: userId,
      },
    });

    this.logger.log(`Care channel created: ${channel.id} for admission ${admissionId}`);

    return channel;
  }

  /**
   * Get channel by admission ID
   * @param admissionId - The admission ID
   * @param tenantId - Tenant ID
   * @returns Channel or null
   */
  async getChannelByAdmissionId(admissionId: string, tenantId: string) {
    return this.prisma.careChannel.findUnique({
      where: { admissionId, tenantId },
      include: {
        members: {
          where: { removedAt: null }, // Active members only
          orderBy: { addedAt: 'asc' },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  /**
   * Close a care channel
   * @param channelId - Channel ID
   * @param closureReason - Reason for closing
   * @param userId - User closing the channel
   * @param tenantId - Tenant ID
   * @returns Updated channel
   */
  async closeChannel(channelId: string, closureReason: string, userId: string, tenantId: string) {
    const channel = await this.prisma.careChannel.findUnique({
      where: { id: channelId, tenantId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    const updatedChannel = await this.prisma.careChannel.update({
      where: { id: channelId },
      data: {
        status: ChannelStatus.CLOSED,
        closedAt: new Date(),
        closedBy: userId,
        closureReason,
      },
    });

    this.logger.log(`Channel ${channelId} closed by ${userId}. Reason: ${closureReason}`);

    return updatedChannel;
  }

  /**
   * Reopen a closed care channel
   * @param channelId - Channel ID
   * @param userId - User reopening the channel
   * @param tenantId - Tenant ID
   * @returns Updated channel
   */
  async reopenChannel(channelId: string, userId: string, tenantId: string) {
    const channel = await this.prisma.careChannel.findUnique({
      where: { id: channelId, tenantId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    const updatedChannel = await this.prisma.careChannel.update({
      where: { id: channelId },
      data: {
        status: ChannelStatus.ACTIVE,
        closedAt: null,
        closedBy: null,
        closureReason: null,
      },
    });

    this.logger.log(`Channel ${channelId} reopened by ${userId}`);

    return updatedChannel;
  }
}
