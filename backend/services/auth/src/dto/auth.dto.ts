import { z } from 'zod';

// Login DTOs
export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  mfaCode: z.string().optional(),
  deviceId: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export const RefreshTokenDto = z.object({
  refreshToken: z.string(),
});

export const LogoutDto = z.object({
  refreshToken: z.string().optional(),
  allDevices: z.boolean().optional(),
});

// Password management DTOs
export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const ResetPasswordDto = z.object({
  email: z.string().email(),
});

export const ConfirmResetPasswordDto = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(128),
});

// MFA DTOs
export const MfaSetupDto = z.object({
  method: z.enum(['totp', 'sms', 'email']),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().email().optional(),
});

export const MfaVerifyDto = z.object({
  userId: z.string().uuid().optional(),
  method: z.enum(['totp', 'sms', 'email', 'backup']),
  code: z.string(),
  deviceId: z.string().optional(),
});

// User management DTOs
export const CreateUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phoneNumber: z.string().optional(),
  tenantId: z.string().uuid().optional(),
  roles: z.array(z.string().uuid()).optional(),
});

export const UpdateUserDto = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

// Role management DTOs
export const CreateRoleDto = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string().uuid()),
  tenantId: z.string().uuid().optional(),
});

export const UpdateRoleDto = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string().uuid()).optional(),
});

// Role assignment DTOs
export const AssignRoleDto = z.object({
  roleId: z.string().uuid(),
  expiresAt: z.string().datetime().optional(),
});

export const RevokeRoleDto = z.object({
  roleId: z.string().uuid(),
});

// Permission DTOs
export const CreatePermissionDto = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const UpdatePermissionDto = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

// Query DTOs
export const UserQueryDto = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  tenantId: z.string().uuid().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const RoleQueryDto = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tenantId: z.string().uuid().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Response DTOs
export const LoginResponseDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.any(), // Will be typed properly with actual user type
  expiresIn: z.number(),
  requiresMfa: z.boolean().optional(),
});

export const RefreshTokenResponseDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const MfaSetupResponseDto = z.object({
  qrCode: z.string().optional(),
  secret: z.string().optional(),
  backupCodes: z.array(z.string()),
});

export const MfaVerifyResponseDto = z.object({
  success: z.boolean(),
  backupCodes: z.array(z.string()).optional(),
});

export const MfaStatusResponseDto = z.object({
  enabled: z.boolean(),
  methods: z.array(z.object({
    type: z.enum(['totp', 'sms', 'email']),
    enabled: z.boolean(),
    verified: z.boolean(),
    lastVerified: z.string().datetime().optional(),
  })),
  backupCodesRemaining: z.number(),
});

export const UserResponseDto = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  tenantId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),
  roles: z.array(z.any()).optional(),
});

export const RoleResponseDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isSystemRole: z.boolean(),
  tenantId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  permissions: z.array(z.any()).optional(),
});

export const PermissionResponseDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const UserPermissionsResponseDto = z.object({
  userId: z.string().uuid(),
  permissions: z.array(z.string()),
  roles: z.array(z.string()),
  tenantId: z.string().uuid().optional(),
});

// Type exports
export type LoginDto = z.infer<typeof LoginDto>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;
export type LogoutDto = z.infer<typeof LogoutDto>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordDto>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;
export type ConfirmResetPasswordDto = z.infer<typeof ConfirmResetPasswordDto>;
export type MfaSetupDto = z.infer<typeof MfaSetupDto>;
export type MfaVerifyDto = z.infer<typeof MfaVerifyDto>;
export type CreateUserDto = z.infer<typeof CreateUserDto>;
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
export type CreateRoleDto = z.infer<typeof CreateRoleDto>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleDto>;
export type AssignRoleDto = z.infer<typeof AssignRoleDto>;
export type RevokeRoleDto = z.infer<typeof RevokeRoleDto>;
export type CreatePermissionDto = z.infer<typeof CreatePermissionDto>;
export type UpdatePermissionDto = z.infer<typeof UpdatePermissionDto>;
export type UserQueryDto = z.infer<typeof UserQueryDto>;
export type RoleQueryDto = z.infer<typeof RoleQueryDto>;
export type LoginResponseDto = z.infer<typeof LoginResponseDto>;
export type RefreshTokenResponseDto = z.infer<typeof RefreshTokenResponseDto>;
export type MfaSetupResponseDto = z.infer<typeof MfaSetupResponseDto>;
export type MfaVerifyResponseDto = z.infer<typeof MfaVerifyResponseDto>;
export type MfaStatusResponseDto = z.infer<typeof MfaStatusResponseDto>;
export type UserResponseDto = z.infer<typeof UserResponseDto>;
export type RoleResponseDto = z.infer<typeof RoleResponseDto>;
export type PermissionResponseDto = z.infer<typeof PermissionResponseDto>;
export type UserPermissionsResponseDto = z.infer<typeof UserPermissionsResponseDto>;
