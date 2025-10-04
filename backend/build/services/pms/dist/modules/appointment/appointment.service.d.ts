export let AppointmentService: {
    new (appointmentRepository: any): {
        appointmentRepository: any;
        createAppointment(createAppointmentDto: any): Promise<any>;
        getAppointments(query: any): Promise<any>;
        searchAppointments(searchDto: any): Promise<any>;
        getAppointmentById(id: any): Promise<any>;
        updateAppointment(id: any, updateAppointmentDto: any): Promise<any>;
        cancelAppointment(id: any, reason: any): Promise<any>;
        checkInAppointment(id: any): Promise<any>;
        completeAppointment(id: any): Promise<any>;
        rescheduleAppointment(id: any, newStartTime: any, newEndTime: any, reason: any): Promise<any>;
        checkAvailability(checkAvailabilityDto: any): Promise<any>;
        getAvailability(query: any): Promise<any>;
        bulkUpdateAppointments(bulkUpdateDto: any): Promise<{
            success: number;
            failed: number;
            results: any[];
            errors: {
                appointmentId: any;
                error: any;
            }[];
        }>;
        bulkCancelAppointments(bulkCancelDto: any): Promise<{
            success: number;
            failed: number;
            results: any[];
            errors: {
                appointmentId: any;
                error: any;
            }[];
        }>;
        createRecurringAppointments(recurringDto: any): Promise<{
            seriesId: string;
            created: number;
            failed: number;
            appointments: any[];
            errors: {
                date: Date;
                error: any;
            }[];
        }>;
        cancelRecurringAppointments(seriesId: any, reason: any, cancelFutureOnly?: boolean): Promise<any>;
        addToWaitlist(waitlistDto: any): Promise<any>;
        getWaitlist(query: any): Promise<any>;
        updateWaitlistItem(id: any, updates: any): Promise<any>;
        removeFromWaitlist(id: any): Promise<any>;
        getDayView(date: any, query: any): Promise<any>;
        getWeekView(week: any, query: any): Promise<any>;
        getMonthView(month: any, query: any): Promise<any>;
        getStaffUtilization(staffId: any, query: any): Promise<any>;
        getSpaceUtilization(spaceId: any, query: any): Promise<any>;
        getFacilityUtilization(facilityId: any, query: any): Promise<any>;
        getConflicts(query: any): Promise<any>;
        getAppointmentConflicts(id: any): Promise<any>;
        getAppointmentTemplates(query: any): Promise<any>;
        createAppointmentTemplate(templateDto: any): Promise<any>;
        sendReminder(appointmentId: any, method: any): Promise<{
            success: boolean;
            method: any;
            appointmentId: any;
        }>;
        sendBulkReminders(appointmentIds: any, method: any): Promise<{
            success: number;
            failed: number;
            results: {
                success: boolean;
                method: any;
                appointmentId: any;
            }[];
            errors: {
                appointmentId: any;
                error: any;
            }[];
        }>;
        getAppointmentStats(query: any): Promise<any>;
        getAppointmentAnalytics(query: any): Promise<any>;
        validateAppointmentData(data: any): void;
        scheduleReminders(appointmentId: any, reminders: any): Promise<void>;
        sendCancellationNotifications(appointment: any): Promise<void>;
        sendRescheduleNotifications(appointment: any, newStartTime: any, newEndTime: any): Promise<void>;
        sendReminderNotification(appointment: any, method: any): Promise<{
            success: boolean;
            method: any;
            appointmentId: any;
        }>;
        generateSeriesId(): string;
        generateRecurringDates(startTime: any, pattern: any): Date[];
        adjustTimeForDate(originalTime: any, newDate: any): string;
    };
};
//# sourceMappingURL=appointment.service.d.ts.map