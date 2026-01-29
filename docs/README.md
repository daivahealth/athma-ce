# Zeal Platform - Documentation Index

## Overview

This documentation package provides comprehensive architecture and technical design for the Zeal Platform, an AI-driven, multi-tenant Practice Management System (PMS) + Electronic Health Record (EHR) + Revenue Cycle Management (RCM) SaaS for healthcare providers in the UAE.

**Last Updated**: January 2026  
**Target Audience**: Solution Architects, Technical Leads, Development Teams, Compliance Officers

---

## Documentation Structure

```
docs/
├── README.md                   # This file - main index
├── architecture/               # System architecture and design
├── adr/                        # Architecture Decision Records
├── security/                   # Security and compliance
├── multitenancy/               # Multi-tenant implementation
├── observability/              # Monitoring, logging, and tracing
├── features/                   # Feature documentation by domain
├── api/                        # API documentation and Postman
├── frontend/                   # Frontend-specific documentation
├── development/                # Developer guides
├── infrastructure/             # Infrastructure and deployment
├── runbooks/                   # Operational runbooks
├── services/                   # Service-specific guides
├── seeding/                    # Database seeding guides
├── troubleshooting/            # Bug fixes and common issues
├── implementation/             # Implementation guides
└── archive/                    # Historical documentation
```

---

## Quick Navigation

### Getting Started

| Document | Description |
|----------|-------------|
| [Main README](../README.md) | Project overview and quick start |
| [Backend README](../backend/README.md) | Backend services overview |
| [Frontend README](../frontend/README.md) | Frontend application guide |
| [Development Commands](./development/DEVELOPMENT-COMMANDS.md) | Essential dev commands |

### Architecture

| Document | Description |
|----------|-------------|
| [Architecture Overview](./architecture/02-Architecture-Diagram.md) | System architecture diagrams |
| [Backend Architecture](./architecture/BACKEND-ARCHITECTURE.md) | Complete backend design |
| [Domain Model](./architecture/03-Domain-Model.md) | DDD domain models |
| [Data Model](./architecture/05-Data-Model.md) | Database schema design |
| [Service Interactions](./architecture/24-Service-Database-Interaction.md) | Service-DB patterns |

### Architecture Decision Records (ADRs)

| ADR | Title |
|-----|-------|
| [ADR-0001](./adr/ADR-0001-language-split.md) | Language Split (TypeScript) |
| [ADR-0003](./adr/ADR-0003-multitenancy.md) | Multi-tenancy Model |
| [ADR-0005](./adr/ADR-0005-rbac-access-control.md) | RBAC Access Control |
| [ADR-0007](./adr/ADR-0007-security-compliance.md) | Security & Compliance |
| [ADR-0010](./adr/ADR-0010-data-architecture.md) | Data Architecture |
| [ADR-0013](./adr/ADR-0013-service-decomposition.md) | Service Decomposition |

### Service Documentation

| Service | README | Port |
|---------|--------|------|
| Foundation | [README](../backend/services/foundation/README.md) | 3010 |
| Clinical | [README](../backend/services/clinical/README.md) | 3011 |
| RCM | [README](../backend/services/rcm/README.md) | 3012 |
| PRM | [README](../backend/services/prm/README.md) | 3013 |

### Domain Features

| Domain | Documentation |
|--------|---------------|
| Clinical | [Patient Management](./features/patient-management/), [Clinical](./features/clinical/), [Scheduling](./features/scheduling/) |
| Foundation | [Facility Hierarchy](./features/facility-hierarchy/), [User Management](./features/user-management/), [Identity Management](./features/identity-management/) |
| RCM | [Billing](./features/billing/), [Terminology](./features/terminology/) |

### Multi-Tenancy

| Document | Description |
|----------|-------------|
| [Overview](./multitenancy/README.md) | Multi-tenancy guide |
| [Tenant Isolation](./multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md) | 3-layer isolation |
| [Quick Reference](./multitenancy/TENANT-ISOLATION-QUICK-REFERENCE.md) | Developer reference |
| [PostgreSQL RLS](./multitenancy/POSTGRESQL-RLS-SETUP.md) | Database RLS setup |

### API Documentation

| Document | Description |
|----------|-------------|
| [API Overview](./api/README.md) | API documentation index |
| [Postman Collections](./api/postman/README.md) | API testing collections |
| [Authentication](./api/API-AUTHENTICATION-CONTEXT.md) | Auth context guide |

### Frontend

| Document | Description |
|----------|-------------|
| [Frontend Overview](./frontend/README.md) | Frontend documentation |
| [API Clients](./frontend/API-CLIENTS.md) | API client architecture |

### Observability

| Document | Description |
|----------|-------------|
| [Observability Guide](./observability/OBSERVABILITY.md) | Full observability architecture |
| [Quick Reference](./observability/OBSERVABILITY-QUICK-REFERENCE.md) | Developer cheat sheet |

### Operations

| Document | Description |
|----------|-------------|
| [Foundation Runbook](./runbooks/foundation-platform.md) | Foundation service ops |
| [Clinical Runbook](./runbooks/clinical-core.md) | Clinical service ops |
| [RCM Runbook](./runbooks/rcm-services.md) | RCM service ops |
| [Troubleshooting](./troubleshooting/README.md) | Common issues and fixes |

### Database & Seeding

| Document | Description |
|----------|-------------|
| [Seeding Guide](./seeding/README.md) | Database seeding |
| [Complete Seed Guide](./seeding/00-complete-seed-guide.md) | Full seeding walkthrough |
| [Database Admin](./infrastructure/database/README.md) | Database administration |

---

## Platform Overview

### Services Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│                         Port: 3000                               │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐   ┌───────────────────┐   ┌─────────────────┐
│  Foundation   │   │     Clinical      │   │       RCM       │
│  Service      │   │     Service       │   │     Service     │
│  Port: 3010   │   │   Port: 3011      │   │   Port: 3012    │
└───────┬───────┘   └─────────┬─────────┘   └────────┬────────┘
        │                     │                      │
        ▼                     ▼                      ▼
┌───────────────┐   ┌───────────────────┐   ┌─────────────────┐
│zeal_foundation│   │   zeal_clinical   │   │    zeal_rcm     │
│   (Prisma)    │   │     (Prisma)      │   │    (Prisma)     │
└───────────────┘   └───────────────────┘   └─────────────────┘
```

### Database Architecture (ADR-0013)

| Database | Domain | Purpose |
|----------|--------|---------|
| `zeal_foundation` | Foundation | Tenants, users, RBAC, facilities, staff |
| `zeal_clinical` | Clinical | Patients (PHI), encounters, scheduling |
| `zeal_rcm` | RCM | Billing, insurance, claims |
| `zeal_analytics` | Analytics | Audit logs, usage events |

### Technology Stack

**Backend**
- Node.js 18+ / NestJS / TypeScript
- PostgreSQL 16 / Prisma ORM
- Redis 7 / JWT Authentication

**Frontend**
- Next.js 14 (App Router)
- TypeScript / Tailwind CSS / shadcn/ui
- React Query / Zustand

---

## Key Features

### Implemented

- Multi-tenant architecture with RLS
- JWT authentication with MFA
- Role-based access control (RBAC)
- Patient registration and management
- Appointment scheduling
- Clinical encounters and charting
- Inpatient admissions and discharges
- Billing and invoicing
- Medical coding workflow

### Healthcare Compliance

- HIPAA (Privacy & Security Rules)
- GDPR (Data Protection)
- UAE PDPL (Personal Data Protection)
- HL7 FHIR compatible structures
- ICD-10 / CPT coding support

---

## Contributing to Documentation

### Adding New Documentation

1. Create file in appropriate folder
2. Use Markdown formatting
3. Add to relevant README index
4. Cross-reference related docs

### Documentation Standards

- Use ISO 8601 dates (YYYY-MM-DD)
- Code examples in syntax-highlighted blocks
- Relative links for cross-references
- Each section has its own README.md

### Folder Guidelines

| Folder | Content Type |
|--------|-------------|
| `architecture/` | System design, patterns, models |
| `adr/` | Architecture decisions only |
| `features/` | Feature specifications and guides |
| `api/` | API contracts, Postman, endpoints |
| `development/` | Developer guides and setup |
| `observability/` | Monitoring, logging, tracing guides |
| `runbooks/` | Operational procedures |
| `troubleshooting/` | Bug fixes, common issues |
| `archive/` | Outdated/historical docs |

---

## Support

- Review documentation in organized folders
- Check [Troubleshooting](./troubleshooting/README.md) for common issues
- Consult [Runbooks](./runbooks/) for operational guidance
- Review [ADRs](./adr/) for architectural context

---

*Last updated: January 2026*
