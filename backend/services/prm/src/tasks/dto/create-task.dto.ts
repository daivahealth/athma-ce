/**
 * Create Task DTO
 */

import { IsString, IsOptional, IsUUID, IsInt, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Patient ID (UUID)' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Task type', example: 'follow_up' })
  @IsString()
  task_type: string;

  @ApiProperty({ description: 'Task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Priority (1=low, 2=medium, 3=high, 4=urgent)', default: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;

  @ApiPropertyOptional({ description: 'Assigned to user ID' })
  @IsOptional()
  @IsUUID()
  assigned_to_user_id?: string;

  @ApiPropertyOptional({ description: 'Assigned to role' })
  @IsOptional()
  @IsString()
  assigned_to_role?: string;

  @ApiPropertyOptional({ description: 'Due date/time' })
  @IsOptional()
  @IsDateString()
  due_at?: string;

  @ApiPropertyOptional({ description: 'Related entity type' })
  @IsOptional()
  @IsString()
  related_entity_type?: string;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsOptional()
  @IsUUID()
  related_entity_id?: string;
}
