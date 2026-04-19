import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsNumber, IsDate, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  UPI = 'upi',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

export class ReceiptAllocationDto {
  @ApiProperty({ description: 'Invoice ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  invoiceId!: string;

  @ApiProperty({ description: 'Amount to allocate to this invoice' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  allocatedAmount!: number;
}

export class CreateReceiptDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Invoice ID (null for advance payment)' })
  @IsUUID("loose" as any)
  @IsOptional()
  invoiceId?: string;

  @ApiPropertyOptional({ description: 'Patient MRN' })
  @IsString()
  @IsOptional()
  mrn?: string;

  @ApiPropertyOptional({ description: 'Patient display name' })
  @IsString()
  @IsOptional()
  patientDisplayName?: string;

  @ApiProperty({ description: 'Receipt number' })
  @IsString()
  @IsNotEmpty()
  receiptNumber!: string;

  @ApiPropertyOptional({ description: 'Receipt date', default: 'now()' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  receiptDate?: Date;

  @ApiProperty({ description: 'Amount received' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Amount received in paid currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  paidAmount?: number;

  @ApiPropertyOptional({ description: 'Paid currency code (e.g., INR, AED)' })
  @IsString()
  @IsOptional()
  paidCurrency?: string;

  @ApiPropertyOptional({ description: 'FX rate to convert paid currency to base currency' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  fxRateToBase?: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({ description: 'Transaction reference' })
  @IsString()
  @IsOptional()
  txnReference?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Receipt allocations to invoices', type: [ReceiptAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptAllocationDto)
  @IsOptional()
  allocations?: ReceiptAllocationDto[];
}

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {}

export class AllocateReceiptDto {
  @ApiProperty({ description: 'Allocations to invoices', type: [ReceiptAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptAllocationDto)
  @IsNotEmpty()
  allocations!: ReceiptAllocationDto[];
}

export interface ReceiptAllocationResponseDto {
  id: string;
  receiptId: string;
  invoiceId: string;
  allocatedAmount: number;
  createdAt: Date;
  invoice?: any;
}

export interface ReceiptResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  invoiceId?: string | null;
  mrn?: string | null;
  patientDisplayName?: string | null;
  receiptNumber: string;
  receiptDate: Date;
  amount: number;
  currency: string;
  paidAmount?: number | null;
  paidCurrency?: string | null;
  fxRateToBase?: number | null;
  paymentMethod: PaymentMethod;
  txnReference?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  allocations?: ReceiptAllocationResponseDto[];
}
