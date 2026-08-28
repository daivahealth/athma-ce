/**
 * ABHA Controller
 *
 * ABHA-specific extras that genuinely do not generalise across countries:
 * claiming an ABHA address after enrolment. Everything that does generalise
 * (validate / challenge / verify / patient linkage) lives on the generic
 * NationalIdentityController.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { PATIENT_IDENTITY_VERIFY } from '@zeal/contracts';
import { validateAbhaAddress } from '@zeal/validators';
import { AbhaProvider } from '../providers/abha/abha.provider';
import { AbdmConfigService } from '../providers/abha/abdm-config.service';
import { NationalIdentityService } from '../services/national-identity.service';
import { AbhaAddressSuggestionsDto, CreateAbhaAddressDto } from '../dto/national-identity.dto';
import { TenantId, FacilityId, Context } from '../../../common/decorators/tenant-context.decorator';

@Controller('national-identity/abha')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AbhaController {
  constructor(
    private readonly abha: AbhaProvider,
    private readonly config: AbdmConfigService,
    private readonly service: NationalIdentityService,
  ) {}

  /** POST /api/v1/national-identity/abha/address/suggestions */
  @Post('address/suggestions')
  @HttpCode(HttpStatus.OK)
  @Permissions(PATIENT_IDENTITY_VERIFY)
  async suggestions(
    @Body() dto: AbhaAddressSuggestionsDto,
    @TenantId() tenantId: string,
    @FacilityId() facilityId?: string,
  ) {
    await this.requireEnabled(tenantId);
    const suggestions = await this.abha.getAddressSuggestions({ tenantId, facilityId }, dto.txnId);
    return { suggestions };
  }

  /**
   * GET /api/v1/national-identity/abha/health — activation health check
   * (ADR-0015 lifecycle): resolves this tenant/facility's credentials and,
   * when live, performs a real gateway session handshake. status: 'ok' |
   * 'mock' (no credentials stored — flows run against the offline mock) |
   * 'error' (credentials present but the gateway handshake failed).
   */
  @Get('health')
  @Permissions(PATIENT_IDENTITY_VERIFY)
  async health(@TenantId() tenantId: string, @FacilityId() facilityId?: string) {
    return this.abha.healthCheck({ tenantId, facilityId });
  }

  /** POST /api/v1/national-identity/abha/address — claims an address. */
  @Post('address')
  @HttpCode(HttpStatus.OK)
  @Permissions(PATIENT_IDENTITY_VERIFY)
  async createAddress(@Body() dto: CreateAbhaAddressDto, @Context() context: any) {
    await this.requireEnabled(context.tenantId);

    const validation = validateAbhaAddress(dto.abhaAddress);
    if (!validation.isValid) {
      throw new BadRequestException({
        message: 'Invalid ABHA address',
        errors: validation.errors,
      });
    }

    const abhaAddress = await this.abha.createAddress(
      { tenantId: context.tenantId, facilityId: context.facilityId },
      dto.txnId,
      validation.normalizedValue ?? dto.abhaAddress,
    );

    // The address is only useful once it is on the patient's record — it is
    // what the HIE axis will later use as `patientReference`.
    const identity = dto.patientId
      ? await this.service.attachAbhaAddress(dto.patientId, abhaAddress, context)
      : null;

    return { abhaAddress, identity };
  }

  private async requireEnabled(tenantId: string): Promise<void> {
    const settings = await this.config.getSettings(tenantId);
    if (!settings.enabled) {
      throw new BadRequestException(
        'ABDM/ABHA is not enabled for this tenant. Enable abdm.enabled in Configurations.',
      );
    }
  }
}
