/**
 * ValueSet types for frontend
 */

export interface ValueSetConcept {
  id: string;
  code: string;
  display: string;
  definition: string | null;
  systemCode: string | null;
  parentId: string | null;
  sortOrder: number;
  isDefault: boolean;
  status: string;
  metadata: Record<string, any> | null;
}

export interface ValueSet {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  version: string | null;
  status: string;
  isSystem: boolean;
  isExtensible: boolean;
  source: string | null;
  conceptCount?: number;
}

export interface ValueSetConceptsResponse {
  valueSet: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    category: string | null;
    version: string | null;
    status: string;
    source: string | null;
  };
  concepts: ValueSetConcept[];
  language: string;
  totalCount: number;
}

export interface GetConceptsOptions {
  tenantId?: string;
  language?: string;
  includeInactive?: boolean;
}

export interface SearchConceptsOptions {
  valueSetCode?: string;
  language?: string;
}
