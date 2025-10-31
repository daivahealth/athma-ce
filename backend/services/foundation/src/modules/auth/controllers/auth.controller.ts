import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { JwtClaims } from '@zeal/contracts';
import { AuthService, type LoginResponse, type RefreshTokenResponse } from '../services/auth.service';
import { MfaService } from '../services/mfa.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  ConfirmResetPasswordDto,
  LoginDto,
  LogoutDto,
  MfaVerifyDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SwitchFacilityDto,
} from '../dto/auth.dto';

type AuthenticatedRequest = {
  user?: JwtClaims;
  [key: string]: unknown;
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with email and password. Returns JWT tokens and user profile.'
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@hospital.ae',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          firstName: 'Ahmed',
          lastName: 'Hassan'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token using a valid refresh token'
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User logout',
    description: 'Invalidates the current session and optionally all user sessions'
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Request() req: AuthenticatedRequest,
    @Body() logoutDto: LogoutDto,
  ): Promise<void> {
    if (!req.user) {
      throw new Error('Missing authenticated user context');
    }
    await this.authService.logout(req.user.userId, logoutDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description: 'Changes the password for the authenticated user. Requires current password.'
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    if (!req.user) {
      throw new Error('Missing authenticated user context');
    }
    await this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Sends a password reset link to the user\'s email'
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent (if email exists)' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.authService.requestPasswordReset(resetPasswordDto);
  }

  @Post('confirm-reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm password reset',
    description: 'Sets a new password using a valid reset token from email'
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async confirmResetPassword(
    @Body() confirmResetPasswordDto: ConfirmResetPasswordDto,
  ): Promise<void> {
    await this.authService.confirmPasswordReset(confirmResetPasswordDto);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify MFA code',
    description: 'Verifies a multi-factor authentication code (TOTP, SMS, or email)'
  })
  @ApiResponse({
    status: 200,
    description: 'MFA verification successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid MFA code' })
  async verifyMfa(@Body() mfaVerifyDto: MfaVerifyDto) {
    return this.mfaService.verifyMfa(mfaVerifyDto);
  }

  @Get('mfa/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get MFA status',
    description: 'Retrieves the current MFA configuration for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'MFA status retrieved',
    schema: {
      example: {
        enabled: true,
        methods: ['totp', 'sms']
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMfaStatus(@Request() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new Error('Missing authenticated user context');
    }
    return this.mfaService.getMfaStatus(req.user.userId);
  }

  @Post('switch-facility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Switch facility',
    description: 'Changes the current facility context for the user session. Returns new tokens with updated facility context.'
  })
  @ApiResponse({
    status: 200,
    description: 'Facility switched successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'User does not have access to the specified facility' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async switchFacility(
    @Request() req: AuthenticatedRequest,
    @Body() switchFacilityDto: SwitchFacilityDto,
  ) {
    if (!req.user) {
      throw new Error('Missing authenticated user context');
    }
    return this.authService.switchFacility(req.user.userId, switchFacilityDto);
  }
}
