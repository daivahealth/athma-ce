import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { AbhaService } from './abha.service';
import { AbdmProviderError } from './abdm-error';
import type { AbdmScope } from './abdm-types';

// Seeded platform ids are UUID-shaped but not RFC-variant, so IsUUID() rejects them.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


class ScopedDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;
}

class EnrolOtpDto extends ScopedDto {
  /** Raw Aadhaar number. SENSITIVE — encrypted before it leaves this service, never logged. */
  @IsString()
  @MinLength(12)
  @MaxLength(20)
  aadhaar!: string;
}

class LoginOtpDto extends ScopedDto {
  @IsString()
  loginHint!: string;

  /** Raw identifier (aadhaar / mobile / abha-number). SENSITIVE. */
  @IsString()
  @MinLength(1)
  loginId!: string;
}

class VerifyDto extends ScopedDto {
  @IsString()
  txnId!: string;

  /** SENSITIVE — never logged or persisted. */
  @IsString()
  otp!: string;

  @IsOptional()
  @IsString()
  mobile?: string;
}

class TxnDto extends ScopedDto {
  @IsString()
  txnId!: string;
}

class AddressDto extends TxnDto {
  @IsString()
  abhaAddress!: string;
}

/**
 * ABHA flows over the internal service-to-service surface. Sensitive values
 * (Aadhaar, OTP) transit request BODIES on the internal network only, are
 * encrypted before leaving this process toward NHA, and are never logged.
 *
 * AbdmProviderError is serialized as 422 {code, message, retryable}; the
 * clinical thin client re-raises it as IdentityProviderError.
 */
@Controller('internal/abha')
@UseGuards(InternalApiKeyGuard)
export class AbhaController {
  constructor(private readonly abha: AbhaService) {}

  @Post('enrol/request-otp')
  @HttpCode(HttpStatus.OK)
  async requestEnrolOtp(@Body() dto: EnrolOtpDto) {
    return this.run(dto, (gw, scope) => gw.requestEnrolOtp(scope, dto.aadhaar));
  }

  @Post('enrol/verify')
  @HttpCode(HttpStatus.OK)
  async enrolVerify(@Body() dto: VerifyDto) {
    return this.run(dto, (gw, scope) => gw.enrolByAadhaar(scope, dto.txnId, dto.otp, dto.mobile));
  }

  @Post('login/request-otp')
  @HttpCode(HttpStatus.OK)
  async requestLoginOtp(@Body() dto: LoginOtpDto) {
    return this.run(dto, (gw, scope) => gw.requestLoginOtp(scope, dto.loginHint, dto.loginId));
  }

  @Post('login/verify')
  @HttpCode(HttpStatus.OK)
  async loginVerify(@Body() dto: VerifyDto) {
    return this.run(dto, (gw, scope) => gw.verifyLogin(scope, dto.txnId, dto.otp));
  }

  @Post('address/suggestions')
  @HttpCode(HttpStatus.OK)
  async addressSuggestions(@Body() dto: TxnDto) {
    return this.run(dto, async (gw, scope) => ({
      suggestions: await gw.getAbhaAddressSuggestions(scope, dto.txnId),
    }));
  }

  @Post('address')
  @HttpCode(HttpStatus.OK)
  async createAddress(@Body() dto: AddressDto) {
    return this.run(dto, async (gw, scope) => ({
      abhaAddress: await gw.createAbhaAddress(scope, dto.txnId, dto.abhaAddress),
    }));
  }

  /** Which gateway this tenant/facility resolves to — credential presence only. */
  @Get('gateway')
  async gateway(@Query() query: ScopedDto) {
    return { gateway: await this.abha.gatewayName(this.scope(query)) };
  }

  /** Credential + live-handshake health check (activation gate). */
  @Get('health')
  async health(@Query() query: ScopedDto) {
    return this.abha.healthCheck(this.scope(query));
  }

  private scope(dto: ScopedDto): AbdmScope {
    return { tenantId: dto.tenantId, facilityId: dto.facilityId };
  }

  private async run<T>(
    dto: ScopedDto,
    fn: (gw: Awaited<ReturnType<AbhaService['gateway']>>, scope: AbdmScope) => Promise<T>,
  ): Promise<T & { gateway: string }> {
    const scope = this.scope(dto);
    const gw = await this.abha.gateway(scope);
    try {
      const result = await fn(gw, scope);
      return { ...(result as T), gateway: gw.name };
    } catch (error) {
      if (error instanceof AbdmProviderError) {
        throw new HttpException(
          { code: error.code, message: error.message, retryable: error.retryable },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }
}
