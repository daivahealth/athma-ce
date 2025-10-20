import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  mfaCode?: string | null;

  @IsOptional()
  @IsString()
  deviceId?: string | null;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  allDevices?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email!: string;
}

export class ConfirmResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class MfaVerifyDto {
  @IsUUID()
  userId!: string;

  @IsIn(['totp', 'sms', 'email'])
  method!: 'totp' | 'sms' | 'email';

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class SwitchFacilityDto {
  @IsUUID()
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
