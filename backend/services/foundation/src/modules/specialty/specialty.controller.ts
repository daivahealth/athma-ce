import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { AssignSpecialtyDto, BulkAssignSpecialtiesDto } from './dto/assign-specialty.dto';
import { SearchStaffBySpecialtyDto } from './dto/search-staff.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { SPECIALTY_MANAGE, SPECIALTY_READ } from '@zeal/contracts';

// =====================================================
// Specialty Management Controller
// =====================================================

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  // =====================================================
  // Specialty Management Endpoints
  // =====================================================

  @Get()
  @Permissions(SPECIALTY_READ)
  async getAllSpecialties(
    @Query('includeInactive') includeInactive?: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getAllSpecialties(
      includeInactive === 'true',
      locale
    );
  }

  @Get('stats')
  @Permissions(SPECIALTY_READ)
  async getSpecialtyStats(
    @Headers('x-tenant-id') tenantId: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getSpecialtyStats(tenantId, locale);
  }

  @Get('code/:code')
  @Permissions(SPECIALTY_READ)
  async getSpecialtyByCode(
    @Param('code') code: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getSpecialtyByCode(code, locale);
  }

  @Get(':id')
  @Permissions(SPECIALTY_READ)
  async getSpecialtyById(
    @Param('id') id: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getSpecialtyById(id, locale);
  }
}

// =====================================================
// Staff Specialty Management Controller
// =====================================================

@Controller('staff')
export class StaffSpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  // =====================================================
  // Specialty-Based Doctor Search Endpoints
  // =====================================================

  @Get('search/by-specialty')
  @Permissions(SPECIALTY_READ)
  async searchStaffBySpecialty(
    @Headers('x-tenant-id') tenantId: string,
    @Query() dto: SearchStaffBySpecialtyDto
  ) {
    return this.specialtyService.searchStaffBySpecialty(tenantId, dto);
  }

  @Get('doctors/specialty/:specialtyCode')
  @Permissions(SPECIALTY_READ)
  async findDoctorsBySpecialty(
    @Headers('x-tenant-id') tenantId: string,
    @Param('specialtyCode') specialtyCode: string,
    @Query('facilityId') facilityId?: string,
    @Query('locale') locale?: string
  ) {
    const searchDto: any = {
      specialtyCode,
      staffType: 'physician' as any,
      primaryOnly: true,
      activeOnly: true,
    };
    
    if (facilityId) searchDto.facilityId = facilityId;
    if (locale) searchDto.locale = locale;
    
    return this.specialtyService.searchStaffBySpecialty(tenantId, searchDto);
  }

  // =====================================================
  // Staff Specialty Assignment Endpoints
  // =====================================================

  @Post(':staffId/specialties')
  @Permissions(SPECIALTY_MANAGE)
  async assignSpecialtyToStaff(
    @Headers('x-tenant-id') tenantId: string,
    @Param('staffId') staffId: string,
    @Body() dto: AssignSpecialtyDto
  ) {
    return this.specialtyService.assignSpecialtyToStaff(tenantId, staffId, dto);
  }

  @Post(':staffId/specialties/bulk')
  @Permissions(SPECIALTY_MANAGE)
  async bulkAssignSpecialties(
    @Headers('x-tenant-id') tenantId: string,
    @Param('staffId') staffId: string,
    @Body() dto: BulkAssignSpecialtiesDto
  ) {
    return this.specialtyService.bulkAssignSpecialties(tenantId, staffId, dto);
  }

  @Get(':staffId/specialties')
  @Permissions(SPECIALTY_READ)
  async getStaffSpecialties(
    @Param('staffId') staffId: string,
    @Query('facilityId') facilityId?: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getStaffSpecialties(staffId, facilityId, locale);
  }

  @Put(':staffId/specialties/facility/:facilityId/primary/:specialtyId')
  @Permissions(SPECIALTY_MANAGE)
  @HttpCode(HttpStatus.OK)
  async changePrimarySpecialty(
    @Param('staffId') staffId: string,
    @Param('facilityId') facilityId: string,
    @Param('specialtyId') specialtyId: string
  ) {
    return this.specialtyService.changePrimarySpecialty(staffId, facilityId, specialtyId);
  }

  @Delete(':staffId/specialties/facility/:facilityId/specialty/:specialtyId')
  @Permissions(SPECIALTY_MANAGE)
  @HttpCode(HttpStatus.OK)
  async removeSpecialtyFromStaff(
    @Param('staffId') staffId: string,
    @Param('facilityId') facilityId: string,
    @Param('specialtyId') specialtyId: string
  ) {
    return this.specialtyService.removeSpecialtyFromStaff(staffId, facilityId, specialtyId);
  }
}
