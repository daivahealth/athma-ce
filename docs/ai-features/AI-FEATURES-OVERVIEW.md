# AI Features Architecture Documentation

This document provides comprehensive technical documentation for the AI-powered features in the athma-ce Healthcare Platform.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Feature 1: Natural Language Report Builder](#feature-1-natural-language-report-builder)
   - [Chart Visualization](#chart-visualization)
4. [Feature 2: Clinical Semantic Search](#feature-2-clinical-semantic-search)
5. [Configuration Guide](#configuration-guide)
6. [Security & Compliance](#security--compliance)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The athma-ce AI Gateway service provides these AI-powered features:

| Feature | Purpose | LLM Provider | Database |
|---------|---------|--------------|----------|
| **Report Builder** | Convert natural language to SQL reports | Claude (Anthropic) | Foundation, Clinical, RCM |
| **Semantic Search** | Vector search over clinical documents | OpenAI Embeddings | Clinical (pgvector) |
| **Clinical Coding** | Suggest ICD-10/SNOMED codes from clinical text | Claude (Anthropic) | Clinical |
| **AI Care Narrative** | Specialty-aware patient summary for the Care Context workspace | Claude (Anthropic) | Clinical |

### Service Details

- **Service Name**: `@zeal/ai-gateway`
- **Port**: 3015
- **API Base**: `/api/v1`
- **Swagger Docs**: `http://localhost:3015/api/docs`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AI Gateway Service (Port 3015)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────┐    ┌─────────────────────────────────────┐ │
│  │   Report Builder Module │    │     Semantic Search Module          │ │
│  │                         │    │                                     │ │
│  │  ┌───────────────────┐  │    │  ┌─────────────────────────────┐   │ │
│  │  │  Query Planner    │  │    │  │  Embedding Service          │   │ │
│  │  │  (Claude Sonnet)  │  │    │  │  (OpenAI text-embedding-3)  │   │ │
│  │  └─────────┬─────────┘  │    │  └──────────────┬──────────────┘   │ │
│  │            │            │    │                 │                   │ │
│  │  ┌─────────▼─────────┐  │    │  ┌──────────────▼──────────────┐   │ │
│  │  │  SQL Compiler     │  │    │  │  Search Service             │   │ │
│  │  │  (JSON → SQL)     │  │    │  │  (pgvector similarity)      │   │ │
│  │  └─────────┬─────────┘  │    │  └──────────────┬──────────────┘   │ │
│  │            │            │    │                 │                   │ │
│  │  ┌─────────▼─────────┐  │    │  ┌──────────────▼──────────────┐   │ │
│  │  │  Query Executor   │  │    │  │  Embedding Sync Service     │   │ │
│  │  └─────────┬─────────┘  │    │  │  (CDC-based background)     │   │ │
│  │            │            │    │  └─────────────────────────────┘   │ │
│  │  ┌─────────▼─────────┐  │    │                                     │ │
│  │  │  Export Service   │  │    │                                     │ │
│  │  │  (Excel/PDF/CSV)  │  │    │                                     │ │
│  │  └───────────────────┘  │    │                                     │ │
│  └─────────────────────────┘    └─────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    Shared LLM Client Layer                          ││
│  │  ┌─────────────────────┐    ┌─────────────────────────────────────┐ ││
│  │  │  Anthropic Provider │    │  OpenAI Provider (Embeddings)       │ ││
│  │  └─────────────────────┘    └─────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
              │ Foundation│   │  Clinical │   │    RCM    │
              │    DB     │   │    DB     │   │    DB     │
              │           │   │ (pgvector)│   │           │
              └───────────┘   └───────────┘   └───────────┘
```

---

## Feature 1: Natural Language Report Builder

### Overview

Converts natural language queries into safe, tenant-isolated SQL reports with support for Excel/PDF/CSV exports.

### Data Flow

```
User Query: "What is today's revenue by department?"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Query Planner (query-planner.service.ts)                 │
│    - Loads semantic catalog (metrics/dimensions)            │
│    - Sends to Claude Sonnet with structured prompt          │
│    - Receives JSON Query Plan                               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Plan Validator                                           │
│    - Validates metrics/dimensions exist in catalog          │
│    - Checks operator whitelist                              │
│    - Enforces row limits (max 10,000)                       │
│    - Detects SQL injection patterns                         │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SQL Compiler (sql-compiler.service.ts)                   │
│    - Converts JSON Plan to parameterized SQL                │
│    - ALWAYS injects tenant_id filter (CRITICAL)             │
│    - Resolves metric expressions from catalog               │
│    - Builds JOINs from join path definitions                │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Query Executor (query-executor.service.ts)               │
│    - Routes to correct database (clinical/rcm/foundation)   │
│    - Executes with timeout (30 seconds)                     │
│    - Formats results according to column types              │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Export Service (export.service.ts) [Optional]            │
│    - Excel: ExcelJS with formatting                         │
│    - PDF: PDFKit (limited to 50 rows)                       │
│    - CSV: Standard comma-separated                          │
└─────────────────────────────────────────────────────────────┘
```

### JSON Query Plan Schema

The intermediate representation between natural language and SQL:

```typescript
interface QueryPlan {
  type: 'aggregate' | 'list' | 'detail';
  metrics: {
    name: string;                    // e.g., 'total_revenue'
    aggregation?: AggregationFunction; // SUM, COUNT, AVG, MIN, MAX, COUNT_DISTINCT
    alias?: string;
  }[];
  dimensions: {
    name: string;                    // e.g., 'invoice_date'
    alias?: string;
  }[];
  filters: {
    dimension: string;
    operator: ComparisonOperator;    // eq, ne, gt, gte, lt, lte, in, between, etc.
    value: any;
    valueTo?: any;                   // For 'between' operator
  }[];
  orderBy: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
  limit: number;                     // Max 10,000
  offset?: number;
}
```

### Semantic Catalog

The catalog defines what can be queried. Stored in Foundation DB.

#### Metrics Table (`semantic_metrics`)

| Column | Description |
|--------|-------------|
| `name` | Unique identifier (e.g., `total_revenue`) |
| `display_name` | UI label (e.g., "Total Revenue") |
| `display_name_ar` | Arabic label |
| `expression` | SQL expression (e.g., `net_amount`) |
| `database` | Target database (`clinical`, `rcm`, `foundation`) |
| `base_table` | Primary table (e.g., `invoices`) |
| `default_aggregation` | Default aggregation function |
| `required_permission` | RBAC permission required |
| `category` | Grouping category |
| `format` | Display format (`currency`, `percentage`, `number`) |

#### Dimensions Table (`semantic_dimensions`)

| Column | Description |
|--------|-------------|
| `name` | Unique identifier (e.g., `invoice_date`) |
| `column_ref` | SQL column reference |
| `allowed_operators` | Array of valid operators |
| `is_lookup` | Whether it's an enum |
| `lookup_values` | Valid values for enums |

#### Available Metrics (Initial Seed)

| Metric | Description | Database | Permission |
|--------|-------------|----------|------------|
| `total_revenue` | Sum of invoice amounts | RCM | `rcm.reports.revenue` |
| `invoice_count` | Count of invoices | RCM | `rcm.reports.invoices` |
| `outstanding_balance` | Unpaid balances | RCM | `rcm.reports.aging` |
| `patient_count` | Unique patients | Clinical | `clinical.reports.patients` |
| `encounter_count` | Patient encounters | Clinical | `clinical.reports.encounters` |
| `appointment_count` | Appointments | Clinical | `clinical.reports.appointments` |
| `admission_count` | Inpatient admissions | Clinical | `clinical.reports.admissions` |

#### Available Dimensions (Initial Seed)

| Dimension | Type | Operators | Values |
|-----------|------|-----------|--------|
| `invoice_date` | date | eq, gte, lte, between | - |
| `invoice_status` | enum | eq, in | draft, unpaid, partial, paid, cancelled |
| `encounter_type` | enum | eq, in | outpatient, inpatient, emergency, telehealth |
| `appointment_status` | enum | eq, in | scheduled, confirmed, completed, cancelled, no_show |
| `patient_gender` | enum | eq, in | male, female, other |
| `facility_id` | uuid | eq, in | - |
| `department_id` | uuid | eq, in | - |

### Example Queries

| Natural Language | Generated SQL (simplified) |
|------------------|---------------------------|
| "What is today's revenue?" | `SELECT SUM(net_amount) FROM invoices WHERE tenant_id=$1 AND invoice_date='2024-01-15'` |
| "Patient count by gender" | `SELECT gender, COUNT(DISTINCT id) FROM patients WHERE tenant_id=$1 GROUP BY gender` |
| "Unpaid invoices this month" | `SELECT * FROM invoices WHERE tenant_id=$1 AND status='unpaid' AND invoice_date >= '2024-01-01'` |

### Chart Visualization

The Report Builder includes interactive chart visualization capabilities using Recharts. Users can toggle between table and chart views for query results.

#### Features

| Feature | Description |
|---------|-------------|
| **View Toggle** | Switch between Table and Chart views |
| **Auto Chart Type** | Smart detection suggests best chart type based on data |
| **Chart Types** | Bar, Line, Pie, and Area charts |
| **Chartability Detection** | Disables chart view for unsuitable data |
| **Custom Tooltips** | Formatted tooltips matching column formats |

#### Smart Chart Type Detection

The system automatically suggests the best chart type based on data characteristics:

```typescript
function suggestChartType(result: QueryResult): ChartType {
  // Date dimension → Line chart (time series)
  if (hasDateDimension) return 'line';

  // Few rows (≤8) with single metric → Pie chart
  if (result.rows.length <= 8 && numericCols.length === 1) return 'pie';

  // Default → Bar chart
  return 'bar';
}
```

#### Chartability Rules

Not all query results are suitable for chart visualization:

```typescript
function isChartable(result: QueryResult): boolean {
  // No data
  if (!result || result.rows.length === 0) return false;

  // Too many data points (>50 rows)
  if (result.rows.length > 50) return false;

  // Need at least one numeric column
  const numericCols = result.columns.filter(c =>
    c.dataType === 'decimal' || c.dataType === 'integer'
  );

  // Need at least one dimension column
  const dimensionCols = result.columns.filter(c =>
    c.dataType === 'string' || c.dataType === 'date'
  );

  return numericCols.length >= 1 && dimensionCols.length >= 1;
}
```

#### UI Components

```
┌──────────────────────────────────────────────────────────────┐
│ Results (5 rows)                    📊 Table | 📈 Chart     │
│                                     [Bar ▼] [Line] [Pie]     │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │   █████████████████████████  Cardiology    $150,000     │ │
│ │   ██████████████████         Pediatrics    $120,000     │ │
│ │   ████████████               Radiology      $80,000     │ │
│ │   ███████████                Surgery        $75,000     │ │
│ │   ██████                     Emergency      $45,000     │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                     [Export Excel] [Export PDF]│
└──────────────────────────────────────────────────────────────┘
```

#### Supported Chart Types

| Chart Type | Best For | Auto-Selected When |
|------------|----------|-------------------|
| **Bar Chart** | Categorical comparisons | Default for categorical dimensions |
| **Line Chart** | Time series trends | Date/datetime dimension detected |
| **Pie Chart** | Part-to-whole ratios | ≤8 rows with single metric |
| **Area Chart** | Cumulative trends | User selection (alternative to line) |

#### Technical Implementation

**Frontend Components:**

| File | Purpose |
|------|---------|
| `frontend/src/modules/reporting/components/report-chart.tsx` | Chart component with Recharts |
| `frontend/src/components/ui/toggle-group.tsx` | View toggle (Table/Chart) |
| `frontend/src/app/[locale]/(dashboard)/reports/page.tsx` | Report page with chart integration |

**Dependencies:**

```json
{
  "recharts": "^2.x",
  "@radix-ui/react-toggle-group": "^1.x"
}
```

#### Chart Color Palette

The charts use a consistent color palette that works with the application's theme:

```typescript
const CHART_COLORS = [
  'hsl(var(--primary))',           // Primary brand color
  'hsl(var(--chart-2))',           // Teal
  'hsl(var(--chart-3))',           // Dark blue
  'hsl(var(--chart-4))',           // Yellow
  'hsl(var(--chart-5))',           // Orange
  // ... additional colors for multi-metric charts
];
```

#### Example Usage Scenarios

| Query | Suggested View | Chart Type |
|-------|----------------|------------|
| "Revenue by department" | Chart | Bar |
| "Monthly patient count for 2024" | Chart | Line |
| "Invoice status breakdown" | Chart | Pie |
| "List all pending invoices" | Table | N/A (too many rows) |
| "Patient details" | Table | N/A (detail view) |

---

## Feature 2: Clinical Semantic Search

### Overview

Vector-based semantic search over clinical notes and discharge summaries using pgvector.

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Document Ingestion                        │
│  1. Clinical note is created/updated in Clinical DB          │
│  2. Event triggers queue entry in embedding_sync_status      │
│  3. Background job (every 30s) picks up pending documents    │
│  4. Embedding Service chunks and embeds the text             │
│  5. Vectors stored in clinical_document_embeddings           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Search Flow                               │
│  1. User submits search query                                │
│  2. Query is preprocessed (abbreviation expansion)           │
│  3. Query embedding generated via OpenAI                     │
│  4. pgvector similarity search with filters                  │
│  5. Results ranked by similarity score                       │
│  6. Matching terms highlighted in results                    │
└─────────────────────────────────────────────────────────────┘
```

### Embedding Strategy

```typescript
const EMBEDDING_CONFIG = {
  MODEL: 'text-embedding-3-small',  // OpenAI model
  DIMENSIONS: 1536,                  // Vector dimensions
  MAX_BATCH_SIZE: 20,                // Texts per API call
};

const CHUNKING_CONFIG = {
  targetChunkSize: 512,   // tokens (~2048 characters)
  overlap: 64,            // tokens of overlap between chunks
  minChunkSize: 100,      // minimum characters per chunk
};
```

### Medical Abbreviation Expansion

The embedding service preprocesses clinical text by expanding common abbreviations:

| Abbreviation | Expansion |
|--------------|-----------|
| pt, pts | patient, patients |
| dx | diagnosis |
| hx | history |
| rx | prescription |
| tx | treatment |
| sob | shortness of breath |
| bp | blood pressure |
| dm | diabetes mellitus |
| htn | hypertension |
| cad | coronary artery disease |
| copd | chronic obstructive pulmonary disease |

Full list in `search.types.ts` → `MEDICAL_ABBREVIATIONS`

### Database Schema

#### Embeddings Table (`clinical_document_embeddings`)

```sql
CREATE TABLE clinical_document_embeddings (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,

    -- Source reference
    document_type VARCHAR(50),     -- 'encounter_note', 'discharge_summary'
    document_id UUID,

    -- Chunk info
    chunk_index INT,
    chunk_text TEXT,

    -- Vector (pgvector)
    embedding vector(1536),

    -- Denormalized for filtered search
    patient_id UUID,
    encounter_id UUID,
    facility_id UUID,
    department_id UUID,
    document_date TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT true
);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX idx_embedding_vector ON clinical_document_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 24, ef_construction = 200);
```

### Supported Document Types

| Type | Source Table | Content Field |
|------|--------------|---------------|
| `encounter_note` | `encounter_notes` | `note_content` |
| `discharge_summary` | `discharge_summaries` | `summary_content` |
| `clinical_note` | `clinical_notes` | `content` |
| `progress_note` | `progress_notes` | `content` |

### Search Filters

```typescript
interface SearchFilters {
  patientId?: string;        // Filter by specific patient
  encounterId?: string;      // Filter by encounter
  facilityId?: string;       // Filter by facility
  departmentId?: string;     // Filter by department
  specialtyCode?: string;    // Filter by specialty
  documentTypes?: string[];  // Filter by document type
  dateFrom?: Date;           // Documents from this date
  dateTo?: Date;             // Documents until this date
}
```

---

## Configuration Guide

### Environment Variables

Create `.env.local` in `backend/services/ai-gateway/`:

```bash
# Server
PORT=3015
NODE_ENV=development

# Database URLs (must match your docker-compose)
FOUNDATION_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"
CLINICAL_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical?schema=public"
RCM_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm?schema=public"
ANALYTICS_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_analytics?schema=public"

# AI Provider Configuration (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx    # For Report Builder
OPENAI_API_KEY=sk-xxxxx                  # For Semantic Search embeddings

# LLM Settings
LLM_PROVIDER=anthropic                   # 'anthropic' or 'openai'
LLM_MODEL=claude-sonnet-4-20250514       # Model for query planning
EMBEDDING_MODEL=text-embedding-3-small   # Embedding model
EMBEDDING_DIMENSIONS=1536                # Must match model

# Security
JWT_SECRET=your-jwt-secret

# Rate Limiting
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=10
AI_MAX_ROW_LIMIT=10000
AI_QUERY_TIMEOUT_MS=30000
```

### Getting API Keys

#### Anthropic (Claude)

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new key
5. Add to `ANTHROPIC_API_KEY`

#### OpenAI

1. Go to https://platform.openai.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new key
5. Add to `OPENAI_API_KEY`

### pgvector Setup

The semantic search requires pgvector extension in PostgreSQL.

#### Docker Setup (Recommended)

Update `docker-compose.yml`:

```yaml
postgres:
  image: pgvector/pgvector:pg16  # Use pgvector image
  # ... rest of config
```

Then restart:

```bash
docker-compose down
docker-compose up -d postgres
```

#### Manual Installation

```bash
# macOS
brew install pgvector

# Ubuntu/Debian
sudo apt install postgresql-16-pgvector

# Enable in database
psql -d zeal_clinical -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Database Migrations

After setting up pgvector, run Prisma migrations:

```bash
# Foundation DB (semantic catalog)
cd backend/shared/database-foundation
npx prisma generate && npx prisma db push

# Clinical DB (embeddings)
cd backend/shared/database-clinical
npx prisma generate && npx prisma db push

# Analytics DB (AI audit logs)
cd backend/shared/database-analytics
npx prisma generate && npx prisma db push
```

### Seeding the Semantic Catalog

```bash
cd seed
./run-seeds.sh foundation
```

This loads initial metrics and dimensions from `seed/foundation/18-semantic-catalog.sql`.

---

## Security & Compliance

### Tenant Isolation

**CRITICAL**: All queries are tenant-isolated at multiple layers:

1. **HTTP Middleware**: Extracts and validates `x-tenant-id` header
2. **AsyncLocalStorage**: Stores tenant context for the request lifecycle
3. **SQL Compiler**: ALWAYS injects `tenant_id = $tenant_id` as FIRST WHERE condition

```typescript
// sql-compiler.service.ts
private buildWhereClause(...) {
  const conditions: string[] = [];

  // CRITICAL: Always add tenant_id filter FIRST
  conditions.push(`tenant_id = $${paramIndex}`);
  parameters[`p${paramIndex}`] = tenantId;
  paramIndex++;

  // ... other filters
}
```

### SQL Injection Prevention

```typescript
const SECURITY_RULES = {
  // Whitelist-only operators
  ALLOWED_OPERATORS: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'between', ...],

  // Whitelist aggregations
  ALLOWED_AGGREGATIONS: ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'COUNT_DISTINCT'],

  // Forbidden patterns
  FORBIDDEN_PATTERNS: [
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /UNION\s+SELECT/i,
    /--/,
    /\/\*/,
  ],

  // Never selectable
  BLOCKED_COLUMNS: ['password_hash', 'totp_secret', 'api_key'],
};
```

### RBAC Integration

Each metric/dimension can have a `required_permission`:

```sql
-- Only users with 'rcm.reports.revenue' can query this metric
INSERT INTO semantic_metrics (name, required_permission, ...)
VALUES ('total_revenue', 'rcm.reports.revenue', ...);
```

The catalog service filters based on user permissions before sending to LLM.

### Audit Logging

All AI queries are logged to Analytics DB (`ai_query_logs`):

| Field | Description |
|-------|-------------|
| `tenant_id` | Tenant context |
| `user_id` | User who made the query |
| `feature` | `report_builder` or `semantic_search` |
| `query_text` | Original natural language query |
| `query_plan` | Generated JSON plan |
| `compiled_sql` | Final SQL (for debugging) |
| `execution_time_ms` | Query execution time |
| `model_used` | LLM model used |
| `input_tokens` | Tokens sent to LLM |
| `output_tokens` | Tokens received from LLM |

### PHI Considerations

- **Report Builder**: Returns data from database - same access controls as direct queries
- **Semantic Search**: Operates on indexed PHI with same access controls as source documents
- **Query Text**: User's question is NOT clinical content, stored for audit purposes
- **LLM Context**: Catalog descriptions sent to LLM, NOT actual patient data

---

## API Reference

### Report Builder Endpoints

#### POST /api/v1/reports/generate

Generate a report from natural language.

**Request:**
```json
{
  "query": "What is today's total revenue?",
  "limit": 1000,
  "format": "json",
  "debug": false
}
```

**Response:**
```json
{
  "columns": [
    { "name": "total_revenue", "displayName": "Total Revenue", "format": "currency" }
  ],
  "rows": [
    { "total_revenue": 15000.50 }
  ],
  "totalCount": 1,
  "executionTimeMs": 45
}
```

**Export Formats:**
- `json` (default)
- `excel` - Returns `.xlsx` file
- `csv` - Returns `.csv` file
- `pdf` - Returns `.pdf` file (limited to 50 rows)

#### POST /api/v1/reports/validate

Validate a query without executing.

#### GET /api/v1/reports/catalog

Get available metrics and dimensions for the current user.

#### GET /api/v1/reports/examples

Get example queries.

### Semantic Search Endpoints

#### POST /api/v1/search

Search clinical documents.

**Request:**
```json
{
  "query": "Patient with diabetes and hypertension",
  "patientId": "uuid",
  "documentTypes": ["encounter_note", "discharge_summary"],
  "dateFrom": "2024-01-01",
  "limit": 10,
  "minSimilarity": 0.7
}
```

**Response:**
```json
{
  "results": [
    {
      "documentId": "uuid",
      "documentType": "encounter_note",
      "patientId": "uuid",
      "chunkText": "Patient presents with **diabetes** mellitus type 2 and **hypertension**...",
      "highlightedText": "...",
      "similarity": 0.89,
      "documentDate": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 5,
  "queryEmbeddingTime": 120,
  "searchTime": 35
}
```

#### POST /api/v1/search/similar

Find documents similar to a given document.

#### POST /api/v1/search/embed

Queue a document for embedding.

#### GET /api/v1/search/stats

Get embedding statistics.

#### POST /api/v1/search/reindex

Start bulk reindexing of documents.

### Patient Narrative Endpoints

#### POST /api/v1/ai/patients/:patientId/narrative

Generate a specialty-aware **AI Care Narrative** for a patient. Used by the Care Context
timeline panel. The service reads the patient's demographics, encounters, and latest
observations from the Clinical database (all tenant-scoped), assembles a
`ClinicalSummaryContext`, and calls the configured LLM with the shared clinical-summary
prompt.

**Path params:** `patientId` (UUID).

**Query params:** `dryRun` (boolean, optional) — return the assembled prompt without
calling the LLM.

**Request body (optional):**
```json
{ "specialty": "Oncology" }
```
`specialty` tunes the emphasis of the summary. When omitted it is inferred from the
patient's problem list and encounter types.

**Response (200):**
```json
{
  "available": true,
  "narrative": "Snapshot — 61F, metastatic colorectal carcinoma ...",
  "specialty": "Oncology",
  "model": "claude-sonnet-4-20250514",
  "sourceCount": 7,
  "generatedAt": "2026-07-15T10:30:00.000Z"
}
```

**Response (200, `?dryRun=true`):**
```json
{
  "dryRun": true,
  "specialty": "Oncology",
  "sourceCount": 7,
  "messages": [
    { "role": "system", "content": "You are a clinical summarisation assistant ..." },
    { "role": "user", "content": "READING CLINICIAN SPECIALTY: Oncology ..." }
  ]
}
```

**Graceful degradation (503):** when no LLM provider/API key is configured (the common
dev case), or the patient's clinical data cannot be assembled, the endpoint returns a
structured body so the frontend can fall back to its local narrative preview:
```json
{ "available": false, "reason": "The AI Gateway is missing an Anthropic API key ..." }
```
The frontend (`useCareNarrative` hook / `careNarrativeService`) treats this `503` as a
non-error signal and renders the deterministic client-side `buildNarrativePreview()`
output, clearly labelled as a preview.

**Required headers:** `x-tenant-id` (and standard auth headers); the query is
tenant-scoped.

---

## Troubleshooting

### Common Errors

#### P1010: Database Connection Error

```
PrismaClientInitializationError: P1010
```

**Cause**: Wrong database credentials or database doesn't exist.

**Solution**: Check `.env.local` matches your docker-compose credentials.

#### pgvector Extension Not Available

```
ERROR: extension "vector" is not available
```

**Solution**: Use `pgvector/pgvector:pg16` Docker image:

```yaml
postgres:
  image: pgvector/pgvector:pg16
```

#### LLM API Key Invalid

```
AuthenticationError: Invalid API key
```

**Solution**: Verify API keys in `.env.local`:
- `ANTHROPIC_API_KEY` for Report Builder
- `OPENAI_API_KEY` for Semantic Search

#### Query Plan Validation Failed

```
BadRequestException: Invalid query plan: Unknown metric: xyz
```

**Cause**: User asked for a metric not in the catalog.

**Solution**: Check available metrics via `GET /api/v1/reports/catalog`.

### Logs

The service uses Pino for structured logging:

```bash
# Development (pretty printed)
npm run dev --workspace=@zeal/ai-gateway

# Production
LOG_LEVEL=info npm run start --workspace=@zeal/ai-gateway
```

### Health Checks

```bash
# Full health check
curl http://localhost:3015/api/v1/health

# Readiness (for k8s)
curl http://localhost:3015/api/v1/health/ready

# Liveness (for k8s)
curl http://localhost:3015/api/v1/health/live
```

---

## Cost Optimization

| Item | Strategy | Savings |
|------|----------|---------|
| LLM Calls | Use Claude Sonnet (not Opus) | 3x cheaper |
| Query Caching | Cache plans by query hash | -70% LLM calls |
| Embeddings | Use text-embedding-3-small | 6x cheaper than large |
| Batch Embeddings | 20 texts per API call | Faster, same cost |
| Incremental Sync | Only embed changed documents | -90% embedding costs |

---

## Future Enhancements

1. **Cross-Database Queries**: Join data across Clinical and RCM in application layer
2. **Query Plan Caching**: Redis-based cache for repeated queries
3. **Streaming Results**: For large result sets
4. **Custom Metrics**: Tenant-specific metric definitions
5. **Advanced Search**: BM25 + vector hybrid search
6. **Similar Patient Finder**: Find patients with similar clinical profiles
7. **Chart Annotations**: Add notes and highlights to chart visualizations
8. **Chart Export**: Export charts as PNG/SVG images
9. **Dashboard Builder**: Save and combine multiple charts into dashboards
