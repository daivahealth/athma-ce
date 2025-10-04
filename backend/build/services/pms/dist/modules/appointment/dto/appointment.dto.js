"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentAnalyticsDto = exports.AppointmentStatsDto = exports.WaitlistResponseDto = exports.AvailabilityResponseDto = exports.AvailabilitySlotDto = exports.AppointmentResponseDto = exports.AddToWaitlistDto = exports.CreateRecurringAppointmentsDto = exports.BulkCancelAppointmentsDto = exports.BulkUpdateAppointmentsDto = exports.GetAvailabilityDto = exports.CheckAvailabilityDto = exports.AppointmentSearchDto = exports.AppointmentQueryDto = exports.UpdateAppointmentDto = exports.CreateAppointmentDto = void 0;
const zod_1 = require("zod");
// Appointment status enum
const appointmentStatusSchema = zod_1.z.enum([
    'scheduled',
    'confirmed',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled'
]);
// Visit type enum
const visitTypeSchema = zod_1.z.enum([
    'new',
    'revisit',
    'follow_up',
    'consultation',
    'procedure',
    'emergency'
]);
// Appointment type enum
const appointmentTypeSchema = zod_1.z.enum([
    'consultation',
    'follow_up',
    'procedure',
    'emergency',
    'telemedicine',
    'surgery',
    'therapy',
    'checkup'
]);
// Base appointment schemas
exports.CreateAppointmentDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    spaceId: zod_1.z.string().uuid().optional(),
    staffId: zod_1.z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    status: appointmentStatusSchema.default('scheduled'),
    startTime: zod_1.z.string().datetime().or(zod_1.z.date()),
    endTime: zod_1.z.string().datetime().or(zod_1.z.date()),
    duration: zod_1.z.number().int().min(15).max(480).default(30), // 15 minutes to 8 hours
    notes: zod_1.z.string().max(1000).optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: zod_1.z.string().uuid().optional(),
    recurringPattern: zod_1.z.object({
        frequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        interval: zod_1.z.number().int().min(1).default(1),
        daysOfWeek: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(), // 0 = Sunday
        endDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
        occurrences: zod_1.z.number().int().positive().optional(),
    }).optional(),
    reminders: zod_1.z.object({
        sms: zod_1.z.boolean().default(false),
        email: zod_1.z.boolean().default(false),
        phone: zod_1.z.boolean().default(false),
        advanceMinutes: zod_1.z.number().int().min(5).default(60),
    }).optional(),
});
exports.UpdateAppointmentDto = zod_1.z.object({
    facilityId: zod_1.z.string().uuid().optional(),
    spaceId: zod_1.z.string().uuid().optional(),
    staffId: zod_1.z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema.optional(),
    status: appointmentStatusSchema.optional(),
    startTime: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    endTime: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    duration: zod_1.z.number().int().min(15).max(480).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: zod_1.z.string().uuid().optional(),
    cancellationReason: zod_1.z.string().max(500).optional(),
    rescheduleReason: zod_1.z.string().max(500).optional(),
});
exports.AppointmentQueryDto = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    patientId: zod_1.z.string().uuid().optional(),
    staffId: zod_1.z.string().uuid().optional(),
    facilityId: zod_1.z.string().uuid().optional(),
    spaceId: zod_1.z.string().uuid().optional(),
    status: appointmentStatusSchema.optional(),
    appointmentType: appointmentTypeSchema.optional(),
    visitType: visitTypeSchema.optional(),
    dateRange: zod_1.z.object({
        from: zod_1.z.string().datetime().or(zod_1.z.date()),
        to: zod_1.z.string().datetime().or(zod_1.z.date()),
    }).optional(),
    timeRange: zod_1.z.object({
        start: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    }).optional(),
    sortBy: zod_1.z.enum(['startTime', 'endTime', 'createdAt', 'patientName', 'staffName']).default('startTime'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
exports.AppointmentSearchDto = zod_1.z.object({
    q: zod_1.z.string().min(1).max(255),
    fields: zod_1.z.array(zod_1.z.enum(['patientName', 'staffName', 'facilityName', 'notes'])).optional(),
    dateRange: zod_1.z.object({
        from: zod_1.z.string().datetime().or(zod_1.z.date()),
        to: zod_1.z.string().datetime().or(zod_1.z.date()),
    }).optional(),
    limit: zod_1.z.number().int().min(1).max(50).default(10),
});
// Availability checking
exports.CheckAvailabilityDto = zod_1.z.object({
    facilityId: zod_1.z.string().uuid(),
    staffId: zod_1.z.string().uuid().optional(),
    spaceId: zod_1.z.string().uuid().optional(),
    startTime: zod_1.z.string().datetime().or(zod_1.z.date()),
    endTime: zod_1.z.string().datetime().or(zod_1.z.date()),
    excludeAppointmentId: zod_1.z.string().uuid().optional(),
});
exports.GetAvailabilityDto = zod_1.z.object({
    facilityId: zod_1.z.string().uuid(),
    staffId: zod_1.z.string().uuid().optional(),
    spaceId: zod_1.z.string().uuid().optional(),
    date: zod_1.z.string().date().or(zod_1.z.date()),
    duration: zod_1.z.number().int().min(15).max(480).default(30),
    includeWeekends: zod_1.z.boolean().default(false),
});
// Bulk operations
exports.BulkUpdateAppointmentsDto = zod_1.z.object({
    appointmentIds: zod_1.z.array(zod_1.z.string().uuid()).min(1).max(100),
    updates: exports.UpdateAppointmentDto,
    reason: zod_1.z.string().max(500).optional(),
});
exports.BulkCancelAppointmentsDto = zod_1.z.object({
    appointmentIds: zod_1.z.array(zod_1.z.string().uuid()).min(1).max(100),
    reason: zod_1.z.string().max(500),
    notifyPatient: zod_1.z.boolean().default(true),
    notifyStaff: zod_1.z.boolean().default(true),
});
// Recurring appointments
exports.CreateRecurringAppointmentsDto = zod_1.z.object({
    baseAppointment: exports.CreateAppointmentDto,
    recurringPattern: zod_1.z.object({
        frequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        interval: zod_1.z.number().int().min(1).default(1),
        daysOfWeek: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(),
        endDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
        occurrences: zod_1.z.number().int().positive().optional(),
    }),
});
// Waitlist
exports.AddToWaitlistDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    staffId: zod_1.z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    preferredDate: zod_1.z.string().date().or(zod_1.z.date()).optional(),
    preferredTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    priority: zod_1.z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    notes: zod_1.z.string().max(500).optional(),
});
// Response DTOs
exports.AppointmentResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    spaceId: zod_1.z.string().uuid().optional(),
    staffId: zod_1.z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    status: appointmentStatusSchema,
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    duration: zod_1.z.number(),
    notes: zod_1.z.string().optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    patient: zod_1.z.any().optional(),
    staff: zod_1.z.any().optional(),
    facility: zod_1.z.any().optional(),
    space: zod_1.z.any().optional(),
});
exports.AvailabilitySlotDto = zod_1.z.object({
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    duration: zod_1.z.number(),
    available: zod_1.z.boolean(),
    reason: zod_1.z.string().optional(),
});
exports.AvailabilityResponseDto = zod_1.z.object({
    date: zod_1.z.string().date(),
    facilityId: zod_1.z.string().uuid(),
    staffId: zod_1.z.string().uuid().optional(),
    spaceId: zod_1.z.string().uuid().optional(),
    slots: zod_1.z.array(exports.AvailabilitySlotDto),
    operatingHours: zod_1.z.object({
        open: zod_1.z.string(),
        close: zod_1.z.string(),
        breaks: zod_1.z.array(zod_1.z.object({
            start: zod_1.z.string(),
            end: zod_1.z.string(),
        })).optional(),
    }).optional(),
});
exports.WaitlistResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    staffId: zod_1.z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    preferredDate: zod_1.z.string().date().optional(),
    preferredTime: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['low', 'normal', 'high', 'urgent']),
    status: zod_1.z.enum(['waiting', 'contacted', 'scheduled', 'cancelled']),
    notes: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    patient: zod_1.z.any().optional(),
});
// Statistics and analytics
exports.AppointmentStatsDto = zod_1.z.object({
    total: zod_1.z.number(),
    byStatus: zod_1.z.record(zod_1.z.number()),
    byType: zod_1.z.record(zod_1.z.number()),
    byStaff: zod_1.z.record(zod_1.z.number()),
    byFacility: zod_1.z.record(zod_1.z.number()),
    averageDuration: zod_1.z.number(),
    noShowRate: zod_1.z.number(),
    cancellationRate: zod_1.z.number(),
    utilizationRate: zod_1.z.number(),
});
exports.AppointmentAnalyticsDto = zod_1.z.object({
    period: zod_1.z.object({
        start: zod_1.z.string().datetime(),
        end: zod_1.z.string().datetime(),
    }),
    stats: exports.AppointmentStatsDto,
    trends: zod_1.z.object({
        appointments: zod_1.z.array(zod_1.z.object({
            date: zod_1.z.string().date(),
            count: zod_1.z.number(),
        })),
        utilization: zod_1.z.array(zod_1.z.object({
            date: zod_1.z.string().date(),
            rate: zod_1.z.number(),
        })),
    }),
});
//# sourceMappingURL=appointment.dto.js.map
//# sourceMappingURL=appointment.dto.js.map