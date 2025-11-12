
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
  title: 'title',
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  displayName: 'displayName',
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
  encounterNumber: 'encounterNumber',
  tenantId: 'tenantId',
  patientId: 'patientId',
  facilityId: 'facilityId',
  appointmentId: 'appointmentId',
  primaryStaffId: 'primaryStaffId',
  encounterClass: 'encounterClass',
  encounterType: 'encounterType',
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

exports.Prisma.TriageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  triageStaffId: 'triageStaffId',
  triageLevel: 'triageLevel',
  chiefComplaintsAndHPI: 'chiefComplaintsAndHPI',
  vitalSigns: 'vitalSigns',
  painScore: 'painScore',
  allergies: 'allergies',
  currentMedications: 'currentMedications',
  triageNotes: 'triageNotes',
  triageTime: 'triageTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClinicalNoteScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  noteType: 'noteType',
  language: 'language',
  title: 'title',
  status: 'status',
  version: 'version',
  authorStaffId: 'authorStaffId',
  coSignStaffId: 'coSignStaffId',
  signedAt: 'signedAt',
  coSignedAt: 'coSignedAt',
  amendmentReason: 'amendmentReason',
  supersededBy: 'supersededBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClinicalNoteSectionScalarFieldEnum = {
  id: 'id',
  noteId: 'noteId',
  sectionCode: 'sectionCode',
  sectionName: 'sectionName',
  sortOrder: 'sortOrder',
  content: 'content',
  isEmpty: 'isEmpty',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EncounterDiagnosisScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  icdCode: 'icdCode',
  icdVersion: 'icdVersion',
  diagnosisName: 'diagnosisName',
  diagnosisNameAr: 'diagnosisNameAr',
  diagnosisType: 'diagnosisType',
  diagnosisRank: 'diagnosisRank',
  isPresentOnAdmission: 'isPresentOnAdmission',
  isChronic: 'isChronic',
  onsetDate: 'onsetDate',
  clinicalNotes: 'clinicalNotes',
  diagnosedBy: 'diagnosedBy',
  diagnosedAt: 'diagnosedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClinicalOrderScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  orderType: 'orderType',
  orderCode: 'orderCode',
  codeSystem: 'codeSystem',
  orderName: 'orderName',
  orderNameAr: 'orderNameAr',
  priority: 'priority',
  status: 'status',
  clinicalIndication: 'clinicalIndication',
  specialInstructions: 'specialInstructions',
  resultStatus: 'resultStatus',
  resultData: 'resultData',
  resultNotes: 'resultNotes',
  resultedAt: 'resultedAt',
  orderedBy: 'orderedBy',
  orderedAt: 'orderedAt',
  performedBy: 'performedBy',
  performedAt: 'performedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PrescriptionOrderScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  drugCode: 'drugCode',
  codeSystem: 'codeSystem',
  drugName: 'drugName',
  drugNameAr: 'drugNameAr',
  genericName: 'genericName',
  dosage: 'dosage',
  route: 'route',
  frequency: 'frequency',
  duration: 'duration',
  quantity: 'quantity',
  refills: 'refills',
  instructions: 'instructions',
  instructionsAr: 'instructionsAr',
  status: 'status',
  prescribedBy: 'prescribedBy',
  prescribedAt: 'prescribedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiNoteSuggestionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  modelVersion: 'modelVersion',
  suggestionType: 'suggestionType',
  suggestedContent: 'suggestedContent',
  confidenceScore: 'confidenceScore',
  status: 'status',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  createdAt: 'createdAt'
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

exports.Prisma.StaffScheduleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  staffId: 'staffId',
  facilityId: 'facilityId',
  employeeId: 'employeeId',
  staffDisplayName: 'staffDisplayName',
  staffType: 'staffType',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable',
  scheduleType: 'scheduleType',
  notes: 'notes',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.EquipmentScheduleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  equipmentId: 'equipmentId',
  facilityId: 'facilityId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable',
  maintenanceType: 'maintenanceType',
  notes: 'notes',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.SpaceScheduleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  spaceId: 'spaceId',
  facilityId: 'facilityId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable',
  blockReason: 'blockReason',
  notes: 'notes',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ResourceBlockScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  facilityId: 'facilityId',
  blockType: 'blockType',
  startDatetime: 'startDatetime',
  endDatetime: 'endDatetime',
  isAvailable: 'isAvailable',
  reason: 'reason',
  approvalStatus: 'approvalStatus',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.AppointmentResourceRequirementScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  appointmentType: 'appointmentType',
  resourceType: 'resourceType',
  resourceRole: 'resourceRole',
  resourceId: 'resourceId',
  isRequired: 'isRequired',
  minQuantity: 'minQuantity',
  maxQuantity: 'maxQuantity',
  minDurationMinutes: 'minDurationMinutes',
  maxDurationMinutes: 'maxDurationMinutes',
  preparationTimeMinutes: 'preparationTimeMinutes',
  cleanupTimeMinutes: 'cleanupTimeMinutes',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.AppointmentResourceScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  appointmentId: 'appointmentId',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  resourceRole: 'resourceRole',
  startTime: 'startTime',
  endTime: 'endTime',
  preparationStart: 'preparationStart',
  cleanupEnd: 'cleanupEnd',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.AppointmentSeriesScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  seriesName: 'seriesName',
  appointmentType: 'appointmentType',
  recurrencePattern: 'recurrencePattern',
  recurrenceRule: 'recurrenceRule',
  startDate: 'startDate',
  endDate: 'endDate',
  totalOccurrences: 'totalOccurrences',
  occurrencesCreated: 'occurrencesCreated',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
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
  Triage: 'Triage',
  ClinicalNote: 'ClinicalNote',
  ClinicalNoteSection: 'ClinicalNoteSection',
  EncounterDiagnosis: 'EncounterDiagnosis',
  ClinicalOrder: 'ClinicalOrder',
  PrescriptionOrder: 'PrescriptionOrder',
  AiNoteSuggestion: 'AiNoteSuggestion',
  PatientDocument: 'PatientDocument',
  PatientHistory: 'PatientHistory',
  PatientConsent: 'PatientConsent',
  ConsentTemplate: 'ConsentTemplate',
  StaffSchedule: 'StaffSchedule',
  EquipmentSchedule: 'EquipmentSchedule',
  SpaceSchedule: 'SpaceSchedule',
  ResourceBlock: 'ResourceBlock',
  AppointmentResourceRequirement: 'AppointmentResourceRequirement',
  AppointmentResource: 'AppointmentResource',
  AppointmentSeries: 'AppointmentSeries'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
