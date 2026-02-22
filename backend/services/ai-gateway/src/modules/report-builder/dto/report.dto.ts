import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export enum ExportFormat {
  JSON = 'json',
  EXCEL = 'excel',
  CSV = 'csv',
  PDF = 'pdf',
}

export class GenerateReportDto {
  @ApiProperty({
    description: 'Natural language query describing the report',
    example: 'What is the total revenue by department for this month?',
  })
  @IsString()
  @MaxLength(1000)
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of rows to return',
    default: 1000,
    minimum: 1,
    maximum: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of rows to skip',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Export format for the report',
    enum: ExportFormat,
    default: ExportFormat.JSON,
  })
  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat;

  @ApiPropertyOptional({
    description: 'Include debug information (SQL query)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  debug?: boolean;

  @ApiPropertyOptional({
    description: 'Currency code for formatting monetary values (e.g., INR, AED, USD)',
    example: 'INR',
    default: 'INR',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Locale for date/number formatting',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  locale?: 'en' | 'ar';
}

export class ValidateQueryDto {
  @ApiProperty({
    description: 'Natural language query to validate',
    example: 'Show me all patients with diabetes',
  })
  @IsString()
  @MaxLength(1000)
  query: string;
}

export class QueryPlanResponseDto {
  @ApiProperty({ description: 'Whether the query is valid' })
  isValid: boolean;

  @ApiProperty({ description: 'Confidence score (0-1)' })
  confidence: number;

  @ApiPropertyOptional({ description: 'Generated query plan' })
  plan?: any;

  @ApiPropertyOptional({ description: 'Validation errors' })
  errors?: string[];

  @ApiPropertyOptional({ description: 'Suggested follow-up queries' })
  suggestions?: string[];
}

export class ReportResultDto {
  @ApiProperty({ description: 'Column definitions' })
  columns: {
    name: string;
    displayName: string;
    displayNameAr?: string;
    dataType: string;
    format?: string;
  }[];

  @ApiProperty({ description: 'Report data rows' })
  rows: Record<string, any>[];

  @ApiProperty({ description: 'Total row count' })
  totalCount: number;

  @ApiProperty({ description: 'Query execution time in ms' })
  executionTimeMs: number;

  @ApiPropertyOptional({ description: 'Generated SQL (debug mode only)' })
  sql?: string;
}

export class CatalogSummaryDto {
  @ApiProperty({ description: 'Available metric categories' })
  metricCategories: {
    name: string;
    displayName: string;
    metrics: { name: string; displayName: string; description: string }[];
  }[];

  @ApiProperty({ description: 'Available dimension categories' })
  dimensionCategories: {
    name: string;
    displayName: string;
    dimensions: { name: string; displayName: string; description: string }[];
  }[];

  @ApiProperty({ description: 'Available join paths' })
  availableJoins: string[];
}
