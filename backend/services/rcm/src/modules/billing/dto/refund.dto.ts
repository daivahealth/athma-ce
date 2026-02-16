import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
  VOIDED = 'voided',
}

export enum RefundMethod {
  CASH = 'cash',
  CARD_REVERSAL = 'card_reversal',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  WALLET = 'wallet',
  OTHER = 'other',
}

export class RefundAllocationDto {
  @ApiProperty({ description: 'Invoice ID' })
  @IsUUID()
  @IsNotEmpty()
  invoiceId!: string;

  @ApiProperty({ description: 'Amount to allocate to this invoice' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  allocatedAmount!: number;
}

export class CreateRefundDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Receipt ID (for receipt-linked refunds)' })
  @IsUUID()
  @IsOptional()
  receiptId?: string;

  @ApiPropertyOptional({ description: 'Refund number (auto-generated if not provided)' })
  @IsString()
  @IsOptional()
  refundNumber?: string;

  @ApiPropertyOptional({ description: 'Refund date', default: 'now()' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  refundDate?: Date;

  @ApiProperty({ description: 'Refund amount in base currency' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({ description: 'Base currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Amount refunded in actual currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  refundedAmount?: number;

  @ApiPropertyOptional({ description: 'Refunded currency code (e.g., USD, EUR)' })
  @IsString()
  @IsOptional()
  refundedCurrency?: string;

  @ApiPropertyOptional({ description: 'FX rate to convert refunded currency to base currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  fxRateToBase?: number;

  @ApiProperty({ enum: RefundMethod, description: 'Refund method' })
  @IsEnum(RefundMethod)
  @IsNotEmpty()
  refundMethod!: RefundMethod;

  @ApiPropertyOptional({ description: 'Transaction reference' })
  @IsString()
  @IsOptional()
  txnReference?: string;

  @ApiPropertyOptional({ description: 'Reason for refund' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Patient MRN' })
  @IsString()
  @IsOptional()
  mrn?: string;

  @ApiPropertyOptional({ description: 'Patient display name' })
  @IsString()
  @IsOptional()
  patientDisplayName?: string;

  @ApiPropertyOptional({ description: 'Refund allocations to invoices', type: [RefundAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundAllocationDto)
  @IsOptional()
  allocations?: RefundAllocationDto[];
}

export class UpdateRefundDto {
  @ApiPropertyOptional({ description: 'Refund amount in base currency' })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({ description: 'Base currency' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Amount refunded in actual currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  refundedAmount?: number;

  @ApiPropertyOptional({ description: 'Refunded currency code' })
  @IsString()
  @IsOptional()
  refundedCurrency?: string;

  @ApiPropertyOptional({ description: 'FX rate to convert refunded currency to base currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  fxRateToBase?: number;

  @ApiPropertyOptional({ enum: RefundMethod, description: 'Refund method' })
  @IsEnum(RefundMethod)
  @IsOptional()
  refundMethod?: RefundMethod;

  @ApiPropertyOptional({ description: 'Transaction reference' })
  @IsString()
  @IsOptional()
  txnReference?: string;

  @ApiPropertyOptional({ description: 'Reason for refund' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApproveRefundDto {
  @ApiPropertyOptional({ description: 'Approval notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectRefundDto {
  @ApiProperty({ description: 'Reason for rejection' })
  @IsString()
  @IsNotEmpty()
  rejectionReason!: string;
}

export class ProcessRefundDto {
  @ApiPropertyOptional({ description: 'Transaction reference' })
  @IsString()
  @IsOptional()
  txnReference?: string;

  @ApiPropertyOptional({ description: 'Amount refunded in actual currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  refundedAmount?: number;

  @ApiPropertyOptional({ description: 'Refunded currency code' })
  @IsString()
  @IsOptional()
  refundedCurrency?: string;

  @ApiPropertyOptional({ description: 'FX rate to convert refunded currency to base currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  fxRateToBase?: number;

  @ApiPropertyOptional({ description: 'Processing notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class VoidRefundDto {
  @ApiProperty({ description: 'Reason for voiding' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class AllocateRefundDto {
  @ApiProperty({ description: 'Allocations to invoices', type: [RefundAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundAllocationDto)
  @IsNotEmpty()
  allocations!: RefundAllocationDto[];
}

export interface RefundAllocationResponseDto {
  id: string;
  refundId: string;
  invoiceId: string;
  allocatedAmount: number;
  createdAt: Date;
  invoice?: any;
}

export interface RefundResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  receiptId?: string | null;
  mrn?: string | null;
  patientDisplayName?: string | null;
  refundNumber: string;
  refundDate: Date;
  amount: number;
  currency: string;
  refundedAmount?: number | null;
  refundedCurrency?: string | null;
  fxRateToBase?: number | null;
  refundMethod: RefundMethod;
  txnReference?: string | null;
  reason?: string | null;
  notes?: string | null;
  status: RefundStatus;
  requestedBy?: string | null;
  requestedAt: Date;
  approvedBy?: string | null;
  approvedAt?: Date | null;
  processedBy?: string | null;
  processedAt?: Date | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
  allocations?: RefundAllocationResponseDto[];
  receipt?: any;
}

export interface RefundStatisticsDto {
  total: number;
  totalAmount: number;
  byStatus: Record<RefundStatus | string, { count: number; totalAmount: number }>;
  byMethod: Record<RefundMethod | string, { count: number; totalAmount: number }>;
}
