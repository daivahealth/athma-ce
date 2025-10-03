import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto, TenantStatsDto } from './dto/tenant.dto';
// Temporary local interfaces until contracts package is fixed
interface ApiResponseType<T> {
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
import type { Tenant } from '@prisma/client';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<ApiResponseType<Tenant>> {
    const tenant = await this.tenantService.createTenant(createTenantDto);
    return { 
      data: tenant, 
      message: 'Tenant created successfully' 
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants with pagination and search' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async findAll(
    @Query() searchDto: TenantSearchDto,
    @Query() pagination: PaginationParams,
  ): Promise<ApiResponseType<Tenant[]>> {
    const { tenants, total } = await this.tenantService.searchTenants(searchDto, pagination);
    return {
      data: tenants,
      pagination: {
        total,
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        totalPages: Math.ceil(total / (pagination.limit || 20)),
      },
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active tenants' })
  @ApiResponse({ status: 200, description: 'Active tenants retrieved successfully' })
  async getActiveTenants(): Promise<ApiResponseType<Tenant[]>> {
    const tenants = await this.tenantService.getActiveTenants();
    return { 
      data: tenants, 
      message: 'Active tenants retrieved successfully' 
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<Tenant>> {
    const tenant = await this.tenantService.getTenantById(id);
    return { 
      data: tenant, 
      message: 'Tenant retrieved successfully' 
    };
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get tenant statistics' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenantStats(@Param('id') id: string): Promise<ApiResponseType<TenantStatsDto>> {
    const stats = await this.tenantService.getTenantStats(id);
    return { 
      data: stats, 
      message: 'Tenant statistics retrieved successfully' 
    };
  }

  @Get('domain/:domain')
  @ApiOperation({ summary: 'Get tenant by domain' })
  @ApiParam({ name: 'domain', description: 'Tenant domain' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findByDomain(@Param('domain') domain: string): Promise<ApiResponseType<Tenant>> {
    const tenant = await this.tenantService.getTenantByDomain(domain);
    return { 
      data: tenant, 
      message: 'Tenant retrieved successfully' 
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Tenant with this name or domain already exists' })
  async update(
    @Param('id') id: string, 
    @Body() updateTenantDto: UpdateTenantDto
  ): Promise<ApiResponseType<Tenant>> {
    const tenant = await this.tenantService.updateTenant(id, updateTenantDto);
    return { 
      data: tenant, 
      message: 'Tenant updated successfully' 
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant (soft delete)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete tenant with active data' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.tenantService.deleteTenant(id);
  }

  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if tenant exists' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant existence checked' })
  async checkExists(@Param('id') id: string): Promise<ApiResponseType<{ exists: boolean }>> {
    const exists = await this.tenantService.tenantExists(id);
    return { 
      data: { exists }, 
      message: 'Tenant existence checked' 
    };
  }
}
