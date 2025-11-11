/**
 * Encounter Controller
 *
 * REST API endpoints for encounter management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { EncounterService } from './encounter.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { SearchEncounterDto } from './dto/search-encounter.dto';
import { UpdateVitalsDto } from './dto/vitals.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('encounters')
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  /**
   * POST /encounters - Create a new encounter
   */
  @Post()
  async createEncounter(
    @Body() dto: CreateEncounterDto,
    @Context() context: any
  ) {
    return this.encounterService.createEncounter(dto, context);
  }

  /**
   * GET /encounters - Search encounters
   */
  @Get()
  async searchEncounters(
    @Query() query: SearchEncounterDto,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.searchEncounters(tenantId, query);
  }

  /**
   * GET /encounters/facility/:facilityId/today - Get today's encounters for a facility
   */
  @Get('facility/:facilityId/today')
  async getTodayEncounters(
    @Param('facilityId') facilityId: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getTodayEncounters(facilityId, tenantId);
  }

  /**
   * GET /encounters/patient/:patientId - Get patient encounters
   */
  @Get('patient/:patientId')
  async getPatientEncounters(
    @Param('patientId') patientId: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getPatientEncounters(patientId, tenantId);
  }

  /**
   * GET /encounters/:id - Get encounter by ID
   */
  @Get(':id')
  async getEncounter(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getEncounterById(id, tenantId);
  }

  /**
   * PUT /encounters/:id - Update encounter
   */
  @Put(':id')
  async updateEncounter(
    @Param('id') id: string,
    @Body() dto: UpdateEncounterDto,
    @Context() context: any
  ) {
    return this.encounterService.updateEncounter(id, dto, context);
  }

  /**
   * PATCH /encounters/:id/status - Update encounter status
   */
  @Patch(':id/status')
  async updateEncounterStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @TenantId() tenantId: string
  ) {
    return this.encounterService.updateEncounterStatus(id, body.status, tenantId);
  }

  /**
   * PATCH /encounters/:id/vitals - Update encounter vitals
   */
  @Patch(':id/vitals')
  async updateVitals(
    @Param('id') id: string,
    @Body() dto: UpdateVitalsDto,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.updateVitals(id, dto, tenantId);
  }

  /**
   * GET /encounters/:id/vitals - Get encounter vitals
   */
  @Get(':id/vitals')
  async getVitals(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getVitals(id, tenantId);
  }
}
