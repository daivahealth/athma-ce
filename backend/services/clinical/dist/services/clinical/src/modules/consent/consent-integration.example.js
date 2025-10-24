"use strict";
/**
 * Consent Integration Examples
 *
 * Shows how to integrate consent checks into existing workflows
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
exports.GDPRService = exports.ConsentExpiryJobService = exports.MarketingService = exports.ConsentGuard = exports.PatientDataChangeService = exports.SurgeryService = exports.ResearchService = exports.InsuranceService = exports.NotificationService = exports.PatientRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const consent_service_1 = require("./consent.service");
const shared_types_1 = require("@zeal/shared-types");
const database_clinical_1 = require("@zeal/database-clinical");
// ============================================================================
// EXAMPLE 1: Patient Registration with Consents
// ============================================================================
let PatientRegistrationService = class PatientRegistrationService {
    prisma;
    consentService;
    constructor(prisma, consentService) {
        this.prisma = prisma;
        this.consentService = consentService;
    }
    async registerPatientWithConsents(patientData, consents, context) {
        // 1. Create patient
        const patient = await this.prisma.patient.create({
            data: patientData,
        });
        // 2. Create required consents
        for (const consentDto of consents) {
            await this.consentService.createConsent({
                patientId: patient.id,
                consentType: consentDto.consentType,
                purpose: `Patient registration - ${consentDto.consentType}`,
                captureMethod: shared_types_1.CaptureMethod.DIGITAL_SIGNATURE,
                ...(consentDto.signatureUrl && { signatureUrl: consentDto.signatureUrl }),
                ...(consentDto.documentUrl && { documentUrl: consentDto.documentUrl }),
            }, context);
        }
        // 3. Validate all required consents are present
        const validation = await this.consentService.validateRequiredConsents(context.tenantId, patient.id);
        if (!validation.isValid) {
            throw new Error(`Missing required consents: ${validation.missing.join(', ')}`);
        }
        return patient;
    }
};
exports.PatientRegistrationService = PatientRegistrationService;
exports.PatientRegistrationService = PatientRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        consent_service_1.ConsentService])
], PatientRegistrationService);
// ============================================================================
// EXAMPLE 2: Send SMS with Consent Check
// ============================================================================
let NotificationService = class NotificationService {
    consentService;
    constructor(consentService) {
        this.consentService = consentService;
    }
    async sendSMS(patientId, tenantId, message) {
        // Check if patient has consented to SMS notifications
        const hasConsent = await this.consentService.hasActiveConsent(tenantId, patientId, shared_types_1.ConsentType.SMS_NOTIFICATIONS);
        if (!hasConsent) {
            throw new common_1.ForbiddenException('Patient has not consented to SMS notifications');
        }
        // Proceed with sending SMS
        await this.sendSMSInternal(patientId, message);
        return { sent: true, message: 'SMS sent successfully' };
    }
    async sendEmail(patientId, tenantId, subject, body) {
        // Check email consent
        const hasConsent = await this.consentService.hasActiveConsent(tenantId, patientId, shared_types_1.ConsentType.EMAIL_COMMUNICATIONS);
        if (!hasConsent) {
            throw new common_1.ForbiddenException('Patient has not consented to email communications');
        }
        // Proceed with sending email
        await this.sendEmailInternal(patientId, subject, body);
        return { sent: true, message: 'Email sent successfully' };
    }
    async sendSMSInternal(patientId, message) {
        // Actual SMS sending logic
        console.log(`Sending SMS to patient ${patientId}: ${message}`);
    }
    async sendEmailInternal(patientId, subject, body) {
        // Actual email sending logic
        console.log(`Sending email to patient ${patientId}: ${subject}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], NotificationService);
// ============================================================================
// EXAMPLE 3: Data Sharing with Insurance
// ============================================================================
let InsuranceService = class InsuranceService {
    consentService;
    constructor(consentService) {
        this.consentService = consentService;
    }
    async shareDataWithInsurance(patientId, tenantId, claimData) {
        // Check consent for insurance data sharing
        const hasConsent = await this.consentService.hasActiveConsent(tenantId, patientId, shared_types_1.ConsentType.SHARE_WITH_INSURANCE);
        if (!hasConsent) {
            throw new common_1.ForbiddenException('Patient has not consented to share data with insurance companies');
        }
        // Proceed with insurance claim submission
        await this.submitInsuranceClaim(claimData);
        return { submitted: true };
    }
    async submitInsuranceClaim(claimData) {
        // Insurance API integration
        console.log('Submitting insurance claim:', claimData);
    }
};
exports.InsuranceService = InsuranceService;
exports.InsuranceService = InsuranceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], InsuranceService);
// ============================================================================
// EXAMPLE 4: Research Data Usage
// ============================================================================
let ResearchService = class ResearchService {
    prisma;
    consentService;
    constructor(prisma, consentService) {
        this.prisma = prisma;
        this.consentService = consentService;
    }
    async getAnonymizedDataForResearch(tenantId) {
        // Get all patients who consented to research
        const consents = await this.prisma.patientConsent.findMany({
            where: {
                tenantId,
                consentType: shared_types_1.ConsentType.ANONYMIZED_RESEARCH,
                isActive: true,
                consentStatus: 'granted',
            },
            select: {
                patientId: true,
            },
        });
        const patientIds = consents.map((c) => c.patientId);
        // Fetch anonymized patient data
        const anonymizedData = await this.prisma.patient.findMany({
            where: {
                tenantId,
                id: { in: patientIds },
            },
            select: {
                // Only non-identifying fields
                gender: true,
                dateOfBirth: true,
                nationality: true,
                bloodGroup: true,
                // Exclude: name, nationalId, email, phone, address
            },
        });
        return anonymizedData;
    }
};
exports.ResearchService = ResearchService;
exports.ResearchService = ResearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        consent_service_1.ConsentService])
], ResearchService);
// ============================================================================
// EXAMPLE 5: Surgical Consent Workflow
// ============================================================================
let SurgeryService = class SurgeryService {
    prisma;
    consentService;
    constructor(prisma, consentService) {
        this.prisma = prisma;
        this.consentService = consentService;
    }
    async scheduleSurgery(patientId, surgeryDetails, signatureUrl, witnessedBy, witnessSignatureUrl, context) {
        // 1. Create surgical consent
        const consent = await this.consentService.createConsent({
            patientId,
            consentType: shared_types_1.ConsentType.SURGICAL_PROCEDURE,
            purpose: `Consent for surgical procedure: ${surgeryDetails.procedureName}`,
            description: `Patient consents to ${surgeryDetails.procedureName} on ${surgeryDetails.scheduledDate}`,
            captureMethod: shared_types_1.CaptureMethod.DIGITAL_SIGNATURE,
            signatureUrl,
            witnessedBy,
            witnessSignatureUrl,
            linkedEntityType: shared_types_1.LinkedEntityType.PROCEDURE,
            linkedEntityId: surgeryDetails.procedureId,
        }, context);
        // 2. Schedule surgery
        const surgery = await this.prisma.$queryRaw `
      -- Insert into surgeries table
      INSERT INTO surgeries (patient_id, procedure_name, scheduled_date, consent_id)
      VALUES (${patientId}, ${surgeryDetails.procedureName}, ${surgeryDetails.scheduledDate}, ${consent.id})
    `;
        return { surgery, consent };
    }
};
exports.SurgeryService = SurgeryService;
exports.SurgeryService = SurgeryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        consent_service_1.ConsentService])
], SurgeryService);
// ============================================================================
// EXAMPLE 6: Patient-Initiated Data Change with Consent
// ============================================================================
let PatientDataChangeService = class PatientDataChangeService {
    prisma;
    consentService;
    constructor(prisma, consentService) {
        this.prisma = prisma;
        this.consentService = consentService;
    }
    async patientRequestDataChange(patientId, tenantId, changes, consentDocUrl, context) {
        // 1. Create consent for data change
        const consent = await this.consentService.createConsent({
            patientId,
            consentType: shared_types_1.ConsentType.GENERAL_DATA_PROCESSING,
            purpose: 'Patient-initiated data change',
            description: `Patient requests to change: ${Object.keys(changes).join(', ')}`,
            captureMethod: shared_types_1.CaptureMethod.DIGITAL_SIGNATURE,
            documentUrl: consentDocUrl,
        }, context);
        // 2. Record change in patient_history with consent link
        await this.prisma.patientHistory.createMany({
            data: Object.entries(changes).map(([field, newValue]) => ({
                tenantId,
                patientId,
                fieldName: field,
                oldValue: null, // Will be filled by service
                newValue: String(newValue),
                changeType: 'patient_request',
                changeReason: 'Patient requested change',
                changedBy: context.userId,
                patientConsent: true,
                consentDocUrl: consent.documentUrl,
            })),
        });
        return { consent, message: 'Change request submitted' };
    }
};
exports.PatientDataChangeService = PatientDataChangeService;
exports.PatientDataChangeService = PatientDataChangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        consent_service_1.ConsentService])
], PatientDataChangeService);
class ConsentGuard {
    consentService;
    requiredConsentType;
    constructor(consentService, requiredConsentType) {
        this.consentService = consentService;
        this.requiredConsentType = requiredConsentType;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { patientId, tenantId } = request.params;
        const hasConsent = await this.consentService.hasActiveConsent(tenantId, patientId, this.requiredConsentType);
        if (!hasConsent) {
            throw new common_1.ForbiddenException(`Patient has not consented to: ${this.requiredConsentType}`);
        }
        return true;
    }
}
exports.ConsentGuard = ConsentGuard;
// Usage in controller:
// @UseGuards(new ConsentGuard(consentService, ConsentType.SMS_NOTIFICATIONS))
// @Post('/send-sms/:patientId')
// ============================================================================
// EXAMPLE 8: Batch Consent Check for Marketing
// ============================================================================
let MarketingService = class MarketingService {
    prisma;
    consentService;
    constructor(prisma, consentService) {
        this.prisma = prisma;
        this.consentService = consentService;
    }
    async sendMarketingCampaign(tenantId, campaignMessage) {
        // Get all patients who consented to marketing
        const marketingConsents = await this.prisma.patientConsent.findMany({
            where: {
                tenantId,
                consentType: shared_types_1.ConsentType.MARKETING_COMMUNICATIONS,
                isActive: true,
                consentStatus: 'granted',
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        email: true,
                        phoneNumber: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        // Send to eligible patients only
        const recipients = marketingConsents.map((c) => c.patient);
        console.log(`Sending marketing campaign to ${recipients.length} consented patients`);
        // Send campaign...
        return {
            totalRecipients: recipients.length,
            campaign: campaignMessage,
        };
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        consent_service_1.ConsentService])
], MarketingService);
// ============================================================================
// EXAMPLE 9: Consent Expiry Notification Job
// ============================================================================
let ConsentExpiryJobService = class ConsentExpiryJobService {
    consentService;
    constructor(consentService) {
        this.consentService = consentService;
    }
    async notifyExpiringConsents(tenantId) {
        // Get consents expiring in next 30 days
        const expiringConsents = await this.consentService.getExpiringConsents(tenantId, 30);
        for (const consent of expiringConsents) {
            // Send notification to patient
            if (consent.patient.email && consent.effectiveUntil) {
                await this.sendConsentRenewalNotification(consent.patient.email, consent.consentType, consent.effectiveUntil);
            }
        }
        return {
            notified: expiringConsents.length,
            consents: expiringConsents,
        };
    }
    async sendConsentRenewalNotification(email, consentType, expiryDate) {
        console.log(`Notifying ${email}: Your ${consentType} consent expires on ${expiryDate}`);
        // Email sending logic
    }
};
exports.ConsentExpiryJobService = ConsentExpiryJobService;
exports.ConsentExpiryJobService = ConsentExpiryJobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], ConsentExpiryJobService);
// ============================================================================
// EXAMPLE 10: GDPR Data Portability - Export Consent History
// ============================================================================
let GDPRService = class GDPRService {
    consentService;
    prisma;
    constructor(consentService, prisma) {
        this.consentService = consentService;
        this.prisma = prisma;
    }
    async exportPatientData(patientId, tenantId) {
        // Get patient data
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        // Get consent history
        const consents = await this.consentService.exportPatientConsents(tenantId, patientId);
        // Compile complete data export
        return {
            patient,
            consents,
            exportDate: new Date().toISOString(),
            exportReason: 'GDPR Data Portability Request',
        };
    }
    async deletePatientData(patientId, tenantId, context) {
        // GDPR Right to Erasure ("Right to be Forgotten")
        // 1. Revoke all active consents
        const activeConsents = await this.prisma.patientConsent.findMany({
            where: {
                tenantId,
                patientId,
                isActive: true,
            },
        });
        for (const consent of activeConsents) {
            await this.consentService.revokeConsent(consent.id, {
                reason: 'Patient requested data deletion (GDPR)',
                revocationMethod: shared_types_1.RevocationMethod.WRITTEN_REQUEST,
            }, context);
        }
        // 2. Soft delete patient (keep for legal compliance period)
        await this.prisma.patient.update({
            where: { id: patientId },
            data: {
                status: 'deleted',
                // Anonymize PII
                firstName: 'DELETED',
                lastName: 'DELETED',
                email: null,
                phoneNumber: null,
                addressLine1: null,
                nationalId: null,
            },
        });
        return { message: 'Patient data deleted/anonymized successfully' };
    }
};
exports.GDPRService = GDPRService;
exports.GDPRService = GDPRService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consent_service_1.ConsentService,
        database_clinical_1.PrismaClient])
], GDPRService);
//# sourceMappingURL=consent-integration.example.js.map