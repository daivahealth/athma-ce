/**
 * HIE Controller
 *
 * REST API for consent-driven fetch of external patient records via a
 * configurable Health Information Exchange provider. See ADR-0012.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CONSENT_CREATE,
  CONSENT_READ,
  PATIENT_READ,
  PATIENT_UPDATE,
} from '@zeal/contracts';
import { HieService } from './hie.service';
import { CreateHieConsentRequestDto, FetchExternalRecordsDto } from './dto/hie.dto';

@Controller('hie')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HieController {
  constructor(private readonly hieService: HieService) {}

  /**
   * POST /hie/consent-requests - Create a consent request for external fetch
   */
  @Post('consent-requests')
  @Permissions(CONSENT_CREATE)
  async createConsentRequest(
    @Body() dto: CreateHieConsentRequestDto,
    @Req() req: any,
  ) {
    const context = this.getContext(req);
    return this.hieService.createConsentRequest(dto, context);
  }

  /**
   * GET /hie/consent-requests/:id - Get a consent request by id
   */
  @Get('consent-requests/:id')
  @Permissions(CONSENT_READ)
  async getConsentRequest(@Param('id') id: string, @Req() req: any) {
    const context = this.getContext(req);
    return this.hieService.getConsentRequest(id, context.tenantId);
  }

  /**
   * POST /hie/fetch - Consent-gated fetch of external records
   */
  @Post('fetch')
  @Permissions(PATIENT_UPDATE)
  async fetch(@Body() dto: FetchExternalRecordsDto, @Req() req: any) {
    const context = this.getContext(req);
    return this.hieService.fetchRecords(dto, context);
  }

  /**
   * GET /hie/fetch-status/:id - Get fetch job status (with retry affordance)
   */
  @Get('fetch-status/:id')
  @Permissions(PATIENT_READ)
  async fetchStatus(@Param('id') id: string, @Req() req: any) {
    const context = this.getContext(req);
    return this.hieService.getFetchStatus(id, context.tenantId);
  }

  /**
   * POST /hie/fetch/:id/retry - Retry a failed fetch job
   */
  @Post('fetch/:id/retry')
  @Permissions(PATIENT_UPDATE)
  async retryFetch(@Param('id') id: string, @Req() req: any) {
    const context = this.getContext(req);
    return this.hieService.retryFetch(id, context);
  }

  private getContext(req: any) {
    if (!req.context) {
      throw new Error(
        'Request context not found. Ensure TenantContextMiddleware is applied.',
      );
    }
    return {
      ...req.context,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
  }
}
