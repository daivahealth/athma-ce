/**
 * Create Rule DTO
 * Replaces Joi schema for POST /v1/rules
 */

import { IsString, IsOptional, IsObject, IsEnum, IsInt, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ScheduleMode {
  IMMEDIATE = 'IMMEDIATE',
  DELAYED = 'DELAYED',
}

export enum ActionType {
  SEND_MESSAGE = 'SEND_MESSAGE',
  CREATE_TASK = 'CREATE_TASK',
}

export class CreateRuleDto {
  @ApiProperty({ description: 'Rule code (unique per tenant)' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Rule name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Rule category', example: 'appointment_reminders' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Trigger event type', example: 'appointment_confirmed' })
  @IsString()
  trigger_event_type: string;

  @ApiPropertyOptional({ description: 'Trigger event subtype' })
  @IsOptional()
  @IsString()
  trigger_event_subtype?: string;

  @ApiProperty({
    description: 'Condition expression (JSON DSL)',
    type: 'object',
    example: {
      and: [
        { field: 'event.event_type', op: 'eq', value: 'appointment_confirmed' },
        { field: 'patient.age_years_at_event', op: 'gte', value: 65 },
      ],
    },
  })
  @IsObject()
  condition_expr: Record<string, any>;

  @ApiProperty({ description: 'Schedule mode', enum: ScheduleMode })
  @IsEnum(ScheduleMode)
  schedule_mode: ScheduleMode;

  @ApiPropertyOptional({ description: 'Delay in seconds (for DELAYED mode)', example: 82800 })
  @IsOptional()
  @IsInt()
  @Min(0)
  delay_seconds?: number;

  @ApiProperty({ description: 'Action type', enum: ActionType })
  @IsEnum(ActionType)
  action_type: ActionType;

  @ApiProperty({
    description: 'Action payload (JSON)',
    type: 'object',
    example: {
      channel: 'sms',
      template_code: 'apt-reminder-sms',
      purpose: 'care',
    },
  })
  @IsObject()
  action_payload: Record<string, any>;

  @ApiPropertyOptional({ description: 'Priority (higher = more important)', default: 100 })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({ description: 'Cooldown in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  cooldown_seconds?: number;

  @ApiPropertyOptional({ description: 'Idempotency window in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  idempotency_window?: number;

  @ApiPropertyOptional({ description: 'Max executions per day' })
  @IsOptional()
  @IsInt()
  @Min(0)
  max_executions_per_day?: number;

  @ApiPropertyOptional({ description: 'Effective from date', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  effective_from?: string;

  @ApiPropertyOptional({ description: 'Effective to date', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  effective_to?: string;

  @ApiPropertyOptional({ description: 'Is rule active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
