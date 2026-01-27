/**
 * Consent Controller
 *
 * REST API endpoints for patient consent management
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
import { ConsentService } from './consent.service';
import { ConsentType } from '@zeal/shared-types';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CONSENT_READ,
  CONSENT_CREATE,
  CONSENT_UPDATE,
} from '@zeal/contracts';

@Controller('patients/:patientId/consents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  /**
   * POST /patients/:patientId/consents - Create consent
   */
  @Post()
  @Permissions(CONSENT_CREATE)
  async createConsent(
    @Param('patientId') patientId: string,
    @Body() dto: any,
    @Req() req: any
  ) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const context = {
      ...req.context,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const consentData: any = {
      patientId,
      consentType: dto.consentType,
      purpose: dto.purpose,
      description: dto.description,
      captureMethod: dto.captureMethod,
      signatureUrl: dto.signatureUrl,
      documentUrl: dto.documentUrl,
      witnessedBy: dto.witnessedBy,
      witnessSignatureUrl: dto.witnessSignatureUrl,
      linkedEntityType: dto.linkedEntityType,
      linkedEntityId: dto.linkedEntityId,
      metadata: dto.metadata,
    };

    if (dto.effectiveFrom) {
      consentData.effectiveFrom = new Date(dto.effectiveFrom);
    }

    if (dto.effectiveUntil) {
      consentData.effectiveUntil = new Date(dto.effectiveUntil);
    }

    return this.consentService.createConsent(consentData, context);
  }

  /**
   * GET /patients/:patientId/consents - Get patient consents
   */
  @Get()
  @Permissions(CONSENT_READ)
  async getConsents(
    @Param('patientId') patientId: string,
    @Query('includeRevoked') includeRevoked: string,
    @Query('category') category: string,
    @Query('consentType') consentType: ConsentType,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;

    return this.consentService.getPatientConsents(tenantId, patientId, {
      includeRevoked: includeRevoked === 'true',
      category: category as any,
      consentType: consentType,
    });
  }

  /**
   * GET /patients/:patientId/consents/:consentId - Get consent by ID
   */
  @Get(':consentId')
  @Permissions(CONSENT_READ)
  async getConsent(
    @Param('consentId') consentId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    // Simple implementation - fetch from database
    const consent = await this.consentService['prisma'].patientConsent.findUnique({
      where: { id: consentId },
    });

    if (!consent || consent.tenantId !== tenantId) {
      throw new Error('Consent not found');
    }

    return consent;
  }

  /**
   * POST /patients/:patientId/consents/:consentId/revoke - Revoke consent
   */
  @Post(':consentId/revoke')
  @Permissions(CONSENT_UPDATE)
  async revokeConsent(
    @Param('consentId') consentId: string,
    @Body() dto: { reason: string; revocationMethod: string },
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const context = {
      ...req.context,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    return this.consentService.revokeConsent(consentId, dto as any, context);
  }

  /**
   * POST /patients/:patientId/consents/:consentId/renew - Renew consent
   */
  @Post(':consentId/renew')
  @Permissions(CONSENT_UPDATE)
  async renewConsent(
    @Param('consentId') consentId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const context = {
      ...req.context,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    return this.consentService.renewConsent(consentId, context);
  }

  /**
   * GET /patients/:patientId/consents/history - Get consent history
   */
  @Get('history/all')
  @Permissions(CONSENT_READ)
  async getConsentHistory(
    @Param('patientId') patientId: string,
    @Query('consentType') consentType: ConsentType,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.consentService.getConsentHistory(tenantId, patientId, consentType);
  }

  /**
   * GET /patients/:patientId/consents/required - Get required consents
   */
  @Get('required/list')
  @Permissions(CONSENT_READ)
  async getRequiredConsents() {
    return {
      required: this.consentService.getRequiredConsents(),
    };
  }

  /**
   * GET /patients/:patientId/consents/validate - Validate required consents
   */
  @Get('validate/required')
  @Permissions(CONSENT_READ)
  async validateConsents(
    @Param('patientId') patientId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.consentService.validateRequiredConsents(tenantId, patientId);
  }

  /**
   * POST /patients/:patientId/consents/bulk - Bulk create consents
   */
  @Post('bulk/create')
  @Permissions(CONSENT_CREATE)
  async bulkCreateConsents(
    @Param('patientId') patientId: string,
    @Body() body: { consents: any[] },
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const context = {
      ...req.context,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    return this.consentService.createBulkConsents(patientId, body.consents, context);
  }

  /**
   * GET /patients/:patientId/consents/audit - Get consent audit trail
   */
  @Get('audit/trail')
  @Permissions(CONSENT_READ)
  async getAuditTrail(
    @Param('patientId') patientId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.consentService.getConsentAuditTrail(tenantId, patientId);
  }

  /**
   * POST /patients/:patientId/consents/check-action - Check consent for action
   */
  @Post('check/action')
  @Permissions(CONSENT_READ)
  async checkAction(
    @Param('patientId') patientId: string,
    @Body() body: { action: string },
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.consentService.checkConsentForAction(tenantId, patientId, body.action);
  }

  /**
   * GET /patients/:patientId/consents/export - Export consent data
   */
  @Get('export/data')
  @Permissions(CONSENT_READ)
  async exportConsents(
    @Param('patientId') patientId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.consentService.exportPatientConsents(tenantId, patientId);
  }

  /**
   * GET /patients/:patientId/consents/expiring - Get expiring consents
   */
  @Get('expiring/soon')
  @Permissions(CONSENT_READ)
  async getExpiringConsents(
    @Query('days') days: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    const daysUntilExpiry = days ? parseInt(days) : 30;
    return this.consentService.getExpiringConsents(tenantId, daysUntilExpiry);
  }
}
