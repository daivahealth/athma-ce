// Medication Master
export interface Medication {
  id: string;
  tenantId?: string | null;
  medicationName: string;
  genericName?: string | null;
  brandName?: string | null;
  ndcCode?: string | null;
  atcCode?: string | null;
  localCode?: string | null;
  dosageForm: string;
  strength?: string | null;
  route?: string | null;
  manufacturer?: string | null;
  drugClass?: string | null;
  therapeuticClass?: string | null;
  controlledSubstance: boolean;
  controlledClass?: string | null;
  requiresPrescription: boolean;
  defaultFrequency?: string | null;
  defaultDuration?: string | null;
  contraindications: string[];
  commonSideEffects: string[];
  drugInteractions: string[];
  storageRequirements?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lab Test Master
export interface LabTest {
  id: string;
  tenantId?: string | null;
  testName: string;
  loincCode: string;
  cptCode?: string | null;
  localCode?: string | null;
  testCategory: string;
  testSubcategory?: string | null;
  specimenType: string;
  collectionMethod?: string | null;
  fastingRequired: boolean;
  fastingDurationHours?: number | null;
  preparationInstructions?: string | null;
  normalRangeMale?: string | null;
  normalRangeFemale?: string | null;
  normalRangePediatric?: string | null;
  units?: string | null;
  methodology?: string | null;
  turnaroundTimeHours?: number | null;
  referenceLab?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Imaging Study Master
export interface ImagingStudy {
  id: string;
  tenantId?: string | null;
  studyName: string;
  cptCode?: string | null;
  localCode?: string | null;
  modality: string;
  bodyPart: string;
  studyCategory?: string | null;
  contrastRequired: boolean;
  contrastType?: string | null;
  preparationInstructions?: string | null;
  positioningInstructions?: string | null;
  contraindications: string[];
  radiationDose?: string | null;
  estimatedDurationMinutes?: number | null;
  facilityRequirements?: string | null;
  equipmentRequirements?: string | null;
  radiologistRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Procedure Master
export interface Procedure {
  id: string;
  tenantId?: string | null;
  procedureName: string;
  cptCode?: string | null;
  icd10PcsCode?: string | null;
  localCode?: string | null;
  procedureCategory: string;
  bodySystem: string;
  procedureType?: string | null;
  anesthesiaType?: string | null;
  facilityRequired?: string | null;
  estimatedDurationMinutes?: number | null;
  preparationInstructions?: string | null;
  postProcedureInstructions?: string | null;
  risksAndComplications: string[];
  contraindications: string[];
  consentRequired: boolean;
  consentType?: string | null;
  preProcedureRequirements: string[];
  postProcedureMonitoring?: string | null;
  recoveryTimeHours?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Diagnosis Master
export interface Diagnosis {
  id: string;
  tenantId?: string | null;
  versionId: string;
  code: string;
  codeType?: string | null;
  shortDescription?: string | null;
  description: string;
  chapter?: string | null;
  block?: string | null;
  category?: string | null;
  subcategory?: string | null;
  clinicalConcepts: string[];
  synonyms: string[];
  searchTerms: string[];
  genderRestriction?: string | null;
  ageRange?: string | null;
  isBillable: boolean;
  isActive: boolean;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  createdAt: string;
  updatedAt: string;
  version?: DiagnosisVersion;
}

export interface DiagnosisVersion {
  id: string;
  tenantId?: string | null;
  codeSet: string;
  versionLabel: string;
  releaseDate?: string | null;
  description?: string | null;
  importStatus: string;
  importNotes?: string | null;
  sourceUrl?: string | null;
  checksum?: string | null;
  totalCodes: number;
  importedBy?: string | null;
  importedAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum TemplateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum NoteTemplateType {
  GENERAL = 'GENERAL',
  SOAP = 'SOAP',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  PROGRESS_NOTE = 'PROGRESS_NOTE',
  ADMISSION_NOTE = 'ADMISSION_NOTE',
  CONSULTATION = 'CONSULTATION',
  OPERATIVE_NOTE = 'OPERATIVE_NOTE',
  PROCEDURE_NOTE = 'PROCEDURE_NOTE',
  PHYSICAL_THERAPY = 'PHYSICAL_THERAPY',
  OCCUPATIONAL_THERAPY = 'OCCUPATIONAL_THERAPY',
  NURSING_NOTE = 'NURSING_NOTE',
  PSYCHIATRIC_EVALUATION = 'PSYCHIATRIC_EVALUATION',
  EMERGENCY_DEPARTMENT = 'EMERGENCY_DEPARTMENT',
  FOLLOW_UP = 'FOLLOW_UP',
  TRANSFER_NOTE = 'TRANSFER_NOTE',
  DEATH_NOTE = 'DEATH_NOTE',
  OTHER = 'OTHER',
}

export interface NoteTemplateVersion {
  id: string;
  templateId: string;
  version: number;
  schema: Record<string, any>;
  changeLog?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoteTemplate {
  id: string;
  tenantId?: string | null;
  specialtyId?: string | null;
  name: string;
  description?: string | null;
  templateType: NoteTemplateType;
  status: TemplateStatus;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  versions?: NoteTemplateVersion[];
}

export interface NoteTemplateFilters {
  specialtyId?: string;
  status?: TemplateStatus;
  templateType?: NoteTemplateType;
}

export interface NoteTemplateStatistics {
  total: number;
  byStatus: Record<string, number>;
  byTemplateType: Record<string, number>;
  tenantOwned: number;
  global: number;
}

export interface CreateNoteTemplateInput {
  name: string;
  description?: string;
  templateType?: NoteTemplateType;
  specialtyId?: string;
  status?: TemplateStatus;
  schema: Record<string, any>;
  changeLog?: string;
}

// Filters
export interface CatalogFilters {
  tenantId?: string;
  isActive?: boolean;
  search?: string;
  procedureCategory?: string;
  includeGlobal?: boolean;
}

export interface DiagnosisFilters extends Omit<CatalogFilters, 'includeGlobal'> {
  versionId?: string;
  codeSet?: string;
}

export interface DiagnosisVersionFilters {
  tenantId?: string;
  codeSet?: string;
  importStatus?: string;
  isActive?: boolean;
}
