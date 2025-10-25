// PMS-specific types and interfaces

export interface PatientWithTranslations {
  id: string;
  emiratesId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'unknown';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
  nationality: string;
  preferredLanguage: string;
  phoneNumber?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emirate?: 'Abu Dhabi' | 'Dubai' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah';
  postalCode?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    expiryDate?: Date;
    copayAmount?: number;
    copayType?: 'fixed' | 'percentage';
  };
  status: 'active' | 'inactive' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  translations?: Array<{
    id: string;
    fieldName: string;
    languageCode: string;
    translatedText: string;
  }>;
}

export interface PatientMedicalHistory {
  patientId: string;
  appointments: any[];
  encounters: any[];
  diagnoses: any[];
  medications: any[];
  allergies: any[];
  immunizations: any[];
  vitals: any[];
  labResults: any[];
  imagingResults: any[];
  summary: {
    totalVisits: number;
    lastVisit?: Date;
    primaryDiagnoses: string[];
    currentMedications: string[];
    knownAllergies: string[];
  };
}

export interface AppointmentWithDetails {
  id: string;
  patientId: string;
  facilityId: string;
  spaceId?: string;
  staffId?: string;
  appointmentType: string;
  status: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  visitType?: string;
  linkedEncounterId?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: PatientWithTranslations;
  staff?: any;
  facility?: any;
  space?: any;
}

export interface EncounterWithDetails {
  id: string;
  patientId: string;
  facilityId: string;
  appointmentId?: string;
  primaryStaffId: string;
  encounterClass: string;
  status: string;
  priority: string;
  startTime: Date;
  endTime?: Date;
  encounterSource: 'appointment' | 'walk_in' | 'emergency' | 'telemedicine';
  walkInDetails?: any;
  chiefComplaint?: string;
  presentingSymptoms?: string;
  vitalSigns?: any;
  allergies?: string[];
  currentMedications?: string[];
  medicalHistory?: string;
  socialHistory?: string;
  familyHistory?: string;
  notes?: string;
  dischargeDisposition?: string;
  followUpInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: PatientWithTranslations;
  primaryStaff?: any;
  facility?: any;
  appointment?: AppointmentWithDetails;
  clinicalNotes?: any[];
  vitals?: any[];
  orders?: any[];
}

export interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
  duration: number;
  available: boolean;
  reason?: string;
}

export interface StaffMember {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'unknown';
  nationality: string;
  phoneNumber?: string;
  email?: string;
  employeeId: string;
  staffType: 'doctor' | 'nurse' | 'technician' | 'admin' | 'support';
  specialties?: string[];
  licenseNumber?: string;
  licenseExpiry?: Date;
  status: 'active' | 'inactive' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  tenantId: string;
  name: string;
  facilityType: 'clinic' | 'hospital' | 'diagnostic_center' | 'surgery_center' | 'pharmacy';
  licenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emirate?: 'Abu Dhabi' | 'Dubai' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah';
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  operatingHours?: any;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Space {
  id: string;
  tenantId: string;
  facilityId: string;
  name: string;
  spaceType: 'consultation_room' | 'procedure_room' | 'operating_room' | 'lab' | 'imaging' | 'waiting_area' | 'reception' | 'pharmacy';
  capacity?: number;
  equipment?: string[];
  amenities?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Search and filtering interfaces
export interface SearchFilters {
  query?: string;
  fields?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: string;
  type?: string;
  facilityId?: string;
  staffId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// Analytics and reporting interfaces
export interface AppointmentStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byStaff: Record<string, number>;
  byFacility: Record<string, number>;
  averageDuration: number;
  noShowRate: number;
  cancellationRate: number;
  utilizationRate: number;
}

export interface EncounterStats {
  total: number;
  byStatus: Record<string, number>;
  byClass: Record<string, number>;
  bySource: Record<string, number>;
  byStaff: Record<string, number>;
  byFacility: Record<string, number>;
  averageDuration: number;
  averageWaitTime: number;
  walkInRate: number;
}

// Notification interfaces
export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_cancellation' | 'encounter_ready' | 'lab_results';
  channels: ('sms' | 'email' | 'push')[];
  template: {
    subject?: string;
    body: string;
    variables: string[];
  };
  isActive: boolean;
}

export interface NotificationRequest {
  patientId: string;
  templateId: string;
  channels: ('sms' | 'email' | 'push')[];
  variables: Record<string, any>;
  scheduledFor?: Date;
}

// Integration interfaces
export interface HIEIntegration {
  platformId: string;
  patientId: string;
  resourceType: string;
  resourceId: string;
  syncStatus: 'pending' | 'synced' | 'failed' | 'conflict';
  lastSyncAt?: Date;
  metadata?: Record<string, any>;
}

// Audit interfaces
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  userId: string;
  timestamp: Date;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Error interfaces
export interface PmsValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PmsApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId: string;
}







