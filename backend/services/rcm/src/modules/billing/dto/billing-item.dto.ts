import { IsString, IsOptional, IsNotEmpty, IsEnum, IsBoolean, IsUUID, IsNumber, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ItemType {
  LAB = 'lab',
  IMAGING = 'imaging',
  PROCEDURE = 'procedure',
  CONSULT = 'consult',
  REGISTRATION = 'registration',
  PHARMACY = 'pharmacy',
  PACKAGE = 'package',
  MISC = 'misc',
}

export enum BillingCodeType {
  INTERNAL = 'INTERNAL',
  CPT = 'CPT',
  DHA = 'DHA',
  DOH = 'DOH',
  HAAD = 'HAAD',
  MOHAP = 'MOHAP',
  LOINC = 'LOINC',
  CUSTOM = 'CUSTOM',
}

export enum ChargeType {
  REGISTRATION = 'registration',
  CONSULTATION = 'consultation',
  LAB = 'lab',
  RADIOLOGY = 'radiology',
  PROCEDURE = 'procedure',
  PHARMACY = 'pharmacy',
  PACKAGE = 'package',
  MISC = 'misc',
}

export class CreateBillingItemDto {
  @ApiPropertyOptional({ description: 'Tenant ID (null for global items)' })
  @IsUUID("loose" as any)
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ enum: ItemType, description: 'Item type' })
  @IsEnum(ItemType)
  @IsNotEmpty()
  itemType!: ItemType;

  @ApiPropertyOptional({ description: 'Clinical reference ID (logical FK to Foundation catalog)' })
  @IsUUID("loose" as any)
  @IsOptional()
  clinicalRefId?: string;

  @ApiProperty({ description: 'Billing code' })
  @IsString()
  @IsNotEmpty()
  billingCode!: string;

  @ApiProperty({ enum: BillingCodeType, description: 'Billing code type' })
  @IsEnum(BillingCodeType)
  @IsNotEmpty()
  billingCodeType!: BillingCodeType;

  @ApiProperty({ description: 'Billing description' })
  @IsString()
  @IsNotEmpty()
  billingDescription!: string;

  @ApiProperty({ enum: ChargeType, description: 'Charge type' })
  @IsEnum(ChargeType)
  @IsNotEmpty()
  chargeType!: ChargeType;

  @ApiPropertyOptional({ description: 'Default unit', default: 'each' })
  @IsString()
  @IsOptional()
  defaultUnit?: string;

  @ApiPropertyOptional({ description: 'List price in AED' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  listPrice?: number;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBillingItemDto extends PartialType(CreateBillingItemDto) {}

export interface BillingItemResponseDto {
  id: string;
  tenantId?: string | null;
  itemType: ItemType;
  clinicalRefId?: string | null;
  billingCode: string;
  billingCodeType: BillingCodeType;
  billingDescription: string;
  chargeType: ChargeType;
  defaultUnit: string;
  listPrice?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
