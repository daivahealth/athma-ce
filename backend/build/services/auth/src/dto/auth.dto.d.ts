export declare class LoginDto {
    email: string;
    password: string;
    mfaCode?: string | null;
    deviceId?: string | null;
    rememberMe?: boolean;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class LogoutDto {
    refreshToken?: string;
    allDevices?: boolean;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ResetPasswordDto {
    email: string;
}
export declare class ConfirmResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class MfaVerifyDto {
    userId: string;
    method: 'totp' | 'sms' | 'email';
    code: string;
    deviceId?: string;
}
export declare class SwitchFacilityDto {
    facilityId: string;
}
export interface JwtPayload {
    userId: string;
    email: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
    defaultFacilityId: string;
    facilityId: string;
    facilityIds: string[];
    sessionId?: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    requiresMfa?: boolean;
    user?: {
        id: string;
        email: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        defaultFacility?: {
            id: string;
            name: string;
            facilityType: string;
        };
        facilities?: Array<{
            id: string;
            name: string;
            accessLevel: string;
            isDefault: boolean;
        }>;
    };
}
//# sourceMappingURL=auth.dto.d.ts.map