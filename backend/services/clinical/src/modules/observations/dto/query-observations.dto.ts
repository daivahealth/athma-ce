import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryObservationsDto {
  @ApiPropertyOptional({ description: 'Single LOINC code', example: '8480-6' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Comma-separated LOINC codes', example: '8480-6,8462-4' })
  @IsOptional()
  @IsString()
  codes?: string;

  @ApiPropertyOptional({ description: 'Observation category', enum: ['vital-signs', 'laboratory', 'imaging', 'exam', 'score'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO)', example: '2025-01-01' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO)', example: '2025-12-31' })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Interpretation filter', enum: ['normal', 'high', 'low', 'critical_high', 'critical_low', 'abnormal'] })
  @IsOptional()
  @IsString()
  interpretation?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 50, maximum: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

export class TrendsQueryDto {
  @ApiPropertyOptional({ description: 'LOINC code', example: '8480-6' })
  @IsString()
  code!: string;

  @ApiPropertyOptional({ description: 'Time bucket', enum: ['day', 'week', 'month'], example: 'month' })
  @IsOptional()
  @IsString()
  bucket?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO)' })
  @IsString()
  fromDate!: string;

  @ApiPropertyOptional({ description: 'End date (ISO)' })
  @IsString()
  toDate!: string;
}
