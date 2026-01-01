/**
 * Event Response DTO
 */

import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({ description: 'Created event UUID' })
  event_id: string;

  @ApiProperty({ description: 'Whether this was a duplicate event' })
  duplicate: boolean;

  @ApiProperty({ description: 'Number of rules evaluated' })
  rules_evaluated: number;

  @ApiProperty({ description: 'Number of jobs created' })
  jobs_created: number;
}
