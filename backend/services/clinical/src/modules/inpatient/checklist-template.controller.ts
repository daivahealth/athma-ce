import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Header,
  UseGuards,
} from '@nestjs/common';
import { ChecklistTemplateService } from './checklist-template.service';
import { CreateChecklistTemplateItemDto } from './dto/create-checklist-template.dto';
import { CreateChecklistTemplateDto } from './dto/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from './dto/update-checklist-template.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { ChecklistTemplateStatus } from '@zeal/database-clinical';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CHECKLIST_TEMPLATE_READ,
  CHECKLIST_TEMPLATE_CREATE,
  CHECKLIST_TEMPLATE_UPDATE,
} from '@zeal/contracts';

@Controller('inpatient/checklists/templates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChecklistTemplateController {
  constructor(
    private readonly checklistTemplateService: ChecklistTemplateService,
  ) { }

  /**
   * Create a new checklist template
   * POST /api/v1/inpatient/checklists/templates
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CHECKLIST_TEMPLATE_CREATE)
  async createTemplate(
    @Body() dto: CreateChecklistTemplateDto,
    @Context() context: any,
  ) {
    return this.checklistTemplateService.createTemplate(dto, context);
  }

  /**
   * Add item to checklist template
   * POST /api/v1/inpatient/checklists/templates/:templateId/items
   */
  @Post(':templateId/items')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CHECKLIST_TEMPLATE_UPDATE)
  async addItem(
    @Param('templateId') templateId: string,
    @Body() dto: CreateChecklistTemplateItemDto,
    @Context() context: any,
  ) {
    return this.checklistTemplateService.addItem(templateId, dto, context);
  }

  /**
   * List checklist templates with filtering and pagination
   * GET /api/v1/inpatient/checklists/templates
   * Query params: category, status, applicableToInpatient, applicableToOutpatient, skip, take
   */
  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @Permissions(CHECKLIST_TEMPLATE_READ)
  async listTemplates(
    @Query('category') category?: string,
    @Query('status') status?: ChecklistTemplateStatus,
    @Query('applicableToInpatient') applicableToInpatient?: string,
    @Query('applicableToOutpatient') applicableToOutpatient?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @TenantId() tenantId?: string,
  ) {
    const filters: any = {};

    if (category) filters.category = category;
    if (status) filters.status = status;
    if (applicableToInpatient !== undefined) {
      filters.applicableToInpatient = applicableToInpatient === 'true';
    }
    if (applicableToOutpatient !== undefined) {
      filters.applicableToOutpatient = applicableToOutpatient === 'true';
    }

    if (!tenantId) {
      return { data: [], meta: { total: 0, skip: 0, take: 0, hasMore: false } };
    }

    const pagination = {
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 50,
    };

    return this.checklistTemplateService.listTemplates(filters, tenantId, pagination);
  }

  /**
   * Get template by ID
   * GET /api/v1/inpatient/checklists/templates/:templateId
   */
  @Get(':templateId')
  @Permissions(CHECKLIST_TEMPLATE_READ)
  async getTemplate(
    @Param('templateId') templateId: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistTemplateService.getTemplate(templateId, tenantId);
  }

  /**
   * Get template by code (latest active version)
   * GET /api/v1/inpatient/checklists/templates/by-code/:code
   */
  @Get('by-code/:code')
  @Permissions(CHECKLIST_TEMPLATE_READ)
  async getTemplateByCode(
    @Param('code') code: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistTemplateService.getTemplateByCode(code, tenantId);
  }

  /**
   * Update template
   * PATCH /api/v1/inpatient/checklists/templates/:templateId
   */
  @Patch(':templateId')
  @Permissions(CHECKLIST_TEMPLATE_UPDATE)
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() dto: UpdateChecklistTemplateDto,
    @Context() context: any,
  ) {
    return this.checklistTemplateService.updateTemplate(
      templateId,
      dto,
      context,
    );
  }

  /**
   * Change template status
   * PATCH /api/v1/inpatient/checklists/templates/:templateId/status
   */
  @Patch(':templateId/status')
  @Permissions(CHECKLIST_TEMPLATE_UPDATE)
  async changeStatus(
    @Param('templateId') templateId: string,
    @Body('status') status: ChecklistTemplateStatus,
    @Context() context: any,
  ) {
    return this.checklistTemplateService.changeStatus(
      templateId,
      status,
      context,
    );
  }
}
