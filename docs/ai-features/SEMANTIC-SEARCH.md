# Clinical Semantic Search - Technical Documentation

## Overview

The Clinical Semantic Search feature enables vector-based similarity search over clinical documents using PostgreSQL pgvector. It allows clinicians to find relevant clinical notes, discharge summaries, and other documents using natural language queries.

**Frontend URL:** `http://localhost:3000/en/search`

## Database & Tables

### Database: **zeal_clinical**

All semantic search data resides in the Clinical database to maintain PHI isolation.

### Core Tables

#### 1. `clinical_document_embeddings` (Primary Search Table)

Stores vector embeddings of clinical documents for similarity search.

```sql
CREATE TABLE clinical_document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,

    -- Document reference
    document_type VARCHAR(50) NOT NULL,  -- 'encounter_note', 'discharge_summary', etc.
    document_id UUID NOT NULL,

    -- Chunk information
    chunk_index INT NOT NULL DEFAULT 0,
    chunk_text TEXT NOT NULL,

    -- Vector embedding (pgvector)
    embedding vector(1536) NOT NULL,

    -- Denormalized fields for filtered search
    patient_id UUID,
    encounter_id UUID,
    facility_id UUID,
    department_id UUID,
    specialty_code VARCHAR(50),
    document_date TIMESTAMPTZ,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    embedded_at TIMESTAMPTZ DEFAULT NOW(),
    embedding_model VARCHAR(100) DEFAULT 'text-embedding-3-small',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cde_tenant ON clinical_document_embeddings(tenant_id);
CREATE INDEX idx_cde_patient ON clinical_document_embeddings(tenant_id, patient_id);
CREATE INDEX idx_cde_document ON clinical_document_embeddings(tenant_id, document_type, document_id);
CREATE INDEX idx_cde_date ON clinical_document_embeddings(tenant_id, document_date);
CREATE INDEX idx_cde_facility ON clinical_document_embeddings(tenant_id, facility_id);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX idx_cde_embedding ON clinical_document_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 24, ef_construction = 200);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `tenant_id` | UUID | Multi-tenancy isolation |
| `document_type` | VARCHAR(50) | Type of document |
| `document_id` | UUID | Reference to source document |
| `chunk_index` | INT | Chunk number (0-indexed) |
| `chunk_text` | TEXT | Actual text content |
| `embedding` | vector(1536) | OpenAI embedding vector |
| `patient_id` | UUID | Denormalized for filtering |
| `encounter_id` | UUID | Denormalized for filtering |
| `facility_id` | UUID | Denormalized for filtering |
| `department_id` | UUID | Denormalized for filtering |
| `specialty_code` | VARCHAR(50) | Medical specialty |
| `document_date` | TIMESTAMPTZ | Document creation date |
| `is_active` | BOOLEAN | Soft delete flag |
| `embedded_at` | TIMESTAMPTZ | When embedding was created |
| `embedding_model` | VARCHAR(100) | Model used for embedding |

#### 2. `embedding_sync_status` (Job Queue Table)

Tracks documents pending embedding generation.

```sql
CREATE TABLE embedding_sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,

    -- Document reference
    document_type VARCHAR(50) NOT NULL,
    document_id UUID NOT NULL,

    -- Processing status
    status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    attempt_count INT DEFAULT 0,
    error_message TEXT,
    last_attempt_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for job polling
CREATE INDEX idx_ess_status ON embedding_sync_status(status, attempt_count);
CREATE INDEX idx_ess_tenant ON embedding_sync_status(tenant_id, status);
CREATE UNIQUE INDEX idx_ess_document ON embedding_sync_status(tenant_id, document_type, document_id);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `tenant_id` | UUID | Multi-tenancy isolation |
| `document_type` | VARCHAR(50) | Type of document to embed |
| `document_id` | UUID | Reference to source document |
| `status` | VARCHAR(20) | Processing status |
| `attempt_count` | INT | Number of processing attempts |
| `error_message` | TEXT | Error details if failed |
| `last_attempt_at` | TIMESTAMPTZ | Last processing attempt time |

### Source Document Tables

These tables contain the original clinical content that gets embedded.

#### 3. `encounter_notes`

Clinical notes written during patient encounters.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Document ID |
| `tenant_id` | UUID | Tenant isolation |
| `encounter_id` | UUID | Link to encounter |
| `patient_id` | UUID | Link to patient |
| `note_content` | TEXT | Note text (embedded) |
| `note_type` | VARCHAR | Type of note |
| `created_at` | TIMESTAMPTZ | When note was created |
| `created_by` | UUID | Author (staff) |

#### 4. `clinical_discharge_summary`

Discharge summaries from inpatient admissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Document ID |
| `tenant_id` | UUID | Tenant isolation |
| `admission_id` | UUID | Link to admission |
| `encounter_id` | UUID | Link to encounter |
| `patient_id` | UUID | Link to patient |
| `facility_id` | UUID | Which facility |
| `summary_content` | TEXT | Summary text (embedded) |
| `finalized_at` | TIMESTAMPTZ | When finalized |

#### 5. `inpatient_admissions`

Context provider for discharge summaries (lookup table).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Admission ID |
| `patient_id` | UUID | Patient reference |
| `encounter_id` | UUID | Encounter reference |
| `facility_id` | UUID | Facility reference |
| `department_id` | UUID | Department reference |

## Supported Document Types

| Document Type | Source Table | Content Field | Description |
|--------------|--------------|---------------|-------------|
| `encounter_note` | `encounter_notes` | `note_content` | Clinical notes from encounters |
| `discharge_summary` | `clinical_discharge_summary` | `summary_content` | Inpatient discharge summaries |
| `clinical_note` | `clinical_notes` | `content` | General clinical notes |
| `progress_note` | `progress_notes` | `content` | Patient progress notes |
| `consultation_note` | `consultation_notes` | `content` | Specialist consultations |
| `procedure_note` | `procedure_notes` | `content` | Procedure documentation |
| `operative_note` | `operative_notes` | `content` | Surgical operation notes |

## Technical Architecture

### Embedding Pipeline

```
Document Created/Updated
        │
        ▼
┌───────────────────────────────────────────┐
│  1. Queue Entry (embedding_sync_status)    │
│     status = 'pending'                     │
└───────────────────────────────────────────┘
        │
        ▼ (Every 30 seconds - Cron Job)
┌───────────────────────────────────────────┐
│  2. Embedding Sync Service                 │
│     - Polls pending documents              │
│     - Batches up to 20 texts               │
│     - Updates status = 'processing'        │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  3. Text Preprocessing                     │
│     - Medical abbreviation expansion       │
│     - Normalize whitespace                 │
│     - Remove special characters            │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  4. Document Chunking                      │
│     - Target: 512 tokens per chunk         │
│     - Overlap: 64 tokens                   │
│     - Min chunk: 100 characters            │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  5. OpenAI Embedding API                   │
│     - Model: text-embedding-3-small        │
│     - Dimensions: 1536                     │
│     - Batch size: 20                       │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  6. Store in clinical_document_embeddings  │
│     - One row per chunk                    │
│     - status = 'completed'                 │
└───────────────────────────────────────────┘
```

### Search Flow

```
User Query: "Patient with diabetes and hypertension"
        │
        ▼
┌───────────────────────────────────────────┐
│  1. Query Preprocessing                    │
│     - Expand abbreviations (dm → diabetes) │
│     - Normalize text                       │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  2. Generate Query Embedding               │
│     - OpenAI text-embedding-3-small        │
│     - 1536-dimension vector                │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  3. pgvector Similarity Search             │
│     - L2 distance: embedding <=> query     │
│     - Apply filters (tenant, patient, etc) │
│     - HNSW index for fast ANN search       │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  4. Result Processing                      │
│     - Rank by similarity score             │
│     - Highlight matching terms             │
│     - Return top N results                 │
└───────────────────────────────────────────┘
```

## Configuration

### Environment Variables

```bash
# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-xxxxx

# Embedding Settings
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# Sync Job Settings
EMBEDDING_SYNC_INTERVAL_MS=30000       # 30 seconds
EMBEDDING_BATCH_SIZE=20
EMBEDDING_MAX_RETRIES=3
```

### Chunking Configuration

```typescript
const CHUNKING_CONFIG = {
  targetChunkSize: 512,   // tokens (~2048 characters)
  overlap: 64,            // tokens of overlap between chunks
  minChunkSize: 100,      // minimum characters per chunk
};
```

## API Endpoints

### POST /api/v1/search

Search clinical documents.

**Request:**
```json
{
  "query": "Patient with diabetes and hypertension",
  "patientId": "uuid",
  "documentTypes": ["encounter_note", "discharge_summary"],
  "facilityId": "uuid",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31",
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
      "encounterId": "uuid",
      "chunkText": "Patient presents with diabetes mellitus type 2...",
      "highlightedText": "Patient presents with **diabetes** mellitus...",
      "similarity": 0.89,
      "documentDate": "2024-01-15T10:30:00Z",
      "facilityId": "uuid"
    }
  ],
  "totalCount": 5,
  "queryEmbeddingTime": 120,
  "searchTime": 35
}
```

### POST /api/v1/search/similar

Find documents similar to a given document.

### POST /api/v1/search/embed

Queue a document for embedding.

### GET /api/v1/search/stats

Get embedding statistics for the tenant.

### POST /api/v1/search/reindex

Start bulk reindexing of all documents.

## Security & Compliance

### Tenant Isolation

All queries are filtered by `tenant_id`:

```sql
SELECT * FROM clinical_document_embeddings
WHERE tenant_id = $1  -- Always first filter
  AND embedding <=> $query_vector < $threshold
  AND ...other filters...
ORDER BY embedding <=> $query_vector
LIMIT $limit;
```

### PHI Handling

- All clinical document content is PHI
- Embeddings are stored in the same security zone as source documents
- Access controls match source document permissions
- Audit logging for all search operations

### Data Residency

- Embeddings generated via OpenAI API (data sent externally)
- Embeddings stored in local/regional PostgreSQL
- Query text is sent to OpenAI for embedding generation

## Performance Considerations

### HNSW Index

The HNSW (Hierarchical Navigable Small World) index provides:
- O(log n) query time
- ~95% recall accuracy
- Configurable speed/accuracy tradeoff

```sql
CREATE INDEX idx_embedding_vector ON clinical_document_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 24, ef_construction = 200);
```

### Optimization Tips

| Technique | Benefit |
|-----------|---------|
| Denormalized fields | Fast filtering without joins |
| HNSW index | Sub-millisecond vector search |
| Batch embedding | Reduced API calls |
| Incremental sync | Only embed changed documents |
| Chunk overlap | Better context preservation |

## Troubleshooting

### pgvector Not Available

```
ERROR: extension "vector" is not available
```

**Solution:** Use pgvector Docker image:
```yaml
postgres:
  image: pgvector/pgvector:pg16
```

### Slow Search Queries

1. Check HNSW index exists
2. Verify `ef_search` parameter (higher = more accurate but slower)
3. Check filter selectivity (add indexes on frequently filtered columns)

### Embedding Failures

Check `embedding_sync_status` for failed jobs:
```sql
SELECT * FROM embedding_sync_status
WHERE status = 'failed'
ORDER BY last_attempt_at DESC;
```

## Related Documentation

- [AI Features Overview](./AI-FEATURES-OVERVIEW.md)
- [AI/ML Architecture ADR](../adr/ADR-0006-ai-ml-architecture.md)
- [Dashboard Redis Caching](../plan/dashboard-redis-caching.md)
