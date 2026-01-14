export enum AdmissionType {
  ELECTIVE = 'elective',
  EMERGENCY = 'emergency',
  MATERNITY = 'maternity',
  DAY_CASE = 'day_case',
  TRANSFER = 'transfer',
}

export enum AdmissionSource {
  EMERGENCY_ROOM = 'emergency_room',
  OUTPATIENT_DEPT = 'outpatient_dept',
  TRANSFER_IN = 'transfer_in',
  DIRECT = 'direct',
  PHYSICIAN_REFERRAL = 'physician_referral',
}

export enum IsolationType {
  CONTACT = 'contact',
  DROPLET = 'droplet',
  AIRBORNE = 'airborne',
  PROTECTIVE = 'protective',
}

export enum VitalsFrequency {
  Q1H = 'q1h',
  Q2H = 'q2h',
  Q4H = 'q4h',
  Q8H = 'q8h',
  Q12H = 'q12h',
  DAILY = 'daily',
}

export enum TransferType {
  CLINICAL_NEED = 'clinical_need',
  BED_AVAILABILITY = 'bed_availability',
  PATIENT_REQUEST = 'patient_request',
  INFECTION_CONTROL = 'infection_control',
}

export enum DischargeType {
  ROUTINE = 'routine',
  AGAINST_MEDICAL_ADVICE = 'against_medical_advice',
  TRANSFER = 'transfer',
  DECEASED = 'deceased',
  ABSCONDED = 'absconded',
}

export enum DischargeDestination {
  HOME = 'home',
  TRANSFER_FACILITY = 'transfer_facility',
  NURSING_HOME = 'nursing_home',
  REHABILITATION = 'rehabilitation',
  DECEASED = 'deceased',
}

export enum InpatientEventType {
  ADMISSION_CREATED = 'admission_created',
  BED_ASSIGNED = 'bed_assigned',
  PATIENT_TRANSFERRED = 'patient_transferred',
  ALERT_RAISED = 'alert_raised',
  VITALS_RECORDED = 'vitals_recorded',
  DISCHARGE_INITIATED = 'discharge_initiated',
  DISCHARGE_COMPLETED = 'discharge_completed',
}

export enum EventCategory {
  ADMISSION = 'admission',
  TRANSFER = 'transfer',
  CLINICAL = 'clinical',
  DISCHARGE = 'discharge',
  ALERT = 'alert',
}

export interface CreateAdmissionInput {
  patientId: string;
  encounterId?: string;
  admissionDate: string;
  admissionType: AdmissionType;
  admissionSource: AdmissionSource;
  attendingPhysicianId: string;
  primaryNurseId?: string;
  initialWardId: string;
  initialBedId: string;
  clinicalAlerts?: string[];
  isolationType?: IsolationType;
  fallRiskScore?: number;
  vitalsFrequency?: VitalsFrequency;
  insuranceAuthNumber?: string;
  estimatedCost?: number;
}

export interface UpdateAdmissionInput {
  attendingPhysicianId?: string;
  primaryNurseId?: string;
  clinicalAlerts?: string[];
  isolationType?: IsolationType;
  fallRiskScore?: number;
  vitalsFrequency?: VitalsFrequency;
  expectedDischargeDate?: string;
  dischargeNotes?: string;
  insuranceAuthNumber?: string;
  estimatedCost?: number;
}

export interface TransferPatientInput {
  toWardId: string;
  toBedId: string;
  transferReason: string;
  transferType: TransferType;
  notes?: string;
}

export interface DischargePatientInput {
  actualDischargeDate: string;
  dischargeType: DischargeType;
  dischargeDestination: DischargeDestination;
  dischargeNotes?: string;
}

export interface UpdateDischargeChecklistInput {
  clinicalSummaryCompleted?: boolean;
  dischargeMedicationsOrdered?: boolean;
  followUpAppointmentBooked?: boolean;
  patientEducationProvided?: boolean;
  billingCleared?: boolean;
  transportArranged?: boolean;
  medicalRecordsFinalized?: boolean;
  notes?: string;
  readyForDischarge?: boolean;
}

export interface CreateInpatientEventInput {
  eventType: InpatientEventType;
  eventCategory: EventCategory;
  eventData: Record<string, unknown>;
  notes?: string;
}

export enum AdmissionStatus {
  ADMITTED = 'admitted',
  TRANSFERRED = 'transferred',
  DISCHARGED = 'discharged',
  DECEASED = 'deceased',
  ABSCONDED = 'absconded',
}

export interface SearchAdmissionsParams {
  searchTerm?: string;
  patientName?: string;
  mrn?: string;
  admissionNumber?: string;
  status?: AdmissionStatus;
  admissionDateFrom?: string;
  admissionDateTo?: string;
  admissionDate?: string;
  wardId?: string;
  attendingPhysicianId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type InpatientAdmission = Record<string, unknown>;
export type InpatientEvent = Record<string, unknown>;
export type DischargeChecklist = Record<string, unknown>;

export interface TransferHistoryEntry {
  id: string;
  tenantId: string;
  admissionId: string;
  patientId: string;
  bedId: string;
  wardId: string;
  spaceId: string;
  assignedAt: string;
  assignedBy: string;
  releasedAt: string | null;
  releasedBy: string | null;
  isTransfer: boolean;
  transferReason: string | null;
  transferType: string | null;
  notes: string | null;
}

export interface BedBoardResponse {
  ward: WardBoardWard;
  beds: WardBoardBed[];
  admissions?: InpatientAdmission[];
  summary: WardBoardSummary;
}

export interface AdmissionsSearchResponse {
  data: InpatientAdmission[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export type WardDashboardResponse = Record<string, unknown>;
export type WardPatientsResponse = InpatientAdmission[];

export type WardBoardOccupancy = 'occupied' | 'empty' | 'cleaning' | string;
export type WardBoardAction = 'TRANSFER' | 'MEDS' | 'DETAILS' | 'ADMIT_PATIENT' | 'CONFIRM_DISCHARGE' | string;

export interface WardBoardWard {
  id?: string;
  name?: string;
  code?: string;
}

export interface WardBoardSummary {
  totalBeds?: number;
  occupied?: number;
  empty?: number;
  cleaning?: number;
  critical?: number;
  pendingDischarge?: number;
}

export interface WardBoardFlags {
  fallRisk?: boolean | string;
  telemetry?: boolean;
  npo?: boolean;
  isolation?: boolean;
  isolationType?: string;
  allergies?: string[];
}

export interface WardBoardPatientDisplay {
  patientId?: string;
  mrn?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  nationalIdType?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  preferredLanguage?: string;
}

export interface WardBoardAdmission {
  admissionId?: string;
  encounterId?: string;
  patientId?: string;
  patientDisplay?: WardBoardPatientDisplay;
  attendingPhysicianId?: string;
  admissionStatus?: string;
  dischargeStatus?: string;
  acuity?: string;
  boardFlags?: WardBoardFlags;
  admittedAt?: string;
  expectedDischargeDate?: string;
  attendingPhysicianName?: string;
  attendingPhysician?: string;
  primaryNurse?: string;
}

export interface WardBoardBedInfo {
  id?: string;
  code?: string;
  spaceName?: string;
}

export interface WardBoardBed {
  bed?: WardBoardBedInfo;
  occupancy?: WardBoardOccupancy;
  admission?: WardBoardAdmission | null;
  actions?: WardBoardAction[];
}

export interface FacilitySummary {
  totalWards?: number;
  totalBeds?: number;
  occupied?: number;
  empty?: number;
  cleaning?: number;
  reserved?: number;
  critical?: number;
  pendingDischarge?: number;
  occupancyRate?: number;
}

export interface WardBoardData {
  ward: WardBoardWard;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

export interface MultiWardBoardResponse {
  facilityId: string;
  summary: FacilitySummary;
  wards: WardBoardData[];
  timestamp: string;
}
