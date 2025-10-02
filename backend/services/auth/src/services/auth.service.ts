import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from './user.service';
import { MfaService } from './mfa.service';
import { UserRepository } from '../repositories/user.repository';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  ConfirmResetPasswordRequest,
  UserWithRoles,
  UserPermissions,
} from '@zeal/contracts';
import { LoginDto, RefreshTokenDto, LogoutDto, ChangePasswordDto, ResetPasswordDto, ConfirmResetPasswordDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mfaService: MfaService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

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

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Get user with roles and permissions
    const userWithRoles = await this.userService.getUserWithRoles(user.id);
    const userPermissions = await this.userService.getUserPermissions(user.id);

    // Generate tokens
    const accessToken = await this.generateAccessToken(userWithRoles, userPermissions);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Store session
    await this.storeSession(user.id, {
      deviceId,
      userAgent: '', // Will be set by middleware
      ipAddress: '', // Will be set by middleware
    });

    return {
      accessToken,
      refreshToken,
      user: userWithRoles,
      expiresIn: this.getTokenExpiry(),
      requiresMfa: false,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userWithRoles = await this.userService.getUserWithRoles(user.id);
      const userPermissions = await this.userService.getUserPermissions(user.id);

      const newAccessToken = await this.generateAccessToken(userWithRoles, userPermissions);
      const newRefreshToken = await this.generateRefreshToken(user.id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.getTokenExpiry(),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(user: any, logoutDto: LogoutDto): Promise<void> {
    const { refreshToken, allDevices } = logoutDto;

    if (allDevices) {
      // Revoke all sessions for user
      await this.revokeAllSessions(user.id);
    } else if (refreshToken) {
      // Revoke specific session
      await this.revokeSession(user.id, refreshToken);
    }

    // Add token to blacklist
    await this.blacklistToken(refreshToken);
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

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword);

    // Update password
    await this.userRepository.updatePassword(userId, newPasswordHash);

    // Revoke all sessions except current one
    await this.revokeAllSessions(userId);
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
        secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      // Hash new password
      const newPasswordHash = await argon2.hash(newPassword);

      // Update password
      await this.userRepository.updatePassword(payload.sub, newPasswordHash);

      // Revoke all sessions
      await this.revokeAllSessions(payload.sub);

    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async getProfile(userId: string): Promise<UserWithRoles> {
    return this.userService.getUserWithRoles(userId);
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

  private async generateAccessToken(user: UserWithRoles, permissions: UserPermissions): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: permissions.roles,
      permissions: permissions.permissions,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
  }

  private async generatePasswordResetToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'password_reset',
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  private getTokenExpiry(): number {
    const expiry = process.env.JWT_EXPIRY || '1h';
    const match = expiry.match(/(\d+)([smhd])/);
    if (!match) return 3600;

    const [, amount, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return parseInt(amount) * (multipliers[unit] || 1);
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
