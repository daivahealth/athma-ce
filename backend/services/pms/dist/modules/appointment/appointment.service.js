var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto, BulkUpdateAppointmentsDto, BulkCancelAppointmentsDto, CreateRecurringAppointmentsDto, AddToWaitlistDto, } from './dto/appointment.dto';
let AppointmentService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppointmentService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppointmentService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        appointmentRepository;
        constructor(appointmentRepository) {
            this.appointmentRepository = appointmentRepository;
        }
        async createAppointment(createAppointmentDto) {
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
        async getAppointments(query) {
            return this.appointmentRepository.findMany(query);
        }
        async searchAppointments(searchDto) {
            return this.appointmentRepository.search(searchDto);
        }
        async getAppointmentById(id) {
            const appointment = await this.appointmentRepository.findByIdWithDetails(id);
            if (!appointment) {
                throw new NotFoundException('Appointment not found');
            }
            return appointment;
        }
        async updateAppointment(id, updateAppointmentDto) {
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
        async cancelAppointment(id, reason) {
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
        async checkInAppointment(id) {
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
        async completeAppointment(id) {
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
        async rescheduleAppointment(id, newStartTime, newEndTime, reason) {
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
        async checkAvailability(checkAvailabilityDto) {
            return this.appointmentRepository.checkAvailability(checkAvailabilityDto);
        }
        async getAvailability(query) {
            return this.appointmentRepository.getAvailability(query);
        }
        async bulkUpdateAppointments(bulkUpdateDto) {
            const results = [];
            const errors = [];
            for (const appointmentId of bulkUpdateDto.appointmentIds) {
                try {
                    const result = await this.updateAppointment(appointmentId, bulkUpdateDto.updates);
                    results.push(result);
                }
                catch (error) {
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
        async bulkCancelAppointments(bulkCancelDto) {
            const results = [];
            const errors = [];
            for (const appointmentId of bulkCancelDto.appointmentIds) {
                try {
                    const result = await this.cancelAppointment(appointmentId, bulkCancelDto.reason);
                    results.push(result);
                }
                catch (error) {
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
        async createRecurringAppointments(recurringDto) {
            const appointments = [];
            const errors = [];
            const seriesId = this.generateSeriesId();
            const baseAppointment = { ...recurringDto.baseAppointment, seriesId };
            // Generate recurring appointments based on pattern
            const dates = this.generateRecurringDates(recurringDto.baseAppointment.startTime, recurringDto.recurringPattern);
            for (const date of dates) {
                try {
                    const appointmentData = {
                        ...baseAppointment,
                        startTime: this.adjustTimeForDate(baseAppointment.startTime, date),
                        endTime: this.adjustTimeForDate(baseAppointment.endTime, date),
                    };
                    const appointment = await this.createAppointment(appointmentData);
                    appointments.push(appointment);
                }
                catch (error) {
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
        async cancelRecurringAppointments(seriesId, reason, cancelFutureOnly = false) {
            return this.appointmentRepository.cancelRecurringAppointments(seriesId, reason, cancelFutureOnly);
        }
        async addToWaitlist(waitlistDto) {
            return this.appointmentRepository.addToWaitlist(waitlistDto);
        }
        async getWaitlist(query) {
            return this.appointmentRepository.getWaitlist(query);
        }
        async updateWaitlistItem(id, updates) {
            return this.appointmentRepository.updateWaitlistItem(id, updates);
        }
        async removeFromWaitlist(id) {
            return this.appointmentRepository.removeFromWaitlist(id);
        }
        async getDayView(date, query) {
            return this.appointmentRepository.getDayView(date, query);
        }
        async getWeekView(week, query) {
            return this.appointmentRepository.getWeekView(week, query);
        }
        async getMonthView(month, query) {
            return this.appointmentRepository.getMonthView(month, query);
        }
        async getStaffUtilization(staffId, query) {
            return this.appointmentRepository.getStaffUtilization(staffId, query);
        }
        async getSpaceUtilization(spaceId, query) {
            return this.appointmentRepository.getSpaceUtilization(spaceId, query);
        }
        async getFacilityUtilization(facilityId, query) {
            return this.appointmentRepository.getFacilityUtilization(facilityId, query);
        }
        async getConflicts(query) {
            return this.appointmentRepository.getConflicts(query);
        }
        async getAppointmentConflicts(id) {
            return this.appointmentRepository.getAppointmentConflicts(id);
        }
        async getAppointmentTemplates(query) {
            return this.appointmentRepository.getAppointmentTemplates(query);
        }
        async createAppointmentTemplate(templateDto) {
            return this.appointmentRepository.createAppointmentTemplate(templateDto);
        }
        async sendReminder(appointmentId, method) {
            const appointment = await this.getAppointmentById(appointmentId);
            return this.sendReminderNotification(appointment, method);
        }
        async sendBulkReminders(appointmentIds, method) {
            const results = [];
            const errors = [];
            for (const appointmentId of appointmentIds) {
                try {
                    const result = await this.sendReminder(appointmentId, method);
                    results.push(result);
                }
                catch (error) {
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
        async getAppointmentStats(query) {
            return this.appointmentRepository.getAppointmentStats(query);
        }
        async getAppointmentAnalytics(query) {
            return this.appointmentRepository.getAppointmentAnalytics(query);
        }
        validateAppointmentData(data) {
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
        async scheduleReminders(appointmentId, reminders) {
            // Implementation for scheduling reminders
            // This would integrate with the notification service
            console.log('Scheduling reminders for appointment:', appointmentId, reminders);
        }
        async sendCancellationNotifications(appointment) {
            // Implementation for sending cancellation notifications
            console.log('Sending cancellation notifications for appointment:', appointment.id);
        }
        async sendRescheduleNotifications(appointment, newStartTime, newEndTime) {
            // Implementation for sending reschedule notifications
            console.log('Sending reschedule notifications for appointment:', appointment.id);
        }
        async sendReminderNotification(appointment, method) {
            // Implementation for sending reminder notifications
            console.log('Sending reminder notification for appointment:', appointment.id, 'method:', method);
            return { success: true, method, appointmentId: appointment.id };
        }
        generateSeriesId() {
            return `series_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        generateRecurringDates(startTime, pattern) {
            const dates = [];
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
        adjustTimeForDate(originalTime, newDate) {
            const originalDateTime = new Date(originalTime);
            const newDateTime = new Date(newDate);
            newDateTime.setHours(originalDateTime.getHours());
            newDateTime.setMinutes(originalDateTime.getMinutes());
            newDateTime.setSeconds(originalDateTime.getSeconds());
            return newDateTime.toISOString();
        }
    };
    return AppointmentService = _classThis;
})();
export { AppointmentService };
//# sourceMappingURL=appointment.service.js.map