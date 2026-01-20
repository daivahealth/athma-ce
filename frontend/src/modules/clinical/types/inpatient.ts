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

export enum DischargeTransactionStatus {
  PLANNING = 'PLANNING',
  READY = 'READY',
  APPROVED = 'APPROVED',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
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

export interface InitiateDischargeInput {
  targetDischargeDate?: string;
  targetDischargeTime?: string;
  approvalRequired?: boolean;
  internalNotes?: string;
}

export interface MarkDischargeReadyInput {
  readyRemarks?: string;
}

export interface ApproveDischargeInput {
  approvalRemarks?: string;
}

export interface ExecuteDischargeInput {
  dischargeType: DischargeType;
  dischargeDestination: DischargeDestination;
  dischargeDisposition?: string;
  dischargeSummaryId?: string;
  finalDiagnosis?: unknown;
  dischargeMedications?: unknown;
  followUpInstructions?: string;
  followUpAppointments?: unknown;
  dietInstructions?: string;
  activityRestrictions?: string;
}

export interface CancelDischargeInput {
  cancellationReason: string;
}

export interface DischargeTransaction {
  id: string;
  admissionId: string;
  status: DischargeTransactionStatus | string;
  approvalRequired?: boolean | null;
  targetDischargeDate?: string | null;
  targetDischargeTime?: string | null;
  internalNotes?: string | null;
  readyRemarks?: string | null;
  approvalRemarks?: string | null;
  cancellationReason?: string | null;
  dischargeType?: DischargeType | string | null;
  dischargeDestination?: DischargeDestination | string | null;
  dischargeDisposition?: string | null;
  dischargeSummaryId?: string | null;
  followUpInstructions?: string | null;
  dietInstructions?: string | null;
  activityRestrictions?: string | null;
  initiatedAt?: string | null;
  readyAt?: string | null;
  approvedAt?: string | null;
  executedAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateDischargeChecklistInput {
  // Medical Clearance
  medicalClearance?: boolean;
  medicalClearedBy?: string;
  medicalClearedAt?: string;

  // Medications
  medicationsReconciled?: boolean;
  dischargePrescriptionsIssued?: boolean;

  // Follow-up Care
  followUpAppointmentScheduled?: boolean;
  followUpAppointmentDate?: string;
  followUpPhysician?: string;

  // Patient Education
  dischargInstructionsProvided?: boolean;
  patientEducationCompleted?: boolean;
  educationTopics?: string[];

  // Equipment & Supplies
  dmeOrdered?: boolean;
  dmeDescription?: string;
  homeHealthOrdered?: boolean;
  homeHealthAgency?: string;

  // Transportation
  transportationArranged?: boolean;
  transportationMode?: string;

  // Administrative
  billingCleared?: boolean;
  insuranceNotified?: boolean;
  medicalRecordsCompleted?: boolean;

  // Overall Status
  readyForDischarge?: boolean;
  dischargeCoordinator?: string;

  // Notes
  notes?: string;
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

export interface DischargeChecklist {
  id: string;
  tenantId: string;
  admissionId: string;
  patientId: string;

  // Medical Clearance
  medicalClearance: boolean;
  medicalClearedBy?: string;
  medicalClearedAt?: string;

  // Medications
  medicationsReconciled: boolean;
  dischargePrescriptionsIssued: boolean;

  // Follow-up Care
  followUpAppointmentScheduled: boolean;
  followUpAppointmentDate?: string;
  followUpPhysician?: string;

  // Patient Education
  dischargInstructionsProvided: boolean;
  patientEducationCompleted: boolean;
  educationTopics: string[];

  // Equipment & Supplies
  dmeOrdered: boolean;
  dmeDescription?: string;
  homeHealthOrdered: boolean;
  homeHealthAgency?: string;

  // Transportation
  transportationArranged: boolean;
  transportationMode?: string;

  // Administrative
  billingCleared: boolean;
  insuranceNotified: boolean;
  medicalRecordsCompleted: boolean;

  // Overall Status
  readyForDischarge: boolean;
  dischargeCoordinator?: string;

  // Notes
  notes?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

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

import { PatientDisplayDto } from '../../../../../backend/contracts/src/types/patient';

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


export interface WardBoardAdmission {
  admissionId?: string;
  encounterId?: string;
  patientId?: string;
  patientDisplay?: PatientDisplayDto;
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
