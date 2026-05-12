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
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateLabTestDto, UpdateLabTestDto } from './dto/lab-test.dto';
import { CreateImagingStudyDto, UpdateImagingStudyDto } from './dto/imaging-study.dto';
import { CreateProcedureDto, UpdateProcedureDto } from './dto/procedure.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CATALOG_READ,
  CATALOG_CREATE,
  CATALOG_UPDATE,
  CATALOG_DELETE,
} from '@zeal/contracts';

@Controller('catalogs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  @Permissions(CATALOG_READ)
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
  @Permissions(CATALOG_READ)
  async getMedicationById(@Param('id') id: string) {
    return this.catalogService.getMedicationById(id);
  }

  @Post('medications')
  @Permissions(CATALOG_CREATE)
  async createMedication(@Body() data: any) {
    return this.catalogService.createMedication(data);
  }

  @Put('medications/:id')
  @Permissions(CATALOG_UPDATE)
  async updateMedication(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateMedication(id, data);
  }

  @Delete('medications/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateMedication(@Param('id') id: string) {
    return this.catalogService.deactivateMedication(id);
  }

  // ========================================
  // LAB TEST ENDPOINTS
  // ========================================

  @Get('lab-tests')
  @Permissions(CATALOG_READ)
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
  @Permissions(CATALOG_READ)
  async getLabTestById(@Param('id') id: string) {
    return this.catalogService.getLabTestById(id);
  }

  @Post('lab-tests')
  @Permissions(CATALOG_CREATE)
  async createLabTest(@Body() data: CreateLabTestDto) {
    return this.catalogService.createLabTest(data);
  }

  @Put('lab-tests/:id')
  @Permissions(CATALOG_UPDATE)
  async updateLabTest(@Param('id') id: string, @Body() data: UpdateLabTestDto) {
    return this.catalogService.updateLabTest(id, data);
  }

  @Delete('lab-tests/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateLabTest(@Param('id') id: string) {
    return this.catalogService.deactivateLabTest(id);
  }

  // ========================================
  // IMAGING STUDY ENDPOINTS
  // ========================================

  @Get('imaging-studies')
  @Permissions(CATALOG_READ)
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
  @Permissions(CATALOG_READ)
  async getImagingStudyById(@Param('id') id: string) {
    return this.catalogService.getImagingStudyById(id);
  }

  @Post('imaging-studies')
  @Permissions(CATALOG_CREATE)
  async createImagingStudy(@Body() data: CreateImagingStudyDto) {
    return this.catalogService.createImagingStudy(data);
  }

  @Put('imaging-studies/:id')
  @Permissions(CATALOG_UPDATE)
  async updateImagingStudy(@Param('id') id: string, @Body() data: UpdateImagingStudyDto) {
    return this.catalogService.updateImagingStudy(id, data);
  }

  @Delete('imaging-studies/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateImagingStudy(@Param('id') id: string) {
    return this.catalogService.deactivateImagingStudy(id);
  }

  // ========================================
  // PROCEDURE ENDPOINTS
  // ========================================

  @Get('procedures')
  @Permissions(CATALOG_READ)
  async listProcedures(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('procedureCategory') procedureCategory?: string,
    @Query('includeGlobal') includeGlobal?: string,
  ) {
    return this.catalogService.listProcedures({
      tenantId,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      procedureCategory,
      includeGlobal: includeGlobal !== 'false',
    });
  }

  @Get('procedures/:id')
  @Permissions(CATALOG_READ)
  async getProcedureById(@Param('id') id: string) {
    return this.catalogService.getProcedureById(id);
  }

  @Post('procedures')
  @Permissions(CATALOG_CREATE)
  async createProcedure(@Body() data: CreateProcedureDto) {
    return this.catalogService.createProcedure(data);
  }

  @Put('procedures/:id')
  @Permissions(CATALOG_UPDATE)
  async updateProcedure(@Param('id') id: string, @Body() data: UpdateProcedureDto) {
    return this.catalogService.updateProcedure(id, data);
  }

  @Delete('procedures/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateProcedure(@Param('id') id: string) {
    return this.catalogService.deactivateProcedure(id);
  }

  // ========================================
  // DIAGNOSIS VERSION ENDPOINTS
  // ========================================

  @Get('diagnosis-versions')
  @Permissions(CATALOG_READ)
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
  @Permissions(CATALOG_READ)
  async getDiagnosisVersion(@Param('id') id: string) {
    return this.catalogService.getDiagnosisVersionById(id);
  }

  @Post('diagnosis-versions')
  @Permissions(CATALOG_CREATE)
  async createDiagnosisVersion(@Body() data: any) {
    return this.catalogService.createDiagnosisVersion(data);
  }

  @Put('diagnosis-versions/:id')
  @Permissions(CATALOG_UPDATE)
  async updateDiagnosisVersion(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateDiagnosisVersion(id, data);
  }

  @Delete('diagnosis-versions/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateDiagnosisVersion(@Param('id') id: string) {
    return this.catalogService.deactivateDiagnosisVersion(id);
  }

  @Post('diagnosis-versions/:id/import')
  @Permissions(CATALOG_CREATE)
  async importDiagnosisCodes(@Param('id') id: string, @Body('records') records: any[]) {
    return this.catalogService.importDiagnosisCodes(id, records);
  }

  // ========================================
  // DIAGNOSIS ENDPOINTS
  // ========================================

  @Get('diagnoses')
  @Permissions(CATALOG_READ)
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
  @Permissions(CATALOG_READ)
  async getDiagnosis(@Param('id') id: string) {
    return this.catalogService.getDiagnosisById(id);
  }

  @Post('diagnoses')
  @Permissions(CATALOG_CREATE)
  async createDiagnosis(@Body() data: any) {
    return this.catalogService.createDiagnosis(data);
  }

  @Put('diagnoses/:id')
  @Permissions(CATALOG_UPDATE)
  async updateDiagnosis(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateDiagnosis(id, data);
  }

  @Delete('diagnoses/:id')
  @Permissions(CATALOG_DELETE)
  async deactivateDiagnosis(@Param('id') id: string) {
    return this.catalogService.deactivateDiagnosis(id);
  }
}
