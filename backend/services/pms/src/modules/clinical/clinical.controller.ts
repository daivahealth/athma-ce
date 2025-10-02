import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ClinicalService } from './clinical.service';

@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Get('templates')
  async getTemplates(@Query() query: any) {
    return this.clinicalService.getTemplates(query);
  }

  @Post('templates')
  async createTemplate(@Body() templateDto: any) {
    return this.clinicalService.createTemplate(templateDto);
  }

  @Get('medications')
  async getMedications(@Query() query: any) {
    return this.clinicalService.getMedications(query);
  }

  @Get('medications/search')
  async searchMedications(@Query() query: any) {
    return this.clinicalService.searchMedications(query);
  }

  @Get('diagnoses')
  async getDiagnoses(@Query() query: any) {
    return this.clinicalService.getDiagnoses(query);
  }

  @Get('diagnoses/search')
  async searchDiagnoses(@Query() query: any) {
    return this.clinicalService.searchDiagnoses(query);
  }
}
