# Observability Architecture

A comprehensive guide to implementing full-stack observability for the Zeal Healthcare Platform.

---

## Table of Contents

1. [Purpose](#purpose)
2. [Technology Stack](#technology-stack)
3. [Why This Choice](#why-this-choice)
4. [Architecture Overview](#architecture-overview)
5. [Configuration-Driven Approach](#configuration-driven-approach)
6. [Environment Configuration Matrix](#environment-configuration-matrix)
7. [Implementation Guide](#implementation-guide)
8. [Benefits](#benefits)
9. [Quick Start](#quick-start)

---

## Purpose

Observability provides deep insight into the internal state of the Zeal Healthcare Platform through three pillars:

### The Three Pillars of Observability

| Pillar | What It Captures | Use Cases |
|--------|------------------|-----------|
| **Metrics** | Numerical measurements over time | Performance monitoring, alerting, capacity planning |
| **Logs** | Discrete events with context | Debugging, audit trails, error investigation |
| **Traces** | Request flow across services | Distributed debugging, latency analysis, dependency mapping |

### Why Observability Matters for Healthcare

1. **Patient Safety**: Quick identification and resolution of system issues that could impact care delivery
2. **Compliance**: Audit trails required by healthcare regulations (HIPAA, DHA, MOHAP)
3. **Performance**: Ensure fast response times for clinical workflows
4. **Cost Optimization**: Identify resource bottlenecks and optimize infrastructure spending
5. **Incident Response**: Rapid root cause analysis when issues occur
6. **Proactive Monitoring**: Detect anomalies before they impact users

---

## Technology Stack

### Recommended Stack: OpenTelemetry + Grafana Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COLLECTION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  OpenTelemetry SDK (Vendor-Neutral Instrumentation)                         │
│  ├── @opentelemetry/sdk-node          (Node.js auto-instrumentation)        │
│  ├── @opentelemetry/sdk-trace-node    (Distributed tracing)                 │
│  ├── @opentelemetry/sdk-metrics       (Metrics collection)                  │
│  ├── @opentelemetry/exporter-*        (Export to backends)                  │
│  └── @vercel/otel                     (Next.js integration)                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PROCESSING LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  OpenTelemetry Collector (Central Pipeline)                                  │
│  ├── Receivers   (OTLP, Prometheus, Jaeger protocols)                       │
│  ├── Processors  (Batching, filtering, enrichment)                          │
│  └── Exporters   (Route to storage backends)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STORAGE LAYER                                      │
├───────────────────┬───────────────────┬─────────────────────────────────────┤
│    Prometheus     │       Loki        │            Tempo                     │
│    (Metrics)      │      (Logs)       │          (Traces)                    │
│  ├── TSDB         │  ├── Chunks       │  ├── Object Storage                  │
│  ├── Alertmanager │  ├── Index        │  └── Trace IDs                       │
│  └── Rules        │  └── Retention    │                                      │
└───────────────────┴───────────────────┴─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VISUALIZATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Grafana (Unified Dashboard)                                                 │
│  ├── Dashboards       (Metrics visualization)                               │
│  ├── Explore          (Ad-hoc querying)                                     │
│  ├── Alerting         (Alert management)                                    │
│  └── Correlations     (Link metrics ↔ logs ↔ traces)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Details

| Component | Version | Purpose | Port |
|-----------|---------|---------|------|
| **OpenTelemetry Collector** | 0.96+ | Central telemetry pipeline | 4317 (gRPC), 4318 (HTTP) |
| **Prometheus** | 2.50+ | Metrics storage & alerting | 9090 |
| **Loki** | 2.9+ | Log aggregation | 3100 |
| **Tempo** | 2.4+ | Distributed tracing | 3200 |
| **Grafana** | 10.3+ | Visualization & alerting | 3003 |
| **Promtail** | 2.9+ | Log shipping agent | 9080 |

### Additional Tools

| Tool | Purpose |
|------|---------|
| **pg_stat_statements** | PostgreSQL query performance |
| **Redis Exporter** | Redis metrics for Prometheus |
| **Node Exporter** | Host-level metrics |
| **cAdvisor** | Container metrics |

---

## Why This Choice

### Comparison with Alternatives

| Criteria | OpenTelemetry + Grafana | Datadog | New Relic | ELK Stack |
|----------|------------------------|---------|-----------|-----------|
| **Cost** | Free/OSS | $$$$ | $$$$ | $$ |
| **Vendor Lock-in** | None | High | High | Low |
| **Kubernetes Native** | Excellent | Good | Good | Moderate |
| **Setup Complexity** | Moderate | Low | Low | High |
| **Customization** | Excellent | Limited | Limited | Excellent |
| **Data Ownership** | Full | Vendor | Vendor | Full |
| **Healthcare Compliance** | Full Control | Depends | Depends | Full Control |
| **Scalability** | Excellent | Excellent | Excellent | Good |

### Key Advantages of Our Choice

#### 1. Vendor Neutrality
```
OpenTelemetry is the CNCF standard for observability instrumentation.
Your code instrumentation remains the same regardless of backend changes.

Today: OpenTelemetry → Grafana Stack
Tomorrow: OpenTelemetry → Datadog (if needed)
                       → AWS X-Ray
                       → Azure Monitor
```

#### 2. Cost Effectiveness
```
Monthly Cost Comparison (for ~10 services, 100K requests/day):

Grafana Stack (Self-hosted):
├── Infrastructure: ~$200-400/month
└── Total: $200-400/month

Datadog:
├── APM: ~$31/host × 10 = $310/month
├── Logs: ~$1.70/GB × 50GB = $85/month
├── Infrastructure: ~$15/host × 10 = $150/month
└── Total: ~$545+/month (grows with scale)

New Relic:
├── Full Stack: ~$0.30/GB all telemetry
├── Estimated: ~$300-600/month
└── Total: ~$300-600/month
```

#### 3. Data Sovereignty
- All telemetry data stays within your infrastructure
- Critical for healthcare compliance (PHI concerns in logs)
- No data leaving your VPC/region

#### 4. Unified Correlation
Grafana provides seamless correlation between:
- Metrics → Logs → Traces
- Click from a spike in metrics directly to related logs and traces

#### 5. Healthcare-Specific Benefits
- **Audit Compliance**: Full control over log retention policies
- **PHI Protection**: Logs never leave your infrastructure
- **Custom Dashboards**: Healthcare-specific KPIs (appointment wait times, encounter duration)

---

## Architecture Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   ZEAL HEALTHCARE PLATFORM                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │  Frontend   │    │ Foundation  │    │  Clinical   │    │    RCM      │            │
│  │  (Next.js)  │    │  Service    │    │  Service    │    │  Service    │            │
│  │  Port 3000  │    │  Port 3010  │    │  Port 3011  │    │  Port 3012  │            │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│         │                  │                  │                  │                    │
│         │    OpenTelemetry SDK (auto-instrumentation)           │                    │
│         │    ├── HTTP/Fetch instrumentation                     │                    │
│         │    ├── Database (Prisma) instrumentation              │                    │
│         │    ├── Redis instrumentation                          │                    │
│         │    └── Custom spans for business logic                │                    │
│         │                  │                  │                  │                    │
│         └──────────────────┴────────┬─────────┴──────────────────┘                    │
│                                     │                                                 │
│                                     ▼                                                 │
│                    ┌────────────────────────────────────┐                             │
│                    │    OpenTelemetry Collector         │                             │
│                    │    (Central Processing Hub)        │                             │
│                    │    Port 4317 (gRPC)               │                             │
│                    │    Port 4318 (HTTP)               │                             │
│                    └─────────────┬──────────────────────┘                             │
│                                  │                                                    │
│              ┌───────────────────┼───────────────────┐                                │
│              │                   │                   │                                │
│              ▼                   ▼                   ▼                                │
│    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                        │
│    │   Prometheus    │ │      Loki       │ │     Tempo       │                        │
│    │   (Metrics)     │ │     (Logs)      │ │    (Traces)     │                        │
│    │   Port 9090     │ │   Port 3100     │ │   Port 3200     │                        │
│    └────────┬────────┘ └────────┬────────┘ └────────┬────────┘                        │
│             │                   │                   │                                 │
│             └───────────────────┴─────────┬─────────┘                                 │
│                                           │                                           │
│                                           ▼                                           │
│                          ┌────────────────────────────────┐                           │
│                          │          Grafana               │                           │
│                          │    (Unified Dashboards)        │                           │
│                          │         Port 3003              │                           │
│                          └────────────────────────────────┘                           │
│                                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                               │
│  │ PostgreSQL  │    │    Redis    │    │   Docker    │                               │
│  │  (4 DBs)    │    │   Cache     │    │  Containers │                               │
│  └─────────────┘    └─────────────┘    └─────────────┘                               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. REQUEST ARRIVES
   Browser → Next.js Frontend (trace-id generated)
         ↓
2. FRONTEND PROCESSING
   React Components → API Call (trace-id propagated in headers)
         ↓
3. BACKEND PROCESSING
   NestJS Controller → Service → Prisma → PostgreSQL
   (Each step creates a span, linked by trace-id)
         ↓
4. TELEMETRY COLLECTION
   ├── Metrics: Request count, latency, error rate → OTel Collector → Prometheus
   ├── Logs: Pino JSON files → Promtail → Loki
   └── Traces: Distributed trace spans → OTel Collector → Tempo
         ↓
5. VISUALIZATION
   Grafana correlates all three signals by trace-id
   Click: High latency metric → Related logs → Full trace
```

### Trace Propagation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Trace ID: abc123                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Frontend: 0ms-1200ms] ─────────────────────────────────────────────────   │
│    │                                                                        │
│    ├── [Page Load: 0ms-50ms]                                               │
│    │                                                                        │
│    └── [API Call: 50ms-1100ms] ────────────────────────────────            │
│          │                                                                  │
│          └── [Clinical Service: 100ms-1050ms] ─────────────────            │
│                │                                                            │
│                ├── [Controller: 100ms-150ms]                               │
│                │                                                            │
│                ├── [Service Layer: 150ms-900ms]                            │
│                │     │                                                      │
│                │     ├── [Prisma Query 1: 200ms-400ms]                     │
│                │     │                                                      │
│                │     ├── [Redis Cache: 400ms-420ms]                        │
│                │     │                                                      │
│                │     └── [Prisma Query 2: 500ms-850ms]                     │
│                │                                                            │
│                └── [Response Serialization: 900ms-1000ms]                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Log Shipping Strategy

Services use different logging strategies depending on the deployment environment:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DEVELOPMENT (local machine, no container runtime)                           │
│                                                                              │
│  Service (npm run dev)                                                       │
│    ├── stdout (pino-pretty) ──────────────────────► Developer terminal       │
│    └── file: logs/{service}.log (JSON) ──► Promtail ──► Loki                │
│                                                                              │
│  LOG_DIR=../../../logs                                                       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│  PRODUCTION (Docker / Kubernetes)                                            │
│                                                                              │
│  Service (container)                                                         │
│    └── stdout (JSON) ──► Container runtime ──► Promtail ──► Loki            │
│                                                                              │
│  LOG_DIR is NOT set                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Why stdout for Production

| Reason | Detail |
|--------|--------|
| **12-Factor App** | [Factor XI](https://12factor.net/logs): treat logs as event streams. The application should never concern itself with routing or storage of its output stream. |
| **Container-native** | Docker and Kubernetes capture stdout/stderr automatically. No filesystem dependency. |
| **Ephemeral containers** | Containers can be killed, restarted, or scaled without losing in-flight logs — the runtime already captured them. |
| **No disk management** | No risk of disk-full failures, no log rotation needed inside the container. |
| **Read-only filesystems** | Production containers can run with read-only root filesystems for security hardening. |
| **Multi-replica scaling** | No shared volumes or unique file paths needed. Each replica writes to its own stdout. |
| **Industry standard** | AWS ECS, GCP Cloud Run, Azure Container Apps, and Kubernetes all expect stdout-based logging. |

#### Why File-based for Development

In local development, services run directly via `npm run dev` — there is no container runtime to capture stdout. The `LOG_DIR` environment variable enables a file-based bridge:

1. Pino writes structured JSON to `logs/{service}.log`
2. Promtail (running in Docker) mounts the `logs/` directory
3. Promtail scrapes the JSON files and pushes to Loki

This gives developers the same Grafana/Loki experience locally without needing to containerize the services during development.

#### Log Rotation

| Environment | Rotation Strategy |
|-------------|-------------------|
| **Production** | Not applicable. Services write to stdout only. The container runtime (Docker `json-file` driver or `journald`) handles rotation. Configure via Docker daemon: `"log-opts": {"max-size": "50m", "max-file": "3"}` |
| **Staging/CI** | Same as production — containerized services, stdout only. |
| **Development** | Log files in `logs/` are a transit buffer (Promtail scrapes and ships them). Files can grow if services run for extended periods. Options: (1) periodically truncate files, (2) restart services, or (3) add `pino-roll` for automatic size-based rotation if needed. |

#### Environment Variable Summary

| Variable | Development | Production | Effect |
|----------|-------------|------------|--------|
| `LOG_DIR` | `../../../logs` | *not set* | When set: Pino writes JSON to file + pretty to stdout. When unset: stdout only. |
| `LOG_LEVEL` | `debug` | `warn` | Controls minimum log level emitted. |
| `LOG_PRETTY` | `true` (auto in dev) | `false` | Pretty-print to stdout vs raw JSON. |

---

## Configuration-Driven Approach

### Design Philosophy

Observability should be:
1. **Opt-in**: Disabled by default for local development
2. **Granular**: Enable/disable each pillar independently
3. **Environment-aware**: Different configurations per environment
4. **Zero-impact when disabled**: No performance overhead

### Environment Variables

#### Master Toggle

```bash
# Master switch for all observability
OBSERVABILITY_ENABLED=true|false
```

#### Individual Pillar Toggles

```bash
# Metrics Collection
METRICS_ENABLED=true|false

# Logging (structured JSON)
LOGGING_ENABLED=true|false
LOG_LEVEL=debug|info|warn|error
LOG_DIR=../../../logs  # Directory for JSON log files (Promtail scrapes these)

# Distributed Tracing
TRACING_ENABLED=true|false
TRACE_SAMPLE_RATE=0.0-1.0  # 1.0 = 100% of requests traced
```

#### Exporter Configuration

```bash
# OpenTelemetry Collector endpoint
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

# Service identification
OTEL_SERVICE_NAME=clinical-service
OTEL_SERVICE_VERSION=1.0.0

# Resource attributes
OTEL_RESOURCE_ATTRIBUTES=deployment.environment=production,service.namespace=zeal
```

#### Backend-Specific Configuration

```bash
# NestJS Backend (.env)
OBSERVABILITY_ENABLED=true
METRICS_ENABLED=true
LOGGING_ENABLED=true
LOG_LEVEL=info
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=0.1

OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_SERVICE_NAME=clinical-service
```

#### Frontend-Specific Configuration

```bash
# Next.js Frontend (.env.local)
NEXT_PUBLIC_OBSERVABILITY_ENABLED=true
NEXT_PUBLIC_TRACING_ENABLED=true
NEXT_PUBLIC_TRACE_SAMPLE_RATE=0.1

NEXT_PUBLIC_OTEL_ENDPOINT=http://localhost:4318
```

### Configuration Loading Pattern

```typescript
// backend/shared/observability/src/config.ts

export interface ObservabilityConfig {
  enabled: boolean;
  metrics: {
    enabled: boolean;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  tracing: {
    enabled: boolean;
    sampleRate: number;
  };
  exporter: {
    endpoint: string;
    serviceName: string;
    serviceVersion: string;
  };
}

export function loadObservabilityConfig(): ObservabilityConfig {
  const masterEnabled = process.env.OBSERVABILITY_ENABLED === 'true';

  return {
    enabled: masterEnabled,
    metrics: {
      enabled: masterEnabled && process.env.METRICS_ENABLED !== 'false',
    },
    logging: {
      enabled: masterEnabled && process.env.LOGGING_ENABLED !== 'false',
      level: (process.env.LOG_LEVEL as any) || 'info',
    },
    tracing: {
      enabled: masterEnabled && process.env.TRACING_ENABLED !== 'false',
      sampleRate: parseFloat(process.env.TRACE_SAMPLE_RATE || '0.1'),
    },
    exporter: {
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
      serviceName: process.env.OTEL_SERVICE_NAME || 'unknown-service',
      serviceVersion: process.env.OTEL_SERVICE_VERSION || '0.0.0',
    },
  };
}
```

---

## Environment Configuration Matrix

### Configuration by Environment

| Setting | Local Dev | Development | Staging | Production |
|---------|-----------|-------------|---------|------------|
| `OBSERVABILITY_ENABLED` | `false` | `true` | `true` | `true` |
| `METRICS_ENABLED` | `false` | `true` | `true` | `true` |
| `LOGGING_ENABLED` | `true` | `true` | `true` | `true` |
| `LOG_LEVEL` | `debug` | `debug` | `info` | `warn` |
| `LOG_DIR` | `../../../logs` | `../../../logs` | *not set* | *not set* |
| `TRACING_ENABLED` | `false` | `true` | `true` | `true` |
| `TRACE_SAMPLE_RATE` | `1.0` | `1.0` | `0.5` | `0.1` |

### Rationale

| Environment | Configuration Rationale |
|-------------|------------------------|
| **Local Dev** | Observability off to maximize performance and reduce complexity. Console logging only. `LOG_DIR` set so Promtail can scrape JSON files (no container runtime locally). |
| **Development** | Full observability with 100% trace sampling. Debug everything during active development. `LOG_DIR` set for file-based Promtail shipping. |
| **Staging** | Production-like but with higher sampling (50%) for thorough testing. Containerized — stdout only, no `LOG_DIR`. |
| **Production** | Optimized for performance. 10% trace sampling (adjust based on traffic). Warn-level logs to stdout only — container runtime captures and Promtail scrapes Docker container logs. |

### Sample Environment Files

#### Local Development (`.env.local`)

```bash
# Observability - OFF for local dev
OBSERVABILITY_ENABLED=false

# Keep structured logging for debugging
LOGGING_ENABLED=true
LOG_LEVEL=debug

# File-based logging for Promtail (no container runtime locally)
LOG_DIR=../../../logs

# Database
CLINICAL_DATABASE_URL="postgresql://..."
```

#### Development Environment (`.env.development`)

```bash
# Observability - FULL
OBSERVABILITY_ENABLED=true
METRICS_ENABLED=true
LOGGING_ENABLED=true
LOG_LEVEL=debug
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=1.0

# File-based logging for Promtail (services run outside containers)
LOG_DIR=../../../logs

# Collector endpoint
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_SERVICE_NAME=clinical-service
OTEL_SERVICE_VERSION=${npm_package_version}
```

#### Production Environment (`.env.production`)

```bash
# Observability - OPTIMIZED
OBSERVABILITY_ENABLED=true
METRICS_ENABLED=true
LOGGING_ENABLED=true
LOG_LEVEL=warn
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=0.1

# LOG_DIR is intentionally NOT set in production.
# Services write JSON to stdout. The container runtime captures stdout
# and Promtail scrapes container logs from /var/lib/docker/containers/.
# This follows the 12-factor app principle (Factor XI: Logs).

# Production collector (may be different cluster/endpoint)
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.monitoring:4318
OTEL_SERVICE_NAME=clinical-service
OTEL_SERVICE_VERSION=${APP_VERSION}
OTEL_RESOURCE_ATTRIBUTES=deployment.environment=production,region=uae-north
```

---

## Implementation Guide

### Backend Implementation (NestJS)

#### 1. Install Dependencies

```bash
# OpenTelemetry core
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-trace-otlp-http \
            @opentelemetry/exporter-metrics-otlp-http \
            @opentelemetry/resources \
            @opentelemetry/semantic-conventions

# NestJS specific
npm install @opentelemetry/instrumentation-nestjs-core \
            @opentelemetry/instrumentation-http \
            @opentelemetry/instrumentation-express

# Database instrumentation
npm install @opentelemetry/instrumentation-pg \
            @prisma/instrumentation

# Structured logging
npm install pino pino-pretty
```

#### 2. Instrumentation Setup

```typescript
// backend/shared/observability/src/instrumentation.ts

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { loadObservabilityConfig } from './config';

export function initializeObservability() {
  const config = loadObservabilityConfig();

  if (!config.enabled) {
    console.log('Observability disabled');
    return;
  }

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: config.exporter.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: config.exporter.serviceVersion,
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter: config.tracing.enabled
      ? new OTLPTraceExporter({ url: `${config.exporter.endpoint}/v1/traces` })
      : undefined,
    metricReader: config.metrics.enabled
      ? new OTLPMetricExporter({ url: `${config.exporter.endpoint}/v1/metrics` })
      : undefined,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Observability SDK shut down'))
      .catch((error) => console.error('Error shutting down SDK', error))
      .finally(() => process.exit(0));
  });
}
```

#### 3. Bootstrap Integration

```typescript
// backend/services/clinical/src/main.ts

// IMPORTANT: Import instrumentation BEFORE anything else
import { initializeObservability } from '@zeal/observability';
initializeObservability();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ... rest of bootstrap
}
bootstrap();
```

#### 4. Structured Logging

Logs are written to two destinations via `pino.multistream`:
1. **stdout** - pretty-printed for the developer terminal
2. **JSON file** - `logs/{serviceName}.log` for Promtail to scrape and ship to Loki

```
Services (npm run dev)
  ├── stdout (pino-pretty) --> developer terminal
  └── file: logs/{service}.log (JSON) --> Promtail --> Loki
```

Set `LOG_DIR` to enable file-based log shipping:

```bash
# In each service's .env.local
LOG_DIR=../../../logs   # relative to the service directory
```

When `LOG_DIR` is not set, only stdout output is produced (production containers rely on container log drivers).

```typescript
// backend/shared/observability/src/logger.ts (simplified)

import pino, { multistream } from 'pino';
import { loadObservabilityConfig } from './config';

const config = loadObservabilityConfig();

// When LOG_DIR is set: multistream (pretty stdout + JSON file)
// When LOG_DIR is not set: pretty stdout (dev) or JSON stdout (prod)
export const logger = createPinoLogger();
```

### Frontend Implementation (Next.js)

#### 1. Install Dependencies

```bash
npm install @vercel/otel \
            @opentelemetry/api \
            @opentelemetry/sdk-trace-web \
            @opentelemetry/exporter-trace-otlp-http \
            @opentelemetry/instrumentation-fetch
```

#### 2. Instrumentation Setup

```typescript
// frontend/src/instrumentation.ts

import { registerOTel } from '@vercel/otel';

export function register() {
  if (process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED !== 'true') {
    return;
  }

  registerOTel({
    serviceName: 'zeal-frontend',
    attributes: {
      'deployment.environment': process.env.NODE_ENV,
    },
  });
}
```

#### 3. Next.js Config

```javascript
// frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true',
  },
};

module.exports = nextConfig;
```

### Infrastructure Setup (Docker Compose)

```yaml
# docker-compose.observability.yml

version: '3.8'

services:
  # OpenTelemetry Collector
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.96.0
    container_name: zeal-otel-collector
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./observability/otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "8888:8888"   # Prometheus metrics (collector self-metrics)
    depends_on:
      - tempo
      - prometheus
      - loki
    networks:
      - zeal-network

  # Prometheus - Metrics Storage
  prometheus:
    image: prom/prometheus:v2.50.1
    container_name: zeal-prometheus
    volumes:
      - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.enable-remote-write-receiver'
    networks:
      - zeal-network

  # Loki - Log Aggregation
  loki:
    image: grafana/loki:2.9.4
    container_name: zeal-loki
    volumes:
      - ./observability/loki-config.yaml:/etc/loki/local-config.yaml
      - loki-data:/loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - zeal-network

  # Tempo - Distributed Tracing
  tempo:
    image: grafana/tempo:2.4.1
    container_name: zeal-tempo
    volumes:
      - ./observability/tempo-config.yaml:/etc/tempo/tempo.yaml
      - tempo-data:/tmp/tempo
    ports:
      - "3200:3200"   # Tempo API
      - "9411:9411"   # Zipkin receiver
    command: ["-config.file=/etc/tempo/tempo.yaml"]
    networks:
      - zeal-network

  # Grafana - Visualization
  grafana:
    image: grafana/grafana:10.3.3
    container_name: zeal-grafana
    volumes:
      - ./observability/grafana/provisioning:/etc/grafana/provisioning
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3003:3000"
    depends_on:
      - prometheus
      - loki
      - tempo
    networks:
      - zeal-network

  # Promtail - Log Shipping Agent
  promtail:
    image: grafana/promtail:2.9.4
    container_name: zeal-promtail
    volumes:
      - ./observability/promtail-config.yaml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - zeal-network

volumes:
  prometheus-data:
  loki-data:
  tempo-data:
  grafana-data:

networks:
  zeal-network:
    external: true
```

---

## Benefits

### Operational Benefits

| Benefit | Description |
|---------|-------------|
| **Faster Debugging** | Correlate metrics, logs, and traces to find root cause in minutes, not hours |
| **Proactive Alerting** | Get notified before users experience issues |
| **Performance Optimization** | Identify slow queries, N+1 problems, and bottlenecks |
| **Capacity Planning** | Predict resource needs based on trends |
| **Incident Response** | Quick triage with distributed tracing |

### Business Benefits

| Benefit | Description |
|---------|-------------|
| **Improved Uptime** | Faster MTTR (Mean Time To Resolution) |
| **Cost Optimization** | Right-size infrastructure based on actual usage |
| **Compliance** | Audit trails for healthcare regulations |
| **User Experience** | Identify and fix UX issues before user complaints |

### Developer Benefits

| Benefit | Description |
|---------|-------------|
| **Local Debugging** | Optional local stack for development |
| **API Performance** | Understand real-world API latency |
| **Database Insights** | Query performance visibility |
| **Error Context** | Rich error context with request traces |

### Healthcare-Specific Benefits

| Benefit | Description |
|---------|-------------|
| **Appointment Flow Tracking** | End-to-end visibility of patient journeys |
| **Clinical Workflow Monitoring** | Identify bottlenecks in care delivery |
| **Integration Monitoring** | Track external system integrations (lab, pharmacy) |
| **Audit Compliance** | Full audit trail with trace IDs linking all operations |

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- Existing Zeal services running

### Step 1: Start Observability Stack

```bash
# From project root
docker-compose -f docker-compose.observability.yml up -d
```

### Step 2: Verify Services

| Service | URL | Expected |
|---------|-----|----------|
| Grafana | http://localhost:3003 | Login page (admin/admin) |
| Prometheus | http://localhost:9090 | Prometheus UI |
| Tempo | http://localhost:3200 | JSON response |
| Loki | http://localhost:3100/ready | "ready" |
| Collector | http://localhost:8888/metrics | Prometheus metrics |

### Step 3: Enable Observability in Services

```bash
# In each service .env file
OBSERVABILITY_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

### Step 4: Restart Services

```bash
# Restart backend services
pkill -f "tsx watch"
cd backend/services/clinical && npm run dev &
cd backend/services/foundation && npm run dev &
```

### Step 5: View Dashboards

1. Open Grafana: http://localhost:3003
2. Login: admin/admin
3. Go to Explore → Select Tempo data source → Search traces
4. Go to Dashboards → Import pre-built dashboards

---

## Related Documentation

- [ADR-0013: Service Decomposition](../adr/ADR-0013-service-decomposition.md)
- [Infrastructure Setup](../infrastructure/README.md)
- [Development Commands](../development/DEVELOPMENT-COMMANDS.md)

---

## Appendix: Configuration Files

See the `/infrastructure/observability/` directory for:
- `otel-collector-config.yaml` - Collector pipeline configuration
- `prometheus.yml` - Prometheus scrape configuration
- `loki-config.yaml` - Loki storage configuration
- `tempo-config.yaml` - Tempo trace configuration
- `grafana/provisioning/` - Pre-configured data sources and dashboards

---

*Document Version: 1.2*
*Last Updated: January 2026*
