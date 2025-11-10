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

// Filters
export interface CatalogFilters {
  tenantId?: string;
  isActive?: boolean;
  search?: string;
  includeGlobal?: boolean;
}
