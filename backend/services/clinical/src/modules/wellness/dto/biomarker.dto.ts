import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BiomarkerAlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum BiomarkerAlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export class CreateBiomarkerDefinitionDto {
  @ApiProperty({ description: 'Biomarker code' })
  @IsString()
  code!: string;

  @ApiProperty({ description: 'Biomarker name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category (hormonal, metabolic, inflammatory, etc.)' })
  @IsString()
  category!: string;

  @ApiPropertyOptional({ description: 'Subcategory' })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({ description: 'Unit of measurement' })
  @IsString()
  unit!: string;

  @ApiPropertyOptional({ description: 'Decimal precision' })
  @IsOptional()
  @IsInt()
  precision?: number;

  @ApiProperty({ description: 'Reference ranges by age/gender' })
  @IsArray()
  referenceRanges!: Array<{
    ageMin?: number;
    ageMax?: number;
    gender?: string;
    min: number;
    max: number;
    optimalMin?: number;
    optimalMax?: number;
  }>;

  @ApiPropertyOptional({ description: 'Optimal longevity ranges' })
  @IsOptional()
  @IsObject()
  optimalRanges?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Critical low threshold' })
  @IsOptional()
  @IsNumber()
  criticalLow?: number;

  @ApiPropertyOptional({ description: 'Critical high threshold' })
  @IsOptional()
  @IsNumber()
  criticalHigh?: number;

  @ApiPropertyOptional({ description: 'Lab test catalog ID' })
  @IsOptional()
  @IsUUID()
  labTestCatalogId?: string;
}

export class UpdateBiomarkerDefinitionDto {
  @ApiPropertyOptional({ description: 'Biomarker name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Reference ranges' })
  @IsOptional()
  @IsArray()
  referenceRanges?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Optimal ranges' })
  @IsOptional()
  @IsObject()
  optimalRanges?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Critical low threshold' })
  @IsOptional()
  @IsNumber()
  criticalLow?: number;

  @ApiPropertyOptional({ description: 'Critical high threshold' })
  @IsOptional()
  @IsNumber()
  criticalHigh?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateBiomarkerResultDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ description: 'Biomarker ID' })
  @IsUUID()
  biomarkerId!: string;

  @ApiProperty({ description: 'Result value' })
  @IsNumber()
  value!: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @IsString()
  unit!: string;

  @ApiProperty({ description: 'Source (lab_result, manual_entry, device)' })
  @IsString()
  source!: string;

  @ApiPropertyOptional({ description: 'Source ID (e.g., lab order result ID)' })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiProperty({ description: 'Collection timestamp' })
  @IsDateString()
  collectedAt!: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BiomarkerDefinitionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional()
  tenantId?: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  category!: string;

  @ApiPropertyOptional()
  subcategory?: string;

  @ApiProperty()
  unit!: string;

  @ApiProperty()
  precision!: number;

  @ApiProperty()
  referenceRanges!: Array<Record<string, any>>;

  @ApiPropertyOptional()
  optimalRanges?: Record<string, any>;

  @ApiPropertyOptional()
  criticalLow?: number;

  @ApiPropertyOptional()
  criticalHigh?: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class BiomarkerResultResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  biomarkerId!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  unit!: string;

  @ApiPropertyOptional()
  referenceMin?: number;

  @ApiPropertyOptional()
  referenceMax?: number;

  @ApiPropertyOptional()
  optimalMin?: number;

  @ApiPropertyOptional()
  optimalMax?: number;

  @ApiPropertyOptional()
  interpretation?: string;

  @ApiPropertyOptional()
  percentile?: number;

  @ApiProperty()
  source!: string;

  @ApiPropertyOptional()
  sourceId?: string;

  @ApiProperty()
  collectedAt!: Date;

  @ApiPropertyOptional()
  previousValue?: number;

  @ApiPropertyOptional()
  changePercent?: number;

  @ApiPropertyOptional()
  trendDirection?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;
}

export class BiomarkerAlertResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  biomarkerId!: string;

  @ApiPropertyOptional()
  resultId?: string;

  @ApiProperty({ enum: BiomarkerAlertSeverity })
  severity!: BiomarkerAlertSeverity;

  @ApiProperty()
  alertType!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  triggeredValue!: number;

  @ApiPropertyOptional()
  thresholdValue?: number;

  @ApiProperty({ enum: BiomarkerAlertStatus })
  status!: BiomarkerAlertStatus;

  @ApiPropertyOptional()
  acknowledgedAt?: Date;

  @ApiPropertyOptional()
  resolvedAt?: Date;

  @ApiPropertyOptional()
  resolutionNotes?: string;

  @ApiProperty()
  createdAt!: Date;
}

export class AcknowledgeAlertDto {
  @ApiPropertyOptional({ description: 'Acknowledgment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ResolveAlertDto {
  @ApiProperty({ description: 'Resolution notes' })
  @IsString()
  resolutionNotes!: string;
}

export class BiomarkerTrendQueryDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ description: 'Biomarker ID' })
  @IsUUID()
  biomarkerId!: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Number of results to return' })
  @IsOptional()
  @IsInt()
  limit?: number;
}
