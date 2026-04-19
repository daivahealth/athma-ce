import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PharmacyStockStatus {
  ACTIVE = 'active',
  QUARANTINED = 'quarantined',
  EXPIRED = 'expired',
  DEPLETED = 'depleted',
  RECALLED = 'recalled',
}

export class CreatePharmacyStockDto {
  @ApiProperty({ description: 'Drug code (NDC, RxNorm, or local formulary)' })
  @IsString()
  @IsNotEmpty()
  drugCode!: string;

  @ApiPropertyOptional({ description: 'Code system (NDC, RXNORM, LOCAL)', default: 'NDC' })
  @IsString()
  @IsOptional()
  codeSystem?: string;

  @ApiProperty({ description: 'Drug name (English)' })
  @IsString()
  @IsNotEmpty()
  drugName!: string;

  @ApiPropertyOptional({ description: 'Drug name (Arabic)' })
  @IsString()
  @IsOptional()
  drugNameAr?: string;

  @ApiPropertyOptional({ description: 'Generic name' })
  @IsString()
  @IsOptional()
  genericName?: string;

  @ApiProperty({ description: 'Dosage form (tablet, capsule, injection, syrup, etc.)' })
  @IsString()
  @IsNotEmpty()
  dosageForm!: string;

  @ApiPropertyOptional({ description: 'Strength (e.g. 500mg, 10mg/ml)' })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiProperty({ description: 'Unit of measure (tablets, vials, bottles, etc.)' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty({ description: 'Batch / lot number' })
  @IsString()
  @IsNotEmpty()
  batchNumber!: string;

  @ApiPropertyOptional({ description: 'Manufacturer name' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Expiry date (ISO 8601 date, e.g. 2026-12-31)' })
  @IsDateString()
  expiryDate!: string;

  @ApiProperty({ description: 'Quantity received in this batch' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantityReceived!: number;

  @ApiPropertyOptional({ description: 'Reorder level — triggers low-stock alert' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  reorderLevel?: number;

  @ApiPropertyOptional({ description: 'Suggested reorder quantity' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  reorderQuantity?: number;

  @ApiPropertyOptional({ description: 'Facility UUID' })
  @IsUUID("loose" as any)
  @IsOptional()
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Physical storage location (e.g. Fridge-A, Shelf-3B)' })
  @IsString()
  @IsOptional()
  storageLocation?: string;

  @ApiPropertyOptional({ description: 'Unit cost price for COGS' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  unitCostPrice?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Medication catalog UUID (logical FK → MedicationMaster in Clinical DB)' })
  @IsUUID("loose" as any)
  @IsOptional()
  medicationId?: string;

  @ApiPropertyOptional({ description: 'Linked billing item UUID for automatic charge posting (auto-resolved from medicationId if omitted)' })
  @IsUUID("loose" as any)
  @IsOptional()
  billingItemId?: string;

  @ApiPropertyOptional({ description: 'Is this a controlled substance?' })
  @IsBoolean()
  @IsOptional()
  isControlled?: boolean;

  @ApiPropertyOptional({ description: 'Controlled substance class (e.g. Schedule II)' })
  @IsString()
  @IsOptional()
  controlledClass?: string;
}

export class UpdatePharmacyStockDto extends PartialType(CreatePharmacyStockDto) {}

export class AdjustPharmacyStockDto {
  @ApiProperty({ description: 'New quantity on hand after adjustment (cycle count result)' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  newQuantityOnHand!: number;

  @ApiProperty({ description: 'Reason for adjustment (e.g. cycle count, damage, write-off)' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class PharmacyStockFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by drug code' })
  @IsString()
  @IsOptional()
  drugCode?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: PharmacyStockStatus })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by facility UUID' })
  @IsUUID("loose" as any)
  @IsOptional()
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Return only stock expiring before this date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  expiringBefore?: string;

  @ApiPropertyOptional({ description: 'Filter by medication catalog UUID' })
  @IsUUID("loose" as any)
  @IsOptional()
  medicationId?: string;

  @ApiPropertyOptional({ description: 'Return only stock at or below reorder level' })
  @IsOptional()
  lowStock?: string;
}
