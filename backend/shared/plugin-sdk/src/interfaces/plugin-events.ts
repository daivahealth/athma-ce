export interface EncounterCreatedEvent {
  encounterId: string;
  patientId: string;
  encounterType: string;
  tenantId: string;
  facilityId: string;
  providerId?: string;
}

export interface EncounterStatusChangedEvent {
  encounterId: string;
  patientId: string;
  encounterType: string;
  oldStatus: string;
  newStatus: string;
  tenantId: string;
}

export interface ObservationCreatedEvent {
  observationId: string;
  encounterId: string;
  patientId: string;
  code: string;
  value: unknown;
  tenantId: string;
}

export interface PrescriptionCreatedEvent {
  prescriptionId: string;
  encounterId: string;
  patientId: string;
  medicationCode: string;
  tenantId: string;
}

export const PLUGIN_EVENTS = {
  ENCOUNTER_CREATED: 'encounter.created',
  ENCOUNTER_STATUS_CHANGED: 'encounter.statusChanged',
  OBSERVATION_CREATED: 'observation.created',
  PRESCRIPTION_CREATED: 'prescription.created',
} as const;
