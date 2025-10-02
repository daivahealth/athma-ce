var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto, BulkUpdateAppointmentsDto, BulkCancelAppointmentsDto, CreateRecurringAppointmentsDto, AddToWaitlistDto, } from './dto/appointment.dto';
let AppointmentController = (() => {
    let _classDecorators = [Controller('appointments')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createAppointment_decorators;
    let _getAppointments_decorators;
    let _searchAppointments_decorators;
    let _getAppointmentStats_decorators;
    let _getAppointmentAnalytics_decorators;
    let _getAppointment_decorators;
    let _updateAppointment_decorators;
    let _cancelAppointment_decorators;
    let _checkInAppointment_decorators;
    let _completeAppointment_decorators;
    let _rescheduleAppointment_decorators;
    let _checkAvailability_decorators;
    let _getAvailability_decorators;
    let _bulkUpdateAppointments_decorators;
    let _bulkCancelAppointments_decorators;
    let _createRecurringAppointments_decorators;
    let _cancelRecurringAppointments_decorators;
    let _addToWaitlist_decorators;
    let _getWaitlist_decorators;
    let _updateWaitlistItem_decorators;
    let _removeFromWaitlist_decorators;
    let _getDayView_decorators;
    let _getWeekView_decorators;
    let _getMonthView_decorators;
    let _getStaffUtilization_decorators;
    let _getSpaceUtilization_decorators;
    let _getFacilityUtilization_decorators;
    let _getConflicts_decorators;
    let _getAppointmentConflicts_decorators;
    let _getAppointmentTemplates_decorators;
    let _createAppointmentTemplate_decorators;
    let _sendReminder_decorators;
    let _sendBulkReminders_decorators;
    var AppointmentController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createAppointment_decorators = [Post()];
            _getAppointments_decorators = [Get()];
            _searchAppointments_decorators = [Get('search')];
            _getAppointmentStats_decorators = [Get('stats')];
            _getAppointmentAnalytics_decorators = [Get('analytics')];
            _getAppointment_decorators = [Get(':id')];
            _updateAppointment_decorators = [Put(':id')];
            _cancelAppointment_decorators = [Delete(':id')];
            _checkInAppointment_decorators = [Post(':id/check-in')];
            _completeAppointment_decorators = [Post(':id/complete')];
            _rescheduleAppointment_decorators = [Post(':id/reschedule')];
            _checkAvailability_decorators = [Post('check-availability')];
            _getAvailability_decorators = [Get('availability')];
            _bulkUpdateAppointments_decorators = [Put('bulk-update')];
            _bulkCancelAppointments_decorators = [Post('bulk-cancel')];
            _createRecurringAppointments_decorators = [Post('recurring')];
            _cancelRecurringAppointments_decorators = [Delete('recurring/:seriesId')];
            _addToWaitlist_decorators = [Post('waitlist')];
            _getWaitlist_decorators = [Get('waitlist')];
            _updateWaitlistItem_decorators = [Put('waitlist/:id')];
            _removeFromWaitlist_decorators = [Delete('waitlist/:id')];
            _getDayView_decorators = [Get('calendar/day/:date')];
            _getWeekView_decorators = [Get('calendar/week/:week')];
            _getMonthView_decorators = [Get('calendar/month/:month')];
            _getStaffUtilization_decorators = [Get('utilization/staff/:staffId')];
            _getSpaceUtilization_decorators = [Get('utilization/space/:spaceId')];
            _getFacilityUtilization_decorators = [Get('utilization/facility/:facilityId')];
            _getConflicts_decorators = [Get('conflicts')];
            _getAppointmentConflicts_decorators = [Get(':id/conflicts')];
            _getAppointmentTemplates_decorators = [Get('templates')];
            _createAppointmentTemplate_decorators = [Post('templates')];
            _sendReminder_decorators = [Post(':id/send-reminder')];
            _sendBulkReminders_decorators = [Post('send-bulk-reminders')];
            __esDecorate(this, null, _createAppointment_decorators, { kind: "method", name: "createAppointment", static: false, private: false, access: { has: obj => "createAppointment" in obj, get: obj => obj.createAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointments_decorators, { kind: "method", name: "getAppointments", static: false, private: false, access: { has: obj => "getAppointments" in obj, get: obj => obj.getAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchAppointments_decorators, { kind: "method", name: "searchAppointments", static: false, private: false, access: { has: obj => "searchAppointments" in obj, get: obj => obj.searchAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointmentStats_decorators, { kind: "method", name: "getAppointmentStats", static: false, private: false, access: { has: obj => "getAppointmentStats" in obj, get: obj => obj.getAppointmentStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointmentAnalytics_decorators, { kind: "method", name: "getAppointmentAnalytics", static: false, private: false, access: { has: obj => "getAppointmentAnalytics" in obj, get: obj => obj.getAppointmentAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointment_decorators, { kind: "method", name: "getAppointment", static: false, private: false, access: { has: obj => "getAppointment" in obj, get: obj => obj.getAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateAppointment_decorators, { kind: "method", name: "updateAppointment", static: false, private: false, access: { has: obj => "updateAppointment" in obj, get: obj => obj.updateAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelAppointment_decorators, { kind: "method", name: "cancelAppointment", static: false, private: false, access: { has: obj => "cancelAppointment" in obj, get: obj => obj.cancelAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkInAppointment_decorators, { kind: "method", name: "checkInAppointment", static: false, private: false, access: { has: obj => "checkInAppointment" in obj, get: obj => obj.checkInAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _completeAppointment_decorators, { kind: "method", name: "completeAppointment", static: false, private: false, access: { has: obj => "completeAppointment" in obj, get: obj => obj.completeAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rescheduleAppointment_decorators, { kind: "method", name: "rescheduleAppointment", static: false, private: false, access: { has: obj => "rescheduleAppointment" in obj, get: obj => obj.rescheduleAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkAvailability_decorators, { kind: "method", name: "checkAvailability", static: false, private: false, access: { has: obj => "checkAvailability" in obj, get: obj => obj.checkAvailability }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAvailability_decorators, { kind: "method", name: "getAvailability", static: false, private: false, access: { has: obj => "getAvailability" in obj, get: obj => obj.getAvailability }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _bulkUpdateAppointments_decorators, { kind: "method", name: "bulkUpdateAppointments", static: false, private: false, access: { has: obj => "bulkUpdateAppointments" in obj, get: obj => obj.bulkUpdateAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _bulkCancelAppointments_decorators, { kind: "method", name: "bulkCancelAppointments", static: false, private: false, access: { has: obj => "bulkCancelAppointments" in obj, get: obj => obj.bulkCancelAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createRecurringAppointments_decorators, { kind: "method", name: "createRecurringAppointments", static: false, private: false, access: { has: obj => "createRecurringAppointments" in obj, get: obj => obj.createRecurringAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelRecurringAppointments_decorators, { kind: "method", name: "cancelRecurringAppointments", static: false, private: false, access: { has: obj => "cancelRecurringAppointments" in obj, get: obj => obj.cancelRecurringAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _addToWaitlist_decorators, { kind: "method", name: "addToWaitlist", static: false, private: false, access: { has: obj => "addToWaitlist" in obj, get: obj => obj.addToWaitlist }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getWaitlist_decorators, { kind: "method", name: "getWaitlist", static: false, private: false, access: { has: obj => "getWaitlist" in obj, get: obj => obj.getWaitlist }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateWaitlistItem_decorators, { kind: "method", name: "updateWaitlistItem", static: false, private: false, access: { has: obj => "updateWaitlistItem" in obj, get: obj => obj.updateWaitlistItem }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _removeFromWaitlist_decorators, { kind: "method", name: "removeFromWaitlist", static: false, private: false, access: { has: obj => "removeFromWaitlist" in obj, get: obj => obj.removeFromWaitlist }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getDayView_decorators, { kind: "method", name: "getDayView", static: false, private: false, access: { has: obj => "getDayView" in obj, get: obj => obj.getDayView }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getWeekView_decorators, { kind: "method", name: "getWeekView", static: false, private: false, access: { has: obj => "getWeekView" in obj, get: obj => obj.getWeekView }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getMonthView_decorators, { kind: "method", name: "getMonthView", static: false, private: false, access: { has: obj => "getMonthView" in obj, get: obj => obj.getMonthView }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaffUtilization_decorators, { kind: "method", name: "getStaffUtilization", static: false, private: false, access: { has: obj => "getStaffUtilization" in obj, get: obj => obj.getStaffUtilization }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getSpaceUtilization_decorators, { kind: "method", name: "getSpaceUtilization", static: false, private: false, access: { has: obj => "getSpaceUtilization" in obj, get: obj => obj.getSpaceUtilization }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacilityUtilization_decorators, { kind: "method", name: "getFacilityUtilization", static: false, private: false, access: { has: obj => "getFacilityUtilization" in obj, get: obj => obj.getFacilityUtilization }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getConflicts_decorators, { kind: "method", name: "getConflicts", static: false, private: false, access: { has: obj => "getConflicts" in obj, get: obj => obj.getConflicts }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointmentConflicts_decorators, { kind: "method", name: "getAppointmentConflicts", static: false, private: false, access: { has: obj => "getAppointmentConflicts" in obj, get: obj => obj.getAppointmentConflicts }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAppointmentTemplates_decorators, { kind: "method", name: "getAppointmentTemplates", static: false, private: false, access: { has: obj => "getAppointmentTemplates" in obj, get: obj => obj.getAppointmentTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createAppointmentTemplate_decorators, { kind: "method", name: "createAppointmentTemplate", static: false, private: false, access: { has: obj => "createAppointmentTemplate" in obj, get: obj => obj.createAppointmentTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _sendReminder_decorators, { kind: "method", name: "sendReminder", static: false, private: false, access: { has: obj => "sendReminder" in obj, get: obj => obj.sendReminder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _sendBulkReminders_decorators, { kind: "method", name: "sendBulkReminders", static: false, private: false, access: { has: obj => "sendBulkReminders" in obj, get: obj => obj.sendBulkReminders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppointmentController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        appointmentService = __runInitializers(this, _instanceExtraInitializers);
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
    return AppointmentController = _classThis;
})();
export { AppointmentController };
//# sourceMappingURL=appointment.controller.js.map