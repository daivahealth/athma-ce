import { z } from 'zod';
export declare const CreateAppointmentDto: z.ZodObject<{
    patientId: z.ZodString;
    facilityId: z.ZodString;
    spaceId: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>;
    status: z.ZodDefault<z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>>;
    startTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    endTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    duration: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
    linkedEncounterId: z.ZodOptional<z.ZodString>;
    recurringPattern: z.ZodOptional<z.ZodObject<{
        frequency: z.ZodEnum<["daily", "weekly", "monthly", "yearly"]>;
        interval: z.ZodDefault<z.ZodNumber>;
        daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        occurrences: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    }, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number | undefined;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    }>>;
    reminders: z.ZodOptional<z.ZodObject<{
        sms: z.ZodDefault<z.ZodBoolean>;
        email: z.ZodDefault<z.ZodBoolean>;
        phone: z.ZodDefault<z.ZodBoolean>;
        advanceMinutes: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        email: boolean;
        sms: boolean;
        phone: boolean;
        advanceMinutes: number;
    }, {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        phone?: boolean | undefined;
        advanceMinutes?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    startTime: string | Date;
    endTime: string | Date;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
    recurringPattern?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    } | undefined;
    reminders?: {
        email: boolean;
        sms: boolean;
        phone: boolean;
        advanceMinutes: number;
    } | undefined;
}, {
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    startTime: string | Date;
    endTime: string | Date;
    duration?: number | undefined;
    status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
    recurringPattern?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number | undefined;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    } | undefined;
    reminders?: {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        phone?: boolean | undefined;
        advanceMinutes?: number | undefined;
    } | undefined;
}>;
export declare const UpdateAppointmentDto: z.ZodObject<{
    facilityId: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodOptional<z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>>;
    status: z.ZodOptional<z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>>;
    startTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    endTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    duration: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
    linkedEncounterId: z.ZodOptional<z.ZodString>;
    cancellationReason: z.ZodOptional<z.ZodString>;
    rescheduleReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    duration?: number | undefined;
    status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
    facilityId?: string | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
    startTime?: string | Date | undefined;
    endTime?: string | Date | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
    cancellationReason?: string | undefined;
    rescheduleReason?: string | undefined;
}, {
    duration?: number | undefined;
    status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
    facilityId?: string | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
    startTime?: string | Date | undefined;
    endTime?: string | Date | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
    cancellationReason?: string | undefined;
    rescheduleReason?: string | undefined;
}>;
export declare const AppointmentQueryDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    patientId: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    facilityId: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>>;
    appointmentType: z.ZodOptional<z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>>;
    visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        to: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        from: string | Date;
        to: string | Date;
    }, {
        from: string | Date;
        to: string | Date;
    }>>;
    timeRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start: string;
        end: string;
    }, {
        start: string;
        end: string;
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<["startTime", "endTime", "createdAt", "patientName", "staffName"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "createdAt" | "startTime" | "endTime" | "patientName" | "staffName";
    sortOrder: "asc" | "desc";
    status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
    patientId?: string | undefined;
    facilityId?: string | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    timeRange?: {
        start: string;
        end: string;
    } | undefined;
}, {
    status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
    patientId?: string | undefined;
    facilityId?: string | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "createdAt" | "startTime" | "endTime" | "patientName" | "staffName" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    timeRange?: {
        start: string;
        end: string;
    } | undefined;
}>;
export declare const AppointmentSearchDto: z.ZodObject<{
    q: z.ZodString;
    fields: z.ZodOptional<z.ZodArray<z.ZodEnum<["patientName", "staffName", "facilityName", "notes"]>, "many">>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        to: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        from: string | Date;
        to: string | Date;
    }, {
        from: string | Date;
        to: string | Date;
    }>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q: string;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    fields?: ("notes" | "patientName" | "staffName" | "facilityName")[] | undefined;
}, {
    q: string;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    limit?: number | undefined;
    fields?: ("notes" | "patientName" | "staffName" | "facilityName")[] | undefined;
}>;
export declare const CheckAvailabilityDto: z.ZodObject<{
    facilityId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodOptional<z.ZodString>;
    startTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    endTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    excludeAppointmentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    facilityId: string;
    startTime: string | Date;
    endTime: string | Date;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    excludeAppointmentId?: string | undefined;
}, {
    facilityId: string;
    startTime: string | Date;
    endTime: string | Date;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    excludeAppointmentId?: string | undefined;
}>;
export declare const GetAvailabilityDto: z.ZodObject<{
    facilityId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodOptional<z.ZodString>;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    duration: z.ZodDefault<z.ZodNumber>;
    includeWeekends: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    facilityId: string;
    date: string | Date;
    includeWeekends: boolean;
    spaceId?: string | undefined;
    staffId?: string | undefined;
}, {
    facilityId: string;
    date: string | Date;
    duration?: number | undefined;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    includeWeekends?: boolean | undefined;
}>;
export declare const BulkUpdateAppointmentsDto: z.ZodObject<{
    appointmentIds: z.ZodArray<z.ZodString, "many">;
    updates: z.ZodObject<{
        facilityId: z.ZodOptional<z.ZodString>;
        spaceId: z.ZodOptional<z.ZodString>;
        staffId: z.ZodOptional<z.ZodString>;
        appointmentType: z.ZodOptional<z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>>;
        status: z.ZodOptional<z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>>;
        startTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        endTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        duration: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
        visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
        linkedEncounterId: z.ZodOptional<z.ZodString>;
        cancellationReason: z.ZodOptional<z.ZodString>;
        rescheduleReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        facilityId?: string | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
        startTime?: string | Date | undefined;
        endTime?: string | Date | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        cancellationReason?: string | undefined;
        rescheduleReason?: string | undefined;
    }, {
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        facilityId?: string | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
        startTime?: string | Date | undefined;
        endTime?: string | Date | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        cancellationReason?: string | undefined;
        rescheduleReason?: string | undefined;
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    appointmentIds: string[];
    updates: {
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        facilityId?: string | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
        startTime?: string | Date | undefined;
        endTime?: string | Date | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        cancellationReason?: string | undefined;
        rescheduleReason?: string | undefined;
    };
    reason?: string | undefined;
}, {
    appointmentIds: string[];
    updates: {
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        facilityId?: string | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        appointmentType?: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup" | undefined;
        startTime?: string | Date | undefined;
        endTime?: string | Date | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        cancellationReason?: string | undefined;
        rescheduleReason?: string | undefined;
    };
    reason?: string | undefined;
}>;
export declare const BulkCancelAppointmentsDto: z.ZodObject<{
    appointmentIds: z.ZodArray<z.ZodString, "many">;
    reason: z.ZodString;
    notifyPatient: z.ZodDefault<z.ZodBoolean>;
    notifyStaff: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    appointmentIds: string[];
    reason: string;
    notifyPatient: boolean;
    notifyStaff: boolean;
}, {
    appointmentIds: string[];
    reason: string;
    notifyPatient?: boolean | undefined;
    notifyStaff?: boolean | undefined;
}>;
export declare const CreateRecurringAppointmentsDto: z.ZodObject<{
    baseAppointment: z.ZodObject<{
        patientId: z.ZodString;
        facilityId: z.ZodString;
        spaceId: z.ZodOptional<z.ZodString>;
        staffId: z.ZodOptional<z.ZodString>;
        appointmentType: z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>;
        status: z.ZodDefault<z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>>;
        startTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        endTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        duration: z.ZodDefault<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
        visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
        linkedEncounterId: z.ZodOptional<z.ZodString>;
        recurringPattern: z.ZodOptional<z.ZodObject<{
            frequency: z.ZodEnum<["daily", "weekly", "monthly", "yearly"]>;
            interval: z.ZodDefault<z.ZodNumber>;
            daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            occurrences: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval: number;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        }, {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval?: number | undefined;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        }>>;
        reminders: z.ZodOptional<z.ZodObject<{
            sms: z.ZodDefault<z.ZodBoolean>;
            email: z.ZodDefault<z.ZodBoolean>;
            phone: z.ZodDefault<z.ZodBoolean>;
            advanceMinutes: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            email: boolean;
            sms: boolean;
            phone: boolean;
            advanceMinutes: number;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            phone?: boolean | undefined;
            advanceMinutes?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
        patientId: string;
        facilityId: string;
        appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
        startTime: string | Date;
        endTime: string | Date;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        recurringPattern?: {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval: number;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        } | undefined;
        reminders?: {
            email: boolean;
            sms: boolean;
            phone: boolean;
            advanceMinutes: number;
        } | undefined;
    }, {
        patientId: string;
        facilityId: string;
        appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
        startTime: string | Date;
        endTime: string | Date;
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        recurringPattern?: {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval?: number | undefined;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        } | undefined;
        reminders?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            phone?: boolean | undefined;
            advanceMinutes?: number | undefined;
        } | undefined;
    }>;
    recurringPattern: z.ZodObject<{
        frequency: z.ZodEnum<["daily", "weekly", "monthly", "yearly"]>;
        interval: z.ZodDefault<z.ZodNumber>;
        daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        occurrences: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    }, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number | undefined;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    recurringPattern: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    };
    baseAppointment: {
        duration: number;
        status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
        patientId: string;
        facilityId: string;
        appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
        startTime: string | Date;
        endTime: string | Date;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        recurringPattern?: {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval: number;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        } | undefined;
        reminders?: {
            email: boolean;
            sms: boolean;
            phone: boolean;
            advanceMinutes: number;
        } | undefined;
    };
}, {
    recurringPattern: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number | undefined;
        daysOfWeek?: number[] | undefined;
        endDate?: string | Date | undefined;
        occurrences?: number | undefined;
    };
    baseAppointment: {
        patientId: string;
        facilityId: string;
        appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
        startTime: string | Date;
        endTime: string | Date;
        duration?: number | undefined;
        status?: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled" | undefined;
        spaceId?: string | undefined;
        staffId?: string | undefined;
        notes?: string | undefined;
        visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
        linkedEncounterId?: string | undefined;
        recurringPattern?: {
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            interval?: number | undefined;
            daysOfWeek?: number[] | undefined;
            endDate?: string | Date | undefined;
            occurrences?: number | undefined;
        } | undefined;
        reminders?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            phone?: boolean | undefined;
            advanceMinutes?: number | undefined;
        } | undefined;
    };
}>;
export declare const AddToWaitlistDto: z.ZodObject<{
    patientId: z.ZodString;
    facilityId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>;
    preferredDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    preferredTime: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    priority: "low" | "normal" | "high" | "urgent";
    staffId?: string | undefined;
    notes?: string | undefined;
    preferredDate?: string | Date | undefined;
    preferredTime?: string | undefined;
}, {
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    staffId?: string | undefined;
    notes?: string | undefined;
    priority?: "low" | "normal" | "high" | "urgent" | undefined;
    preferredDate?: string | Date | undefined;
    preferredTime?: string | undefined;
}>;
export declare const AppointmentResponseDto: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodString;
    facilityId: z.ZodString;
    spaceId: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>;
    status: z.ZodEnum<["scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show", "rescheduled"]>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    duration: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    visitType: z.ZodOptional<z.ZodEnum<["new", "revisit", "follow_up", "consultation", "procedure", "emergency"]>>;
    linkedEncounterId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    patient: z.ZodOptional<z.ZodAny>;
    staff: z.ZodOptional<z.ZodAny>;
    facility: z.ZodOptional<z.ZodAny>;
    space: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    id: string;
    status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    startTime: string;
    endTime: string;
    facility?: any;
    space?: any;
    staff?: any;
    patient?: any;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
}, {
    duration: number;
    id: string;
    status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    startTime: string;
    endTime: string;
    facility?: any;
    space?: any;
    staff?: any;
    patient?: any;
    spaceId?: string | undefined;
    staffId?: string | undefined;
    notes?: string | undefined;
    visitType?: "new" | "revisit" | "follow_up" | "consultation" | "procedure" | "emergency" | undefined;
    linkedEncounterId?: string | undefined;
}>;
export declare const AvailabilitySlotDto: z.ZodObject<{
    startTime: z.ZodString;
    endTime: z.ZodString;
    duration: z.ZodNumber;
    available: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    startTime: string;
    endTime: string;
    available: boolean;
    reason?: string | undefined;
}, {
    duration: number;
    startTime: string;
    endTime: string;
    available: boolean;
    reason?: string | undefined;
}>;
export declare const AvailabilityResponseDto: z.ZodObject<{
    date: z.ZodString;
    facilityId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodOptional<z.ZodString>;
    slots: z.ZodArray<z.ZodObject<{
        startTime: z.ZodString;
        endTime: z.ZodString;
        duration: z.ZodNumber;
        available: z.ZodBoolean;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        startTime: string;
        endTime: string;
        available: boolean;
        reason?: string | undefined;
    }, {
        duration: number;
        startTime: string;
        endTime: string;
        available: boolean;
        reason?: string | undefined;
    }>, "many">;
    operatingHours: z.ZodOptional<z.ZodObject<{
        open: z.ZodString;
        close: z.ZodString;
        breaks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        open: string;
        close: string;
        breaks?: {
            start: string;
            end: string;
        }[] | undefined;
    }, {
        open: string;
        close: string;
        breaks?: {
            start: string;
            end: string;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    facilityId: string;
    date: string;
    slots: {
        duration: number;
        startTime: string;
        endTime: string;
        available: boolean;
        reason?: string | undefined;
    }[];
    spaceId?: string | undefined;
    staffId?: string | undefined;
    operatingHours?: {
        open: string;
        close: string;
        breaks?: {
            start: string;
            end: string;
        }[] | undefined;
    } | undefined;
}, {
    facilityId: string;
    date: string;
    slots: {
        duration: number;
        startTime: string;
        endTime: string;
        available: boolean;
        reason?: string | undefined;
    }[];
    spaceId?: string | undefined;
    staffId?: string | undefined;
    operatingHours?: {
        open: string;
        close: string;
        breaks?: {
            start: string;
            end: string;
        }[] | undefined;
    } | undefined;
}>;
export declare const WaitlistResponseDto: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodString;
    facilityId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodEnum<["consultation", "follow_up", "procedure", "emergency", "telemedicine", "surgery", "therapy", "checkup"]>;
    preferredDate: z.ZodOptional<z.ZodString>;
    preferredTime: z.ZodOptional<z.ZodString>;
    priority: z.ZodEnum<["low", "normal", "high", "urgent"]>;
    status: z.ZodEnum<["waiting", "contacted", "scheduled", "cancelled"]>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    patient: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "scheduled" | "cancelled" | "waiting" | "contacted";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    priority: "low" | "normal" | "high" | "urgent";
    patient?: any;
    staffId?: string | undefined;
    notes?: string | undefined;
    preferredDate?: string | undefined;
    preferredTime?: string | undefined;
}, {
    id: string;
    status: "scheduled" | "cancelled" | "waiting" | "contacted";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    appointmentType: "follow_up" | "consultation" | "procedure" | "emergency" | "telemedicine" | "surgery" | "therapy" | "checkup";
    priority: "low" | "normal" | "high" | "urgent";
    patient?: any;
    staffId?: string | undefined;
    notes?: string | undefined;
    preferredDate?: string | undefined;
    preferredTime?: string | undefined;
}>;
export declare const AppointmentStatsDto: z.ZodObject<{
    total: z.ZodNumber;
    byStatus: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byType: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byStaff: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byFacility: z.ZodRecord<z.ZodString, z.ZodNumber>;
    averageDuration: z.ZodNumber;
    noShowRate: z.ZodNumber;
    cancellationRate: z.ZodNumber;
    utilizationRate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byStaff: Record<string, number>;
    byFacility: Record<string, number>;
    averageDuration: number;
    noShowRate: number;
    cancellationRate: number;
    utilizationRate: number;
}, {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byStaff: Record<string, number>;
    byFacility: Record<string, number>;
    averageDuration: number;
    noShowRate: number;
    cancellationRate: number;
    utilizationRate: number;
}>;
export declare const AppointmentAnalyticsDto: z.ZodObject<{
    period: z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start: string;
        end: string;
    }, {
        start: string;
        end: string;
    }>;
    stats: z.ZodObject<{
        total: z.ZodNumber;
        byStatus: z.ZodRecord<z.ZodString, z.ZodNumber>;
        byType: z.ZodRecord<z.ZodString, z.ZodNumber>;
        byStaff: z.ZodRecord<z.ZodString, z.ZodNumber>;
        byFacility: z.ZodRecord<z.ZodString, z.ZodNumber>;
        averageDuration: z.ZodNumber;
        noShowRate: z.ZodNumber;
        cancellationRate: z.ZodNumber;
        utilizationRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byStaff: Record<string, number>;
        byFacility: Record<string, number>;
        averageDuration: number;
        noShowRate: number;
        cancellationRate: number;
        utilizationRate: number;
    }, {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byStaff: Record<string, number>;
        byFacility: Record<string, number>;
        averageDuration: number;
        noShowRate: number;
        cancellationRate: number;
        utilizationRate: number;
    }>;
    trends: z.ZodObject<{
        appointments: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            date: string;
        }, {
            count: number;
            date: string;
        }>, "many">;
        utilization: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            rate: number;
        }, {
            date: string;
            rate: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        appointments: {
            count: number;
            date: string;
        }[];
        utilization: {
            date: string;
            rate: number;
        }[];
    }, {
        appointments: {
            count: number;
            date: string;
        }[];
        utilization: {
            date: string;
            rate: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    period: {
        start: string;
        end: string;
    };
    stats: {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byStaff: Record<string, number>;
        byFacility: Record<string, number>;
        averageDuration: number;
        noShowRate: number;
        cancellationRate: number;
        utilizationRate: number;
    };
    trends: {
        appointments: {
            count: number;
            date: string;
        }[];
        utilization: {
            date: string;
            rate: number;
        }[];
    };
}, {
    period: {
        start: string;
        end: string;
    };
    stats: {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byStaff: Record<string, number>;
        byFacility: Record<string, number>;
        averageDuration: number;
        noShowRate: number;
        cancellationRate: number;
        utilizationRate: number;
    };
    trends: {
        appointments: {
            count: number;
            date: string;
        }[];
        utilization: {
            date: string;
            rate: number;
        }[];
    };
}>;
export type CreateAppointmentDto = z.infer<typeof CreateAppointmentDto>;
export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentDto>;
export type AppointmentQueryDto = z.infer<typeof AppointmentQueryDto>;
export type AppointmentSearchDto = z.infer<typeof AppointmentSearchDto>;
export type CheckAvailabilityDto = z.infer<typeof CheckAvailabilityDto>;
export type GetAvailabilityDto = z.infer<typeof GetAvailabilityDto>;
export type BulkUpdateAppointmentsDto = z.infer<typeof BulkUpdateAppointmentsDto>;
export type BulkCancelAppointmentsDto = z.infer<typeof BulkCancelAppointmentsDto>;
export type CreateRecurringAppointmentsDto = z.infer<typeof CreateRecurringAppointmentsDto>;
export type AddToWaitlistDto = z.infer<typeof AddToWaitlistDto>;
export type AppointmentResponseDto = z.infer<typeof AppointmentResponseDto>;
export type AvailabilitySlotDto = z.infer<typeof AvailabilitySlotDto>;
export type AvailabilityResponseDto = z.infer<typeof AvailabilityResponseDto>;
export type WaitlistResponseDto = z.infer<typeof WaitlistResponseDto>;
export type AppointmentStatsDto = z.infer<typeof AppointmentStatsDto>;
export type AppointmentAnalyticsDto = z.infer<typeof AppointmentAnalyticsDto>;
//# sourceMappingURL=appointment.dto.d.ts.map