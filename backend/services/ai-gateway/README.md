# AI Gateway Service

The AI Gateway service provides AI-powered features for the Zeal healthcare platform.

## Features

### 1. Natural Language Report Builder

Convert natural language queries into safe, tenant-isolated SQL reports.

**Example queries:**
- "What is today's total revenue?"
- "Show me patient count by gender"
- "Revenue by department this month"

**API Endpoints:**
- `POST /api/v1/reports/generate` - Generate a report from natural language
- `POST /api/v1/reports/validate` - Validate a query without executing
- `GET /api/v1/reports/catalog` - Get available metrics and dimensions
- `GET /api/v1/reports/examples` - Get example queries

### 2. Clinical Semantic Search

Vector-based semantic search over clinical notes and discharge summaries.

**Example searches:**
- "Patient with diabetes and hypertension"
- "Cardiac symptoms and chest pain"
- "Post-operative complications"

**API Endpoints:**
- `POST /api/v1/search` - Search clinical documents
- `POST /api/v1/search/similar` - Find similar documents
- `POST /api/v1/search/embed` - Queue document for embedding
- `GET /api/v1/search/stats` - Get embedding statistics
- `POST /api/v1/search/reindex` - Start bulk reindex

## Configuration

### Environment Variables

```bash
# Server
PORT=3015
NODE_ENV=development

# Database URLs (required)
FOUNDATION_DATABASE_URL=postgresql://...
CLINICAL_DATABASE_URL=postgresql://...
RCM_DATABASE_URL=postgresql://...
ANALYTICS_DATABASE_URL=postgresql://...

# AI Provider Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key

# LLM Settings
LLM_PROVIDER=anthropic  # or 'openai'
LLM_MODEL=claude-sonnet-4-20250514
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# Security
JWT_SECRET=your-jwt-secret

# Rate Limiting
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=10
AI_MAX_ROW_LIMIT=10000
AI_QUERY_TIMEOUT_MS=30000
```

## Prerequisites

### 1. pgvector Extension

The semantic search feature requires the pgvector extension in the Clinical database.

```bash
# Install pgvector (PostgreSQL)
# On Ubuntu/Debian:
sudo apt install postgresql-16-pgvector

# On macOS with Homebrew:
brew install pgvector

# Enable in database:
psql -d zeal_clinical -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. API Keys

- **Anthropic API Key**: For Claude-based query planning (Report Builder)
- **OpenAI API Key**: For embeddings (Semantic Search)

## Development

### Starting the Service

The development command regenerates the Foundation, Clinical, RCM, and
Analytics Prisma clients (AI Gateway reads from all four domain databases)
before starting. Generated clients are intentionally not committed.

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# The service will start on http://localhost:3015
# Swagger docs available at http://localhost:3015/api/docs
```

### Running Database Migrations

After updating the Prisma schemas, run:

```bash
# Foundation DB (semantic catalog tables)
cd backend/shared/database-foundation
npx prisma generate
npx prisma db push

# Clinical DB (embedding tables)
cd backend/shared/database-clinical
npx prisma generate
npx prisma db push

# Analytics DB (AI audit logs)
cd backend/shared/database-analytics
npx prisma generate
npx prisma db push
```

### Seeding the Semantic Catalog

```bash
cd seed
./run-seeds.sh foundation  # Includes semantic catalog
```

## Architecture

```
ai-gateway/
├── src/
│   ├── modules/
│   │   ├── report-builder/      # Natural Language Report Builder
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   │   ├── query-planner.service.ts   # NL → JSON Plan
│   │   │   │   ├── sql-compiler.service.ts    # JSON → SQL
│   │   │   │   ├── query-executor.service.ts  # Execute SQL
│   │   │   │   ├── catalog.service.ts         # Semantic catalog
│   │   │   │   └── export.service.ts          # Excel/PDF/CSV
│   │   │   └── types/
│   │   └── semantic-search/     # Clinical Semantic Search
│   │       ├── controllers/
│   │       └── services/
│   │           ├── embedding.service.ts       # Text → Vector
│   │           ├── search.service.ts          # Vector search
│   │           ├── embedding-sync.service.ts  # CDC sync
│   │           └── reindex.service.ts         # Bulk reindex
│   └── shared/
│       └── llm-client/          # LLM abstraction layer
```

## Security

### Tenant Isolation

- All queries automatically include `tenant_id` filter
- No cross-tenant data access possible
- Metrics and dimensions are permission-filtered

### SQL Injection Prevention

- Whitelist-only operators (no raw SQL)
- Parameterized queries only
- Forbidden pattern detection

### Rate Limiting

- Per-user query limits (configurable)
- Row limits (max 10,000)
- Query timeout (30 seconds)

## API Documentation

Full Swagger documentation available at:
- Local: http://localhost:3015/api/docs
- Development: https://api-dev.zeal.health/ai-gateway/api/docs

## Monitoring

### Health Checks

- `GET /api/v1/health` - Full health check
- `GET /api/v1/health/ready` - Readiness probe
- `GET /api/v1/health/live` - Liveness probe

### Audit Logging

All AI queries are logged to the Analytics database:
- Query text
- Generated plan
- Execution time
- Token usage
- User and tenant context
