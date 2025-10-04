import { z } from 'zod';
// Appointment status enum
const appointmentStatusSchema = z.enum([
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
const visitTypeSchema = z.enum([
    'new',
    'revisit',
    'follow_up',
    'consultation',
    'procedure',
    'emergency'
]);
// Appointment type enum
const appointmentTypeSchema = z.enum([
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
export const CreateAppointmentDto = z.object({
    patientId: z.string().uuid(),
    facilityId: z.string().uuid(),
    spaceId: z.string().uuid().optional(),
    staffId: z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    status: appointmentStatusSchema.default('scheduled'),
    startTime: z.string().datetime().or(z.date()),
    endTime: z.string().datetime().or(z.date()),
    duration: z.number().int().min(15).max(480).default(30), // 15 minutes to 8 hours
    notes: z.string().max(1000).optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: z.string().uuid().optional(),
    recurringPattern: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        interval: z.number().int().min(1).default(1),
        daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(), // 0 = Sunday
        endDate: z.string().datetime().or(z.date()).optional(),
        occurrences: z.number().int().positive().optional(),
    }).optional(),
    reminders: z.object({
        sms: z.boolean().default(false),
        email: z.boolean().default(false),
        phone: z.boolean().default(false),
        advanceMinutes: z.number().int().min(5).default(60),
    }).optional(),
});
export const UpdateAppointmentDto = z.object({
    facilityId: z.string().uuid().optional(),
    spaceId: z.string().uuid().optional(),
    staffId: z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema.optional(),
    status: appointmentStatusSchema.optional(),
    startTime: z.string().datetime().or(z.date()).optional(),
    endTime: z.string().datetime().or(z.date()).optional(),
    duration: z.number().int().min(15).max(480).optional(),
    notes: z.string().max(1000).optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: z.string().uuid().optional(),
    cancellationReason: z.string().max(500).optional(),
    rescheduleReason: z.string().max(500).optional(),
});
export const AppointmentQueryDto = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    patientId: z.string().uuid().optional(),
    staffId: z.string().uuid().optional(),
    facilityId: z.string().uuid().optional(),
    spaceId: z.string().uuid().optional(),
    status: appointmentStatusSchema.optional(),
    appointmentType: appointmentTypeSchema.optional(),
    visitType: visitTypeSchema.optional(),
    dateRange: z.object({
        from: z.string().datetime().or(z.date()),
        to: z.string().datetime().or(z.date()),
    }).optional(),
    timeRange: z.object({
        start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    }).optional(),
    sortBy: z.enum(['startTime', 'endTime', 'createdAt', 'patientName', 'staffName']).default('startTime'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
export const AppointmentSearchDto = z.object({
    q: z.string().min(1).max(255),
    fields: z.array(z.enum(['patientName', 'staffName', 'facilityName', 'notes'])).optional(),
    dateRange: z.object({
        from: z.string().datetime().or(z.date()),
        to: z.string().datetime().or(z.date()),
    }).optional(),
    limit: z.number().int().min(1).max(50).default(10),
});
// Availability checking
export const CheckAvailabilityDto = z.object({
    facilityId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    spaceId: z.string().uuid().optional(),
    startTime: z.string().datetime().or(z.date()),
    endTime: z.string().datetime().or(z.date()),
    excludeAppointmentId: z.string().uuid().optional(),
});
export const GetAvailabilityDto = z.object({
    facilityId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    spaceId: z.string().uuid().optional(),
    date: z.string().date().or(z.date()),
    duration: z.number().int().min(15).max(480).default(30),
    includeWeekends: z.boolean().default(false),
});
// Bulk operations
export const BulkUpdateAppointmentsDto = z.object({
    appointmentIds: z.array(z.string().uuid()).min(1).max(100),
    updates: UpdateAppointmentDto,
    reason: z.string().max(500).optional(),
});
export const BulkCancelAppointmentsDto = z.object({
    appointmentIds: z.array(z.string().uuid()).min(1).max(100),
    reason: z.string().max(500),
    notifyPatient: z.boolean().default(true),
    notifyStaff: z.boolean().default(true),
});
// Recurring appointments
export const CreateRecurringAppointmentsDto = z.object({
    baseAppointment: CreateAppointmentDto,
    recurringPattern: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        interval: z.number().int().min(1).default(1),
        daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
        endDate: z.string().datetime().or(z.date()).optional(),
        occurrences: z.number().int().positive().optional(),
    }),
});
// Waitlist
export const AddToWaitlistDto = z.object({
    patientId: z.string().uuid(),
    facilityId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    preferredDate: z.string().date().or(z.date()).optional(),
    preferredTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    notes: z.string().max(500).optional(),
});
// Response DTOs
export const AppointmentResponseDto = z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    facilityId: z.string().uuid(),
    spaceId: z.string().uuid().optional(),
    staffId: z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    status: appointmentStatusSchema,
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    duration: z.number(),
    notes: z.string().optional(),
    visitType: visitTypeSchema.optional(),
    linkedEncounterId: z.string().uuid().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    patient: z.any().optional(),
    staff: z.any().optional(),
    facility: z.any().optional(),
    space: z.any().optional(),
});
export const AvailabilitySlotDto = z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    duration: z.number(),
    available: z.boolean(),
    reason: z.string().optional(),
});
export const AvailabilityResponseDto = z.object({
    date: z.string().date(),
    facilityId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    spaceId: z.string().uuid().optional(),
    slots: z.array(AvailabilitySlotDto),
    operatingHours: z.object({
        open: z.string(),
        close: z.string(),
        breaks: z.array(z.object({
            start: z.string(),
            end: z.string(),
        })).optional(),
    }).optional(),
});
export const WaitlistResponseDto = z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    facilityId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    appointmentType: appointmentTypeSchema,
    preferredDate: z.string().date().optional(),
    preferredTime: z.string().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']),
    status: z.enum(['waiting', 'contacted', 'scheduled', 'cancelled']),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    patient: z.any().optional(),
});
// Statistics and analytics
export const AppointmentStatsDto = z.object({
    total: z.number(),
    byStatus: z.record(z.number()),
    byType: z.record(z.number()),
    byStaff: z.record(z.number()),
    byFacility: z.record(z.number()),
    averageDuration: z.number(),
    noShowRate: z.number(),
    cancellationRate: z.number(),
    utilizationRate: z.number(),
});
export const AppointmentAnalyticsDto = z.object({
    period: z.object({
        start: z.string().datetime(),
        end: z.string().datetime(),
    }),
    stats: AppointmentStatsDto,
    trends: z.object({
        appointments: z.array(z.object({
            date: z.string().date(),
            count: z.number(),
        })),
        utilization: z.array(z.object({
            date: z.string().date(),
            rate: z.number(),
        })),
    }),
});
//# sourceMappingURL=appointment.dto.js.map