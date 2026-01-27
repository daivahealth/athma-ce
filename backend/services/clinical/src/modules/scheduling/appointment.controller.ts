/**
 * Appointment Controller
 *
 * REST API endpoints for booking and managing appointments
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  BookAppointmentDto,
  AllocateResourceDto,
  RescheduleAppointmentDto,
  CancelAppointmentDto,
  CreateAppointmentSeriesDto,
  CancelAppointmentSeriesDto,
  GetPatientAppointmentsDto,
  GetFacilityAppointmentsDto,
} from './dto/appointment.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  APPOINTMENT_READ,
  APPOINTMENT_CREATE,
  APPOINTMENT_UPDATE,
  APPOINTMENT_CANCEL,
  APPOINTMENT_RESCHEDULE,
} from '@zeal/contracts';

@Controller('scheduling/appointments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  private getContext(req: any) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    return req.context;
  }

  // ========================================
  // APPOINTMENT BOOKING & MANAGEMENT
  // ========================================

  /**
   * POST /scheduling/appointments - Book a new appointment
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(APPOINTMENT_CREATE)
  async bookAppointment(
    @Body() dto: BookAppointmentDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.bookAppointment(dto, context);
  }

  /**
   * GET /scheduling/appointments/:id - Get appointment with resources
   */
  @Get(':id')
  @Permissions(APPOINTMENT_READ)
  async getAppointmentWithResources(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.getAppointmentWithResources(id, context);
  }

  /**
   * PUT /scheduling/appointments/:id/reschedule - Reschedule appointment
   */
  @Put(':id/reschedule')
  @Permissions(APPOINTMENT_RESCHEDULE)
  async rescheduleAppointment(
    @Param('id') appointmentId: string,
    @Body() dto: RescheduleAppointmentDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.rescheduleAppointment(
      {
        appointmentId,
        ...dto,
      },
      context
    );
  }

  /**
   * POST /scheduling/appointments/:id/cancel - Cancel appointment
   */
  @Post(':id/cancel')
  @Permissions(APPOINTMENT_CANCEL)
  async cancelAppointment(
    @Param('id') appointmentId: string,
    @Body() dto: CancelAppointmentDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    const payload = {
      appointmentId,
      ...(dto.reason ? { reason: dto.reason } : {}),
    };

    return this.appointmentService.cancelAppointment(payload, context);
  }

  // ========================================
  // RESOURCE ALLOCATION
  // ========================================

  /**
   * POST /scheduling/appointments/resources - Allocate resource to appointment
   */
  @Post('resources')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(APPOINTMENT_UPDATE)
  async allocateResource(
    @Body() dto: AllocateResourceDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.allocateResource(dto, context);
  }

  /**
   * POST /scheduling/appointments/resources/:resourceId/confirm - Confirm resource allocation
   */
  @Post('resources/:resourceId/confirm')
  @Permissions(APPOINTMENT_UPDATE)
  async confirmResource(
    @Param('resourceId') resourceId: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.confirmResource(resourceId, context);
  }

  // ========================================
  // APPOINTMENT SERIES (RECURRING)
  // ========================================

  /**
   * POST /scheduling/appointments/series - Create recurring appointment series
   */
  @Post('series')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(APPOINTMENT_CREATE)
  async createAppointmentSeries(
    @Body() dto: CreateAppointmentSeriesDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.createAppointmentSeries(dto, context);
  }

  /**
   * GET /scheduling/appointments/series/:id - Get appointment series with all appointments
   */
  @Get('series/:id')
  @Permissions(APPOINTMENT_READ)
  async getAppointmentSeries(
    @Param('id') seriesId: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.getAppointmentSeries(seriesId, context);
  }

  /**
   * POST /scheduling/appointments/series/:id/pause - Pause appointment series
   */
  @Post('series/:id/pause')
  @Permissions(APPOINTMENT_UPDATE)
  async pauseAppointmentSeries(
    @Param('id') seriesId: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.pauseAppointmentSeries(seriesId, context);
  }

  /**
   * POST /scheduling/appointments/series/:id/resume - Resume appointment series
   */
  @Post('series/:id/resume')
  @Permissions(APPOINTMENT_UPDATE)
  async resumeAppointmentSeries(
    @Param('id') seriesId: string,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.resumeAppointmentSeries(seriesId, context);
  }

  /**
   * POST /scheduling/appointments/series/:id/cancel - Cancel entire appointment series
   */
  @Post('series/:id/cancel')
  @Permissions(APPOINTMENT_CANCEL)
  async cancelAppointmentSeries(
    @Param('id') seriesId: string,
    @Body() dto: CancelAppointmentSeriesDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);
    return this.appointmentService.cancelAppointmentSeries(
      seriesId,
      dto.reason,
      context
    );
  }

  // ========================================
  // QUERY ENDPOINTS
  // ========================================

  /**
   * GET /scheduling/appointments/patients/:patientId - Get patient appointments
   */
  @Get('patients/:patientId')
  @Permissions(APPOINTMENT_READ)
  async getPatientAppointments(
    @Param('patientId') patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('includeResources') includeResources?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: GetPatientAppointmentsDto = {};
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    if (endDate) {
      filters.endDate = new Date(endDate);
    }
    if (status) {
      filters.status = status;
    }
    if (includeResources !== undefined) {
      filters.includeResources = includeResources === 'true';
    }

    return this.appointmentService.getPatientAppointments(patientId, context, filters);
  }

  /**
   * GET /scheduling/appointments/facilities/:facilityId - Get facility appointments
   */
  @Get('facilities/:facilityId')
  @Permissions(APPOINTMENT_READ)
  async getFacilityAppointments(
    @Param('facilityId') facilityId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status?: string,
    @Query('includeResources') includeResources?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: { facilityId?: string; status?: string; includeResources?: boolean } = {
      facilityId,
    };

    if (status) {
      filters.status = status;
    }
    if (includeResources !== undefined) {
      filters.includeResources = includeResources === 'true';
    }

    return this.appointmentService.getFacilityAppointments(
      new Date(startDate),
      new Date(endDate),
      context,
      filters
    );
  }

  /**
   * GET /scheduling/appointments/facility/current - Get appointments for current facility
   * Convenience endpoint that uses the user's facility from context
   */
  @Get('facility/current')
  @Permissions(APPOINTMENT_READ)
  async getCurrentFacilityAppointments(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status?: string,
    @Query('includeResources') includeResources?: string,
    @Req() req?: any
  ) {
    const context = this.getContext(req);
    const filters: { facilityId?: string; status?: string; includeResources?: boolean } = {};

    if (status) {
      filters.status = status;
    }
    if (includeResources !== undefined) {
      filters.includeResources = includeResources === 'true';
    }

    return this.appointmentService.getFacilityAppointments(
      new Date(startDate),
      new Date(endDate),
      context,
      filters
    );
  }
}
