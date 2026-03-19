import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalCodingsService, CreateClinicalCodingDto } from '../services/clinical-codings.service';

@ApiTags('Clinical Codings')
@ApiBearerAuth()
@Controller('clinical-codings')
export class ClinicalCodingsController {
  constructor(private readonly clinicalCodingsService: ClinicalCodingsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a clinical coding (from AI suggestion or manual)' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateClinicalCodingDto,
  ) {
    return this.clinicalCodingsService.create(tenantId, dto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Record multiple clinical codings at once' })
  async createMany(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dtos: CreateClinicalCodingDto[],
  ) {
    return this.clinicalCodingsService.createMany(tenantId, dtos);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get clinical codings for an encounter' })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.clinicalCodingsService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get clinical codings for a patient' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicalCodingsService.findByPatient(tenantId, patientId, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a clinical coding by ID' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalCodingsService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a clinical coding status' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.clinicalCodingsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinical coding' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalCodingsService.delete(tenantId, id);
  }
}
