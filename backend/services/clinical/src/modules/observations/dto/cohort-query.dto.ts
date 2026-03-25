import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  ArrayMaxSize,
  Matches,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CodingCriterionDto {
  @ApiProperty({ description: 'ICD-10 or SNOMED code (supports % wildcard)', example: 'E11%' })
  @IsString()
  @Matches(/^[A-Za-z0-9.\-%]+$/, { message: 'code must contain only alphanumeric, dot, dash, or % characters' })
  code!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: ['ICD-10', 'SNOMED-CT'], default: 'ICD-10' })
  @IsOptional()
  @IsString()
  codeSystem?: string;

  @ApiPropertyOptional({ description: 'Coding type filter', enum: ['diagnosis', 'history', 'symptom', 'finding', 'procedure', 'medication'] })
  @IsOptional()
  @IsString()
  codingType?: string;

  @ApiPropertyOptional({ description: 'Status filter', default: 'accepted' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class ObservationCriterionDto {
  @ApiProperty({ description: 'LOINC code', example: '8480-6' })
  @IsString()
  @Matches(/^[A-Za-z0-9.\-]+$/, { message: 'code must contain only alphanumeric, dot, or dash characters' })
  code!: string;

  @ApiProperty({ description: 'Comparison operator', enum: ['gt', 'gte', 'lt', 'lte', 'eq', 'between'] })
  @IsIn(['gt', 'gte', 'lt', 'lte', 'eq', 'between'])
  operator!: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'between';

  @ApiProperty({ description: 'Comparison value', example: 120 })
  @IsNumber()
  value!: number;

  @ApiPropertyOptional({ description: 'Upper bound for "between" operator' })
  @IsOptional()
  @IsNumber()
  valueTo?: number;

  @ApiPropertyOptional({ description: 'Only consider latest observation per patient', default: true })
  @IsOptional()
  @IsBoolean()
  latest?: boolean;

  @ApiPropertyOptional({ description: 'Observation date range start (ISO)' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Observation date range end (ISO)' })
  @IsOptional()
  @IsString()
  toDate?: string;
}

export class CohortQueryDto {
  @ApiPropertyOptional({ description: 'Coding criteria (encounter_clinical_codings)', type: [CodingCriterionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => CodingCriterionDto)
  codings?: CodingCriterionDto[];

  @ApiPropertyOptional({ description: 'Observation criteria (clinical_observations)', type: [ObservationCriterionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ObservationCriterionDto)
  observations?: ObservationCriterionDto[];

  @ApiPropertyOptional({ description: 'Combine criteria with AND (true) or OR (false)', default: true })
  @IsOptional()
  @IsBoolean()
  matchAll?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @ApiPropertyOptional({ description: 'Attach latest observation values per matched patient', default: false })
  @IsOptional()
  @IsBoolean()
  includeLatestObservations?: boolean;

  @ApiPropertyOptional({ description: 'Attach matched codings per patient', default: false })
  @IsOptional()
  @IsBoolean()
  includeCodingSummary?: boolean;
}
