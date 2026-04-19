export type CatalogType =
  | 'medication'
  | 'lab_test'
  | 'imaging_study'
  | 'procedure'
  | 'package'
  | 'administrative_service';

export interface CatalogMappingBillingItem {
  id: string;
  billingCode: string;
  billingCodeType: string;
  billingDescription: string;
  itemType: string;
  listPrice?: string | number | null;
}

export interface CatalogMapping {
  id: string;
  tenantId: string;
  catalogType: CatalogType;
  catalogItemId: string;
  billingItemId: string;
  billingItem?: CatalogMappingBillingItem | null;
  quantity: number | null;
  isAutomatic: boolean;
  isPrimary: boolean;
  requiresApproval: boolean;
  facilityIds?: string[] | null;
  payerIds?: string[] | null;
  patientTypes?: string[] | null;
  mappingReason?: string | null;
  notes?: string | null;
  effectiveDate?: string | null;
  expirationDate?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogMappingFilters {
  catalogType?: CatalogType;
  catalogItemId?: string;
  billingItemId?: string;
  isActive?: boolean;
  isPrimary?: boolean;
  facilityId?: string;
  payerId?: string;
  patientType?: string;
}

export interface CreateCatalogMappingInput {
  catalogType: CatalogType;
  catalogItemId: string;
  billingItemId: string;
  quantity?: number;
  isAutomatic?: boolean;
  isPrimary?: boolean;
  requiresApproval?: boolean;
  facilityIds?: string[];
  payerIds?: string[];
  patientTypes?: string[];
  mappingReason?: string;
  notes?: string;
  effectiveDate?: string;
  expirationDate?: string;
  isActive?: boolean;
}

export type UpdateCatalogMappingInput = Partial<CreateCatalogMappingInput>;
