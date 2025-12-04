export type CareSetting = 'OP' | 'IP' | 'DAYCARE' | 'ANY';

export type CatalogType = 'LAB_TEST' | 'IMAGING_STUDY' | 'PROCEDURE' | 'DRUG' | 'VISIT_TYPE' | 'MISC';

export type PackageType =
  | 'health_check'
  | 'surgical_bundle'
  | 'maternity_bundle'
  | 'pre_employment'
  | 'annual_checkup'
  | 'custom';

export interface PackageTypeOption {
  code: PackageType;
  name: string;
}

export interface CatalogTypeOption {
  code: CatalogType;
  name: string;
}

export interface PackageItem {
  id: string;
  packageId: string;
  catalogType: CatalogType;
  catalogId: string;
  quantity: number | null;
  isMandatory: boolean;
  clinicalOnly: boolean;
  groupName: string | null;
  sortOrder: number | null;
  maxUsesPerPackage: number | null;
  notes: string | null;
}

export interface Package {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description: string | null;
  packageType: PackageType | null;
  genderRestriction: string | null;
  minAgeYears: number | null;
  maxAgeYears: number | null;
  careSetting: CareSetting | null;
  validityDays: number | null;
  isActive: boolean;
  isPublic: boolean;
  metadata: Record<string, any> | null;
  items: PackageItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageFilters {
  search?: string;
  packageType?: PackageType;
  careSetting?: CareSetting;
  gender?: string;
  age?: number;
  isActive?: boolean;
  isPublic?: boolean;
}
