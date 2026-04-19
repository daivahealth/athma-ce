import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export enum CreditNoteStatus {
  DRAFT = 'draft',
  POSTED = 'posted',
  VOIDED = 'voided',
}

export class CreditNoteLineDto {
  @ApiProperty({ description: 'Line number' })
  @IsNumber()
  @Type(() => Number)
  lineNumber!: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Quantity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Unit price' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  unitPrice?: number;

  @ApiProperty({ description: 'Line amount' })
  @IsNumber()
  @Type(() => Number)
  lineAmount!: number;
}

export class CreateCreditNoteDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({ description: 'Invoice ID' })
  @IsUUID("all")
  @IsOptional()
  invoiceId?: string;

  @ApiPropertyOptional({ description: 'Credit note date', default: 'today' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  creditNoteDate?: Date;

  @ApiProperty({ description: 'Amount' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'AED' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Reason' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Lines', type: [CreditNoteLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteLineDto)
  @IsOptional()
  lines?: CreditNoteLineDto[];
}

export class UpdateCreditNoteDto extends PartialType(CreateCreditNoteDto) {}

export class VoidCreditNoteDto {
  @ApiProperty({ description: 'Reason for void' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
