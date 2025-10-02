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
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async createStaff(@Body() createStaffDto: any) {
    return this.staffService.createStaff(createStaffDto);
  }

  @Get()
  async getStaff(@Query() query: any) {
    return this.staffService.getStaff(query);
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string) {
    return this.staffService.getStaffById(id);
  }

  @Put(':id')
  async updateStaff(@Param('id') id: string, @Body() updateStaffDto: any) {
    return this.staffService.updateStaff(id, updateStaffDto);
  }

  @Delete(':id')
  async deleteStaff(@Param('id') id: string) {
    return this.staffService.deleteStaff(id);
  }

  @Get(':id/availability')
  async getStaffAvailability(@Param('id') id: string, @Query() query: any) {
    return this.staffService.getStaffAvailability(id, query);
  }

  @Get(':id/schedule')
  async getStaffSchedule(@Param('id') id: string, @Query() query: any) {
    return this.staffService.getStaffSchedule(id, query);
  }
}
