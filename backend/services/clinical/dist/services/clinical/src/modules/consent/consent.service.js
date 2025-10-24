"use strict";
/**
 * Patient Consent Service
 *
 * GDPR-compliant consent management
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const shared_types_1 = require("@zeal/shared-types");
let ConsentService = class ConsentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new patient consent
     */
    async createConsent(dto, context) {
        const requirement = shared_types_1.CONSENT_REQUIREMENTS[dto.consentType];
        if (!requirement) {
            throw new common_1.BadRequestException(`Invalid consent type: ${dto.consentType}`);
        }
        // Validate witness requirement
        if (requirement.requiresWitness && !dto.witnessedBy) {
            throw new common_1.BadRequestException(`Consent type ${dto.consentType} requires a witness`);
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
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
            },
        });
        if (existingConsent) {
            // Supersede existing consent
            await this.prisma.patientConsent.update({
                where: { id: existingConsent.id },
                data: {
                    consentStatus: shared_types_1.ConsentStatus.SUPERSEDED,
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
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
                consentScope: dto.description ?? null,
                purpose: dto.purpose,
                description: dto.description ?? null,
                legalBasis: requirement.legalBasis,
                effectiveFrom,
                effectiveUntil: effectiveUntil ?? null,
                isActive: true,
                captureMethod: dto.captureMethod,
                capturedBy: context.userId,
                capturedAtFacility: context.facilityId,
                signatureUrl: dto.signatureUrl ?? null,
                documentUrl: dto.documentUrl ?? null,
                witnessedBy: dto.witnessedBy ?? null,
                witnessSignatureUrl: dto.witnessSignatureUrl ?? null,
                linkedEntityType: dto.linkedEntityType ?? null,
                linkedEntityId: dto.linkedEntityId ?? null,
                metadata: dto.metadata || {},
                parentConsentId: existingConsent?.id ?? null,
            },
        });
        return consent;
    }
    /**
     * Revoke a patient consent
     */
    async revokeConsent(consentId, dto, context) {
        const consent = await this.prisma.patientConsent.findUnique({
            where: { id: consentId },
        });
        if (!consent) {
            throw new common_1.BadRequestException('Consent not found');
        }
        if (consent.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (consent.consentStatus === shared_types_1.ConsentStatus.REVOKED) {
            throw new common_1.BadRequestException('Consent already revoked');
        }
        // Update consent
        const revokedConsent = await this.prisma.patientConsent.update({
            where: { id: consentId },
            data: {
                consentStatus: shared_types_1.ConsentStatus.REVOKED,
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
    async hasActiveConsent(tenantId, patientId, consentType) {
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                tenantId,
                patientId,
                consentType,
                isActive: true,
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
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
    async getPatientConsents(tenantId, patientId, options) {
        const where = {
            tenantId,
            patientId,
        };
        if (!options?.includeRevoked) {
            where.consentStatus = { not: shared_types_1.ConsentStatus.REVOKED };
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
    async getConsentHistory(tenantId, patientId, consentType) {
        const where = {
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
    getRequiredConsents() {
        return Object.entries(shared_types_1.CONSENT_REQUIREMENTS)
            .filter(([, req]) => req.required)
            .map(([type]) => type);
    }
    /**
     * Check if all required consents are granted
     */
    async validateRequiredConsents(tenantId, patientId) {
        const required = this.getRequiredConsents();
        const missing = [];
        for (const consentType of required) {
            const hasConsent = await this.hasActiveConsent(tenantId, patientId, consentType);
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
    async expireOutdatedConsents(tenantId) {
        const now = new Date();
        const expiredConsents = await this.prisma.patientConsent.updateMany({
            where: {
                tenantId,
                isActive: true,
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
                effectiveUntil: {
                    lt: now,
                },
            },
            data: {
                consentStatus: shared_types_1.ConsentStatus.EXPIRED,
                isActive: false,
            },
        });
        return expiredConsents;
    }
    /**
     * Get consents expiring soon (for notifications)
     */
    async getExpiringConsents(tenantId, daysUntilExpiry = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysUntilExpiry);
        return this.prisma.patientConsent.findMany({
            where: {
                tenantId,
                isActive: true,
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
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
    async createBulkConsents(patientId, consents, context) {
        const createdConsents = [];
        for (const consentDto of consents) {
            const consent = await this.createConsent({ ...consentDto, patientId }, context);
            createdConsents.push(consent);
        }
        return createdConsents;
    }
    /**
     * Get consent audit trail
     */
    async getConsentAuditTrail(tenantId, patientId) {
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
    async checkConsentForAction(tenantId, patientId, action) {
        // Map actions to consent types
        const actionConsentMap = {
            send_sms: shared_types_1.ConsentType.SMS_NOTIFICATIONS,
            send_email: shared_types_1.ConsentType.EMAIL_COMMUNICATIONS,
            share_with_insurance: shared_types_1.ConsentType.SHARE_WITH_INSURANCE,
            share_with_facility: shared_types_1.ConsentType.SHARE_WITH_FACILITIES,
            use_for_research: shared_types_1.ConsentType.ANONYMIZED_RESEARCH,
            send_marketing: shared_types_1.ConsentType.MARKETING_COMMUNICATIONS,
        };
        const consentType = actionConsentMap[action];
        if (!consentType) {
            return {
                allowed: true,
                reason: 'No consent required for this action',
            };
        }
        const hasConsent = await this.hasActiveConsent(tenantId, patientId, consentType);
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
    async getConsentStatistics(tenantId) {
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
    async renewConsent(consentId, context) {
        const oldConsent = await this.prisma.patientConsent.findUnique({
            where: { id: consentId },
        });
        if (!oldConsent) {
            throw new common_1.BadRequestException('Consent not found');
        }
        if (oldConsent.tenantId !== context.tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const requirement = shared_types_1.CONSENT_REQUIREMENTS[oldConsent.consentType];
        if (!requirement.validityDays) {
            throw new common_1.BadRequestException('This consent type does not expire');
        }
        // Mark old consent as superseded
        await this.prisma.patientConsent.update({
            where: { id: consentId },
            data: {
                consentStatus: shared_types_1.ConsentStatus.SUPERSEDED,
                isActive: false,
            },
        });
        // Create renewed consent
        const effectiveFrom = new Date();
        const effectiveUntil = new Date(effectiveFrom);
        effectiveUntil.setDate(effectiveUntil.getDate() + requirement.validityDays);
        const renewedConsent = await this.prisma.patientConsent.create({
            data: {
                tenantId: oldConsent.tenantId,
                patientId: oldConsent.patientId,
                consentType: oldConsent.consentType,
                consentCategory: oldConsent.consentCategory,
                consentStatus: shared_types_1.ConsentStatus.GRANTED,
                consentScope: oldConsent.consentScope,
                purpose: oldConsent.purpose,
                description: oldConsent.description,
                legalBasis: oldConsent.legalBasis,
                effectiveFrom,
                effectiveUntil,
                isActive: true,
                captureMethod: oldConsent.captureMethod,
                capturedAt: new Date(),
                capturedBy: context.userId,
                capturedAtFacility: context.facilityId,
                signatureUrl: oldConsent.signatureUrl,
                documentUrl: oldConsent.documentUrl,
                witnessedBy: oldConsent.witnessedBy,
                witnessSignatureUrl: oldConsent.witnessSignatureUrl,
                linkedEntityType: oldConsent.linkedEntityType,
                linkedEntityId: oldConsent.linkedEntityId,
                metadata: oldConsent.metadata,
                parentConsentId: consentId,
                version: oldConsent.version + 1,
            },
        });
        return renewedConsent;
    }
    /**
     * Export consent data for patient (GDPR data portability)
     */
    async exportPatientConsents(tenantId, patientId) {
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
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map