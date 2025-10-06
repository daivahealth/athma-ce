export interface JwtClaims {
  userId: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  sessionId?: string;
  iat?: number;
  exp?: number;
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
