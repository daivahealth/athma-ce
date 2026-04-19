/**
 * Update Task DTO
 * For PATCH /v1/tasks/:taskId
 */

import { IsOptional, IsEnum, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SKIPPED = 'skipped',
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Assigned to user ID' })
  @IsOptional()
  @IsUUID("all")
  assigned_to_user_id?: string;

  @ApiPropertyOptional({ description: 'Outcome description' })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiPropertyOptional({ description: 'Completed at timestamp', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  completed_at?: string;
}
