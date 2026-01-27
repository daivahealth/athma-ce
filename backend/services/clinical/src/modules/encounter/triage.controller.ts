/**
 * Triage Controller
 *
 * REST API endpoints for triage management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TriageService } from './triage.service';
import { CreateTriageDto, UpdateTriageDto, TriageResponseDto } from './dto/triage.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  TRIAGE_READ,
  TRIAGE_CREATE,
  TRIAGE_UPDATE,
  TRIAGE_DELETE,
} from '@zeal/contracts';

@ApiTags('Triage')
@Controller('triage')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  /**
   * POST /triage - Create a new triage record
   */
  @Post()
  @Permissions(TRIAGE_CREATE)
  @ApiOperation({ summary: 'Create a new triage record' })
  @ApiResponse({ status: 201, description: 'Triage created successfully', type: TriageResponseDto })
  @ApiResponse({ status: 404, description: 'Encounter or patient not found' })
  @ApiResponse({ status: 409, description: 'Triage already exists for this encounter' })
  async createTriage(
    @Body() dto: CreateTriageDto,
    @Context() context: any
  ) {
    return this.triageService.createTriage(dto, context);
  }

  /**
   * GET /triage/encounter/:encounterId - Get triage by encounter ID
   */
  @Get('encounter/:encounterId')
  @Permissions(TRIAGE_READ)
  @ApiOperation({ summary: 'Get triage by encounter ID' })
  @ApiParam({ name: 'encounterId', description: 'Encounter UUID' })
  @ApiResponse({ status: 200, description: 'Triage found', type: TriageResponseDto })
  @ApiResponse({ status: 404, description: 'Triage not found' })
  async getTriageByEncounterId(
    @Param('encounterId') encounterId: string,
    @TenantId() tenantId: string
  ) {
    return this.triageService.getTriageByEncounterId(encounterId, tenantId);
  }

  /**
   * GET /triage/patient/:patientId - Get patient's triage history
   */
  @Get('patient/:patientId')
  @Permissions(TRIAGE_READ)
  @ApiOperation({ summary: "Get patient's triage history" })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Patient triages found', type: [TriageResponseDto] })
  async getPatientTriages(
    @Param('patientId') patientId: string,
    @TenantId() tenantId: string
  ) {
    return this.triageService.getPatientTriages(patientId, tenantId);
  }

  /**
   * GET /triage/level/:triageLevel - Get triages by priority level
   */
  @Get('level/:triageLevel')
  @Permissions(TRIAGE_READ)
  @ApiOperation({ summary: 'Get triages by priority level (for prioritization)' })
  @ApiParam({ name: 'triageLevel', description: 'Triage level (1-5)' })
  @ApiResponse({ status: 200, description: 'Triages found', type: [TriageResponseDto] })
  async getTriagesByLevel(
    @Param('triageLevel') triageLevel: string,
    @TenantId() tenantId: string
  ) {
    return this.triageService.getTriagesByLevel(parseInt(triageLevel), tenantId);
  }

  /**
   * GET /triage/:id - Get triage by ID
   */
  @Get(':id')
  @Permissions(TRIAGE_READ)
  @ApiOperation({ summary: 'Get triage by ID' })
  @ApiParam({ name: 'id', description: 'Triage UUID' })
  @ApiResponse({ status: 200, description: 'Triage found', type: TriageResponseDto })
  @ApiResponse({ status: 404, description: 'Triage not found' })
  async getTriageById(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.triageService.getTriageById(id, tenantId);
  }

  /**
   * PUT /triage/:id - Update triage
   */
  @Put(':id')
  @Permissions(TRIAGE_UPDATE)
  @ApiOperation({ summary: 'Update triage record' })
  @ApiParam({ name: 'id', description: 'Triage UUID' })
  @ApiResponse({ status: 200, description: 'Triage updated successfully', type: TriageResponseDto })
  @ApiResponse({ status: 404, description: 'Triage not found' })
  async updateTriage(
    @Param('id') id: string,
    @Body() dto: UpdateTriageDto,
    @Context() context: any
  ) {
    return this.triageService.updateTriage(id, dto, context);
  }

  /**
   * DELETE /triage/:id - Delete triage
   */
  @Delete(':id')
  @Permissions(TRIAGE_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete triage record' })
  @ApiParam({ name: 'id', description: 'Triage UUID' })
  @ApiResponse({ status: 200, description: 'Triage deleted successfully' })
  @ApiResponse({ status: 404, description: 'Triage not found' })
  async deleteTriage(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.triageService.deleteTriage(id, tenantId);
  }
}
