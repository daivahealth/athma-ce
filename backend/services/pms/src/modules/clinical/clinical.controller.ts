import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ClinicalService } from './clinical.service';

@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Get('templates')
  async getTemplates(@Query() query: Record<string, string>) {
    return this.clinicalService.getTemplates(query);
  }

  @Post('templates')
  async createTemplate(@Body() templateDto: Record<string, unknown>) {
    return this.clinicalService.createTemplate(templateDto);
  }

  @Get('medications')
  async getMedications(@Query() query: Record<string, string>) {
    return this.clinicalService.getMedications(query);
  }

  @Get('medications/search')
  async searchMedications(@Query() query: Record<string, string>) {
    return this.clinicalService.searchMedications(query);
  }

  @Get('diagnoses')
  async getDiagnoses(@Query() query: Record<string, string>) {
    return this.clinicalService.getDiagnoses(query);
  }

  @Get('diagnoses/search')
  async searchDiagnoses(@Query() query: Record<string, string>) {
    return this.clinicalService.searchDiagnoses(query);
  }
}

