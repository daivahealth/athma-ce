/**
 * Patient Consent Types and Enums
 * GDPR-compliant consent management
 */

// ============================================================================
// CONSENT CATEGORIES
// ============================================================================

export enum ConsentCategory {
  DATA_PROCESSING = 'data_processing',
  TREATMENT = 'treatment',
  COMMUNICATION = 'communication',
  DATA_SHARING = 'data_sharing',
  RESEARCH = 'research',
  FINANCIAL = 'financial',
  MARKETING = 'marketing',
}

// ============================================================================
// CONSENT TYPES (Specific)
// ============================================================================

export enum ConsentType {
  // Data Processing
  GENERAL_DATA_PROCESSING = 'general_data_processing',
  PHI_STORAGE = 'phi_storage',
  SENSITIVE_DATA_PROCESSING = 'sensitive_data_processing',
  DATA_RETENTION = 'data_retention',

  // Treatment
  MEDICAL_TREATMENT = 'medical_treatment',
  SURGICAL_PROCEDURE = 'surgical_procedure',
  ANESTHESIA = 'anesthesia',
  BLOOD_TRANSFUSION = 'blood_transfusion',
  MEDICATION_ADMINISTRATION = 'medication_administration',
  DIAGNOSTIC_TEST = 'diagnostic_test',
  IMAGING_STUDY = 'imaging_study',
  IMMUNIZATION = 'immunization',

  // Communication
  SMS_NOTIFICATIONS = 'sms_notifications',
  EMAIL_COMMUNICATIONS = 'email_communications',
  PHONE_CALLS = 'phone_calls',
  WHATSAPP_MESSAGES = 'whatsapp_messages',
  APPOINTMENT_REMINDERS = 'appointment_reminders',
  TEST_RESULTS_NOTIFICATION = 'test_results_notification',
  EMERGENCY_CONTACT_NOTIFICATION = 'emergency_contact_notification',

  // Data Sharing
  SHARE_WITH_INSURANCE = 'share_with_insurance',
  SHARE_WITH_FACILITIES = 'share_with_facilities',
  SHARE_WITH_SPECIALISTS = 'share_with_specialists',
  SHARE_WITH_GOVERNMENT = 'share_with_government',
  HIE_PARTICIPATION = 'hie_participation',
  INTERNATIONAL_DATA_TRANSFER = 'international_data_transfer',

  // Research
  ANONYMIZED_RESEARCH = 'anonymized_research',
  CLINICAL_TRIAL = 'clinical_trial',
  AI_ML_TRAINING = 'ai_ml_training',
  ACADEMIC_RESEARCH = 'academic_research',

  // Financial
  INSURANCE_CLAIM_PROCESSING = 'insurance_claim_processing',
  PAYMENT_AUTHORIZATION = 'payment_authorization',
  CREDIT_CHECK = 'credit_check',
  PAYMENT_PLAN = 'payment_plan',

  // Marketing
  MARKETING_COMMUNICATIONS = 'marketing_communications',
  HEALTH_TIPS_NEWSLETTER = 'health_tips_newsletter',
  PROMOTIONAL_OFFERS = 'promotional_offers',
  THIRD_PARTY_MARKETING = 'third_party_marketing',
}

// ============================================================================
// CONSENT STATUS
// ============================================================================

export enum ConsentStatus {
  PENDING = 'pending',           // Awaiting patient signature
  GRANTED = 'granted',           // Patient has consented
  DENIED = 'denied',             // Patient has declined
  REVOKED = 'revoked',           // Patient withdrew consent
  EXPIRED = 'expired',           // Consent validity period ended
  SUPERSEDED = 'superseded',     // Replaced by newer consent
}

// ============================================================================
// CONSENT CAPTURE METHOD
// ============================================================================

export enum CaptureMethod {
  DIGITAL_SIGNATURE = 'digital_signature',
  PAPER_FORM = 'paper_form',
  VERBAL = 'verbal',
  ELECTRONIC_CLICK = 'electronic_click',
  PATIENT_PORTAL = 'patient_portal',
  MOBILE_APP = 'mobile_app',
  KIOSK = 'kiosk',
  TELEPHONIC = 'telephonic',
  VIDEO_RECORDING = 'video_recording',
}

// ============================================================================
// LEGAL BASIS (GDPR Article 6 & 9)
// ============================================================================

export enum LegalBasis {
  CONSENT = 'consent',                    // GDPR Art. 6(1)(a)
  CONTRACT = 'contract',                  // GDPR Art. 6(1)(b)
  LEGAL_OBLIGATION = 'legal_obligation',  // GDPR Art. 6(1)(c)
  VITAL_INTERESTS = 'vital_interests',    // GDPR Art. 6(1)(d)
  PUBLIC_INTEREST = 'public_interest',    // GDPR Art. 6(1)(e)
  LEGITIMATE_INTEREST = 'legitimate_interest', // GDPR Art. 6(1)(f)
  EXPLICIT_CONSENT = 'explicit_consent',  // GDPR Art. 9(2)(a) - for sensitive data
}

// ============================================================================
// REVOCATION METHOD
// ============================================================================

export enum RevocationMethod {
  WRITTEN_REQUEST = 'written_request',
  VERBAL_REQUEST = 'verbal_request',
  PATIENT_PORTAL = 'patient_portal',
  EMAIL_REQUEST = 'email_request',
  PHONE_REQUEST = 'phone_request',
  IN_PERSON = 'in_person',
}

// ============================================================================
// LINKED ENTITY TYPES
// ============================================================================

export enum LinkedEntityType {
  APPOINTMENT = 'appointment',
  ENCOUNTER = 'encounter',
  PROCEDURE = 'procedure',
  PRESCRIPTION = 'prescription',
  LAB_ORDER = 'lab_order',
  IMAGING_ORDER = 'imaging_order',
  SURGERY = 'surgery',
  DOCUMENT = 'document',
  PATIENT_HISTORY_CHANGE = 'patient_history_change',
}

// ============================================================================
// CONSENT REQUIREMENT RULES
// ============================================================================

export const CONSENT_REQUIREMENTS: Record<
  ConsentType,
  {
    category: ConsentCategory;
    required: boolean;
    requiresWitness: boolean;
    validityDays?: number;
    legalBasis: LegalBasis;
    description: string;
  }
> = {
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
    validityDays: 365,
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

export function getConsentRequirement(consentType: ConsentType) {
  return CONSENT_REQUIREMENTS[consentType];
}

export function getRequiredConsents(): ConsentType[] {
  return Object.entries(CONSENT_REQUIREMENTS)
    .filter(([_, req]) => req.required)
    .map(([type, _]) => type as ConsentType);
}

export function getConsentsByCategory(category: ConsentCategory): ConsentType[] {
  return Object.entries(CONSENT_REQUIREMENTS)
    .filter(([_, req]) => req.category === category)
    .map(([type, _]) => type as ConsentType);
}

export function isConsentExpired(
  effectiveFrom: Date,
  validityDays: number | null
): boolean {
  if (!validityDays) return false; // Permanent consent
  const expiryDate = new Date(effectiveFrom);
  expiryDate.setDate(expiryDate.getDate() + validityDays);
  return new Date() > expiryDate;
}
