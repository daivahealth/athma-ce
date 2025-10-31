import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { SpecialtyService } from '../specialty/specialty.service';

@ApiTags('Facilities')
@ApiSecurity('x-tenant-id')
@ApiBearerAuth('JWT-auth')
@Controller('facilities')
export class FacilityController {
  constructor(
    private readonly facilityService: FacilityService,
    private readonly specialtyService: SpecialtyService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new facility',
    description: 'Creates a new healthcare facility (hospital, clinic, etc.)'
  })
  @ApiResponse({
    status: 201,
    description: 'Facility created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Dubai Central Hospital',
        facilityType: 'hospital',
        address: 'Sheikh Zayed Road, Dubai',
        status: 'active'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateFacilityDto) {
    return this.facilityService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all facilities',
    description: 'Retrieves all facilities for a tenant'
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    description: 'Tenant UUID',
    example: '223e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'List of facilities',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Dubai Central Hospital',
          facilityType: 'hospital',
          address: 'Sheikh Zayed Road, Dubai',
          status: 'active'
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'tenantId query parameter is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  list(@Query('tenantId') tenantId?: string) {
    // Tenant-level operation: requires tenantId as query parameter
    if (!tenantId) {
      throw new BadRequestException('tenantId query parameter is required');
    }
    return this.facilityService.list(tenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get facility by ID',
    description: 'Retrieves a single facility by its UUID'
  })
  @ApiParam({
    name: 'id',
    description: 'Facility UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Facility details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Dubai Central Hospital',
        facilityType: 'hospital',
        address: 'Sheikh Zayed Road, Dubai',
        contactNumber: '+971-4-1234567',
        email: 'info@dubaihospital.ae',
        status: 'active'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Facility not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get(@Param('id') id: string) {
    return this.facilityService.get(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update facility',
    description: 'Updates an existing facility\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'Facility UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'Facility updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Facility not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateFacilityDto) {
    return this.facilityService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Archive facility',
    description: 'Soft deletes (archives) a facility. It will no longer appear in active lists but data is retained.'
  })
  @ApiParam({
    name: 'id',
    description: 'Facility UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'Facility archived successfully' })
  @ApiResponse({ status: 404, description: 'Facility not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.facilityService.archive(id);
  }

  @Get(':id/specialties')
  @ApiOperation({
    summary: 'Get facility specialties',
    description: 'Retrieves all medical specialties available at a facility with optional localization'
  })
  @ApiParam({
    name: 'id',
    description: 'Facility UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'locale',
    required: false,
    description: 'Language code for translations (en, ar)',
    example: 'en'
  })
  @ApiResponse({
    status: 200,
    description: 'List of specialties at the facility',
    schema: {
      example: [
        {
          id: '323e4567-e89b-12d3-a456-426614174000',
          code: 'cardiology',
          name: 'Cardiology',
          description: 'Heart and cardiovascular care'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Facility not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFacilitySpecialties(
    @Param('id') facilityId: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getFacilitySpecialties(facilityId, locale);
  }
}
