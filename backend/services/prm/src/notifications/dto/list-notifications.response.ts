import { ApiProperty } from '@nestjs/swagger';
import { NotificationResponseDto } from './notification-response.dto';

export class ListNotificationsResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  data: NotificationResponseDto[];

  @ApiProperty({ description: 'Total notifications matching the filter' })
  total: number;

  @ApiProperty({ description: 'Unread notifications for the current recipient' })
  unread_count: number;

  @ApiProperty({ description: 'Applied page size' })
  limit: number;

  @ApiProperty({ description: 'Applied offset' })
  offset: number;
}

export class UnreadCountResponseDto {
  @ApiProperty({ description: 'Unread notifications for the current recipient' })
  unread_count: number;
}
