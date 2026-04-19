import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum LedgerEntryType {
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND',
  OPENING_BALANCE = 'OPENING_BALANCE',
}

export enum LedgerEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  VOID = 'VOID',
}

export enum AdjustmentType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export class CreateLedgerEntryDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Posting date', default: 'today' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  postingDate?: Date;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Debit amount (charges)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  debitAmount?: number;

  @ApiPropertyOptional({ description: 'Credit amount (payments)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  creditAmount?: number;

  @ApiProperty({ enum: LedgerEntryType, description: 'Entry type' })
  @IsEnum(LedgerEntryType)
  @IsNotEmpty()
  entryType!: LedgerEntryType;

  @ApiProperty({ description: 'Source type (invoice, receipt, refund)' })
  @IsString()
  @IsNotEmpty()
  sourceType!: string;

  @ApiProperty({ description: 'Source document ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({ description: 'Source document number' })
  @IsString()
  @IsNotEmpty()
  sourceNumber!: string;

  @ApiPropertyOptional({ description: 'Encounter ID' })
  @IsUUID("loose" as any)
  @IsOptional()
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Invoice ID (shortcut FK)' })
  @IsUUID("loose" as any)
  @IsOptional()
  invoiceId?: string;

  @ApiPropertyOptional({ description: 'Receipt ID (shortcut FK)' })
  @IsUUID("loose" as any)
  @IsOptional()
  receiptId?: string;

  @ApiPropertyOptional({ description: 'Refund ID (shortcut FK)' })
  @IsUUID("loose" as any)
  @IsOptional()
  refundId?: string;

  @ApiPropertyOptional({ description: 'Credit note ID (shortcut FK)' })
  @IsUUID("loose" as any)
  @IsOptional()
  creditNoteId?: string;

  @ApiPropertyOptional({ description: 'Debit note ID (shortcut FK)' })
  @IsUUID("loose" as any)
  @IsOptional()
  debitNoteId?: string;

  @ApiPropertyOptional({ description: 'Entry description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ enum: LedgerEntryStatus, description: 'Entry status', default: 'POSTED' })
  @IsEnum(LedgerEntryStatus)
  @IsOptional()
  status?: LedgerEntryStatus;

  @ApiPropertyOptional({ description: 'ID of the entry being reversed' })
  @IsUUID("loose" as any)
  @IsOptional()
  reversalOfEntryId?: string;
}

export class LedgerFiltersDto {
  @ApiPropertyOptional({ description: 'Start date filter' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'End date filter' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateTo?: Date;

  @ApiPropertyOptional({ enum: LedgerEntryType, description: 'Entry type filter' })
  @IsEnum(LedgerEntryType)
  @IsOptional()
  entryType?: LedgerEntryType;

  @ApiPropertyOptional({ enum: LedgerEntryStatus, description: 'Status filter' })
  @IsEnum(LedgerEntryStatus)
  @IsOptional()
  status?: LedgerEntryStatus;
}

export class ReverseEntryDto {
  @ApiProperty({ description: 'Reason for reversal' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class CreateAdjustmentDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ description: 'Adjustment amount' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  @ApiProperty({ enum: AdjustmentType, description: 'Adjustment type (credit or debit)' })
  @IsEnum(AdjustmentType)
  @IsNotEmpty()
  adjustmentType!: AdjustmentType;

  @ApiProperty({ description: 'Reason for adjustment' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Posting date', default: 'today' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  postingDate?: Date;
}

export class CreateOpeningBalanceDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ description: 'Opening balance amount (positive = patient owes, negative = credit)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Posting date', default: 'today' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  postingDate?: Date;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}

// Response interfaces
export interface PatientLedgerEntryResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  entryTime: Date;
  postingDate: Date;
  currency: string;
  debitAmount: number;
  creditAmount: number;
  entryType: LedgerEntryType;
  sourceType: string;
  sourceId: string;
  sourceNumber: string;
  encounterId?: string | null;
  invoiceId?: string | null;
  receiptId?: string | null;
  refundId?: string | null;
  creditNoteId?: string | null;
  debitNoteId?: string | null;
  description?: string | null;
  notes?: string | null;
  status: LedgerEntryStatus;
  reversalOfEntryId?: string | null;
  createdAt: Date;
  createdBy?: string | null;
  postedAt?: Date | null;
  postedBy?: string | null;
  runningBalance?: number;
}

export interface PatientBalanceSummaryDto {
  patientId: string;
  currency: string;
  balance: number;
  totalDebits: number;
  totalCredits: number;
  lastLedgerEntryId?: string | null;
  lastLedgerEntryTime?: Date | null;
  updatedAt: Date;
}

export interface PatientLedgerListResponseDto {
  entries: PatientLedgerEntryResponseDto[];
  summary: PatientBalanceSummaryDto | null;
}
