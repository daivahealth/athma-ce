import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WellnessAssessmentService } from '../services/wellness-assessment.service';
import {
  CreateWellnessAssessmentTemplateDto,
  UpdateWellnessAssessmentTemplateDto,
  CreateWellnessAssessmentDto,
  UpdateWellnessAssessmentDto,
  CompleteWellnessAssessmentDto,
  WellnessAssessmentTemplateResponseDto,
  WellnessAssessmentResponseDto,
  WellnessAssessmentStatus,
} from '../dto/wellness-assessment.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Wellness Assessments')
@ApiBearerAuth()
@Controller('wellness/assessments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WellnessAssessmentController {
  constructor(private readonly assessmentService: WellnessAssessmentService) {}

  // ============================================
  // Template Endpoints
  // ============================================

  @Post('templates')
  @ApiOperation({ summary: 'Create a wellness assessment template' })
  @ApiResponse({ status: 201, description: 'Template created', type: WellnessAssessmentTemplateResponseDto })
  async createTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateWellnessAssessmentTemplateDto,
  ) {
    return this.assessmentService.createTemplate(tenantId, userId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List all wellness assessment templates' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [WellnessAssessmentTemplateResponseDto] })
  async findAllTemplates(
    @Headers('x-tenant-id') tenantId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options: { category?: string; isActive?: boolean } = {};
    if (category !== undefined) options.category = category;
    if (isActive !== undefined) options.isActive = isActive === 'true';
    return this.assessmentService.findAllTemplates(tenantId, options);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a wellness assessment template by ID' })
  @ApiResponse({ status: 200, type: WellnessAssessmentTemplateResponseDto })
  async findTemplateById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.assessmentService.findTemplateById(tenantId, id);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update a wellness assessment template' })
  @ApiResponse({ status: 200, type: WellnessAssessmentTemplateResponseDto })
  async updateTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWellnessAssessmentTemplateDto,
  ) {
    return this.assessmentService.updateTemplate(tenantId, id, dto);
  }

  @Post('templates/:id/publish')
  @ApiOperation({ summary: 'Publish a wellness assessment template' })
  @ApiResponse({ status: 200, type: WellnessAssessmentTemplateResponseDto })
  async publishTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.assessmentService.publishTemplate(tenantId, id);
  }

  @Post('templates/:id/archive')
  @ApiOperation({ summary: 'Archive a wellness assessment template' })
  @ApiResponse({ status: 200, type: WellnessAssessmentTemplateResponseDto })
  async archiveTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.assessmentService.archiveTemplate(tenantId, id);
  }

  // ============================================
  // Assessment Endpoints
  // ============================================

  @Post()
  @ApiOperation({ summary: 'Create a new wellness assessment' })
  @ApiResponse({ status: 201, type: WellnessAssessmentResponseDto })
  async createAssessment(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateWellnessAssessmentDto,
  ) {
    return this.assessmentService.createAssessment(tenantId, userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a wellness assessment by ID' })
  @ApiResponse({ status: 200, type: WellnessAssessmentResponseDto })
  async findAssessmentById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.assessmentService.findAssessmentById(tenantId, id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get wellness assessments for a patient' })
  @ApiQuery({ name: 'status', required: false, enum: WellnessAssessmentStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [WellnessAssessmentResponseDto] })
  async findAssessmentsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: WellnessAssessmentStatus,
    @Query('limit') limit?: number,
  ) {
    const options: { status?: WellnessAssessmentStatus; limit?: number } = {};
    if (status !== undefined) options.status = status;
    if (limit !== undefined) options.limit = Number(limit);
    return this.assessmentService.findAssessmentsByPatient(tenantId, patientId, options);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wellness assessment' })
  @ApiResponse({ status: 200, type: WellnessAssessmentResponseDto })
  async updateAssessment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWellnessAssessmentDto,
  ) {
    return this.assessmentService.updateAssessment(tenantId, id, dto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a wellness assessment and calculate scores' })
  @ApiResponse({ status: 200, type: WellnessAssessmentResponseDto })
  async completeAssessment(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: CompleteWellnessAssessmentDto,
  ) {
    return this.assessmentService.completeAssessment(tenantId, id, userId, dto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review a completed wellness assessment' })
  @ApiResponse({ status: 200, type: WellnessAssessmentResponseDto })
  async reviewAssessment(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() body: { notes?: string },
  ) {
    return this.assessmentService.reviewAssessment(tenantId, id, userId, body.notes);
  }

  // ============================================
  // Score History Endpoints
  // ============================================

  @Get('patient/:patientId/scores')
  @ApiOperation({ summary: 'Get wellness score history for a patient' })
  @ApiQuery({ name: 'scoreType', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getPatientScoreHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('scoreType') scoreType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const options: { scoreType?: string; startDate?: Date; endDate?: Date } = {};
    if (scoreType !== undefined) options.scoreType = scoreType;
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    return this.assessmentService.getPatientScoreHistory(tenantId, patientId, options);
  }
}
