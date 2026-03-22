/**
 * Catalog Population DTOs
 * Request/response shapes for the AI catalog population endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  Length,
  IsBoolean,
} from 'class-validator';

// ---------- Enums ----------

export enum CatalogType {
  VALUE_SETS = 'value-sets',
  DIAGNOSES = 'diagnoses',
  MEDICATIONS = 'medications',
  LAB_TESTS = 'lab-tests',
  IMAGING_STUDIES = 'imaging-studies',
  PROCEDURES = 'procedures',
  ADMINISTRATIVE_SERVICES = 'administrative-services',
  NOTE_TEMPLATES = 'note-templates',
  VITAL_SIGNS_TEMPLATES = 'vital-signs-templates',
  CHECKLISTS = 'checklists',
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum DataSource {
  TEMPLATE = 'template',
  AI_ENRICHED = 'ai-enriched',
  AI_GENERATED = 'ai-generated',
}

// ---------- Request ----------

export class StartCatalogPopulationDto {
  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code',
    example: 'AE',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  countryIso: string;

  @ApiPropertyOptional({
    description: 'Specific catalog types to populate. If omitted, all catalogs are populated.',
    enum: CatalogType,
    isArray: true,
    example: ['medications', 'lab-tests', 'diagnoses'],
  })
  @IsArray()
  @IsEnum(CatalogType, { each: true })
  @IsOptional()
  catalogTypes?: CatalogType[];

  @ApiPropertyOptional({
    description: 'Whether to replace existing catalog data (default: skip if data exists)',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  replaceExisting?: boolean;
}

// ---------- Response ----------

export class CatalogProgressDetail {
  @ApiProperty({ enum: CatalogType })
  catalogType: CatalogType;

  @ApiProperty({ enum: ['pending', 'in_progress', 'completed', 'failed', 'skipped'] })
  status: string;

  @ApiProperty({ enum: DataSource })
  dataSource: DataSource;

  @ApiProperty({ description: 'Number of items inserted' })
  itemsInserted: number;

  @ApiPropertyOptional({ description: 'Error message if failed' })
  errorMessage?: string;
}

export class CatalogPopulationStatusDto {
  @ApiProperty({ description: 'Job ID' })
  jobId: string;

  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

  @ApiProperty({ description: 'ISO country code' })
  countryIso: string;

  @ApiProperty({ description: 'Number of catalog types completed' })
  completed: number;

  @ApiProperty({ description: 'Total number of catalog types to process' })
  total: number;

  @ApiPropertyOptional({ description: 'Currently processing catalog type' })
  currentCatalog?: string;

  @ApiProperty({ description: 'Total items inserted across all catalogs' })
  totalInserted: number;

  @ApiProperty({ type: [CatalogProgressDetail] })
  details: CatalogProgressDetail[];

  @ApiPropertyOptional({ description: 'Error message if job failed' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Job start time' })
  startedAt?: string;

  @ApiPropertyOptional({ description: 'Job completion time' })
  completedAt?: string;
}

export class StartCatalogPopulationResponseDto {
  @ApiProperty({ description: 'Job ID for tracking progress' })
  jobId: string;

  @ApiProperty({ description: 'Estimated number of catalogs to process' })
  totalCatalogs: number;

  @ApiProperty({ description: 'Message about the job' })
  message: string;
}

export class CountryInfoDto {
  @ApiProperty({ example: 'AE' })
  countryIso: string;

  @ApiProperty({ example: 'United Arab Emirates' })
  countryName: string;

  @ApiProperty({ description: 'Whether curated templates exist for this country' })
  hasTemplates: boolean;

  @ApiProperty({
    description: 'Catalog types with curated template data',
    enum: CatalogType,
    isArray: true,
  })
  templateCatalogs: CatalogType[];

  @ApiProperty({
    description: 'Catalog types that will be AI-generated',
    enum: CatalogType,
    isArray: true,
  })
  aiGeneratedCatalogs: CatalogType[];
}

export class CatalogPopulationHistoryItemDto {
  @ApiProperty()
  jobId: string;

  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

  @ApiProperty()
  countryIso: string;

  @ApiProperty()
  totalInserted: number;

  @ApiProperty({ type: [String] })
  catalogTypes: string[];

  @ApiPropertyOptional()
  startedAt?: string;

  @ApiPropertyOptional()
  completedAt?: string;
}
