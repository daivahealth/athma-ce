export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  displayName?: string;
  status: 'active' | 'inactive' | 'invited' | 'suspended';
  staffId?: string;
  staff?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    staffType?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FacilityUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  accessLevel: string;
  isDefault: boolean;
  grantedAt: string;
}

export interface UserWithFacility extends User {
  facilityAccess?: {
    facilityId: string;
    isDefault: boolean;
    grantedAt: string;
  }[];
}

export interface UserFacilityAccess {
  id: string;
  name: string;
  facilityType?: string | null;
  city?: string | null;
  emirate?: string | null;
  accessLevel?: string | null;
  isDefault?: boolean;
  grantedAt?: string;
}

export interface UserFacilityAccessResponse {
  defaultFacility: UserFacilityAccess | null;
  facilities: UserFacilityAccess[];
}

export interface CreateUserDTO {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
  staffId?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'invited' | 'suspended';
  password?: string;
}

export type FacilityAccessLevel = 'standard' | 'admin' | 'read_only';

export interface AssignFacilityDTO {
  facilityId: string;
  accessLevel?: FacilityAccessLevel;
  setAsDefault?: boolean;
}

export interface SetDefaultFacilityDTO {
  facilityId: string;
}
