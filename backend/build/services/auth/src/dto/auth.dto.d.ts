import { z } from 'zod';
export declare const LoginDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    mfaCode: z.ZodOptional<z.ZodString>;
    deviceId: z.ZodOptional<z.ZodString>;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
    deviceId?: string | undefined;
    rememberMe?: boolean | undefined;
}, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
    deviceId?: string | undefined;
    rememberMe?: boolean | undefined;
}>;
export declare const RefreshTokenDto: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const LogoutDto: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
    allDevices: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
    allDevices?: boolean | undefined;
}, {
    refreshToken?: string | undefined;
    allDevices?: boolean | undefined;
}>;
export declare const ChangePasswordDto: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const ResetPasswordDto: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const ConfirmResetPasswordDto: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
    token: string;
}, {
    newPassword: string;
    token: string;
}>;
export declare const MfaSetupDto: z.ZodObject<{
    method: z.ZodEnum<["totp", "sms", "email"]>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    emailAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    method: "email" | "totp" | "sms";
    phoneNumber?: string | undefined;
    emailAddress?: string | undefined;
}, {
    method: "email" | "totp" | "sms";
    phoneNumber?: string | undefined;
    emailAddress?: string | undefined;
}>;
export declare const MfaVerifyDto: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    method: z.ZodEnum<["totp", "sms", "email", "backup"]>;
    code: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    method: "email" | "totp" | "sms" | "backup";
    code: string;
    userId?: string | undefined;
    deviceId?: string | undefined;
}, {
    method: "email" | "totp" | "sms" | "backup";
    code: string;
    userId?: string | undefined;
    deviceId?: string | undefined;
}>;
export declare const CreateUserDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tenantId?: string | undefined;
    roles?: string[] | undefined;
    phoneNumber?: string | undefined;
}, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tenantId?: string | undefined;
    roles?: string[] | undefined;
    phoneNumber?: string | undefined;
}>;
export declare const UpdateUserDto: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    status?: "active" | "inactive" | "suspended" | undefined;
    phoneNumber?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    status?: "active" | "inactive" | "suspended" | undefined;
    phoneNumber?: string | undefined;
}>;
export declare const CreateRoleDto: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodArray<z.ZodString, "many">;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    permissions: string[];
    name: string;
    tenantId?: string | undefined;
    description?: string | undefined;
}, {
    permissions: string[];
    name: string;
    tenantId?: string | undefined;
    description?: string | undefined;
}>;
export declare const UpdateRoleDto: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    permissions?: string[] | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    permissions?: string[] | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const AssignRoleDto: z.ZodObject<{
    roleId: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    roleId: string;
    expiresAt?: string | undefined;
}, {
    roleId: string;
    expiresAt?: string | undefined;
}>;
export declare const RevokeRoleDto: z.ZodObject<{
    roleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    roleId: string;
}, {
    roleId: string;
}>;
export declare const CreatePermissionDto: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const UpdatePermissionDto: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const UserQueryDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
    tenantId: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    tenantId?: string | undefined;
    search?: string | undefined;
    status?: "active" | "inactive" | "suspended" | undefined;
    sortBy?: string | undefined;
}, {
    tenantId?: string | undefined;
    search?: string | undefined;
    status?: "active" | "inactive" | "suspended" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const RoleQueryDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    tenantId?: string | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
}, {
    tenantId?: string | undefined;
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const LoginResponseDto: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    user: z.ZodAny;
    expiresIn: z.ZodNumber;
    requiresMfa: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    user?: any;
    requiresMfa?: boolean | undefined;
}, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    user?: any;
    requiresMfa?: boolean | undefined;
}>;
export declare const RefreshTokenResponseDto: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
}, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
}>;
export declare const MfaSetupResponseDto: z.ZodObject<{
    qrCode: z.ZodOptional<z.ZodString>;
    secret: z.ZodOptional<z.ZodString>;
    backupCodes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    backupCodes: string[];
    qrCode?: string | undefined;
    secret?: string | undefined;
}, {
    backupCodes: string[];
    qrCode?: string | undefined;
    secret?: string | undefined;
}>;
export declare const MfaVerifyResponseDto: z.ZodObject<{
    success: z.ZodBoolean;
    backupCodes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    backupCodes?: string[] | undefined;
}, {
    success: boolean;
    backupCodes?: string[] | undefined;
}>;
export declare const MfaStatusResponseDto: z.ZodObject<{
    enabled: z.ZodBoolean;
    methods: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["totp", "sms", "email"]>;
        enabled: z.ZodBoolean;
        verified: z.ZodBoolean;
        lastVerified: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "email" | "totp" | "sms";
        enabled: boolean;
        verified: boolean;
        lastVerified?: string | undefined;
    }, {
        type: "email" | "totp" | "sms";
        enabled: boolean;
        verified: boolean;
        lastVerified?: string | undefined;
    }>, "many">;
    backupCodesRemaining: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    methods: {
        type: "email" | "totp" | "sms";
        enabled: boolean;
        verified: boolean;
        lastVerified?: string | undefined;
    }[];
    backupCodesRemaining: number;
}, {
    enabled: boolean;
    methods: {
        type: "email" | "totp" | "sms";
        enabled: boolean;
        verified: boolean;
        lastVerified?: string | undefined;
    }[];
    backupCodesRemaining: number;
}>;
export declare const UserResponseDto: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["active", "inactive", "suspended"]>;
    tenantId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    lastLoginAt: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    status: "active" | "inactive" | "suspended";
    createdAt: string;
    updatedAt: string;
    tenantId?: string | undefined;
    roles?: any[] | undefined;
    phoneNumber?: string | undefined;
    lastLoginAt?: string | undefined;
}, {
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    status: "active" | "inactive" | "suspended";
    createdAt: string;
    updatedAt: string;
    tenantId?: string | undefined;
    roles?: any[] | undefined;
    phoneNumber?: string | undefined;
    lastLoginAt?: string | undefined;
}>;
export declare const RoleResponseDto: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isSystemRole: z.ZodBoolean;
    tenantId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    permissions: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isSystemRole: boolean;
    tenantId?: string | undefined;
    permissions?: any[] | undefined;
    description?: string | undefined;
}, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isSystemRole: boolean;
    tenantId?: string | undefined;
    permissions?: any[] | undefined;
    description?: string | undefined;
}>;
export declare const PermissionResponseDto: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    description?: string | undefined;
}, {
    name: string;
    id: string;
    createdAt: string;
    description?: string | undefined;
}>;
export declare const UserPermissionsResponseDto: z.ZodObject<{
    userId: z.ZodString;
    permissions: z.ZodArray<z.ZodString, "many">;
    roles: z.ZodArray<z.ZodString, "many">;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    roles: string[];
    permissions: string[];
    tenantId?: string | undefined;
}, {
    userId: string;
    roles: string[];
    permissions: string[];
    tenantId?: string | undefined;
}>;
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
//# sourceMappingURL=auth.dto.d.ts.map