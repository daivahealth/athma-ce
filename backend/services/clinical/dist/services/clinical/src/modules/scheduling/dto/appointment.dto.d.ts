/**
 * Appointment DTOs
 */
export declare class PreferredResourceDto {
    type: 'staff' | 'equipment' | 'space';
    id: string;
    role?: string;
}
export declare class PreferredTimeDto {
    hour: number;
    minute: number;
}
export declare class BookAppointmentDto {
    patientId: string;
    appointmentType: string;
    startTime: Date;
    endTime: Date;
    facilityId?: string;
    spaceId?: string;
    staffId?: string;
    preferredResources?: PreferredResourceDto[];
    notes?: string;
    visitType?: string;
    autoAllocateResources?: boolean;
}
export declare class AllocateResourceDto {
    appointmentId: string;
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    resourceRole?: string;
    startTime: Date;
    endTime: Date;
    preparationStart?: Date;
    cleanupEnd?: Date;
}
export declare class RescheduleAppointmentDto {
    newStartTime: Date;
    newEndTime: Date;
    reason?: string;
}
export declare class CancelAppointmentDto {
    reason?: string;
}
export declare class CreateAppointmentSeriesDto {
    patientId: string;
    seriesName?: string;
    appointmentType: string;
    recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
    recurrenceRule: string;
    startDate: Date;
    endDate?: Date;
    totalOccurrences?: number;
    preferredTime: PreferredTimeDto;
    durationMinutes: number;
    facilityId?: string;
    preferredResources?: PreferredResourceDto[];
    notes?: string;
}
export declare class CancelAppointmentSeriesDto {
    reason: string;
}
export declare class GetPatientAppointmentsDto {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    includeResources?: boolean;
}
export declare class GetFacilityAppointmentsDto {
    startDate: Date;
    endDate: Date;
    facilityId?: string;
    status?: string;
    includeResources?: boolean;
}
//# sourceMappingURL=appointment.dto.d.ts.map