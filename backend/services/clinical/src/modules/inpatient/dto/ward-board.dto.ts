/**
 * DTOs for Ward Board API
 * Returns bed-centric view with occupancy and admission details
 */

import { InpatientAdmissionStatus, InpatientDischargeStatus, InpatientAcuity } from './create-event.dto';

/**
 * Patient display information for ward board
 * Comprehensive patient info for grid/list display
 */
export interface PatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  dateOfBirth: string; // ISO 8601 date
  gender: string;
  nationalId?: string;
  nationalIdType?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  preferredLanguage?: string;
}

/**
 * Bed information from Foundation service
 */
export interface BedInfo {
  id: string;
  code: string;
  spaceName?: string;
  spaceCode?: string;
}

/**
 * Ward information from Foundation service
 */
export interface WardInfo {
  id: string;
  name: string;
  code?: string;
}

/**
 * Admission details for ward board
 */
export interface WardBoardAdmission {
  admissionId: string;
  encounterId: string;
  patientId: string;
  patientDisplay: PatientDisplay;
  attendingPhysicianId: string;
  attendingPhysicianName?: string; // Resolved from Foundation
  admissionStatus: InpatientAdmissionStatus;
  dischargeStatus: InpatientDischargeStatus;
  acuity: InpatientAcuity;
  boardFlags?: {
    npo?: boolean;
    fallRisk?: 'low' | 'medium' | 'high';
    telemetry?: boolean;
    isolation?: boolean;
    allergies?: boolean;
    dnr?: boolean;
    covid?: boolean;
    [key: string]: any;
  };
  admittedAt: Date;
  expectedDischargeDate?: Date;
}

/**
 * Bed with occupancy status
 */
export interface WardBoardBed {
  bed: BedInfo;
  occupancy: 'occupied' | 'empty' | 'cleaning' | 'reserved';
  admission?: WardBoardAdmission;
  actions: string[]; // e.g., ['TRANSFER', 'MEDS', 'DETAILS'] or ['ADMIT_PATIENT']
}

/**
 * Summary statistics for ward board
 */
export interface WardBoardSummary {
  totalBeds: number;
  occupied: number;
  empty: number;
  cleaning?: number;
  reserved?: number;
  critical?: number;
  pendingDischarge?: number;
}

/**
 * Complete Ward Board Response
 */
export interface WardBoardResponse {
  ward: WardInfo;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

/**
 * Query parameters for Ward Board endpoint
 */
export interface WardBoardQueryDto {
  facilityId: string;
  wardId: string;
  includeEmpty?: boolean; // Default true
  statusFilter?: InpatientAdmissionStatus[]; // Filter by admission status
  acuityFilter?: InpatientAcuity[]; // Filter by acuity
}
