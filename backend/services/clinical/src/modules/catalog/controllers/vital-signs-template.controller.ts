import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VitalSignsTemplateService } from '../services/vital-signs-template.service';
import {
  CreateVitalSignsTemplateDto,
  UpdateVitalSignsTemplateDto,
  QueryVitalSignsTemplatesDto,
  FindTemplateDto,
} from '../dto/vital-signs-template.dto';
import { TenantId } from '../../../common/decorators/tenant-context.decorator';

@Controller('catalogs/vital-signs-templates')
export class VitalSignsTemplateController {
  constructor(
    private readonly vitalSignsTemplateService: VitalSignsTemplateService
  ) {}

  /**
   * GET /api/v1/catalogs/vital-signs-templates
   * Get all vital signs templates with optional filtering
   */
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryVitalSignsTemplatesDto
  ) {
    return this.vitalSignsTemplateService.findAll(tenantId, query);
  }

  /**
   * GET /api/v1/catalogs/vital-signs-templates/care-settings
   * Get available care settings
   */
  @Get('care-settings')
  async getCareSettings() {
    return this.vitalSignsTemplateService.getCareSettings();
  }

  /**
   * GET /api/v1/catalogs/vital-signs-templates/age-groups
   * Get available age groups
   */
  @Get('age-groups')
  async getAgeGroups() {
    return this.vitalSignsTemplateService.getAgeGroups();
  }

  /**
   * POST /api/v1/catalogs/vital-signs-templates/find-match
   * Find the best matching template for a specific context
   */
  @Post('find-match')
  @HttpCode(HttpStatus.OK)
  async findBestMatch(
    @TenantId() tenantId: string,
    @Body() dto: FindTemplateDto
  ) {
    return this.vitalSignsTemplateService.findBestMatch(tenantId, dto);
  }

  /**
   * GET /api/v1/catalogs/vital-signs-templates/:id
   * Get a specific vital signs template by ID
   */
  @Get(':id')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.vitalSignsTemplateService.findOne(tenantId, id);
  }

  /**
   * GET /api/v1/catalogs/vital-signs-templates/by-code/:code
   * Get a specific vital signs template by code
   */
  @Get('by-code/:code')
  async findByCode(
    @TenantId() tenantId: string,
    @Param('code') code: string
  ) {
    return this.vitalSignsTemplateService.findByCode(tenantId, code);
  }

  /**
   * POST /api/v1/catalogs/vital-signs-templates
   * Create a new vital signs template
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @TenantId() tenantId: string,
    @Body() createDto: CreateVitalSignsTemplateDto
  ) {
    return this.vitalSignsTemplateService.create(tenantId, createDto);
  }

  /**
   * POST /api/v1/catalogs/vital-signs-templates/:id/clone
   * Clone an existing template with a new code
   */
  @Post(':id/clone')
  @HttpCode(HttpStatus.CREATED)
  async clone(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('newTemplateCode') newTemplateCode: string
  ) {
    return this.vitalSignsTemplateService.clone(tenantId, id, newTemplateCode);
  }

  /**
   * PUT /api/v1/catalogs/vital-signs-templates/:id
   * Update a vital signs template
   */
  @Put(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateVitalSignsTemplateDto
  ) {
    return this.vitalSignsTemplateService.update(tenantId, id, updateDto);
  }

  /**
   * DELETE /api/v1/catalogs/vital-signs-templates/:id
   * Delete a vital signs template
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.vitalSignsTemplateService.remove(tenantId, id);
  }
}
