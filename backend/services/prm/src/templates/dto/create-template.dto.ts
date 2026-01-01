/**
 * Create Template DTO
 */

import { IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Channel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  IN_APP = 'in_app',
  PUSH = 'push',
}

export enum ApprovalStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class CreateTemplateDto {
  @ApiProperty({ description: 'Template code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Template category', example: 'transactional' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Communication channel', enum: Channel })
  @IsEnum(Channel)
  channel: Channel;

  @ApiPropertyOptional({ description: 'Language code (ISO 639-1)', default: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Email subject (for email channel)' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Template body (supports Mustache syntax)' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'Variables schema (JSON Schema)', type: 'object' })
  @IsObject()
  variables_schema: Record<string, any>;

  @ApiPropertyOptional({ description: 'Approval status', enum: ApprovalStatus, default: ApprovalStatus.DRAFT })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approval_status?: ApprovalStatus;

  @ApiPropertyOptional({ description: 'Template version', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @ApiPropertyOptional({ description: 'Is template active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
