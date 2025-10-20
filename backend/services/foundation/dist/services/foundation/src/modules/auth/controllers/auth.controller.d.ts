import type { JwtClaims } from '@zeal/contracts';
import { AuthService, type LoginResponse, type RefreshTokenResponse } from '../services/auth.service';
import { MfaService } from '../services/mfa.service';
import { ChangePasswordDto, ConfirmResetPasswordDto, LoginDto, LogoutDto, MfaVerifyDto, RefreshTokenDto, ResetPasswordDto, SwitchFacilityDto } from '../dto/auth.dto';
type AuthenticatedRequest = {
    user?: JwtClaims;
    [key: string]: unknown;
};
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
    getMfaStatus(req: AuthenticatedRequest): Promise<{
        enabled: boolean;
        methods: any[];
    }>;
    switchFacility(req: AuthenticatedRequest, switchFacilityDto: SwitchFacilityDto): Promise<{
        accessToken: string;
        currentFacility: any;
    }>;
}
export {};
//# sourceMappingURL=auth.controller.d.ts.map