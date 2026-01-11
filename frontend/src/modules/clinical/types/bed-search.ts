export type BedType = 'icu' | 'general' | 'isolation' | 'pediatric' | 'maternity';
export type GenderRestriction = 'male_only' | 'female_only' | 'mixed';
export type IsolationType = 'contact' | 'droplet' | 'airborne' | 'protective';

export interface BedSearchWard {
  id: string;
  name: string;
  wardType: string;
  genderRestriction?: GenderRestriction | null;
  specialtyName?: string | null;
}

export interface BedSearchFacility {
  id: string;
  name: string;
}

export interface BedSearchResult {
  bedId: string;
  bedNumber: string;
  bedType: BedType | string;
  features: Record<string, boolean>;
  requiresIsolation: boolean;
  isolationType?: IsolationType | null;
  ward: BedSearchWard;
  facility: BedSearchFacility;
  isOccupied: boolean;
  isAvailable: boolean;
  occupancyStatus: string;
  occupiedSince?: string | null;
}

export interface BedSearchMeta {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

export interface BedSearchResponse {
  data: BedSearchResult[];
  meta: BedSearchMeta;
}

export interface BedSearchFilters {
  facilityId: string;
  wardId?: string;
  bedType?: BedType | string;
  genderRestriction?: GenderRestriction | string;
  requiresIsolation?: boolean;
  requiredFeatures?: string[];
  patientGender?: string;
  specialtyId?: string;
}

export interface BedAvailabilityValidationResponse {
  isAvailable: boolean;
  bedId: string;
  bedNumber: string;
  ward: {
    id: string;
    name: string;
    wardType: string;
    floorNumber?: string | null;
  };
}
