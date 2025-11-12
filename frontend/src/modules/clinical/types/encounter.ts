/**
 * Encounter Types
 * Matches backend Encounter model from Clinical database
 */

import type { Patient } from './patient';
import type { Appointment } from './scheduling';

export enum EncounterClass {
  AMB = 'AMB', // Ambulatory
  EMER = 'EMER', // Emergency
  FLD = 'FLD', // Field
  HH = 'HH', // Home Health
  IMP = 'IMP', // Inpatient Encounter
  ACUTE = 'ACUTE', // Inpatient Acute
  NONAC = 'NONAC', // Inpatient Non-acute
  OBSENC = 'OBSENC', // Observation Encounter
  PRENC = 'PRENC', // Pre-admission
  SS = 'SS', // Short Stay
  VR = 'VR', // Virtual
}

export enum EncounterStatus {
  PLANNED = 'planned',
  ARRIVED = 'arrived',
  TRIAGED = 'triaged',
  IN_PROGRESS = 'in-progress',
  ON_LEAVE = 'onleave',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  ENTERED_IN_ERROR = 'entered-in-error',
  UNKNOWN = 'unknown',
}

export enum EncounterPriority {
  STAT = 'stat',
  ASAP = 'asap',
  URGENT = 'urgent',
  ROUTINE = 'routine',
  ELECTIVE = 'elective',
}

export enum EncounterSource {
  APPOINTMENT = 'appointment',
  WALK_IN = 'walk-in',
  REFERRAL = 'referral',
  EMERGENCY = 'emergency',
  TRANSFER = 'transfer',
}

export interface WalkInDetails {
  arrivalTime?: string;
  arrivalMode?: string;
  reasonForVisit?: string;
}

export interface Encounter {
  id: string;
  encounterNumber: string;
  tenantId: string;
  patientId: string;
  facilityId: string;
  appointmentId?: string;
  primaryStaffId: string;
  encounterClass: string;
  status: string;
  priority: string;
  startTime: string;
  endTime?: string;
  encounterSource: string;
  walkInDetails?: WalkInDetails;
  dischargeDisposition?: string;
  followUpInstructions?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Partial<Patient>;
  appointment?: Partial<Appointment>;
}

export interface CreateEncounterInput {
  patientId: string;
  appointmentId?: string;
  primaryStaffId: string;
  encounterClass?: EncounterClass;
  status?: EncounterStatus;
  priority?: EncounterPriority;
  startTime: string;
  endTime?: string;
  encounterSource?: EncounterSource;
  walkInDetails?: WalkInDetails;
}

export interface UpdateEncounterInput {
  status?: EncounterStatus;
  endTime?: string;
  dischargeDisposition?: string;
  followUpInstructions?: string;
}

export interface SearchEncounterParams {
  patientId?: string;
  primaryStaffId?: string;
  facilityId?: string;
  status?: EncounterStatus;
  encounterClass?: EncounterClass;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}
