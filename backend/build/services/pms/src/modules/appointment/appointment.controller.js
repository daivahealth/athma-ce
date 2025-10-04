var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Body, Param, Query, } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto, BulkUpdateAppointmentsDto, BulkCancelAppointmentsDto, CreateRecurringAppointmentsDto, AddToWaitlistDto, } from './dto/appointment.dto';
let AppointmentController = class AppointmentController {
    appointmentService;
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    async createAppointment(createAppointmentDto) {
        return this.appointmentService.createAppointment(createAppointmentDto);
    }
    async getAppointments(query) {
        return this.appointmentService.getAppointments(query);
    }
    async searchAppointments(searchDto) {
        return this.appointmentService.searchAppointments(searchDto);
    }
    async getAppointmentStats(query) {
        return this.appointmentService.getAppointmentStats(query);
    }
    async getAppointmentAnalytics(query) {
        return this.appointmentService.getAppointmentAnalytics(query);
    }
    async getAppointment(id) {
        return this.appointmentService.getAppointmentById(id);
    }
    async updateAppointment(id, updateAppointmentDto) {
        return this.appointmentService.updateAppointment(id, updateAppointmentDto);
    }
    async cancelAppointment(id, body) {
        return this.appointmentService.cancelAppointment(id, body.reason);
    }
    async checkInAppointment(id) {
        return this.appointmentService.checkInAppointment(id);
    }
    async completeAppointment(id) {
        return this.appointmentService.completeAppointment(id);
    }
    async rescheduleAppointment(id, body) {
        return this.appointmentService.rescheduleAppointment(id, body.newStartTime, body.newEndTime, body.reason);
    }
    // Availability management
    async checkAvailability(checkAvailabilityDto) {
        return this.appointmentService.checkAvailability(checkAvailabilityDto);
    }
    async getAvailability(query) {
        return this.appointmentService.getAvailability(query);
    }
    // Bulk operations
    async bulkUpdateAppointments(bulkUpdateDto) {
        return this.appointmentService.bulkUpdateAppointments(bulkUpdateDto);
    }
    async bulkCancelAppointments(bulkCancelDto) {
        return this.appointmentService.bulkCancelAppointments(bulkCancelDto);
    }
    // Recurring appointments
    async createRecurringAppointments(recurringDto) {
        return this.appointmentService.createRecurringAppointments(recurringDto);
    }
    async cancelRecurringAppointments(seriesId, body) {
        return this.appointmentService.cancelRecurringAppointments(seriesId, body.reason, body.cancelFutureOnly);
    }
    // Waitlist management
    async addToWaitlist(waitlistDto) {
        return this.appointmentService.addToWaitlist(waitlistDto);
    }
    async getWaitlist(query) {
        return this.appointmentService.getWaitlist(query);
    }
    async updateWaitlistItem(id, body) {
        return this.appointmentService.updateWaitlistItem(id, body);
    }
    async removeFromWaitlist(id) {
        return this.appointmentService.removeFromWaitlist(id);
    }
    // Calendar views
    async getDayView(date, query) {
        return this.appointmentService.getDayView(date, query);
    }
    async getWeekView(week, query) {
        return this.appointmentService.getWeekView(week, query);
    }
    async getMonthView(month, query) {
        return this.appointmentService.getMonthView(month, query);
    }
    // Resource utilization
    async getStaffUtilization(staffId, query) {
        return this.appointmentService.getStaffUtilization(staffId, query);
    }
    async getSpaceUtilization(spaceId, query) {
        return this.appointmentService.getSpaceUtilization(spaceId, query);
    }
    async getFacilityUtilization(facilityId, query) {
        return this.appointmentService.getFacilityUtilization(facilityId, query);
    }
    // Conflicts and overlaps
    async getConflicts(query) {
        return this.appointmentService.getConflicts(query);
    }
    async getAppointmentConflicts(id) {
        return this.appointmentService.getAppointmentConflicts(id);
    }
    // Templates
    async getAppointmentTemplates(query) {
        return this.appointmentService.getAppointmentTemplates(query);
    }
    async createAppointmentTemplate(templateDto) {
        return this.appointmentService.createAppointmentTemplate(templateDto);
    }
    // Notifications and reminders
    async sendReminder(id, body) {
        return this.appointmentService.sendReminder(id, body.method);
    }
    async sendBulkReminders(body) {
        return this.appointmentService.sendBulkReminders(body.appointmentIds, body.method);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createAppointment", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointments", null);
__decorate([
    Get('search'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "searchAppointments", null);
__decorate([
    Get('stats'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentStats", null);
__decorate([
    Get('analytics'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentAnalytics", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointment", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateAppointment", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelAppointment", null);
__decorate([
    Post(':id/check-in'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "checkInAppointment", null);
__decorate([
    Post(':id/complete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "completeAppointment", null);
__decorate([
    Post(':id/reschedule'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "rescheduleAppointment", null);
__decorate([
    Post('check-availability'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "checkAvailability", null);
__decorate([
    Get('availability'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAvailability", null);
__decorate([
    Put('bulk-update'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "bulkUpdateAppointments", null);
__decorate([
    Post('bulk-cancel'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "bulkCancelAppointments", null);
__decorate([
    Post('recurring'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createRecurringAppointments", null);
__decorate([
    Delete('recurring/:seriesId'),
    __param(0, Param('seriesId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelRecurringAppointments", null);
__decorate([
    Post('waitlist'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "addToWaitlist", null);
__decorate([
    Get('waitlist'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getWaitlist", null);
__decorate([
    Put('waitlist/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateWaitlistItem", null);
__decorate([
    Delete('waitlist/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "removeFromWaitlist", null);
__decorate([
    Get('calendar/day/:date'),
    __param(0, Param('date')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getDayView", null);
__decorate([
    Get('calendar/week/:week'),
    __param(0, Param('week')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getWeekView", null);
__decorate([
    Get('calendar/month/:month'),
    __param(0, Param('month')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getMonthView", null);
__decorate([
    Get('utilization/staff/:staffId'),
    __param(0, Param('staffId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getStaffUtilization", null);
__decorate([
    Get('utilization/space/:spaceId'),
    __param(0, Param('spaceId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getSpaceUtilization", null);
__decorate([
    Get('utilization/facility/:facilityId'),
    __param(0, Param('facilityId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getFacilityUtilization", null);
__decorate([
    Get('conflicts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getConflicts", null);
__decorate([
    Get(':id/conflicts'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentConflicts", null);
__decorate([
    Get('templates'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentTemplates", null);
__decorate([
    Post('templates'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createAppointmentTemplate", null);
__decorate([
    Post(':id/send-reminder'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "sendReminder", null);
__decorate([
    Post('send-bulk-reminders'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "sendBulkReminders", null);
AppointmentController = __decorate([
    Controller('appointments'),
    __metadata("design:paramtypes", [AppointmentService])
], AppointmentController);
export { AppointmentController };
//# sourceMappingURL=appointment.controller.js.map