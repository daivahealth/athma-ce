import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto, BulkUpdateAppointmentsDto, BulkCancelAppointmentsDto, CreateRecurringAppointmentsDto, AddToWaitlistDto } from './dto/appointment.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<any>;
    getAppointments(query: AppointmentQueryDto): Promise<any>;
    searchAppointments(searchDto: AppointmentSearchDto): Promise<any[]>;
    getAppointmentStats(query: Record<string, string>): Promise<any>;
    getAppointmentAnalytics(query: Record<string, string>): Promise<any>;
    getAppointment(id: string): Promise<any>;
    updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any>;
    cancelAppointment(id: string, body: {
        reason: string;
    }): Promise<any>;
    checkInAppointment(id: string): Promise<any>;
    completeAppointment(id: string): Promise<any>;
    rescheduleAppointment(id: string, body: {
        newStartTime: string;
        newEndTime: string;
        reason?: string;
    }): Promise<any>;
    checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<any>;
    getAvailability(query: GetAvailabilityDto): Promise<any>;
    bulkUpdateAppointments(bulkUpdateDto: BulkUpdateAppointmentsDto): Promise<any>;
    bulkCancelAppointments(bulkCancelDto: BulkCancelAppointmentsDto): Promise<any>;
    createRecurringAppointments(recurringDto: CreateRecurringAppointmentsDto): Promise<any>;
    cancelRecurringAppointments(seriesId: string, body: {
        reason: string;
        cancelFutureOnly?: boolean;
    }): Promise<any>;
    addToWaitlist(waitlistDto: AddToWaitlistDto): Promise<any>;
    getWaitlist(query: Record<string, string>): Promise<any>;
    updateWaitlistItem(id: string, body: any): Promise<any>;
    removeFromWaitlist(id: string): Promise<any>;
    getDayView(date: string, query: Record<string, string>): Promise<any>;
    getWeekView(week: string, query: Record<string, string>): Promise<any>;
    getMonthView(month: string, query: Record<string, string>): Promise<any>;
    getStaffUtilization(staffId: string, query: Record<string, string>): Promise<any>;
    getSpaceUtilization(spaceId: string, query: Record<string, string>): Promise<any>;
    getFacilityUtilization(facilityId: string, query: Record<string, string>): Promise<any>;
    getConflicts(query: Record<string, string>): Promise<any>;
    getAppointmentConflicts(id: string): Promise<any>;
    getAppointmentTemplates(query: Record<string, string>): Promise<any>;
    createAppointmentTemplate(templateDto: any): Promise<any>;
    sendReminder(id: string, body: {
        method: string;
    }): Promise<any>;
    sendBulkReminders(body: {
        appointmentIds: string[];
        method: string;
    }): Promise<any>;
}
//# sourceMappingURL=appointment.controller.d.ts.map