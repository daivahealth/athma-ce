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
  resourceDisplayName?: string | null;
  resourceRole?: string;
  startTime: string;
  endTime: string;
  preparationStart?: string;
  cleanupEnd?: string;
  allocationStatus?: string;
  status?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patientDisplay?: PatientDisplayDto;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    mrn?: string;
    gender?: string;
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

// ========================================
// CALENDAR TYPES
// ========================================

export interface PatientDisplayDto {
  patientId: string;
  mrn: string;
  displayName: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  phoneNumber?: string;
  email?: string;
  nationalId?: string;
  nationalIdType?: string;
  nationality?: string;
  preferredLanguage?: string;
}

export interface CalendarEvent {
  id: string;
  type: 'appointment' | 'encounter';
  source: 'appointment' | 'walk-in' | 'emergency' | 'telemedicine';
  staffId: string;
  patientId: string;
  patientDisplay: PatientDisplayDto;
  startTime: string;
  endTime: string | null;
  status: string;

  // Appointment-specific fields
  appointmentId?: string;
  appointmentType?: string;
  appointmentStatus?: string;
  visitType?: string;
  duration?: number;
  notes?: string;

  // Encounter-specific fields
  encounterId?: string;
  encounterNumber?: string;
  encounterClass?: string;
  encounterType?: string;
  encounterStatus?: string;
  priority?: string;
  encounterSource?: string;

  // Link between appointment and encounter
  linkedAppointmentId?: string;
  linkedEncounterIds?: string[];

  // Additional metadata
  createdAt: string;
  updatedAt: string;
}

export interface StaffCalendarFilters {
  startDate?: string;
  endDate?: string;
}
