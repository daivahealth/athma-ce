export let AppointmentRepository: {
    new (prisma: any): {
        prisma: any;
        create(data: any): Promise<any>;
        findById(id: any): Promise<any>;
        findByIdWithDetails(id: any): Promise<any>;
        findMany(query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        search(searchDto: any): Promise<any>;
        update(id: any, data: any): Promise<any>;
        checkConflicts(appointmentData: any, excludeId: any): Promise<any>;
        checkAvailability(checkAvailabilityDto: any): Promise<{
            available: boolean;
            conflicts: any;
        }>;
        getAvailability(query: any): Promise<{
            date: any;
            facilityId: any;
            staffId: any;
            spaceId: any;
            slots: {
                startTime: string;
                endTime: string;
                duration: any;
                available: any;
                reason: string | undefined;
            }[];
            operatingHours: {
                open: string;
                close: string;
                breaks: {
                    start: string;
                    end: string;
                }[];
            };
        }>;
        cancelRecurringAppointments(seriesId: any, reason: any, cancelFutureOnly: any): Promise<any>;
        addToWaitlist(data: any): Promise<any>;
        getWaitlist(query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        updateWaitlistItem(id: any, updates: any): Promise<any>;
        removeFromWaitlist(id: any): Promise<any>;
        getDayView(date: any, query: any): Promise<any>;
        getWeekView(week: any, query: any): Promise<never[]>;
        getMonthView(month: any, query: any): Promise<never[]>;
        getStaffUtilization(staffId: any, query: any): Promise<{}>;
        getSpaceUtilization(spaceId: any, query: any): Promise<{}>;
        getFacilityUtilization(facilityId: any, query: any): Promise<{}>;
        getConflicts(query: any): Promise<never[]>;
        getAppointmentConflicts(id: any): Promise<any>;
        getAppointmentTemplates(query: any): Promise<never[]>;
        createAppointmentTemplate(templateDto: any): Promise<{}>;
        getAppointmentStats(query: any): Promise<{
            total: any;
            byStatus: any;
            byType: any;
            byStaff: any;
            byFacility: any;
            averageDuration: number;
            noShowRate: number;
            cancellationRate: number;
            utilizationRate: number;
        }>;
        getAppointmentAnalytics(query: any): Promise<{}>;
        parseTime(timeString: any): {
            hours: any;
            minutes: any;
        };
        getUnavailabilityReason(isBreakTime: any, hasConflicts: any, isWeekend: any): "Break time" | "Conflicting appointment" | "Weekend not included" | "Unavailable";
        groupByToRecord(groupByResult: any): any;
    };
};
//# sourceMappingURL=appointment.repository.d.ts.map