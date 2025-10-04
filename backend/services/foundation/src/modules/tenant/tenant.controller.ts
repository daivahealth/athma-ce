import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  createTenant(@Body() dto: CreateTenantDto) {
    return this.tenantService.createTenant(dto);
  }

  @Get()
  listTenants() {
    return this.tenantService.getTenants();
  }

  @Get(':id')
  getTenant(@Param('id') id: string) {
    return this.tenantService.getTenant(id);
  }

  @Put(':id')
  updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.updateTenant(id, dto);
  }

  @Delete(':id')
  deleteTenant(@Param('id') id: string) {
    return this.tenantService.deleteTenant(id);
  }
}
