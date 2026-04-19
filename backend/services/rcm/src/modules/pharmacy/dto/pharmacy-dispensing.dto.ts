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

export enum DispensingSource {
  DIGITAL_PRESCRIPTION = 'digital_prescription', // standard queue from clinical system
  OTC = 'otc',                                    // over-the-counter, no prescription required
  PAPER_OP = 'paper_op',                          // paper outpatient prescription
  PAPER_WARD = 'paper_ward',                      // paper ward / inpatient prescription
}

export class CreateDispensingDto {
  @ApiPropertyOptional({ description: 'Prescription order UUID (from Clinical DB) — omit for OTC / paper Rx' })
  @IsUUID("loose" as any)
  @IsOptional()
  prescriptionOrderId?: string;

  @ApiPropertyOptional({ description: 'Encounter UUID (from Clinical DB) — omit for OTC / walk-in' })
  @IsUUID("loose" as any)
  @IsOptional()
  encounterId?: string;

  @ApiProperty({ description: 'Patient UUID (from Clinical DB)' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Dispensing channel', enum: DispensingChannel, default: DispensingChannel.OUTPATIENT_COUNTER })
  @IsString()
  @IsOptional()
  dispensingChannel?: string;

  @ApiPropertyOptional({ description: 'How the dispensing was initiated', enum: DispensingSource, default: DispensingSource.DIGITAL_PRESCRIPTION })
  @IsString()
  @IsOptional()
  dispensingSource?: string;

  @ApiPropertyOptional({ description: 'Reference number on a paper prescription (OTC / paper_op / paper_ward)' })
  @IsString()
  @IsOptional()
  paperPrescriptionRef?: string;

  @ApiPropertyOptional({ description: 'Patient display name (used when no encounterId is provided)' })
  @IsString()
  @IsOptional()
  patientDisplayName?: string;

  @ApiPropertyOptional({ description: 'MRN (used when no encounterId is provided)' })
  @IsString()
  @IsOptional()
  mrn?: string;
}

export class VerifyDispensingDto {
  @ApiPropertyOptional({ description: 'Pharmacist verification notes' })
  @IsString()
  @IsOptional()
  verificationNotes?: string;
}

export class DispenseItemDto {
  @ApiProperty({ description: 'Stock UUID to dispense from (FEFO batch)' })
  @IsUUID("loose" as any)
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
  @IsUUID("loose" as any)
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
  @IsUUID("loose" as any)
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
  @IsUUID("loose" as any)
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Filter by encounter UUID' })
  @IsUUID("loose" as any)
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
