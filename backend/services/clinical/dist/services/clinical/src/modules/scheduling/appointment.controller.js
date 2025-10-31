"use strict";
/**
 * Appointment Controller
 *
 * REST API endpoints for booking and managing appointments
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const appointment_dto_1 = require("./dto/appointment.dto");
let AppointmentController = class AppointmentController {
    appointmentService;
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    getContext(req) {
        return {
            userId: req.user?.id || 'system',
            tenantId: req.tenant?.id || 'default-tenant',
            facilityId: req.facility?.id || 'default-facility',
            userRole: req.user?.role || 'user',
        };
    }
    // ========================================
    // APPOINTMENT BOOKING & MANAGEMENT
    // ========================================
    /**
     * POST /scheduling/appointments - Book a new appointment
     */
    async bookAppointment(dto, req) {
        const context = this.getContext(req);
        return this.appointmentService.bookAppointment(dto, context);
    }
    /**
     * GET /scheduling/appointments/:id - Get appointment with resources
     */
    async getAppointmentWithResources(id, req) {
        const context = this.getContext(req);
        return this.appointmentService.getAppointmentWithResources(id, context);
    }
    /**
     * PUT /scheduling/appointments/:id/reschedule - Reschedule appointment
     */
    async rescheduleAppointment(appointmentId, dto, req) {
        const context = this.getContext(req);
        return this.appointmentService.rescheduleAppointment({
            appointmentId,
            ...dto,
        }, context);
    }
    /**
     * POST /scheduling/appointments/:id/cancel - Cancel appointment
     */
    async cancelAppointment(appointmentId, dto, req) {
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
    async allocateResource(dto, req) {
        const context = this.getContext(req);
        return this.appointmentService.allocateResource(dto, context);
    }
    /**
     * POST /scheduling/appointments/resources/:resourceId/confirm - Confirm resource allocation
     */
    async confirmResource(resourceId, req) {
        const context = this.getContext(req);
        return this.appointmentService.confirmResource(resourceId, context);
    }
    // ========================================
    // APPOINTMENT SERIES (RECURRING)
    // ========================================
    /**
     * POST /scheduling/appointments/series - Create recurring appointment series
     */
    async createAppointmentSeries(dto, req) {
        const context = this.getContext(req);
        return this.appointmentService.createAppointmentSeries(dto, context);
    }
    /**
     * GET /scheduling/appointments/series/:id - Get appointment series with all appointments
     */
    async getAppointmentSeries(seriesId, req) {
        const context = this.getContext(req);
        return this.appointmentService.getAppointmentSeries(seriesId, context);
    }
    /**
     * POST /scheduling/appointments/series/:id/pause - Pause appointment series
     */
    async pauseAppointmentSeries(seriesId, req) {
        const context = this.getContext(req);
        return this.appointmentService.pauseAppointmentSeries(seriesId, context);
    }
    /**
     * POST /scheduling/appointments/series/:id/resume - Resume appointment series
     */
    async resumeAppointmentSeries(seriesId, req) {
        const context = this.getContext(req);
        return this.appointmentService.resumeAppointmentSeries(seriesId, context);
    }
    /**
     * POST /scheduling/appointments/series/:id/cancel - Cancel entire appointment series
     */
    async cancelAppointmentSeries(seriesId, dto, req) {
        const context = this.getContext(req);
        return this.appointmentService.cancelAppointmentSeries(seriesId, dto.reason, context);
    }
    // ========================================
    // QUERY ENDPOINTS
    // ========================================
    /**
     * GET /scheduling/appointments/patients/:patientId - Get patient appointments
     */
    async getPatientAppointments(patientId, startDate, endDate, status, includeResources, req) {
        const context = this.getContext(req);
        const filters = {};
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
    async getFacilityAppointments(facilityId, startDate, endDate, status, includeResources, req) {
        const context = this.getContext(req);
        const filters = {
            facilityId,
        };
        if (status) {
            filters.status = status;
        }
        if (includeResources !== undefined) {
            filters.includeResources = includeResources === 'true';
        }
        return this.appointmentService.getFacilityAppointments(new Date(startDate), new Date(endDate), context, filters);
    }
    /**
     * GET /scheduling/appointments/facility/current - Get appointments for current facility
     * Convenience endpoint that uses the user's facility from context
     */
    async getCurrentFacilityAppointments(startDate, endDate, status, includeResources, req) {
        const context = this.getContext(req);
        const filters = {};
        if (status) {
            filters.status = status;
        }
        if (includeResources !== undefined) {
            filters.includeResources = includeResources === 'true';
        }
        return this.appointmentService.getFacilityAppointments(new Date(startDate), new Date(endDate), context, filters);
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_dto_1.BookAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentWithResources", null);
__decorate([
    (0, common_1.Put)(':id/reschedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointment_dto_1.RescheduleAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointment_dto_1.CancelAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Post)('resources'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_dto_1.AllocateResourceDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "allocateResource", null);
__decorate([
    (0, common_1.Post)('resources/:resourceId/confirm'),
    __param(0, (0, common_1.Param)('resourceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "confirmResource", null);
__decorate([
    (0, common_1.Post)('series'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_dto_1.CreateAppointmentSeriesDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createAppointmentSeries", null);
__decorate([
    (0, common_1.Get)('series/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentSeries", null);
__decorate([
    (0, common_1.Post)('series/:id/pause'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "pauseAppointmentSeries", null);
__decorate([
    (0, common_1.Post)('series/:id/resume'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "resumeAppointmentSeries", null);
__decorate([
    (0, common_1.Post)('series/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointment_dto_1.CancelAppointmentSeriesDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelAppointmentSeries", null);
__decorate([
    (0, common_1.Get)('patients/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('includeResources')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getPatientAppointments", null);
__decorate([
    (0, common_1.Get)('facilities/:facilityId'),
    __param(0, (0, common_1.Param)('facilityId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('includeResources')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getFacilityAppointments", null);
__decorate([
    (0, common_1.Get)('facility/current'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('includeResources')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getCurrentFacilityAppointments", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, common_1.Controller)('scheduling/appointments'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map