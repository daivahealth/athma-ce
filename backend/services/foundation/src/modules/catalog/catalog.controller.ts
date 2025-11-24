/**
 * Catalog Controller
 *
 * REST API endpoints for managing master catalog data.
 * Routes: /catalogs/{medications|lab-tests|imaging-studies|procedures|diagnoses|diagnosis-versions}
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateLabTestDto, UpdateLabTestDto } from './dto/lab-test.dto';
import { CreateImagingStudyDto, UpdateImagingStudyDto } from './dto/imaging-study.dto';
import { CreateProcedureDto, UpdateProcedureDto } from './dto/procedure.dto';

@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  private getContext(req: any) {
    if (!req.context) {
      throw new Error('Request context not found');
    }
    return req.context;
  }

  // ========================================
  // MEDICATION ENDPOINTS
  // ========================================

  @Get('medications')
  async listMedications(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('includeGlobal') includeGlobal?: string,
  ) {
    return this.catalogService.listMedications({
      tenantId,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      includeGlobal: includeGlobal !== 'false',
    });
  }

  @Get('medications/:id')
  async getMedicationById(@Param('id') id: string) {
    return this.catalogService.getMedicationById(id);
  }

  @Post('medications')
  async createMedication(@Body() data: any) {
    return this.catalogService.createMedication(data);
  }

  @Put('medications/:id')
  async updateMedication(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateMedication(id, data);
  }

  @Delete('medications/:id')
  async deactivateMedication(@Param('id') id: string) {
    return this.catalogService.deactivateMedication(id);
  }

  // ========================================
  // LAB TEST ENDPOINTS
  // ========================================

  @Get('lab-tests')
  async listLabTests(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('includeGlobal') includeGlobal?: string,
  ) {
    return this.catalogService.listLabTests({
      tenantId,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      includeGlobal: includeGlobal !== 'false',
    });
  }

  @Get('lab-tests/:id')
  async getLabTestById(@Param('id') id: string) {
    return this.catalogService.getLabTestById(id);
  }

  @Post('lab-tests')
  async createLabTest(@Body() data: CreateLabTestDto) {
    return this.catalogService.createLabTest(data);
  }

  @Put('lab-tests/:id')
  async updateLabTest(@Param('id') id: string, @Body() data: UpdateLabTestDto) {
    return this.catalogService.updateLabTest(id, data);
  }

  @Delete('lab-tests/:id')
  async deactivateLabTest(@Param('id') id: string) {
    return this.catalogService.deactivateLabTest(id);
  }

  // ========================================
  // IMAGING STUDY ENDPOINTS
  // ========================================

  @Get('imaging-studies')
  async listImagingStudies(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('includeGlobal') includeGlobal?: string,
  ) {
    return this.catalogService.listImagingStudies({
      tenantId,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      includeGlobal: includeGlobal !== 'false',
    });
  }

  @Get('imaging-studies/:id')
  async getImagingStudyById(@Param('id') id: string) {
    return this.catalogService.getImagingStudyById(id);
  }

  @Post('imaging-studies')
  async createImagingStudy(@Body() data: CreateImagingStudyDto) {
    return this.catalogService.createImagingStudy(data);
  }

  @Put('imaging-studies/:id')
  async updateImagingStudy(@Param('id') id: string, @Body() data: UpdateImagingStudyDto) {
    return this.catalogService.updateImagingStudy(id, data);
  }

  @Delete('imaging-studies/:id')
  async deactivateImagingStudy(@Param('id') id: string) {
    return this.catalogService.deactivateImagingStudy(id);
  }

  // ========================================
  // PROCEDURE ENDPOINTS
  // ========================================

  @Get('procedures')
  async listProcedures(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('includeGlobal') includeGlobal?: string,
  ) {
    return this.catalogService.listProcedures({
      tenantId,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      includeGlobal: includeGlobal !== 'false',
    });
  }

  @Get('procedures/:id')
  async getProcedureById(@Param('id') id: string) {
    return this.catalogService.getProcedureById(id);
  }

  @Post('procedures')
  async createProcedure(@Body() data: CreateProcedureDto) {
    return this.catalogService.createProcedure(data);
  }

  @Put('procedures/:id')
  async updateProcedure(@Param('id') id: string, @Body() data: UpdateProcedureDto) {
    return this.catalogService.updateProcedure(id, data);
  }

  @Delete('procedures/:id')
  async deactivateProcedure(@Param('id') id: string) {
    return this.catalogService.deactivateProcedure(id);
  }

  // ========================================
  // DIAGNOSIS VERSION ENDPOINTS
  // ========================================

  @Get('diagnosis-versions')
  async listDiagnosisVersions(
    @Query('tenantId') tenantId?: string,
    @Query('codeSet') codeSet?: string,
    @Query('importStatus') importStatus?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.catalogService.listDiagnosisVersions({
      tenantId,
      codeSet,
      importStatus,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get('diagnosis-versions/:id')
  async getDiagnosisVersion(@Param('id') id: string) {
    return this.catalogService.getDiagnosisVersionById(id);
  }

  @Post('diagnosis-versions')
  async createDiagnosisVersion(@Body() data: any) {
    return this.catalogService.createDiagnosisVersion(data);
  }

  @Put('diagnosis-versions/:id')
  async updateDiagnosisVersion(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateDiagnosisVersion(id, data);
  }

  @Delete('diagnosis-versions/:id')
  async deactivateDiagnosisVersion(@Param('id') id: string) {
    return this.catalogService.deactivateDiagnosisVersion(id);
  }

  @Post('diagnosis-versions/:id/import')
  async importDiagnosisCodes(@Param('id') id: string, @Body('records') records: any[]) {
    return this.catalogService.importDiagnosisCodes(id, records);
  }

  // ========================================
  // DIAGNOSIS ENDPOINTS
  // ========================================

  @Get('diagnoses')
  async listDiagnoses(
    @Query('tenantId') tenantId?: string,
    @Query('versionId') versionId?: string,
    @Query('codeSet') codeSet?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.listDiagnoses({
      tenantId,
      versionId,
      codeSet,
      search,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get('diagnoses/:id')
  async getDiagnosis(@Param('id') id: string) {
    return this.catalogService.getDiagnosisById(id);
  }

  @Post('diagnoses')
  async createDiagnosis(@Body() data: any) {
    return this.catalogService.createDiagnosis(data);
  }

  @Put('diagnoses/:id')
  async updateDiagnosis(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateDiagnosis(id, data);
  }

  @Delete('diagnoses/:id')
  async deactivateDiagnosis(@Param('id') id: string) {
    return this.catalogService.deactivateDiagnosis(id);
  }
}
