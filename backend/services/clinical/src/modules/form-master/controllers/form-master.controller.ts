import { Controller, Get, Post, Patch, Param, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { FORM_MASTER_READ, FORM_MASTER_CREATE, FORM_MASTER_UPDATE } from '@zeal/contracts';
import { FormMasterStatus } from '@zeal/database-clinical';
import { FormMasterService } from '../services/form-master.service';
import { CreateFormMasterDto } from '../dto/create-form-master.dto';
import { UpdateFormMasterDto } from '../dto/update-form-master.dto';
import { TenantId, Context } from '../../../common/decorators/tenant-context.decorator';

@Controller('form-master')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FormMasterController {
  constructor(private readonly formMasterService: FormMasterService) {}

  /** POST /api/v1/form-master */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(FORM_MASTER_CREATE)
  async create(@Body() dto: CreateFormMasterDto, @Context() context: any) {
    return this.formMasterService.create(dto, context);
  }

  /** GET /api/v1/form-master?status= */
  @Get()
  @Permissions(FORM_MASTER_READ)
  async list(@Query('status') status: FormMasterStatus | undefined, @TenantId() tenantId: string) {
    return this.formMasterService.list(tenantId, status);
  }

  /** GET /api/v1/form-master/:id */
  @Get(':id')
  @Permissions(FORM_MASTER_READ)
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.formMasterService.findById(id, tenantId);
  }

  /** PATCH /api/v1/form-master/:id */
  @Patch(':id')
  @Permissions(FORM_MASTER_UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateFormMasterDto, @Context() context: any) {
    return this.formMasterService.update(id, dto, context);
  }
}
