import { ApiProperty } from '@nestjs/swagger';

export class EventListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patient_id: string;

  @ApiProperty({ required: false })
  patient_display_name?: string;

  @ApiProperty({ required: false })
  patient_mrn?: string;

  @ApiProperty()
  event_type: string;

  @ApiProperty({ required: false })
  event_subtype?: string;

  @ApiProperty()
  severity: number;

  @ApiProperty()
  occurred_at: string;

  @ApiProperty()
  source_system: string;

  @ApiProperty()
  source_module: string;

  @ApiProperty()
  entity_type: string;

  @ApiProperty()
  entity_id: string;

  @ApiProperty()
  created_at: string;
}

export class ListEventsResponseDto {
  @ApiProperty({ type: [EventListItemDto] })
  data: EventListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
