/**
 * Catalog Population Types
 * TypeScript interfaces for the AI catalog population feature.
 */

export type CatalogType =
  | 'value-sets'
  | 'diagnoses'
  | 'medications'
  | 'lab-tests'
  | 'imaging-studies'
  | 'procedures'
  | 'administrative-services'
  | 'note-templates'
  | 'vital-signs-templates'
  | 'checklists';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type DataSource = 'template' | 'ai-enriched' | 'ai-generated';

export interface StartCatalogPopulationRequest {
  countryIso: string;
  catalogTypes?: CatalogType[];
  replaceExisting?: boolean;
}

export interface StartCatalogPopulationResponse {
  jobId: string;
  totalCatalogs: number;
  message: string;
}

export interface CatalogProgressDetail {
  catalogType: CatalogType;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  dataSource: DataSource;
  itemsInserted: number;
  errorMessage?: string;
}

export interface CatalogPopulationStatus {
  jobId: string;
  status: JobStatus;
  countryIso: string;
  completed: number;
  total: number;
  currentCatalog?: string;
  totalInserted: number;
  details: CatalogProgressDetail[];
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CountryInfo {
  countryIso: string;
  countryName: string;
  hasTemplates: boolean;
  templateCatalogs: CatalogType[];
  aiGeneratedCatalogs: CatalogType[];
}

export interface CatalogPopulationHistoryItem {
  jobId: string;
  status: JobStatus;
  countryIso: string;
  totalInserted: number;
  catalogTypes: string[];
  startedAt?: string;
  completedAt?: string;
}

/** Display labels for catalog types */
export const CATALOG_TYPE_LABELS: Record<CatalogType, string> = {
  'value-sets': 'Value Sets',
  diagnoses: 'Diagnoses',
  medications: 'Medications',
  'lab-tests': 'Lab Tests',
  'imaging-studies': 'Imaging Studies',
  procedures: 'Procedures',
  'administrative-services': 'Administrative Services',
  'note-templates': 'Note Templates',
  'vital-signs-templates': 'Vital Signs Templates',
  checklists: 'Checklists',
};

/** All catalog types in recommended order */
export const ALL_CATALOG_TYPES: CatalogType[] = [
  'value-sets',
  'diagnoses',
  'medications',
  'lab-tests',
  'imaging-studies',
  'procedures',
  'administrative-services',
  'note-templates',
  'vital-signs-templates',
  'checklists',
];
