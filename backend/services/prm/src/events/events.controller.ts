/**
 * Events Controller
 * Replaces Express events.routes.ts
 */

import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OidcAuthGuard } from '../auth/guards/oidc-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { TenantService } from '../tenant/tenant.service';
import { EventsService } from './events.service';
import { IngestEventDto } from './dto/ingest-event.dto';
import { EventResponseDto } from './dto/event-response.dto';

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
}
