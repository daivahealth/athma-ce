import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EncounterNotesService } from '../services/encounter-notes.service';
import {
  CreateEncounterNoteDto,
  UpdateEncounterNoteDto,
  UpdateNoteSectionsDto,
  SignNoteDto,
  EncounterNoteResponseDto,
} from '../dto/encounter-note.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CLINICAL_NOTE_READ,
  CLINICAL_NOTE_CREATE,
  CLINICAL_NOTE_UPDATE,
  CLINICAL_NOTE_DELETE,
  CLINICAL_NOTE_SIGN,
} from '@zeal/contracts';

@ApiTags('Encounter Notes')
@ApiBearerAuth()
@Controller('encounter-notes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EncounterNotesController {
  constructor(private readonly encounterNotesService: EncounterNotesService) {}

  @Post()
  @Permissions(CLINICAL_NOTE_CREATE)
  @ApiOperation({ summary: 'Create a new encounter note' })
  @ApiResponse({ status: 201, description: 'Encounter note created successfully', type: EncounterNoteResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateEncounterNoteDto,
  ) {
    return this.encounterNotesService.create(tenantId, dto);
  }

  @Get(':id')
  @Permissions(CLINICAL_NOTE_READ)
  @ApiOperation({ summary: 'Get encounter note by ID' })
  @ApiResponse({ status: 200, description: 'Encounter note found', type: EncounterNoteResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.encounterNotesService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @Permissions(CLINICAL_NOTE_READ)
  @ApiOperation({ summary: 'Get all encounter notes for an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter notes retrieved', type: [EncounterNoteResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.encounterNotesService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @Permissions(CLINICAL_NOTE_READ)
  @ApiOperation({ summary: 'Get all encounter notes for a patient' })
  @ApiResponse({ status: 200, description: 'Encounter notes retrieved', type: [EncounterNoteResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.encounterNotesService.findByPatient(tenantId, patientId, limit);
  }

  @Patch(':id')
  @Permissions(CLINICAL_NOTE_UPDATE)
  @ApiOperation({ summary: 'Update encounter note metadata' })
  @ApiResponse({ status: 200, description: 'Encounter note updated', type: EncounterNoteResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEncounterNoteDto,
  ) {
    return this.encounterNotesService.update(tenantId, id, dto);
  }

  @Put(':id/sections')
  @Permissions(CLINICAL_NOTE_UPDATE)
  @ApiOperation({ summary: 'Update encounter note sections' })
  @ApiResponse({ status: 200, description: 'Sections updated', type: EncounterNoteResponseDto })
  async updateSections(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteSectionsDto,
  ) {
    return this.encounterNotesService.updateSections(tenantId, id, dto);
  }

  @Post(':id/sign')
  @Permissions(CLINICAL_NOTE_SIGN)
  @ApiOperation({ summary: 'Sign an encounter note' })
  @ApiResponse({ status: 200, description: 'Note signed successfully', type: EncounterNoteResponseDto })
  async signNote(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: SignNoteDto,
  ) {
    return this.encounterNotesService.signNote(tenantId, id, dto);
  }

  @Delete(':id')
  @Permissions(CLINICAL_NOTE_DELETE)
  @ApiOperation({ summary: 'Delete an encounter note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.encounterNotesService.delete(tenantId, id);
  }

  @Get('encounter/:encounterId/statistics')
  @Permissions(CLINICAL_NOTE_READ)
  @ApiOperation({ summary: 'Get notes statistics for an encounter' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.encounterNotesService.getNotesStatistics(tenantId, encounterId);
  }
}
