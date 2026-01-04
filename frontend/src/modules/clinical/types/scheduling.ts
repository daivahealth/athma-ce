export interface StaffScheduleSummary {
  staffId: string;
  staffDisplayName?: string | null;
  staffType?: string | null;
  employeeId?: string | null;
}

export interface StaffSchedule {
  id: string;
  staffId: string;
  employeeId?: string | null;
  staffDisplayName?: string | null;
  staffType?: string | null;
  facilityId?: string | null;
  facilityCode?: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType: string;
  notes?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffScheduleInput {
  staffId: string;
  employeeId?: string;
  staffDisplayName?: string;
  staffType?: string;
  facilityId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType?: string;
  notes?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface UpdateStaffScheduleInput {
  employeeId?: string;
  staffDisplayName?: string | null;
  staffType?: string;
  facilityId?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
  scheduleType?: string;
  notes?: string | null;
  effectiveFrom?: string;
  effectiveTo?: string | null;
}

export interface CreateWeeklyStaffScheduleInput {
  staffId: string;
  employeeId?: string;
  staffDisplayName?: string;
  staffType?: string;
  days: number[];
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType?: string;
  facilityId?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  notes?: string;
}

export interface StaffScheduleFilters {
  effectiveDate?: string;
  includeExpired?: boolean;
  facilityId?: string;
}

// ========================================
// APPOINTMENT TYPES
// ========================================

export interface PreferredResource {
  type: 'staff' | 'equipment' | 'space';
  id: string;
  role?: string;
}

export interface AppointmentResource {
  id: string;
  appointmentId: string;
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  resourceRole?: string;
  startTime: string;
  endTime: string;
  preparationStart?: string;
  cleanupEnd?: string;
  allocationStatus: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
  };
  appointmentType: string;
  startTime: string;
  endTime: string;
  facilityId?: string;
  spaceId?: string;
  staffId?: string;
  status: string;
  appointmentSeriesId?: string;
  notes?: string;
  visitType?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  resources?: AppointmentResource[];
}

export interface BookAppointmentInput {
  patientId: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  facilityId?: string;
  spaceId?: string;
  staffId?: string;
  preferredResources?: PreferredResource[];
  notes?: string;
  visitType?: string;
  autoAllocateResources?: boolean;
}

export interface RescheduleAppointmentInput {
  newStartTime: string;
  newEndTime: string;
  reason?: string;
}

export interface CancelAppointmentInput {
  reason?: string;
}

export interface AllocateResourceInput {
  appointmentId: string;
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  resourceRole?: string;
  startTime: string;
  endTime: string;
  preparationStart?: string;
  cleanupEnd?: string;
}

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  includeResources?: boolean;
}

export interface AppointmentSeries {
  id: string;
  tenantId: string;
  patientId: string;
  seriesName?: string;
  appointmentType: string;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrenceRule: string;
  startDate: string;
  endDate?: string;
  totalOccurrences?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
}

export interface CreateAppointmentSeriesInput {
  patientId: string;
  seriesName?: string;
  appointmentType: string;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrenceRule: string;
  startDate: string;
  endDate?: string;
  totalOccurrences?: number;
  preferredTime: {
    hour: number;
    minute: number;
  };
  durationMinutes: number;
  facilityId?: string;
  preferredResources?: PreferredResource[];
  notes?: string;
}
