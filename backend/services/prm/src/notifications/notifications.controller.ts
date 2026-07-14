/**
 * Notifications Controller
 *
 * Notification center + real-time event stream for the app topbar.
 * Routes are tenant- and recipient-scoped via the shared JWT guard.
 */

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { NotificationsService } from './notifications.service';
import { SseAuthGuard } from './guards/sse-auth.guard';
import { ListNotificationsQueryDto } from './dto/list-notifications.query';
import {
  ListNotificationsResponseDto,
  UnreadCountResponseDto,
} from './dto/list-notifications.response';
import { NotificationResponseDto, NotificationSeverity } from './dto/notification-response.dto';
import { SimulateNotificationDto } from './dto/simulate-notification.dto';

/** Rotating samples used by the DEV-only simulate endpoint. */
const SIMULATION_SAMPLES: Array<{
  type: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  entity_ref: string;
}> = [
  {
    type: 'consent_expiring',
    severity: 'warning',
    title: 'Consent expiring',
    body: 'Data-sharing consent for a patient expires in 3 days.',
    entity_ref: 'consent:sample',
  },
  {
    type: 'claim_denied',
    severity: 'error',
    title: 'Claim denied',
    body: 'Payer denied a submitted claim. Review and resubmit.',
    entity_ref: 'claim:sample',
  },
  {
    type: 'lab_out_of_range',
    severity: 'action',
    title: 'HbA1c above target',
    body: 'A patient HbA1c result is above the target threshold.',
    entity_ref: 'encounter:sample',
  },
];

@ApiTags('Notifications')
@ApiBearerAuth('bearer')
@Controller('v1/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List notifications for the current recipient' })
  @ApiResponse({ status: 200, type: ListNotificationsResponseDto })
  async list(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Query() query: ListNotificationsQueryDto,
  ): Promise<ListNotificationsResponseDto> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;

    const { data, total, unreadCount } = await this.notificationsService.list(tenantId, userId, {
      unread: query.unread,
      limit,
      offset,
    });

    return { data, total, unread_count: unreadCount, limit, offset };
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unread notification count for the current recipient' })
  @ApiResponse({ status: 200, type: UnreadCountResponseDto })
  async unreadCount(
    @TenantId() tenantId: string,
    @UserId() userId: string,
  ): Promise<UnreadCountResponseDto> {
    const unread_count = await this.notificationsService.unreadCount(tenantId, userId);
    return { unread_count };
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markRead(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markRead(tenantId, userId, id);
  }

  @Sse('stream')
  @UseGuards(SseAuthGuard)
  @ApiOperation({
    summary: 'Server-Sent Events stream of new notifications (real time)',
    description:
      'EventSource cannot send an Authorization header, so the JWT may also be supplied as the `access_token` query parameter.',
  })
  stream(@TenantId() tenantId: string, @UserId() userId: string): Observable<MessageEvent> {
    return this.notificationsService
      .streamFor(tenantId, userId)
      .pipe(map((notification) => ({ data: notification }) as MessageEvent));
  }

  @Post('simulate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '[DEV ONLY] Emit a sample notification onto the stream',
    description: 'Disabled when NODE_ENV=production. Mirrors the prototype "Simulate incoming event".',
  })
  @ApiResponse({ status: 201, type: NotificationResponseDto })
  @ApiResponse({ status: 403, description: 'Disabled in production' })
  async simulate(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: SimulateNotificationDto,
  ): Promise<NotificationResponseDto> {
    if (this.configService.get<string>('env') === 'production') {
      throw new ForbiddenException('Simulation is disabled in production');
    }

    const sample = SIMULATION_SAMPLES[Math.floor(Math.random() * SIMULATION_SAMPLES.length)];

    return this.notificationsService.create({
      tenantId,
      // Broadcast to the current user unless an audience is provided.
      userId: dto.audience ? null : userId,
      audience: dto.audience ?? null,
      type: dto.type ?? sample.type,
      severity: dto.severity ?? sample.severity,
      title: dto.title ?? sample.title,
      body: dto.body ?? sample.body,
      entityRef: dto.entity_ref ?? sample.entity_ref,
    });
  }
}
