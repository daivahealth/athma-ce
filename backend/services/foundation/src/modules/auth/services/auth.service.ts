import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService, UserPermissions, UserWithRoles } from './user.service';
import { MfaService } from './mfa.service';
import { UserRepository } from '../repositories/user.repository';
import { RequestContext } from '@zeal/shared-utils';
import { PrismaService } from '@zeal/database-foundation';
// Temporary local types until contracts package is fixed
interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
  deviceId?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserWithRoles | null;
  expiresIn: number;
  requiresMfa?: boolean;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LogoutRequest {
  refreshToken?: string;
  allDevices?: boolean;
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

interface PasswordResetRequest {
  email: string;
}

interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
}

import { LoginDto, RefreshTokenDto, LogoutDto, ChangePasswordDto, ResetPasswordDto, ConfirmResetPasswordDto, SwitchFacilityDto } from '../dto/auth.dto';
import { DEFAULT_REFRESH_TOKEN_EXPIRY, DEFAULT_RESET_TOKEN_EXPIRY, resolveExpiresIn } from '../utils/jwt-expiry.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mfaService: MfaService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private getAccessTokenSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable must be set');
    }
    return secret;
  }

  private getRefreshTokenSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be set');
    }
    return secret;
  }

  private getResetTokenSecret(): string {
    const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_RESET_SECRET or JWT_SECRET must be set');
    }
    return secret;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password, mfaCode, deviceId, rememberMe } = loginDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is required
    const mfaStatus = await this.mfaService.getMfaStatus(user.id);
    if (mfaStatus.enabled && !mfaCode) {
      return {
        requiresMfa: true,
        accessToken: null,
        refreshToken: null,
        user: null,
        expiresIn: 0,
      };
    }

    // Verify MFA if provided
    if (mfaCode) {
      const mfaValid = await this.mfaService.verifyMfa({
        userId: user.id,
        method: mfaStatus.methods[0]?.type || 'totp',
        code: mfaCode,
        deviceId,
      });

      if (!mfaValid.success) {
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    const userAgent = RequestContext.getUserAgent() ?? 'auth-service';
    const contextStore = {
      tenantId: user.tenantId,
      userId: user.id,
      userAgent,
    };

    return RequestContext.run(contextStore, async () => {
      await this.userRepository.updateLastLogin(user.id);

      const userWithRoles = await this.userService.getUserWithRoles(user.id);
      const userPermissions = await this.userService.getUserPermissions(user.id, user.tenantId);

      // Fetch user's facility context
      const facilityData = await this.fetchUserFacilities(user.id);

      const accessToken = await this.generateAccessToken(userWithRoles, userPermissions);
      const refreshToken = await this.generateRefreshToken(user.id);

      await this.storeSession(user.id, {
        deviceId,
        userAgent,
        ipAddress: '', // Will be set by middleware
      });

      return {
        accessToken,
        refreshToken,
        user: {
          ...userWithRoles,
          defaultFacility: facilityData?.defaultFacility,
          facilities: facilityData?.facilities,
        },
        expiresIn: this.getTokenExpiry(),
        requiresMfa: false,
      };
    });
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.getRefreshTokenSecret(),
      });

      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userAgent = RequestContext.getUserAgent() ?? 'foundation-api';
      const contextStore = {
        tenantId: user.tenantId,
        userId: user.id,
        userAgent,
      };

      return RequestContext.run(contextStore, async () => {
        const userWithRoles = await this.userService.getUserWithRoles(user.id);
        const userPermissions = await this.userService.getUserPermissions(user.id, user.tenantId);

        const newAccessToken = await this.generateAccessToken(userWithRoles, userPermissions);
        const newRefreshToken = await this.generateRefreshToken(user.id);

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: this.getTokenExpiry(),
        };
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, logoutDto: LogoutDto): Promise<void> {
    const { refreshToken, allDevices } = logoutDto;

    if (allDevices) {
      await this.revokeAllSessions(userId);
    } else if (refreshToken) {
      await this.revokeSession(userId, refreshToken);
    }

    if (refreshToken) {
      await this.blacklistToken(refreshToken);
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const userAgent = RequestContext.getUserAgent() ?? 'foundation-api';

    await RequestContext.run({
      tenantId: user.tenantId,
      userId,
      userAgent,
    }, async () => {
      const newPasswordHash = await argon2.hash(newPassword);
      await this.userRepository.updatePassword(userId, newPasswordHash);
      await this.revokeAllSessions(userId);
    });
  }

  async requestPasswordReset(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email } = resetPasswordDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = await this.generatePasswordResetToken(user.id);

    // Send reset email (implementation would depend on email service)
    await this.sendPasswordResetEmail(user.email, resetToken);
  }

  async confirmPasswordReset(confirmResetPasswordDto: ConfirmResetPasswordDto): Promise<void> {
    const { token, newPassword } = confirmResetPasswordDto;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.getResetTokenSecret(),
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const userAgent = RequestContext.getUserAgent() ?? 'foundation-api';

      await RequestContext.run({
        tenantId: user.tenantId,
        userId: user.id,
        userAgent,
      }, async () => {
        const newPasswordHash = await argon2.hash(newPassword);
        await this.userRepository.updatePassword(user.id, newPasswordHash);
        await this.revokeAllSessions(user.id);
      });

    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async getProfile(userId: string): Promise<UserWithRoles> {
    return this.userService.getUserWithRoles(userId);
  }

  async switchFacility(userId: string, switchFacilityDto: SwitchFacilityDto): Promise<{ accessToken: string; currentFacility: any }> {
    const { facilityId } = switchFacilityDto;

    // Fetch user's facility data to validate access
    const facilityData = await this.fetchUserFacilities(userId);
    
    if (!facilityData?.facilityIds?.includes(facilityId)) {
      throw new BadRequestException('User does not have access to this facility');
    }

    // Get user data
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userWithRoles = await this.userService.getUserWithRoles(userId);
    const userPermissions = await this.userService.getUserPermissions(userId, user.tenantId);

    // Generate new access token with updated facilityId
    const accessToken = await this.generateAccessToken(userWithRoles, userPermissions, facilityId);

    // Find the facility details
    const currentFacility = facilityData.facilities?.find((f: any) => f.id === facilityId);

    return {
      accessToken,
      currentFacility: currentFacility || null,
    };
  }

  async getUserSessions(userId: string): Promise<any[]> {
    // Implementation would depend on session storage
    return [];
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    // Implementation would depend on session storage
  }

  async revokeAllSessions(userId: string): Promise<void> {
    // Implementation would depend on session storage
  }

  async getTrustedDevices(userId: string): Promise<any[]> {
    // Implementation would depend on device storage
    return [];
  }

  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    // Implementation would depend on device storage
  }

  private async fetchUserFacilities(userId: string) {
    const store = RequestContext.getStore();
    if (!store?.tenantId) {
      throw new Error('Request context missing tenant information');
    }

    const records = await this.prisma.runWithRequestContext(async (tx) =>
      tx.userFacility.findMany({
        where: {
          userId,
          revokedAt: null,
        },
        select: {
          isDefault: true,
          accessLevel: true,
          facility: {
            select: {
              id: true,
              name: true,
              facilityType: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    );

    const facilities = records.map((record) => ({
      id: record.facility.id,
      name: record.facility.name,
      facilityType: record.facility.facilityType,
      accessLevel: record.accessLevel,
      isDefault: record.isDefault,
    }));

    const defaultFacility = facilities.find((facility) => facility.isDefault) ?? null;

    return {
      facilities,
      defaultFacility,
      facilityIds: facilities.map((facility) => facility.id),
    };
  }

  private async generateAccessToken(user: UserWithRoles, permissions: UserPermissions, facilityId?: string): Promise<string> {
    // Fetch user's facility context
    const facilityData = await this.fetchUserFacilities(user.id);
    
    const defaultFacilityId = facilityData?.defaultFacility?.id || null;
    const facilityIds = facilityData?.facilities?.map((f: any) => f.id) || [];
    const activeFacilityId = facilityId || defaultFacilityId;

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: permissions.roles,
      permissions: permissions.permissions,
      defaultFacilityId,
      facilityId: activeFacilityId,
      facilityIds,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.getAccessTokenSecret(),
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: resolveExpiresIn(process.env.JWT_REFRESH_EXPIRY, DEFAULT_REFRESH_TOKEN_EXPIRY),
    });
  }

  private async generatePasswordResetToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'password_reset',
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.getResetTokenSecret(),
      expiresIn: DEFAULT_RESET_TOKEN_EXPIRY,
    });
  }

  private getTokenExpiry(): number {
    const expiry = process.env.JWT_EXPIRY || '1h';
    const match = expiry.match(/(\d+)([smhd])/);
    if (!match) return 3600;

    const [, amount, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return parseInt(amount || '1') * (multipliers[unit as keyof typeof multipliers] || 1);
  }

  private async storeSession(userId: string, sessionData: any): Promise<void> {
    // Implementation would store session in Redis or database
  }

  private async blacklistToken(token: string): Promise<void> {
    // Implementation would add token to blacklist in Redis
  }

  private async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    // Implementation would send email via email service
    console.log(`Password reset email sent to ${email} with token ${resetToken}`);
  }
}
