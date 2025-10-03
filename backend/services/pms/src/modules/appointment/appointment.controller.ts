import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryDto,
  AppointmentSearchDto,
  CheckAvailabilityDto,
  GetAvailabilityDto,
  BulkUpdateAppointmentsDto,
  BulkCancelAppointmentsDto,
  CreateRecurringAppointmentsDto,
  AddToWaitlistDto,
} from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get()
  async getAppointments(@Query() query: AppointmentQueryDto) {
    return this.appointmentService.getAppointments(query);
  }

  @Get('search')
  async searchAppointments(@Query() searchDto: AppointmentSearchDto) {
    return this.appointmentService.searchAppointments(searchDto);
  }

  @Get('stats')
  async getAppointmentStats(@Query() query: Record<string, string>) {
    return this.appointmentService.getAppointmentStats(query);
  }

  @Get('analytics')
  async getAppointmentAnalytics(@Query() query: Record<string, string>) {
    return this.appointmentService.getAppointmentAnalytics(query);
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete(':id')
  async cancelAppointment(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.appointmentService.cancelAppointment(id, body.reason);
  }

  @Post(':id/check-in')
  async checkInAppointment(@Param('id') id: string) {
    return this.appointmentService.checkInAppointment(id);
  }

  @Post(':id/complete')
  async completeAppointment(@Param('id') id: string) {
    return this.appointmentService.completeAppointment(id);
  }

  @Post(':id/reschedule')
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body() body: { newStartTime: string; newEndTime: string; reason?: string },
  ) {
    return this.appointmentService.rescheduleAppointment(
      id,
      body.newStartTime,
      body.newEndTime,
      body.reason,
    );
  }

  // Availability management
  @Post('check-availability')
  async checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
    return this.appointmentService.checkAvailability(checkAvailabilityDto);
  }

  @Get('availability')
  async getAvailability(@Query() query: GetAvailabilityDto) {
    return this.appointmentService.getAvailability(query);
  }

  // Bulk operations
  @Put('bulk-update')
  async bulkUpdateAppointments(@Body() bulkUpdateDto: BulkUpdateAppointmentsDto) {
    return this.appointmentService.bulkUpdateAppointments(bulkUpdateDto);
  }

  @Post('bulk-cancel')
  async bulkCancelAppointments(@Body() bulkCancelDto: BulkCancelAppointmentsDto) {
    return this.appointmentService.bulkCancelAppointments(bulkCancelDto);
  }

  // Recurring appointments
  @Post('recurring')
  async createRecurringAppointments(@Body() recurringDto: CreateRecurringAppointmentsDto) {
    return this.appointmentService.createRecurringAppointments(recurringDto);
  }

  @Delete('recurring/:seriesId')
  async cancelRecurringAppointments(
    @Param('seriesId') seriesId: string,
    @Body() body: { reason: string; cancelFutureOnly?: boolean },
  ) {
    return this.appointmentService.cancelRecurringAppointments(
      seriesId,
      body.reason,
      body.cancelFutureOnly,
    );
  }

  // Waitlist management
  @Post('waitlist')
  async addToWaitlist(@Body() waitlistDto: AddToWaitlistDto) {
    return this.appointmentService.addToWaitlist(waitlistDto);
  }

  @Get('waitlist')
  async getWaitlist(@Query() query: Record<string, string>) {
    return this.appointmentService.getWaitlist(query);
  }

  @Put('waitlist/:id')
  async updateWaitlistItem(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.appointmentService.updateWaitlistItem(id, body);
  }

  @Delete('waitlist/:id')
  async removeFromWaitlist(@Param('id') id: string) {
    return this.appointmentService.removeFromWaitlist(id);
  }

  // Calendar views
  @Get('calendar/day/:date')
  async getDayView(@Param('date') date: string, @Query() query: Record<string, string>) {
    return this.appointmentService.getDayView(date, query);
  }

  @Get('calendar/week/:week')
  async getWeekView(@Param('week') week: string, @Query() query: Record<string, string>) {
    return this.appointmentService.getWeekView(week, query);
  }

  @Get('calendar/month/:month')
  async getMonthView(@Param('month') month: string, @Query() query: Record<string, string>) {
    return this.appointmentService.getMonthView(month, query);
  }

  // Resource utilization
  @Get('utilization/staff/:staffId')
  async getStaffUtilization(
    @Param('staffId') staffId: string,
    @Query() query: Record<string, string>,
  ) {
    return this.appointmentService.getStaffUtilization(staffId, query);
  }

  @Get('utilization/space/:spaceId')
  async getSpaceUtilization(
    @Param('spaceId') spaceId: string,
    @Query() query: Record<string, string>,
  ) {
    return this.appointmentService.getSpaceUtilization(spaceId, query);
  }

  @Get('utilization/facility/:facilityId')
  async getFacilityUtilization(
    @Param('facilityId') facilityId: string,
    @Query() query: Record<string, string>,
  ) {
    return this.appointmentService.getFacilityUtilization(facilityId, query);
  }

  // Conflicts and overlaps
  @Get('conflicts')
  async getConflicts(@Query() query: Record<string, string>) {
    return this.appointmentService.getConflicts(query);
  }

  @Get(':id/conflicts')
  async getAppointmentConflicts(@Param('id') id: string) {
    return this.appointmentService.getAppointmentConflicts(id);
  }

  // Templates
  @Get('templates')
  async getAppointmentTemplates(@Query() query: Record<string, string>) {
    return this.appointmentService.getAppointmentTemplates(query);
  }

  @Post('templates')
  async createAppointmentTemplate(@Body() templateDto: any) {
    return this.appointmentService.createAppointmentTemplate(templateDto);
  }

  // Notifications and reminders
  @Post(':id/send-reminder')
  async sendReminder(@Param('id') id: string, @Body() body: { method: string }) {
    return this.appointmentService.sendReminder(id, body.method);
  }

  @Post('send-bulk-reminders')
  async sendBulkReminders(@Body() body: { appointmentIds: string[]; method: string }) {
    return this.appointmentService.sendBulkReminders(body.appointmentIds, body.method);
  }
}

