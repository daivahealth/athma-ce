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
import { PackageService } from '../services/package.service';
import { CreatePackageDto, UpdatePackageDto, QueryPackagesDto } from '../dto/package.dto';
import { TenantId } from '../../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CATALOG_READ,
  CATALOG_CREATE,
  CATALOG_UPDATE,
  CATALOG_DELETE,
} from '@zeal/contracts';

@Controller('catalogs/packages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  /**
   * GET /api/v1/catalogs/packages
   * Get all packages with optional filtering
   */
  @Get()
  @Permissions(CATALOG_READ)
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryPackagesDto,
  ) {
    return this.packageService.findAll(tenantId, query);
  }

  /**
   * GET /api/v1/catalogs/packages/types
   * Get available package types
   */
  @Get('types')
  @Permissions(CATALOG_READ)
  async getPackageTypes() {
    return this.packageService.getPackageTypes();
  }

  /**
   * GET /api/v1/catalogs/packages/catalog-types
   * Get available catalog types for package items
   */
  @Get('catalog-types')
  @Permissions(CATALOG_READ)
  async getCatalogTypes() {
    return this.packageService.getCatalogTypes();
  }

  /**
   * GET /api/v1/catalogs/packages/:id
   * Get a specific package by ID
   */
  @Get(':id')
  @Permissions(CATALOG_READ)
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.packageService.findOne(tenantId, id);
  }

  /**
   * GET /api/v1/catalogs/packages/by-code/:code
   * Get a specific package by code
   */
  @Get('by-code/:code')
  @Permissions(CATALOG_READ)
  async findByCode(
    @TenantId() tenantId: string,
    @Param('code') code: string,
  ) {
    return this.packageService.findByCode(tenantId, code);
  }

  /**
   * POST /api/v1/catalogs/packages
   * Create a new package
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CATALOG_CREATE)
  async create(
    @TenantId() tenantId: string,
    @Body() createPackageDto: CreatePackageDto,
  ) {
    return this.packageService.create(tenantId, createPackageDto);
  }

  /**
   * PUT /api/v1/catalogs/packages/:id
   * Update a package
   */
  @Put(':id')
  @Permissions(CATALOG_UPDATE)
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packageService.update(tenantId, id, updatePackageDto);
  }

  /**
   * DELETE /api/v1/catalogs/packages/:id
   * Delete a package
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(CATALOG_DELETE)
  async remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.packageService.remove(tenantId, id);
  }
}
