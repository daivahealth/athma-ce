
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

exports.Prisma.PatientEngagementEventScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  patientDisplayName: 'patientDisplayName',
  patientGender: 'patientGender',
  patientDob: 'patientDob',
  patientAgeYearsAtEvent: 'patientAgeYearsAtEvent',
  patientRef: 'patientRef',
  patientMobileMasked: 'patientMobileMasked',
  sourceSystem: 'sourceSystem',
  sourceModule: 'sourceModule',
  eventType: 'eventType',
  eventSubtype: 'eventSubtype',
  severity: 'severity',
  occurredAt: 'occurredAt',
  entityType: 'entityType',
  entityId: 'entityId',
  payload: 'payload',
  correlationId: 'correlationId',
  dedupeKey: 'dedupeKey',
  createdAt: 'createdAt',
  createdBy: 'createdBy'
};

exports.Prisma.EngagementRuleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  triggerEventType: 'triggerEventType',
  triggerEventSubtype: 'triggerEventSubtype',
  conditionExpr: 'conditionExpr',
  scheduleMode: 'scheduleMode',
  delaySeconds: 'delaySeconds',
  actionType: 'actionType',
  actionPayload: 'actionPayload',
  priority: 'priority',
  cooldownSeconds: 'cooldownSeconds',
  idempotencyWindow: 'idempotencyWindow',
  maxExecutionsPerDay: 'maxExecutionsPerDay',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  isActive: 'isActive',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy'
};

exports.Prisma.CommunicationTemplateScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  channel: 'channel',
  language: 'language',
  subject: 'subject',
  body: 'body',
  variablesSchema: 'variablesSchema',
  approvalStatus: 'approvalStatus',
  approvedAt: 'approvedAt',
  approvedBy: 'approvedBy',
  rejectionReason: 'rejectionReason',
  version: 'version',
  contentHash: 'contentHash',
  isActive: 'isActive',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy'
};

exports.Prisma.PatientPreferenceScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  preferredLanguage: 'preferredLanguage',
  channelOrder: 'channelOrder',
  quietHoursStart: 'quietHoursStart',
  quietHoursEnd: 'quietHoursEnd',
  timezone: 'timezone',
  dndEnabled: 'dndEnabled',
  dndUntil: 'dndUntil',
  smsOptOut: 'smsOptOut',
  emailOptOut: 'emailOptOut',
  whatsappOptOut: 'whatsappOptOut',
  guardianName: 'guardianName',
  guardianContact: 'guardianContact',
  guardianRef: 'guardianRef',
  notes: 'notes',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.PatientMessageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  patientDisplayName: 'patientDisplayName',
  patientGender: 'patientGender',
  patientRef: 'patientRef',
  direction: 'direction',
  channel: 'channel',
  toAddress: 'toAddress',
  fromAddress: 'fromAddress',
  templateId: 'templateId',
  templateVersion: 'templateVersion',
  subject: 'subject',
  bodyRendered: 'bodyRendered',
  variablesUsed: 'variablesUsed',
  purpose: 'purpose',
  consentReferenceId: 'consentReferenceId',
  relatedEventId: 'relatedEventId',
  relatedEntityType: 'relatedEntityType',
  relatedEntityId: 'relatedEntityId',
  providerMessageId: 'providerMessageId',
  status: 'status',
  statusReason: 'statusReason',
  sentAt: 'sentAt',
  deliveredAt: 'deliveredAt',
  readAt: 'readAt',
  failedAt: 'failedAt',
  retryCount: 'retryCount',
  idempotencyKey: 'idempotencyKey',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.PatientTaskScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  patientDisplayName: 'patientDisplayName',
  patientGender: 'patientGender',
  patientAgeYearsAtEvent: 'patientAgeYearsAtEvent',
  patientRef: 'patientRef',
  taskType: 'taskType',
  title: 'title',
  description: 'description',
  priority: 'priority',
  assignedToUserId: 'assignedToUserId',
  assignedToRole: 'assignedToRole',
  status: 'status',
  dueAt: 'dueAt',
  completedAt: 'completedAt',
  cancelledAt: 'cancelledAt',
  outcome: 'outcome',
  outcomeDetails: 'outcomeDetails',
  relatedEventId: 'relatedEventId',
  relatedEntityType: 'relatedEntityType',
  relatedEntityId: 'relatedEntityId',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.EngagementRuleRunScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  ruleId: 'ruleId',
  eventId: 'eventId',
  decision: 'decision',
  skipReason: 'skipReason',
  actionResult: 'actionResult',
  correlationId: 'correlationId',
  evaluatedAt: 'evaluatedAt'
};

exports.Prisma.PrmJobScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  jobType: 'jobType',
  payload: 'payload',
  runAt: 'runAt',
  status: 'status',
  attempts: 'attempts',
  maxAttempts: 'maxAttempts',
  lockedAt: 'lockedAt',
  lockedBy: 'lockedBy',
  lastError: 'lastError',
  idempotencyKey: 'idempotencyKey',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProviderCallbackScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  channel: 'channel',
  providerMessageId: 'providerMessageId',
  receivedAt: 'receivedAt',
  payload: 'payload',
  processed: 'processed',
  processedAt: 'processedAt'
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
  PatientEngagementEvent: 'PatientEngagementEvent',
  EngagementRule: 'EngagementRule',
  CommunicationTemplate: 'CommunicationTemplate',
  PatientPreference: 'PatientPreference',
  PatientMessage: 'PatientMessage',
  PatientTask: 'PatientTask',
  EngagementRuleRun: 'EngagementRuleRun',
  PrmJob: 'PrmJob',
  ProviderCallback: 'ProviderCallback'
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
