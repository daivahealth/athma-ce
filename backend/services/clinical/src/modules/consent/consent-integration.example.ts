/**
 * Consent Integration Examples
 *
 * Shows how to integrate consent checks into existing workflows
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { ConsentType, CaptureMethod, LinkedEntityType, RevocationMethod } from '@zeal/shared-types';
import { PrismaClient } from '@zeal/database-clinical';

// ============================================================================
// EXAMPLE 1: Patient Registration with Consents
// ============================================================================

@Injectable()
export class PatientRegistrationService {
  constructor(
    private prisma: PrismaClient,
    private consentService: ConsentService
  ) {}

  async registerPatientWithConsents(
    patientData: any,
    consents: Array<{
      consentType: ConsentType;
      signatureUrl?: string;
      documentUrl?: string;
    }>,
    context: any
  ) {
    // 1. Create patient
    const patient = await this.prisma.patient.create({
      data: patientData,
    });

    // 2. Create required consents
    for (const consentDto of consents) {
      await this.consentService.createConsent(
        {
          patientId: patient.id,
          consentType: consentDto.consentType,
          purpose: `Patient registration - ${consentDto.consentType}`,
          captureMethod: CaptureMethod.DIGITAL_SIGNATURE,
          ...(consentDto.signatureUrl && { signatureUrl: consentDto.signatureUrl }),
          ...(consentDto.documentUrl && { documentUrl: consentDto.documentUrl }),
        },
        context
      );
    }

    // 3. Validate all required consents are present
    const validation = await this.consentService.validateRequiredConsents(
      context.tenantId,
      patient.id
    );

    if (!validation.isValid) {
      throw new Error(
        `Missing required consents: ${validation.missing.join(', ')}`
      );
    }

    return patient;
  }
}

// ============================================================================
// EXAMPLE 2: Send SMS with Consent Check
// ============================================================================

@Injectable()
export class NotificationService {
  constructor(private consentService: ConsentService) {}

  async sendSMS(patientId: string, tenantId: string, message: string) {
    // Check if patient has consented to SMS notifications
    const hasConsent = await this.consentService.hasActiveConsent(
      tenantId,
      patientId,
      ConsentType.SMS_NOTIFICATIONS
    );

    if (!hasConsent) {
      throw new ForbiddenException(
        'Patient has not consented to SMS notifications'
      );
    }

    // Proceed with sending SMS
    await this.sendSMSInternal(patientId, message);

    return { sent: true, message: 'SMS sent successfully' };
  }

  async sendEmail(patientId: string, tenantId: string, subject: string, body: string) {
    // Check email consent
    const hasConsent = await this.consentService.hasActiveConsent(
      tenantId,
      patientId,
      ConsentType.EMAIL_COMMUNICATIONS
    );

    if (!hasConsent) {
      throw new ForbiddenException(
        'Patient has not consented to email communications'
      );
    }

    // Proceed with sending email
    await this.sendEmailInternal(patientId, subject, body);

    return { sent: true, message: 'Email sent successfully' };
  }

  private async sendSMSInternal(patientId: string, message: string) {
    // Actual SMS sending logic
    console.log(`Sending SMS to patient ${patientId}: ${message}`);
  }

  private async sendEmailInternal(patientId: string, subject: string, body: string) {
    // Actual email sending logic
    console.log(`Sending email to patient ${patientId}: ${subject}`);
  }
}

// ============================================================================
// EXAMPLE 3: Data Sharing with Insurance
// ============================================================================

@Injectable()
export class InsuranceService {
  constructor(private consentService: ConsentService) {}

  async shareDataWithInsurance(
    patientId: string,
    tenantId: string,
    claimData: any
  ) {
    // Check consent for insurance data sharing
    const hasConsent = await this.consentService.hasActiveConsent(
      tenantId,
      patientId,
      ConsentType.SHARE_WITH_INSURANCE
    );

    if (!hasConsent) {
      throw new ForbiddenException(
        'Patient has not consented to share data with insurance companies'
      );
    }

    // Proceed with insurance claim submission
    await this.submitInsuranceClaim(claimData);

    return { submitted: true };
  }

  private async submitInsuranceClaim(claimData: any) {
    // Insurance API integration
    console.log('Submitting insurance claim:', claimData);
  }
}

// ============================================================================
// EXAMPLE 4: Research Data Usage
// ============================================================================

@Injectable()
export class ResearchService {
  constructor(
    private prisma: PrismaClient,
    private consentService: ConsentService
  ) {}

  async getAnonymizedDataForResearch(tenantId: string) {
    // Get all patients who consented to research
    const consents = await this.prisma.patientConsent.findMany({
      where: {
        tenantId,
        consentType: ConsentType.ANONYMIZED_RESEARCH,
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
}

// ============================================================================
// EXAMPLE 5: Surgical Consent Workflow
// ============================================================================

@Injectable()
export class SurgeryService {
  constructor(
    private prisma: PrismaClient,
    private consentService: ConsentService
  ) {}

  async scheduleSurgery(
    patientId: string,
    surgeryDetails: any,
    signatureUrl: string,
    witnessedBy: string,
    witnessSignatureUrl: string,
    context: any
  ) {
    // 1. Create surgical consent
    const consent = await this.consentService.createConsent(
      {
        patientId,
        consentType: ConsentType.SURGICAL_PROCEDURE,
        purpose: `Consent for surgical procedure: ${surgeryDetails.procedureName}`,
        description: `Patient consents to ${surgeryDetails.procedureName} on ${surgeryDetails.scheduledDate}`,
        captureMethod: CaptureMethod.DIGITAL_SIGNATURE,
        signatureUrl,
        witnessedBy,
        witnessSignatureUrl,
        linkedEntityType: LinkedEntityType.PROCEDURE,
        linkedEntityId: surgeryDetails.procedureId,
      },
      context
    );

    // 2. Schedule surgery
    const surgery = await this.prisma.$queryRaw`
      -- Insert into surgeries table
      INSERT INTO surgeries (patient_id, procedure_name, scheduled_date, consent_id)
      VALUES (${patientId}, ${surgeryDetails.procedureName}, ${surgeryDetails.scheduledDate}, ${consent.id})
    `;

    return { surgery, consent };
  }
}

// ============================================================================
// EXAMPLE 6: Patient-Initiated Data Change with Consent
// ============================================================================

@Injectable()
export class PatientDataChangeService {
  constructor(
    private prisma: PrismaClient,
    private consentService: ConsentService
  ) {}

  async patientRequestDataChange(
    patientId: string,
    tenantId: string,
    changes: any,
    consentDocUrl: string,
    context: any
  ) {
    // 1. Create consent for data change
    const consent = await this.consentService.createConsent(
      {
        patientId,
        consentType: ConsentType.GENERAL_DATA_PROCESSING,
        purpose: 'Patient-initiated data change',
        description: `Patient requests to change: ${Object.keys(changes).join(', ')}`,
        captureMethod: CaptureMethod.DIGITAL_SIGNATURE,
        documentUrl: consentDocUrl,
      },
      context
    );

    // 2. Record change in patient_history with consent link
    await this.prisma.patientHistory.createMany({
      data: Object.entries(changes).map(([field, newValue]: any) => ({
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
}

// ============================================================================
// EXAMPLE 7: Consent Check Middleware/Guard
// ============================================================================

import { CanActivate, ExecutionContext } from '@nestjs/common';

export class ConsentGuard implements CanActivate {
  constructor(
    private consentService: ConsentService,
    private requiredConsentType: ConsentType
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { patientId, tenantId } = request.params;

    const hasConsent = await this.consentService.hasActiveConsent(
      tenantId,
      patientId,
      this.requiredConsentType
    );

    if (!hasConsent) {
      throw new ForbiddenException(
        `Patient has not consented to: ${this.requiredConsentType}`
      );
    }

    return true;
  }
}

// Usage in controller:
// @UseGuards(new ConsentGuard(consentService, ConsentType.SMS_NOTIFICATIONS))
// @Post('/send-sms/:patientId')

// ============================================================================
// EXAMPLE 8: Batch Consent Check for Marketing
// ============================================================================

@Injectable()
export class MarketingService {
  constructor(
    private prisma: PrismaClient,
    private consentService: ConsentService
  ) {}

  async sendMarketingCampaign(tenantId: string, campaignMessage: string) {
    // Get all patients who consented to marketing
    const marketingConsents = await this.prisma.patientConsent.findMany({
      where: {
        tenantId,
        consentType: ConsentType.MARKETING_COMMUNICATIONS,
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

    console.log(
      `Sending marketing campaign to ${recipients.length} consented patients`
    );

    // Send campaign...

    return {
      totalRecipients: recipients.length,
      campaign: campaignMessage,
    };
  }
}

// ============================================================================
// EXAMPLE 9: Consent Expiry Notification Job
// ============================================================================

@Injectable()
export class ConsentExpiryJobService {
  constructor(private consentService: ConsentService) {}

  async notifyExpiringConsents(tenantId: string) {
    // Get consents expiring in next 30 days
    const expiringConsents = await this.consentService.getExpiringConsents(
      tenantId,
      30
    );

    for (const consent of expiringConsents) {
      // Send notification to patient
      if (consent.patient.email && consent.effectiveUntil) {
        await this.sendConsentRenewalNotification(
          consent.patient.email,
          consent.consentType,
          consent.effectiveUntil
        );
      }
    }

    return {
      notified: expiringConsents.length,
      consents: expiringConsents,
    };
  }

  private async sendConsentRenewalNotification(
    email: string,
    consentType: string,
    expiryDate: Date
  ) {
    console.log(
      `Notifying ${email}: Your ${consentType} consent expires on ${expiryDate}`
    );
    // Email sending logic
  }
}

// ============================================================================
// EXAMPLE 10: GDPR Data Portability - Export Consent History
// ============================================================================

@Injectable()
export class GDPRService {
  constructor(
    private consentService: ConsentService,
    private prisma: PrismaClient
  ) {}

  async exportPatientData(patientId: string, tenantId: string) {
    // Get patient data
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    // Get consent history
    const consents = await this.consentService.exportPatientConsents(
      tenantId,
      patientId
    );

    // Compile complete data export
    return {
      patient,
      consents,
      exportDate: new Date().toISOString(),
      exportReason: 'GDPR Data Portability Request',
    };
  }

  async deletePatientData(patientId: string, tenantId: string, context: any) {
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
      await this.consentService.revokeConsent(
        consent.id,
        {
          reason: 'Patient requested data deletion (GDPR)',
          revocationMethod: RevocationMethod.WRITTEN_REQUEST,
        },
        context
      );
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
}
