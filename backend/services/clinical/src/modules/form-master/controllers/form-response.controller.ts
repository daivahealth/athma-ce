import { Controller, Get, Post, Patch, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { FORM_RESPONSE_READ, FORM_RESPONSE_CREATE, FORM_RESPONSE_UPDATE } from '@zeal/contracts';
import { FormResponseService } from '../services/form-response.service';
import { CreateFormResponseDto } from '../dto/create-form-response.dto';
import { SaveFormResponseDto } from '../dto/save-form-response.dto';
import { TenantId, Context } from '../../../common/decorators/tenant-context.decorator';

@Controller('form-responses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FormResponseController {
  constructor(private readonly formResponseService: FormResponseService) {}

  /** POST /api/v1/form-responses — start filling a form against a patient+encounter */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(FORM_RESPONSE_CREATE)
  async create(@Body() dto: CreateFormResponseDto, @Context() context: any) {
    return this.formResponseService.create(dto, context);
  }

  /** GET /api/v1/form-responses/:id */
  @Get(':id')
  @Permissions(FORM_RESPONSE_READ)
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.formResponseService.findById(id, tenantId);
  }

  /** GET /api/v1/form-responses/encounter/:encounterId */
  @Get('encounter/:encounterId')
  @Permissions(FORM_RESPONSE_READ)
  async findByEncounter(@Param('encounterId') encounterId: string, @TenantId() tenantId: string) {
    return this.formResponseService.findByEncounter(encounterId, tenantId);
  }

  /** GET /api/v1/form-responses/patient/:patientId */
  @Get('patient/:patientId')
  @Permissions(FORM_RESPONSE_READ)
  async findByPatient(@Param('patientId') patientId: string, @TenantId() tenantId: string) {
    return this.formResponseService.findByPatient(patientId, tenantId);
  }

  /** PATCH /api/v1/form-responses/:id — save draft or submit final */
  @Patch(':id')
  @Permissions(FORM_RESPONSE_UPDATE)
  async save(@Param('id') id: string, @Body() dto: SaveFormResponseDto, @Context() context: any) {
    return this.formResponseService.save(id, dto, context);
  }
}
