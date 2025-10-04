"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionsResponseDto = exports.PermissionResponseDto = exports.RoleResponseDto = exports.UserResponseDto = exports.MfaStatusResponseDto = exports.MfaVerifyResponseDto = exports.MfaSetupResponseDto = exports.RefreshTokenResponseDto = exports.LoginResponseDto = exports.RoleQueryDto = exports.UserQueryDto = exports.UpdatePermissionDto = exports.CreatePermissionDto = exports.RevokeRoleDto = exports.AssignRoleDto = exports.UpdateRoleDto = exports.CreateRoleDto = exports.UpdateUserDto = exports.CreateUserDto = exports.MfaVerifyDto = exports.MfaSetupDto = exports.ConfirmResetPasswordDto = exports.ResetPasswordDto = exports.ChangePasswordDto = exports.LogoutDto = exports.RefreshTokenDto = exports.LoginDto = void 0;
const zod_1 = require("zod");
// Login DTOs
exports.LoginDto = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    mfaCode: zod_1.z.string().optional(),
    deviceId: zod_1.z.string().optional(),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.RefreshTokenDto = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
exports.LogoutDto = zod_1.z.object({
    refreshToken: zod_1.z.string().optional(),
    allDevices: zod_1.z.boolean().optional(),
});
// Password management DTOs
exports.ChangePasswordDto = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8).max(128),
});
exports.ResetPasswordDto = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.ConfirmResetPasswordDto = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8).max(128),
});
// MFA DTOs
exports.MfaSetupDto = zod_1.z.object({
    method: zod_1.z.enum(['totp', 'sms', 'email']),
    phoneNumber: zod_1.z.string().optional(),
    emailAddress: zod_1.z.string().email().optional(),
});
exports.MfaVerifyDto = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    method: zod_1.z.enum(['totp', 'sms', 'email', 'backup']),
    code: zod_1.z.string(),
    deviceId: zod_1.z.string().optional(),
});
// User management DTOs
exports.CreateUserDto = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    phoneNumber: zod_1.z.string().optional(),
    tenantId: zod_1.z.string().uuid().optional(),
    roles: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.UpdateUserDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100).optional(),
    lastName: zod_1.z.string().min(1).max(100).optional(),
    phoneNumber: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'suspended']).optional(),
});
// Role management DTOs
exports.CreateRoleDto = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    permissions: zod_1.z.array(zod_1.z.string().uuid()),
    tenantId: zod_1.z.string().uuid().optional(),
});
exports.UpdateRoleDto = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
    permissions: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
// Role assignment DTOs
exports.AssignRoleDto = zod_1.z.object({
    roleId: zod_1.z.string().uuid(),
    expiresAt: zod_1.z.string().datetime().optional(),
});
exports.RevokeRoleDto = zod_1.z.object({
    roleId: zod_1.z.string().uuid(),
});
// Permission DTOs
exports.CreatePermissionDto = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
});
exports.UpdatePermissionDto = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
});
// Query DTOs
exports.UserQueryDto = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'suspended']).optional(),
    tenantId: zod_1.z.string().uuid().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
exports.RoleQueryDto = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    search: zod_1.z.string().optional(),
    tenantId: zod_1.z.string().uuid().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
// Response DTOs
exports.LoginResponseDto = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    user: zod_1.z.any(), // Will be typed properly with actual user type
    expiresIn: zod_1.z.number(),
    requiresMfa: zod_1.z.boolean().optional(),
});
exports.RefreshTokenResponseDto = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    expiresIn: zod_1.z.number(),
});
exports.MfaSetupResponseDto = zod_1.z.object({
    qrCode: zod_1.z.string().optional(),
    secret: zod_1.z.string().optional(),
    backupCodes: zod_1.z.array(zod_1.z.string()),
});
exports.MfaVerifyResponseDto = zod_1.z.object({
    success: zod_1.z.boolean(),
    backupCodes: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.MfaStatusResponseDto = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    methods: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['totp', 'sms', 'email']),
        enabled: zod_1.z.boolean(),
        verified: zod_1.z.boolean(),
        lastVerified: zod_1.z.string().datetime().optional(),
    })),
    backupCodesRemaining: zod_1.z.number(),
});
exports.UserResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNumber: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'suspended']),
    tenantId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    lastLoginAt: zod_1.z.string().datetime().optional(),
    roles: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.RoleResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    isSystemRole: zod_1.z.boolean(),
    tenantId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    permissions: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.PermissionResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
});
exports.UserPermissionsResponseDto = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    permissions: zod_1.z.array(zod_1.z.string()),
    roles: zod_1.z.array(zod_1.z.string()),
    tenantId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=auth.dto.js.map