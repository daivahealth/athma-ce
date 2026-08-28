import {
  All,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsIn, IsObject, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { NhcxService, ExchangeKind } from './nhcx.service';
import { CallbackService } from '../callback/callback.service';

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class SubmitDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;

  @IsIn(['eligibility', 'preauth', 'claim'])
  kind!: ExchangeKind;

  @IsString()
  @MaxLength(100)
  recipientCode!: string;

  @IsOptional()
  @IsString()
  recipientCertPem?: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

/** Internal exchange surface for RCM (issue #122/#123). */
@Controller('internal/nhcx')
@UseGuards(InternalApiKeyGuard)
export class NhcxController {
  constructor(private readonly nhcx: NhcxService) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submit(@Body() dto: SubmitDto) {
    return this.nhcx.submit({
      scope: { tenantId: dto.tenantId, facilityId: dto.facilityId },
      kind: dto.kind,
      recipientCode: dto.recipientCode,
      recipientCertPem: dto.recipientCertPem,
      payload: dto.payload,
    });
  }

  @Get('exchanges/:tenantId/:correlationId')
  async exchange(
    @Param('tenantId') tenantId: string,
    @Param('correlationId') correlationId: string,
  ) {
    if (!UUID_SHAPE.test(tenantId)) throw new NotFoundException('Unknown exchange');
    const exchange = await this.nhcx.getExchange(tenantId, correlationId);
    if (!exchange) throw new NotFoundException('Unknown exchange');
    return { success: true, data: exchange };
  }
}

/**
 * Public ingress for HCX payer responses (on_check / on_submit). No gateway
 * JWT here — authenticity comes from the JWE (only content addressed to our
 * participant key decrypts) and correlation to an exchange we initiated;
 * anything else is quarantined. Always 202, mirroring the ABDM ingress.
 */
@Controller('callbacks/nhcx/v1')
export class NhcxCallbackController {
  constructor(
    private readonly nhcx: NhcxService,
    private readonly callbackService: CallbackService,
  ) {}

  @All(['', '*'])
  @HttpCode(202)
  async receive(@Req() req: Request): Promise<{ accepted: true }> {
    try {
      await this.nhcx.handleResponse(req.body);
    } catch (error) {
      await this.callbackService.quarantine(
        { path: req.path, headers: req.headers, body: req.body },
        'unresolvable',
        error instanceof Error ? error.message : String(error),
      );
    }
    return { accepted: true };
  }
}
