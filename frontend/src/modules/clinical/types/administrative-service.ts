export type ServiceCategory =
  | 'registration'
  | 'consultation'
  | 'admission'
  | 'room_charge'
  | 'administrative'
  | 'nursing'
  | 'therapy'
  | 'emergency'
  | 'facility'
  | 'other';

export type ServiceType =
  | 'new_patient'
  | 'follow_up'
  | 'emergency'
  | 'routine'
  | 'specialist'
  | 'telephonic'
  | 'video'
  | 'home_visit';

export type CareSetting = 'OP' | 'IP' | 'DAYCARE' | 'ANY';

export interface AdministrativeService {
  id: string;
  tenantId: string;
  serviceName: string;
  serviceCode: string | null;
  billingCode: string | null;
  billingCodeType: string | null;
  billingDescription: string | null;
  serviceCategory: ServiceCategory;
  serviceType: ServiceType | null;
  department: string | null;
  careSetting: CareSetting | null;
  description: string | null;
  durationMinutes: number | null;
  requiresStaff: boolean;
  staffType: string | null;
  requiresRoom: boolean;
  roomType: string | null;
  isTaxable: boolean;
  isActive: boolean;
  metadata: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdministrativeServiceFilters {
  search?: string;
  serviceCategory?: ServiceCategory;
  serviceType?: ServiceType;
  department?: string;
  careSetting?: CareSetting;
  isActive?: boolean;
  requiresStaff?: boolean;
  requiresRoom?: boolean;
}

export interface AdministrativeServiceOption {
  code: string;
  name: string;
}
