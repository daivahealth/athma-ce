import { PrismaService } from '@zeal/shared-database';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto } from './dto/appointment.dto';
export declare class AppointmentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAppointmentDto): Promise<any>;
    findById(id: string): Promise<any>;
    findByIdWithDetails(id: string): Promise<any>;
    findMany(query: AppointmentQueryDto): Promise<any>;
    search(searchDto: AppointmentSearchDto): Promise<any[]>;
    update(id: string, data: UpdateAppointmentDto): Promise<any>;
    checkConflicts(appointmentData: any, excludeId?: string): Promise<any[]>;
    checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<any>;
    getAvailability(query: GetAvailabilityDto): Promise<any>;
    cancelRecurringAppointments(seriesId: string, reason: string, cancelFutureOnly: boolean): Promise<any>;
    addToWaitlist(data: any): Promise<any>;
    getWaitlist(query: any): Promise<any>;
    updateWaitlistItem(id: string, updates: any): Promise<any>;
    removeFromWaitlist(id: string): Promise<any>;
    getDayView(date: string, query: any): Promise<any>;
    getWeekView(week: string, query: any): Promise<any>;
    getMonthView(month: string, query: any): Promise<any>;
    getStaffUtilization(staffId: string, query: any): Promise<any>;
    getSpaceUtilization(spaceId: string, query: any): Promise<any>;
    getFacilityUtilization(facilityId: string, query: any): Promise<any>;
    getConflicts(query: any): Promise<any>;
    getAppointmentConflicts(id: string): Promise<any>;
    getAppointmentTemplates(query: any): Promise<any>;
    createAppointmentTemplate(templateDto: any): Promise<any>;
    getAppointmentStats(query: any): Promise<any>;
    getAppointmentAnalytics(query: any): Promise<any>;
    private parseTime;
    private getUnavailabilityReason;
    private groupByToRecord;
}
//# sourceMappingURL=appointment.repository.d.ts.map