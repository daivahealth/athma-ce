/**
 * Appointment Service
 *
 * Manages appointment booking with multi-resource coordination
 */
import { PrismaService } from '@zeal/database-clinical';
import { AvailabilityService } from './availability.service';
export interface RequestContext {
    userId: string;
    tenantId: string;
    facilityId: string;
    userRole: string;
}
export interface BookAppointmentDto {
    patientId: string;
    appointmentType: string;
    startTime: Date;
    endTime: Date;
    facilityId?: string;
    spaceId?: string;
    staffId?: string;
    preferredResources?: Array<{
        type: 'staff' | 'equipment' | 'space';
        id: string;
        role?: string;
    }>;
    notes?: string;
    visitType?: string;
    autoAllocateResources?: boolean;
}
export interface RescheduleAppointmentDto {
    appointmentId: string;
    newStartTime: Date;
    newEndTime: Date;
    reason?: string;
}
export interface CancelAppointmentDto {
    appointmentId: string;
    reason?: string;
}
export interface CreateAppointmentSeriesDto {
    patientId: string;
    seriesName?: string;
    appointmentType: string;
    recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
    recurrenceRule: string;
    startDate: Date;
    endDate?: Date;
    totalOccurrences?: number;
    preferredTime: {
        hour: number;
        minute: number;
    };
    durationMinutes: number;
    facilityId?: string;
    preferredResources?: Array<{
        type: 'staff' | 'equipment' | 'space';
        id: string;
        role?: string;
    }>;
    notes?: string;
}
export interface AllocateResourceDto {
    appointmentId: string;
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    resourceRole?: string;
    startTime: Date;
    endTime: Date;
    preparationStart?: Date;
    cleanupEnd?: Date;
}
export declare class AppointmentService {
    private prisma;
    private availabilityService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService);
    /**
     * Book an appointment with automatic or manual resource allocation
     */
    bookAppointment(dto: BookAppointmentDto, context: RequestContext): Promise<{
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
     * Allocate a resource to an appointment
     */
    allocateResource(dto: AllocateResourceDto, context: RequestContext): Promise<{
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
     * Get appointment with all resources
     */
    getAppointmentWithResources(appointmentId: string, context: RequestContext): Promise<{
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
     * Reschedule an appointment and its resources
     */
    rescheduleAppointment(dto: RescheduleAppointmentDto, context: RequestContext): Promise<{
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
     * Cancel an appointment and release resources
     */
    cancelAppointment(dto: CancelAppointmentDto, context: RequestContext): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Create appointment series (recurring appointments)
     */
    createAppointmentSeries(dto: CreateAppointmentSeriesDto, context: RequestContext): Promise<{
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
     * Get appointment series with all appointments
     */
    getAppointmentSeries(seriesId: string, context: RequestContext): Promise<{
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
     * Pause appointment series (prevents future appointments from being created)
     */
    pauseAppointmentSeries(seriesId: string, context: RequestContext): Promise<{
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
     * Resume appointment series
     */
    resumeAppointmentSeries(seriesId: string, context: RequestContext): Promise<{
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
     * Cancel entire appointment series
     */
    cancelAppointmentSeries(seriesId: string, reason: string, context: RequestContext): Promise<{
        success: boolean;
        message: string;
        appointmentsCancelled: number;
    }>;
    /**
     * Get patient appointments
     */
    getPatientAppointments(patientId: string, context: RequestContext, options?: {
        startDate?: Date;
        endDate?: Date;
        status?: string;
        includeResources?: boolean;
    }): Promise<({
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
     * Get facility appointments for a date range
     */
    getFacilityAppointments(startDate: Date, endDate: Date, context: RequestContext, options?: {
        facilityId?: string;
        status?: string;
        includeResources?: boolean;
    }): Promise<({
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
     * Confirm appointment resource allocation
     */
    confirmResource(resourceId: string, context: RequestContext): Promise<{
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
}
//# sourceMappingURL=appointment.service.d.ts.map