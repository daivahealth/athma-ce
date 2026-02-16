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
import { BiomarkerService } from '../services/biomarker.service';
import {
  CreateBiomarkerDefinitionDto,
  UpdateBiomarkerDefinitionDto,
  CreateBiomarkerResultDto,
  BiomarkerDefinitionResponseDto,
  BiomarkerResultResponseDto,
  BiomarkerAlertResponseDto,
  AcknowledgeAlertDto,
  ResolveAlertDto,
  BiomarkerAlertStatus,
  BiomarkerAlertSeverity,
} from '../dto/biomarker.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Biomarkers')
@ApiBearerAuth()
@Controller('wellness/biomarkers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BiomarkerController {
  constructor(private readonly biomarkerService: BiomarkerService) {}

  // ============================================
  // Definition Endpoints
  // ============================================

  @Post('definitions')
  @ApiOperation({ summary: 'Create a biomarker definition' })
  @ApiResponse({ status: 201, type: BiomarkerDefinitionResponseDto })
  async createDefinition(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateBiomarkerDefinitionDto,
  ) {
    return this.biomarkerService.createDefinition(tenantId, dto);
  }

  @Get('definitions')
  @ApiOperation({ summary: 'List all biomarker definitions' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [BiomarkerDefinitionResponseDto] })
  async findAllDefinitions(
    @Headers('x-tenant-id') tenantId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options: { category?: string; isActive?: boolean } = {};
    if (category !== undefined) options.category = category;
    if (isActive !== undefined) options.isActive = isActive === 'true';
    return this.biomarkerService.findAllDefinitions(tenantId, options);
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get a biomarker definition by ID' })
  @ApiResponse({ status: 200, type: BiomarkerDefinitionResponseDto })
  async findDefinitionById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.biomarkerService.findDefinitionById(tenantId, id);
  }

  @Patch('definitions/:id')
  @ApiOperation({ summary: 'Update a biomarker definition' })
  @ApiResponse({ status: 200, type: BiomarkerDefinitionResponseDto })
  async updateDefinition(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBiomarkerDefinitionDto,
  ) {
    return this.biomarkerService.updateDefinition(tenantId, id, dto);
  }

  // ============================================
  // Result Endpoints
  // ============================================

  @Post('results')
  @ApiOperation({ summary: 'Record a biomarker result' })
  @ApiResponse({ status: 201, type: BiomarkerResultResponseDto })
  async createResult(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateBiomarkerResultDto,
  ) {
    return this.biomarkerService.createResult(tenantId, userId, dto);
  }

  @Get('results/:id')
  @ApiOperation({ summary: 'Get a biomarker result by ID' })
  @ApiResponse({ status: 200, type: BiomarkerResultResponseDto })
  async findResultById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.biomarkerService.findResultById(tenantId, id);
  }

  @Get('results/patient/:patientId')
  @ApiOperation({ summary: 'Get biomarker results for a patient' })
  @ApiQuery({ name: 'biomarkerId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [BiomarkerResultResponseDto] })
  async findResultsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('biomarkerId') biomarkerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    const options: { biomarkerId?: string; startDate?: Date; endDate?: Date; limit?: number } = {};
    if (biomarkerId !== undefined) options.biomarkerId = biomarkerId;
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (limit !== undefined) options.limit = Number(limit);
    return this.biomarkerService.findResultsByPatient(tenantId, patientId, options);
  }

  @Get('results/patient/:patientId/trend/:biomarkerId')
  @ApiOperation({ summary: 'Get biomarker trend for a patient' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBiomarkerTrend(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Param('biomarkerId') biomarkerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    const options: { startDate?: Date; endDate?: Date; limit?: number } = {};
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (limit !== undefined) options.limit = Number(limit);
    return this.biomarkerService.getBiomarkerTrend(tenantId, patientId, biomarkerId, options);
  }

  // ============================================
  // Alert Endpoints
  // ============================================

  @Get('alerts/patient/:patientId')
  @ApiOperation({ summary: 'Get biomarker alerts for a patient' })
  @ApiQuery({ name: 'status', required: false, enum: BiomarkerAlertStatus })
  @ApiQuery({ name: 'severity', required: false, enum: BiomarkerAlertSeverity })
  @ApiResponse({ status: 200, type: [BiomarkerAlertResponseDto] })
  async findAlertsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: BiomarkerAlertStatus,
    @Query('severity') severity?: BiomarkerAlertSeverity,
  ) {
    const options: { status?: BiomarkerAlertStatus; severity?: BiomarkerAlertSeverity } = {};
    if (status !== undefined) options.status = status;
    if (severity !== undefined) options.severity = severity;
    return this.biomarkerService.findAlertsByPatient(tenantId, patientId, options);
  }

  @Post('alerts/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge a biomarker alert' })
  @ApiResponse({ status: 200, type: BiomarkerAlertResponseDto })
  async acknowledgeAlert(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AcknowledgeAlertDto,
  ) {
    return this.biomarkerService.acknowledgeAlert(tenantId, id, userId, dto.notes);
  }

  @Post('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve a biomarker alert' })
  @ApiResponse({ status: 200, type: BiomarkerAlertResponseDto })
  async resolveAlert(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ResolveAlertDto,
  ) {
    return this.biomarkerService.resolveAlert(tenantId, id, userId, dto.resolutionNotes);
  }

  @Post('alerts/:id/dismiss')
  @ApiOperation({ summary: 'Dismiss a biomarker alert' })
  @ApiResponse({ status: 200, type: BiomarkerAlertResponseDto })
  async dismissAlert(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.biomarkerService.dismissAlert(tenantId, id, userId);
  }
}
