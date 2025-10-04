export let AppointmentController: {
    new (appointmentService: any): {
        appointmentService: any;
        createAppointment(createAppointmentDto: any): Promise<any>;
        getAppointments(query: any): Promise<any>;
        searchAppointments(searchDto: any): Promise<any>;
        getAppointmentStats(query: any): Promise<any>;
        getAppointmentAnalytics(query: any): Promise<any>;
        getAppointment(id: any): Promise<any>;
        updateAppointment(id: any, updateAppointmentDto: any): Promise<any>;
        cancelAppointment(id: any, body: any): Promise<any>;
        checkInAppointment(id: any): Promise<any>;
        completeAppointment(id: any): Promise<any>;
        rescheduleAppointment(id: any, body: any): Promise<any>;
        checkAvailability(checkAvailabilityDto: any): Promise<any>;
        getAvailability(query: any): Promise<any>;
        bulkUpdateAppointments(bulkUpdateDto: any): Promise<any>;
        bulkCancelAppointments(bulkCancelDto: any): Promise<any>;
        createRecurringAppointments(recurringDto: any): Promise<any>;
        cancelRecurringAppointments(seriesId: any, body: any): Promise<any>;
        addToWaitlist(waitlistDto: any): Promise<any>;
        getWaitlist(query: any): Promise<any>;
        updateWaitlistItem(id: any, body: any): Promise<any>;
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
        sendReminder(id: any, body: any): Promise<any>;
        sendBulkReminders(body: any): Promise<any>;
    };
};
//# sourceMappingURL=appointment.controller.d.ts.map