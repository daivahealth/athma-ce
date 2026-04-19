import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsNumber, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ChargeStatus {
  UNBILLED = 'unbilled',
  INVOICED = 'invoiced',
  CANCELLED = 'cancelled',
}

export enum ChargeSourceType {
  ENCOUNTER = 'encounter',
  ORDER = 'order',
  MANUAL = 'manual',
  PHARMACY = 'pharmacy',
}

export class CreateChargeDto {
  @ApiProperty({ description: 'Patient ID (from Clinical DB)' })
  @IsUUID("all")
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Encounter ID (from Clinical DB)' })
  @IsUUID("all")
  @IsOptional()
  encounterId?: string;

  @ApiProperty({ description: 'Billing item ID' })
  @IsUUID("all")
  @IsNotEmpty()
  billingItemId!: string;

  @ApiPropertyOptional({ description: 'Charge date', default: 'CURRENT_DATE' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  chargeDate?: Date;

  @ApiPropertyOptional({ description: 'Quantity', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;

  @ApiProperty({ description: 'Unit price in AED' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  unitPrice!: number;

  @ApiProperty({ description: 'Gross amount (quantity * unit_price)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  grossAmount!: number;

  @ApiPropertyOptional({ description: 'Patient responsibility amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  patientResponsibility?: number;

  @ApiPropertyOptional({ description: 'Payer responsibility amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  payerResponsibility?: number;

  @ApiPropertyOptional({ enum: ChargeStatus, description: 'Charge status', default: 'unbilled' })
  @IsEnum(ChargeStatus)
  @IsOptional()
  status?: ChargeStatus;

  @ApiPropertyOptional({ enum: ChargeSourceType, description: 'Source type' })
  @IsEnum(ChargeSourceType)
  @IsOptional()
  sourceType?: ChargeSourceType;

  @ApiPropertyOptional({ description: 'Source ID' })
  @IsUUID("all")
  @IsOptional()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateChargeDto extends PartialType(CreateChargeDto) {}

export interface ChargeResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string | null;
  billingItemId: string;
  chargeDate: Date;
  quantity: number;
  unitPrice: number;
  grossAmount: number;
  patientResponsibility?: number | null;
  payerResponsibility?: number | null;
  status: ChargeStatus;
  sourceType?: ChargeSourceType | null;
  sourceId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  billingItem?: any; // Can be populated with billing item details
}
