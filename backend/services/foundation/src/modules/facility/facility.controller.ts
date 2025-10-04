import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Controller('facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  create(@Body() dto: CreateFacilityDto) {
    return this.facilityService.create(dto);
  }

  @Get()
  list(@Query('tenantId') tenantId?: string) {
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
}
