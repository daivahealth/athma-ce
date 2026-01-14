import { IsString, IsEnum, IsOptional, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { MessageType, MessageVisibility, MessagePriority } from '@zeal/database-clinical';

export class PostMessageDto {
  @IsEnum(MessageType)
  messageType!: MessageType;

  @IsOptional()
  @IsString()
  messageSubtype?: string;

  @IsOptional()
  @IsString()
  bodyText?: string;

  @IsOptional()
  @IsObject()
  payloadJson?: Record<string, any>;

  @IsOptional()
  @IsString()
  linkedEntityType?: string;

  @IsOptional()
  @IsUUID()
  linkedEntityId?: string;

  @IsOptional()
  @IsEnum(MessageVisibility)
  visibility?: MessageVisibility;

  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;

  @IsOptional()
  @IsUUID()
  authorStaffId?: string;

  @IsOptional()
  @IsBoolean()
  isSystemMessage?: boolean;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class PostTextMessageDto {
  @IsString()
  bodyText!: string;

  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;
}
