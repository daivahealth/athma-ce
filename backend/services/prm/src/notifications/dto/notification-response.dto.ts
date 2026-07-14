import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type NotificationSeverity = 'info' | 'action' | 'warning' | 'error';

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification UUID' })
  id: string;

  @ApiPropertyOptional({ description: 'Target user UUID (null when broadcast to the tenant)' })
  user_id?: string;

  @ApiPropertyOptional({ description: 'Audience role when broadcast (e.g. nurse, billing)' })
  audience?: string;

  @ApiProperty({ description: 'Notification type', example: 'consent_expiring' })
  type: string;

  @ApiProperty({
    description: 'Severity',
    enum: ['info', 'action', 'warning', 'error'],
    example: 'warning',
  })
  severity: NotificationSeverity;

  @ApiProperty({ description: 'Short title', example: 'Consent expiring' })
  title: string;

  @ApiPropertyOptional({ description: 'Longer body text' })
  body?: string;

  @ApiPropertyOptional({
    description: 'Originating entity reference',
    example: 'claim:5f3a-...',
  })
  entity_ref?: string;

  @ApiProperty({ description: 'Whether the notification has been read' })
  read: boolean;

  @ApiProperty({ description: 'ISO-8601 creation timestamp' })
  created_at: string;
}
