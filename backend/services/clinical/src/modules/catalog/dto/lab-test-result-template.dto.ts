import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LabTestResultTemplateItemDto {
  @ApiProperty({ description: 'Stable client-side key for this template row' })
  @IsString()
  templateKey!: string;

  @ApiPropertyOptional({ description: 'Stable client-side key for the parent group row' })
  @IsOptional()
  @IsString()
  parentTemplateKey?: string;

  @ApiPropertyOptional({ description: 'Node type for template row', default: 'analyte' })
  @IsOptional()
  @IsIn(['group', 'analyte'])
  nodeType?: 'group' | 'analyte';

  @ApiPropertyOptional({ description: 'Observation catalog row ID for analyte nodes' })
  @IsOptional()
  @IsUUID('4')
  observationCodeCatalogId?: string;

  @ApiPropertyOptional({ description: 'Optional display label override shown in result entry' })
  @IsOptional()
  @IsString()
  displayLabel?: string;

  @ApiPropertyOptional({ description: 'Optional logical group key for report rendering' })
  @IsOptional()
  @IsString()
  groupKey?: string;

  @ApiPropertyOptional({ description: 'Suggested rendering style for group rows' })
  @IsOptional()
  @IsString()
  renderStyle?: string;

  @ApiPropertyOptional({ description: 'Sort order within the panel', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Whether the analyte is expected for manual entry', default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Whether the mapping is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReplaceLabTestResultTemplatesDto {
  @ApiProperty({ description: 'Mapped analytes for the lab test', type: [LabTestResultTemplateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabTestResultTemplateItemDto)
  items!: LabTestResultTemplateItemDto[];
}
