export enum ChecklistCategory {
  DISCHARGE = 'DISCHARGE',
  SURGERY = 'SURGERY',
  PRE_OPERATIVE = 'PRE_OPERATIVE',
  POST_OPERATIVE = 'POST_OPERATIVE',
  ADMISSION = 'ADMISSION',
  TRANSFER = 'TRANSFER',
  OUTPATIENT_VISIT = 'OUTPATIENT_VISIT',
  PROCEDURE = 'PROCEDURE',
  EMERGENCY = 'EMERGENCY',
  ANESTHESIA = 'ANESTHESIA',
  INFECTION_CONTROL = 'INFECTION_CONTROL',
  FALL_PREVENTION = 'FALL_PREVENTION',
  PAIN_MANAGEMENT = 'PAIN_MANAGEMENT',
  WOUND_CARE = 'WOUND_CARE',
  CUSTOM = 'CUSTOM',
}

export enum ChecklistTemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum ChecklistItemType {
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  NUMBER = 'NUMBER',
  SELECT_SINGLE = 'SELECT_SINGLE',
  SELECT_MULTIPLE = 'SELECT_MULTIPLE',
  STAFF_SELECTOR = 'STAFF_SELECTOR',
  SECTION_HEADER = 'SECTION_HEADER',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export enum ChecklistInstanceStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CANCELLED = 'CANCELLED',
}

export enum ChecklistContext {
  INPATIENT_ADMISSION = 'INPATIENT_ADMISSION',
  OUTPATIENT_ENCOUNTER = 'OUTPATIENT_ENCOUNTER',
  STANDALONE = 'STANDALONE',
  CARE_CHANNEL = 'CARE_CHANNEL',
}

export interface ChecklistTemplateItem {
  id: string;
  itemKey: string;
  itemType: ChecklistItemType;
  label: string;
  helpText?: string | null;
  placeholder?: string | null;
  sectionName?: string | null;
  sortOrder: number;
  isRequired: boolean;
  options?: {
    values: string[];
    labels?: Record<string, string>;
  } | null;
  showIfCondition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
    value: any;
  } | null;
}

export interface ChecklistTemplate {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  category: ChecklistCategory;
  version: number;
  status: ChecklistTemplateStatus;
  applicableToInpatient?: boolean;
  applicableToOutpatient?: boolean;
  requiresAllItems?: boolean;
  minimumCompletionPercent?: number | null;
  requiresVerification?: boolean;
  verificationRoles?: string[];
  allowSelfVerification?: boolean;
  autoCreateEnabled?: boolean;
  autoCreateOn?: string[];
  autoCreateDueHours?: number | null;
  allowedRoles?: string[];
  estimatedMinutes?: number | null;
  items?: ChecklistTemplateItem[];
  _count?: {
    items?: number;
    instances?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface ChecklistInstanceResponse {
  id: string;
  instanceId: string;
  templateItemId: string;
  valueBoolean?: boolean | null;
  valueText?: string | null;
  valueNumber?: number | null;
  valueDate?: string | null;
  valueDatetime?: string | null;
  valueTime?: string | null;
  valueJson?: any;
  answeredBy?: string | null;
  answeredAt?: string | null;
  templateItem?: ChecklistTemplateItem;
}

export interface ChecklistInstance {
  id: string;
  templateId: string;
  patientId: string;
  encounterId?: string | null;
  admissionId?: string | null;
  careChannelId?: string | null;
  channelMessageId?: string | null;
  context: ChecklistContext;
  status: ChecklistInstanceStatus;
  completionPercent: number;
  dueAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  verifiedAt?: string | null;
  completedBy?: string | null;
  verifiedBy?: string | null;
  template?: ChecklistTemplate;
  responses?: ChecklistInstanceResponse[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CreateChecklistTemplateRequest {
  code: string;
  name: string;
  description?: string;
  category: ChecklistCategory;
  status?: ChecklistTemplateStatus;
  applicableToInpatient?: boolean;
  applicableToOutpatient?: boolean;
  requiresAllItems?: boolean;
  minimumCompletionPercent?: number;
  requiresVerification?: boolean;
  verificationRoles?: string[];
  allowSelfVerification?: boolean;
  autoCreateEnabled?: boolean;
  autoCreateOn?: string[];
  autoCreateDueHours?: number;
  estimatedMinutes?: number;
  items?: ChecklistTemplateItem[];
}

export interface CreateChecklistTemplateItemRequest {
  itemKey: string;
  itemType: ChecklistItemType;
  label: string;
  helpText?: string;
  placeholder?: string;
  sectionName?: string;
  sortOrder?: number;
  isRequired?: boolean;
  options?: any;
  showIfCondition?: any;
}

export interface CreateChecklistInstanceRequest {
  templateId: string;
  patientId: string;
  encounterId?: string;
  admissionId?: string;
  careChannelId?: string;
  context?: ChecklistContext;
  dueAt?: string;
}

export interface SaveChecklistResponseRequest {
  templateItemId: string;
  value: any;
}

export interface BulkSaveChecklistResponseRequest {
  responses: SaveChecklistResponseRequest[];
}

export interface ListChecklistInstancesQuery {
  admissionId?: string;
  careChannelId?: string;
  patientId?: string;
  status?: ChecklistInstanceStatus;
  context?: ChecklistContext;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationMeta {
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface PaginatedChecklistTemplates {
  data: ChecklistTemplate[];
  meta: PaginationMeta;
}

export interface ChecklistTemplateFilters {
  category?: string;
  status?: string;
  applicableToInpatient?: boolean;
  applicableToOutpatient?: boolean;
  skip?: number;
  take?: number;
}
