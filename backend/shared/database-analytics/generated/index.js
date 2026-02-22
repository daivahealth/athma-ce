
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
} = require('./runtime/library.js')


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




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  actorId: 'actorId',
  action: 'action',
  resource: 'resource',
  metadata: 'metadata',
  occurredAt: 'occurredAt',
  receivedAt: 'receivedAt'
};

exports.Prisma.UsageEventScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  eventType: 'eventType',
  payload: 'payload',
  occurredAt: 'occurredAt'
};

exports.Prisma.AiQueryLogScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  userId: 'userId',
  facilityId: 'facilityId',
  feature: 'feature',
  queryText: 'queryText',
  queryPlan: 'queryPlan',
  compiledSql: 'compiledSql',
  resultCount: 'resultCount',
  executionTimeMs: 'executionTimeMs',
  modelUsed: 'modelUsed',
  inputTokens: 'inputTokens',
  outputTokens: 'outputTokens',
  status: 'status',
  errorMessage: 'errorMessage',
  userAgent: 'userAgent',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.AiUsageMetricScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  feature: 'feature',
  periodType: 'periodType',
  periodStart: 'periodStart',
  queryCount: 'queryCount',
  successCount: 'successCount',
  errorCount: 'errorCount',
  uniqueUsers: 'uniqueUsers',
  totalInputTokens: 'totalInputTokens',
  totalOutputTokens: 'totalOutputTokens',
  avgExecutionTimeMs: 'avgExecutionTimeMs',
  p95ExecutionTimeMs: 'p95ExecutionTimeMs',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SemanticMetricScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  displayName: 'displayName',
  displayNameAr: 'displayNameAr',
  description: 'description',
  expression: 'expression',
  database: 'database',
  baseTable: 'baseTable',
  dataType: 'dataType',
  defaultAggregation: 'defaultAggregation',
  format: 'format',
  requiredPermission: 'requiredPermission',
  category: 'category',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SemanticDimensionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  displayName: 'displayName',
  displayNameAr: 'displayNameAr',
  description: 'description',
  columnRef: 'columnRef',
  database: 'database',
  baseTable: 'baseTable',
  dataType: 'dataType',
  allowedOperators: 'allowedOperators',
  isLookup: 'isLookup',
  lookupValues: 'lookupValues',
  requiredPermission: 'requiredPermission',
  category: 'category',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SemanticJoinPathScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  fromTable: 'fromTable',
  fromDatabase: 'fromDatabase',
  toTable: 'toTable',
  toDatabase: 'toDatabase',
  joinType: 'joinType',
  joinCondition: 'joinCondition',
  cardinality: 'cardinality',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SavedReportScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  createdById: 'createdById',
  name: 'name',
  description: 'description',
  query: 'query',
  queryPlan: 'queryPlan',
  isPublic: 'isPublic',
  isFavorite: 'isFavorite',
  executionCount: 'executionCount',
  lastExecutedAt: 'lastExecutedAt',
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
  AuditLog: 'AuditLog',
  UsageEvent: 'UsageEvent',
  AiQueryLog: 'AiQueryLog',
  AiUsageMetric: 'AiUsageMetric',
  SemanticMetric: 'SemanticMetric',
  SemanticDimension: 'SemanticDimension',
  SemanticJoinPath: 'SemanticJoinPath',
  SavedReport: 'SavedReport'
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
      "value": "/Users/sajithchandran/aira/zeal/backend/shared/database-analytics/generated",
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
    "sourceFilePath": "/Users/sajithchandran/aira/zeal/backend/shared/database-analytics/prisma/schema.prisma",
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
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "ANALYTICS_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"postgresqlExtensions\"]\n  output          = \"../generated\"\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"ANALYTICS_DATABASE_URL\")\n  extensions = [uuid_ossp(map: \"uuid-ossp\")]\n}\n\nmodel AuditLog {\n  id         String   @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  actorId    String?  @map(\"actor_id\") @db.Uuid\n  action     String   @db.VarChar(100)\n  resource   String   @db.VarChar(150)\n  metadata   Json     @default(\"{}\")\n  occurredAt DateTime @default(now()) @map(\"occurred_at\") @db.Timestamptz(6)\n  receivedAt DateTime @default(now()) @map(\"received_at\") @db.Timestamptz(6)\n\n  @@index([tenantId, occurredAt], map: \"idx_audit_tenant_occurred\")\n  @@map(\"audit_logs\")\n}\n\nmodel UsageEvent {\n  id         String   @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  eventType  String   @map(\"event_type\")\n  payload    Json     @default(\"{}\")\n  occurredAt DateTime @default(now()) @map(\"occurred_at\") @db.Timestamptz(6)\n\n  @@index([tenantId, eventType], map: \"idx_usage_tenant_type\")\n  @@map(\"usage_events\")\n}\n\n// ============================================================================\n// AI FEATURE AUDIT LOGS\n// ============================================================================\n\n/// AI Query Logs - Audit trail for all AI-powered operations\nmodel AiQueryLog {\n  id         String  @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId   String  @map(\"tenant_id\") @db.Uuid\n  userId     String  @map(\"user_id\") @db.Uuid\n  facilityId String? @map(\"facility_id\") @db.Uuid\n\n  // Feature identification\n  feature String @db.VarChar(50) // 'report_builder', 'semantic_search'\n\n  // Query details\n  queryText   String  @map(\"query_text\") @db.Text // Original user query\n  queryPlan   Json?   @map(\"query_plan\") // Generated JSON plan (for reports)\n  compiledSql String? @map(\"compiled_sql\") @db.Text // Final SQL (debugging)\n\n  // Results\n  resultCount     Int? @map(\"result_count\")\n  executionTimeMs Int? @map(\"execution_time_ms\")\n\n  // LLM usage\n  modelUsed    String? @map(\"model_used\") @db.VarChar(100) // 'claude-sonnet-4-20250514'\n  inputTokens  Int?    @map(\"input_tokens\")\n  outputTokens Int?    @map(\"output_tokens\")\n\n  // Status\n  status       String  @default(\"success\") @db.VarChar(20) // 'success', 'error', 'timeout'\n  errorMessage String? @map(\"error_message\") @db.Text\n\n  // Metadata\n  userAgent String?  @map(\"user_agent\") @db.VarChar(500)\n  ipAddress String?  @map(\"ip_address\") @db.VarChar(45)\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n\n  @@index([tenantId, feature, createdAt], map: \"idx_ai_logs_tenant_feature\")\n  @@index([tenantId, userId, createdAt], map: \"idx_ai_logs_tenant_user\")\n  @@index([tenantId, status, createdAt], map: \"idx_ai_logs_tenant_status\")\n  @@index([modelUsed, createdAt], map: \"idx_ai_logs_model\")\n  @@map(\"ai_query_logs\")\n}\n\n/// AI Usage Metrics - Aggregated usage statistics per tenant\nmodel AiUsageMetric {\n  id          String   @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId    String   @map(\"tenant_id\") @db.Uuid\n  feature     String   @db.VarChar(50)\n  periodType  String   @map(\"period_type\") @db.VarChar(10) // 'daily', 'weekly', 'monthly'\n  periodStart DateTime @map(\"period_start\") @db.Date\n\n  // Counts\n  queryCount   Int @default(0) @map(\"query_count\")\n  successCount Int @default(0) @map(\"success_count\")\n  errorCount   Int @default(0) @map(\"error_count\")\n  uniqueUsers  Int @default(0) @map(\"unique_users\")\n\n  // Token usage\n  totalInputTokens  Int @default(0) @map(\"total_input_tokens\")\n  totalOutputTokens Int @default(0) @map(\"total_output_tokens\")\n\n  // Performance\n  avgExecutionTimeMs Decimal? @map(\"avg_execution_time_ms\") @db.Decimal(10, 2)\n  p95ExecutionTimeMs Decimal? @map(\"p95_execution_time_ms\") @db.Decimal(10, 2)\n\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([tenantId, feature, periodType, periodStart], map: \"ux_ai_usage_period\")\n  @@index([tenantId, periodType, periodStart], map: \"idx_ai_usage_tenant_period\")\n  @@map(\"ai_usage_metrics\")\n}\n\n// ============================================================================\n// SEMANTIC CATALOG - Report Builder Metadata\n// ============================================================================\n\n/// Semantic Metrics - What can be measured in reports\nmodel SemanticMetric {\n  id            String  @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId      String? @map(\"tenant_id\") @db.Uuid // NULL = global, UUID = tenant-specific\n  name          String  @db.VarChar(100) // 'total_revenue'\n  displayName   String  @map(\"display_name\") @db.VarChar(255) // 'Total Revenue'\n  displayNameAr String? @map(\"display_name_ar\") @db.VarChar(255) // 'إجمالي الإيرادات'\n  description   String? @db.Text // For LLM context\n\n  // SQL configuration\n  expression String @db.Text // SQL: 'net_amount' or 'COALESCE(amount, 0)'\n  database   String @db.VarChar(20) // 'rcm' | 'clinical' | 'foundation'\n  baseTable  String @map(\"base_table\") @db.VarChar(100) // 'invoices'\n\n  // Type information\n  dataType           String? @map(\"data_type\") @db.VarChar(20) // 'decimal' | 'integer'\n  defaultAggregation String? @map(\"default_aggregation\") @db.VarChar(20) // 'SUM'\n  format             String? @db.VarChar(50) // 'currency' | 'percentage' | 'number'\n\n  // Access control\n  requiredPermission String? @map(\"required_permission\") @db.VarChar(100) // 'rcm.reports.revenue'\n\n  // Organization\n  category  String? @db.VarChar(50) // 'Revenue' | 'Clinical' | 'Operations'\n  sortOrder Int     @default(0) @map(\"sort_order\")\n\n  isActive  Boolean  @default(true) @map(\"is_active\")\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([tenantId, name], map: \"ux_semantic_metric_name\")\n  @@index([tenantId, isActive], map: \"idx_semantic_metric_tenant\")\n  @@index([database, baseTable], map: \"idx_semantic_metric_table\")\n  @@map(\"semantic_metrics\")\n}\n\n/// Semantic Dimensions - What can be grouped/filtered by\nmodel SemanticDimension {\n  id            String  @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId      String? @map(\"tenant_id\") @db.Uuid // NULL = global, UUID = tenant-specific\n  name          String  @db.VarChar(100) // 'invoice_date'\n  displayName   String  @map(\"display_name\") @db.VarChar(255) // 'Invoice Date'\n  displayNameAr String? @map(\"display_name_ar\") @db.VarChar(255) // 'تاريخ الفاتورة'\n  description   String? @db.Text // For LLM context\n\n  // SQL configuration\n  columnRef String @map(\"column_ref\") @db.VarChar(255) // SQL column reference\n  database  String @db.VarChar(20) // 'rcm' | 'clinical' | 'foundation'\n  baseTable String @map(\"base_table\") @db.VarChar(100) // 'invoices'\n\n  // Type information\n  dataType         String?  @map(\"data_type\") @db.VarChar(20) // 'date' | 'string' | 'integer'\n  allowedOperators String[] @map(\"allowed_operators\") @db.VarChar(20) // ['eq', 'gte', 'lte', 'between']\n\n  // Lookup values for enums\n  isLookup     Boolean  @default(false) @map(\"is_lookup\")\n  lookupValues String[] @map(\"lookup_values\") @db.VarChar(100) // ['unpaid', 'paid', 'cancelled']\n\n  // Access control\n  requiredPermission String? @map(\"required_permission\") @db.VarChar(100) // 'rcm.reports.invoices'\n\n  // Organization\n  category  String? @db.VarChar(50) // 'Time' | 'Geography' | 'Patient'\n  sortOrder Int     @default(0) @map(\"sort_order\")\n\n  isActive  Boolean  @default(true) @map(\"is_active\")\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([tenantId, name], map: \"ux_semantic_dimension_name\")\n  @@index([tenantId, isActive], map: \"idx_semantic_dimension_tenant\")\n  @@index([database, baseTable], map: \"idx_semantic_dimension_table\")\n  @@map(\"semantic_dimensions\")\n}\n\n/// Semantic Join Paths - How tables connect for cross-table queries\nmodel SemanticJoinPath {\n  id       String  @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId String? @map(\"tenant_id\") @db.Uuid // NULL = global, UUID = tenant-specific\n  name     String  @db.VarChar(100) // 'invoices_to_patients'\n\n  // Source table\n  fromTable    String @map(\"from_table\") @db.VarChar(100)\n  fromDatabase String @map(\"from_database\") @db.VarChar(20)\n\n  // Target table\n  toTable    String @map(\"to_table\") @db.VarChar(100)\n  toDatabase String @map(\"to_database\") @db.VarChar(20)\n\n  // Join configuration\n  joinType      String @default(\"inner\") @map(\"join_type\") @db.VarChar(10) // 'inner' | 'left'\n  joinCondition String @map(\"join_condition\") @db.Text // SQL join condition\n\n  // Relationship metadata\n  cardinality String? @db.VarChar(20) // 'one-to-one' | 'one-to-many' | 'many-to-one'\n  description String? @db.Text\n\n  isActive  Boolean  @default(true) @map(\"is_active\")\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([tenantId, name], map: \"ux_semantic_join_path_name\")\n  @@index([fromDatabase, fromTable], map: \"idx_semantic_join_from\")\n  @@index([toDatabase, toTable], map: \"idx_semantic_join_to\")\n  @@map(\"semantic_join_paths\")\n}\n\n// ============================================================================\n// SAVED REPORTS - User-saved report definitions\n// ============================================================================\n\n/// Saved Reports - Persisted report definitions for quick access\nmodel SavedReport {\n  id          String @id @default(uuid()) @map(\"id\") @db.Uuid\n  tenantId    String @map(\"tenant_id\") @db.Uuid\n  createdById String @map(\"created_by_id\") @db.Uuid // User who created the report\n\n  // Report definition\n  name        String  @db.VarChar(255)\n  description String? @db.Text\n  query       String  @db.Text // Original natural language query\n  queryPlan   Json?   @map(\"query_plan\") // Parsed query plan for re-execution\n\n  // Sharing & organization\n  isPublic   Boolean @default(false) @map(\"is_public\") // Visible to all users in tenant\n  isFavorite Boolean @default(false) @map(\"is_favorite\") // User's favorite\n\n  // Usage tracking\n  executionCount Int       @default(0) @map(\"execution_count\")\n  lastExecutedAt DateTime? @map(\"last_executed_at\") @db.Timestamptz(6)\n\n  // Metadata\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@index([tenantId, createdById], map: \"idx_saved_report_tenant_user\")\n  @@index([tenantId, isPublic], map: \"idx_saved_report_public\")\n  @@index([tenantId, isFavorite], map: \"idx_saved_report_favorite\")\n  @@map(\"saved_reports\")\n}\n",
  "inlineSchemaHash": "5de0243fe8e81c013ba27e10fb7460d5ea190d3eeef41019e1f71fe9d2ec3011",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "generated",
    "",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"AuditLog\":{\"dbName\":\"audit_logs\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"dbName\":\"actor_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resource\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"occurredAt\",\"dbName\":\"occurred_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedAt\",\"dbName\":\"received_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UsageEvent\":{\"dbName\":\"usage_events\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"dbName\":\"event_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"occurredAt\",\"dbName\":\"occurred_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AiQueryLog\":{\"dbName\":\"ai_query_logs\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityId\",\"dbName\":\"facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"feature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"queryText\",\"dbName\":\"query_text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"queryPlan\",\"dbName\":\"query_plan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"compiledSql\",\"dbName\":\"compiled_sql\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resultCount\",\"dbName\":\"result_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionTimeMs\",\"dbName\":\"execution_time_ms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelUsed\",\"dbName\":\"model_used\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inputTokens\",\"dbName\":\"input_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outputTokens\",\"dbName\":\"output_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"success\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"dbName\":\"error_message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"dbName\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"AI Query Logs - Audit trail for all AI-powered operations\"},\"AiUsageMetric\":{\"dbName\":\"ai_usage_metrics\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"feature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodType\",\"dbName\":\"period_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"dbName\":\"period_start\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"queryCount\",\"dbName\":\"query_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"successCount\",\"dbName\":\"success_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorCount\",\"dbName\":\"error_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uniqueUsers\",\"dbName\":\"unique_users\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalInputTokens\",\"dbName\":\"total_input_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalOutputTokens\",\"dbName\":\"total_output_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avgExecutionTimeMs\",\"dbName\":\"avg_execution_time_ms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"p95ExecutionTimeMs\",\"dbName\":\"p95_execution_time_ms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"feature\",\"periodType\",\"periodStart\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"feature\",\"periodType\",\"periodStart\"]}],\"isGenerated\":false,\"documentation\":\"AI Usage Metrics - Aggregated usage statistics per tenant\"},\"SemanticMetric\":{\"dbName\":\"semantic_metrics\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayName\",\"dbName\":\"display_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayNameAr\",\"dbName\":\"display_name_ar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expression\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"database\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTable\",\"dbName\":\"base_table\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataType\",\"dbName\":\"data_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"defaultAggregation\",\"dbName\":\"default_aggregation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"format\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredPermission\",\"dbName\":\"required_permission\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sortOrder\",\"dbName\":\"sort_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"name\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"name\"]}],\"isGenerated\":false,\"documentation\":\"Semantic Metrics - What can be measured in reports\"},\"SemanticDimension\":{\"dbName\":\"semantic_dimensions\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayName\",\"dbName\":\"display_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayNameAr\",\"dbName\":\"display_name_ar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"columnRef\",\"dbName\":\"column_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"database\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTable\",\"dbName\":\"base_table\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataType\",\"dbName\":\"data_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowedOperators\",\"dbName\":\"allowed_operators\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isLookup\",\"dbName\":\"is_lookup\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lookupValues\",\"dbName\":\"lookup_values\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredPermission\",\"dbName\":\"required_permission\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sortOrder\",\"dbName\":\"sort_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"name\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"name\"]}],\"isGenerated\":false,\"documentation\":\"Semantic Dimensions - What can be grouped/filtered by\"},\"SemanticJoinPath\":{\"dbName\":\"semantic_join_paths\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromTable\",\"dbName\":\"from_table\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromDatabase\",\"dbName\":\"from_database\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toTable\",\"dbName\":\"to_table\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toDatabase\",\"dbName\":\"to_database\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"joinType\",\"dbName\":\"join_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"inner\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"joinCondition\",\"dbName\":\"join_condition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cardinality\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"name\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"name\"]}],\"isGenerated\":false,\"documentation\":\"Semantic Join Paths - How tables connect for cross-table queries\"},\"SavedReport\":{\"dbName\":\"saved_reports\",\"fields\":[{\"name\":\"id\",\"dbName\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdById\",\"dbName\":\"created_by_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"query\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"queryPlan\",\"dbName\":\"query_plan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPublic\",\"dbName\":\"is_public\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFavorite\",\"dbName\":\"is_favorite\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionCount\",\"dbName\":\"execution_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastExecutedAt\",\"dbName\":\"last_executed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Saved Reports - Persisted report definitions for quick access\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
path.join(process.cwd(), "generated/libquery_engine-darwin-arm64.dylib.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "generated/schema.prisma")
