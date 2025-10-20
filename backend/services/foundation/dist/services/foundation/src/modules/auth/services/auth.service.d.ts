import { JwtService } from '@nestjs/jwt';
import { UserService, UserWithRoles } from './user.service';
import { MfaService } from './mfa.service';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from '@zeal/database-foundation';
export interface LoginResponse {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserWithRoles | null;
    expiresIn: number;
    requiresMfa?: boolean;
}
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
import { LoginDto, RefreshTokenDto, LogoutDto, ChangePasswordDto, ResetPasswordDto, ConfirmResetPasswordDto, SwitchFacilityDto } from '../dto/auth.dto';
export declare class AuthService {
    private readonly userService;
    private readonly mfaService;
    private readonly userRepository;
    private readonly jwtService;
    private readonly prisma;
    constructor(userService: UserService, mfaService: MfaService, userRepository: UserRepository, jwtService: JwtService, prisma: PrismaService);
    private getAccessTokenSecret;
    private getRefreshTokenSecret;
    private getResetTokenSecret;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse>;
    logout(userId: string, logoutDto: LogoutDto): Promise<void>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    requestPasswordReset(resetPasswordDto: ResetPasswordDto): Promise<void>;
    confirmPasswordReset(confirmResetPasswordDto: ConfirmResetPasswordDto): Promise<void>;
    getProfile(userId: string): Promise<UserWithRoles>;
    switchFacility(userId: string, switchFacilityDto: SwitchFacilityDto): Promise<{
        accessToken: string;
        currentFacility: any;
    }>;
    getUserSessions(userId: string): Promise<any[]>;
    revokeSession(userId: string, sessionId: string): Promise<void>;
    revokeAllSessions(userId: string): Promise<void>;
    getTrustedDevices(userId: string): Promise<any[]>;
    removeTrustedDevice(userId: string, deviceId: string): Promise<void>;
    private fetchUserFacilities;
    private generateAccessToken;
    private generateRefreshToken;
    private generatePasswordResetToken;
    private getTokenExpiry;
    private storeSession;
    private blacklistToken;
    private sendPasswordResetEmail;
}
//# sourceMappingURL=auth.service.d.ts.map