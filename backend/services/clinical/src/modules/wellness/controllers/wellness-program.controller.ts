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
import { WellnessProgramService } from '../services/wellness-program.service';
import {
  CreateWellnessProgramTemplateDto,
  UpdateWellnessProgramTemplateDto,
  EnrollInProgramDto,
  UpdateEnrollmentDto,
  ScheduleSessionDto,
  UpdateSessionDto,
  CompleteMilestoneDto,
  WellnessProgramTemplateResponseDto,
  WellnessProgramEnrollmentResponseDto,
  WellnessProgramSessionResponseDto,
  WellnessProgramMilestoneResponseDto,
  WellnessProgramStatus,
} from '../dto/wellness-program.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Wellness Programs')
@ApiBearerAuth()
@Controller('wellness/programs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WellnessProgramController {
  constructor(private readonly programService: WellnessProgramService) {}

  // ============================================
  // Template Endpoints
  // ============================================

  @Post('templates')
  @ApiOperation({ summary: 'Create a wellness program template' })
  @ApiResponse({ status: 201, type: WellnessProgramTemplateResponseDto })
  async createTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateWellnessProgramTemplateDto,
  ) {
    return this.programService.createTemplate(tenantId, userId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List all wellness program templates' })
  @ApiQuery({ name: 'programType', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [WellnessProgramTemplateResponseDto] })
  async findAllTemplates(
    @Headers('x-tenant-id') tenantId: string,
    @Query('programType') programType?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options: { programType?: string; isActive?: boolean } = {};
    if (programType !== undefined) options.programType = programType;
    if (isActive !== undefined) options.isActive = isActive === 'true';
    return this.programService.findAllTemplates(tenantId, options);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a wellness program template by ID' })
  @ApiResponse({ status: 200, type: WellnessProgramTemplateResponseDto })
  async findTemplateById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.programService.findTemplateById(tenantId, id);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update a wellness program template' })
  @ApiResponse({ status: 200, type: WellnessProgramTemplateResponseDto })
  async updateTemplate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWellnessProgramTemplateDto,
  ) {
    return this.programService.updateTemplate(tenantId, id, dto);
  }

  // ============================================
  // Enrollment Endpoints
  // ============================================

  @Post('enrollments')
  @ApiOperation({ summary: 'Enroll a patient in a wellness program' })
  @ApiResponse({ status: 201, type: WellnessProgramEnrollmentResponseDto })
  async enrollPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: EnrollInProgramDto,
  ) {
    return this.programService.enrollPatient(tenantId, userId, dto);
  }

  @Get('enrollments/:id')
  @ApiOperation({ summary: 'Get an enrollment by ID' })
  @ApiResponse({ status: 200, type: WellnessProgramEnrollmentResponseDto })
  async findEnrollmentById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.programService.findEnrollmentById(tenantId, id);
  }

  @Get('enrollments/patient/:patientId')
  @ApiOperation({ summary: 'Get enrollments for a patient' })
  @ApiQuery({ name: 'status', required: false, enum: WellnessProgramStatus })
  @ApiResponse({ status: 200, type: [WellnessProgramEnrollmentResponseDto] })
  async findEnrollmentsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: WellnessProgramStatus,
  ) {
    const options: { status?: WellnessProgramStatus } = {};
    if (status !== undefined) options.status = status;
    return this.programService.findEnrollmentsByPatient(tenantId, patientId, options);
  }

  @Patch('enrollments/:id')
  @ApiOperation({ summary: 'Update an enrollment' })
  @ApiResponse({ status: 200, type: WellnessProgramEnrollmentResponseDto })
  async updateEnrollment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.programService.updateEnrollment(tenantId, id, dto);
  }

  @Post('enrollments/:id/activate')
  @ApiOperation({ summary: 'Activate an enrollment' })
  @ApiResponse({ status: 200, type: WellnessProgramEnrollmentResponseDto })
  async activateEnrollment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.programService.activateEnrollment(tenantId, id);
  }

  @Post('enrollments/:id/pause')
  @ApiOperation({ summary: 'Pause an enrollment' })
  @ApiResponse({ status: 200, type: WellnessProgramEnrollmentResponseDto })
  async pauseEnrollment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.programService.pauseEnrollment(tenantId, id);
  }

  @Post('enrollments/:id/cancel')
  @ApiOperation({ summary: 'Cancel an enrollment' })
  @ApiResponse({ status: 200, type: WellnessProgramEnrollmentResponseDto })
  async cancelEnrollment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.programService.cancelEnrollment(tenantId, id, body.reason);
  }

  // ============================================
  // Session Endpoints
  // ============================================

  @Post('enrollments/:enrollmentId/sessions')
  @ApiOperation({ summary: 'Schedule a session for an enrollment' })
  @ApiResponse({ status: 201, type: WellnessProgramSessionResponseDto })
  async scheduleSession(
    @Headers('x-tenant-id') tenantId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: ScheduleSessionDto,
  ) {
    return this.programService.scheduleSession(tenantId, enrollmentId, dto);
  }

  @Patch('enrollments/:enrollmentId/sessions/:sessionId')
  @ApiOperation({ summary: 'Update a session' })
  @ApiResponse({ status: 200, type: WellnessProgramSessionResponseDto })
  async updateSession(
    @Headers('x-tenant-id') tenantId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.programService.updateSession(tenantId, enrollmentId, sessionId, dto);
  }

  @Post('enrollments/:enrollmentId/sessions/:sessionId/complete')
  @ApiOperation({ summary: 'Complete a session' })
  @ApiResponse({ status: 200, type: WellnessProgramSessionResponseDto })
  async completeSession(
    @Headers('x-tenant-id') tenantId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.programService.completeSession(tenantId, enrollmentId, sessionId, dto);
  }

  // ============================================
  // Milestone Endpoints
  // ============================================

  @Post('enrollments/:enrollmentId/milestones/:milestoneId/complete')
  @ApiOperation({ summary: 'Complete a milestone' })
  @ApiResponse({ status: 200, type: WellnessProgramMilestoneResponseDto })
  async completeMilestone(
    @Headers('x-tenant-id') tenantId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: CompleteMilestoneDto,
  ) {
    return this.programService.completeMilestone(tenantId, enrollmentId, milestoneId, dto);
  }
}
