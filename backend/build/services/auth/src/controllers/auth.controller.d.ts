import type { Request as ExpressRequest } from 'express';
import { AuthService, LoginResponse, RefreshTokenResponse } from '../services/auth.service';
import { MfaService } from '../services/mfa.service';
import { LoginDto, RefreshTokenDto, LogoutDto, ChangePasswordDto, ResetPasswordDto, ConfirmResetPasswordDto, MfaVerifyDto } from '../dto/auth.dto';
interface AuthenticatedRequest extends ExpressRequest {
    user?: {
        id: string;
        tenantId?: string;
    };
}
export declare class AuthController {
    private readonly authService;
    private readonly mfaService;
    constructor(authService: AuthService, mfaService: MfaService);
    login(loginDto: LoginDto): Promise<LoginResponse>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse>;
    logout(req: AuthenticatedRequest, logoutDto: LogoutDto): Promise<void>;
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
    confirmResetPassword(confirmResetPasswordDto: ConfirmResetPasswordDto): Promise<void>;
    verifyMfa(mfaVerifyDto: MfaVerifyDto): Promise<{
        success: boolean;
    }>;
    getMfaStatus(req: AuthenticatedRequest): Promise<any>;
}
export {};
//# sourceMappingURL=auth.controller.d.ts.map