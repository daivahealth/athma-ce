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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalNotesService } from '../services/clinical-notes.service';
import {
  CreateClinicalNoteDto,
  UpdateClinicalNoteDto,
  UpdateNoteSectionsDto,
  SignNoteDto,
  ClinicalNoteResponseDto,
} from '../dto/clinical-note.dto';

@ApiTags('Clinical Notes')
@ApiBearerAuth()
@Controller('clinical-notes')
export class ClinicalNotesController {
  constructor(private readonly clinicalNotesService: ClinicalNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical note' })
  @ApiResponse({ status: 201, description: 'Clinical note created successfully', type: ClinicalNoteResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateClinicalNoteDto,
  ) {
    return this.clinicalNotesService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical note by ID' })
  @ApiResponse({ status: 200, description: 'Clinical note found', type: ClinicalNoteResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalNotesService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all clinical notes for an encounter' })
  @ApiResponse({ status: 200, description: 'Clinical notes retrieved', type: [ClinicalNoteResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalNotesService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all clinical notes for a patient' })
  @ApiResponse({ status: 200, description: 'Clinical notes retrieved', type: [ClinicalNoteResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicalNotesService.findByPatient(tenantId, patientId, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clinical note metadata' })
  @ApiResponse({ status: 200, description: 'Clinical note updated', type: ClinicalNoteResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClinicalNoteDto,
  ) {
    return this.clinicalNotesService.update(tenantId, id, dto);
  }

  @Put(':id/sections')
  @ApiOperation({ summary: 'Update clinical note sections' })
  @ApiResponse({ status: 200, description: 'Sections updated', type: ClinicalNoteResponseDto })
  async updateSections(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteSectionsDto,
  ) {
    return this.clinicalNotesService.updateSections(tenantId, id, dto);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign a clinical note' })
  @ApiResponse({ status: 200, description: 'Note signed successfully', type: ClinicalNoteResponseDto })
  async signNote(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: SignNoteDto,
  ) {
    return this.clinicalNotesService.signNote(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinical note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalNotesService.delete(tenantId, id);
  }

  @Get('encounter/:encounterId/statistics')
  @ApiOperation({ summary: 'Get notes statistics for an encounter' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalNotesService.getNotesStatistics(tenantId, encounterId);
  }
}
