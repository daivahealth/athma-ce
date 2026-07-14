/**
 * Notifications Module
 *
 * Notification center + SSE event stream for the app topbar. Lives in the PRM
 * service because notifications are derived from the same patient-engagement
 * signals that flow through the events pipeline.
 */

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SseAuthGuard } from './guards/sse-auth.guard';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SseAuthGuard],
  exports: [NotificationsService],
})
export class NotificationsModule {}
