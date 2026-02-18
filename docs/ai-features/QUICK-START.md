# AI Features Quick Start Guide

Get the AI Gateway service running in 5 minutes.

## Prerequisites

- Docker running with `pgvector/pgvector:pg16` image
- Anthropic API key (for Report Builder)
- OpenAI API key (for Semantic Search)

## Step 1: Update Docker Image

Edit `docker-compose.yml`:

```yaml
postgres:
  image: pgvector/pgvector:pg16  # Changed from postgres:16-alpine
```

Restart PostgreSQL:

```bash
cd /Users/sajithchandran/aira/zeal
docker-compose down
docker-compose up -d postgres
```

## Step 2: Install Dependencies

```bash
cd /Users/sajithchandran/aira/zeal/backend
npm install
```

## Step 3: Configure API Keys

Edit `backend/services/ai-gateway/.env.local`:

```bash
# Add your actual API keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
OPENAI_API_KEY=sk-xxxxx
```

## Step 4: Run Database Migrations

```bash
# Foundation DB
cd /Users/sajithchandran/aira/zeal/backend/shared/database-foundation
npx prisma generate && npx prisma db push

# Clinical DB
cd /Users/sajithchandran/aira/zeal/backend/shared/database-clinical
npx prisma generate && npx prisma db push

# Analytics DB
cd /Users/sajithchandran/aira/zeal/backend/shared/database-analytics
npx prisma generate && npx prisma db push
```

## Step 5: Seed the Semantic Catalog

```bash
cd /Users/sajithchandran/aira/zeal/seed
./run-seeds.sh foundation
```

## Step 6: Start the Service

```bash
cd /Users/sajithchandran/aira/zeal/backend
npm run dev --workspace=@zeal/ai-gateway
```

## Step 7: Verify

Open http://localhost:3015/api/docs for Swagger UI.

### Test Report Builder

```bash
curl -X POST http://localhost:3015/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_UUID" \
  -H "x-user-id: YOUR_USER_UUID" \
  -H "x-facility-id: YOUR_FACILITY_UUID" \
  -d '{"query": "What is the total patient count?"}'
```

### Test Semantic Search

```bash
curl -X POST http://localhost:3015/api/v1/search \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_UUID" \
  -H "x-user-id: YOUR_USER_UUID" \
  -H "x-facility-id: YOUR_FACILITY_UUID" \
  -d '{"query": "diabetes and hypertension"}'
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `P1010` database error | Check credentials in `.env.local` match docker-compose |
| `vector extension not available` | Use `pgvector/pgvector:pg16` Docker image |
| `Invalid API key` | Verify `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` |
| `Unknown metric` | Run seed script: `./run-seeds.sh foundation` |

## Next Steps

- Read [AI-FEATURES-OVERVIEW.md](./AI-FEATURES-OVERVIEW.md) for full documentation
- Configure additional metrics in `seed/foundation/18-semantic-catalog.sql`
- Set up embedding sync triggers for clinical notes
