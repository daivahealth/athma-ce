import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePathologyReportDto {
  @ApiProperty({ description: 'Clinical order ID' })
  @IsUUID('4')
  orderId!: string;

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Collection timestamp' })
  @IsOptional()
  @IsDateString()
  collectionDate?: string;

  @ApiPropertyOptional({ description: 'Receipt/accession timestamp' })
  @IsOptional()
  @IsDateString()
  receivedDate?: string;
}

export class UpdatePathologyReportDto extends PartialType(CreatePathologyReportDto) {
  @ApiPropertyOptional({ description: 'Clinical history / relevant notes' })
  @IsOptional()
  @IsString()
  clinicalHistory?: string;

  @ApiPropertyOptional({ description: 'Specimen received narrative' })
  @IsOptional()
  @IsString()
  specimenReceived?: string;

  @ApiPropertyOptional({ description: 'Gross description' })
  @IsOptional()
  @IsString()
  grossDescription?: string;

  @ApiPropertyOptional({ description: 'Microscopic description' })
  @IsOptional()
  @IsString()
  microscopicDescription?: string;

  @ApiPropertyOptional({ description: 'Final diagnosis / impression' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'External/shared comment' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Internal lab/pathologist notes' })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}
