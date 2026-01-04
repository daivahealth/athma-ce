export interface JwtClaims {
  userId: string;
  sub?: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  defaultFacilityId?: string;
  facilityId?: string;
  facilityIds?: string[];
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface Facility {
  id: string;
  name: string;
  facilityType: string;
  city?: string;
  emirate?: string;
  accessLevel?: string;
  isDefault?: boolean;
}

export interface AuthSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: JwtClaims | null;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}
