"use strict";
/**
 * Patient Consent Types and Enums
 * GDPR-compliant consent management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSENT_REQUIREMENTS = exports.LinkedEntityType = exports.RevocationMethod = exports.LegalBasis = exports.CaptureMethod = exports.ConsentStatus = exports.ConsentType = exports.ConsentCategory = void 0;
exports.getConsentRequirement = getConsentRequirement;
exports.getRequiredConsents = getRequiredConsents;
exports.getConsentsByCategory = getConsentsByCategory;
exports.isConsentExpired = isConsentExpired;
// ============================================================================
// CONSENT CATEGORIES
// ============================================================================
var ConsentCategory;
(function (ConsentCategory) {
    ConsentCategory["DATA_PROCESSING"] = "data_processing";
    ConsentCategory["TREATMENT"] = "treatment";
    ConsentCategory["COMMUNICATION"] = "communication";
    ConsentCategory["DATA_SHARING"] = "data_sharing";
    ConsentCategory["RESEARCH"] = "research";
    ConsentCategory["FINANCIAL"] = "financial";
    ConsentCategory["MARKETING"] = "marketing";
})(ConsentCategory || (exports.ConsentCategory = ConsentCategory = {}));
// ============================================================================
// CONSENT TYPES (Specific)
// ============================================================================
var ConsentType;
(function (ConsentType) {
    // Data Processing
    ConsentType["GENERAL_DATA_PROCESSING"] = "general_data_processing";
    ConsentType["PHI_STORAGE"] = "phi_storage";
    ConsentType["SENSITIVE_DATA_PROCESSING"] = "sensitive_data_processing";
    ConsentType["DATA_RETENTION"] = "data_retention";
    // Treatment
    ConsentType["MEDICAL_TREATMENT"] = "medical_treatment";
    ConsentType["SURGICAL_PROCEDURE"] = "surgical_procedure";
    ConsentType["ANESTHESIA"] = "anesthesia";
    ConsentType["BLOOD_TRANSFUSION"] = "blood_transfusion";
    ConsentType["MEDICATION_ADMINISTRATION"] = "medication_administration";
    ConsentType["DIAGNOSTIC_TEST"] = "diagnostic_test";
    ConsentType["IMAGING_STUDY"] = "imaging_study";
    ConsentType["IMMUNIZATION"] = "immunization";
    // Communication
    ConsentType["SMS_NOTIFICATIONS"] = "sms_notifications";
    ConsentType["EMAIL_COMMUNICATIONS"] = "email_communications";
    ConsentType["PHONE_CALLS"] = "phone_calls";
    ConsentType["WHATSAPP_MESSAGES"] = "whatsapp_messages";
    ConsentType["APPOINTMENT_REMINDERS"] = "appointment_reminders";
    ConsentType["TEST_RESULTS_NOTIFICATION"] = "test_results_notification";
    ConsentType["EMERGENCY_CONTACT_NOTIFICATION"] = "emergency_contact_notification";
    // Data Sharing
    ConsentType["SHARE_WITH_INSURANCE"] = "share_with_insurance";
    ConsentType["SHARE_WITH_FACILITIES"] = "share_with_facilities";
    ConsentType["SHARE_WITH_SPECIALISTS"] = "share_with_specialists";
    ConsentType["SHARE_WITH_GOVERNMENT"] = "share_with_government";
    ConsentType["HIE_PARTICIPATION"] = "hie_participation";
    ConsentType["INTERNATIONAL_DATA_TRANSFER"] = "international_data_transfer";
    // Research
    ConsentType["ANONYMIZED_RESEARCH"] = "anonymized_research";
    ConsentType["CLINICAL_TRIAL"] = "clinical_trial";
    ConsentType["AI_ML_TRAINING"] = "ai_ml_training";
    ConsentType["ACADEMIC_RESEARCH"] = "academic_research";
    // Financial
    ConsentType["INSURANCE_CLAIM_PROCESSING"] = "insurance_claim_processing";
    ConsentType["PAYMENT_AUTHORIZATION"] = "payment_authorization";
    ConsentType["CREDIT_CHECK"] = "credit_check";
    ConsentType["PAYMENT_PLAN"] = "payment_plan";
    // Marketing
    ConsentType["MARKETING_COMMUNICATIONS"] = "marketing_communications";
    ConsentType["HEALTH_TIPS_NEWSLETTER"] = "health_tips_newsletter";
    ConsentType["PROMOTIONAL_OFFERS"] = "promotional_offers";
    ConsentType["THIRD_PARTY_MARKETING"] = "third_party_marketing";
})(ConsentType || (exports.ConsentType = ConsentType = {}));
// ============================================================================
// CONSENT STATUS
// ============================================================================
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus["PENDING"] = "pending";
    ConsentStatus["GRANTED"] = "granted";
    ConsentStatus["DENIED"] = "denied";
    ConsentStatus["REVOKED"] = "revoked";
    ConsentStatus["EXPIRED"] = "expired";
    ConsentStatus["SUPERSEDED"] = "superseded";
})(ConsentStatus || (exports.ConsentStatus = ConsentStatus = {}));
// ============================================================================
// CONSENT CAPTURE METHOD
// ============================================================================
var CaptureMethod;
(function (CaptureMethod) {
    CaptureMethod["DIGITAL_SIGNATURE"] = "digital_signature";
    CaptureMethod["PAPER_FORM"] = "paper_form";
    CaptureMethod["VERBAL"] = "verbal";
    CaptureMethod["ELECTRONIC_CLICK"] = "electronic_click";
    CaptureMethod["PATIENT_PORTAL"] = "patient_portal";
    CaptureMethod["MOBILE_APP"] = "mobile_app";
    CaptureMethod["KIOSK"] = "kiosk";
    CaptureMethod["TELEPHONIC"] = "telephonic";
    CaptureMethod["VIDEO_RECORDING"] = "video_recording";
})(CaptureMethod || (exports.CaptureMethod = CaptureMethod = {}));
// ============================================================================
// LEGAL BASIS (GDPR Article 6 & 9)
// ============================================================================
var LegalBasis;
(function (LegalBasis) {
    LegalBasis["CONSENT"] = "consent";
    LegalBasis["CONTRACT"] = "contract";
    LegalBasis["LEGAL_OBLIGATION"] = "legal_obligation";
    LegalBasis["VITAL_INTERESTS"] = "vital_interests";
    LegalBasis["PUBLIC_INTEREST"] = "public_interest";
    LegalBasis["LEGITIMATE_INTEREST"] = "legitimate_interest";
    LegalBasis["EXPLICIT_CONSENT"] = "explicit_consent";
})(LegalBasis || (exports.LegalBasis = LegalBasis = {}));
// ============================================================================
// REVOCATION METHOD
// ============================================================================
var RevocationMethod;
(function (RevocationMethod) {
    RevocationMethod["WRITTEN_REQUEST"] = "written_request";
    RevocationMethod["VERBAL_REQUEST"] = "verbal_request";
    RevocationMethod["PATIENT_PORTAL"] = "patient_portal";
    RevocationMethod["EMAIL_REQUEST"] = "email_request";
    RevocationMethod["PHONE_REQUEST"] = "phone_request";
    RevocationMethod["IN_PERSON"] = "in_person";
})(RevocationMethod || (exports.RevocationMethod = RevocationMethod = {}));
// ============================================================================
// LINKED ENTITY TYPES
// ============================================================================
var LinkedEntityType;
(function (LinkedEntityType) {
    LinkedEntityType["APPOINTMENT"] = "appointment";
    LinkedEntityType["ENCOUNTER"] = "encounter";
    LinkedEntityType["PROCEDURE"] = "procedure";
    LinkedEntityType["PRESCRIPTION"] = "prescription";
    LinkedEntityType["LAB_ORDER"] = "lab_order";
    LinkedEntityType["IMAGING_ORDER"] = "imaging_order";
    LinkedEntityType["SURGERY"] = "surgery";
    LinkedEntityType["DOCUMENT"] = "document";
    LinkedEntityType["PATIENT_HISTORY_CHANGE"] = "patient_history_change";
})(LinkedEntityType || (exports.LinkedEntityType = LinkedEntityType = {}));
// ============================================================================
// CONSENT REQUIREMENT RULES
// ============================================================================
exports.CONSENT_REQUIREMENTS = {
    // Data Processing
    [ConsentType.GENERAL_DATA_PROCESSING]: {
        category: ConsentCategory.DATA_PROCESSING,
        required: true,
        requiresWitness: false,
        // validityDays: undefined, // Permanent until revoked (omit for permanent)
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to store and process personal health information',
    },
    [ConsentType.PHI_STORAGE]: {
        category: ConsentCategory.DATA_PROCESSING,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent to store Protected Health Information (PHI)',
    },
    [ConsentType.SENSITIVE_DATA_PROCESSING]: {
        category: ConsentCategory.DATA_PROCESSING,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent to process sensitive personal data (GDPR Art. 9)',
    },
    [ConsentType.DATA_RETENTION]: {
        category: ConsentCategory.DATA_PROCESSING,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to retain data beyond legal minimum',
    },
    // Treatment
    [ConsentType.MEDICAL_TREATMENT]: {
        category: ConsentCategory.TREATMENT,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.VITAL_INTERESTS,
        description: 'General consent for medical treatment',
    },
    [ConsentType.SURGICAL_PROCEDURE]: {
        category: ConsentCategory.TREATMENT,
        required: true,
        requiresWitness: true,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Informed consent for surgical procedure',
    },
    [ConsentType.ANESTHESIA]: {
        category: ConsentCategory.TREATMENT,
        required: true,
        requiresWitness: true,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent for anesthesia administration',
    },
    [ConsentType.BLOOD_TRANSFUSION]: {
        category: ConsentCategory.TREATMENT,
        required: true,
        requiresWitness: true,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent for blood transfusion',
    },
    [ConsentType.MEDICATION_ADMINISTRATION]: {
        category: ConsentCategory.TREATMENT,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Consent for medication administration',
    },
    [ConsentType.DIAGNOSTIC_TEST]: {
        category: ConsentCategory.TREATMENT,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Consent for diagnostic testing',
    },
    [ConsentType.IMAGING_STUDY]: {
        category: ConsentCategory.TREATMENT,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Consent for imaging study (X-ray, MRI, CT)',
    },
    [ConsentType.IMMUNIZATION]: {
        category: ConsentCategory.TREATMENT,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent for immunization/vaccination',
    },
    // Communication
    [ConsentType.SMS_NOTIFICATIONS]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive SMS notifications',
    },
    [ConsentType.EMAIL_COMMUNICATIONS]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive email communications',
    },
    [ConsentType.PHONE_CALLS]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive phone calls',
    },
    [ConsentType.WHATSAPP_MESSAGES]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive WhatsApp messages',
    },
    [ConsentType.APPOINTMENT_REMINDERS]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive appointment reminders',
    },
    [ConsentType.TEST_RESULTS_NOTIFICATION]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive test results via communication channels',
    },
    [ConsentType.EMERGENCY_CONTACT_NOTIFICATION]: {
        category: ConsentCategory.COMMUNICATION,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.VITAL_INTERESTS,
        description: 'Consent to notify emergency contacts',
    },
    // Data Sharing
    [ConsentType.SHARE_WITH_INSURANCE]: {
        category: ConsentCategory.DATA_SHARING,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to share data with insurance companies',
    },
    [ConsentType.SHARE_WITH_FACILITIES]: {
        category: ConsentCategory.DATA_SHARING,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to share data with other healthcare facilities',
    },
    [ConsentType.SHARE_WITH_SPECIALISTS]: {
        category: ConsentCategory.DATA_SHARING,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to share data with specialist physicians',
    },
    [ConsentType.SHARE_WITH_GOVERNMENT]: {
        category: ConsentCategory.DATA_SHARING,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.LEGAL_OBLIGATION,
        description: 'Consent to share data with government health authorities (DHA/DOH)',
    },
    [ConsentType.HIE_PARTICIPATION]: {
        category: ConsentCategory.DATA_SHARING,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to participate in Health Information Exchange',
    },
    [ConsentType.INTERNATIONAL_DATA_TRANSFER]: {
        category: ConsentCategory.DATA_SHARING,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent for international data transfer (GDPR Art. 49)',
    },
    // Research
    [ConsentType.ANONYMIZED_RESEARCH]: {
        category: ConsentCategory.RESEARCH,
        required: false,
        requiresWitness: false,
        validityDays: 1825, // 5 years
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to use anonymized data for medical research',
    },
    [ConsentType.CLINICAL_TRIAL]: {
        category: ConsentCategory.RESEARCH,
        required: true,
        requiresWitness: true,
        legalBasis: LegalBasis.EXPLICIT_CONSENT,
        description: 'Consent to participate in clinical trial',
    },
    [ConsentType.AI_ML_TRAINING]: {
        category: ConsentCategory.RESEARCH,
        required: false,
        requiresWitness: false,
        validityDays: 1825, // 5 years
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to use data for AI/ML model training',
    },
    [ConsentType.ACADEMIC_RESEARCH]: {
        category: ConsentCategory.RESEARCH,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent for academic research use',
    },
    // Financial
    [ConsentType.INSURANCE_CLAIM_PROCESSING]: {
        category: ConsentCategory.FINANCIAL,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Consent to process insurance claims',
    },
    [ConsentType.PAYMENT_AUTHORIZATION]: {
        category: ConsentCategory.FINANCIAL,
        required: true,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Authorization for payment processing',
    },
    [ConsentType.CREDIT_CHECK]: {
        category: ConsentCategory.FINANCIAL,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent for credit check',
    },
    [ConsentType.PAYMENT_PLAN]: {
        category: ConsentCategory.FINANCIAL,
        required: false,
        requiresWitness: false,
        legalBasis: LegalBasis.CONTRACT,
        description: 'Agreement for payment plan',
    },
    // Marketing
    [ConsentType.MARKETING_COMMUNICATIONS]: {
        category: ConsentCategory.MARKETING,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive marketing communications',
    },
    [ConsentType.HEALTH_TIPS_NEWSLETTER]: {
        category: ConsentCategory.MARKETING,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive health tips newsletter',
    },
    [ConsentType.PROMOTIONAL_OFFERS]: {
        category: ConsentCategory.MARKETING,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to receive promotional offers',
    },
    [ConsentType.THIRD_PARTY_MARKETING]: {
        category: ConsentCategory.MARKETING,
        required: false,
        requiresWitness: false,
        validityDays: 365,
        legalBasis: LegalBasis.CONSENT,
        description: 'Consent to share data with third-party marketers',
    },
};
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getConsentRequirement(consentType) {
    return exports.CONSENT_REQUIREMENTS[consentType];
}
function getRequiredConsents() {
    return Object.entries(exports.CONSENT_REQUIREMENTS)
        .filter(([_, req]) => req.required)
        .map(([type, _]) => type);
}
function getConsentsByCategory(category) {
    return Object.entries(exports.CONSENT_REQUIREMENTS)
        .filter(([_, req]) => req.category === category)
        .map(([type, _]) => type);
}
function isConsentExpired(effectiveFrom, validityDays) {
    if (!validityDays)
        return false; // Permanent consent
    const expiryDate = new Date(effectiveFrom);
    expiryDate.setDate(expiryDate.getDate() + validityDays);
    return new Date() > expiryDate;
}
//# sourceMappingURL=consent-types.js.map