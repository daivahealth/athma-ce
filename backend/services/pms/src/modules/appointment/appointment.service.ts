import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
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

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<any> {
    // Validate appointment data
    this.validateAppointmentData(createAppointmentDto);

    // Check for conflicts
    const conflicts = await this.appointmentRepository.checkConflicts(createAppointmentDto);
    if (conflicts.length > 0) {
      throw new ConflictException('Appointment conflicts detected', conflicts);
    }

    // Create appointment
    const appointment = await this.appointmentRepository.create(createAppointmentDto);

    // Schedule reminders if configured
    if (createAppointmentDto.reminders) {
      await this.scheduleReminders(appointment.id, createAppointmentDto.reminders);
    }

    return this.appointmentRepository.findByIdWithDetails(appointment.id);
  }

  async getAppointments(query: AppointmentQueryDto): Promise<any> {
    return this.appointmentRepository.findMany(query);
  }

  async searchAppointments(searchDto: AppointmentSearchDto): Promise<any[]> {
    return this.appointmentRepository.search(searchDto);
  }

  async getAppointmentById(id: string): Promise<any> {
    const appointment = await this.appointmentRepository.findByIdWithDetails(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> {
    const existingAppointment = await this.appointmentRepository.findById(id);
    if (!existingAppointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check for conflicts if time is being changed
    if (updateAppointmentDto.startTime || updateAppointmentDto.endTime) {
      const conflictData = {
        ...existingAppointment,
        ...updateAppointmentDto,
      };
      const conflicts = await this.appointmentRepository.checkConflicts(conflictData, id);
      if (conflicts.length > 0) {
        throw new ConflictException('Appointment conflicts detected', conflicts);
      }
    }

    await this.appointmentRepository.update(id, updateAppointmentDto);
    return this.appointmentRepository.findByIdWithDetails(id);
  }

  async cancelAppointment(id: string, reason: string): Promise<any> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    await this.appointmentRepository.update(id, {
      status: 'cancelled',
      cancellationReason: reason,
    });

    // Send cancellation notifications
    await this.sendCancellationNotifications(appointment);

    return this.appointmentRepository.findByIdWithDetails(id);
  }

  async checkInAppointment(id: string): Promise<any> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'confirmed') {
      throw new BadRequestException('Appointment must be confirmed to check in');
    }

    await this.appointmentRepository.update(id, {
      status: 'checked_in',
    });

    return this.appointmentRepository.findByIdWithDetails(id);
  }

  async completeAppointment(id: string): Promise<any> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (!['checked_in', 'in_progress'].includes(appointment.status)) {
      throw new BadRequestException('Appointment must be checked in or in progress to complete');
    }

    await this.appointmentRepository.update(id, {
      status: 'completed',
      endTime: new Date(),
    });

    return this.appointmentRepository.findByIdWithDetails(id);
  }

  async rescheduleAppointment(id: string, newStartTime: string, newEndTime: string, reason?: string): Promise<any> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'completed') {
      throw new BadRequestException('Cannot reschedule completed appointment');
    }

    // Check for conflicts with new time
    const conflictData = {
      ...appointment,
      startTime: newStartTime,
      endTime: newEndTime,
    };
    const conflicts = await this.appointmentRepository.checkConflicts(conflictData, id);
    if (conflicts.length > 0) {
      throw new ConflictException('New time conflicts with existing appointments', conflicts);
    }

    await this.appointmentRepository.update(id, {
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'rescheduled',
      rescheduleReason: reason,
    });

    // Send reschedule notifications
    await this.sendRescheduleNotifications(appointment, newStartTime, newEndTime);

    return this.appointmentRepository.findByIdWithDetails(id);
  }

  async checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<any> {
    return this.appointmentRepository.checkAvailability(checkAvailabilityDto);
  }

  async getAvailability(query: GetAvailabilityDto): Promise<any> {
    return this.appointmentRepository.getAvailability(query);
  }

  async bulkUpdateAppointments(bulkUpdateDto: BulkUpdateAppointmentsDto): Promise<any> {
    const results = [];
    const errors = [];

    for (const appointmentId of bulkUpdateDto.appointmentIds) {
      try {
        const result = await this.updateAppointment(appointmentId, bulkUpdateDto.updates);
        results.push(result);
      } catch (error) {
        errors.push({ appointmentId, error: error.message });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  async bulkCancelAppointments(bulkCancelDto: BulkCancelAppointmentsDto): Promise<any> {
    const results = [];
    const errors = [];

    for (const appointmentId of bulkCancelDto.appointmentIds) {
      try {
        const result = await this.cancelAppointment(appointmentId, bulkCancelDto.reason);
        results.push(result);
      } catch (error) {
        errors.push({ appointmentId, error: error.message });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  async createRecurringAppointments(recurringDto: CreateRecurringAppointmentsDto): Promise<any> {
    const appointments = [];
    const errors = [];

    const seriesId = this.generateSeriesId();
    const baseAppointment = { ...recurringDto.baseAppointment, seriesId };

    // Generate recurring appointments based on pattern
    const dates = this.generateRecurringDates(
      recurringDto.baseAppointment.startTime,
      recurringDto.recurringPattern,
    );

    for (const date of dates) {
      try {
        const appointmentData = {
          ...baseAppointment,
          startTime: this.adjustTimeForDate(baseAppointment.startTime, date),
          endTime: this.adjustTimeForDate(baseAppointment.endTime, date),
        };

        const appointment = await this.createAppointment(appointmentData);
        appointments.push(appointment);
      } catch (error) {
        errors.push({ date, error: error.message });
      }
    }

    return {
      seriesId,
      created: appointments.length,
      failed: errors.length,
      appointments,
      errors,
    };
  }

  async cancelRecurringAppointments(seriesId: string, reason: string, cancelFutureOnly: boolean = false): Promise<any> {
    return this.appointmentRepository.cancelRecurringAppointments(seriesId, reason, cancelFutureOnly);
  }

  async addToWaitlist(waitlistDto: AddToWaitlistDto): Promise<any> {
    return this.appointmentRepository.addToWaitlist(waitlistDto);
  }

  async getWaitlist(query: any): Promise<any> {
    return this.appointmentRepository.getWaitlist(query);
  }

  async updateWaitlistItem(id: string, updates: any): Promise<any> {
    return this.appointmentRepository.updateWaitlistItem(id, updates);
  }

  async removeFromWaitlist(id: string): Promise<any> {
    return this.appointmentRepository.removeFromWaitlist(id);
  }

  async getDayView(date: string, query: any): Promise<any> {
    return this.appointmentRepository.getDayView(date, query);
  }

  async getWeekView(week: string, query: any): Promise<any> {
    return this.appointmentRepository.getWeekView(week, query);
  }

  async getMonthView(month: string, query: any): Promise<any> {
    return this.appointmentRepository.getMonthView(month, query);
  }

  async getStaffUtilization(staffId: string, query: any): Promise<any> {
    return this.appointmentRepository.getStaffUtilization(staffId, query);
  }

  async getSpaceUtilization(spaceId: string, query: any): Promise<any> {
    return this.appointmentRepository.getSpaceUtilization(spaceId, query);
  }

  async getFacilityUtilization(facilityId: string, query: any): Promise<any> {
    return this.appointmentRepository.getFacilityUtilization(facilityId, query);
  }

  async getConflicts(query: any): Promise<any> {
    return this.appointmentRepository.getConflicts(query);
  }

  async getAppointmentConflicts(id: string): Promise<any> {
    return this.appointmentRepository.getAppointmentConflicts(id);
  }

  async getAppointmentTemplates(query: any): Promise<any> {
    return this.appointmentRepository.getAppointmentTemplates(query);
  }

  async createAppointmentTemplate(templateDto: any): Promise<any> {
    return this.appointmentRepository.createAppointmentTemplate(templateDto);
  }

  async sendReminder(appointmentId: string, method: string): Promise<any> {
    const appointment = await this.getAppointmentById(appointmentId);
    return this.sendReminderNotification(appointment, method);
  }

  async sendBulkReminders(appointmentIds: string[], method: string): Promise<any> {
    const results = [];
    const errors = [];

    for (const appointmentId of appointmentIds) {
      try {
        const result = await this.sendReminder(appointmentId, method);
        results.push(result);
      } catch (error) {
        errors.push({ appointmentId, error: error.message });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  async getAppointmentStats(query: any): Promise<any> {
    return this.appointmentRepository.getAppointmentStats(query);
  }

  async getAppointmentAnalytics(query: any): Promise<any> {
    return this.appointmentRepository.getAppointmentAnalytics(query);
  }

  private validateAppointmentData(data: CreateAppointmentDto): void {
    if (new Date(data.startTime) >= new Date(data.endTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    const duration = new Date(data.endTime).getTime() - new Date(data.startTime).getTime();
    const durationMinutes = duration / (1000 * 60);

    if (durationMinutes !== data.duration) {
      throw new BadRequestException('Duration does not match start and end times');
    }

    if (new Date(data.startTime) < new Date()) {
      throw new BadRequestException('Cannot schedule appointment in the past');
    }
  }

  private async scheduleReminders(appointmentId: string, reminders: any): Promise<void> {
    // Implementation for scheduling reminders
    // This would integrate with the notification service
    console.log('Scheduling reminders for appointment:', appointmentId, reminders);
  }

  private async sendCancellationNotifications(appointment: any): Promise<void> {
    // Implementation for sending cancellation notifications
    console.log('Sending cancellation notifications for appointment:', appointment.id);
  }

  private async sendRescheduleNotifications(appointment: any, newStartTime: string, newEndTime: string): Promise<void> {
    // Implementation for sending reschedule notifications
    console.log('Sending reschedule notifications for appointment:', appointment.id);
  }

  private async sendReminderNotification(appointment: any, method: string): Promise<any> {
    // Implementation for sending reminder notifications
    console.log('Sending reminder notification for appointment:', appointment.id, 'method:', method);
    return { success: true, method, appointmentId: appointment.id };
  }

  private generateSeriesId(): string {
    return `series_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRecurringDates(startTime: string, pattern: any): Date[] {
    const dates: Date[] = [];
    const startDate = new Date(startTime);
    const { frequency, interval, endDate, occurrences } = pattern;

    let currentDate = new Date(startDate);
    let count = 0;
    const maxOccurrences = occurrences || 52; // Default to 1 year of weekly appointments

    while (count < maxOccurrences) {
      if (endDate && currentDate > new Date(endDate)) {
        break;
      }

      dates.push(new Date(currentDate));

      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * interval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }

      count++;
    }

    return dates;
  }

  private adjustTimeForDate(originalTime: string, newDate: Date): string {
    const originalDateTime = new Date(originalTime);
    const newDateTime = new Date(newDate);
    
    newDateTime.setHours(originalDateTime.getHours());
    newDateTime.setMinutes(originalDateTime.getMinutes());
    newDateTime.setSeconds(originalDateTime.getSeconds());
    
    return newDateTime.toISOString();
  }
}





