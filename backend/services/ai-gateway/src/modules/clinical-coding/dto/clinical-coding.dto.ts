/**
 * Clinical Coding DTOs
 * Request/response shapes for the AI coding suggestion endpoint.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

// ---------- Request ----------

export class ClinicalCodingSuggestDto {
  @ApiProperty({
    description: 'De-identified clinical text (no PHI/PII)',
    example: 'Patient presents with uncontrolled type 2 diabetes and essential hypertension',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  clinicalText: string;

  @ApiPropertyOptional({
    description: 'Block types that contributed the text',
    example: ['chiefHpi', 'history'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blockTypes?: string[];

  @ApiPropertyOptional({
    description: 'ICD/SNOMED codes already on the encounter (to exclude from suggestions)',
    example: ['E11.9', 'I10'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingCodes?: string[];
}

// ---------- Response ----------

export class ClinicalCodingSuggestion {
  @ApiProperty({ example: 'E11.9' })
  code: string;

  @ApiProperty({ example: 'Type 2 diabetes mellitus without complications' })
  description: string;

  @ApiProperty({ example: 'Type 2 DM' })
  shortDescription: string;

  @ApiProperty({ example: 0.95 })
  confidence: number;

  @ApiProperty({ enum: ['ICD-10', 'SNOMED'], example: 'ICD-10' })
  codeSystem: 'ICD-10' | 'SNOMED';

  @ApiProperty({ example: 'Patient described as having uncontrolled diabetes' })
  rationale: string;

  @ApiProperty({
    description: 'Clinical coding type: what the code represents',
    enum: ['diagnosis', 'history', 'symptom', 'finding', 'procedure', 'medication'],
    example: 'diagnosis',
  })
  codingType: string;

  @ApiProperty({ description: 'Whether the code exists in the DiagnosisMaster catalog' })
  catalogMatch: boolean;

  @ApiPropertyOptional({ description: 'Whether the code is billable (from catalog)' })
  isBillable: boolean | null;
}

export class ClinicalCodingSuggestResponseDto {
  @ApiProperty({ type: [ClinicalCodingSuggestion] })
  suggestions: ClinicalCodingSuggestion[];

  @ApiProperty({ description: 'Whether the response came from cache' })
  fromCache: boolean;

  @ApiProperty({ description: 'Time taken in milliseconds' })
  processingTimeMs: number;
}
