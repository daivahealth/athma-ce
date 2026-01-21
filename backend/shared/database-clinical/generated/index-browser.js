
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

exports.Prisma.ChecklistTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  version: 'version',
  status: 'status',
  applicableToInpatient: 'applicableToInpatient',
  applicableToOutpatient: 'applicableToOutpatient',
  applicableEncounterTypes: 'applicableEncounterTypes',
  applicableDepartments: 'applicableDepartments',
  requiresAllItems: 'requiresAllItems',
  minimumCompletionPercent: 'minimumCompletionPercent',
  requiresVerification: 'requiresVerification',
  verificationRoles: 'verificationRoles',
  allowSelfVerification: 'allowSelfVerification',
  autoCreateEnabled: 'autoCreateEnabled',
  autoCreateOn: 'autoCreateOn',
  autoCreateConditions: 'autoCreateConditions',
  autoCreateDueHours: 'autoCreateDueHours',
  allowedRoles: 'allowedRoles',
  estimatedMinutes: 'estimatedMinutes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ChecklistTemplateItemScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  templateId: 'templateId',
  itemKey: 'itemKey',
  itemType: 'itemType',
  label: 'label',
  helpText: 'helpText',
  placeholder: 'placeholder',
  sectionName: 'sectionName',
  sortOrder: 'sortOrder',
  isRequired: 'isRequired',
  validationRules: 'validationRules',
  options: 'options',
  showIfCondition: 'showIfCondition',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChecklistInstanceScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  templateId: 'templateId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  admissionId: 'admissionId',
  careChannelId: 'careChannelId',
  channelMessageId: 'channelMessageId',
  context: 'context',
  status: 'status',
  completionPercent: 'completionPercent',
  dueAt: 'dueAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  verifiedAt: 'verifiedAt',
  completedBy: 'completedBy',
  verifiedBy: 'verifiedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.ChecklistInstanceResponseScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  instanceId: 'instanceId',
  templateItemId: 'templateItemId',
  valueBoolean: 'valueBoolean',
  valueText: 'valueText',
  valueNumber: 'valueNumber',
  valueDate: 'valueDate',
  valueDatetime: 'valueDatetime',
  valueTime: 'valueTime',
  valueJson: 'valueJson',
  answeredBy: 'answeredBy',
  answeredAt: 'answeredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

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

exports.Prisma.EncounterNoteScalarFieldEnum = {
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

exports.Prisma.EncounterNoteSectionScalarFieldEnum = {
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

exports.Prisma.MedicationMasterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  medicationName: 'medicationName',
  genericName: 'genericName',
  brandName: 'brandName',
  ndcCode: 'ndcCode',
  atcCode: 'atcCode',
  localCode: 'localCode',
  dosageForm: 'dosageForm',
  strength: 'strength',
  route: 'route',
  manufacturer: 'manufacturer',
  drugClass: 'drugClass',
  therapeuticClass: 'therapeuticClass',
  controlledSubstance: 'controlledSubstance',
  controlledClass: 'controlledClass',
  requiresPrescription: 'requiresPrescription',
  defaultFrequency: 'defaultFrequency',
  defaultDuration: 'defaultDuration',
  contraindications: 'contraindications',
  commonSideEffects: 'commonSideEffects',
  drugInteractions: 'drugInteractions',
  storageRequirements: 'storageRequirements',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LabTestMasterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  testName: 'testName',
  loincCode: 'loincCode',
  cptCode: 'cptCode',
  localCode: 'localCode',
  billingCode: 'billingCode',
  billingCodeType: 'billingCodeType',
  billingDescription: 'billingDescription',
  testCategory: 'testCategory',
  testSubcategory: 'testSubcategory',
  specimenType: 'specimenType',
  collectionMethod: 'collectionMethod',
  fastingRequired: 'fastingRequired',
  fastingDurationHours: 'fastingDurationHours',
  preparationInstructions: 'preparationInstructions',
  normalRangeMale: 'normalRangeMale',
  normalRangeFemale: 'normalRangeFemale',
  normalRangePediatric: 'normalRangePediatric',
  units: 'units',
  methodology: 'methodology',
  turnaroundTimeHours: 'turnaroundTimeHours',
  referenceLab: 'referenceLab',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ImagingStudyMasterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  studyName: 'studyName',
  cptCode: 'cptCode',
  localCode: 'localCode',
  billingCode: 'billingCode',
  billingCodeType: 'billingCodeType',
  billingDescription: 'billingDescription',
  modality: 'modality',
  bodyPart: 'bodyPart',
  studyCategory: 'studyCategory',
  contrastRequired: 'contrastRequired',
  contrastType: 'contrastType',
  preparationInstructions: 'preparationInstructions',
  positioningInstructions: 'positioningInstructions',
  contraindications: 'contraindications',
  radiationDose: 'radiationDose',
  estimatedDurationMinutes: 'estimatedDurationMinutes',
  facilityRequirements: 'facilityRequirements',
  equipmentRequirements: 'equipmentRequirements',
  radiologistRequired: 'radiologistRequired',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProcedureMasterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  procedureName: 'procedureName',
  cptCode: 'cptCode',
  icd10PcsCode: 'icd10PcsCode',
  localCode: 'localCode',
  billingCode: 'billingCode',
  billingCodeType: 'billingCodeType',
  billingDescription: 'billingDescription',
  procedureCategory: 'procedureCategory',
  bodySystem: 'bodySystem',
  procedureType: 'procedureType',
  anesthesiaType: 'anesthesiaType',
  facilityRequired: 'facilityRequired',
  estimatedDurationMinutes: 'estimatedDurationMinutes',
  preparationInstructions: 'preparationInstructions',
  postProcedureInstructions: 'postProcedureInstructions',
  risksAndComplications: 'risksAndComplications',
  contraindications: 'contraindications',
  consentRequired: 'consentRequired',
  consentType: 'consentType',
  preProcedureRequirements: 'preProcedureRequirements',
  postProcedureMonitoring: 'postProcedureMonitoring',
  recoveryTimeHours: 'recoveryTimeHours',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiagnosisVersionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  codeSet: 'codeSet',
  versionLabel: 'versionLabel',
  releaseDate: 'releaseDate',
  description: 'description',
  importStatus: 'importStatus',
  importNotes: 'importNotes',
  sourceUrl: 'sourceUrl',
  checksum: 'checksum',
  totalCodes: 'totalCodes',
  importedBy: 'importedBy',
  importedAt: 'importedAt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiagnosisMasterScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  versionId: 'versionId',
  code: 'code',
  codeType: 'codeType',
  shortDescription: 'shortDescription',
  description: 'description',
  chapter: 'chapter',
  block: 'block',
  category: 'category',
  subcategory: 'subcategory',
  clinicalConcepts: 'clinicalConcepts',
  synonyms: 'synonyms',
  searchTerms: 'searchTerms',
  genderRestriction: 'genderRestriction',
  ageRange: 'ageRange',
  isBillable: 'isBillable',
  isActive: 'isActive',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NoteTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  specialtyId: 'specialtyId',
  name: 'name',
  description: 'description',
  templateType: 'templateType',
  status: 'status',
  currentVersion: 'currentVersion',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NoteTemplateVersionScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  version: 'version',
  schema: 'schema',
  changeLog: 'changeLog',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ValueSetScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  version: 'version',
  status: 'status',
  isSystem: 'isSystem',
  isExtensible: 'isExtensible',
  source: 'source',
  sourceUrl: 'sourceUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ValueSetConceptScalarFieldEnum = {
  id: 'id',
  valueSetId: 'valueSetId',
  valueSetCode: 'valueSetCode',
  code: 'code',
  display: 'display',
  definition: 'definition',
  systemCode: 'systemCode',
  parentId: 'parentId',
  sortOrder: 'sortOrder',
  isDefault: 'isDefault',
  status: 'status',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ValueSetConceptTranslationScalarFieldEnum = {
  id: 'id',
  conceptId: 'conceptId',
  languageCode: 'languageCode',
  display: 'display',
  definition: 'definition',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TenantValueSetOverrideScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  valueSetId: 'valueSetId',
  conceptId: 'conceptId',
  overrideType: 'overrideType',
  customDisplay: 'customDisplay',
  customMetadata: 'customMetadata',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ValueSetHistoryScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  oldValues: 'oldValues',
  newValues: 'newValues',
  changedBy: 'changedBy',
  changedAt: 'changedAt',
  changeReason: 'changeReason'
};

exports.Prisma.PackageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  description: 'description',
  packageType: 'packageType',
  genderRestriction: 'genderRestriction',
  minAgeYears: 'minAgeYears',
  maxAgeYears: 'maxAgeYears',
  careSetting: 'careSetting',
  validityDays: 'validityDays',
  isActive: 'isActive',
  isPublic: 'isPublic',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PackageItemScalarFieldEnum = {
  id: 'id',
  packageId: 'packageId',
  catalogType: 'catalogType',
  catalogId: 'catalogId',
  quantity: 'quantity',
  isMandatory: 'isMandatory',
  clinicalOnly: 'clinicalOnly',
  groupName: 'groupName',
  sortOrder: 'sortOrder',
  maxUsesPerPackage: 'maxUsesPerPackage',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdministrativeServiceScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  serviceName: 'serviceName',
  serviceCode: 'serviceCode',
  billingCode: 'billingCode',
  billingCodeType: 'billingCodeType',
  billingDescription: 'billingDescription',
  serviceCategory: 'serviceCategory',
  serviceType: 'serviceType',
  department: 'department',
  careSetting: 'careSetting',
  description: 'description',
  durationMinutes: 'durationMinutes',
  requiresStaff: 'requiresStaff',
  staffType: 'staffType',
  requiresRoom: 'requiresRoom',
  roomType: 'roomType',
  isTaxable: 'isTaxable',
  isActive: 'isActive',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VitalSignsTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  templateCode: 'templateCode',
  version: 'version',
  name: 'name',
  description: 'description',
  careSetting: 'careSetting',
  ageGroup: 'ageGroup',
  specialties: 'specialties',
  groups: 'groups',
  isActive: 'isActive',
  isDefault: 'isDefault',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InpatientAdmissionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  admissionNumber: 'admissionNumber',
  admissionDate: 'admissionDate',
  admissionType: 'admissionType',
  admissionSource: 'admissionSource',
  attendingPhysicianId: 'attendingPhysicianId',
  attendingPhysicianDisplayName: 'attendingPhysicianDisplayName',
  consultingPhysicians: 'consultingPhysicians',
  primaryNurseId: 'primaryNurseId',
  currentWardId: 'currentWardId',
  currentWardName: 'currentWardName',
  currentSpaceId: 'currentSpaceId',
  currentBedId: 'currentBedId',
  currentBedNumber: 'currentBedNumber',
  admissionStatus: 'admissionStatus',
  dischargeStatus: 'dischargeStatus',
  acuity: 'acuity',
  boardFlags: 'boardFlags',
  clinicalAlerts: 'clinicalAlerts',
  isolationType: 'isolationType',
  fallRiskScore: 'fallRiskScore',
  lastVitalsAt: 'lastVitalsAt',
  nextVitalsAt: 'nextVitalsAt',
  vitalsFrequency: 'vitalsFrequency',
  expectedDischargeDate: 'expectedDischargeDate',
  dischargePlannedBy: 'dischargePlannedBy',
  dischargeNotes: 'dischargeNotes',
  actualDischargeDate: 'actualDischargeDate',
  dischargeType: 'dischargeType',
  dischargeDestination: 'dischargeDestination',
  dischargedBy: 'dischargedBy',
  insuranceAuthNumber: 'insuranceAuthNumber',
  insuranceAuthDate: 'insuranceAuthDate',
  estimatedCost: 'estimatedCost',
  lengthOfStayDays: 'lengthOfStayDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.BedAssignmentScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  bedId: 'bedId',
  wardId: 'wardId',
  spaceId: 'spaceId',
  assignedAt: 'assignedAt',
  releasedAt: 'releasedAt',
  isTransfer: 'isTransfer',
  transferReason: 'transferReason',
  transferType: 'transferType',
  assignedBy: 'assignedBy',
  releasedBy: 'releasedBy',
  notes: 'notes',
  cleaningRequired: 'cleaningRequired',
  cleaningCompletedAt: 'cleaningCompletedAt',
  cleaningCompletedBy: 'cleaningCompletedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InpatientAssessmentScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  assessmentType: 'assessmentType',
  assessmentDate: 'assessmentDate',
  vitalSigns: 'vitalSigns',
  assessmentData: 'assessmentData',
  abnormalFindings: 'abnormalFindings',
  interventions: 'interventions',
  assessedBy: 'assessedBy',
  reviewedBy: 'reviewedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  planTitle: 'planTitle',
  nursingDiagnosis: 'nursingDiagnosis',
  goals: 'goals',
  interventions: 'interventions',
  priority: 'priority',
  status: 'status',
  startDate: 'startDate',
  targetDate: 'targetDate',
  endDate: 'endDate',
  evaluation: 'evaluation',
  outcomeStatus: 'outcomeStatus',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NursingRoundScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  roundType: 'roundType',
  roundDate: 'roundDate',
  shiftType: 'shiftType',
  checklistData: 'checklistData',
  findings: 'findings',
  issuesIdentified: 'issuesIdentified',
  actionsPerformed: 'actionsPerformed',
  performedBy: 'performedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IntakeOutputScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  recordDate: 'recordDate',
  recordType: 'recordType',
  shiftType: 'shiftType',
  intakeType: 'intakeType',
  intakeAmount: 'intakeAmount',
  intakeDescription: 'intakeDescription',
  outputType: 'outputType',
  outputAmount: 'outputAmount',
  outputDescription: 'outputDescription',
  notes: 'notes',
  recordedBy: 'recordedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InpatientDischargeScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  admissionDate: 'admissionDate',
  status: 'status',
  initiatedBy: 'initiatedBy',
  initiatedAt: 'initiatedAt',
  targetDischargeDate: 'targetDischargeDate',
  targetDischargeTime: 'targetDischargeTime',
  checklistInstanceId: 'checklistInstanceId',
  checklistCompletedAt: 'checklistCompletedAt',
  checklistCompletedBy: 'checklistCompletedBy',
  checklistVerifiedAt: 'checklistVerifiedAt',
  checklistVerifiedBy: 'checklistVerifiedBy',
  readyMarkedAt: 'readyMarkedAt',
  readyMarkedBy: 'readyMarkedBy',
  readyRemarks: 'readyRemarks',
  approvalRequired: 'approvalRequired',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  approvalRemarks: 'approvalRemarks',
  actualDischargeDate: 'actualDischargeDate',
  actualDischargeTime: 'actualDischargeTime',
  dischargedBy: 'dischargedBy',
  dischargeType: 'dischargeType',
  dischargeDestination: 'dischargeDestination',
  dischargeDisposition: 'dischargeDisposition',
  dischargeSummaryId: 'dischargeSummaryId',
  finalDiagnosis: 'finalDiagnosis',
  dischargeMedications: 'dischargeMedications',
  followUpInstructions: 'followUpInstructions',
  dietInstructions: 'dietInstructions',
  activityRestrictions: 'activityRestrictions',
  followUpAppointments: 'followUpAppointments',
  homeHealthOrdered: 'homeHealthOrdered',
  homeHealthAgency: 'homeHealthAgency',
  dmeOrdered: 'dmeOrdered',
  dmeDescription: 'dmeDescription',
  transportArranged: 'transportArranged',
  transportMode: 'transportMode',
  educationProvided: 'educationProvided',
  educationTopics: 'educationTopics',
  educationMaterials: 'educationMaterials',
  billingCleared: 'billingCleared',
  insuranceNotified: 'insuranceNotified',
  medicalRecordsComplete: 'medicalRecordsComplete',
  belongingsReturned: 'belongingsReturned',
  cancelledAt: 'cancelledAt',
  cancelledBy: 'cancelledBy',
  cancellationReason: 'cancellationReason',
  lengthOfStayDays: 'lengthOfStayDays',
  planningDurationHours: 'planningDurationHours',
  internalNotes: 'internalNotes',
  patientNotes: 'patientNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ClinicalDischargeSummaryScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  admissionId: 'admissionId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  status: 'status',
  currentVersionId: 'currentVersionId',
  initiatedAt: 'initiatedAt',
  initiatedBy: 'initiatedBy',
  finalizedAt: 'finalizedAt',
  finalizedBy: 'finalizedBy',
  signedAt: 'signedAt',
  signedBy: 'signedBy',
  lockedAt: 'lockedAt',
  isLocked: 'isLocked',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ClinicalDischargeSummaryVersionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  dischargeSummaryId: 'dischargeSummaryId',
  versionNo: 'versionNo',
  data: 'data',
  changeReason: 'changeReason',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  amendedFromVersionId: 'amendedFromVersionId'
};

exports.Prisma.DischargeChecklistScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  medicalClearance: 'medicalClearance',
  medicalClearedBy: 'medicalClearedBy',
  medicalClearedAt: 'medicalClearedAt',
  medicationsReconciled: 'medicationsReconciled',
  dischargePrescriptionsIssued: 'dischargePrescriptionsIssued',
  followUpAppointmentScheduled: 'followUpAppointmentScheduled',
  followUpAppointmentDate: 'followUpAppointmentDate',
  followUpPhysician: 'followUpPhysician',
  dischargInstructionsProvided: 'dischargInstructionsProvided',
  patientEducationCompleted: 'patientEducationCompleted',
  educationTopics: 'educationTopics',
  dmeOrdered: 'dmeOrdered',
  dmeDescription: 'dmeDescription',
  homeHealthOrdered: 'homeHealthOrdered',
  homeHealthAgency: 'homeHealthAgency',
  transportationArranged: 'transportationArranged',
  transportationMode: 'transportationMode',
  billingCleared: 'billingCleared',
  insuranceNotified: 'insuranceNotified',
  medicalRecordsCompleted: 'medicalRecordsCompleted',
  readyForDischarge: 'readyForDischarge',
  dischargeCoordinator: 'dischargeCoordinator',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.InpatientEventScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  admissionId: 'admissionId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  eventType: 'eventType',
  fromAdmissionStatus: 'fromAdmissionStatus',
  toAdmissionStatus: 'toAdmissionStatus',
  fromDischargeStatus: 'fromDischargeStatus',
  toDischargeStatus: 'toDischargeStatus',
  fromAcuity: 'fromAcuity',
  toAcuity: 'toAcuity',
  fromWardId: 'fromWardId',
  fromSpaceId: 'fromSpaceId',
  fromBedId: 'fromBedId',
  toWardId: 'toWardId',
  toSpaceId: 'toSpaceId',
  toBedId: 'toBedId',
  reason: 'reason',
  metadata: 'metadata',
  performedBy: 'performedBy',
  performedAt: 'performedAt'
};

exports.Prisma.CareChannelScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  admissionId: 'admissionId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  channelName: 'channelName',
  status: 'status',
  activatedAt: 'activatedAt',
  closedAt: 'closedAt',
  closedBy: 'closedBy',
  closureReason: 'closureReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.CareChannelMemberScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  channelId: 'channelId',
  staffId: 'staffId',
  memberRole: 'memberRole',
  addedAt: 'addedAt',
  removedAt: 'removedAt',
  addedBy: 'addedBy',
  removedBy: 'removedBy',
  removalReason: 'removalReason',
  notificationsEnabled: 'notificationsEnabled',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChannelMessageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  facilityId: 'facilityId',
  channelId: 'channelId',
  messageType: 'messageType',
  messageSubtype: 'messageSubtype',
  bodyText: 'bodyText',
  payloadJson: 'payloadJson',
  linkedEntityType: 'linkedEntityType',
  linkedEntityId: 'linkedEntityId',
  checklistInstanceId: 'checklistInstanceId',
  visibility: 'visibility',
  priority: 'priority',
  authorStaffId: 'authorStaffId',
  isSystemMessage: 'isSystemMessage',
  idempotencyKey: 'idempotencyKey',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
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
exports.ChecklistCategory = exports.$Enums.ChecklistCategory = {
  DISCHARGE: 'DISCHARGE',
  SURGERY: 'SURGERY',
  PRE_OPERATIVE: 'PRE_OPERATIVE',
  POST_OPERATIVE: 'POST_OPERATIVE',
  ADMISSION: 'ADMISSION',
  TRANSFER: 'TRANSFER',
  OUTPATIENT_VISIT: 'OUTPATIENT_VISIT',
  PROCEDURE: 'PROCEDURE',
  EMERGENCY: 'EMERGENCY',
  ANESTHESIA: 'ANESTHESIA',
  INFECTION_CONTROL: 'INFECTION_CONTROL',
  FALL_PREVENTION: 'FALL_PREVENTION',
  PAIN_MANAGEMENT: 'PAIN_MANAGEMENT',
  WOUND_CARE: 'WOUND_CARE',
  CUSTOM: 'CUSTOM'
};

exports.ChecklistTemplateStatus = exports.$Enums.ChecklistTemplateStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  DEPRECATED: 'DEPRECATED',
  ARCHIVED: 'ARCHIVED'
};

exports.ChecklistItemType = exports.$Enums.ChecklistItemType = {
  BOOLEAN: 'BOOLEAN',
  TEXT: 'TEXT',
  TEXT_AREA: 'TEXT_AREA',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  TIME: 'TIME',
  NUMBER: 'NUMBER',
  SELECT_SINGLE: 'SELECT_SINGLE',
  SELECT_MULTIPLE: 'SELECT_MULTIPLE',
  STAFF_SELECTOR: 'STAFF_SELECTOR',
  SECTION_HEADER: 'SECTION_HEADER',
  FILE_UPLOAD: 'FILE_UPLOAD'
};

exports.ChecklistContext = exports.$Enums.ChecklistContext = {
  INPATIENT_ADMISSION: 'INPATIENT_ADMISSION',
  OUTPATIENT_ENCOUNTER: 'OUTPATIENT_ENCOUNTER',
  STANDALONE: 'STANDALONE',
  CARE_CHANNEL: 'CARE_CHANNEL'
};

exports.ChecklistInstanceStatus = exports.$Enums.ChecklistInstanceStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  VERIFIED: 'VERIFIED',
  CANCELLED: 'CANCELLED'
};

exports.NoteTemplateType = exports.$Enums.NoteTemplateType = {
  GENERAL: 'GENERAL',
  SOAP: 'SOAP',
  DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
  PROGRESS_NOTE: 'PROGRESS_NOTE',
  ADMISSION_NOTE: 'ADMISSION_NOTE',
  CONSULTATION: 'CONSULTATION',
  OPERATIVE_NOTE: 'OPERATIVE_NOTE',
  PROCEDURE_NOTE: 'PROCEDURE_NOTE',
  PHYSICAL_THERAPY: 'PHYSICAL_THERAPY',
  OCCUPATIONAL_THERAPY: 'OCCUPATIONAL_THERAPY',
  NURSING_NOTE: 'NURSING_NOTE',
  PSYCHIATRIC_EVALUATION: 'PSYCHIATRIC_EVALUATION',
  EMERGENCY_DEPARTMENT: 'EMERGENCY_DEPARTMENT',
  FOLLOW_UP: 'FOLLOW_UP',
  TRANSFER_NOTE: 'TRANSFER_NOTE',
  DEATH_NOTE: 'DEATH_NOTE',
  OTHER: 'OTHER'
};

exports.InpatientAdmissionStatus = exports.$Enums.InpatientAdmissionStatus = {
  ADMITTED: 'ADMITTED',
  ACTIVE: 'ACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  DISCHARGE_PLANNING: 'DISCHARGE_PLANNING',
  DISCHARGED: 'DISCHARGED',
  EXPIRED: 'EXPIRED',
  ABSCONDED: 'ABSCONDED',
  CANCELLED: 'CANCELLED'
};

exports.InpatientDischargeStatus = exports.$Enums.InpatientDischargeStatus = {
  NONE: 'NONE',
  FIT_FOR_DISCHARGE: 'FIT_FOR_DISCHARGE',
  INITIATED: 'INITIATED',
  READY: 'READY',
  CONFIRMED: 'CONFIRMED'
};

exports.InpatientAcuity = exports.$Enums.InpatientAcuity = {
  STABLE: 'STABLE',
  WATCH: 'WATCH',
  CRITICAL: 'CRITICAL'
};

exports.DischargeTransactionStatus = exports.$Enums.DischargeTransactionStatus = {
  PLANNING: 'PLANNING',
  READY: 'READY',
  APPROVED: 'APPROVED',
  EXECUTED: 'EXECUTED',
  CANCELLED: 'CANCELLED'
};

exports.DischargeType = exports.$Enums.DischargeType = {
  ROUTINE: 'ROUTINE',
  AGAINST_MEDICAL_ADVICE: 'AGAINST_MEDICAL_ADVICE',
  TRANSFER_ACUTE_CARE: 'TRANSFER_ACUTE_CARE',
  TRANSFER_SNF: 'TRANSFER_SNF',
  TRANSFER_REHABILITATION: 'TRANSFER_REHABILITATION',
  EXPIRED: 'EXPIRED',
  ELOPED: 'ELOPED',
  LEFT_WITHOUT_BEING_SEEN: 'LEFT_WITHOUT_BEING_SEEN'
};

exports.DischargeDestination = exports.$Enums.DischargeDestination = {
  HOME: 'HOME',
  HOME_WITH_HOME_HEALTH: 'HOME_WITH_HOME_HEALTH',
  SKILLED_NURSING_FACILITY: 'SKILLED_NURSING_FACILITY',
  ACUTE_CARE_HOSPITAL: 'ACUTE_CARE_HOSPITAL',
  REHABILITATION_FACILITY: 'REHABILITATION_FACILITY',
  HOSPICE_HOME: 'HOSPICE_HOME',
  HOSPICE_FACILITY: 'HOSPICE_FACILITY',
  PSYCHIATRIC_FACILITY: 'PSYCHIATRIC_FACILITY',
  DECEASED: 'DECEASED',
  OTHER: 'OTHER'
};

exports.DischargeSummaryStatus = exports.$Enums.DischargeSummaryStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  FINAL: 'FINAL',
  SIGNED: 'SIGNED',
  VOID: 'VOID'
};

exports.InpatientEventType = exports.$Enums.InpatientEventType = {
  ADMISSION_CREATED: 'ADMISSION_CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  DISCHARGE_STATUS_CHANGED: 'DISCHARGE_STATUS_CHANGED',
  BED_ASSIGNED: 'BED_ASSIGNED',
  BED_RELEASED: 'BED_RELEASED',
  TRANSFERRED: 'TRANSFERRED',
  FLAG_ADDED: 'FLAG_ADDED',
  FLAG_REMOVED: 'FLAG_REMOVED',
  ACUITY_CHANGED: 'ACUITY_CHANGED',
  NOTE_ADDED: 'NOTE_ADDED',
  DISCHARGE_CONFIRMED: 'DISCHARGE_CONFIRMED'
};

exports.ChannelStatus = exports.$Enums.ChannelStatus = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED'
};

exports.CareTeamRole = exports.$Enums.CareTeamRole = {
  ATTENDING_PHYSICIAN: 'ATTENDING_PHYSICIAN',
  RESIDENT_PHYSICIAN: 'RESIDENT_PHYSICIAN',
  CONSULTING_PHYSICIAN: 'CONSULTING_PHYSICIAN',
  PRIMARY_NURSE: 'PRIMARY_NURSE',
  CHARGE_NURSE: 'CHARGE_NURSE',
  STAFF_NURSE: 'STAFF_NURSE',
  PHARMACIST: 'PHARMACIST',
  CASE_MANAGER: 'CASE_MANAGER',
  RESPIRATORY_THERAPIST: 'RESPIRATORY_THERAPIST',
  PHYSICAL_THERAPIST: 'PHYSICAL_THERAPIST',
  DIETITIAN: 'DIETITIAN',
  OTHER: 'OTHER'
};

exports.MessageType = exports.$Enums.MessageType = {
  TEXT: 'TEXT',
  SYSTEM: 'SYSTEM',
  CLINICAL_EVENT: 'CLINICAL_EVENT',
  CHECKLIST: 'CHECKLIST',
  TASK: 'TASK',
  ALERT: 'ALERT',
  ATTACHMENT: 'ATTACHMENT'
};

exports.MessageVisibility = exports.$Enums.MessageVisibility = {
  CARE_TEAM: 'CARE_TEAM',
  NURSING_ONLY: 'NURSING_ONLY',
  DOCTORS_ONLY: 'DOCTORS_ONLY'
};

exports.MessagePriority = exports.$Enums.MessagePriority = {
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.Prisma.ModelName = {
  ChecklistTemplate: 'ChecklistTemplate',
  ChecklistTemplateItem: 'ChecklistTemplateItem',
  ChecklistInstance: 'ChecklistInstance',
  ChecklistInstanceResponse: 'ChecklistInstanceResponse',
  Patient: 'Patient',
  Appointment: 'Appointment',
  Encounter: 'Encounter',
  Triage: 'Triage',
  EncounterNote: 'EncounterNote',
  EncounterNoteSection: 'EncounterNoteSection',
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
  AppointmentSeries: 'AppointmentSeries',
  MedicationMaster: 'MedicationMaster',
  LabTestMaster: 'LabTestMaster',
  ImagingStudyMaster: 'ImagingStudyMaster',
  ProcedureMaster: 'ProcedureMaster',
  DiagnosisVersion: 'DiagnosisVersion',
  DiagnosisMaster: 'DiagnosisMaster',
  NoteTemplate: 'NoteTemplate',
  NoteTemplateVersion: 'NoteTemplateVersion',
  ValueSet: 'ValueSet',
  ValueSetConcept: 'ValueSetConcept',
  ValueSetConceptTranslation: 'ValueSetConceptTranslation',
  TenantValueSetOverride: 'TenantValueSetOverride',
  ValueSetHistory: 'ValueSetHistory',
  Package: 'Package',
  PackageItem: 'PackageItem',
  AdministrativeService: 'AdministrativeService',
  VitalSignsTemplate: 'VitalSignsTemplate',
  InpatientAdmission: 'InpatientAdmission',
  BedAssignment: 'BedAssignment',
  InpatientAssessment: 'InpatientAssessment',
  CarePlan: 'CarePlan',
  NursingRound: 'NursingRound',
  IntakeOutput: 'IntakeOutput',
  InpatientDischarge: 'InpatientDischarge',
  ClinicalDischargeSummary: 'ClinicalDischargeSummary',
  ClinicalDischargeSummaryVersion: 'ClinicalDischargeSummaryVersion',
  DischargeChecklist: 'DischargeChecklist',
  InpatientEvent: 'InpatientEvent',
  CareChannel: 'CareChannel',
  CareChannelMember: 'CareChannelMember',
  ChannelMessage: 'ChannelMessage'
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
