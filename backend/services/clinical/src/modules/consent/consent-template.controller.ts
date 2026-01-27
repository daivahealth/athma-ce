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
  UseGuards,
} from '@nestjs/common';
import { ConsentTemplateService } from './consent-template.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CONSENT_TEMPLATE_READ,
  CONSENT_TEMPLATE_CREATE,
  CONSENT_TEMPLATE_UPDATE,
} from '@zeal/contracts';

@Controller('consent-templates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConsentTemplateController {
  constructor(
    private readonly templateService: ConsentTemplateService
  ) {}

  /**
   * POST /consent-templates - Create template
   */
  @Post()
  @Permissions(CONSENT_TEMPLATE_CREATE)
  async createTemplate(@Body() dto: any, @Req() req: any) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.templateService.createTemplate(tenantId, dto);
  }

  /**
   * GET /consent-templates - Get all templates
   */
  @Get()
  @Permissions(CONSENT_TEMPLATE_READ)
  async getTemplates(
    @Query('category') category: string,
    @Query('consentType') consentType: string,
    @Query('required') required: string,
    @Req() req: any
  ) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;

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
  @Permissions(CONSENT_TEMPLATE_READ)
  async getTemplate(
    @Param('templateCode') templateCode: string,
    @Query('language') language: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    const lang = language || 'en';
    return this.templateService.getTemplate(tenantId, templateCode, lang);
  }

  /**
   * PUT /consent-templates/:templateCode - Update template
   */
  @Put(':templateCode')
  @Permissions(CONSENT_TEMPLATE_UPDATE)
  async updateTemplate(
    @Param('templateCode') templateCode: string,
    @Body() dto: any,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.templateService.updateTemplate(tenantId, templateCode, dto);
  }

  /**
   * GET /consent-templates/required/list - Get required templates
   */
  @Get('required/list')
  @Permissions(CONSENT_TEMPLATE_READ)
  async getRequiredTemplates(
    @Query('language') language: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    const lang = language || 'en';
    return this.templateService.getRequiredTemplates(tenantId, lang);
  }

  /**
   * POST /consent-templates/seed - Seed default templates
   */
  @Post('seed/defaults')
  @Permissions(CONSENT_TEMPLATE_CREATE)
  async seedTemplates(@Req() req: any) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.templateService.seedDefaultTemplates(tenantId);
  }
}
