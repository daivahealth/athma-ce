import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLabReportDto {
  @ApiProperty({ description: 'Clinical order ID' })
  @IsUUID("loose" as any)
  orderId!: string;

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Specimen collection date' })
  @IsOptional()
  @IsDateString()
  collectionDate?: string;

  @ApiPropertyOptional({ description: 'Specimen received date' })
  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  @ApiPropertyOptional({ description: 'Comments' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Internal notes (not visible to ordering clinician)' })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}

export class UpdateLabReportDto {
  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Specimen collection date' })
  @IsOptional()
  @IsDateString()
  collectionDate?: string;

  @ApiPropertyOptional({ description: 'Specimen received date' })
  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  @ApiPropertyOptional({ description: 'Comments' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Internal notes' })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}

export class LabResultItemDto {
  @ApiPropertyOptional({ description: 'Existing item ID (for updates)' })
  @IsOptional()
  @IsUUID("loose" as any)
  id?: string;

  @ApiProperty({ description: 'Test code (LOINC)' })
  @IsString()
  testCode!: string;

  @ApiPropertyOptional({ description: 'Code system', default: 'LOINC' })
  @IsOptional()
  @IsString()
  codeSystem?: string;

  @ApiProperty({ description: 'Test name in English' })
  @IsString()
  testName!: string;

  @ApiPropertyOptional({ description: 'Test name in Arabic' })
  @IsOptional()
  @IsString()
  testNameAr?: string;

  @ApiPropertyOptional({ description: 'Numeric result value' })
  @IsOptional()
  @IsNumber()
  valueNumeric?: number;

  @ApiPropertyOptional({ description: 'String result value' })
  @IsOptional()
  @IsString()
  valueString?: string;

  @ApiPropertyOptional({ description: 'Coded result value' })
  @IsOptional()
  @IsString()
  valueCode?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Reference range low' })
  @IsOptional()
  @IsNumber()
  refRangeLow?: number;

  @ApiPropertyOptional({ description: 'Reference range high' })
  @IsOptional()
  @IsNumber()
  refRangeHigh?: number;

  @ApiPropertyOptional({ description: 'Reference range text (e.g., "Negative", "< 5.0")' })
  @IsOptional()
  @IsString()
  refRangeText?: string;

  @ApiPropertyOptional({ description: 'Interpretation (normal, high, low, critical_high, critical_low, abnormal)' })
  @IsOptional()
  @IsString()
  interpretation?: string;

  @ApiPropertyOptional({ description: 'Abnormal flag' })
  @IsOptional()
  @IsBoolean()
  abnormalFlag?: boolean;

  @ApiPropertyOptional({ description: 'Critical flag' })
  @IsOptional()
  @IsBoolean()
  criticalFlag?: boolean;

  @ApiPropertyOptional({ description: 'Comment for this result item' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Sort order for display' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class SaveLabResultItemsDto {
  @ApiProperty({ description: 'Lab result items', type: [LabResultItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabResultItemDto)
  items!: LabResultItemDto[];
}
