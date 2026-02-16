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
import { ScreeningProtocolService } from '../services/screening-protocol.service';
import {
  CreateScreeningProtocolDto,
  UpdateScreeningProtocolDto,
  ScheduleScreeningDto,
  CompleteScreeningDto,
  DeclineScreeningDto,
  ScreeningProtocolResponseDto,
  PatientScreeningScheduleResponseDto,
  ScreeningStatus,
} from '../dto/screening-protocol.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Preventive Screening')
@ApiBearerAuth()
@Controller('longevity/screening')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ScreeningProtocolController {
  constructor(private readonly screeningService: ScreeningProtocolService) {}

  // ============================================
  // Protocol Endpoints
  // ============================================

  @Post('protocols')
  @ApiOperation({ summary: 'Create a screening protocol' })
  @ApiResponse({ status: 201, type: ScreeningProtocolResponseDto })
  async createProtocol(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateScreeningProtocolDto,
  ) {
    return this.screeningService.createProtocol(tenantId, dto);
  }

  @Get('protocols')
  @ApiOperation({ summary: 'List all screening protocols' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [ScreeningProtocolResponseDto] })
  async findAllProtocols(
    @Headers('x-tenant-id') tenantId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options: { category?: string; isActive?: boolean } = {};
    if (category !== undefined) options.category = category;
    if (isActive !== undefined) options.isActive = isActive === 'true';
    return this.screeningService.findAllProtocols(tenantId, options);
  }

  @Get('protocols/:id')
  @ApiOperation({ summary: 'Get a screening protocol by ID' })
  @ApiResponse({ status: 200, type: ScreeningProtocolResponseDto })
  async findProtocolById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.screeningService.findProtocolById(tenantId, id);
  }

  @Patch('protocols/:id')
  @ApiOperation({ summary: 'Update a screening protocol' })
  @ApiResponse({ status: 200, type: ScreeningProtocolResponseDto })
  async updateProtocol(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateScreeningProtocolDto,
  ) {
    return this.screeningService.updateProtocol(tenantId, id, dto);
  }

  // ============================================
  // Schedule Endpoints
  // ============================================

  @Post('schedules')
  @ApiOperation({ summary: 'Schedule a screening for a patient' })
  @ApiResponse({ status: 201, type: PatientScreeningScheduleResponseDto })
  async scheduleScreening(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ScheduleScreeningDto,
  ) {
    return this.screeningService.scheduleScreening(tenantId, userId, dto);
  }

  @Get('schedules/:id')
  @ApiOperation({ summary: 'Get a screening schedule by ID' })
  @ApiResponse({ status: 200, type: PatientScreeningScheduleResponseDto })
  async findScheduleById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.screeningService.findScheduleById(tenantId, id);
  }

  @Get('schedules/patient/:patientId')
  @ApiOperation({ summary: 'Get screening schedules for a patient' })
  @ApiQuery({ name: 'status', required: false, enum: ScreeningStatus })
  @ApiQuery({ name: 'includeOverdue', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [PatientScreeningScheduleResponseDto] })
  async findSchedulesByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: ScreeningStatus,
    @Query('includeOverdue') includeOverdue?: string,
  ) {
    const options: { status?: ScreeningStatus; includeOverdue?: boolean } = {};
    if (status !== undefined) options.status = status;
    options.includeOverdue = includeOverdue === 'true';
    return this.screeningService.findSchedulesByPatient(tenantId, patientId, options);
  }

  @Get('schedules/due')
  @ApiOperation({ summary: 'Get all due screenings' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  async getDueScreenings(
    @Headers('x-tenant-id') tenantId: string,
    @Query('facilityId') facilityId?: string,
    @Query('daysAhead') daysAhead?: number,
  ) {
    const options: { facilityId?: string; daysAhead?: number } = {};
    if (facilityId !== undefined) options.facilityId = facilityId;
    if (daysAhead !== undefined) options.daysAhead = Number(daysAhead);
    return this.screeningService.getDueScreenings(tenantId, options);
  }

  @Post('schedules/:id/complete')
  @ApiOperation({ summary: 'Complete a screening' })
  @ApiResponse({ status: 200, type: PatientScreeningScheduleResponseDto })
  async completeScreening(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: CompleteScreeningDto,
  ) {
    return this.screeningService.completeScreening(tenantId, id, userId, dto);
  }

  @Post('schedules/:id/decline')
  @ApiOperation({ summary: 'Decline a screening' })
  @ApiResponse({ status: 200, type: PatientScreeningScheduleResponseDto })
  async declineScreening(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: DeclineScreeningDto,
  ) {
    return this.screeningService.declineScreening(tenantId, id, userId, dto);
  }

  @Post('schedules/:id/not-applicable')
  @ApiOperation({ summary: 'Mark screening as not applicable' })
  @ApiResponse({ status: 200, type: PatientScreeningScheduleResponseDto })
  async markNotApplicable(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.screeningService.markNotApplicable(tenantId, id, userId, body.reason);
  }

  @Post('schedules/:id/send-reminder')
  @ApiOperation({ summary: 'Send a screening reminder' })
  async sendReminder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.screeningService.sendReminder(tenantId, id);
  }

  // ============================================
  // Risk Assessment Endpoints
  // ============================================

  @Get('risk-assessment/patient/:patientId')
  @ApiOperation({ summary: 'Assess screening risks for a patient' })
  async assessPatientRisks(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.screeningService.assessPatientRisks(tenantId, patientId);
  }
}
