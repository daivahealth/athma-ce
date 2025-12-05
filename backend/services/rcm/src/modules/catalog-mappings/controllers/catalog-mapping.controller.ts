import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CatalogMappingService } from '../services/catalog-mapping.service';
import {
  CreateCatalogMappingDto,
  UpdateCatalogMappingDto,
  QueryCatalogMappingsDto,
  FindBillingItemsDto,
  FindBillingItemsResponse,
  CatalogType,
} from '../dto/catalog-mapping.dto';

// TODO: Replace with actual decorators from your auth module
const TenantId = () => (target: any, propertyKey: string, parameterIndex: number) => {};

@ApiTags('Catalog Mappings')
@Controller('catalog-mappings')
export class CatalogMappingController {
  constructor(private readonly catalogMappingService: CatalogMappingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new catalog-to-billing item mapping' })
  @ApiResponse({ status: 201, description: 'Mapping created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - mapping already exists' })
  @ApiResponse({ status: 404, description: 'Billing item not found' })
  async create(
    @TenantId() tenantId: string,
    @Body() createDto: CreateCatalogMappingDto,
  ) {
    return this.catalogMappingService.create(tenantId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all catalog mappings with optional filtering' })
  @ApiResponse({ status: 200, description: 'List of mappings retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryCatalogMappingsDto,
  ) {
    return this.catalogMappingService.findAll(tenantId, query);
  }

  @Get('find-billing-items')
  @ApiOperation({
    summary: 'Find billing items for a catalog item with context-based filtering',
    description: 'Used when an order is placed to determine which billing items should be charged',
  })
  @ApiQuery({ name: 'catalogType', enum: CatalogType, required: true })
  @ApiQuery({ name: 'catalogItemId', required: true, type: String })
  @ApiQuery({ name: 'facilityId', required: false, type: String })
  @ApiQuery({ name: 'payerId', required: false, type: String })
  @ApiQuery({ name: 'patientType', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Billing items found', type: FindBillingItemsResponse })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  async findBillingItems(
    @TenantId() tenantId: string,
    @Query() query: FindBillingItemsDto,
  ): Promise<FindBillingItemsResponse> {
    return this.catalogMappingService.findBillingItemsForCatalogItem(tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific catalog mapping by ID' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  @ApiResponse({ status: 200, description: 'Mapping retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.catalogMappingService.findOne(tenantId, id);
  }

  @Get(':id/audit')
  @ApiOperation({ summary: 'Get audit trail for a catalog mapping' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async getAuditTrail(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.catalogMappingService.getAuditTrail(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a catalog mapping' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  @ApiResponse({ status: 200, description: 'Mapping updated successfully' })
  @ApiResponse({ status: 404, description: 'Mapping or billing item not found' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateCatalogMappingDto,
  ) {
    return this.catalogMappingService.update(tenantId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate a catalog mapping (soft delete)',
    description: 'Sets isActive to false instead of deleting the record',
  })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  @ApiResponse({ status: 200, description: 'Mapping deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.catalogMappingService.remove(tenantId, id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Permanently delete a catalog mapping',
    description: 'Use with caution - this operation cannot be undone',
  })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  @ApiResponse({ status: 200, description: 'Mapping permanently deleted' })
  @ApiResponse({ status: 404, description: 'Mapping not found' })
  async permanentDelete(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.catalogMappingService.permanentDelete(tenantId, id);
  }
}
