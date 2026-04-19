import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@hospital.ae',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({
    description: 'Multi-factor authentication code (if MFA is enabled)',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  mfaCode?: string | null;

  @ApiPropertyOptional({
    description: 'Device identifier for trusted devices',
    example: 'device-uuid-123',
  })
  @IsOptional()
  @IsString()
  deviceId?: string | null;

  @ApiPropertyOptional({
    description: 'Remember this device for future logins',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token obtained from login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'Refresh token to invalidate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Log out from all devices',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  allDevices?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword456!',
  })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address to send password reset link',
    example: 'user@hospital.ae',
  })
  @IsEmail()
  email!: string;
}

export class ConfirmResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from email',
    example: 'reset-token-123abc',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword456!',
  })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class MfaVerifyDto {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID("all")
  userId!: string;

  @ApiProperty({
    description: 'MFA method type',
    example: 'totp',
    enum: ['totp', 'sms', 'email'],
  })
  @IsIn(['totp', 'sms', 'email'])
  method!: 'totp' | 'sms' | 'email';

  @ApiProperty({
    description: 'MFA verification code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiPropertyOptional({
    description: 'Device identifier',
    example: 'device-uuid-123',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class SwitchFacilityDto {
  @ApiProperty({
    description: 'Facility UUID to switch to',
    example: '323e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID("all")
  @IsNotEmpty()
  facilityId!: string;
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
