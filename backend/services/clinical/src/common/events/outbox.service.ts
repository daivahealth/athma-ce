import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@zeal/database-clinical';
import type { DomainEventInput } from './domain-events';

/** The Prisma client surface write() needs — works with both the service and a transaction client. */
type PrismaWriter = { domainEvent: { create(args: { data: Prisma.DomainEventUncheckedCreateInput }): Promise<unknown> } };

/**
 * Transactional outbox writer (issue #112). ALWAYS call inside the same
 * $transaction as the domain change — that is the whole point: the event
 * exists iff the change committed. Delivery is the dispatcher's job.
 */
@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  async write(tx: PrismaWriter, event: DomainEventInput): Promise<void> {
    await tx.domainEvent.create({
      data: {
        eventType: event.eventType,
        tenantId: event.tenantId,
        facilityId: event.facilityId ?? null,
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        payload: event.payload as Prisma.InputJsonValue,
      },
    });
    this.logger.debug(`Outbox: ${event.eventType} for ${event.aggregateType}/${event.aggregateId}`);
  }
}
