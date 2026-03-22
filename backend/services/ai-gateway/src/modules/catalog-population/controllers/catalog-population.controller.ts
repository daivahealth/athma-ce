/**
 * Catalog Population Controller
 * REST endpoints for AI-powered catalog auto-population.
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { CatalogPopulationService } from '../services/catalog-population.service';
import { CatalogJobTrackerService } from '../services/catalog-job-tracker.service';
import {
  StartCatalogPopulationDto,
  StartCatalogPopulationResponseDto,
  CatalogPopulationStatusDto,
  CountryInfoDto,
  CatalogPopulationHistoryItemDto,
} from '../dto/catalog-population.dto';
import {
  TenantId,
  UserId,
  FacilityId,
} from '../../../common/decorators/tenant-context.decorator';
import { logger } from '../../../common/logger/logger.config';

@ApiTags('Catalog Population')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-tenant-id')
@ApiSecurity('x-user-id')
@ApiSecurity('x-facility-id')
@Controller('catalog-population')
export class CatalogPopulationController {
  constructor(
    private populationService: CatalogPopulationService,
    private jobTracker: CatalogJobTrackerService,
  ) {}

  @Post('start')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Start catalog population for a country',
    description:
      'Launches an async job that populates catalog data using curated templates and AI generation. ' +
      'Returns a job ID for progress tracking.',
  })
  @ApiResponse({ status: 202, description: 'Job started', type: StartCatalogPopulationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request or job already running' })
  async start(
    @Body() dto: StartCatalogPopulationDto,
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @FacilityId() facilityId: string,
  ): Promise<StartCatalogPopulationResponseDto> {
    logger.info(
      { tenantId, countryIso: dto.countryIso, catalogTypes: dto.catalogTypes },
      'Catalog population start requested',
    );

    try {
      const { jobId, totalCatalogs } = await this.populationService.startPopulation(
        dto,
        tenantId,
        userId,
        facilityId,
      );

      return {
        jobId,
        totalCatalogs,
        message: `Catalog population started for country ${dto.countryIso}. Use the status endpoint to track progress.`,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get catalog population job status' })
  @ApiResponse({ status: 200, description: 'Job status', type: CatalogPopulationStatusDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getStatus(
    @Param('jobId') jobId: string,
  ): Promise<CatalogPopulationStatusDto> {
    const status = await this.jobTracker.getStatus(jobId);
    if (!status) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }
    return status;
  }

  @Post('cancel/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a running catalog population job' })
  @ApiResponse({ status: 200, description: 'Job cancelled' })
  @ApiResponse({ status: 400, description: 'Job is not running' })
  async cancel(
    @Param('jobId') jobId: string,
  ): Promise<{ cancelled: boolean }> {
    const cancelled = await this.populationService.cancelJob(jobId);
    if (!cancelled) {
      throw new BadRequestException('Job is not running or does not exist');
    }
    return { cancelled: true };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get catalog population job history for the current tenant' })
  @ApiResponse({ status: 200, description: 'Job history', type: [CatalogPopulationHistoryItemDto] })
  async getHistory(
    @TenantId() tenantId: string,
  ): Promise<CatalogPopulationStatusDto[]> {
    return this.jobTracker.getHistory(tenantId);
  }

  @Get('countries')
  @ApiOperation({
    summary: 'Get available countries with template coverage info',
    description: 'Returns the list of countries with curated template data and which catalogs will be AI-generated.',
  })
  @ApiResponse({ status: 200, description: 'Country list', type: [CountryInfoDto] })
  async getCountries(): Promise<CountryInfoDto[]> {
    return this.populationService.getCountries();
  }
}
