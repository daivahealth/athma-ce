import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsNumber, IsDate, IsArray, ValidateNested, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export class InvoiceLineDto {
  @ApiProperty({ description: 'Charge ID' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  chargeId!: string;

  @ApiProperty({ description: 'Line number' })
  @IsInt()
  @IsNotEmpty()
  lineNumber!: number;

  @ApiPropertyOptional({ description: 'Line description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  unitPrice!: number;

  @ApiProperty({ description: 'Line amount (quantity * unit_price - line_discount)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  lineAmount!: number;

  @ApiPropertyOptional({ description: 'Line discount', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lineDiscount?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Patient ID (from Clinical DB)' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Encounter ID (from Clinical DB)' })
  @IsUUID("loose" as any)
  @IsOptional()
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Patient MRN' })
  @IsString()
  @IsOptional()
  mrn?: string;

  @ApiPropertyOptional({ description: 'Patient display name' })
  @IsString()
  @IsOptional()
  patientDisplayName?: string;

  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber!: string;

  @ApiPropertyOptional({ description: 'Invoice date', default: 'CURRENT_DATE' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  invoiceDate?: Date;

  @ApiPropertyOptional({ description: 'Due date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({ description: 'Gross amount (sum of charges)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  grossAmount!: number;

  @ApiPropertyOptional({ description: 'Total discounts', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalDiscounts?: number;

  @ApiProperty({ description: 'Net amount (gross - discounts)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  netAmount!: number;

  @ApiPropertyOptional({ description: 'Amount paid', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  amountPaid?: number;

  @ApiProperty({ description: 'Balance due (net_amount - amount_paid)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  balanceDue!: number;

  @ApiPropertyOptional({ enum: InvoiceStatus, description: 'Invoice status', default: 'unpaid' })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Invoice lines', type: [InvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  invoiceLines!: InvoiceLineDto[];
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ enum: InvoiceStatus, description: 'New invoice status' })
  @IsEnum(InvoiceStatus)
  @IsNotEmpty()
  status!: InvoiceStatus;
}

export class RecordPaymentDto {
  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({ description: 'Payment reference' })
  @IsString()
  @IsOptional()
  reference?: string;
}

export interface InvoiceLineResponseDto {
  id: string;
  invoiceId: string;
  chargeId: string;
  lineNumber: number;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  lineDiscount: number;
  createdAt: Date;
  updatedAt: Date;
  charge?: any; // Can be populated
}

export interface InvoiceResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string | null;
  mrn?: string | null;
  patientDisplayName?: string | null;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date | null;
  grossAmount: number;
  totalDiscounts: number;
  netAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceLines?: InvoiceLineResponseDto[];
}
