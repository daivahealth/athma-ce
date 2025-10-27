
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.PatientScalarFieldEnum = {
  id: 'id',
  mrn: 'mrn',
  tenantId: 'tenantId',
  nationalId: 'nationalId',
  nationalIdType: 'nationalIdType',
  issuingCountry: 'issuingCountry',
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  maritalStatus: 'maritalStatus',
  nationality: 'nationality',
  preferredLanguage: 'preferredLanguage',
  phoneNumber: 'phoneNumber',
  email: 'email',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  bloodGroup: 'bloodGroup',
  emergencyContact: 'emergencyContact',
  insuranceInfo: 'insuranceInfo',
  createdBy: 'createdBy',
  createdAtFacility: 'createdAtFacility',
  registrationSource: 'registrationSource',
  registrationNotes: 'registrationNotes',
  updatedBy: 'updatedBy',
  updatedAtFacility: 'updatedAtFacility',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  facilityId: 'facilityId',
  spaceId: 'spaceId',
  staffId: 'staffId',
  appointmentType: 'appointmentType',
  status: 'status',
  startTime: 'startTime',
  endTime: 'endTime',
  duration: 'duration',
  notes: 'notes',
  visitType: 'visitType',
  linkedEncounterId: 'linkedEncounterId',
  seriesId: 'seriesId',
  cancellationReason: 'cancellationReason',
  rescheduleReason: 'rescheduleReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EncounterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  facilityId: 'facilityId',
  appointmentId: 'appointmentId',
  primaryStaffId: 'primaryStaffId',
  encounterClass: 'encounterClass',
  status: 'status',
  priority: 'priority',
  startTime: 'startTime',
  endTime: 'endTime',
  encounterSource: 'encounterSource',
  walkInDetails: 'walkInDetails',
  chiefComplaint: 'chiefComplaint',
  presentingSymptoms: 'presentingSymptoms',
  vitalSigns: 'vitalSigns',
  allergies: 'allergies',
  currentMedications: 'currentMedications',
  medicalHistory: 'medicalHistory',
  socialHistory: 'socialHistory',
  familyHistory: 'familyHistory',
  notes: 'notes',
  dischargeDisposition: 'dischargeDisposition',
  followUpInstructions: 'followUpInstructions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientDocumentScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  documentType: 'documentType',
  documentNumber: 'documentNumber',
  issuingCountry: 'issuingCountry',
  issuingAuthority: 'issuingAuthority',
  issueDate: 'issueDate',
  expiryDate: 'expiryDate',
  isPrimaryIdentity: 'isPrimaryIdentity',
  documentUrl: 'documentUrl',
  verificationStatus: 'verificationStatus',
  verifiedBy: 'verifiedBy',
  verifiedAt: 'verifiedAt',
  verificationNotes: 'verificationNotes',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientHistoryScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  fieldName: 'fieldName',
  oldValue: 'oldValue',
  newValue: 'newValue',
  changeType: 'changeType',
  changeReason: 'changeReason',
  supportingDocUrl: 'supportingDocUrl',
  changedBy: 'changedBy',
  approvedBy: 'approvedBy',
  changedAtFacility: 'changedAtFacility',
  changedAt: 'changedAt',
  patientConsent: 'patientConsent',
  consentDocUrl: 'consentDocUrl',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.PatientConsentScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  consentType: 'consentType',
  consentCategory: 'consentCategory',
  consentStatus: 'consentStatus',
  consentScope: 'consentScope',
  purpose: 'purpose',
  description: 'description',
  legalBasis: 'legalBasis',
  effectiveFrom: 'effectiveFrom',
  effectiveUntil: 'effectiveUntil',
  isActive: 'isActive',
  captureMethod: 'captureMethod',
  capturedBy: 'capturedBy',
  capturedAt: 'capturedAt',
  capturedAtFacility: 'capturedAtFacility',
  signatureUrl: 'signatureUrl',
  documentUrl: 'documentUrl',
  witnessedBy: 'witnessedBy',
  witnessSignatureUrl: 'witnessSignatureUrl',
  revokedAt: 'revokedAt',
  revokedBy: 'revokedBy',
  revocationReason: 'revocationReason',
  revocationMethod: 'revocationMethod',
  metadata: 'metadata',
  version: 'version',
  parentConsentId: 'parentConsentId',
  linkedEntityType: 'linkedEntityType',
  linkedEntityId: 'linkedEntityId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConsentTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  templateCode: 'templateCode',
  consentType: 'consentType',
  consentCategory: 'consentCategory',
  title: 'title',
  description: 'description',
  content: 'content',
  legalText: 'legalText',
  isRequired: 'isRequired',
  requiresWitness: 'requiresWitness',
  validityDays: 'validityDays',
  autoRenew: 'autoRenew',
  version: 'version',
  status: 'status',
  supersedes: 'supersedes',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Patient: 'Patient',
  Appointment: 'Appointment',
  Encounter: 'Encounter',
  PatientDocument: 'PatientDocument',
  PatientHistory: 'PatientHistory',
  PatientConsent: 'PatientConsent',
  ConsentTemplate: 'ConsentTemplate'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/sajithchandran/aira/zeal/backend/shared/database-clinical/generated",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "postgresqlExtensions"
    ],
    "sourceFilePath": "/Users/sajithchandran/aira/zeal/backend/shared/database-clinical/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../.env"
  },
  "relativePath": "../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "CLINICAL_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"postgresqlExtensions\"]\n  output          = \"../generated\"\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"CLINICAL_DATABASE_URL\")\n  extensions = [uuid_ossp(map: \"uuid-ossp\")]\n}\n\nmodel Patient {\n  id       String @id @default(uuid()) @map(\"id\") @db.Uuid\n  mrn      String @unique @map(\"mrn\") @db.VarChar(50)\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  // Identity\n  nationalId     String? @map(\"national_id\") @db.VarChar(50)\n  nationalIdType String? @map(\"national_id_type\") @db.VarChar(50)\n  issuingCountry String? @map(\"issuing_country\") @db.VarChar(2)\n\n  // Demographics\n  firstName         String   @map(\"first_name\") @db.VarChar(100)\n  lastName          String   @map(\"last_name\") @db.VarChar(100)\n  middleName        String?  @map(\"middle_name\") @db.VarChar(100)\n  dateOfBirth       DateTime @map(\"date_of_birth\") @db.Date\n  gender            String   @db.VarChar(10)\n  maritalStatus     String?  @map(\"marital_status\") @db.VarChar(20)\n  nationality       String?  @map(\"nationality\") @db.VarChar(100)\n  preferredLanguage String?  @default(\"en\") @map(\"preferred_language\") @db.VarChar(10)\n\n  // Contact\n  phoneNumber String? @map(\"phone_number\") @db.VarChar(20)\n  email       String? @db.VarChar(255)\n\n  // Address\n  addressLine1 String? @map(\"address_line1\")\n  addressLine2 String? @map(\"address_line2\")\n  city         String? @db.VarChar(100)\n  state        String? @db.VarChar(100)\n  postalCode   String? @map(\"postal_code\") @db.VarChar(20)\n  country      String? @db.VarChar(2)\n\n  // Medical\n  bloodGroup       String? @map(\"blood_group\") @db.VarChar(10)\n  emergencyContact Json?   @map(\"emergency_contact\")\n  insuranceInfo    Json?   @map(\"insurance_info\")\n\n  // Registration Context\n  createdBy          String  @map(\"created_by\") @db.Uuid\n  createdAtFacility  String  @map(\"created_at_facility\") @db.Uuid\n  registrationSource String  @default(\"manual\") @map(\"registration_source\") @db.VarChar(20)\n  registrationNotes  String? @map(\"registration_notes\") @db.Text\n\n  // Update Context\n  updatedBy         String? @map(\"updated_by\") @db.Uuid\n  updatedAtFacility String? @map(\"updated_at_facility\") @db.Uuid\n\n  // System\n  status    String   @default(\"active\")\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  // Relations\n  appointments Appointment[]\n  encounters   Encounter[]\n  documents    PatientDocument[]\n  history      PatientHistory[]\n  consents     PatientConsent[]\n\n  @@index([tenantId, mrn], map: \"idx_patients_tenant_mrn\")\n  @@index([tenantId, nationalId], map: \"idx_patients_tenant_national_id\")\n  @@index([tenantId, firstName, lastName], map: \"idx_patients_tenant_name\")\n  @@index([tenantId, nationalIdType, issuingCountry], map: \"idx_patients_tenant_id_type_country\")\n  @@index([tenantId, createdBy], map: \"idx_patients_tenant_created_by\")\n  @@index([tenantId, createdAtFacility], map: \"idx_patients_tenant_created_facility\")\n  @@index([tenantId, registrationSource], map: \"idx_patients_tenant_reg_source\")\n  @@map(\"patients\")\n}\n\nmodel Appointment {\n  id                 String      @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId           String      @map(\"tenant_id\") @db.Uuid\n  patientId          String      @map(\"patient_id\") @db.Uuid\n  facilityId         String      @map(\"facility_id\") @db.Uuid\n  spaceId            String?     @map(\"space_id\") @db.Uuid\n  staffId            String?     @map(\"staff_id\") @db.Uuid\n  appointmentType    String      @map(\"appointment_type\")\n  status             String      @default(\"scheduled\")\n  startTime          DateTime    @map(\"start_time\") @db.Timestamptz(6)\n  endTime            DateTime    @map(\"end_time\") @db.Timestamptz(6)\n  duration           Int         @default(30)\n  notes              String?\n  visitType          String?     @map(\"visit_type\")\n  linkedEncounterId  String?     @map(\"linked_encounter_id\") @db.Uuid\n  seriesId           String?     @map(\"series_id\")\n  cancellationReason String?     @map(\"cancellation_reason\")\n  rescheduleReason   String?     @map(\"reschedule_reason\")\n  createdAt          DateTime    @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt          DateTime    @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  patient            Patient     @relation(fields: [patientId], references: [id], onDelete: Cascade)\n  encounters         Encounter[]\n\n  @@index([tenantId, patientId], map: \"idx_appointments_tenant_patient_id\")\n  @@index([tenantId, startTime], map: \"idx_appointments_tenant_start_time\")\n  @@index([tenantId, status], map: \"idx_appointments_tenant_status\")\n  @@index([tenantId, staffId], map: \"idx_appointments_tenant_staff_id\")\n  @@index([tenantId, facilityId], map: \"idx_appointments_tenant_facility_id\")\n  @@map(\"appointments\")\n}\n\nmodel Encounter {\n  id                   String       @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId             String       @map(\"tenant_id\") @db.Uuid\n  patientId            String       @map(\"patient_id\") @db.Uuid\n  facilityId           String       @map(\"facility_id\") @db.Uuid\n  appointmentId        String?      @map(\"appointment_id\") @db.Uuid\n  primaryStaffId       String       @map(\"primary_staff_id\") @db.Uuid\n  encounterClass       String       @default(\"AMB\") @map(\"encounter_class\")\n  status               String       @default(\"planned\")\n  priority             String       @default(\"routine\")\n  startTime            DateTime     @map(\"start_time\") @db.Timestamptz(6)\n  endTime              DateTime?    @map(\"end_time\") @db.Timestamptz(6)\n  encounterSource      String       @default(\"appointment\") @map(\"encounter_source\")\n  walkInDetails        Json?        @map(\"walk_in_details\")\n  chiefComplaint       String?      @map(\"chief_complaint\")\n  presentingSymptoms   String?      @map(\"presenting_symptoms\")\n  vitalSigns           Json?        @map(\"vital_signs\")\n  allergies            Json?        @default(\"[]\")\n  currentMedications   Json?        @default(\"[]\") @map(\"current_medications\")\n  medicalHistory       String?      @map(\"medical_history\")\n  socialHistory        String?      @map(\"social_history\")\n  familyHistory        String?      @map(\"family_history\")\n  notes                String?\n  dischargeDisposition String?      @map(\"discharge_disposition\")\n  followUpInstructions String?      @map(\"follow_up_instructions\")\n  createdAt            DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt            DateTime     @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  appointment          Appointment? @relation(fields: [appointmentId], references: [id])\n  patient              Patient      @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([tenantId, patientId], map: \"idx_encounters_tenant_patient_id\")\n  @@index([tenantId, startTime], map: \"idx_encounters_tenant_start_time\")\n  @@index([tenantId, status], map: \"idx_encounters_tenant_status\")\n  @@map(\"encounters\")\n}\n\nmodel PatientDocument {\n  id                 String    @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId           String    @map(\"tenant_id\") @db.Uuid\n  patientId          String    @map(\"patient_id\") @db.Uuid\n  documentType       String    @map(\"document_type\") @db.VarChar(50)\n  documentNumber     String    @map(\"document_number\") @db.VarChar(100)\n  issuingCountry     String    @map(\"issuing_country\") @db.VarChar(2)\n  issuingAuthority   String?   @map(\"issuing_authority\") @db.VarChar(200)\n  issueDate          DateTime? @map(\"issue_date\") @db.Date\n  expiryDate         DateTime? @map(\"expiry_date\") @db.Date\n  isPrimaryIdentity  Boolean   @default(false) @map(\"is_primary_identity\")\n  documentUrl        String?   @map(\"document_url\") @db.Text\n  verificationStatus String    @default(\"pending\") @map(\"verification_status\") @db.VarChar(20)\n  verifiedBy         String?   @map(\"verified_by\") @db.Uuid\n  verifiedAt         DateTime? @map(\"verified_at\") @db.Timestamptz(6)\n  verificationNotes  String?   @map(\"verification_notes\") @db.Text\n  metadata           Json?     @default(\"{}\")\n  createdAt          DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt          DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  patient            Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([tenantId, patientId], map: \"idx_patient_documents_tenant_patient\")\n  @@index([tenantId, documentType, documentNumber], map: \"idx_patient_documents_tenant_type_number\")\n  @@index([tenantId, verificationStatus], map: \"idx_patient_documents_tenant_verification\")\n  @@index([tenantId, isPrimaryIdentity], map: \"idx_patient_documents_tenant_primary\")\n  @@map(\"patient_documents\")\n}\n\nmodel PatientHistory {\n  id        String @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId  String @map(\"tenant_id\") @db.Uuid\n  patientId String @map(\"patient_id\") @db.Uuid\n\n  // What changed\n  fieldName  String  @map(\"field_name\") @db.VarChar(100)\n  oldValue   String? @map(\"old_value\") @db.Text\n  newValue   String? @map(\"new_value\") @db.Text\n  changeType String  @map(\"change_type\") @db.VarChar(20)\n\n  // Why changed\n  changeReason     String? @map(\"change_reason\") @db.Text\n  supportingDocUrl String? @map(\"supporting_doc_url\") @db.Text\n\n  // Who changed\n  changedBy  String  @map(\"changed_by\") @db.Uuid\n  approvedBy String? @map(\"approved_by\") @db.Uuid\n\n  // Where/When changed\n  changedAtFacility String?  @map(\"changed_at_facility\") @db.Uuid\n  changedAt         DateTime @default(now()) @map(\"changed_at\") @db.Timestamptz(6)\n\n  // Patient consent\n  patientConsent Boolean @default(false) @map(\"patient_consent\")\n  consentDocUrl  String? @map(\"consent_doc_url\") @db.Text\n\n  // Metadata\n  ipAddress String? @map(\"ip_address\") @db.VarChar(50)\n  userAgent String? @map(\"user_agent\") @db.Text\n\n  // Relations\n  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([tenantId, patientId, changedAt], map: \"idx_patient_history_patient_time\")\n  @@index([tenantId, fieldName], map: \"idx_patient_history_field\")\n  @@index([tenantId, changedBy], map: \"idx_patient_history_changed_by\")\n  @@index([tenantId, changeType], map: \"idx_patient_history_change_type\")\n  @@map(\"patient_history\")\n}\n\nmodel PatientConsent {\n  id        String @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId  String @map(\"tenant_id\") @db.Uuid\n  patientId String @map(\"patient_id\") @db.Uuid\n\n  // Consent Details\n  consentType     String  @map(\"consent_type\") @db.VarChar(100)\n  consentCategory String  @map(\"consent_category\") @db.VarChar(50)\n  consentStatus   String  @map(\"consent_status\") @db.VarChar(20)\n  consentScope    String? @map(\"consent_scope\") @db.Text\n\n  // Consent Metadata\n  purpose     String  @map(\"purpose\") @db.Text\n  description String? @map(\"description\") @db.Text\n  legalBasis  String? @map(\"legal_basis\") @db.VarChar(50)\n\n  // Validity\n  effectiveFrom  DateTime  @map(\"effective_from\") @db.Timestamptz(6)\n  effectiveUntil DateTime? @map(\"effective_until\") @db.Timestamptz(6)\n  isActive       Boolean   @default(true) @map(\"is_active\")\n\n  // Capture Method\n  captureMethod      String   @map(\"capture_method\") @db.VarChar(50)\n  capturedBy         String?  @map(\"captured_by\") @db.Uuid\n  capturedAt         DateTime @default(now()) @map(\"captured_at\") @db.Timestamptz(6)\n  capturedAtFacility String?  @map(\"captured_at_facility\") @db.Uuid\n\n  // Evidence\n  signatureUrl        String? @map(\"signature_url\") @db.Text\n  documentUrl         String? @map(\"document_url\") @db.Text\n  witnessedBy         String? @map(\"witnessed_by\") @db.Uuid\n  witnessSignatureUrl String? @map(\"witness_signature_url\") @db.Text\n\n  // Revocation\n  revokedAt        DateTime? @map(\"revoked_at\") @db.Timestamptz(6)\n  revokedBy        String?   @map(\"revoked_by\") @db.Uuid\n  revocationReason String?   @map(\"revocation_reason\") @db.Text\n  revocationMethod String?   @map(\"revocation_method\") @db.VarChar(50)\n\n  // Metadata\n  metadata         Json?   @default(\"{}\")\n  version          Int     @default(1)\n  parentConsentId  String? @map(\"parent_consent_id\") @db.Uuid\n  linkedEntityType String? @map(\"linked_entity_type\") @db.VarChar(50)\n  linkedEntityId   String? @map(\"linked_entity_id\") @db.Uuid\n\n  // System\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  // Relations\n  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([tenantId, patientId, isActive], map: \"idx_patient_consent_patient_active\")\n  @@index([tenantId, consentType, consentStatus], map: \"idx_patient_consent_type_status\")\n  @@index([tenantId, consentCategory], map: \"idx_patient_consent_category\")\n  @@index([tenantId, effectiveFrom, effectiveUntil], map: \"idx_patient_consent_validity\")\n  @@index([tenantId, linkedEntityType, linkedEntityId], map: \"idx_patient_consent_linked\")\n  @@map(\"patient_consents\")\n}\n\nmodel ConsentTemplate {\n  id       String @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  // Template Details\n  templateCode    String @unique @map(\"template_code\") @db.VarChar(100)\n  consentType     String @map(\"consent_type\") @db.VarChar(100)\n  consentCategory String @map(\"consent_category\") @db.VarChar(50)\n\n  // Content\n  title       Json  @map(\"title\")\n  description Json  @map(\"description\")\n  content     Json  @map(\"content\")\n  legalText   Json? @map(\"legal_text\")\n\n  // Configuration\n  isRequired      Boolean @default(false) @map(\"is_required\")\n  requiresWitness Boolean @default(false) @map(\"requires_witness\")\n  validityDays    Int?    @map(\"validity_days\")\n  autoRenew       Boolean @default(false) @map(\"auto_renew\")\n\n  // Versioning\n  version    Int     @default(1)\n  status     String  @default(\"active\") @db.VarChar(20)\n  supersedes String? @map(\"supersedes\") @db.Uuid\n\n  // Metadata\n  metadata  Json?    @default(\"{}\")\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@index([tenantId, consentType], map: \"idx_consent_template_type\")\n  @@index([tenantId, consentCategory], map: \"idx_consent_template_category\")\n  @@index([tenantId, status], map: \"idx_consent_template_status\")\n  @@map(\"consent_templates\")\n}\n",
  "inlineSchemaHash": "eb066554aedc3af47f843b74c56b65508735441691782fc848304bf70d50e4c7",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Patient\":{\"dbName\":\"patients\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mrn\",\"dbName\":\"mrn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nationalId\",\"dbName\":\"national_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nationalIdType\",\"dbName\":\"national_id_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuingCountry\",\"dbName\":\"issuing_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstName\",\"dbName\":\"first_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastName\",\"dbName\":\"last_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"middleName\",\"dbName\":\"middle_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dateOfBirth\",\"dbName\":\"date_of_birth\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maritalStatus\",\"dbName\":\"marital_status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nationality\",\"dbName\":\"nationality\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preferredLanguage\",\"dbName\":\"preferred_language\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"en\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phoneNumber\",\"dbName\":\"phone_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addressLine1\",\"dbName\":\"address_line1\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addressLine2\",\"dbName\":\"address_line2\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postalCode\",\"dbName\":\"postal_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bloodGroup\",\"dbName\":\"blood_group\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyContact\",\"dbName\":\"emergency_contact\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"insuranceInfo\",\"dbName\":\"insurance_info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"dbName\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAtFacility\",\"dbName\":\"created_at_facility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"registrationSource\",\"dbName\":\"registration_source\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"manual\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"registrationNotes\",\"dbName\":\"registration_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedBy\",\"dbName\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAtFacility\",\"dbName\":\"updated_at_facility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToPatient\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"encounters\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Encounter\",\"relationName\":\"EncounterToPatient\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientDocument\",\"relationName\":\"PatientToPatientDocument\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"history\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientHistory\",\"relationName\":\"PatientToPatientHistory\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientConsent\",\"relationName\":\"PatientToPatientConsent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Appointment\":{\"dbName\":\"appointments\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"dbName\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityId\",\"dbName\":\"facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spaceId\",\"dbName\":\"space_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffId\",\"dbName\":\"staff_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointmentType\",\"dbName\":\"appointment_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"scheduled\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"dbName\":\"start_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"dbName\":\"end_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitType\",\"dbName\":\"visit_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"linkedEncounterId\",\"dbName\":\"linked_encounter_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seriesId\",\"dbName\":\"series_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancellationReason\",\"dbName\":\"cancellation_reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rescheduleReason\",\"dbName\":\"reschedule_reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"AppointmentToPatient\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"encounters\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Encounter\",\"relationName\":\"AppointmentToEncounter\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Encounter\":{\"dbName\":\"encounters\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"dbName\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityId\",\"dbName\":\"facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointmentId\",\"dbName\":\"appointment_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"primaryStaffId\",\"dbName\":\"primary_staff_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"encounterClass\",\"dbName\":\"encounter_class\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"AMB\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"planned\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"routine\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"dbName\":\"start_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"dbName\":\"end_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"encounterSource\",\"dbName\":\"encounter_source\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"appointment\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walkInDetails\",\"dbName\":\"walk_in_details\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chiefComplaint\",\"dbName\":\"chief_complaint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"presentingSymptoms\",\"dbName\":\"presenting_symptoms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalSigns\",\"dbName\":\"vital_signs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allergies\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentMedications\",\"dbName\":\"current_medications\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicalHistory\",\"dbName\":\"medical_history\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"socialHistory\",\"dbName\":\"social_history\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"familyHistory\",\"dbName\":\"family_history\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dischargeDisposition\",\"dbName\":\"discharge_disposition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"followUpInstructions\",\"dbName\":\"follow_up_instructions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"appointment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToEncounter\",\"relationFromFields\":[\"appointmentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"EncounterToPatient\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PatientDocument\":{\"dbName\":\"patient_documents\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"dbName\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentType\",\"dbName\":\"document_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentNumber\",\"dbName\":\"document_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuingCountry\",\"dbName\":\"issuing_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuingAuthority\",\"dbName\":\"issuing_authority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issueDate\",\"dbName\":\"issue_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiryDate\",\"dbName\":\"expiry_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPrimaryIdentity\",\"dbName\":\"is_primary_identity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"dbName\":\"document_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationStatus\",\"dbName\":\"verification_status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedBy\",\"dbName\":\"verified_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"dbName\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationNotes\",\"dbName\":\"verification_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"PatientToPatientDocument\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PatientHistory\":{\"dbName\":\"patient_history\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"dbName\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fieldName\",\"dbName\":\"field_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oldValue\",\"dbName\":\"old_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newValue\",\"dbName\":\"new_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changeType\",\"dbName\":\"change_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changeReason\",\"dbName\":\"change_reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportingDocUrl\",\"dbName\":\"supporting_doc_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedBy\",\"dbName\":\"changed_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvedBy\",\"dbName\":\"approved_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedAtFacility\",\"dbName\":\"changed_at_facility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedAt\",\"dbName\":\"changed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientConsent\",\"dbName\":\"patient_consent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentDocUrl\",\"dbName\":\"consent_doc_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"dbName\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"PatientToPatientHistory\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PatientConsent\":{\"dbName\":\"patient_consents\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"dbName\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentType\",\"dbName\":\"consent_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentCategory\",\"dbName\":\"consent_category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentStatus\",\"dbName\":\"consent_status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentScope\",\"dbName\":\"consent_scope\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"dbName\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"dbName\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"legalBasis\",\"dbName\":\"legal_basis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveFrom\",\"dbName\":\"effective_from\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveUntil\",\"dbName\":\"effective_until\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"captureMethod\",\"dbName\":\"capture_method\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"capturedBy\",\"dbName\":\"captured_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"capturedAt\",\"dbName\":\"captured_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"capturedAtFacility\",\"dbName\":\"captured_at_facility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signatureUrl\",\"dbName\":\"signature_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"dbName\":\"document_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"witnessedBy\",\"dbName\":\"witnessed_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"witnessSignatureUrl\",\"dbName\":\"witness_signature_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revokedAt\",\"dbName\":\"revoked_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revokedBy\",\"dbName\":\"revoked_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revocationReason\",\"dbName\":\"revocation_reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revocationMethod\",\"dbName\":\"revocation_method\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentConsentId\",\"dbName\":\"parent_consent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"linkedEntityType\",\"dbName\":\"linked_entity_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"linkedEntityId\",\"dbName\":\"linked_entity_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"PatientToPatientConsent\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ConsentTemplate\":{\"dbName\":\"consent_templates\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"templateCode\",\"dbName\":\"template_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentType\",\"dbName\":\"consent_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentCategory\",\"dbName\":\"consent_category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"dbName\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"dbName\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"dbName\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"legalText\",\"dbName\":\"legal_text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRequired\",\"dbName\":\"is_required\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresWitness\",\"dbName\":\"requires_witness\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validityDays\",\"dbName\":\"validity_days\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoRenew\",\"dbName\":\"auto_renew\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supersedes\",\"dbName\":\"supersedes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    CLINICAL_DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['CLINICAL_DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.CLINICAL_DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

