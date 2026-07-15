/**
 * Patient Narrative Controller
 * Exposes the AI Care Narrative endpoint used by the Care Context workspace.
 */

import { Body, Controller, Param, ParseBoolPipe, Post, Query, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PatientNarrativeService } from '../services/patient-narrative.service';
import {
  CareNarrativeDryRunDto,
  CareNarrativeResponseDto,
  CareNarrativeUnavailableDto,
  GenerateNarrativeDto,
} from '../dto/patient-narrative.dto';
import { TenantId } from '../../../common/decorators/tenant-context.decorator';
import { logger } from '../../../common/logger/logger.config';

@ApiTags('Patient Narrative')
@ApiExtraModels(CareNarrativeResponseDto, CareNarrativeDryRunDto, CareNarrativeUnavailableDto)
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-tenant-id')
@ApiSecurity('x-user-id')
@ApiSecurity('x-facility-id')
@Controller('ai/patients')
export class PatientNarrativeController {
  constructor(private readonly patientNarrativeService: PatientNarrativeService) {}

  @Post(':patientId/narrative')
  @ApiOperation({
    summary: 'Generate an AI Care Narrative for a patient',
    description:
      "Assembles the patient's demographics, encounters, and latest observations into a " +
      'specialty-aware clinical summary using the shared clinical-summary prompt. ' +
      'If no LLM provider/API key is configured, responds 503 with `{ available: false, reason }` ' +
      'so the client can fall back to its local narrative preview. ' +
      'Pass `?dryRun=true` to return the assembled prompt without calling the LLM.',
  })
  @ApiParam({ name: 'patientId', description: 'Patient UUID', format: 'uuid' })
  @ApiQuery({
    name: 'dryRun',
    required: false,
    type: Boolean,
    description: 'Return the assembled prompt without calling the LLM',
  })
  @ApiResponse({
    status: 200,
    description: 'Narrative generated, or (with dryRun=true) the assembled prompt',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CareNarrativeResponseDto) },
        { $ref: getSchemaPath(CareNarrativeDryRunDto) },
      ],
    },
  })
  @ApiResponse({
    status: 503,
    description: 'AI narrative unavailable (no LLM provider/key configured or upstream error)',
    type: CareNarrativeUnavailableDto,
  })
  async generate(
    @Param('patientId') patientId: string,
    @Body() dto: GenerateNarrativeDto,
    @TenantId() tenantId: string,
    @Res({ passthrough: true }) res: Response,
    @Query('dryRun', new ParseBoolPipe({ optional: true })) dryRun?: boolean,
  ): Promise<CareNarrativeResponseDto | CareNarrativeUnavailableDto | CareNarrativeDryRunDto> {
    logger.info({ tenantId, patientId, specialty: dto.specialty, dryRun: !!dryRun }, 'Care narrative requested');

    const result = await this.patientNarrativeService.generate(patientId, tenantId, {
      specialty: dto.specialty,
      dryRun: !!dryRun,
    });

    if ('available' in result && result.available === false) {
      // Return the structured body directly with a 503 (bypasses the exception filter
      // so the `{ available, reason }` contract is preserved for the frontend fallback).
      res.status(503);
      return result;
    }

    return result as CareNarrativeResponseDto | CareNarrativeDryRunDto;
  }
}
