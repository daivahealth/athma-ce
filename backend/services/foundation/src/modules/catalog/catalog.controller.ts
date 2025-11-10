/**
 * Catalog Controller
 *
 * REST API endpoints for managing master catalog data.
 * Routes: /catalogs/{medications|lab-tests|imaging-studies|procedures}
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
  async createLabTest(@Body() data: any) {
    return this.catalogService.createLabTest(data);
  }

  @Put('lab-tests/:id')
  async updateLabTest(@Param('id') id: string, @Body() data: any) {
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
  async createImagingStudy(@Body() data: any) {
    return this.catalogService.createImagingStudy(data);
  }

  @Put('imaging-studies/:id')
  async updateImagingStudy(@Param('id') id: string, @Body() data: any) {
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
  async createProcedure(@Body() data: any) {
    return this.catalogService.createProcedure(data);
  }

  @Put('procedures/:id')
  async updateProcedure(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateProcedure(id, data);
  }

  @Delete('procedures/:id')
  async deactivateProcedure(@Param('id') id: string) {
    return this.catalogService.deactivateProcedure(id);
  }
}
