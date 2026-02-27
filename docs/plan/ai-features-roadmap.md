# AI Features Roadmap & Implementation Plan

## Overview

This document outlines the complete AI features roadmap for the Zeal Healthcare Platform, including implemented features, in-progress work, and future enhancements.

## Current State Summary

| Feature | Status | Service | Database |
|---------|--------|---------|----------|
| Natural Language Report Builder | Implemented | ai-gateway | Foundation, Clinical, RCM |
| Clinical Semantic Search | Implemented | ai-gateway | Clinical (pgvector) |
| Dashboard Metrics Caching | Implemented | ai-gateway | Redis + Clinical, RCM |
| Chart Visualization | Implemented | Frontend | N/A |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Frontend (Next.js)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │   Reports   │  │   Search    │  │  Smart Charting     │ │
│  │  /dashboard │  │   /reports  │  │   /search   │  │  /encounters/[id]   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────┼─────────────────────┼───────────┘
          │                │                │                     │
          ▼                ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI Gateway Service (Port 3015)                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │  Report Builder  │  │  Semantic Search │  │    Dashboard Cache         │ │
│  │    Module        │  │     Module       │  │       Service              │ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────────────┬──────────────┘ │
│           │                     │                          │                │
│  ┌────────▼─────────────────────▼──────────────────────────▼──────────────┐ │
│  │                        Shared Services                                  │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │ │
│  │  │ LLM Client  │  │   Redis     │  │   Logging   │  │  Observability│  │ │
│  │  │ (Anthropic/ │  │   Service   │  │   Service   │  │    Module     │  │ │
│  │  │  OpenAI)    │  │             │  │             │  │               │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
          │                     │                          │
          ▼                     ▼                          ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Foundation  │  │   Clinical   │  │     RCM      │  │    Redis     │
│      DB      │  │      DB      │  │      DB      │  │    Cache     │
│              │  │  (pgvector)  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Implemented Features

### 1. Natural Language Report Builder

**Status:** Production Ready

**Description:** Converts natural language queries into safe, tenant-isolated SQL reports with support for multiple export formats.

**Components:**
- Query Planner (LLM-based NL → JSON plan)
- SQL Compiler (JSON plan → parameterized SQL)
- Query Executor (multi-database execution)
- Export Service (Excel, PDF, CSV)
- Catalog Service (semantic metrics/dimensions)

**Database Usage:**

| Database | Tables | Purpose |
|----------|--------|---------|
| Analytics | `semantic_metrics` | Metric definitions |
| Analytics | `semantic_dimensions` | Dimension definitions |
| Analytics | `semantic_join_paths` | Join path definitions |
| Clinical | Various | Patient, appointment, encounter data |
| RCM | Various | Invoice, payment, claim data |
| Foundation | Various | Facility, staff data |

**Key Files:**
- `backend/services/ai-gateway/src/modules/report-builder/`
- `frontend/src/modules/reporting/`
- `frontend/src/app/[locale]/(dashboard)/reports/`

**API Endpoints:**
- `POST /api/v1/reports/generate` - Generate report
- `POST /api/v1/reports/validate` - Validate query
- `GET /api/v1/reports/catalog` - Get metrics/dimensions
- `GET /api/v1/reports/examples` - Get example queries

---

### 2. Clinical Semantic Search

**Status:** Production Ready

**Description:** Vector-based semantic search over clinical documents using PostgreSQL pgvector for similarity matching.

**Components:**
- Embedding Service (OpenAI text-embedding-3-small)
- Search Service (pgvector similarity search)
- Embedding Sync Service (background CDC-based sync)
- Reindex Service (bulk reindexing)

**Database Usage:**

| Database | Table | Purpose |
|----------|-------|---------|
| Clinical | `clinical_document_embeddings` | Vector storage (1536 dimensions) |
| Clinical | `embedding_sync_status` | Job queue for pending embeddings |
| Clinical | `encounter_notes` | Source document content |
| Clinical | `clinical_discharge_summary` | Source document content |
| Clinical | `inpatient_admissions` | Context for discharge summaries |

**Key Files:**
- `backend/services/ai-gateway/src/modules/semantic-search/`
- `frontend/src/modules/semantic-search/`
- `frontend/src/app/[locale]/(dashboard)/search/`

**API Endpoints:**
- `POST /api/v1/search` - Search documents
- `POST /api/v1/search/similar` - Find similar documents
- `POST /api/v1/search/embed` - Queue document for embedding
- `GET /api/v1/search/stats` - Get embedding statistics
- `POST /api/v1/search/reindex` - Start bulk reindexing

---

### 3. Dashboard Metrics Caching

**Status:** Production Ready

**Description:** Redis-based caching for dashboard metrics to eliminate repeated database and LLM queries, reducing load time from ~5-10s to ~50-100ms.

**Components:**
- Redis Service (global caching layer)
- Dashboard Cache Service (metric fetching and caching)
- Dashboard Cache Job (scheduled cache warming)

**Database/Cache Usage:**

| System | Key Pattern | Purpose |
|--------|-------------|---------|
| Redis | `dashboard:metrics:{tenantId}:{currency}` | Cached metrics |
| Clinical | `patients`, `appointments`, `encounters` | Source metrics |
| RCM | `invoices` | Revenue/billing metrics |
| Foundation | `facilities` | Facility metrics |

**Key Files:**
- `backend/services/ai-gateway/src/shared/redis/`
- `backend/services/ai-gateway/src/modules/report-builder/services/dashboard-cache.service.ts`
- `backend/services/ai-gateway/src/modules/report-builder/jobs/dashboard-cache.job.ts`
- `frontend/src/modules/reporting/hooks/use-dashboard-metrics.ts`

**API Endpoints:**
- `GET /api/v1/reports/dashboard/metrics` - Get cached metrics
- `POST /api/v1/reports/dashboard/refresh` - Force cache refresh

---

### 4. Chart Visualization

**Status:** Production Ready

**Description:** Interactive chart visualization for report results using Recharts, with smart chart type detection.

**Components:**
- Report Chart Component (Bar, Line, Pie, Area)
- View Toggle (Table/Chart switch)
- Chart Type Selector
- Chartability Detection

**Key Files:**
- `frontend/src/modules/reporting/components/report-chart.tsx`
- `frontend/src/components/ui/toggle-group.tsx`

---

## In Progress / Planned Features

### Phase 1: Smart Charting (Q1 2025)

**Status:** In Progress

**Description:** AI-powered clinical documentation with real-time suggestions during encounter charting.

**Planned Components:**
- Smart Note Suggestions
- Auto-complete for diagnoses
- Medication interaction alerts
- Template recommendations

**Database Impact:**
- New table: `ai_note_suggestions` in Clinical DB
- New table: `ai_suggestion_feedback` in Analytics DB

---

### Phase 2: Clinical Decision Support (Q2 2025)

**Description:** AI-assisted clinical decision support for diagnoses and treatment recommendations.

**Planned Components:**
- Differential Diagnosis Assistant
- Treatment Protocol Suggestions
- Lab Result Interpretation
- Risk Score Calculations

**Technical Approach:**
- RAG (Retrieval Augmented Generation) over medical guidelines
- Integration with clinical protocols database
- HITL (Human-in-the-Loop) validation required

---

### Phase 3: Operational AI (Q2-Q3 2025)

**Description:** AI for operational optimization including scheduling, resource allocation, and predictive analytics.

**Planned Features:**
- No-Show Prediction
- Appointment Scheduling Optimization
- Resource Utilization Forecasting
- Wait Time Prediction

**Technical Approach:**
- Classical ML models (XGBoost, Prophet)
- Cloud deployment (anonymized data)
- Real-time inference API

---

### Phase 4: Revenue Cycle AI (Q3 2025)

**Description:** AI-powered revenue cycle management including coding assistance and denial prediction.

**Planned Features:**
- Medical Coding Assistance (ICD-10, CPT)
- Claim Denial Prediction
- Underpayment Detection
- Prior Authorization Automation

**Technical Approach:**
- Fine-tuned LLM for medical coding
- ML models for denial prediction
- Integration with payer systems

---

### Phase 5: Document AI (Q4 2025)

**Description:** Automated document processing including OCR, form extraction, and EOB parsing.

**Planned Features:**
- OCR for handwritten notes
- EOB Parsing and reconciliation
- Insurance card extraction
- Patient form digitization

**Technical Approach:**
- Computer Vision models
- LayoutLM for document understanding
- On-premises deployment (PHI)

---

## Technical Debt & Improvements

### Performance Optimizations

| Item | Priority | Effort | Impact |
|------|----------|--------|--------|
| Query Plan Caching | High | Medium | Reduce LLM calls by 70% |
| Streaming Results | Medium | High | Handle large result sets |
| Hybrid Search (BM25 + Vector) | Medium | Medium | Better search accuracy |
| Embedding Model Upgrade | Low | Low | Better semantic understanding |

### Security Enhancements

| Item | Priority | Effort |
|------|----------|--------|
| AI Query Rate Limiting | High | Low |
| PII Masking in Logs | High | Medium |
| Model Output Validation | Medium | Medium |
| Audit Log Analytics | Low | High |

### Developer Experience

| Item | Priority | Effort |
|------|----------|--------|
| Custom Metric Builder UI | Medium | High |
| Search Query Builder | Low | Medium |
| AI Playground/Sandbox | Low | High |

---

## Configuration Reference

### Required Environment Variables

```bash
# AI Gateway Service (.env.local)

# Server
PORT=3015
NODE_ENV=development

# Database URLs
FOUNDATION_DATABASE_URL="postgresql://..."
CLINICAL_DATABASE_URL="postgresql://..."
RCM_DATABASE_URL="postgresql://..."
ANALYTICS_DATABASE_URL="postgresql://..."

# AI Providers
ANTHROPIC_API_KEY=sk-ant-xxx        # Report Builder
OPENAI_API_KEY=sk-xxx               # Semantic Search

# LLM Configuration
LLM_PROVIDER=anthropic
LLM_MODEL=claude-sonnet-4-20250514
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# Redis (Dashboard Caching)
REDIS_URL=redis://localhost:6379
DASHBOARD_CACHE_TTL_MINUTES=30
DASHBOARD_CACHE_WARMING_ENABLED=true

# Security
JWT_SECRET=xxx
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=10
AI_MAX_ROW_LIMIT=10000
AI_QUERY_TIMEOUT_MS=30000
```

---

## Cost Estimation

### Current Monthly Costs (Estimated)

| Service | Usage | Unit Cost | Monthly Cost |
|---------|-------|-----------|--------------|
| Anthropic Claude Sonnet | 100K queries | $0.003/1K tokens | ~$300 |
| OpenAI Embeddings | 500K documents | $0.0001/1K tokens | ~$50 |
| Redis Cloud | 1GB cache | - | ~$15 |
| **Total** | | | **~$365** |

### Cost Optimization Strategies

1. **Query Plan Caching** - Cache LLM responses for identical queries
2. **Batch Embeddings** - Process 20 documents per API call
3. **Incremental Sync** - Only embed changed documents
4. **Model Selection** - Use smaller models where appropriate

---

## Success Metrics

### Report Builder

| Metric | Target | Current |
|--------|--------|---------|
| Query Success Rate | >95% | ~92% |
| Average Response Time | <3s | ~2.5s |
| User Satisfaction | >4.5/5 | TBD |

### Semantic Search

| Metric | Target | Current |
|--------|--------|---------|
| Search Relevance (P@10) | >0.8 | ~0.85 |
| Query Latency | <200ms | ~150ms |
| Index Coverage | >99% | ~98% |

### Dashboard Caching

| Metric | Target | Current |
|--------|--------|---------|
| Cache Hit Rate | >90% | TBD |
| Load Time (cached) | <100ms | ~80ms |
| Load Time (uncached) | <3s | ~2s |

---

## Related Documentation

- [AI Features Overview](../ai-features/AI-FEATURES-OVERVIEW.md)
- [Semantic Search Technical Docs](../ai-features/SEMANTIC-SEARCH.md)
- [Dashboard Redis Caching](./dashboard-redis-caching.md)
- [AI/ML Architecture ADR](../adr/ADR-0006-ai-ml-architecture.md)
- [Quick Start Guide](../ai-features/QUICK-START.md)
