import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { TENANT_READ, TENANT_CREATE, TENANT_UPDATE, TENANT_DELETE } from '@zeal/contracts';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @Permissions(TENANT_CREATE)
  createTenant(@Body() dto: CreateTenantDto) {
    return this.tenantService.createTenant(dto);
  }

  @Get()
  @Permissions(TENANT_READ)
  listTenants() {
    return this.tenantService.getTenants();
  }

  @Get(':id')
  @Permissions(TENANT_READ)
  getTenant(@Param('id') id: string) {
    return this.tenantService.getTenant(id);
  }

  @Put(':id')
  @Permissions(TENANT_UPDATE)
  updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.updateTenant(id, dto);
  }

  @Delete(':id')
  @Permissions(TENANT_DELETE)
  deleteTenant(@Param('id') id: string) {
    return this.tenantService.deleteTenant(id);
  }
}
