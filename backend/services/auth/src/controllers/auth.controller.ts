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
import type { Request as ExpressRequest } from 'express';
import type { JwtClaims } from '@zeal/contracts';
import { AuthService, LoginResponse, RefreshTokenResponse } from '../services/auth.service';
import { MfaService } from '../services/mfa.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
  ChangePasswordDto,
  ResetPasswordDto,
  ConfirmResetPasswordDto,
  MfaVerifyDto,
  SwitchFacilityDto,
} from '../dto/auth.dto';

type AuthenticatedRequest = ExpressRequest & { user?: JwtClaims };

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.authService.requestPasswordReset(resetPasswordDto);
  }

  @Post('confirm-reset-password')
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() confirmResetPasswordDto: ConfirmResetPasswordDto,
  ): Promise<void> {
    await this.authService.confirmPasswordReset(confirmResetPasswordDto);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() mfaVerifyDto: MfaVerifyDto) {
    return this.mfaService.verifyMfa(mfaVerifyDto);
  }

  @Get('mfa/status')
  @UseGuards(JwtAuthGuard)
  async getMfaStatus(@Request() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new Error('Missing authenticated user context');
    }
    return this.mfaService.getMfaStatus(req.user.userId);
  }

  @Post('switch-facility')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
