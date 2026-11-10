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
   * Get one page of callbacks (newest first) with the total matching count
   */
  async findAll(
    tenantId: string,
    filters: {
      channel?: string;
      processed?: boolean;
      limit: number;
      offset: number;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.processed !== undefined) {
      where.processed = filters.processed;
    }

    const [data, total] = await Promise.all([
      this.prisma.providerCallback.findMany({
        where,
        orderBy: { receivedAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      this.prisma.providerCallback.count({ where }),
    ]);

    return { data, total };
  }
}
