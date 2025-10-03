/**
 * Authentication and authorization types
 */

import { BaseEntity, TenantEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  tenantId?: string;
}

export interface Role extends TenantEntity {
  name: string;
  description?: string;
  isSystemRole: boolean;
}

export interface Permission extends BaseEntity {
  name: string; // format: resource.action (e.g., "patient.read")
  description?: string;
}

export interface UserRole extends BaseEntity {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string;
  expiresAt?: Date;
}

export interface RolePermission extends BaseEntity {
  roleId: string;
  permissionId: string;
}

export interface UserWithRoles extends User {
  roles: Array<Role & {
    permissions: Permission[];
  }>;
}

export interface UserPermissions {
  userId: string;
  permissions: string[];
  roles: string[];
  tenantId?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
  deviceId?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserWithRoles;
  expiresIn: number;
  requiresMfa?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutRequest {
  refreshToken?: string;
  allDevices?: boolean;
}

// MFA types
export interface MfaSetupRequest {
  method: 'totp' | 'sms' | 'email';
  phoneNumber?: string;
  emailAddress?: string;
}

export interface MfaSetupResponse {
  qrCode?: string;
  secret?: string;
  backupCodes: string[];
}

export interface MfaVerifyRequest {
  method: 'totp' | 'sms' | 'email' | 'backup';
  code: string;
  deviceId?: string;
}

export interface MfaVerifyResponse {
  success: boolean;
  backupCodes?: string[];
}

export interface MfaStatus {
  enabled: boolean;
  methods: Array<{
    type: 'totp' | 'sms' | 'email';
    enabled: boolean;
    verified: boolean;
    lastVerified?: Date;
  }>;
  backupCodesRemaining: number;
}

// Authorization types
export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: string[];
}

export interface ResourceAccess {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

// Session types
export interface UserSession {
  id: string;
  userId: string;
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionInfo {
  sessionId: string;
  deviceInfo: {
    name?: string;
    type?: string;
    os?: string;
    browser?: string;
  };
  location?: {
    ip?: string;
    city?: string;
    country?: string;
  };
  lastActivity: Date;
  isCurrent: boolean;
}

// Password types
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// Audit types
export interface AuthAuditLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'mfa_enabled' | 'mfa_disabled' | 'password_changed' | 'role_assigned' | 'role_revoked';
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// JWT payload types
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  tenantId?: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
  jti: string; // JWT ID
}

export interface JwtClaims {
  userId: string;
  email: string;
  tenantId?: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
}

// Trusted device types
export interface TrustedDevice {
  id: string;
  userId: string;
  deviceIdentifier: string;
  deviceName: string;
  deviceType?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  lastUsedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
}

// API Key types (for service-to-service auth)
export interface ApiKey {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  tenantId?: string;
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  createdBy: string;
}

export interface ApiKeyRequest {
  name: string;
  permissions: string[];
  expiresAt?: Date;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string; // Only returned on creation
  permissions: string[];
  expiresAt?: Date;
  createdAt: Date;
}




