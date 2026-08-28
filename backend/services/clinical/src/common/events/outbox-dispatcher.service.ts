import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

/**
 * Polling dispatcher for the transactional outbox (issue #112) — the proven
 * PRM job-runner pattern, no broker. Per-subscriber cursor over the strictly
 * ordered `seq`; retries with exponential backoff; after MAX_ATTEMPTS the
 * event is dead-lettered for that subscriber and the cursor advances so one
 * poison event never blocks the stream.
 *
 * Delivery is one event per POST over the internal service surface
 * (at-least-once — consumers must be idempotent by event id). The envelope is
 * deliberately broker-shaped so a real broker could replace this transport
 * without touching producers or consumers.
 */

interface Subscriber {
  id: string;
  url: string;
}

const POLL_MS = 5_000;
const BATCH = 50;
const MAX_ATTEMPTS = 10;
const BASE_BACKOFF_MS = 10_000;

@Injectable()
export class OutboxDispatcherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxDispatcherService.name);
  private timer?: NodeJS.Timeout;
  private running = false;
  private subscribers: Subscriber[] = [];

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    this.subscribers = this.resolveSubscribers();
    if (this.subscribers.length === 0) {
      this.logger.log('Outbox dispatcher idle: no subscribers configured');
      return;
    }
    this.logger.log(
      `Outbox dispatcher polling every ${POLL_MS / 1000}s for: ${this.subscribers.map((s) => s.id).join(', ')}`,
    );
    this.timer = setInterval(() => void this.tick(), POLL_MS);
    this.timer.unref?.();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Subscribers come from OUTBOX_SUBSCRIBERS (JSON array of {id, url});
   * by default the abdm-connector subscribes when the internal surface is
   * configured.
   */
  private resolveSubscribers(): Subscriber[] {
    const raw = process.env.OUTBOX_SUBSCRIBERS;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Subscriber[];
        return parsed.filter((s) => s?.id && s?.url);
      } catch {
        this.logger.error('OUTBOX_SUBSCRIBERS is not valid JSON — no subscribers active');
        return [];
      }
    }
    if (process.env.INTERNAL_API_KEY) {
      const base = (process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '');
      return [{ id: 'abdm-connector', url: `${base}/api/v1/internal/events` }];
    }
    return [];
  }

  /** One poll cycle; overlap-guarded. */
  private async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      for (const subscriber of this.subscribers) {
        await this.drain(subscriber);
      }
    } catch (error) {
      this.logger.error(`Outbox dispatch cycle failed: ${error}`);
    } finally {
      this.running = false;
    }
  }

  private async drain(subscriber: Subscriber): Promise<void> {
    const cursor = await this.prisma.outboxCursor.upsert({
      where: { subscriberId: subscriber.id },
      create: { subscriberId: subscriber.id },
      update: {},
    });

    if (cursor.nextAttemptAt && cursor.nextAttemptAt.getTime() > Date.now()) return;

    const events = await this.prisma.domainEvent.findMany({
      where: { seq: { gt: cursor.position } },
      orderBy: { seq: 'asc' },
      take: BATCH,
    });

    for (const event of events) {
      const delivered = await this.deliver(subscriber, event);
      if (delivered) {
        await this.prisma.outboxCursor.update({
          where: { subscriberId: subscriber.id },
          data: { position: event.seq, attempts: 0, nextAttemptAt: null, lastError: null },
        });
        continue;
      }

      // Re-read: `cursor` is stale after any successful deliveries this batch.
      const fresh = await this.prisma.outboxCursor.findUnique({
        where: { subscriberId: subscriber.id },
      });
      const attempts = (fresh?.attempts ?? 0) + 1;
      if (attempts >= MAX_ATTEMPTS) {
        await this.prisma.$transaction([
          this.prisma.outboxDeadLetter.create({
            data: {
              subscriberId: subscriber.id,
              eventId: event.id,
              seq: event.seq,
              error: `Gave up after ${attempts} attempts`,
            },
          }),
          this.prisma.outboxCursor.update({
            where: { subscriberId: subscriber.id },
            data: { position: event.seq, attempts: 0, nextAttemptAt: null },
          }),
        ]);
        this.logger.error(
          `DEAD-LETTERED event ${event.eventType} seq=${event.seq} for '${subscriber.id}' after ${attempts} attempts`,
        );
        continue;
      }

      const backoffMs = Math.min(BASE_BACKOFF_MS * 2 ** (attempts - 1), 15 * 60_000);
      await this.prisma.outboxCursor.update({
        where: { subscriberId: subscriber.id },
        data: {
          attempts,
          nextAttemptAt: new Date(Date.now() + backoffMs),
          lastError: `delivery failed (attempt ${attempts})`,
        },
      });
      return; // stop draining this subscriber until backoff elapses
    }
  }

  private async deliver(
    subscriber: Subscriber,
    event: {
      id: string;
      seq: bigint;
      eventType: string;
      eventVersion: number;
      tenantId: string;
      facilityId: string | null;
      aggregateType: string;
      aggregateId: string;
      payload: unknown;
      occurredAt: Date;
    },
  ): Promise<boolean> {
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) return false;
    try {
      const response = await fetch(subscriber.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-internal-api-key': apiKey,
          'x-service-name': 'clinical',
        },
        body: JSON.stringify({
          id: event.id,
          seq: Number(event.seq),
          type: event.eventType,
          version: event.eventVersion,
          tenantId: event.tenantId,
          facilityId: event.facilityId ?? undefined,
          aggregateType: event.aggregateType,
          aggregateId: event.aggregateId,
          occurredAt: event.occurredAt.toISOString(),
          payload: event.payload,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        this.logger.warn(
          `Subscriber '${subscriber.id}' answered ${response.status} for seq=${event.seq}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      this.logger.warn(`Delivery to '${subscriber.id}' failed: ${error}`);
      return false;
    }
  }
}
