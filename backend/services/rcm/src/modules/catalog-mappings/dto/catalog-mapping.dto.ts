import {
  IsString,
  IsUUID,
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * Catalog types that can be mapped to billing items
 */
export enum CatalogType {
  MEDICATION = 'medication',
  LAB_TEST = 'lab_test',
  IMAGING_STUDY = 'imaging_study',
  PROCEDURE = 'procedure',
  PACKAGE = 'package',
  ADMINISTRATIVE_SERVICE = 'administrative_service',
}

/**
 * Create a new catalog item mapping
 */
export class CreateCatalogMappingDto {
  @ApiProperty({
    description: 'Type of clinical catalog item',
    enum: CatalogType,
    example: 'lab_test',
  })
  @IsEnum(CatalogType)
  catalogType!: CatalogType;

  @ApiProperty({
    description: 'UUID of the catalog item in Clinical DB',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  catalogItemId!: string;

  @ApiProperty({
    description: 'UUID of the billing item in RCM DB',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  billingItemId!: string;

  @ApiPropertyOptional({
    description: 'Quantity of billing item per catalog item',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Automatically create charge when catalog item is ordered',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAutomatic?: boolean;

  @ApiPropertyOptional({
    description: 'Mark this as the primary billing item for this catalog item',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Require approval before creating charge',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Facility IDs where this mapping applies (empty = all facilities)',
    type: [String],
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  facilityIds?: string[];

  @ApiPropertyOptional({
    description: 'Payer IDs where this mapping applies (empty = all payers)',
    type: [String],
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  payerIds?: string[];

  @ApiPropertyOptional({
    description: 'Patient types where this mapping applies (empty = all types)',
    type: [String],
    example: ['cash', 'insurance'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  patientTypes?: string[];

  @ApiPropertyOptional({
    description: 'Reason for this mapping',
    example: 'Standard DHA billing code for CBC test',
  })
  @IsOptional()
  @IsString()
  mappingReason?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Includes facility fee',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date when mapping becomes active',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({
    description: 'Date when mapping expires',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({
    description: 'Active status of the mapping',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * Update an existing catalog item mapping
 */
export class UpdateCatalogMappingDto extends PartialType(
  CreateCatalogMappingDto,
) {}

/**
 * Query parameters for finding catalog mappings
 */
export class QueryCatalogMappingsDto {
  @ApiPropertyOptional({
    description: 'Filter by catalog type',
    enum: CatalogType,
  })
  @IsOptional()
  @IsEnum(CatalogType)
  catalogType?: CatalogType;

  @ApiPropertyOptional({
    description: 'Filter by catalog item ID',
  })
  @IsOptional()
  @IsUUID()
  catalogItemId?: string;

  @ApiPropertyOptional({
    description: 'Filter by billing item ID',
  })
  @IsOptional()
  @IsUUID()
  billingItemId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by primary status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by facility ID',
  })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({
    description: 'Filter by payer ID',
  })
  @IsOptional()
  @IsUUID()
  payerId?: string;

  @ApiPropertyOptional({
    description: 'Filter by patient type',
  })
  @IsOptional()
  @IsString()
  patientType?: string;
}

/**
 * Find billing items for a catalog item with context
 */
export class FindBillingItemsDto {
  @ApiProperty({
    description: 'Type of clinical catalog item',
    enum: CatalogType,
  })
  @IsEnum(CatalogType)
  catalogType!: CatalogType;

  @ApiProperty({
    description: 'UUID of the catalog item',
  })
  @IsUUID()
  catalogItemId!: string;

  @ApiPropertyOptional({
    description: 'Facility ID for context-based filtering',
  })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({
    description: 'Payer ID for context-based filtering',
  })
  @IsOptional()
  @IsUUID()
  payerId?: string;

  @ApiPropertyOptional({
    description: 'Patient type for context-based filtering',
  })
  @IsOptional()
  @IsString()
  patientType?: string;
}

/**
 * Response DTO for billing item mappings with details
 */
export class BillingItemMappingResponse {
  @ApiProperty()
  billingItemId!: string;

  @ApiProperty()
  billingCode!: string;

  @ApiProperty()
  billingDescription!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiProperty()
  isAutomatic!: boolean;

  @ApiProperty()
  requiresApproval!: boolean;
}

/**
 * Response for find billing items endpoint
 */
export class FindBillingItemsResponse {
  @ApiProperty()
  catalogType!: string;

  @ApiProperty()
  catalogItemId!: string;

  @ApiProperty({ type: [BillingItemMappingResponse] })
  mappings!: BillingItemMappingResponse[];
}
