/**
 * Templates Controller
 * CRUD endpoints for communication templates
 */

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { OidcAuthGuard } from '../auth/guards/oidc-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';

@ApiTags('Templates')
@ApiBearerAuth('bearer')
@UseGuards(OidcAuthGuard)
@Controller('v1/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new communication template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async create(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() createTemplateDto: CreateTemplateDto,
  ) {
    return this.templatesService.create(tenantId, userId, createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all communication templates' })
  @ApiQuery({ name: 'channel', required: false, type: String })
  @ApiQuery({ name: 'language', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('channel') channel?: string,
    @Query('language') language?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (channel) filters.channel = channel;
    if (language) filters.language = language;
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.templatesService.findAll(tenantId, filters);
  }

  @Get(':templateId')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@TenantId() tenantId: string, @Param('templateId') templateId: string) {
    return this.templatesService.findOne(tenantId, templateId);
  }

  @Patch(':templateId')
  @ApiOperation({ summary: 'Update communication template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('templateId') templateId: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templatesService.update(tenantId, userId, templateId, updateTemplateDto);
  }

  @Delete(':templateId')
  @ApiOperation({ summary: 'Delete communication template (soft delete)' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async remove(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.remove(tenantId, userId, templateId);
  }
}
