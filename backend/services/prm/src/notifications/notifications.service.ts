/**
 * Notifications Service
 *
 * Owns the notification-center domain for the PRM service: persistence of
 * user-facing notifications and an in-process real-time fan-out used by the SSE
 * stream endpoint. Notifications are derived from the same engagement signals
 * that flow through the events pipeline, which is why they live in PRM.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../database/prisma.service';
import type {
  NotificationResponseDto,
  NotificationSeverity,
} from './dto/notification-response.dto';

/** Internal event carried on the stream, including routing metadata. */
interface StreamEnvelope {
  tenantId: string;
  userId: string | null;
  notification: NotificationResponseDto;
}

export interface CreateNotificationInput {
  tenantId: string;
  userId?: string | null;
  audience?: string | null;
  type: string;
  severity: NotificationSeverity;
  title: string;
  body?: string | null;
  entityRef?: string | null;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly stream$ = new Subject<StreamEnvelope>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recipient predicate: a notification reaches a user if it is addressed to
   * them specifically or broadcast to the whole tenant (userId is null).
   */
  private recipientWhere(tenantId: string, userId: string) {
    return {
      tenantId,
      OR: [{ userId }, { userId: null }],
    };
  }

  async list(
    tenantId: string,
    userId: string,
    filters: { unread?: boolean; limit: number; offset: number },
  ) {
    const where = {
      ...this.recipientWhere(tenantId, userId),
      ...(filters.unread ? { read: false } : {}),
    };

    const unreadWhere = { ...this.recipientWhere(tenantId, userId), read: false };

    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: unreadWhere }),
    ]);

    return {
      data: data.map((n) => this.toResponse(n)),
      total,
      unreadCount,
    };
  }

  async unreadCount(tenantId: string, userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { ...this.recipientWhere(tenantId, userId), read: false },
    });
  }

  async markRead(tenantId: string, userId: string, id: string): Promise<NotificationResponseDto> {
    const existing = await this.prisma.notification.findFirst({
      where: { id, ...this.recipientWhere(tenantId, userId) },
    });

    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    if (existing.read) {
      return this.toResponse(existing);
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });

    return this.toResponse(updated);
  }

  /**
   * Persist a notification and fan it out to any live SSE subscribers.
   */
  async create(input: CreateNotificationInput): Promise<NotificationResponseDto> {
    const created = await this.prisma.notification.create({
      data: {
        id: uuidv4(),
        tenantId: input.tenantId,
        userId: input.userId ?? null,
        audience: input.audience ?? null,
        type: input.type,
        severity: input.severity,
        title: input.title,
        body: input.body ?? null,
        entityRef: input.entityRef ?? null,
      },
    });

    const response = this.toResponse(created);

    this.stream$.next({
      tenantId: created.tenantId,
      userId: created.userId,
      notification: response,
    });

    this.logger.log(`Notification created: ${created.id} (${created.type}/${created.severity})`);

    return response;
  }

  /**
   * SSE stream scoped to a single recipient. Emits every new notification that
   * targets the given user (directly or via tenant broadcast).
   */
  streamFor(tenantId: string, userId: string): Observable<NotificationResponseDto> {
    return this.stream$.asObservable().pipe(
      filter((env) => env.tenantId === tenantId && (env.userId === null || env.userId === userId)),
      map((env) => env.notification),
    );
  }

  private toResponse(n: {
    id: string;
    userId: string | null;
    audience: string | null;
    type: string;
    severity: string;
    title: string;
    body: string | null;
    entityRef: string | null;
    read: boolean;
    createdAt: Date;
  }): NotificationResponseDto {
    return {
      id: n.id,
      user_id: n.userId ?? undefined,
      audience: n.audience ?? undefined,
      type: n.type,
      severity: n.severity as NotificationSeverity,
      title: n.title,
      body: n.body ?? undefined,
      entity_ref: n.entityRef ?? undefined,
      read: n.read,
      created_at: n.createdAt.toISOString(),
    };
  }
}
