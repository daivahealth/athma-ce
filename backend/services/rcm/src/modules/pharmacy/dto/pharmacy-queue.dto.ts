import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PharmacyQueueFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by encounter type (outpatient | inpatient)' })
  @IsString()
  @IsOptional()
  encounterType?: string;

  @ApiPropertyOptional({ description: 'Filter by ward UUID (inpatient only)' })
  @IsUUID()
  @IsOptional()
  wardId?: string;

  @ApiPropertyOptional({ description: 'Filter by facility UUID' })
  @IsUUID()
  @IsOptional()
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Search by patient name or MRN' })
  @IsString()
  @IsOptional()
  search?: string;
}
