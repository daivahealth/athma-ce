/**
 * Consent Template Controller
 *
 * REST API endpoints for consent template management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ConsentTemplateService } from './consent-template.service';

@Controller('consent-templates')
export class ConsentTemplateController {
  constructor(
    private readonly templateService: ConsentTemplateService
  ) {}

  /**
   * POST /consent-templates - Create template
   */
  @Post()
  async createTemplate(@Body() dto: any, @Req() req: any) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.templateService.createTemplate(tenantId, dto);
  }

  /**
   * GET /consent-templates - Get all templates
   */
  @Get()
  async getTemplates(
    @Query('category') category: string,
    @Query('consentType') consentType: string,
    @Query('required') required: string,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';

    const options: any = {
      category: category as any,
      consentType: consentType as any,
    };

    if (required === 'true') {
      options.required = true;
    } else if (required === 'false') {
      options.required = false;
    }

    return this.templateService.getTemplates(tenantId, options);
  }

  /**
   * GET /consent-templates/:templateCode - Get template by code
   */
  @Get(':templateCode')
  async getTemplate(
    @Param('templateCode') templateCode: string,
    @Query('language') language: string,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';
    const lang = language || 'en';
    return this.templateService.getTemplate(tenantId, templateCode, lang);
  }

  /**
   * PUT /consent-templates/:templateCode - Update template
   */
  @Put(':templateCode')
  async updateTemplate(
    @Param('templateCode') templateCode: string,
    @Body() dto: any,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.templateService.updateTemplate(tenantId, templateCode, dto);
  }

  /**
   * GET /consent-templates/required/list - Get required templates
   */
  @Get('required/list')
  async getRequiredTemplates(
    @Query('language') language: string,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';
    const lang = language || 'en';
    return this.templateService.getRequiredTemplates(tenantId, lang);
  }

  /**
   * POST /consent-templates/seed - Seed default templates
   */
  @Post('seed/defaults')
  async seedTemplates(@Req() req: any) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.templateService.seedDefaultTemplates(tenantId);
  }
}
