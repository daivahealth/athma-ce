/**
 * Clinical Coding Controller
 * Exposes the AI coding suggestion endpoint.
 */

import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { ClinicalCodingService } from '../services/clinical-coding.service';
import {
  ClinicalCodingSuggestDto,
  ClinicalCodingSuggestResponseDto,
} from '../dto/clinical-coding.dto';
import {
  Context,
  TenantId,
  FacilityId,
} from '../../../common/decorators/tenant-context.decorator';
import { TenantRequestContext } from '../../../common/middleware/tenant-context.middleware';
import { logger } from '../../../common/logger/logger.config';

@ApiTags('Clinical Coding')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-tenant-id')
@ApiSecurity('x-user-id')
@ApiSecurity('x-facility-id')
@Controller('clinical-coding')
export class ClinicalCodingController {
  constructor(private clinicalCodingService: ClinicalCodingService) {}

  @Post('suggest')
  @ApiOperation({
    summary: 'Suggest ICD-10 and SNOMED codes from clinical text',
    description:
      'Analyzes de-identified clinical narrative and returns relevant medical codes. ' +
      'No PHI/PII should be included in the request — a server-side sanitizer runs as defense-in-depth.',
  })
  @ApiResponse({ status: 200, description: 'Suggestions returned', type: ClinicalCodingSuggestResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async suggest(
    @Body() dto: ClinicalCodingSuggestDto,
    @TenantId() tenantId: string,
    @FacilityId() facilityId: string,
  ): Promise<ClinicalCodingSuggestResponseDto> {
    logger.info(
      { tenantId, textLength: dto.clinicalText.length, blockTypes: dto.blockTypes },
      'Clinical coding suggestion requested',
    );

    return this.clinicalCodingService.suggest(dto, tenantId, facilityId);
  }
}
