/**
 * Patient Consent Types and Enums
 * GDPR-compliant consent management
 */
export declare enum ConsentCategory {
    DATA_PROCESSING = "data_processing",
    TREATMENT = "treatment",
    COMMUNICATION = "communication",
    DATA_SHARING = "data_sharing",
    RESEARCH = "research",
    FINANCIAL = "financial",
    MARKETING = "marketing"
}
export declare enum ConsentType {
    GENERAL_DATA_PROCESSING = "general_data_processing",
    PHI_STORAGE = "phi_storage",
    SENSITIVE_DATA_PROCESSING = "sensitive_data_processing",
    DATA_RETENTION = "data_retention",
    MEDICAL_TREATMENT = "medical_treatment",
    SURGICAL_PROCEDURE = "surgical_procedure",
    ANESTHESIA = "anesthesia",
    BLOOD_TRANSFUSION = "blood_transfusion",
    MEDICATION_ADMINISTRATION = "medication_administration",
    DIAGNOSTIC_TEST = "diagnostic_test",
    IMAGING_STUDY = "imaging_study",
    IMMUNIZATION = "immunization",
    SMS_NOTIFICATIONS = "sms_notifications",
    EMAIL_COMMUNICATIONS = "email_communications",
    PHONE_CALLS = "phone_calls",
    WHATSAPP_MESSAGES = "whatsapp_messages",
    APPOINTMENT_REMINDERS = "appointment_reminders",
    TEST_RESULTS_NOTIFICATION = "test_results_notification",
    EMERGENCY_CONTACT_NOTIFICATION = "emergency_contact_notification",
    SHARE_WITH_INSURANCE = "share_with_insurance",
    SHARE_WITH_FACILITIES = "share_with_facilities",
    SHARE_WITH_SPECIALISTS = "share_with_specialists",
    SHARE_WITH_GOVERNMENT = "share_with_government",
    HIE_PARTICIPATION = "hie_participation",
    INTERNATIONAL_DATA_TRANSFER = "international_data_transfer",
    ANONYMIZED_RESEARCH = "anonymized_research",
    CLINICAL_TRIAL = "clinical_trial",
    AI_ML_TRAINING = "ai_ml_training",
    ACADEMIC_RESEARCH = "academic_research",
    INSURANCE_CLAIM_PROCESSING = "insurance_claim_processing",
    PAYMENT_AUTHORIZATION = "payment_authorization",
    CREDIT_CHECK = "credit_check",
    PAYMENT_PLAN = "payment_plan",
    MARKETING_COMMUNICATIONS = "marketing_communications",
    HEALTH_TIPS_NEWSLETTER = "health_tips_newsletter",
    PROMOTIONAL_OFFERS = "promotional_offers",
    THIRD_PARTY_MARKETING = "third_party_marketing"
}
export declare enum ConsentStatus {
    PENDING = "pending",// Awaiting patient signature
    GRANTED = "granted",// Patient has consented
    DENIED = "denied",// Patient has declined
    REVOKED = "revoked",// Patient withdrew consent
    EXPIRED = "expired",// Consent validity period ended
    SUPERSEDED = "superseded"
}
export declare enum CaptureMethod {
    DIGITAL_SIGNATURE = "digital_signature",
    PAPER_FORM = "paper_form",
    VERBAL = "verbal",
    ELECTRONIC_CLICK = "electronic_click",
    PATIENT_PORTAL = "patient_portal",
    MOBILE_APP = "mobile_app",
    KIOSK = "kiosk",
    TELEPHONIC = "telephonic",
    VIDEO_RECORDING = "video_recording"
}
export declare enum LegalBasis {
    CONSENT = "consent",// GDPR Art. 6(1)(a)
    CONTRACT = "contract",// GDPR Art. 6(1)(b)
    LEGAL_OBLIGATION = "legal_obligation",// GDPR Art. 6(1)(c)
    VITAL_INTERESTS = "vital_interests",// GDPR Art. 6(1)(d)
    PUBLIC_INTEREST = "public_interest",// GDPR Art. 6(1)(e)
    LEGITIMATE_INTEREST = "legitimate_interest",// GDPR Art. 6(1)(f)
    EXPLICIT_CONSENT = "explicit_consent"
}
export declare enum RevocationMethod {
    WRITTEN_REQUEST = "written_request",
    VERBAL_REQUEST = "verbal_request",
    PATIENT_PORTAL = "patient_portal",
    EMAIL_REQUEST = "email_request",
    PHONE_REQUEST = "phone_request",
    IN_PERSON = "in_person"
}
export declare enum LinkedEntityType {
    APPOINTMENT = "appointment",
    ENCOUNTER = "encounter",
    PROCEDURE = "procedure",
    PRESCRIPTION = "prescription",
    LAB_ORDER = "lab_order",
    IMAGING_ORDER = "imaging_order",
    SURGERY = "surgery",
    DOCUMENT = "document",
    PATIENT_HISTORY_CHANGE = "patient_history_change"
}
export declare const CONSENT_REQUIREMENTS: Record<ConsentType, {
    category: ConsentCategory;
    required: boolean;
    requiresWitness: boolean;
    validityDays?: number;
    legalBasis: LegalBasis;
    description: string;
}>;
export declare function getConsentRequirement(consentType: ConsentType): {
    category: ConsentCategory;
    required: boolean;
    requiresWitness: boolean;
    validityDays?: number;
    legalBasis: LegalBasis;
    description: string;
};
export declare function getRequiredConsents(): ConsentType[];
export declare function getConsentsByCategory(category: ConsentCategory): ConsentType[];
export declare function isConsentExpired(effectiveFrom: Date, validityDays: number | null): boolean;
//# sourceMappingURL=consent-types.d.ts.map