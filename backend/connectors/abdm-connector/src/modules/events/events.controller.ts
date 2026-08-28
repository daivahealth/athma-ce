import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { IsInt, IsISO8601, IsObject, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { PrismaService } from '../../prisma/prisma.service';

// Seeded platform ids are UUID-shaped but not RFC-variant, so IsUUID() rejects them.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class DomainEventDto {
  @Matches(UUID_SHAPE)
  id!: string;

  @IsInt()
  seq!: number;

  @IsString()
  @MaxLength(100)
  type!: string;

  @IsInt()
  version!: number;

  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;

  @IsString()
  @MaxLength(50)
  aggregateType!: string;

  @Matches(UUID_SHAPE)
  aggregateId!: string;

  @IsISO8601()
  occurredAt!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

/**
 * Ingestion endpoint for the clinical outbox dispatcher (issue #114,
 * groundwork). Delivery is at-least-once: the inbox is idempotent by event
 * id — a duplicate acks 200 without a second row. Events are persisted with
 * status 'received'; the M2 handlers (care-context linking, consent) consume
 * from here.
 */
@Controller('internal/events')
@UseGuards(InternalApiKeyGuard)
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Body() dto: DomainEventDto) {
    const existing = await this.prisma.eventInbox.findUnique({ where: { eventId: dto.id } });
    if (existing) {
      return { accepted: true, duplicate: true };
    }

    // Only event types the connector reacts to are kept 'received' for the
    // M2 handlers; everything else is stored as 'ignored' for traceability.
    const relevant = ['patient.identity.linked', 'encounter.closed', 'clinical_document.finalized'];
    await this.prisma.eventInbox.create({
      data: {
        eventId: dto.id,
        seq: BigInt(dto.seq),
        eventType: dto.type,
        tenantId: dto.tenantId,
        facilityId: dto.facilityId ?? null,
        payload: dto.payload as never,
        occurredAt: new Date(dto.occurredAt),
        status: relevant.includes(dto.type) ? 'received' : 'ignored',
      },
    });
    this.logger.log(`Event ${dto.type} seq=${dto.seq} received for tenant ${dto.tenantId}`);
    return { accepted: true, duplicate: false };
  }
}
