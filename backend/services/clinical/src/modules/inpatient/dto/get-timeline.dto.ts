import { IsOptional, IsInt, IsEnum, IsString, IsISO8601, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType } from '@zeal/database-clinical';

export class GetTimelineDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  limit?: number = 50;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @IsOptional()
  @IsString()
  messageSubtype?: string;

  @IsOptional()
  @IsISO8601()
  since?: string; // ISO timestamp for incremental sync

  @IsOptional()
  @IsString()
  search?: string; // Full-text search in bodyText
}
