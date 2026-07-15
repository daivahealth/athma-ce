import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { NotificationSeverity } from './notification-response.dto';

const SEVERITIES: NotificationSeverity[] = ['info', 'action', 'warning', 'error'];

/**
 * DEV-ONLY payload for POST /v1/notifications/simulate.
 * All fields optional — omitted values fall back to a rotating sample.
 */
export class SimulateNotificationDto {
  @ApiPropertyOptional({ description: 'Notification type', example: 'consent_expiring' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Severity', enum: SEVERITIES })
  @IsOptional()
  @IsIn(SEVERITIES)
  severity?: NotificationSeverity;

  @ApiPropertyOptional({ description: 'Title', example: 'Consent expiring' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Body text' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Entity reference', example: 'consent:123' })
  @IsOptional()
  @IsString()
  entity_ref?: string;

  @ApiPropertyOptional({ description: 'Audience role, or omit to target the current user' })
  @IsOptional()
  @IsString()
  audience?: string;
}
