export type CareSetting = 'OPD' | 'ER' | 'IPD' | 'ICU' | 'DAYCARE' | 'ANY';

export type AgeGroup =
  | 'newborn'
  | 'infant'
  | 'child'
  | 'adolescent'
  | 'adult'
  | 'elderly'
  | 'all';

export type VitalItemType =
  | 'number'
  | 'text'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'calculated';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface NormalRange {
  min: number;
  max: number;
}

export interface VitalItemOption {
  value: string;
  label: LocalizedText;
}

export interface VitalItem {
  id: string;
  code: string;
  loincCode?: string | null;
  type: VitalItemType;
  label: LocalizedText;
  unitOptions?: string[] | null;
  defaultUnit?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  normalRange?: NormalRange | null;
  decimals?: number | null;
  required?: boolean | null;
  sortOrder: number;
  captureTimeRequired?: boolean | null;
  displayWith?: string | null;
  formula?: string | null;
  dependsOn?: string[] | null;
  readOnly?: boolean | null;
  options?: VitalItemOption[] | null;
  metadata?: Record<string, any> | null;
}

export interface VitalGroup {
  id: string;
  label: LocalizedText;
  sortOrder: number;
  items: VitalItem[];
}

export interface VitalSignsTemplate {
  id: string;
  tenantId: string;
  templateCode: string;
  version: number;
  name: LocalizedText;
  description?: LocalizedText | null;
  careSetting: CareSetting[];
  ageGroup: AgeGroup[];
  specialties: string[];
  groups: VitalGroup[];
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VitalSignsTemplateFilters {
  careSetting?: CareSetting;
  ageGroup?: AgeGroup;
  specialty?: string;
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
}

export interface CreateVitalSignsTemplateInput {
  templateCode: string;
  version?: number;
  name: LocalizedText;
  description?: LocalizedText;
  careSetting: CareSetting[];
  ageGroup: AgeGroup[];
  specialties: string[];
  groups: VitalGroup[];
  isActive?: boolean;
  isDefault?: boolean;
  metadata?: Record<string, any>;
}
