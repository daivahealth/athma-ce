# Patient Consent Management System

**Complete GDPR-Compliant Consent Management for Healthcare**

---

## Table of Contents

1. [Overview](#overview)
2. [GDPR Compliance](#gdpr-compliance)
3. [Consent Categories](#consent-categories)
4. [Database Schema](#database-schema)
5. [Consent Types](#consent-types)
6. [Legal Basis](#legal-basis)
7. [Implementation Guide](#implementation-guide)
8. [Workflows](#workflows)
9. [API Examples](#api-examples)
10. [Frontend Integration](#frontend-integration)
11. [Consent Lifecycle](#consent-lifecycle)
12. [Audit & Reporting](#audit--reporting)
13. [Best Practices](#best-practices)

---

## Overview

The Patient Consent Management System provides comprehensive, GDPR-compliant consent tracking for all patient interactions and data processing activities.

### Key Features

✅ **GDPR Compliant** - Full compliance with EU data protection regulations
✅ **Multi-Purpose** - Supports treatment, data sharing, communication, research, financial
✅ **Multi-Language** - Consent forms in English and Arabic (expandable)
✅ **Audit Trail** - Complete history of consent grants, revocations, and renewals
✅ **Expiry Management** - Automatic expiry and renewal workflows
✅ **Witness Support** - Electronic signatures with witness verification
✅ **Granular Control** - Patient can consent/revoke at any time
✅ **Template Management** - Reusable, versionable consent forms

---

## GDPR Compliance

### Article 6 - Lawfulness of Processing

| Legal Basis | Description | Example Use Case |
|-------------|-------------|------------------|
| **Consent** (Art. 6(1)(a)) | Patient gives clear consent | Marketing communications |
| **Contract** (Art. 6(1)(b)) | Necessary for contract performance | Payment processing |
| **Legal Obligation** (Art. 6(1)(c)) | Required by law | Government reporting |
| **Vital Interests** (Art. 6(1)(d)) | Protect life/health | Emergency treatment |
| **Public Interest** (Art. 6(1)(e)) | Public health tasks | Epidemiological studies |
| **Legitimate Interest** (Art. 6(1)(f)) | Legitimate business interest | Fraud prevention |

### Article 9 - Special Categories (Sensitive Data)

Health data requires **explicit consent** (Art. 9(2)(a)) or other specified conditions.

### GDPR Rights Supported

✅ **Right to Access** (Art. 15) - Export consent history
✅ **Right to Rectification** (Art. 16) - Update consent preferences
✅ **Right to Erasure** (Art. 17) - Delete/revoke all consents
✅ **Right to Data Portability** (Art. 20) - Export in machine-readable format
✅ **Right to Object** (Art. 21) - Revoke consent at any time
✅ **Right to Withdraw Consent** (Art. 7(3)) - Easy revocation

---

## Consent Categories

### 1. Data Processing
Consent to collect, store, and process personal health information.

**Examples:**
- General PHI storage
- Sensitive data processing (genetic, biometric)
- Data retention beyond legal minimum

### 2. Treatment
Consent for medical procedures and interventions.

**Examples:**
- General medical treatment
- Surgical procedures (requires witness)
- Anesthesia administration
- Blood transfusions
- Medication administration
- Diagnostic tests
- Imaging studies
- Immunizations

### 3. Communication
Consent to receive notifications and updates.

**Examples:**
- SMS notifications
- Email communications
- Phone calls
- WhatsApp messages
- Appointment reminders
- Test results notifications

### 4. Data Sharing
Consent to share data with third parties.

**Examples:**
- Share with insurance companies
- Share with other healthcare facilities
- Share with specialist physicians
- Share with government authorities (DHA/DOH)
- HIE (Health Information Exchange) participation
- International data transfer

### 5. Research
Consent to use data for research purposes.

**Examples:**
- Anonymized medical research
- Clinical trial participation (requires witness)
- AI/ML model training
- Academic research

### 6. Financial
Consent for financial operations.

**Examples:**
- Insurance claim processing
- Payment authorization
- Credit check
- Payment plan agreements

### 7. Marketing
Consent for marketing communications.

**Examples:**
- Marketing communications
- Health tips newsletter
- Promotional offers
- Third-party marketing

---

## Database Schema

### patient_consents Table

```prisma
model PatientConsent {
  id                  String    @id @default(uuid())
  tenantId            String
  patientId           String

  // Consent Details
  consentType         String    // 'sms_notifications', 'surgical_procedure', etc.
  consentCategory     String    // 'communication', 'treatment', etc.
  consentStatus       String    // 'pending', 'granted', 'denied', 'revoked', 'expired'
  consentScope        String?   // Additional scope details

  // Metadata
  purpose             String    // Why consent is needed
  description         String?   // Detailed description
  legalBasis          String?   // GDPR legal basis

  // Validity
  effectiveFrom       DateTime  // When consent starts
  effectiveUntil      DateTime? // When consent expires (null = permanent)
  isActive            Boolean   // Currently active?

  // Capture Method
  captureMethod       String    // 'digital_signature', 'paper_form', 'verbal', etc.
  capturedBy          String?   // User who captured consent
  capturedAt          DateTime  // When captured
  capturedAtFacility  String?   // Where captured

  // Evidence
  signatureUrl        String?   // Digital signature image
  documentUrl         String?   // Signed consent form PDF
  witnessedBy         String?   // Witness user ID
  witnessSignatureUrl String?   // Witness signature

  // Revocation
  revokedAt           DateTime? // When revoked
  revokedBy           String?   // Who revoked
  revocationReason    String?   // Why revoked
  revocationMethod    String?   // How revoked

  // Metadata
  metadata            Json?     // Additional data
  version             Int       // Version number
  parentConsentId     String?   // Previous version
  linkedEntityType    String?   // 'appointment', 'procedure', etc.
  linkedEntityId      String?   // Link to specific entity

  // System
  createdAt           DateTime
  updatedAt           DateTime
}
```

### consent_templates Table

```prisma
model ConsentTemplate {
  id              String   @id @default(uuid())
  tenantId        String

  // Template Details
  templateCode    String   @unique    // 'GENERAL_DATA_PROCESSING'
  consentType     String              // ConsentType enum
  consentCategory String              // ConsentCategory enum

  // Content (Multi-language)
  title           Json     // { en: '...', ar: '...' }
  description     Json     // { en: '...', ar: '...' }
  content         Json     // { en: '...', ar: '...' }
  legalText       Json?    // { en: '...', ar: '...' }

  // Configuration
  isRequired      Boolean  // Required for registration?
  requiresWitness Boolean  // Requires witness signature?
  validityDays    Int?     // Days until expiry (null = permanent)
  autoRenew       Boolean  // Auto-renew on expiry?

  // Versioning
  version         Int      // Template version
  status          String   // 'active', 'inactive', 'superseded'
  supersedes      String?  // Previous version ID

  // Metadata
  metadata        Json?
  createdAt       DateTime
  updatedAt       DateTime
}
```

---

## Consent Types

### Complete List of Consent Types

See `backend/shared/types/src/consent-types.ts` for the complete enum.

**Major Types:**

| Type | Category | Required | Witness | Expiry |
|------|----------|----------|---------|--------|
| `general_data_processing` | Data Processing | ✅ Yes | ❌ No | ♾️ Never |
| `phi_storage` | Data Processing | ✅ Yes | ❌ No | ♾️ Never |
| `surgical_procedure` | Treatment | ✅ Yes | ✅ Yes | ♾️ Never |
| `blood_transfusion` | Treatment | ✅ Yes | ✅ Yes | ♾️ Never |
| `sms_notifications` | Communication | ❌ No | ❌ No | 365 days |
| `email_communications` | Communication | ❌ No | ❌ No | 365 days |
| `share_with_insurance` | Data Sharing | ❌ No | ❌ No | 365 days |
| `anonymized_research` | Research | ❌ No | ❌ No | 1825 days |
| `clinical_trial` | Research | ✅ Yes | ✅ Yes | ♾️ Never |
| `marketing_communications` | Marketing | ❌ No | ❌ No | 365 days |

---

## Legal Basis

### GDPR Legal Basis Mapping

```typescript
enum LegalBasis {
  CONSENT = 'consent',                    // GDPR Art. 6(1)(a)
  CONTRACT = 'contract',                  // GDPR Art. 6(1)(b)
  LEGAL_OBLIGATION = 'legal_obligation',  // GDPR Art. 6(1)(c)
  VITAL_INTERESTS = 'vital_interests',    // GDPR Art. 6(1)(d)
  PUBLIC_INTEREST = 'public_interest',    // GDPR Art. 6(1)(e)
  LEGITIMATE_INTEREST = 'legitimate_interest', // GDPR Art. 6(1)(f)
  EXPLICIT_CONSENT = 'explicit_consent',  // GDPR Art. 9(2)(a) - sensitive data
}
```

---

## Implementation Guide

### 1. Patient Registration with Consents

```typescript
import { ConsentService } from './consent.service';
import { ConsentType, CaptureMethod } from '@zeal/shared-types';

// During patient registration
const patient = await prisma.patient.create({ data: patientData });

// Create required consents
await consentService.createConsent({
  patientId: patient.id,
  consentType: ConsentType.GENERAL_DATA_PROCESSING,
  purpose: 'Store and process patient health information',
  captureMethod: CaptureMethod.DIGITAL_SIGNATURE,
  signatureUrl: 's3://signatures/patient-123.png',
}, context);

await consentService.createConsent({
  patientId: patient.id,
  consentType: ConsentType.SMS_NOTIFICATIONS,
  purpose: 'Send appointment reminders via SMS',
  captureMethod: CaptureMethod.ELECTRONIC_CLICK,
}, context);
```

### 2. Check Consent Before Action

```typescript
// Before sending SMS
const hasConsent = await consentService.hasActiveConsent(
  tenantId,
  patientId,
  ConsentType.SMS_NOTIFICATIONS
);

if (!hasConsent) {
  throw new ForbiddenException('Patient has not consented to SMS notifications');
}

await sendSMS(patient.phoneNumber, message);
```

### 3. Revoke Consent

```typescript
await consentService.revokeConsent(
  consentId,
  {
    reason: 'Patient requested to stop SMS notifications',
    revocationMethod: RevocationMethod.PATIENT_PORTAL,
  },
  context
);
```

### 4. Renew Expiring Consent

```typescript
// Automatic renewal (for auto-renew consents)
await consentService.renewConsent(consentId, context);
```

---

## Workflows

### Workflow 1: Patient Registration

```
1. Patient fills registration form
2. System shows required consent forms
3. Patient reads and signs each consent
4. Signatures captured (digital/electronic)
5. Consents stored with timestamps
6. Validation: all required consents granted
7. Registration complete
```

### Workflow 2: Surgical Procedure Consent

```
1. Doctor recommends surgery
2. Staff retrieves surgical consent template
3. Patient reads consent form (English/Arabic)
4. Patient signs digitally
5. Witness (nurse/doctor) signs
6. Both signatures stored
7. Surgery scheduled
8. Consent linked to surgery record
```

### Workflow 3: Patient Revokes SMS Consent

```
1. Patient logs into patient portal
2. Navigates to "My Consents"
3. Views active consents list
4. Clicks "Revoke" on SMS consent
5. Confirms revocation
6. Consent status → 'revoked'
7. isActive → false
8. SMS sending blocked for this patient
```

### Workflow 4: Consent Expiry & Renewal

```
1. System runs daily job
2. Identifies consents expiring in 30 days
3. Sends renewal reminders to patients
4. Patient clicks renewal link
5. Reviews updated consent form
6. Signs renewed consent
7. Old consent → 'superseded'
8. New consent → 'granted'
```

---

## API Examples

### Create Consent

```http
POST /api/v1/clinical/patients/:patientId/consents

{
  "consentType": "sms_notifications",
  "purpose": "Send appointment reminders",
  "captureMethod": "digital_signature",
  "signatureUrl": "https://s3.../signature.png"
}

Response:
{
  "id": "consent-uuid",
  "consentStatus": "granted",
  "effectiveFrom": "2024-10-23T10:00:00Z",
  "effectiveUntil": "2025-10-23T10:00:00Z"
}
```

### Check Consent

```http
GET /api/v1/clinical/patients/:patientId/consents/check?type=sms_notifications

Response:
{
  "hasConsent": true,
  "consentId": "consent-uuid",
  "effectiveUntil": "2025-10-23T10:00:00Z"
}
```

### Revoke Consent

```http
POST /api/v1/clinical/consents/:consentId/revoke

{
  "reason": "Patient no longer wants SMS notifications",
  "revocationMethod": "patient_portal"
}

Response:
{
  "consentId": "consent-uuid",
  "consentStatus": "revoked",
  "revokedAt": "2024-10-23T15:30:00Z"
}
```

### Get Patient Consents

```http
GET /api/v1/clinical/patients/:patientId/consents

Response:
{
  "consents": [
    {
      "id": "consent-1",
      "consentType": "general_data_processing",
      "consentStatus": "granted",
      "effectiveFrom": "2024-01-15T09:00:00Z",
      "effectiveUntil": null
    },
    {
      "id": "consent-2",
      "consentType": "sms_notifications",
      "consentStatus": "granted",
      "effectiveFrom": "2024-01-15T09:00:00Z",
      "effectiveUntil": "2025-01-15T09:00:00Z"
    }
  ]
}
```

---

## Frontend Integration

### Consent Form Component

```typescript
// ConsentFormPage.tsx
import { useState } from 'react';
import { useConsentService } from '@/hooks/useConsentService';

export function ConsentFormPage({ patientId, consentType }: Props) {
  const [signature, setSignature] = useState<string | null>(null);
  const { createConsent, isLoading } = useConsentService();

  const handleSubmit = async () => {
    await createConsent({
      patientId,
      consentType,
      purpose: 'Patient consent for data processing',
      captureMethod: 'digital_signature',
      signatureUrl: signature,
    });
  };

  return (
    <div className="consent-form">
      <h2>{t('consent.title')}</h2>
      <div className="consent-content">
        {/* Consent text in patient's language */}
        <p>{t(`consent.${consentType}.content`)}</p>
      </div>

      <SignaturePad onSigned={(sig) => setSignature(sig)} />

      <Button onClick={handleSubmit} disabled={!signature || isLoading}>
        {t('consent.agree')}
      </Button>
    </div>
  );
}
```

### Consent Management Dashboard

```typescript
// PatientConsentsDashboard.tsx
export function PatientConsentsDashboard({ patientId }: Props) {
  const { consents, revokeConsent } = useConsentService(patientId);

  return (
    <div className="consents-dashboard">
      <h2>My Consents</h2>

      {consents.map((consent) => (
        <ConsentCard key={consent.id}>
          <h3>{consent.consentType}</h3>
          <p>Status: {consent.consentStatus}</p>
          <p>Granted: {formatDate(consent.capturedAt)}</p>
          {consent.effectiveUntil && (
            <p>Expires: {formatDate(consent.effectiveUntil)}</p>
          )}

          {consent.isActive && (
            <Button
              variant="danger"
              onClick={() => revokeConsent(consent.id)}
            >
              Revoke Consent
            </Button>
          )}
        </ConsentCard>
      ))}
    </div>
  );
}
```

---

## Consent Lifecycle

### States

```
PENDING → Patient hasn't signed yet
    ↓
GRANTED → Patient has consented (active)
    ↓
EXPIRED → Consent validity period ended
    ↓
RENEWED → New version created (old → SUPERSEDED)

Alternative paths:
GRANTED → DENIED (patient declines)
GRANTED → REVOKED (patient withdraws)
```

### Transitions

| From | To | Trigger | Action |
|------|----|---------|----|
| PENDING | GRANTED | Patient signs | isActive = true |
| PENDING | DENIED | Patient declines | isActive = false |
| GRANTED | REVOKED | Patient withdraws | revokedAt = NOW() |
| GRANTED | EXPIRED | effectiveUntil passed | isActive = false |
| GRANTED | SUPERSEDED | New version created | isActive = false |
| EXPIRED | GRANTED | Patient renews | New consent created |

---

## Audit & Reporting

### Consent Audit Trail

```typescript
const auditTrail = await consentService.getConsentAuditTrail(
  tenantId,
  patientId
);

// Returns:
[
  {
    consentType: 'sms_notifications',
    consentStatus: 'granted',
    capturedAt: '2024-01-15T09:00:00Z',
    capturedBy: 'user-id-123',
    revokedAt: null
  },
  {
    consentType: 'marketing_communications',
    consentStatus: 'revoked',
    capturedAt: '2024-01-15T09:00:00Z',
    revokedAt: '2024-06-20T14:30:00Z',
    revocationReason: 'Patient opted out'
  }
]
```

### Consent Statistics

```typescript
const stats = await consentService.getConsentStatistics(tenantId);

// Returns:
{
  totalPatients: 1500,
  consentStats: [
    { consentType: 'general_data_processing', consentStatus: 'granted', count: 1500 },
    { consentType: 'sms_notifications', consentStatus: 'granted', count: 1200 },
    { consentType: 'sms_notifications', consentStatus: 'revoked', count: 300 },
    { consentType: 'marketing_communications', consentStatus: 'granted', count: 800 }
  ]
}
```

### Expiring Consents Report

```typescript
const expiringConsents = await consentService.getExpiringConsents(
  tenantId,
  30 // days
);

// Returns patients with consents expiring in next 30 days
```

---

## Best Practices

### 1. Always Check Consent Before Action

```typescript
// ✅ Good
const hasConsent = await consentService.hasActiveConsent(...);
if (hasConsent) {
  await sendSMS(...);
}

// ❌ Bad
await sendSMS(...); // No consent check
```

### 2. Use Specific Consent Types

```typescript
// ✅ Good - Granular consent
ConsentType.SMS_NOTIFICATIONS
ConsentType.EMAIL_COMMUNICATIONS

// ❌ Bad - Too broad
ConsentType.GENERAL_COMMUNICATIONS
```

### 3. Link Consents to Actions

```typescript
// Link surgical consent to surgery record
await consentService.createConsent({
  linkedEntityType: 'surgery',
  linkedEntityId: surgeryId,
  // ...
});
```

### 4. Store Evidence

```typescript
// Always capture signatures and documents
await consentService.createConsent({
  signatureUrl: 's3://signatures/patient-123.png',
  documentUrl: 's3://consent-forms/signed-consent-456.pdf',
  witnessSignatureUrl: 's3://signatures/witness-789.png',
  // ...
});
```

### 5. Handle Expiry Proactively

```typescript
// Run daily job to expire old consents
await consentService.expireOutdatedConsents(tenantId);

// Send renewal reminders 30 days before expiry
const expiring = await consentService.getExpiringConsents(tenantId, 30);
```

### 6. Respect Revocations Immediately

```typescript
// After revocation, stop ALL related activities immediately
if (consent.consentStatus === 'revoked') {
  // Don't send SMS
  // Don't send emails
  // Don't use data for research
  // etc.
}
```

### 7. Multi-Language Support

```typescript
// Always provide consent forms in patient's language
const template = await templateService.getTemplate(
  tenantId,
  templateCode,
  patient.preferredLanguage // 'en' or 'ar'
);
```

### 8. Version Control

```typescript
// When updating consent terms, create new version
await templateService.createTemplateVersion(
  tenantId,
  templateCode,
  updatedContent
);
```

---

## GDPR Compliance Checklist

✅ **Freely Given** - Patient can refuse without consequences
✅ **Specific** - Each consent is for a specific purpose
✅ **Informed** - Clear explanation of what patient consents to
✅ **Unambiguous** - Clear affirmative action (signature/checkbox)
✅ **Withdrawable** - Patient can revoke at any time easily
✅ **Documented** - Complete audit trail
✅ **Granular** - Separate consents for different purposes
✅ **Time-Limited** - Consents expire (for non-essential purposes)
✅ **Evidence** - Signatures and documents stored securely

---

## Support

**Files:**
- Schema: `backend/shared/database-clinical/prisma/schema.prisma`
- Types: `backend/shared/types/src/consent-types.ts`
- Service: `backend/services/clinical/src/modules/consent/consent.service.ts`
- Templates: `backend/services/clinical/src/modules/consent/consent-template.service.ts`
- Examples: `backend/services/clinical/src/modules/consent/consent-integration.example.ts`
- Documentation: This file

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Maintainer:** athma-ce Platform Team
