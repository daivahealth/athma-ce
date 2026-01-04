/**
 * Messages Service
 * Read-only access to patient message history
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MessagesService {

  constructor(private prisma: PrismaService) {}

  /**
   * Get all messages (with optional filters)
   */
  async findAll(
    tenantId: string,
    filters?: {
      patientId?: string;
      channel?: string;
      status?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.patientMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  /**
   * Get message by ID
   */
  async findOne(tenantId: string, messageId: string) {
    const message = await this.prisma.patientMessage.findFirst({
      where: { id: messageId, tenantId },
      include: {
        template: true,
        relatedEvent: true,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }

    return message;
  }
}
