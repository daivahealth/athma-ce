import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FacilityService } from './facility.service';

@Controller('facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  async createFacility(@Body() createFacilityDto: any) {
    return this.facilityService.createFacility(createFacilityDto);
  }

  @Get()
  async getFacilities(@Query() query: Record<string, string>) {
    return this.facilityService.getFacilities(query);
  }

  @Get(':id')
  async getFacility(@Param('id') id: string) {
    return this.facilityService.getFacilityById(id);
  }

  @Put(':id')
  async updateFacility(@Param('id') id: string, @Body() updateFacilityDto: any) {
    return this.facilityService.updateFacility(id, updateFacilityDto);
  }

  @Delete(':id')
  async deleteFacility(@Param('id') id: string) {
    return this.facilityService.deleteFacility(id);
  }

  @Get(':id/spaces')
  async getFacilitySpaces(@Param('id') id: string, @Query() query: Record<string, string>) {
    return this.facilityService.getFacilitySpaces(id, query);
  }

  @Get(':id/staff')
  async getFacilityStaff(@Param('id') id: string, @Query() query: Record<string, string>) {
    return this.facilityService.getFacilityStaff(id, query);
  }

  @Get(':id/schedule')
  async getFacilitySchedule(@Param('id') id: string, @Query() query: Record<string, string>) {
    return this.facilityService.getFacilitySchedule(id, query);
  }
}

