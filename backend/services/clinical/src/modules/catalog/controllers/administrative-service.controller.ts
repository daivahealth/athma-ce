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
  UseGuards,
} from '@nestjs/common';
import { AdministrativeServiceService } from '../services/administrative-service.service';
import { CreateAdministrativeServiceDto, UpdateAdministrativeServiceDto, QueryAdministrativeServicesDto } from '../dto/administrative-service.dto';
import { TenantId } from '../../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CATALOG_READ,
  CATALOG_CREATE,
  CATALOG_UPDATE,
  CATALOG_DELETE,
} from '@zeal/contracts';

@Controller('catalogs/administrative-services')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdministrativeServiceController {
  constructor(private readonly administrativeServiceService: AdministrativeServiceService) {}

  /**
   * GET /api/v1/catalogs/services
   * Get all services with optional filtering
   */
  @Get()
  @Permissions(CATALOG_READ)
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryAdministrativeServicesDto,
  ) {
    return this.administrativeServiceService.findAll(tenantId, query);
  }

  /**
   * GET /api/v1/catalogs/services/categories
   * Get available service categories
   */
  @Get('categories')
  @Permissions(CATALOG_READ)
  async getServiceCategories() {
    return this.administrativeServiceService.getServiceCategories();
  }

  /**
   * GET /api/v1/catalogs/services/types
   * Get available service types
   */
  @Get('types')
  @Permissions(CATALOG_READ)
  async getServiceTypes() {
    return this.administrativeServiceService.getServiceTypes();
  }

  /**
   * GET /api/v1/catalogs/services/:id
   * Get a specific service by ID
   */
  @Get(':id')
  @Permissions(CATALOG_READ)
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.administrativeServiceService.findOne(tenantId, id);
  }

  /**
   * GET /api/v1/catalogs/services/by-code/:code
   * Get a specific service by code
   */
  @Get('by-code/:code')
  @Permissions(CATALOG_READ)
  async findByCode(
    @TenantId() tenantId: string,
    @Param('code') code: string,
  ) {
    return this.administrativeServiceService.findByCode(tenantId, code);
  }

  /**
   * POST /api/v1/catalogs/services
   * Create a new service
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CATALOG_CREATE)
  async create(
    @TenantId() tenantId: string,
    @Body() createServiceDto: CreateAdministrativeServiceDto,
  ) {
    return this.administrativeServiceService.create(tenantId, createServiceDto);
  }

  /**
   * PUT /api/v1/catalogs/services/:id
   * Update a service
   */
  @Put(':id')
  @Permissions(CATALOG_UPDATE)
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateAdministrativeServiceDto,
  ) {
    return this.administrativeServiceService.update(tenantId, id, updateServiceDto);
  }

  /**
   * DELETE /api/v1/catalogs/services/:id
   * Delete a service
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(CATALOG_DELETE)
  async remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.administrativeServiceService.remove(tenantId, id);
  }
}
