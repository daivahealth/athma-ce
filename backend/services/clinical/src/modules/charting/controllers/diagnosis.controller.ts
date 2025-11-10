import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Headers,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { DiagnosisService } from '../services/diagnosis.service';
  import { CreateDiagnosisDto, UpdateDiagnosisDto, DiagnosisResponseDto } from '../dto/diagnosis.dto';
  
  @ApiTags('Diagnoses')
  @ApiBearerAuth()
  @Controller('diagnoses')
  export class DiagnosisController {
    constructor(private readonly diagnosisService: DiagnosisService) {}
  
    @Post()
    @ApiOperation({ summary: 'Add a diagnosis to encounter' })
    @ApiResponse({ status: 201, description: 'Diagnosis added successfully', type: DiagnosisResponseDto })
    async create(
      @Headers('x-tenant-id') tenantId: string,
      @Body() dto: CreateDiagnosisDto,
    ) {
      return this.diagnosisService.create(tenantId, dto);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get diagnosis by ID' })
    @ApiResponse({ status: 200, description: 'Diagnosis found', type: DiagnosisResponseDto })
    async findById(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.diagnosisService.findById(tenantId, id);
    }
  
    @Get('encounter/:encounterId')
    @ApiOperation({ summary: 'Get all diagnoses for an encounter' })
    @ApiResponse({ status: 200, description: 'Diagnoses retrieved', type: [DiagnosisResponseDto] })
    async findByEncounter(
      @Headers('x-tenant-id') tenantId: string,
      @Param('encounterId') encounterId: string,
    ) {
      return this.diagnosisService.findByEncounter(tenantId, encounterId);
    }
  
    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Get all diagnoses for a patient' })
    @ApiResponse({ status: 200, description: 'Diagnoses retrieved', type: [DiagnosisResponseDto] })
    async findByPatient(
      @Headers('x-tenant-id') tenantId: string,
      @Param('patientId') patientId: string,
      @Query('limit') limit?: number,
    ) {
      return this.diagnosisService.findByPatient(tenantId, patientId, limit);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a diagnosis' })
    @ApiResponse({ status: 200, description: 'Diagnosis updated', type: DiagnosisResponseDto })
    async update(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
      @Body() dto: UpdateDiagnosisDto,
    ) {
      return this.diagnosisService.update(tenantId, id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove a diagnosis' })
    @ApiResponse({ status: 200, description: 'Diagnosis deleted successfully' })
    async delete(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.diagnosisService.delete(tenantId, id);
    }
  }