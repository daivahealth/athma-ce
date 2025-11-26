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
import { MedicalCodingService } from '../services/medical-coding.service';
import {
  UpdateCodingSessionDto,
  SubmitCodingSessionDto,
  CodingSessionQueryDto,
  CreateCodingDiagnosisDto,
  CreateCodingProcedureDto,
  UpdateCodingDiagnosisDto,
  UpdateCodingProcedureDto,
  CodingSessionStatus,
} from '../dto/medical-coding.dto';

@ApiTags('Medical Coding')
@ApiBearerAuth()
@Controller('medical-coding')
export class MedicalCodingController {
  constructor(private readonly medicalCodingService: MedicalCodingService) {}

  // ========================================
  // CODING SESSION QUERY ENDPOINTS
  // ========================================

  @Get('sessions')
  @ApiOperation({ summary: 'Get all coding sessions with filters' })
  @ApiQuery({ name: 'status', required: false, enum: CodingSessionStatus })
  @ApiQuery({ name: 'encounterId', required: false, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Sessions retrieved' })
  async findAllSessions(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: CodingSessionStatus,
    @Query('encounterId') encounterId?: string,
    @Query('patientId') patientId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: CodingSessionQueryDto = {};
    if (status) filters.status = status;
    if (encounterId) filters.encounterId = encounterId;
    if (patientId) filters.patientId = patientId;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (limit) filters.limit = parseInt(limit);

    return this.medicalCodingService.findAllSessions(tenantId, filters);
  }

  @Get('sessions/pending')
  @ApiOperation({
    summary: 'Get pending coding sessions (coder inbox)',
    description: 'Returns sessions with status auto_generated or in_progress',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results (default 50)' })
  @ApiResponse({ status: 200, description: 'Pending sessions retrieved' })
  async getPendingSessions(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : 50;
    return this.medicalCodingService.getPendingCodingSessions(tenantId, limitNumber);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get coding session by ID' })
  @ApiResponse({ status: 200, description: 'Session found' })
  async findSessionById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.medicalCodingService.findSessionById(tenantId, id);
  }

  @Get('sessions/encounter/:encounterId')
  @ApiOperation({ summary: 'Get coding session by encounter ID' })
  @ApiResponse({ status: 200, description: 'Session found' })
  async findSessionByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.medicalCodingService.getCodingSessionByEncounter(tenantId, encounterId);
  }

  // ========================================
  // CODER REVIEW WORKFLOW ENDPOINTS
  // ========================================

  @Put('sessions/:id/start-review')
  @ApiOperation({
    summary: 'Start coder review (change status to in_progress)',
    description: 'Claims a coding session for review by the current coder',
  })
  @ApiResponse({ status: 200, description: 'Review started' })
  async startReview(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.medicalCodingService.startReview(tenantId, sessionId, userId);
  }

  @Put('sessions/:id')
  @ApiOperation({
    summary: 'Update coding session',
    description: 'Update session details, diagnoses, and procedures during coder review',
  })
  @ApiResponse({ status: 200, description: 'Session updated' })
  async updateSession(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: UpdateCodingSessionDto,
  ) {
    return this.medicalCodingService.updateSession(tenantId, sessionId, dto, userId);
  }

  @Post('sessions/:id/submit')
  @ApiOperation({
    summary: 'Submit coding session for claim generation',
    description: 'Changes status to completed and optionally triggers claim generation',
  })
  @ApiResponse({ status: 200, description: 'Session submitted successfully' })
  async submitSession(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: SubmitCodingSessionDto,
  ) {
    return this.medicalCodingService.submitSession(tenantId, sessionId, dto, userId);
  }

  // ========================================
  // DIAGNOSIS MANAGEMENT ENDPOINTS
  // ========================================

  @Post('sessions/:sessionId/diagnoses')
  @ApiOperation({ summary: 'Add a new diagnosis to coding session' })
  @ApiResponse({ status: 201, description: 'Diagnosis added' })
  async addDiagnosis(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateCodingDiagnosisDto,
  ) {
    return this.medicalCodingService.addDiagnosis(tenantId, sessionId, dto, userId);
  }

  @Put('diagnoses/:id')
  @ApiOperation({ summary: 'Update a diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis updated' })
  async updateDiagnosis(
    @Headers('x-user-id') userId: string,
    @Param('id') diagnosisId: string,
    @Body() dto: UpdateCodingDiagnosisDto,
  ) {
    return this.medicalCodingService.updateDiagnosis(diagnosisId, dto, userId);
  }

  @Delete('diagnoses/:id')
  @ApiOperation({ summary: 'Delete a diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis deleted' })
  async deleteDiagnosis(@Param('id') diagnosisId: string) {
    return this.medicalCodingService.deleteDiagnosis(diagnosisId);
  }

  // ========================================
  // PROCEDURE MANAGEMENT ENDPOINTS
  // ========================================

  @Post('sessions/:sessionId/procedures')
  @ApiOperation({ summary: 'Add a new procedure to coding session' })
  @ApiResponse({ status: 201, description: 'Procedure added' })
  async addProcedure(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateCodingProcedureDto,
  ) {
    return this.medicalCodingService.addProcedure(tenantId, sessionId, dto, userId);
  }

  @Put('procedures/:id')
  @ApiOperation({ summary: 'Update a procedure' })
  @ApiResponse({ status: 200, description: 'Procedure updated' })
  async updateProcedure(
    @Headers('x-user-id') userId: string,
    @Param('id') procedureId: string,
    @Body() dto: UpdateCodingProcedureDto,
  ) {
    return this.medicalCodingService.updateProcedure(procedureId, dto, userId);
  }

  @Delete('procedures/:id')
  @ApiOperation({ summary: 'Delete a procedure' })
  @ApiResponse({ status: 200, description: 'Procedure deleted' })
  async deleteProcedure(@Param('id') procedureId: string) {
    return this.medicalCodingService.deleteProcedure(procedureId);
  }

  // ========================================
  // AUDIT TRAIL ENDPOINTS
  // ========================================

  @Get('sessions/:sessionId/audit')
  @ApiOperation({
    summary: 'Get audit trail for a coding session',
    description: 'Returns all audit log entries showing changes made to the session',
  })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved' })
  async getSessionAudit(
    @Headers('x-tenant-id') tenantId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.medicalCodingService.getSessionAudit(tenantId, sessionId);
  }

  @Get('audit')
  @ApiOperation({
    summary: 'Get audit logs with filters',
    description: 'Query audit logs across all coding sessions',
  })
  @ApiQuery({ name: 'sessionId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved' })
  async getAuditLogs(
    @Headers('x-tenant-id') tenantId: string,
    @Query('sessionId') sessionId?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (sessionId) filters.sessionId = sessionId;
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    return this.medicalCodingService.getAuditLogs(tenantId, filters);
  }

  // ========================================
  // STATISTICS ENDPOINTS
  // ========================================

  @Get('statistics/coder-productivity')
  @ApiOperation({
    summary: 'Get coder productivity statistics',
    description: 'Returns metrics on sessions reviewed, avg time, etc. by coder',
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getCoderProductivity(
    @Headers('x-tenant-id') tenantId: string,
    @Query('userId') userId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    return this.medicalCodingService.getCoderProductivity(tenantId, filters);
  }

  @Get('statistics/session-summary')
  @ApiOperation({
    summary: 'Get session statistics summary',
    description: 'Returns counts by status and other aggregate metrics',
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getSessionSummary(@Headers('x-tenant-id') tenantId: string) {
    return this.medicalCodingService.getSessionSummary(tenantId);
  }
}
