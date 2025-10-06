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
//# sourceMappingURL=auth.dto.d.ts.map