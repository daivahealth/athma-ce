import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsUUID,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DocumentTypeEnum {
  ENCOUNTER_NOTE = 'encounter_note',
  DISCHARGE_SUMMARY = 'discharge_summary',
  CLINICAL_NOTE = 'clinical_note',
  PROGRESS_NOTE = 'progress_note',
  CONSULTATION_NOTE = 'consultation_note',
  PROCEDURE_NOTE = 'procedure_note',
  OPERATIVE_NOTE = 'operative_note',
}

export class SearchRequestDto {
  @ApiProperty({
    description: 'Natural language search query',
    example: 'Patient with diabetes and hypertension',
  })
  @IsString()
  @MaxLength(500)
  query: string;

  @ApiPropertyOptional({
    description: 'Filter by patient ID',
  })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Filter by encounter ID',
  })
  @IsOptional()
  @IsUUID()
  encounterId?: string;

  @ApiPropertyOptional({
    description: 'Filter by facility ID',
  })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({
    description: 'Filter by department ID',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by specialty code',
  })
  @IsOptional()
  @IsString()
  specialtyCode?: string;

  @ApiPropertyOptional({
    description: 'Filter by document types',
    enum: DocumentTypeEnum,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DocumentTypeEnum, { each: true })
  documentTypes?: DocumentTypeEnum[];

  @ApiPropertyOptional({
    description: 'Filter by documents from this date',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by documents until this date',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Minimum similarity score (0-1)',
    default: 0.7,
    minimum: 0.5,
    maximum: 1.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(1.0)
  @Type(() => Number)
  minSimilarity?: number;
}

export class SimilarDocumentsRequestDto {
  @ApiProperty({
    description: 'Document ID to find similar documents for',
  })
  @IsUUID()
  documentId: string;

  @ApiProperty({
    description: 'Type of the document',
    enum: DocumentTypeEnum,
  })
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum;

  @ApiPropertyOptional({
    description: 'Maximum number of similar documents to return',
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Minimum similarity score (0-1)',
    default: 0.8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(1.0)
  @Type(() => Number)
  minSimilarity?: number;
}

export class QueueEmbeddingDto {
  @ApiProperty({
    description: 'Document ID to embed',
  })
  @IsUUID()
  documentId: string;

  @ApiProperty({
    description: 'Type of the document',
    enum: DocumentTypeEnum,
  })
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum;
}

export class ReindexRequestDto {
  @ApiPropertyOptional({
    description: 'Document types to reindex (all if not specified)',
    enum: DocumentTypeEnum,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DocumentTypeEnum, { each: true })
  documentTypes?: DocumentTypeEnum[];

  @ApiPropertyOptional({
    description: 'Only reindex documents from this date',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;
}

export class SearchResultDto {
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @ApiProperty({ description: 'Document type', enum: DocumentTypeEnum })
  documentType: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiPropertyOptional({ description: 'Encounter ID' })
  encounterId?: string;

  @ApiProperty({ description: 'Facility ID' })
  facilityId: string;

  @ApiProperty({ description: 'Matching text chunk' })
  chunkText: string;

  @ApiProperty({ description: 'Text with highlighted matches' })
  highlightedText: string;

  @ApiProperty({ description: 'Similarity score (0-1)' })
  similarity: number;

  @ApiProperty({ description: 'Document date' })
  documentDate: Date;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'Search results', type: [SearchResultDto] })
  results: SearchResultDto[];

  @ApiProperty({ description: 'Total number of matching documents' })
  totalCount: number;

  @ApiProperty({ description: 'Time to generate query embedding in ms' })
  queryEmbeddingTime: number;

  @ApiProperty({ description: 'Time to search in ms' })
  searchTime: number;

  @ApiProperty({ description: 'Original query' })
  query: string;
}

export class EmbeddingStatsDto {
  @ApiProperty({ description: 'Total embedded documents' })
  totalDocuments: number;

  @ApiProperty({ description: 'Total embedded chunks' })
  totalChunks: number;

  @ApiProperty({ description: 'Pending embedding jobs' })
  pendingJobs: number;

  @ApiProperty({ description: 'Failed embedding jobs' })
  failedJobs: number;

  @ApiProperty({ description: 'Embedding model used' })
  embeddingModel: string;

  @ApiProperty({ description: 'Last sync timestamp' })
  lastSyncAt?: Date;
}
