
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

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  domain: 'domain',
  status: 'status',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  passwordHash: 'passwordHash',
  role: 'role',
  status: 'status',
  permissions: 'permissions',
  staffId: 'staffId',
  defaultFacilityId: 'defaultFacilityId',
  lastLogin: 'lastLogin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FacilityScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  code: 'code',
  facilityType: 'facilityType',
  licenseNumber: 'licenseNumber',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  emirate: 'emirate',
  postalCode: 'postalCode',
  country: 'country',
  latitude: 'latitude',
  longitude: 'longitude',
  googlePlaceId: 'googlePlaceId',
  phoneNumber: 'phoneNumber',
  email: 'email',
  website: 'website',
  buildingNumber: 'buildingNumber',
  floorNumbers: 'floorNumbers',
  totalFloors: 'totalFloors',
  capacity: 'capacity',
  operatingHours: 'operatingHours',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  facilityId: 'facilityId',
  name: 'name',
  code: 'code',
  departmentType: 'departmentType',
  specialtyId: 'specialtyId',
  headOfDepartment: 'headOfDepartment',
  floorNumber: 'floorNumber',
  phoneExtension: 'phoneExtension',
  operatingHours: 'operatingHours',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WardScalarFieldEnum = {
  id: 'id',
  departmentId: 'departmentId',
  name: 'name',
  code: 'code',
  wardType: 'wardType',
  floorNumber: 'floorNumber',
  totalBeds: 'totalBeds',
  availableBeds: 'availableBeds',
  nursingStation: 'nursingStation',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BedScalarFieldEnum = {
  id: 'id',
  wardId: 'wardId',
  bedNumber: 'bedNumber',
  bedType: 'bedType',
  features: 'features',
  status: 'status',
  currentPatientId: 'currentPatientId',
  assignedAt: 'assignedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClinicScalarFieldEnum = {
  id: 'id',
  departmentId: 'departmentId',
  name: 'name',
  code: 'code',
  specialty: 'specialty',
  floorNumber: 'floorNumber',
  totalRooms: 'totalRooms',
  operatingHours: 'operatingHours',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SpaceScalarFieldEnum = {
  id: 'id',
  facilityId: 'facilityId',
  departmentId: 'departmentId',
  clinicId: 'clinicId',
  name: 'name',
  spaceNumber: 'spaceNumber',
  spaceType: 'spaceType',
  floorNumber: 'floorNumber',
  equipment: 'equipment',
  capacity: 'capacity',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StaffScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  prefix: 'prefix',
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  nationality: 'nationality',
  phoneNumber: 'phoneNumber',
  email: 'email',
  employeeId: 'employeeId',
  staffType: 'staffType',
  specialties: 'specialties',
  licenseNumber: 'licenseNumber',
  licenseExpiry: 'licenseExpiry',
  qualification: 'qualification',
  languages: 'languages',
  displayName: 'displayName',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SpecialtyScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SpecialtyCodeAuthorityScalarFieldEnum = {
  id: 'id',
  specialtyId: 'specialtyId',
  authority: 'authority',
  authorityCode: 'authorityCode',
  authorityName: 'authorityName',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StaffSpecialtyScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  staffId: 'staffId',
  facilityId: 'facilityId',
  specialtyId: 'specialtyId',
  primaryFlag: 'primaryFlag',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SpecialtyTranslationScalarFieldEnum = {
  id: 'id',
  specialtyId: 'specialtyId',
  lang: 'lang',
  displayName: 'displayName',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  resource: 'resource',
  action: 'action',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  assignedBy: 'assignedBy',
  assignedAt: 'assignedAt',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.UserMfaSettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  totpEnabled: 'totpEnabled',
  totpSecret: 'totpSecret',
  smsEnabled: 'smsEnabled',
  smsPhoneNumber: 'smsPhoneNumber',
  emailEnabled: 'emailEnabled',
  backupCodesCount: 'backupCodesCount',
  lastUsedAt: 'lastUsedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserMfaBackupCodeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  codeHash: 'codeHash',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.UserMfaAttemptScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  method: 'method',
  success: 'success',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.UserTrustedDeviceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  deviceFingerprint: 'deviceFingerprint',
  deviceName: 'deviceName',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  trustedAt: 'trustedAt',
  lastUsedAt: 'lastUsedAt',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.UserFacilityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  facilityId: 'facilityId',
  isDefault: 'isDefault',
  accessLevel: 'accessLevel',
  grantedAt: 'grantedAt',
  grantedBy: 'grantedBy',
  revokedAt: 'revokedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InstanceConfigScalarFieldEnum = {
  id: 'id',
  configKey: 'configKey',
  value: 'value',
  valueType: 'valueType',
  category: 'category',
  description: 'description',
  isOverridable: 'isOverridable',
  isSensitive: 'isSensitive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.TenantConfigScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  configKey: 'configKey',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.FacilityConfigScalarFieldEnum = {
  id: 'id',
  facilityId: 'facilityId',
  configKey: 'configKey',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ConfigAuditLogScalarFieldEnum = {
  id: 'id',
  configLevel: 'configLevel',
  configKey: 'configKey',
  entityId: 'entityId',
  oldValue: 'oldValue',
  newValue: 'newValue',
  changedBy: 'changedBy',
  changedAt: 'changedAt',
  changeReason: 'changeReason'
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

exports.Prisma.NoteTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  specialtyId: 'specialtyId',
  name: 'name',
  description: 'description',
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
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
  Tenant: 'Tenant',
  User: 'User',
  Facility: 'Facility',
  Department: 'Department',
  Ward: 'Ward',
  Bed: 'Bed',
  Clinic: 'Clinic',
  Space: 'Space',
  Staff: 'Staff',
  Specialty: 'Specialty',
  SpecialtyCodeAuthority: 'SpecialtyCodeAuthority',
  StaffSpecialty: 'StaffSpecialty',
  SpecialtyTranslation: 'SpecialtyTranslation',
  Role: 'Role',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  UserRole: 'UserRole',
  UserMfaSettings: 'UserMfaSettings',
  UserMfaBackupCode: 'UserMfaBackupCode',
  UserMfaAttempt: 'UserMfaAttempt',
  UserTrustedDevice: 'UserTrustedDevice',
  UserFacility: 'UserFacility',
  InstanceConfig: 'InstanceConfig',
  TenantConfig: 'TenantConfig',
  FacilityConfig: 'FacilityConfig',
  ConfigAuditLog: 'ConfigAuditLog',
  ValueSet: 'ValueSet',
  ValueSetConcept: 'ValueSetConcept',
  ValueSetConceptTranslation: 'ValueSetConceptTranslation',
  TenantValueSetOverride: 'TenantValueSetOverride',
  ValueSetHistory: 'ValueSetHistory',
  MedicationMaster: 'MedicationMaster',
  LabTestMaster: 'LabTestMaster',
  ImagingStudyMaster: 'ImagingStudyMaster',
  ProcedureMaster: 'ProcedureMaster',
  DiagnosisMaster: 'DiagnosisMaster',
  DiagnosisVersion: 'DiagnosisVersion',
  NoteTemplate: 'NoteTemplate',
  NoteTemplateVersion: 'NoteTemplateVersion'
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
