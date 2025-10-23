/**
 * Patient Consent Service
 *
 * GDPR-compliant consent management
 */

import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@zeal/database-clinical';
import {
  ConsentType,
  ConsentStatus,
  ConsentCategory,
  CaptureMethod,
  LegalBasis,
  RevocationMethod,
  LinkedEntityType,
  CONSENT_REQUIREMENTS,
  isConsentExpired,
} from '@zeal/shared-types';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateConsentDto {
  patientId: string;
  consentType: ConsentType;
  purpose: string;
  description?: string;
  captureMethod: CaptureMethod;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  signatureUrl?: string;
  documentUrl?: string;
  witnessedBy?: string;
  witnessSignatureUrl?: string;
  linkedEntityType?: LinkedEntityType;
  linkedEntityId?: string;
  metadata?: Record<string, any>;
}

export interface RevokeConsentDto {
  reason: string;
  revocationMethod: RevocationMethod;
}

@Injectable()
export class ConsentService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new patient consent
   */
  async createConsent(
    dto: CreateConsentDto,
    context: RequestContext
  ) {
    const requirement = CONSENT_REQUIREMENTS[dto.consentType];

    if (!requirement) {
      throw new BadRequestException(`Invalid consent type: ${dto.consentType}`);
    }

    // Validate witness requirement
    if (requirement.requiresWitness && !dto.witnessedBy) {
      throw new BadRequestException(
        `Consent type ${dto.consentType} requires a witness`
      );
    }

    // Calculate effective dates
    const effectiveFrom = dto.effectiveFrom || new Date();
    let effectiveUntil = dto.effectiveUntil;

    if (!effectiveUntil && requirement.validityDays) {
      effectiveUntil = new Date(effectiveFrom);
      effectiveUntil.setDate(effectiveUntil.getDate() + requirement.validityDays);
    }

    // Check for existing active consent of same type
    const existingConsent = await this.prisma.patientConsent.findFirst({
      where: {
        tenantId: context.tenantId,
        patientId: dto.patientId,
        consentType: dto.consentType,
        isActive: true,
        consentStatus: ConsentStatus.GRANTED,
      },
    });

    if (existingConsent) {
      // Supersede existing consent
      await this.prisma.patientConsent.update({
        where: { id: existingConsent.id },
        data: {
          consentStatus: ConsentStatus.SUPERSEDED,
          isActive: false,
        },
      });
    }

    // Create new consent
    const consent = await this.prisma.patientConsent.create({
      data: {
        tenantId: context.tenantId,
        patientId: dto.patientId,
        consentType: dto.consentType,
        consentCategory: requirement.category,
        consentStatus: ConsentStatus.GRANTED,
        consentScope: dto.description,
        purpose: dto.purpose,
        description: dto.description,
        legalBasis: requirement.legalBasis,
        effectiveFrom,
        effectiveUntil,
        isActive: true,
        captureMethod: dto.captureMethod,
        capturedBy: context.userId,
        capturedAtFacility: context.facilityId,
        signatureUrl: dto.signatureUrl,
        documentUrl: dto.documentUrl,
        witnessedBy: dto.witnessedBy,
        witnessSignatureUrl: dto.witnessSignatureUrl,
        linkedEntityType: dto.linkedEntityType,
        linkedEntityId: dto.linkedEntityId,
        metadata: dto.metadata || {},
        parentConsentId: existingConsent?.id,
      },
    });

    return consent;
  }

  /**
   * Revoke a patient consent
   */
  async revokeConsent(
    consentId: string,
    dto: RevokeConsentDto,
    context: RequestContext
  ) {
    const consent = await this.prisma.patientConsent.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      throw new BadRequestException('Consent not found');
    }

    if (consent.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    if (consent.consentStatus === ConsentStatus.REVOKED) {
      throw new BadRequestException('Consent already revoked');
    }

    // Update consent
    const revokedConsent = await this.prisma.patientConsent.update({
      where: { id: consentId },
      data: {
        consentStatus: ConsentStatus.REVOKED,
        isActive: false,
        revokedAt: new Date(),
        revokedBy: context.userId,
        revocationReason: dto.reason,
        revocationMethod: dto.revocationMethod,
      },
    });

    return revokedConsent;
  }

  /**
   * Check if patient has active consent for a specific type
   */
  async hasActiveConsent(
    tenantId: string,
    patientId: string,
    consentType: ConsentType
  ): Promise<boolean> {
    const consent = await this.prisma.patientConsent.findFirst({
      where: {
        tenantId,
        patientId,
        consentType,
        isActive: true,
        consentStatus: ConsentStatus.GRANTED,
        effectiveFrom: { lte: new Date() },
        OR: [
          { effectiveUntil: null },
          { effectiveUntil: { gte: new Date() } },
        ],
      },
    });

    return !!consent;
  }

  /**
   * Get all active consents for a patient
   */
  async getPatientConsents(
    tenantId: string,
    patientId: string,
    options?: {
      includeRevoked?: boolean;
      category?: ConsentCategory;
      consentType?: ConsentType;
    }
  ) {
    const where: any = {
      tenantId,
      patientId,
    };

    if (!options?.includeRevoked) {
      where.consentStatus = { not: ConsentStatus.REVOKED };
      where.isActive = true;
    }

    if (options?.category) {
      where.consentCategory = options.category;
    }

    if (options?.consentType) {
      where.consentType = options.consentType;
    }

    return this.prisma.patientConsent.findMany({
      where,
      orderBy: { capturedAt: 'desc' },
    });
  }

  /**
   * Get consent history for a patient
   */
  async getConsentHistory(
    tenantId: string,
    patientId: string,
    consentType?: ConsentType
  ) {
    const where: any = {
      tenantId,
      patientId,
    };

    if (consentType) {
      where.consentType = consentType;
    }

    return this.prisma.patientConsent.findMany({
      where,
      orderBy: { capturedAt: 'desc' },
    });
  }

  /**
   * Get required consents for patient registration
   */
  getRequiredConsents(): ConsentType[] {
    return Object.entries(CONSENT_REQUIREMENTS)
      .filter(([_, req]) => req.required)
      .map(([type, _]) => type as ConsentType);
  }

  /**
   * Check if all required consents are granted
   */
  async validateRequiredConsents(
    tenantId: string,
    patientId: string
  ): Promise<{
    isValid: boolean;
    missing: ConsentType[];
  }> {
    const required = this.getRequiredConsents();
    const missing: ConsentType[] = [];

    for (const consentType of required) {
      const hasConsent = await this.hasActiveConsent(
        tenantId,
        patientId,
        consentType
      );

      if (!hasConsent) {
        missing.push(consentType);
      }
    }

    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  /**
   * Expire outdated consents (run as scheduled job)
   */
  async expireOutdatedConsents(tenantId: string) {
    const now = new Date();

    const expiredConsents = await this.prisma.patientConsent.updateMany({
      where: {
        tenantId,
        isActive: true,
        consentStatus: ConsentStatus.GRANTED,
        effectiveUntil: {
          lt: now,
        },
      },
      data: {
        consentStatus: ConsentStatus.EXPIRED,
        isActive: false,
      },
    });

    return expiredConsents;
  }

  /**
   * Get consents expiring soon (for notifications)
   */
  async getExpiringConsents(
    tenantId: string,
    daysUntilExpiry: number = 30
  ) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysUntilExpiry);

    return this.prisma.patientConsent.findMany({
      where: {
        tenantId,
        isActive: true,
        consentStatus: ConsentStatus.GRANTED,
        effectiveUntil: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { effectiveUntil: 'asc' },
    });
  }

  /**
   * Bulk create consents (for patient registration)
   */
  async createBulkConsents(
    patientId: string,
    consents: CreateConsentDto[],
    context: RequestContext
  ) {
    const createdConsents = [];

    for (const consentDto of consents) {
      const consent = await this.createConsent(
        { ...consentDto, patientId },
        context
      );
      createdConsents.push(consent);
    }

    return createdConsents;
  }

  /**
   * Get consent audit trail
   */
  async getConsentAuditTrail(
    tenantId: string,
    patientId: string
  ) {
    const consents = await this.prisma.patientConsent.findMany({
      where: { tenantId, patientId },
      orderBy: { capturedAt: 'desc' },
    });

    return consents.map((consent) => ({
      id: consent.id,
      consentType: consent.consentType,
      consentStatus: consent.consentStatus,
      capturedAt: consent.capturedAt,
      capturedBy: consent.capturedBy,
      revokedAt: consent.revokedAt,
      revokedBy: consent.revokedBy,
      revocationReason: consent.revocationReason,
      effectiveFrom: consent.effectiveFrom,
      effectiveUntil: consent.effectiveUntil,
    }));
  }

  /**
   * Check consent for specific action
   */
  async checkConsentForAction(
    tenantId: string,
    patientId: string,
    action: string
  ): Promise<{
    allowed: boolean;
    consentType?: ConsentType;
    reason?: string;
  }> {
    // Map actions to consent types
    const actionConsentMap: Record<string, ConsentType> = {
      send_sms: ConsentType.SMS_NOTIFICATIONS,
      send_email: ConsentType.EMAIL_COMMUNICATIONS,
      share_with_insurance: ConsentType.SHARE_WITH_INSURANCE,
      share_with_facility: ConsentType.SHARE_WITH_FACILITIES,
      use_for_research: ConsentType.ANONYMIZED_RESEARCH,
      send_marketing: ConsentType.MARKETING_COMMUNICATIONS,
    };

    const consentType = actionConsentMap[action];

    if (!consentType) {
      return {
        allowed: true,
        reason: 'No consent required for this action',
      };
    }

    const hasConsent = await this.hasActiveConsent(
      tenantId,
      patientId,
      consentType
    );

    return {
      allowed: hasConsent,
      consentType,
      reason: hasConsent
        ? 'Patient has granted consent'
        : 'Patient has not granted consent',
    };
  }

  /**
   * Get consent statistics
   */
  async getConsentStatistics(tenantId: string) {
    const stats = await this.prisma.patientConsent.groupBy({
      by: ['consentType', 'consentStatus'],
      where: { tenantId },
      _count: { id: true },
    });

    const totalPatients = await this.prisma.patient.count({
      where: { tenantId },
    });

    return {
      totalPatients,
      consentStats: stats,
    };
  }

  /**
   * Renew consent (for auto-renewable consents)
   */
  async renewConsent(
    consentId: string,
    context: RequestContext
  ) {
    const oldConsent = await this.prisma.patientConsent.findUnique({
      where: { id: consentId },
    });

    if (!oldConsent) {
      throw new BadRequestException('Consent not found');
    }

    if (oldConsent.tenantId !== context.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    const requirement = CONSENT_REQUIREMENTS[oldConsent.consentType as ConsentType];

    if (!requirement.validityDays) {
      throw new BadRequestException('This consent type does not expire');
    }

    // Mark old consent as superseded
    await this.prisma.patientConsent.update({
      where: { id: consentId },
      data: {
        consentStatus: ConsentStatus.SUPERSEDED,
        isActive: false,
      },
    });

    // Create renewed consent
    const effectiveFrom = new Date();
    const effectiveUntil = new Date(effectiveFrom);
    effectiveUntil.setDate(effectiveUntil.getDate() + requirement.validityDays);

    const renewedConsent = await this.prisma.patientConsent.create({
      data: {
        ...oldConsent,
        id: undefined, // Generate new ID
        consentStatus: ConsentStatus.GRANTED,
        isActive: true,
        effectiveFrom,
        effectiveUntil,
        capturedAt: new Date(),
        capturedBy: context.userId,
        capturedAtFacility: context.facilityId,
        parentConsentId: consentId,
        version: oldConsent.version + 1,
      },
    });

    return renewedConsent;
  }

  /**
   * Export consent data for patient (GDPR data portability)
   */
  async exportPatientConsents(
    tenantId: string,
    patientId: string
  ) {
    const consents = await this.getConsentHistory(tenantId, patientId);

    return {
      patientId,
      exportDate: new Date().toISOString(),
      consents: consents.map((c) => ({
        consentType: c.consentType,
        consentStatus: c.consentStatus,
        purpose: c.purpose,
        effectiveFrom: c.effectiveFrom,
        effectiveUntil: c.effectiveUntil,
        capturedAt: c.capturedAt,
        revokedAt: c.revokedAt,
        revocationReason: c.revocationReason,
      })),
    };
  }
}
