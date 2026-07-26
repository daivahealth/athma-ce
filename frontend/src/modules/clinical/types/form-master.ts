/**
 * Types for the OpenMedForm integration: master forms uploaded from OpenMedForm
 * exports, filled by clinicians against a patient + encounter.
 */

export enum FrequencyType {
  EVERY_N_HOURS = 'EVERY_N_HOURS',
  EVERY_N_DAYS = 'EVERY_N_DAYS',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  ONCE_PER_SHIFT = 'ONCE_PER_SHIFT',
  ONCE_PER_ADMISSION = 'ONCE_PER_ADMISSION',
  ONCE_PER_EPISODE = 'ONCE_PER_EPISODE',
  ON_DEMAND = 'ON_DEMAND',
  EVENT_BASED = 'EVENT_BASED',
}

export enum FrequencyUnit {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export enum FormMasterStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum FormResponseStatus {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
}

// The OpenMedForm export bundle shape (opaque beyond the fields we read directly).
export interface OpenMedFormBundle {
  openmedform?: string;
  exportedAt?: string;
  engine: string;
  formCode: string;
  name: string;
  version: string;
  language?: string;
  dataSchema: Record<string, any>;
  uiSchema: Record<string, any>;
  printSchema?: Record<string, any>;
  translations?: Record<string, Record<string, string>>;
  assets?: unknown[];
}

export interface FormMaster {
  id: string;
  tenantId: string;
  facilityId?: string | null;
  formCode: string;
  formVersion: string;
  engine: string;
  name: string;
  language?: string | null;
  status: FormMasterStatus;
  frequencyType: FrequencyType;
  frequencyValue?: number | null;
  frequencyUnit?: FrequencyUnit | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  // Only present on the single-record GET, not the list endpoint.
  bundle?: OpenMedFormBundle;
}

export interface CreateFormMasterInput {
  name?: string;
  language?: string;
  frequencyType: FrequencyType;
  frequencyValue?: number;
  frequencyUnit?: FrequencyUnit;
  bundle: OpenMedFormBundle;
}

export interface UpdateFormMasterInput {
  name?: string;
  status?: FormMasterStatus;
  frequencyType?: FrequencyType;
  frequencyValue?: number;
  frequencyUnit?: FrequencyUnit;
}

export interface FormResponse {
  id: string;
  tenantId: string;
  facilityId?: string | null;
  formMasterId: string;
  formCode: string;
  formVersion: string;
  engine: string;
  patientId: string;
  encounterId: string;
  status: FormResponseStatus;
  data: Record<string, any>;
  completedBy?: string | null;
  completedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  formMaster?: Pick<FormMaster, 'id' | 'name' | 'formCode' | 'formVersion'> & Partial<FormMaster>;
}

export interface CreateFormResponseInput {
  formMasterId: string;
  patientId: string;
  encounterId: string;
}

export interface SaveFormResponseInput {
  data: Record<string, any>;
  status?: FormResponseStatus;
}
