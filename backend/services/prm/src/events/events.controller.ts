/**
 * Events Controller
 * Replaces Express events.routes.ts
 */

import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OidcAuthGuard } from '../auth/guards/oidc-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { TenantService } from '../tenant/tenant.service';
import { EventsService } from './events.service';
import { IngestEventDto } from './dto/ingest-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { ListEventsQueryDto } from './dto/list-events.query';
import { ListEventsResponseDto } from './dto/list-events.response';

@ApiTags('Events')
@ApiBearerAuth('bearer')
@Controller('v1/events')
@UseGuards(OidcAuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly tenantService: TenantService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ingest engagement event (idempotent)' })
  @ApiResponse({
    status: 201,
    description: 'Event ingested successfully',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async ingestEvent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: IngestEventDto,
  ): Promise<EventResponseDto> {
    // Validate no tenant_id in body
    this.tenantService.validateNoTenantIdInBody(dto as any);

    // Ingest event
    const result = await this.eventsService.ingestEvent(tenantId, userId, dto);

    return {
      event_id: result.event.id,
      duplicate: result.duplicate,
      rules_evaluated: result.rulesEvaluated,
      jobs_created: result.jobsCreated,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List engagement events' })
  @ApiResponse({
    status: 200,
    description: 'Events fetched successfully',
    type: ListEventsResponseDto,
  })
  async listEvents(
    @TenantId() tenantId: string,
    @Query() query: ListEventsQueryDto,
  ): Promise<ListEventsResponseDto> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const { data, total } = await this.eventsService.listEvents(tenantId, {
      patientId: query.patient_id,
      eventType: query.event_type,
      entityType: query.entity_type,
      limit,
      offset,
    });

    return {
      data: data.map((event) => ({
        id: event.id,
        patient_id: event.patientId,
        patient_display_name: event.patientDisplayName ?? undefined,
        patient_mrn: event.patientRef ?? undefined,
        event_type: event.eventType,
        event_subtype: event.eventSubtype ?? undefined,
        severity: event.severity,
        occurred_at: event.occurredAt.toISOString(),
        source_system: event.sourceSystem,
        source_module: event.sourceModule,
        entity_type: event.entityType,
        entity_id: event.entityId,
        created_at: event.createdAt.toISOString(),
      })),
      total,
      limit,
      offset,
    };
  }
}
