import { IsString, IsOptional, IsNotEmpty, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum PayerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreatePayerDto {
  @ApiProperty({ description: 'Payer name' })
  @IsString()
  @IsNotEmpty()
  payerName!: string;

  @ApiPropertyOptional({ description: 'Payer ID (external)' })
  @IsString()
  @IsOptional()
  payerId?: string;

  @ApiPropertyOptional({ description: 'Payer type (insurance, government, private)' })
  @IsString()
  @IsOptional()
  payerType?: string;

  @ApiPropertyOptional({ description: 'Contact information (JSON)' })
  @IsObject()
  @IsOptional()
  contactInfo?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Configuration settings (JSON)' })
  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @ApiPropertyOptional({ enum: PayerStatus, default: PayerStatus.ACTIVE })
  @IsEnum(PayerStatus)
  @IsOptional()
  status?: PayerStatus;
}

export class UpdatePayerDto extends PartialType(CreatePayerDto) {}

export interface PayerResponseDto {
  id: string;
  tenantId: string;
  payerName: string;
  payerId?: string | null;
  payerType?: string | null;
  contactInfo?: Record<string, any>;
  configuration?: Record<string, any>;
  status: PayerStatus;
  createdAt: Date;
  updatedAt: Date;
}
