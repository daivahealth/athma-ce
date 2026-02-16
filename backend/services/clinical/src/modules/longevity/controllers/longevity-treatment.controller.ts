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
import { LongevityProtocolService } from '../services/longevity-protocol.service';
import { BiologicalAgeCalculatorService } from '../services/biological-age-calculator.service';
import {
  CreateLongevityProtocolDto,
  UpdateLongevityProtocolDto,
  ScheduleTreatmentDto,
  StartTreatmentDto,
  CompleteTreatmentDto,
  LongevityProtocolResponseDto,
  LongevityTreatmentResponseDto,
  LongevityTreatmentStatus,
} from '../dto/longevity-treatment.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Longevity Treatments')
@ApiBearerAuth()
@Controller('longevity')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LongevityTreatmentController {
  constructor(
    private readonly protocolService: LongevityProtocolService,
    private readonly bioAgeService: BiologicalAgeCalculatorService,
  ) {}

  // ============================================
  // Protocol Endpoints
  // ============================================

  @Post('protocols')
  @ApiOperation({ summary: 'Create a longevity protocol' })
  @ApiResponse({ status: 201, type: LongevityProtocolResponseDto })
  async createProtocol(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateLongevityProtocolDto,
  ) {
    return this.protocolService.createProtocol(tenantId, userId, dto);
  }

  @Get('protocols')
  @ApiOperation({ summary: 'List all longevity protocols' })
  @ApiQuery({ name: 'protocolType', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [LongevityProtocolResponseDto] })
  async findAllProtocols(
    @Headers('x-tenant-id') tenantId: string,
    @Query('protocolType') protocolType?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options: { protocolType?: string; isActive?: boolean } = {};
    if (protocolType !== undefined) options.protocolType = protocolType;
    if (isActive !== undefined) options.isActive = isActive === 'true';
    return this.protocolService.findAllProtocols(tenantId, options);
  }

  @Get('protocols/:id')
  @ApiOperation({ summary: 'Get a longevity protocol by ID' })
  @ApiResponse({ status: 200, type: LongevityProtocolResponseDto })
  async findProtocolById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.protocolService.findProtocolById(tenantId, id);
  }

  @Patch('protocols/:id')
  @ApiOperation({ summary: 'Update a longevity protocol' })
  @ApiResponse({ status: 200, type: LongevityProtocolResponseDto })
  async updateProtocol(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLongevityProtocolDto,
  ) {
    return this.protocolService.updateProtocol(tenantId, id, dto);
  }

  // ============================================
  // Treatment Endpoints
  // ============================================

  @Post('treatments')
  @ApiOperation({ summary: 'Schedule a longevity treatment' })
  @ApiResponse({ status: 201, type: LongevityTreatmentResponseDto })
  async scheduleTreatment(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ScheduleTreatmentDto,
  ) {
    return this.protocolService.scheduleTreatment(tenantId, userId, dto);
  }

  @Get('treatments/:id')
  @ApiOperation({ summary: 'Get a treatment by ID' })
  @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
  async findTreatmentById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.protocolService.findTreatmentById(tenantId, id);
  }

  @Get('treatments/patient/:patientId')
  @ApiOperation({ summary: 'Get treatments for a patient' })
  @ApiQuery({ name: 'protocolId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: LongevityTreatmentStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [LongevityTreatmentResponseDto] })
  async findTreatmentsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('protocolId') protocolId?: string,
    @Query('status') status?: LongevityTreatmentStatus,
    @Query('limit') limit?: number,
  ) {
    const options: { protocolId?: string; status?: LongevityTreatmentStatus; limit?: number } = {};
    if (protocolId !== undefined) options.protocolId = protocolId;
    if (status !== undefined) options.status = status;
    if (limit !== undefined) options.limit = Number(limit);
    return this.protocolService.findTreatmentsByPatient(tenantId, patientId, options);
  }

  @Post('treatments/:id/start')
  @ApiOperation({ summary: 'Start a treatment' })
  @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
  async startTreatment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: StartTreatmentDto,
  ) {
    return this.protocolService.startTreatment(tenantId, id, dto);
  }

  @Post('treatments/:id/complete')
  @ApiOperation({ summary: 'Complete a treatment' })
  @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
  async completeTreatment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CompleteTreatmentDto,
  ) {
    return this.protocolService.completeTreatment(tenantId, id, dto);
  }

  @Post('treatments/:id/cancel')
  @ApiOperation({ summary: 'Cancel a treatment' })
  @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
  async cancelTreatment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.protocolService.cancelTreatment(tenantId, id, body.reason);
  }

  @Get('treatments/patient/:patientId/history')
  @ApiOperation({ summary: 'Get treatment history for a patient' })
  @ApiQuery({ name: 'protocolId', required: false })
  async getTreatmentHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('protocolId') protocolId?: string,
  ) {
    return this.protocolService.getTreatmentHistory(tenantId, patientId, protocolId);
  }

  // ============================================
  // Biological Age Endpoints
  // ============================================

  @Get('biological-age/patient/:patientId')
  @ApiOperation({ summary: 'Calculate biological age for a patient' })
  async calculateBiologicalAge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.bioAgeService.calculateBiologicalAge(tenantId, patientId);
  }
}
