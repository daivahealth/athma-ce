/**
 * Providers Service
 * Webhook callback processing
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProvidersService {

  constructor(private prisma: PrismaService) {}

  /**
   * Store webhook callback
   */
  async storeCallback(tenantId: string, channel: string, providerMessageId: string, payload: any) {
    return this.prisma.providerCallback.create({
      data: {
        tenantId,
        channel,
        providerMessageId,
        payload,
        processed: false,
      },
    });
  }

  /**
   * Get all callbacks (with optional filters)
   */
  async findAll(
    tenantId: string,
    filters?: {
      channel?: string;
      processed?: boolean;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.processed !== undefined) {
      where.processed = filters.processed;
    }

    return this.prisma.providerCallback.findMany({
      where,
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
  }
}
