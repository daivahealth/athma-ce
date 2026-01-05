import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { SearchStaffDto } from './dto/search-staff.dto';

@ApiTags('Staff')
@ApiSecurity('x-tenant-id')
@ApiBearerAuth('JWT-auth')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new staff member',
    description: 'Creates a new healthcare staff member (doctor, nurse, technician, etc.) in the system'
  })
  @ApiResponse({
    status: 201,
    description: 'Staff member created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        employeeId: 'EMP001',
        staffType: 'physician',
        email: 'ahmed.hassan@hospital.ae'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all staff members',
    description: 'Retrieves all staff members for a tenant. Requires tenantId as query parameter or x-tenant-id header.'
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Tenant UUID (can also be provided via x-tenant-id header)',
    example: '223e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'List of staff members',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          employeeId: 'EMP001',
          staffType: 'physician',
          email: 'ahmed.hassan@hospital.ae'
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'tenantId is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  list(@Query('tenantId') tenantId?: string, @Headers('x-tenant-id') tenantHeader?: string) {
    const effectiveTenantId = tenantId ?? tenantHeader;
    if (!effectiveTenantId) {
      throw new BadRequestException('tenantId is required (provide ?tenantId= or x-tenant-id header)');
    }
    return this.staffService.list(effectiveTenantId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search staff members',
    description: 'Search and filter staff members by display name, staff type, specialty, and facility. Returns paginated results with specialty information.'
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Tenant UUID (can also be provided via x-tenant-id header)',
    example: '223e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'displayName',
    required: false,
    description: 'Search by staff display name (case-insensitive)',
    example: 'Dr. Ahmed'
  })
  @ApiQuery({
    name: 'staffType',
    required: false,
    description: 'Filter by staff type',
    enum: ['physician', 'nurse', 'technician', 'pharmacist', 'administrative', 'support', 'other']
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status (default: active)',
    example: 'active'
  })
  @ApiQuery({
    name: 'specialtyId',
    required: false,
    description: 'Filter by specialty UUID',
    example: '323e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'facilityId',
    required: false,
    description: 'Filter by facility UUID',
    example: '423e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Page size (1-100, default: 20)',
    example: 20
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset (default: 0)',
    example: 0
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated search results',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            displayName: 'Dr. Ahmed Hassan',
            firstName: 'Ahmed',
            lastName: 'Hassan',
            employeeId: 'EMP001',
            staffType: 'physician',
            email: 'ahmed.hassan@hospital.ae',
            staffSpecialties: [
              {
                facilityId: '423e4567-e89b-12d3-a456-426614174000',
                primaryFlag: true,
                specialty: {
                  id: '323e4567-e89b-12d3-a456-426614174000',
                  code: 'CARDIO',
                  name: 'Cardiology'
                }
              }
            ]
          }
        ],
        meta: {
          total: 45,
          limit: 20,
          offset: 0,
          hasMore: true
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'tenantId is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  search(@Query() query: SearchStaffDto, @Query('tenantId') tenantId?: string, @Headers('x-tenant-id') tenantHeader?: string) {
    const effectiveTenantId = tenantId ?? tenantHeader;
    if (!effectiveTenantId) {
      throw new BadRequestException('tenantId is required (provide ?tenantId= or x-tenant-id header)');
    }
    return this.staffService.search(query, effectiveTenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get staff member by ID',
    description: 'Retrieves a single staff member by their UUID'
  })
  @ApiParam({
    name: 'id',
    description: 'Staff UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Staff member details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        employeeId: 'EMP001',
        staffType: 'physician',
        licenseNumber: 'DHA-12345',
        email: 'ahmed.hassan@hospital.ae',
        specialties: ['cardiology']
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get(@Param('id') id: string) {
    return this.staffService.get(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update staff member',
    description: 'Updates an existing staff member\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'Staff UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'Staff member updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Archive staff member',
    description: 'Soft deletes (archives) a staff member. They will no longer appear in active lists but data is retained.'
  })
  @ApiParam({
    name: 'id',
    description: 'Staff UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'Staff member archived successfully' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.staffService.archive(id);
  }
}
