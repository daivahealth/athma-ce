import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Headers } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Get()
  list(@Query('tenantId') tenantId?: string, @Headers('x-tenant-id') tenantHeader?: string) {
    const effectiveTenantId = tenantId ?? tenantHeader;
    if (!effectiveTenantId) {
      throw new BadRequestException('tenantId is required (provide ?tenantId= or x-tenant-id header)');
    }
    return this.staffService.list(effectiveTenantId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.staffService.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.archive(id);
  }
}
