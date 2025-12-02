import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NoteTemplatesService } from '../services/note-templates.service';
import {
  CreateNoteTemplateDto,
  UpdateNoteTemplateDto,
  CreateTemplateVersionDto,
  NoteTemplateResponseDto,
  NoteTemplateVersionResponseDto,
  TemplateStatus,
} from '../dto/note-template.dto';

@ApiTags('Note Templates')
@ApiBearerAuth()
@Controller('note-templates')
export class NoteTemplatesController {
  constructor(private readonly noteTemplatesService: NoteTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note template' })
  @ApiResponse({ status: 201, description: 'Template created successfully', type: NoteTemplateResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateNoteTemplateDto,
  ) {
    return this.noteTemplatesService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all note templates (tenant + global)' })
  @ApiQuery({ name: 'specialtyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TemplateStatus })
  @ApiResponse({ status: 200, description: 'Templates retrieved', type: [NoteTemplateResponseDto] })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('specialtyId') specialtyId?: string,
    @Query('status') status?: TemplateStatus,
  ) {
    return this.noteTemplatesService.findAll(tenantId, specialtyId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID with all versions' })
  @ApiResponse({ status: 200, description: 'Template found', type: NoteTemplateResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.noteTemplatesService.findById(tenantId, id);
  }

  @Get(':id/version/:version')
  @ApiOperation({ summary: 'Get specific template version' })
  @ApiResponse({ status: 200, description: 'Template version found' })
  async findByVersion(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Param('version') version: string,
  ) {
    return this.noteTemplatesService.findByIdAndVersion(tenantId, id, parseInt(version, 10));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template metadata' })
  @ApiResponse({ status: 200, description: 'Template updated', type: NoteTemplateResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteTemplateDto,
  ) {
    return this.noteTemplatesService.update(tenantId, id, dto);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Create a new version of a template' })
  @ApiResponse({ status: 201, description: 'New version created', type: NoteTemplateVersionResponseDto })
  async createVersion(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateTemplateVersionDto,
  ) {
    return this.noteTemplatesService.createVersion(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive a note template' })
  @ApiResponse({ status: 200, description: 'Template archived successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.noteTemplatesService.delete(tenantId, id);
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get template statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.noteTemplatesService.getTemplateStatistics(tenantId);
  }
}
