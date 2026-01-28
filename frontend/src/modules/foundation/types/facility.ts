export interface Facility {
  id: string;
  tenantId: string;
  name: string;
  code?: string | null;
  facilityType: string;
  licenseNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  emirate?: string | null;
  postalCode?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  operatingHours?: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacilityDTO {
  tenantId: string;
  name: string;
  code?: string;
  facilityType?: string;
  licenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emirate?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}

export interface UpdateFacilityDTO {
  name?: string;
  code?: string;
  facilityType?: string;
  licenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emirate?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  status?: string;
}
