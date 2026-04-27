# athma-ce Platform Deployment Overview

This document provides a high-level overview of deploying the athma-ce healthcare platform across supported cloud providers and on-premises environments. It serves as the entry point for all deployment guides.

## Platform Architecture

athma-ce consists of multiple microservices, databases, and supporting infrastructure:

```
                         Internet
                            |
                     [CDN / Load Balancer]
                            |
                 +----------+----------+
                 |                     |
          [Frontend]            [API Gateway / Ingress]
          Next.js 14                   |
          Port 3000         +----------+----------+----------+----------+
                            |          |          |          |          |
                       Foundation  Clinical    RCM      Analytics   PRM
                       :3010       :3020       :3030    :3040       :3013
                            |          |          |          |          |
                 +----------+----------+----------+----------+----------+
                 |                                                      |
          [PostgreSQL 16 + pgvector]                              [Redis 7]
          4 Domain Databases                                     Cache/Sessions
          - zeal_foundation                                      Port 6379
          - zeal_clinical
          - zeal_rcm
          - zeal_analytics
          Port 5432
```

### Service Port Reference

| Service       | Port | Health Endpoint  | Database           |
|---------------|------|------------------|--------------------|
| Frontend      | 3000 | N/A              | N/A                |
| Foundation    | 3010 | `/api/v1/health` | zeal_foundation    |
| Clinical      | 3020 | `/api/v1/health` | zeal_clinical      |
| RCM           | 3030 | `/api/v1/health` | zeal_rcm           |
| Analytics     | 3040 | `/api/v1/health` | zeal_analytics     |
| PRM           | 3013 | `/api/v1/health` | zeal_prm           |
| AI-Gateway    | 3015 | `/api/v1/health` | N/A                |

### Observability Stack

All deployments include a unified observability stack:

| Component           | Port  | Purpose                |
|---------------------|-------|------------------------|
| OTel Collector      | 4317/4318 | Telemetry pipeline (gRPC/HTTP) |
| Prometheus          | 9090  | Metrics storage        |
| Loki                | 3100  | Log aggregation        |
| Tempo               | 3200  | Distributed tracing    |
| Grafana             | 3003  | Visualization          |
| Promtail            | 9080  | Log shipping           |

## Environment Strategy

| Environment | Purpose                    | Scaling            | Data              |
|-------------|----------------------------|--------------------|-------------------|
| Development | Feature development        | Single instance    | Synthetic data    |
| Staging     | Integration testing & UAT  | Production-like    | Anonymized data   |
| Production  | Live system                | Auto-scaling       | Real patient data |
| DR          | Disaster recovery          | Standby            | Replicated data   |

## Platform Selection Guide

| Criteria                  | AWS               | Azure              | GCP               | VPC / On-Premises   |
|---------------------------|-------------------|--------------------|--------------------|---------------------|
| **Recommendation**        | Primary cloud     | DR / Secondary     | Alternative        | Air-gapped / Sovereign |
| **UAE Region**            | me-central-1      | UAE North          | None (nearest: Doha) | N/A               |
| **Data Residency**        | Full compliance   | Full compliance    | Requires review    | Full control        |
| **Kubernetes**            | EKS               | AKS                | GKE                | k3s / kubeadm       |
| **Managed PostgreSQL**    | RDS               | Flexible Server    | Cloud SQL          | Self-hosted          |
| **Managed Redis**         | ElastiCache       | Azure Cache        | Memorystore        | Self-hosted          |
| **Container Registry**    | ECR               | ACR                | Artifact Registry  | Harbor / local       |
| **Secrets Management**    | Secrets Manager   | Key Vault          | Secret Manager     | HashiCorp Vault      |
| **CDN**                   | CloudFront        | Front Door         | Cloud CDN          | Nginx / Varnish      |
| **Estimated Base Cost**   | ~$800-1500/mo     | ~$800-1500/mo      | ~$700-1400/mo      | Hardware + hosting   |

> **Note:** For UAE healthcare deployments requiring data residency, AWS (me-central-1) and Azure (UAE North) are recommended. GCP does not currently have a UAE region.

## Common Prerequisites

All deployment targets require:

- **Docker** >= 24.0 (for building container images)
- **Terraform** >= 1.0 (for cloud infrastructure provisioning)
- **kubectl** >= 1.28 (for Kubernetes management)
- **Helm** >= 3.12 (for chart deployments)
- **Node.js** 20 LTS (for building services)
- **Git** (for source access)

## Container Image Strategy

All services use a multi-stage Dockerfile pattern (template at `backend/services/prm/Dockerfile`):

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY prisma ./prisma/
RUN npx prisma generate
COPY --from=base /app/dist ./dist
EXPOSE <service-port>
CMD ["npm", "start"]
```

**Image tagging convention:**
- `<registry>/<service>:<git-sha>` -- immutable build tag
- `<registry>/<service>:latest` -- latest build on main branch
- `<registry>/<service>:v1.2.3` -- release version tag

**Services requiring images:** foundation, clinical, rcm, analytics, prm, ai-gateway, frontend

## Database Strategy

athma-ce uses **4 isolated PostgreSQL databases** on a single cluster (or separate instances for large deployments):

| Database          | Domain                                | Extensions Required                    |
|-------------------|---------------------------------------|----------------------------------------|
| zeal_foundation   | Tenants, users, facilities, RBAC      | uuid-ossp, pg_trgm, unaccent          |
| zeal_clinical     | Patients, appointments, encounters    | uuid-ossp, pg_trgm, unaccent, pgvector |
| zeal_rcm          | Billing, claims, payers               | uuid-ossp, pg_trgm, unaccent          |
| zeal_analytics    | Audit logs, metrics, reporting        | uuid-ossp, pg_trgm, unaccent          |

Database initialization is handled by `init-scripts/01-init-database.sql`, which creates all databases and extensions.

**Critical rules:**
- Direct SQL joins across databases are prohibited
- Cross-domain communication uses REST APIs or events
- Every table includes `tenant_id` for multi-tenant isolation

## Healthcare Compliance Baseline

All deployments must satisfy:

1. **Data Residency** -- All PHI must remain within the deployment region (UAE for UAE customers)
2. **Encryption at Rest** -- AES-256 for all databases, object storage, and backups
3. **Encryption in Transit** -- TLS 1.2+ for all connections (service-to-service, client-to-server, database)
4. **Audit Logging** -- All clinical data access logged to zeal_analytics database
5. **PHI Isolation** -- Clinical and RCM databases contain PHI; Foundation does not
6. **Access Control** -- RBAC enforced via JWT claims; tenant isolation via middleware
7. **Backup Retention** -- Minimum 30 days for production; 7-year retention for compliance archives

## Platform-Specific Deployment Guides

| Guide | Description |
|-------|-------------|
| [DEPLOY-AWS.md](./DEPLOY-AWS.md) | AWS deployment using EKS, RDS, ElastiCache, S3, CloudFront |
| [DEPLOY-AZURE.md](./DEPLOY-AZURE.md) | Azure deployment using AKS, Flexible Server, Azure Cache, Blob Storage |
| [DEPLOY-GCP.md](./DEPLOY-GCP.md) | GCP deployment using GKE, Cloud SQL, Memorystore, Cloud Storage |
| [DEPLOY-VPC.md](./DEPLOY-VPC.md) | On-premises / VPC deployment using Docker Compose or self-hosted Kubernetes |

## Related Documentation

- [Deployment & Operations (detailed configs)](../10-Deployment-&-Ops.md) -- Terraform modules, K8s manifests, Helm charts, CI/CD workflows
- [ADR-0008: Deployment Infrastructure](../../ADR/ADR-0008-deployment-infrastructure.md) -- Multi-cloud strategy decision record
- [Services & Ports](../SERVICES-AND-PORTS.md) -- Canonical port assignments and health endpoints
- [Observability & SRE](../09-Observability-&-SRE.md) -- SLOs, monitoring setup, runbooks
