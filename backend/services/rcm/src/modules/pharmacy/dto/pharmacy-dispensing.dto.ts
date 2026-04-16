import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum DispensingStatus {
  QUEUED = 'queued',
  VERIFIED = 'verified',
  DISPENSED = 'dispensed',
  PARTIALLY_DISPENSED = 'partially_dispensed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum DispensingChannel {
  OUTPATIENT_COUNTER = 'outpatient_counter',
  INPATIENT_WARD = 'inpatient_ward',
  INPATIENT_BEDSIDE = 'inpatient_bedside',
  EMERGENCY = 'emergency',
}

export class CreateDispensingDto {
  @ApiProperty({ description: 'Prescription order UUID (from Clinical DB)' })
  @IsUUID()
  @IsNotEmpty()
  prescriptionOrderId!: string;

  @ApiProperty({ description: 'Encounter UUID (from Clinical DB)' })
  @IsUUID()
  @IsNotEmpty()
  encounterId!: string;

  @ApiProperty({ description: 'Patient UUID (from Clinical DB)' })
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Dispensing channel', enum: DispensingChannel, default: DispensingChannel.OUTPATIENT_COUNTER })
  @IsString()
  @IsOptional()
  dispensingChannel?: string;
}

export class VerifyDispensingDto {
  @ApiPropertyOptional({ description: 'Pharmacist verification notes' })
  @IsString()
  @IsOptional()
  verificationNotes?: string;
}

export class DispenseItemDto {
  @ApiProperty({ description: 'Stock UUID to dispense from (FEFO batch)' })
  @IsUUID()
  @IsNotEmpty()
  stockId!: string;

  @ApiProperty({ description: 'Quantity to dispense' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantityDispensed!: number;

  @ApiPropertyOptional({ description: 'Dispensing instructions to patient' })
  @IsString()
  @IsOptional()
  dispensingInstructions?: string;

  @ApiPropertyOptional({ description: 'Is this a generic substitution?' })
  @IsBoolean()
  @IsOptional()
  isSubstituted?: boolean;

  @ApiPropertyOptional({ description: 'Reason for substitution' })
  @IsString()
  @IsOptional()
  substitutionReason?: string;

  @ApiPropertyOptional({ description: 'Original drug code (if substituted)' })
  @IsString()
  @IsOptional()
  originalDrugCode?: string;
}

export class ExecuteDispenseDto {
  @ApiProperty({ description: 'Items to dispense', type: [DispenseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispenseItemDto)
  items!: DispenseItemDto[];

  @ApiPropertyOptional({ description: 'Was patient counselling provided?' })
  @IsBoolean()
  @IsOptional()
  counsellingProvided?: boolean;

  @ApiPropertyOptional({ description: 'Counselling notes' })
  @IsString()
  @IsOptional()
  counsellingNotes?: string;
}

export class DispatchToWardDto {
  @ApiProperty({ description: 'Target ward UUID (from Foundation DB)' })
  @IsUUID()
  @IsNotEmpty()
  wardId!: string;

  @ApiProperty({ description: 'Ward name (denormalized for display)' })
  @IsString()
  @IsNotEmpty()
  wardName!: string;

  @ApiPropertyOptional({ description: 'Bed number' })
  @IsString()
  @IsOptional()
  bedNumber?: string;
}

export class CancelDispensingDto {
  @ApiProperty({ description: 'Reason for cancellation' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class ReturnDispensingItemDto {
  @ApiProperty({ description: 'Stock UUID of the batch being returned' })
  @IsUUID()
  @IsNotEmpty()
  stockId!: string;

  @ApiProperty({ description: 'Quantity being returned' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantityReturned!: number;

  @ApiProperty({ description: 'Reason for return' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class ReturnDispensingDto {
  @ApiProperty({ description: 'Items being returned', type: [ReturnDispensingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnDispensingItemDto)
  items!: ReturnDispensingItemDto[];
}

export class DispensingFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by patient UUID' })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Filter by encounter UUID' })
  @IsUUID()
  @IsOptional()
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: DispensingStatus })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by dispensing channel', enum: DispensingChannel })
  @IsString()
  @IsOptional()
  dispensingChannel?: string;

  @ApiPropertyOptional({ description: 'From date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'To date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
