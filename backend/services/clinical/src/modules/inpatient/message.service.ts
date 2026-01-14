import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { MessageType, MessageVisibility, MessagePriority } from '@zeal/database-clinical';
import { PostMessageDto, PostTextMessageDto } from './dto/post-message.dto';
import { GetTimelineDto } from './dto/get-timeline.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Post a text message to the channel (human chat)
   * @param channelId - Channel ID
   * @param dto - Text message content
   * @param authorStaffId - Staff member posting the message
   * @param context - Request context
   * @returns Created message
   */
  async postTextMessage(
    channelId: string,
    dto: PostTextMessageDto,
    authorStaffId: string,
    context: any,
  ) {
    const { tenantId, facilityId } = context;

    // Verify channel exists
    const channel = await this.prisma.careChannel.findUnique({
      where: { id: channelId, tenantId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    // Create text message
    const message = await this.prisma.channelMessage.create({
      data: {
        tenantId,
        facilityId,
        channelId,
        messageType: MessageType.TEXT,
        messageSubtype: 'care_team_chat',
        bodyText: dto.bodyText,
        visibility: MessageVisibility.CARE_TEAM,
        priority: dto.priority || MessagePriority.NORMAL,
        authorStaffId,
        isSystemMessage: false,
      },
    });

    this.logger.log(`Text message posted to channel ${channelId} by staff ${authorStaffId}`);

    return message;
  }

  /**
   * Post a system message (for automated events)
   * @param channelId - Channel ID
   * @param dto - System message details
   * @param context - Request context
   * @returns Created message
   */
  async postSystemMessage(channelId: string, dto: PostMessageDto, context: any) {
    const { tenantId, facilityId } = context;

    // Verify channel exists
    const channel = await this.prisma.careChannel.findUnique({
      where: { id: channelId, tenantId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    // Check idempotency if key provided
    if (dto.idempotencyKey) {
      const existing = await this.prisma.channelMessage.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existing) {
        this.logger.warn(`Duplicate idempotency key: ${dto.idempotencyKey}`);
        return existing;
      }
    }

    // Create system message
    const messageData: any = {
      tenantId,
      facilityId,
      channelId,
      messageType: dto.messageType,
      messageSubtype: dto.messageSubtype || null,
      bodyText: dto.bodyText || null,
      linkedEntityType: dto.linkedEntityType || null,
      linkedEntityId: dto.linkedEntityId || null,
      visibility: dto.visibility || MessageVisibility.CARE_TEAM,
      priority: dto.priority || MessagePriority.NORMAL,
      authorStaffId: dto.authorStaffId || null,
      isSystemMessage: dto.isSystemMessage ?? true,
      idempotencyKey: dto.idempotencyKey || null,
    };

    // Only include payloadJson if it's provided
    if (dto.payloadJson !== undefined) {
      messageData.payloadJson = dto.payloadJson;
    }

    const message = await this.prisma.channelMessage.create({
      data: messageData,
    });

    this.logger.log(
      `System message posted to channel ${channelId}: ${dto.messageSubtype}`,
    );

    return message;
  }

  /**
   * Get timeline of messages for a channel
   * @param channelId - Channel ID
   * @param filters - Filter options
   * @param tenantId - Tenant ID
   * @returns Paginated messages with metadata
   */
  async getTimeline(channelId: string, filters: GetTimelineDto, tenantId: string) {
    const { limit = 50, offset = 0, messageType, messageSubtype, since, search } = filters;

    // Build where clause
    const where: any = {
      channelId,
      tenantId,
      deletedAt: null, // Exclude soft-deleted messages
    };

    if (messageType) {
      where.messageType = messageType;
    }

    if (messageSubtype) {
      where.messageSubtype = messageSubtype;
    }

    if (since) {
      where.createdAt = {
        gte: new Date(since),
      };
    }

    if (search) {
      where.bodyText = {
        contains: search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    // Get messages
    const [messages, total] = await Promise.all([
      this.prisma.channelMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.channelMessage.count({ where }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Search messages in a channel (full-text search)
   * @param channelId - Channel ID
   * @param searchTerm - Search term
   * @param tenantId - Tenant ID
   * @returns Matching messages
   */
  async searchMessages(channelId: string, searchTerm: string, tenantId: string) {
    return this.prisma.channelMessage.findMany({
      where: {
        channelId,
        tenantId,
        deletedAt: null,
        bodyText: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Get a single message by ID
   * @param messageId - Message ID
   * @param tenantId - Tenant ID
   * @returns Message or throws not found
   */
  async getMessage(messageId: string, tenantId: string) {
    const message = await this.prisma.channelMessage.findUnique({
      where: { id: messageId, tenantId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    return message;
  }

  /**
   * Soft delete a message
   * @param messageId - Message ID
   * @param userId - User deleting the message
   * @param tenantId - Tenant ID
   * @returns Updated message
   */
  async deleteMessage(messageId: string, userId: string, tenantId: string) {
    const message = await this.prisma.channelMessage.findUnique({
      where: { id: messageId, tenantId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    const deletedMessage = await this.prisma.channelMessage.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    this.logger.log(`Message ${messageId} soft-deleted by ${userId}`);

    return deletedMessage;
  }
}
