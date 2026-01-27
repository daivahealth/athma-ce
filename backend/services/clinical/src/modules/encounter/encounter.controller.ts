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
  UseGuards,
} from '@nestjs/common';
import { EncounterService } from './encounter.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { SearchEncounterDto } from './dto/search-encounter.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  ENCOUNTER_READ,
  ENCOUNTER_CREATE,
  ENCOUNTER_UPDATE,
} from '@zeal/contracts';

@Controller('encounters')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  /**
   * POST /encounters - Create a new encounter
   */
  @Post()
  @Permissions(ENCOUNTER_CREATE)
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
  @Permissions(ENCOUNTER_READ)
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
  @Permissions(ENCOUNTER_READ)
  async getTodayEncounters(
    @Param('facilityId') facilityId: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getTodayEncounters(facilityId, tenantId);
  }

  /**
   * GET /encounters/patient/:patientId/active - Get patient's active encounters
   * Used for linking existing encounters to inpatient admissions
   * IMPORTANT: This route must be defined BEFORE the general patient/:patientId route
   */
  @Get('patient/:patientId/active')
  @Permissions(ENCOUNTER_READ)
  async getPatientActiveEncounters(
    @Param('patientId') patientId: string,
    @TenantId() tenantId: string
  ) {
    return this.encounterService.getPatientActiveEncounters(patientId, tenantId);
  }

  /**
   * GET /encounters/patient/:patientId - Get patient encounters
   */
  @Get('patient/:patientId')
  @Permissions(ENCOUNTER_READ)
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
  @Permissions(ENCOUNTER_READ)
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
  @Permissions(ENCOUNTER_UPDATE)
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
  @Permissions(ENCOUNTER_UPDATE)
  async updateEncounterStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @TenantId() tenantId: string
  ) {
    return this.encounterService.updateEncounterStatus(id, body.status, tenantId);
  }

}
