import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { SpecialtyService } from '../specialty/specialty.service';

@Controller('facilities')
export class FacilityController {
  constructor(
    private readonly facilityService: FacilityService,
    @Inject(forwardRef(() => SpecialtyService))
    private readonly specialtyService: SpecialtyService
  ) {}

  @Post()
  create(@Body() dto: CreateFacilityDto) {
    return this.facilityService.create(dto);
  }

  @Get()
  list(@Query('tenantId') tenantId?: string) {
    // Tenant-level operation: requires tenantId as query parameter
    if (!tenantId) {
      throw new BadRequestException('tenantId query parameter is required');
    }
    return this.facilityService.list(tenantId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.facilityService.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFacilityDto) {
    return this.facilityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityService.archive(id);
  }

  @Get(':id/specialties')
  async getFacilitySpecialties(
    @Param('id') facilityId: string,
    @Query('locale') locale?: string
  ) {
    return this.specialtyService.getFacilitySpecialties(facilityId, locale);
  }
}
