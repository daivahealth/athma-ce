/**
 * Appointment Controller
 *
 * REST API endpoints for booking and managing appointments
 */
import { AppointmentService } from './appointment.service';
import { BookAppointmentDto, AllocateResourceDto, RescheduleAppointmentDto, CancelAppointmentDto, CreateAppointmentSeriesDto, CancelAppointmentSeriesDto } from './dto/appointment.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    private getContext;
    /**
     * POST /scheduling/appointments - Book a new appointment
     */
    bookAppointment(dto: BookAppointmentDto, req: any): Promise<{
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    }>;
    /**
     * GET /scheduling/appointments/:id - Get appointment with resources
     */
    getAppointmentWithResources(id: string, req: any): Promise<{
        patient: {
            id: string;
            displayName: string | null;
            phoneNumber: string | null;
            email: string | null;
        };
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    }>;
    /**
     * PUT /scheduling/appointments/:id/reschedule - Reschedule appointment
     */
    rescheduleAppointment(appointmentId: string, dto: RescheduleAppointmentDto, req: any): Promise<{
        patient: {
            id: string;
            displayName: string | null;
            phoneNumber: string | null;
            email: string | null;
        };
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    }>;
    /**
     * POST /scheduling/appointments/:id/cancel - Cancel appointment
     */
    cancelAppointment(appointmentId: string, dto: CancelAppointmentDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * POST /scheduling/appointments/resources - Allocate resource to appointment
     */
    allocateResource(dto: AllocateResourceDto, req: any): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        resourceType: string;
        resourceId: string;
        appointmentId: string;
        resourceRole: string | null;
        preparationStart: Date | null;
        cleanupEnd: Date | null;
    }>;
    /**
     * POST /scheduling/appointments/resources/:resourceId/confirm - Confirm resource allocation
     */
    confirmResource(resourceId: string, req: any): Promise<{
        id: string;
        tenantId: string;
        createdBy: string | null;
        updatedBy: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        resourceType: string;
        resourceId: string;
        appointmentId: string;
        resourceRole: string | null;
        preparationStart: Date | null;
        cleanupEnd: Date | null;
    }>;
    /**
     * POST /scheduling/appointments/series - Create recurring appointment series
     */
    createAppointmentSeries(dto: CreateAppointmentSeriesDto, req: any): Promise<{
        series: {
            id: string;
            tenantId: string;
            patientId: string;
            startDate: Date;
            endDate: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            appointmentType: string;
            seriesName: string | null;
            recurrencePattern: string;
            recurrenceRule: string | null;
            totalOccurrences: number | null;
            occurrencesCreated: number;
        };
        appointmentsCreated: number;
        appointmentsFailed: number;
        appointments: {
            resources: {
                id: string;
                tenantId: string;
                createdBy: string | null;
                updatedBy: string | null;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                startTime: Date;
                endTime: Date;
                notes: string | null;
                resourceType: string;
                resourceId: string;
                appointmentId: string;
                resourceRole: string | null;
                preparationStart: Date | null;
                cleanupEnd: Date | null;
            }[];
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            spaceId: string | null;
            staffId: string | null;
            appointmentType: string;
            endTime: Date;
            duration: number;
            notes: string | null;
            visitType: string | null;
            linkedEncounterId: string | null;
            seriesId: string | null;
            cancellationReason: string | null;
            rescheduleReason: string | null;
        }[];
    }>;
    /**
     * GET /scheduling/appointments/series/:id - Get appointment series with all appointments
     */
    getAppointmentSeries(seriesId: string, req: any): Promise<{
        appointments: ({
            resources: {
                id: string;
                tenantId: string;
                createdBy: string | null;
                updatedBy: string | null;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                startTime: Date;
                endTime: Date;
                notes: string | null;
                resourceType: string;
                resourceId: string;
                appointmentId: string;
                resourceRole: string | null;
                preparationStart: Date | null;
                cleanupEnd: Date | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            spaceId: string | null;
            staffId: string | null;
            appointmentType: string;
            endTime: Date;
            duration: number;
            notes: string | null;
            visitType: string | null;
            linkedEncounterId: string | null;
            seriesId: string | null;
            cancellationReason: string | null;
            rescheduleReason: string | null;
        })[];
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            displayName: string | null;
            phoneNumber: string | null;
            email: string | null;
        };
        id: string;
        tenantId: string;
        patientId: string;
        startDate: Date;
        endDate: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentType: string;
        seriesName: string | null;
        recurrencePattern: string;
        recurrenceRule: string | null;
        totalOccurrences: number | null;
        occurrencesCreated: number;
    }>;
    /**
     * POST /scheduling/appointments/series/:id/pause - Pause appointment series
     */
    pauseAppointmentSeries(seriesId: string, req: any): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        startDate: Date;
        endDate: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentType: string;
        seriesName: string | null;
        recurrencePattern: string;
        recurrenceRule: string | null;
        totalOccurrences: number | null;
        occurrencesCreated: number;
    }>;
    /**
     * POST /scheduling/appointments/series/:id/resume - Resume appointment series
     */
    resumeAppointmentSeries(seriesId: string, req: any): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        startDate: Date;
        endDate: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentType: string;
        seriesName: string | null;
        recurrencePattern: string;
        recurrenceRule: string | null;
        totalOccurrences: number | null;
        occurrencesCreated: number;
    }>;
    /**
     * POST /scheduling/appointments/series/:id/cancel - Cancel entire appointment series
     */
    cancelAppointmentSeries(seriesId: string, dto: CancelAppointmentSeriesDto, req: any): Promise<{
        success: boolean;
        message: string;
        appointmentsCancelled: number;
    }>;
    /**
     * GET /scheduling/appointments/patients/:patientId - Get patient appointments
     */
    getPatientAppointments(patientId: string, startDate?: string, endDate?: string, status?: string, includeResources?: string, req?: any): Promise<({
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    })[]>;
    /**
     * GET /scheduling/appointments/facilities/:facilityId - Get facility appointments
     */
    getFacilityAppointments(facilityId: string, startDate: string, endDate: string, status?: string, includeResources?: string, req?: any): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            displayName: string | null;
        };
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    })[]>;
    /**
     * GET /scheduling/appointments/facility/current - Get appointments for current facility
     * Convenience endpoint that uses the user's facility from context
     */
    getCurrentFacilityAppointments(startDate: string, endDate: string, status?: string, includeResources?: string, req?: any): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            displayName: string | null;
        };
        resources: {
            id: string;
            tenantId: string;
            createdBy: string | null;
            updatedBy: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            notes: string | null;
            resourceType: string;
            resourceId: string;
            appointmentId: string;
            resourceRole: string | null;
            preparationStart: Date | null;
            cleanupEnd: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        startTime: Date;
        spaceId: string | null;
        staffId: string | null;
        appointmentType: string;
        endTime: Date;
        duration: number;
        notes: string | null;
        visitType: string | null;
        linkedEncounterId: string | null;
        seriesId: string | null;
        cancellationReason: string | null;
        rescheduleReason: string | null;
    })[]>;
}
//# sourceMappingURL=appointment.controller.d.ts.map