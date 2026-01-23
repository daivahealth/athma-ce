# Zeal Platform - Technical Architecture

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Compliance](https://img.shields.io/badge/HIPAA-Compliant-brightgreen)
![UAE](https://img.shields.io/badge/UAE-DHA%20%7C%20DOH-orange)

**Last Updated**: January 2026  
**Document Owner**: Engineering Team  
**Review Cycle**: Quarterly

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Security Architecture](#5-security-architecture)
6. [Integration Architecture](#6-integration-architecture)
7. [Data Architecture](#7-data-architecture)
8. [Deployment & Infrastructure](#8-deployment--infrastructure)
9. [Observability & Monitoring](#9-observability--monitoring)
10. [Performance & Scalability](#10-performance--scalability)
11. [Future Roadmap](#11-future-roadmap)
12. [Related Documentation](#12-related-documentation)

---

## 1. Executive Summary

Zeal is a comprehensive, multi-tenant SaaS platform for healthcare providers in the UAE, combining Practice Management (PMS), Electronic Health Records (EHR), and Revenue Cycle Management (RCM) into a unified solution.

### Key Design Principles

| Principle | Implementation |
|-----------|----------------|
| 🔒 **Security First** | PHI isolation, encryption at rest/transit, RBAC |
| 📈 **Scalability** | Microservices architecture, horizontal scaling |
| 🏥 **Compliance** | HIPAA, GDPR, UAE PDPL, DHA/DOH regulations |
| 🧩 **Modularity** | Domain-driven design with clear boundaries |
| 🌍 **Localization** | Arabic/English support, RTL-ready UI |

### Architecture Highlights

```
┌────────────────────────────────────────────────────────────────────┐
│                         ZEAL PLATFORM                              │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Next.js    │  │   NestJS     │  │  PostgreSQL  │             │
│  │   Frontend   │  │   Services   │  │   4 DBs      │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │                 │                 │                      │
│         └────────┬────────┴────────┬────────┘                      │
│                  │                 │                               │
│           ┌──────┴──────┐   ┌──────┴──────┐                       │
│           │    Redis    │   │   JWT Auth  │                       │
│           │    Cache    │   │   + RBAC    │                       │
│           └─────────────┘   └─────────────┘                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Overview

### 2.1 High-Level Architecture

```mermaid
C4Container
    title Zeal Platform - System Architecture

    Person(patient, "Patient", "Mobile/Web Portal")
    Person(provider, "Healthcare Provider", "Clinical Workflows")
    Person(billing, "Billing Staff", "Revenue Cycle")
    Person(admin, "Administrator", "System Config")

    System_Boundary(zeal, "Zeal Platform") {
        
        Container(webapp, "Web Application", "Next.js 14", "Unified SPA with domain modules")
        
        Container(gateway, "API Gateway", "Nginx/Kong", "Routing, Rate Limiting, SSL Termination")

        Container(foundation, "Foundation Service", "NestJS", "Auth, RBAC, Tenants, Facilities, Staff")
        Container(clinical, "Clinical Service", "NestJS", "Patients, Encounters, Scheduling, Charting")
        Container(rcm, "RCM Service", "NestJS", "Billing, Insurance, Claims, Coding")
        Container(prm, "PRM Service", "NestJS", "Patient Engagement, Rules, Tasks")

        ContainerDb(db_foundation, "Foundation DB", "PostgreSQL", "Users, Config, RBAC")
        ContainerDb(db_clinical, "Clinical DB", "PostgreSQL", "PHI, Encounters")
        ContainerDb(db_rcm, "RCM DB", "PostgreSQL", "Financial Data")
        ContainerDb(db_prm, "PRM DB", "PostgreSQL", "Engagement Data")
        ContainerDb(redis, "Cache Layer", "Redis 7", "Sessions, Cache")
    }

    System_Ext(dha, "DHA eClaimLink", "Dubai Health Authority")
    System_Ext(doh, "DOH Shafafiya", "Abu Dhabi DOH")
    System_Ext(hie, "HIE Platforms", "NABIDH, Malaffi, Riayati")

    Rel(patient, webapp, "HTTPS")
    Rel(provider, webapp, "HTTPS")
    Rel(billing, webapp, "HTTPS")
    Rel(admin, webapp, "HTTPS")

    Rel(webapp, gateway, "REST/HTTPS")
    
    Rel(gateway, foundation, "Routes /api/foundation")
    Rel(gateway, clinical, "Routes /api/clinical")
    Rel(gateway, rcm, "Routes /api/rcm")
    Rel(gateway, prm, "Routes /api/prm")

    Rel(foundation, db_foundation, "Prisma ORM")
    Rel(clinical, db_clinical, "Prisma ORM")
    Rel(rcm, db_rcm, "Prisma ORM")
    Rel(prm, db_prm, "Prisma ORM")

    Rel(foundation, redis, "Sessions")
    Rel(clinical, redis, "Cache")

    Rel(rcm, dha, "Claims XML")
    Rel(rcm, doh, "Prior Auth")
    Rel(clinical, hie, "FHIR R4")
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose | Status |
|-------|------------|---------|---------|--------|
| **Frontend** | Next.js | 14.x | App Router, SSR, RSC | ✅ Active |
| | TypeScript | 5.x | Type Safety | ✅ Active |
| | Tailwind CSS | 3.x | Utility Styling | ✅ Active |
| | shadcn/ui | Latest | Component Library | ✅ Active |
| | React Query | 5.x | Server State | ✅ Active |
| | Zustand | 4.x | Client State | ✅ Active |
| **Backend** | NestJS | 10.x | API Framework | ✅ Active |
| | Prisma | 5.x | ORM | ✅ Active |
| | Zod | 3.x | Validation | ✅ Active |
| | Pino | 8.x | Logging | ✅ Active |
| **Database** | PostgreSQL | 16 | Primary Store | ✅ Active |
| | Redis | 7.x | Cache & Sessions | ✅ Active |
| **Infrastructure** | Docker | 24.x | Containerization | ✅ Active |
| | Kubernetes | 1.28+ | Orchestration | 🔄 Planned |
| **Observability** | Prometheus | 2.x | Metrics | 🔄 Planned |
| | Grafana | 10.x | Dashboards | 🔄 Planned |
| | OpenSearch | 2.x | Logs & Search | 🔄 Planned |

### 2.3 Service Inventory

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE INVENTORY                              │
├──────────────┬──────┬─────────────┬──────────────────┬─────────────────┤
│ Service      │ Port │ Database    │ Health Check     │ API Docs        │
├──────────────┼──────┼─────────────┼──────────────────┼─────────────────┤
│ Foundation   │ 3010 │ zeal_found. │ /health          │ /docs           │
│ Clinical     │ 3011 │ zeal_clin.  │ /health          │ /docs           │
│ RCM          │ 3012 │ zeal_rcm    │ /health          │ /docs           │
│ PRM          │ 3013 │ zeal_prm    │ /health          │ /docs           │
│ Frontend     │ 3000 │ -           │ -                │ -               │
├──────────────┴──────┴─────────────┴──────────────────┴─────────────────┤
│ Infrastructure                                                          │
├──────────────┬──────┬─────────────────────────────────────────────────┤
│ PostgreSQL   │ 5432 │ Primary database server                          │
│ Redis        │ 6379 │ Cache and session store                          │
│ pgAdmin      │ 8080 │ Database administration UI                       │
│ RedisInsight │ 5540 │ Redis administration UI                          │
└──────────────┴──────┴─────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture

### 3.1 Service Design Pattern

The backend follows a **Database-per-Service** pattern aligned with Domain-Driven Design (DDD). Each service owns its domain and database, ensuring loose coupling and independent deployability.

```mermaid
graph TB
    subgraph "API Layer"
        GW[API Gateway]
    end

    subgraph "Foundation Domain"
        FS[Foundation Service<br/>Port: 3010]
        FDB[(zeal_foundation)]
        FS --> FDB
    end

    subgraph "Clinical Domain"
        CS[Clinical Service<br/>Port: 3011]
        CDB[(zeal_clinical)]
        CS --> CDB
    end

    subgraph "RCM Domain"
        RS[RCM Service<br/>Port: 3012]
        RDB[(zeal_rcm)]
        RS --> RDB
    end

    subgraph "PRM Domain"
        PS[PRM Service<br/>Port: 3013]
        PDB[(zeal_prm)]
        PS --> PDB
    end

    subgraph "Shared Infrastructure"
        Redis[(Redis Cache)]
    end

    GW --> FS
    GW --> CS
    GW --> RS
    GW --> PS

    FS -.->|Sessions| Redis
    CS -.->|Cache| Redis

    CS -.->|"Verify Token"| FS
    RS -.->|"Get Encounter"| CS

    style FS fill:#4CAF50,color:#fff
    style CS fill:#2196F3,color:#fff
    style RS fill:#FF9800,color:#fff
    style PS fill:#9C27B0,color:#fff
```

### 3.2 Service Responsibilities

#### 🟢 Foundation Service (Port 3010)

| Module | Responsibility |
|--------|----------------|
| **Auth** | JWT authentication, refresh tokens, MFA |
| **Tenant** | Multi-tenant management, configuration |
| **User** | User accounts, profiles |
| **RBAC** | Roles, permissions, access control |
| **Facility** | Facility hierarchy (departments, wards, beds) |
| **Staff** | Healthcare provider profiles, specialties |
| **Config** | Hierarchical configuration (instance/tenant/facility) |

#### 🔵 Clinical Service (Port 3011)

| Module | Responsibility |
|--------|----------------|
| **Patient** | Registration, demographics, history |
| **Scheduling** | Appointments, availability, recurring series |
| **Encounter** | Clinical encounters, triage |
| **Charting** | Notes, diagnoses, prescriptions, orders |
| **Inpatient** | Admissions, discharges, transfers |
| **Consent** | Consent templates and tracking |
| **Catalog** | Medical catalogs (meds, labs, procedures) |

#### 🟠 RCM Service (Port 3012)

| Module | Responsibility |
|--------|----------------|
| **Billing** | Charges, invoices, receipts |
| **Insurance** | Payers, policies, coverage |
| **Medical Coding** | ICD/CPT coding sessions |
| **Fee Schedule** | Pricing rules, contracts |
| **Charge Posting** | Automatic charge rules |

#### 🟣 PRM Service (Port 3013)

| Module | Responsibility |
|--------|----------------|
| **Events** | Patient engagement events |
| **Rules** | Engagement rule engine |
| **Tasks** | Patient tasks and reminders |
| **Messages** | Communication history |

### 3.3 Cross-Service Communication

> [!IMPORTANT]
> **No cross-database joins allowed.** Services communicate via REST APIs only.

```mermaid
sequenceDiagram
    participant Client
    participant Clinical as Clinical Service
    participant Foundation as Foundation Service
    participant RCM as RCM Service

    Client->>Clinical: GET /patients/:id
    Clinical->>Foundation: Validate JWT Token
    Foundation-->>Clinical: Token Valid + User Context
    Clinical->>Clinical: Query Patient (with tenant isolation)
    Clinical-->>Client: Patient Data

    Note over Client,RCM: Creating a charge requires encounter data
    
    Client->>RCM: POST /charges
    RCM->>Clinical: GET /encounters/:id (internal)
    Clinical-->>RCM: Encounter Details
    RCM->>RCM: Create Charge
    RCM-->>Client: Charge Created
```

### 3.4 NestJS Module Structure

Each service follows a consistent internal structure:

```
services/<service>/src/
├── main.ts                     # Application bootstrap
├── app.module.ts               # Root module
├── common/
│   ├── decorators/             # @TenantId, @UserId, @FacilityId
│   ├── guards/                 # JwtAuthGuard, RolesGuard
│   ├── interceptors/           # RequestContext, Logging
│   └── filters/                # Exception filters
└── modules/
    └── <module>/
        ├── <module>.module.ts
        ├── <module>.controller.ts
        ├── <module>.service.ts
        ├── <module>.repository.ts
        └── dto/
            ├── create-<module>.dto.ts
            └── update-<module>.dto.ts
```

---

## 4. Frontend Architecture

### 4.1 Application Structure

The frontend is a **Modular Monolith** built with Next.js 14 App Router, logically separating business domains while sharing core infrastructure.

```mermaid
graph TD
    subgraph "Next.js 14 Application"
        subgraph "App Router"
            Layout[Root Layout]
            AuthRoutes["(auth)/ - Login, Reset"]
            ClinicalRoutes["(clinical)/ - Patients, Encounters"]
            DashboardRoutes["(dashboard)/ - Admin, Config"]
        end

        subgraph "Providers Layer"
            AuthProvider[Auth Provider]
            QueryProvider[React Query Provider]
            ThemeProvider[Theme Provider]
        end

        subgraph "Domain Modules"
            ClinicalModule[Clinical Module]
            FoundationModule[Foundation Module]
            RCMModule[RCM Module]
            PRMModule[PRM Module]
        end

        subgraph "Shared Layer"
            Components[UI Components]
            Hooks[Custom Hooks]
            APIClients[API Clients]
            Utils[Utilities]
        end
    end

    Layout --> AuthProvider
    AuthProvider --> QueryProvider
    QueryProvider --> ThemeProvider
    ThemeProvider --> AuthRoutes
    ThemeProvider --> ClinicalRoutes
    ThemeProvider --> DashboardRoutes

    ClinicalRoutes --> ClinicalModule
    DashboardRoutes --> FoundationModule
    DashboardRoutes --> RCMModule

    ClinicalModule --> Components
    ClinicalModule --> APIClients
    FoundationModule --> Components
    RCMModule --> Components

    style ClinicalModule fill:#2196F3,color:#fff
    style FoundationModule fill:#4CAF50,color:#fff
    style RCMModule fill:#FF9800,color:#fff
    style PRMModule fill:#9C27B0,color:#fff
```

### 4.2 Directory Structure

```
frontend/src/
├── app/                        # Next.js App Router
│   ├── [locale]/
│   │   ├── (auth)/             # Public routes
│   │   │   ├── login/
│   │   │   └── reset-password/
│   │   ├── (clinical)/         # Clinical domain
│   │   │   ├── patients/
│   │   │   ├── encounters/
│   │   │   ├── scheduling/
│   │   │   └── charting/
│   │   └── (dashboard)/        # Admin domain
│   │       ├── facilities/
│   │       ├── users/
│   │       ├── billing-workspace/
│   │       └── medical-coding/
│   └── api/                    # API routes
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # Sidebar, Topbar
│   ├── forms/                  # Form components
│   └── tables/                 # Data tables
├── modules/
│   ├── clinical/
│   │   ├── components/
│   │   ├── hooks/              # React Query hooks
│   │   ├── services/           # API services
│   │   └── types/
│   ├── foundation/
│   ├── rcm/
│   └── prm/
├── lib/
│   ├── api/                    # Axios clients
│   ├── auth/                   # Token utilities
│   ├── stores/                 # Zustand stores
│   └── utils/                  # Helpers
└── hooks/                      # Shared hooks
```

### 4.3 State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| **Server State** | React Query | API data, caching, sync |
| **Client State** | Zustand | Auth, preferences, UI |
| **Form State** | React Hook Form | Form validation |
| **URL State** | Next.js Router | Navigation, filters |

```typescript
// Example: React Query hook for patients
export function usePatients(params?: QueryParams) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientService.findAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Example: Zustand store for auth
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
```

### 4.4 API Client Architecture

```mermaid
graph LR
    subgraph "Frontend"
        Hook[React Query Hook]
        Service[Domain Service]
        Client[Axios Client]
    end

    subgraph "Interceptors"
        AuthInt[Auth Interceptor]
        TenantInt[Tenant Interceptor]
        ErrorInt[Error Interceptor]
    end

    subgraph "Backend"
        API[Backend Service]
    end

    Hook --> Service
    Service --> Client
    Client --> AuthInt
    AuthInt --> TenantInt
    TenantInt --> ErrorInt
    ErrorInt --> API

    style Hook fill:#61DAFB,color:#000
    style Service fill:#764ABC,color:#fff
    style Client fill:#FF6B6B,color:#fff
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Foundation as Foundation Service
    participant Redis
    participant DB as Database

    User->>Frontend: Enter credentials
    Frontend->>Foundation: POST /auth/login
    Foundation->>DB: Validate credentials (Argon2)
    DB-->>Foundation: User record
    
    alt MFA Enabled
        Foundation-->>Frontend: MFA required + temp token
        User->>Frontend: Enter MFA code
        Frontend->>Foundation: POST /auth/mfa/verify
        Foundation->>Foundation: Validate TOTP
    end

    Foundation->>Foundation: Generate JWT (15m) + Refresh (7d)
    Foundation->>Redis: Store session
    Foundation-->>Frontend: Tokens + User data
    Frontend->>Frontend: Store in memory + localStorage

    Note over User,DB: Subsequent API Requests

    Frontend->>Foundation: Request + Bearer Token
    Foundation->>Foundation: Validate JWT signature
    Foundation->>Redis: Check session valid
    Foundation-->>Frontend: Response

    Note over User,DB: Token Refresh

    Frontend->>Foundation: POST /auth/refresh
    Foundation->>Redis: Validate refresh token
    Foundation->>Foundation: Issue new access token
    Foundation-->>Frontend: New access token
```

### 5.2 Authorization (RBAC)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ACCESS CONTROL                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   User ──────► Role ──────► Permissions                            │
│     │           │              │                                    │
│     │           │              ├── patients:read                   │
│     │           │              ├── patients:write                  │
│     │           │              ├── encounters:read                 │
│     │           │              └── billing:manage                  │
│     │           │                                                   │
│     │           ├── Physician                                      │
│     │           ├── Nurse                                          │
│     │           ├── Billing Staff                                  │
│     │           └── Administrator                                  │
│     │                                                               │
│     └──────► Facility Scope (restricts access to specific facility)│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Security Controls

| Layer | Control | Implementation |
|-------|---------|----------------|
| **Transport** | TLS 1.3 | All traffic encrypted |
| **Authentication** | JWT + Refresh | 15m access / 7d refresh |
| **Password** | Argon2id | Industry-standard hashing |
| **MFA** | TOTP | Google Authenticator compatible |
| **Authorization** | RBAC + RLS | Permission + row-level |
| **Input Validation** | Zod schemas | Request validation |
| **Rate Limiting** | Redis-based | Per-user/IP limits |
| **CORS** | Strict origin | Whitelist only |
| **Headers** | Security headers | CSP, HSTS, X-Frame-Options |

### 5.4 Data Protection

> [!WARNING]
> **PHI (Protected Health Information)** must only reside in the `zeal_clinical` database.

| Data Type | Database | Encryption | Access |
|-----------|----------|------------|--------|
| User credentials | Foundation | Argon2 hash | Auth only |
| Patient demographics | Clinical | AES-256 at rest | Clinical staff |
| Medical records | Clinical | AES-256 at rest | Authorized providers |
| Financial data | RCM | AES-256 at rest | Billing staff |
| Audit logs | Analytics | Encrypted | Compliance officers |

---

## 6. Integration Architecture

### 6.1 UAE Healthcare Ecosystem

```mermaid
graph TB
    subgraph "Zeal Platform"
        Clinical[Clinical Service]
        RCM[RCM Service]
        HIE[HIE Connector]
        DHA[DHA Connector]
        DOH[DOH Connector]
    end

    subgraph "Dubai Health Authority"
        eClaimLink[eClaimLink]
        NABIDH[NABIDH HIE]
    end

    subgraph "Abu Dhabi DOH"
        Shafafiya[Shafafiya]
        Malaffi[Malaffi HIE]
    end

    subgraph "Federal MOH"
        Riayati[Riayati HIE]
    end

    Clinical --> HIE
    RCM --> DHA
    RCM --> DOH

    HIE -->|FHIR R4| NABIDH
    HIE -->|FHIR R4| Malaffi
    HIE -->|FHIR R4| Riayati

    DHA -->|XML| eClaimLink
    DOH -->|XML| Shafafiya

    style eClaimLink fill:#E91E63,color:#fff
    style NABIDH fill:#E91E63,color:#fff
    style Shafafiya fill:#00BCD4,color:#fff
    style Malaffi fill:#00BCD4,color:#fff
    style Riayati fill:#4CAF50,color:#fff
```

### 6.2 Integration Protocols

| System | Protocol | Format | Purpose |
|--------|----------|--------|---------|
| DHA eClaimLink | HTTPS | XML | Claims submission |
| DOH Shafafiya | HTTPS | XML | Prior authorization |
| NABIDH | FHIR R4 | JSON | Clinical data exchange |
| Malaffi | FHIR R4 | JSON | Clinical data exchange |
| Riayati | FHIR R4 | JSON | National patient index |
| Labs | HL7 v2.x | HL7 | Orders & results |
| Imaging | DICOM | Binary | Radiology integration |

### 6.3 Claims Submission Flow

```mermaid
sequenceDiagram
    participant Provider
    participant RCM as RCM Service
    participant Rules as Rules Engine
    participant DHA as DHA Connector
    participant eClaimLink

    Provider->>RCM: Submit claim
    RCM->>Rules: Validate claim
    Rules->>Rules: Check medical necessity
    Rules->>Rules: Validate coding
    Rules-->>RCM: Validation result
    
    alt Validation Failed
        RCM-->>Provider: Errors to fix
    else Validation Passed
        RCM->>DHA: Format XML claim
        DHA->>eClaimLink: Submit claim
        eClaimLink-->>DHA: Acknowledgment
        DHA-->>RCM: Submission status
        RCM-->>Provider: Claim submitted
    end
```

---

## 7. Data Architecture

### 7.1 Database Topology

> [!NOTE]
> The platform uses a **4-database architecture** for domain isolation (see [ADR-0013](../adr/ADR-0013-service-decomposition.md)).

```mermaid
graph TB
    subgraph "Database Layer"
        subgraph "Foundation DB"
            FT[Tenants]
            FU[Users]
            FR[Roles]
            FF[Facilities]
            FS[Staff]
        end

        subgraph "Clinical DB"
            CP[Patients]
            CE[Encounters]
            CA[Appointments]
            CC[Charts]
            CI[Inpatient]
        end

        subgraph "RCM DB"
            RC[Charges]
            RI[Invoices]
            RP[Payers]
            RCL[Claims]
        end

        subgraph "Analytics DB"
            AA[Audit Logs]
            AM[Metrics]
            AE[Events]
        end
    end

    style FT fill:#4CAF50,color:#fff
    style CP fill:#2196F3,color:#fff
    style RC fill:#FF9800,color:#fff
    style AA fill:#9C27B0,color:#fff
```

### 7.2 Database Summary

| Database | Schema | Tables | Primary Data | Est. Size |
|----------|--------|--------|--------------|-----------|
| `zeal_foundation` | public | ~25 | Config, Users, RBAC | Small |
| `zeal_clinical` | public | ~50 | PHI, Encounters, Scheduling | Large |
| `zeal_rcm` | public | ~30 | Billing, Claims, Insurance | Medium |
| `zeal_analytics` | public | ~15 | Audit, Metrics | Growing |

### 7.3 Multi-Tenancy Implementation

All tables include a `tenant_id` column with **Row-Level Security (RLS)** enforced at the database level.

```sql
-- Example RLS policy
CREATE POLICY tenant_isolation ON patients
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Set tenant context before queries
SET app.tenant_id = 'tenant-uuid-here';
```

```mermaid
graph LR
    Request[API Request]
    Middleware[Tenant Middleware]
    Context[Request Context]
    Prisma[Prisma Client]
    RLS[PostgreSQL RLS]
    Data[Tenant Data]

    Request --> Middleware
    Middleware -->|Extract tenant_id| Context
    Context --> Prisma
    Prisma -->|SET app.tenant_id| RLS
    RLS -->|Filter by tenant| Data
```

---

## 8. Deployment & Infrastructure

### 8.1 Environment Strategy

| Environment | Purpose | URL Pattern | Database |
|-------------|---------|-------------|----------|
| **Local** | Development | localhost:3xxx | Local Docker |
| **Dev** | Integration testing | dev.zeal.health | Dev cluster |
| **Staging** | Pre-production | staging.zeal.health | Staging cluster |
| **Production** | Live system | app.zeal.health | Production cluster |

### 8.2 Container Architecture

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Ingress"
            ING[NGINX Ingress]
        end

        subgraph "Application Pods"
            FP[Foundation Pods<br/>Replicas: 2-4]
            CP[Clinical Pods<br/>Replicas: 2-4]
            RP[RCM Pods<br/>Replicas: 2-4]
            PP[PRM Pods<br/>Replicas: 1-2]
            WP[Frontend Pods<br/>Replicas: 2-4]
        end

        subgraph "Data Layer"
            PG[(PostgreSQL<br/>Primary + Replica)]
            RD[(Redis Cluster)]
        end

        subgraph "Observability"
            PROM[Prometheus]
            GRAF[Grafana]
            LOKI[Loki]
        end
    end

    ING --> WP
    ING --> FP
    ING --> CP
    ING --> RP
    ING --> PP

    FP --> PG
    CP --> PG
    RP --> PG
    PP --> PG

    FP --> RD
    CP --> RD

    FP --> PROM
    CP --> PROM
    RP --> PROM
```

### 8.3 CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        Code[Code Push]
        PR[Pull Request]
    end

    subgraph "CI Pipeline"
        Lint[Lint & Format]
        Test[Unit Tests]
        Build[Docker Build]
        Scan[Security Scan]
    end

    subgraph "CD Pipeline"
        DevDeploy[Deploy Dev]
        StageDeploy[Deploy Staging]
        ProdDeploy[Deploy Prod]
    end

    Code --> PR
    PR --> Lint
    Lint --> Test
    Test --> Build
    Build --> Scan
    Scan --> DevDeploy
    DevDeploy -->|Manual Approval| StageDeploy
    StageDeploy -->|Manual Approval| ProdDeploy

    style ProdDeploy fill:#E91E63,color:#fff
```

### 8.4 Local Development Setup

```bash
# 1. Start infrastructure
docker-compose up -d postgres redis

# 2. Setup backend
cd backend
npm install
npm run build --workspace=@zeal/database-foundation
npm run build --workspace=@zeal/database-clinical
npx prisma db push --schema shared/database-foundation/prisma/schema.prisma
./seed/run-seeds.sh foundation

# 3. Start services
npm run dev --workspace=@zeal/foundation  # Port 3010
npm run dev --workspace=@zeal/clinical    # Port 3011
npm run dev --workspace=@zeal/rcm         # Port 3012

# 4. Start frontend
cd frontend
npm install
npm run dev                               # Port 3000
```

---

## 9. Observability & Monitoring

### 9.1 Observability Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY STACK                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│   │   METRICS   │    │    LOGS     │    │   TRACES    │           │
│   │ Prometheus  │    │    Loki     │    │   Jaeger    │           │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘           │
│          │                  │                  │                   │
│          └──────────────────┼──────────────────┘                   │
│                             │                                       │
│                      ┌──────┴──────┐                               │
│                      │   GRAFANA   │                               │
│                      │  Dashboards │                               │
│                      └─────────────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Key Metrics

| Category | Metric | Alert Threshold |
|----------|--------|-----------------|
| **Availability** | Service uptime | < 99.9% |
| **Latency** | P95 response time | > 500ms |
| **Errors** | 5xx error rate | > 1% |
| **Saturation** | CPU utilization | > 80% |
| **Database** | Connection pool | > 90% used |
| **Cache** | Redis hit rate | < 80% |

### 9.3 Logging Strategy

| Level | Use Case | Retention |
|-------|----------|-----------|
| **ERROR** | Exceptions, failures | 90 days |
| **WARN** | Degraded performance | 30 days |
| **INFO** | Business events | 14 days |
| **DEBUG** | Development only | 1 day |

```typescript
// Structured logging with Pino
logger.info({
  event: 'patient_created',
  patientId: patient.id,
  tenantId: context.tenantId,
  userId: context.userId,
  duration: Date.now() - startTime,
});
```

---

## 10. Performance & Scalability

### 10.1 Caching Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        Browser[Browser Cache<br/>Static Assets]
        CDN[CDN Cache<br/>Images, JS, CSS]
        Redis[Redis Cache<br/>API Responses]
        Query[Query Cache<br/>Database Results]
    end

    Client[Client] --> Browser
    Browser --> CDN
    CDN --> Redis
    Redis --> Query
    Query --> DB[(Database)]

    style Redis fill:#DC382D,color:#fff
```

### 10.2 Cache TTL Configuration

| Data Type | Cache Location | TTL | Invalidation |
|-----------|---------------|-----|--------------|
| Static assets | CDN | 1 year | Version hash |
| Config | Redis | 5 min | Manual |
| User session | Redis | 15 min | Logout |
| Reference data | Redis | 1 hour | Scheduled |
| Search results | Redis | 5 min | On write |

### 10.3 Database Optimization

| Technique | Implementation |
|-----------|----------------|
| **Connection Pooling** | Prisma connection pool (10-50) |
| **Indexing** | Composite indexes on tenant_id + common filters |
| **Query Optimization** | Eager loading, select specific fields |
| **Read Replicas** | For reporting queries (planned) |
| **Partitioning** | By tenant_id for large tables (planned) |

### 10.4 Scalability Targets

| Metric | Current | Target |
|--------|---------|--------|
| Concurrent users | 100 | 10,000 |
| API requests/sec | 50 | 5,000 |
| Database connections | 50 | 500 |
| Response time (P95) | 200ms | < 100ms |

---

## 11. Future Roadmap

### 11.1 Planned Enhancements

| Timeline | Feature | Description |
|----------|---------|-------------|
| **Q1 2026** | Message Queue | Kafka for async workflows |
| **Q2 2026** | AI Integration | Clinical note drafting, coding assistance |
| **Q3 2026** | Mobile App | React Native provider app |
| **Q4 2026** | Real-time | WebSocket for live updates |

### 11.2 Architecture Evolution

```mermaid
graph LR
    subgraph "Current State"
        REST[REST APIs]
        Sync[Synchronous]
    end

    subgraph "Future State"
        RESTF[REST APIs]
        Events[Event-Driven]
        GRPC[gRPC Internal]
        WS[WebSockets]
    end

    REST --> RESTF
    Sync --> Events
    Sync --> GRPC
    REST --> WS

    style Events fill:#4CAF50,color:#fff
    style GRPC fill:#2196F3,color:#fff
    style WS fill:#FF9800,color:#fff
```

---

## 12. Related Documentation

| Document | Description |
|----------|-------------|
| [Architecture Diagrams](./02-Architecture-Diagram.md) | Detailed C4 diagrams and sequences |
| [Domain Model](./03-Domain-Model.md) | DDD domain models |
| [Data Model](./05-Data-Model.md) | Database schema design |
| [Backend Architecture](./BACKEND-ARCHITECTURE.md) | Detailed backend design |
| [ADR-0013: Service Decomposition](../adr/ADR-0013-service-decomposition.md) | 4-database architecture decision |
| [ADR-0003: Multi-tenancy](../adr/ADR-0003-multitenancy.md) | Tenant isolation strategy |
| [ADR-0005: RBAC](../adr/ADR-0005-rbac-access-control.md) | Access control design |
| [Security & Compliance](../security/08-Security-&-Compliance.md) | Security architecture |
| [Multi-tenancy Guide](../multitenancy/README.md) | Tenant implementation details |

---

## Quick Reference

### Local Development URLs

```
┌─────────────────────────────────────────────────────────────────┐
│ SERVICE            │ URL                      │ PURPOSE         │
├────────────────────┼──────────────────────────┼─────────────────┤
│ Frontend           │ http://localhost:3000    │ Web Application │
│ Foundation API     │ http://localhost:3010    │ Auth, Users     │
│ Foundation Docs    │ http://localhost:3010/docs│ Swagger UI     │
│ Clinical API       │ http://localhost:3011    │ Patients, EMR   │
│ Clinical Docs      │ http://localhost:3011/docs│ Swagger UI     │
│ RCM API            │ http://localhost:3012    │ Billing         │
│ RCM Docs           │ http://localhost:3012/docs│ Swagger UI     │
│ pgAdmin            │ http://localhost:8080    │ Database UI     │
│ RedisInsight       │ http://localhost:5540    │ Cache UI        │
└────────────────────┴──────────────────────────┴─────────────────┘
```

### Essential Commands

```bash
# Start all infrastructure
docker-compose up -d

# Run all services (from backend/)
npm run dev --workspace=@zeal/foundation &
npm run dev --workspace=@zeal/clinical &
npm run dev --workspace=@zeal/rcm &

# Seed databases
./seed/run-seeds.sh foundation
./seed/run-seeds.sh clinical

# Run tests
npm test --workspace=@zeal/foundation
npm run test --workspace=frontend
```

---

*Document maintained by the Engineering Team. For questions, contact the Architecture Guild.*
