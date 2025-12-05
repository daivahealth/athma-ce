
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

exports.Prisma.PayerScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  payerName: 'payerName',
  payerId: 'payerId',
  payerType: 'payerType',
  contactInfo: 'contactInfo',
  configuration: 'configuration',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PolicyScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  policyNumber: 'policyNumber',
  groupNumber: 'groupNumber',
  payerName: 'payerName',
  payerId: 'payerId',
  relationship: 'relationship',
  effectiveDate: 'effectiveDate',
  expirationDate: 'expirationDate',
  benefits: 'benefits',
  isPrimary: 'isPrimary',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClaimScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  claimNumber: 'claimNumber',
  status: 'status',
  payerId: 'payerId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  totalAmount: 'totalAmount',
  currency: 'currency',
  serviceDate: 'serviceDate',
  submittedAt: 'submittedAt',
  adjudicatedAt: 'adjudicatedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EncounterCoverageScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  patientId: 'patientId',
  policyId: 'policyId',
  payerId: 'payerId',
  financialClass: 'financialClass',
  coverageLevel: 'coverageLevel',
  planName: 'planName',
  memberId: 'memberId',
  memberName: 'memberName',
  networkName: 'networkName',
  copayAmount: 'copayAmount',
  coinsurancePct: 'coinsurancePct',
  deductibleSnapshot: 'deductibleSnapshot',
  benefitsSnapshot: 'benefitsSnapshot',
  eligibilityRequestId: 'eligibilityRequestId',
  preauthRequestId: 'preauthRequestId',
  costEstimateId: 'costEstimateId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingItemScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  billingCode: 'billingCode',
  billingCodeType: 'billingCodeType',
  billingDescription: 'billingDescription',
  itemType: 'itemType',
  chargeType: 'chargeType',
  defaultUnit: 'defaultUnit',
  clinicalRefId: 'clinicalRefId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChargeScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  billingItemId: 'billingItemId',
  chargeDate: 'chargeDate',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  grossAmount: 'grossAmount',
  feeScheduleId: 'feeScheduleId',
  feeScheduleItemId: 'feeScheduleItemId',
  payerContractId: 'payerContractId',
  patientResponsibility: 'patientResponsibility',
  payerResponsibility: 'payerResponsibility',
  status: 'status',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  codingProcedureId: 'codingProcedureId',
  originalBillingItemId: 'originalBillingItemId',
  isCoderModified: 'isCoderModified',
  codedBy: 'codedBy',
  codedAt: 'codedAt',
  claimLineSequence: 'claimLineSequence'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  encounterId: 'encounterId',
  mrn: 'mrn',
  patientDisplayName: 'patientDisplayName',
  invoiceNumber: 'invoiceNumber',
  invoiceDate: 'invoiceDate',
  dueDate: 'dueDate',
  grossAmount: 'grossAmount',
  totalDiscounts: 'totalDiscounts',
  netAmount: 'netAmount',
  amountPaid: 'amountPaid',
  balanceDue: 'balanceDue',
  status: 'status',
  currency: 'currency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceLineScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  chargeId: 'chargeId',
  lineNumber: 'lineNumber',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  lineAmount: 'lineAmount',
  lineDiscount: 'lineDiscount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReceiptScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  patientId: 'patientId',
  invoiceId: 'invoiceId',
  mrn: 'mrn',
  patientDisplayName: 'patientDisplayName',
  receiptNumber: 'receiptNumber',
  receiptDate: 'receiptDate',
  amount: 'amount',
  currency: 'currency',
  paymentMethod: 'paymentMethod',
  txnReference: 'txnReference',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReceiptAllocationScalarFieldEnum = {
  id: 'id',
  receiptId: 'receiptId',
  invoiceId: 'invoiceId',
  allocatedAmount: 'allocatedAmount',
  createdAt: 'createdAt'
};

exports.Prisma.ChargePostingRuleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  ruleName: 'ruleName',
  eventType: 'eventType',
  eventSource: 'eventSource',
  billingItemType: 'billingItemType',
  billingItemId: 'billingItemId',
  conditions: 'conditions',
  chargeCalculationMethod: 'chargeCalculationMethod',
  basePrice: 'basePrice',
  priceSource: 'priceSource',
  quantitySource: 'quantitySource',
  discountPercentage: 'discountPercentage',
  taxPercentage: 'taxPercentage',
  isActive: 'isActive',
  priority: 'priority',
  autoApprove: 'autoApprove',
  description: 'description',
  configuration: 'configuration',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ChargePostingEventScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  eventType: 'eventType',
  eventSource: 'eventSource',
  eventId: 'eventId',
  eventData: 'eventData',
  patientId: 'patientId',
  encounterId: 'encounterId',
  processed: 'processed',
  processedAt: 'processedAt',
  rulesMatched: 'rulesMatched',
  chargesCreated: 'chargesCreated',
  error: 'error',
  createdAt: 'createdAt'
};

exports.Prisma.ChargePostingAuditScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  chargeId: 'chargeId',
  eventId: 'eventId',
  ruleId: 'ruleId',
  conditionsMet: 'conditionsMet',
  calculationDetails: 'calculationDetails',
  createdAt: 'createdAt'
};

exports.Prisma.FeeScheduleScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  scheduleName: 'scheduleName',
  scheduleType: 'scheduleType',
  authorityCode: 'authorityCode',
  version: 'version',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  status: 'status',
  baseFeeScheduleId: 'baseFeeScheduleId',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FeeScheduleItemScalarFieldEnum = {
  id: 'id',
  feeScheduleId: 'feeScheduleId',
  billingItemId: 'billingItemId',
  code: 'code',
  codeType: 'codeType',
  baseAmount: 'baseAmount',
  currency: 'currency',
  unit: 'unit',
  multiplier: 'multiplier',
  discountPct: 'discountPct',
  maxAllowedAmount: 'maxAllowedAmount',
  serviceGroup: 'serviceGroup',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayerContractScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  payerId: 'payerId',
  contractName: 'contractName',
  contractNumber: 'contractNumber',
  authorityCode: 'authorityCode',
  baseFeeScheduleId: 'baseFeeScheduleId',
  planCode: 'planCode',
  networkType: 'networkType',
  lineOfBusiness: 'lineOfBusiness',
  contractType: 'contractType',
  reimbursementMethod: 'reimbursementMethod',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  status: 'status',
  defaultMultiplier: 'defaultMultiplier',
  defaultDiscountPct: 'defaultDiscountPct',
  defaultMaxAllowedAmount: 'defaultMaxAllowedAmount',
  terms: 'terms',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.PayerContractAdjustmentScalarFieldEnum = {
  id: 'id',
  contractId: 'contractId',
  serviceGroup: 'serviceGroup',
  billingItemId: 'billingItemId',
  feeScheduleItemId: 'feeScheduleItemId',
  multiplier: 'multiplier',
  discountPct: 'discountPct',
  maxAllowedAmount: 'maxAllowedAmount',
  minAllowedAmount: 'minAllowedAmount',
  priority: 'priority',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  isExclusion: 'isExclusion',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.CodingSessionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  encounterId: 'encounterId',
  claimId: 'claimId',
  status: 'status',
  assignedTo: 'assignedTo',
  assignedAt: 'assignedAt',
  completedAt: 'completedAt',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  codingNotes: 'codingNotes',
  reviewNotes: 'reviewNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.CodingDiagnosisScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  codingSessionId: 'codingSessionId',
  sourceEncounterDiagnosisId: 'sourceEncounterDiagnosisId',
  diagnosisCatalogItemId: 'diagnosisCatalogItemId',
  diagnosisCode: 'diagnosisCode',
  diagnosisCodeType: 'diagnosisCodeType',
  diagnosisDisplay: 'diagnosisDisplay',
  diagnosisDisplayAr: 'diagnosisDisplayAr',
  diagnosisType: 'diagnosisType',
  sequence: 'sequence',
  usedForBilling: 'usedForBilling',
  poaFlag: 'poaFlag',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.CodingProcedureScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  codingSessionId: 'codingSessionId',
  sourceClinicalOrderId: 'sourceClinicalOrderId',
  billingItemId: 'billingItemId',
  procedureCatalogItemId: 'procedureCatalogItemId',
  procedureCode: 'procedureCode',
  procedureCodeType: 'procedureCodeType',
  procedureDisplay: 'procedureDisplay',
  procedureDisplayAr: 'procedureDisplayAr',
  serviceDate: 'serviceDate',
  providerId: 'providerId',
  revenueCenterId: 'revenueCenterId',
  sequence: 'sequence',
  units: 'units',
  modifier1: 'modifier1',
  modifier2: 'modifier2',
  modifier3: 'modifier3',
  modifier4: 'modifier4',
  serviceGroup: 'serviceGroup',
  placeOfService: 'placeOfService',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.ClaimLineScalarFieldEnum = {
  id: 'id',
  claimId: 'claimId',
  codingProcedureId: 'codingProcedureId',
  chargeId: 'chargeId',
  lineNumber: 'lineNumber',
  procedureCode: 'procedureCode',
  procedureCodeType: 'procedureCodeType',
  procedureDescription: 'procedureDescription',
  modifier1: 'modifier1',
  modifier2: 'modifier2',
  modifier3: 'modifier3',
  modifier4: 'modifier4',
  serviceDate: 'serviceDate',
  units: 'units',
  chargedAmount: 'chargedAmount',
  allowedAmount: 'allowedAmount',
  paidAmount: 'paidAmount',
  adjustmentAmount: 'adjustmentAmount',
  adjudicationStatus: 'adjudicationStatus',
  denialReason: 'denialReason',
  remarkCodes: 'remarkCodes',
  providerId: 'providerId',
  placeOfService: 'placeOfService',
  revenueCenterCode: 'revenueCenterCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClaimDiagnosisScalarFieldEnum = {
  id: 'id',
  claimId: 'claimId',
  codingDiagnosisId: 'codingDiagnosisId',
  sequence: 'sequence',
  diagnosisCode: 'diagnosisCode',
  diagnosisCodeType: 'diagnosisCodeType',
  diagnosisDisplay: 'diagnosisDisplay',
  diagnosisType: 'diagnosisType',
  poaFlag: 'poaFlag',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CodingAuditLogScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  codingSessionId: 'codingSessionId',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  oldValue: 'oldValue',
  newValue: 'newValue',
  changedFields: 'changedFields',
  changedBy: 'changedBy',
  changeReason: 'changeReason',
  changedAt: 'changedAt'
};

exports.Prisma.CatalogItemMappingScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  catalogType: 'catalogType',
  catalogItemId: 'catalogItemId',
  billingItemId: 'billingItemId',
  quantity: 'quantity',
  isAutomatic: 'isAutomatic',
  isPrimary: 'isPrimary',
  requiresApproval: 'requiresApproval',
  facilityIds: 'facilityIds',
  payerIds: 'payerIds',
  patientTypes: 'patientTypes',
  mappingReason: 'mappingReason',
  notes: 'notes',
  effectiveDate: 'effectiveDate',
  expirationDate: 'expirationDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.CatalogMappingAuditScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  mappingId: 'mappingId',
  action: 'action',
  oldValue: 'oldValue',
  newValue: 'newValue',
  changedFields: 'changedFields',
  changedBy: 'changedBy',
  changeReason: 'changeReason',
  changedAt: 'changedAt'
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
  Payer: 'Payer',
  Policy: 'Policy',
  Claim: 'Claim',
  EncounterCoverage: 'EncounterCoverage',
  BillingItem: 'BillingItem',
  Charge: 'Charge',
  Invoice: 'Invoice',
  InvoiceLine: 'InvoiceLine',
  Receipt: 'Receipt',
  ReceiptAllocation: 'ReceiptAllocation',
  ChargePostingRule: 'ChargePostingRule',
  ChargePostingEvent: 'ChargePostingEvent',
  ChargePostingAudit: 'ChargePostingAudit',
  FeeSchedule: 'FeeSchedule',
  FeeScheduleItem: 'FeeScheduleItem',
  PayerContract: 'PayerContract',
  PayerContractAdjustment: 'PayerContractAdjustment',
  CodingSession: 'CodingSession',
  CodingDiagnosis: 'CodingDiagnosis',
  CodingProcedure: 'CodingProcedure',
  ClaimLine: 'ClaimLine',
  ClaimDiagnosis: 'ClaimDiagnosis',
  CodingAuditLog: 'CodingAuditLog',
  CatalogItemMapping: 'CatalogItemMapping',
  CatalogMappingAudit: 'CatalogMappingAudit'
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
