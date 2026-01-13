# Zeal Platform - Technical Architecture

**Version**: 1.0.0
**Last Updated**: January 2026
**Status**: Active

## 1. Executive Summary

Zeal is a comprehensive, multi-tenant SaaS platform for healthcare providers in the UAE. It combines Practice Management (PMS) and Revenue Cycle Management (RCM) into a unified solution. The architecture is designed for:

*   **Scalability**: Microservices-based backend with independent scaling.
*   **Compliance**: Strict data isolation and regulatory adherence (DHA, DOH, MOH).
*   **Performance**: Optimized frontend and efficient database patterns.
*   **Maintainability**: Domain-Driven Design (DDD) with clear boundaries.

---

## 2. Overall System Architecture

The high-level architecture follows a modern cloud-native pattern, connecting varied client interfaces to a robust set of backend services via a unified API Gateway.

```mermaid
C4Container
    title Overall System Architecture - Zeal Platform

    %% Actors
    Person(patient, "Patient", "Mobile/Web")
    Person(provider, "Provider", "Web/Tablet")
    Person(admin, "Admin", "Web Portal")

    %% System Boundary
    System_Boundary(zeal, "Zeal Platform") {
        
        %% Frontend Layer
        Container(webapp, "Web Application", "Next.js (React)", "Unified Monolith: Foundation, Clinical, RCM modules")
        
        %% Gateway
        Container(gateway, "API Gateway", "Kong / Nginx", "Routing, Auth Verification, Rate Limiting")

        %% Backend Services
        Container(id_svc, "Foundation Service", "NestJS", "Identity, RBAC, Tenants, Facilities")
        Container(clin_svc, "Clinical Service", "NestJS", "Patients, Encounters, EMR, Orders")
        Container(rcm_svc, "RCM Service", "NestJS", "Billing, Claims, Remittances")
        Container(prm_svc, "PRM Service", "NestJS", "Patient Engagement, Tasks, Rules")
        Container(analytics_svc, "Analytics Service", "NestJS", "Reporting, Audit Logs")

        %% Storage Layer
        ContainerDb(db_foundation, "Foundation DB", "PostgreSQL", "Config, Users")
        ContainerDb(db_clinical, "Clinical DB", "PostgreSQL", "Clinical Data")
        ContainerDb(db_rcm, "RCM DB", "PostgreSQL", "Financial Data")
        ContainerDb(redis, "Cache", "Redis", "Sessions, Reference Data")
        ContainerDb(os, "OpenSearch", "OpenSearch", "Logs, Full-text Search")
    }

    %% External Systems
    System_Ext(dha, "DHA / DOH", "Regulatory Bodies")
    System_Ext(hie, "HIE (Nabidh/Malaffi)", "Health Information Exchange")
    System_Ext(pay, "Payment Gateway", "Stripe / Network")

    %% Relationships
    Rel(patient, webapp, "Uses")
    Rel(provider, webapp, "Uses")
    Rel(admin, webapp, "Uses")

    Rel(webapp, gateway, "HTTPS/REST")
    
    Rel(gateway, id_svc, "Routes")
    Rel(gateway, clin_svc, "Routes")
    Rel(gateway, rcm_svc, "Routes")
    Rel(gateway, prm_svc, "Routes")
    Rel(gateway, analytics_svc, "Routes")

    Rel(id_svc, db_foundation, "R/W")
    Rel(clin_svc, db_clinical, "R/W")
    Rel(rcm_svc, db_rcm, "R/W")
    
    Rel(rcm_svc, dha, "Claims (XML/API)")
    Rel(clin_svc, hie, "Clinical Data (FHIR)")
```

### Technology Stack Overview

| Layer | Technology | Key Components |
| :--- | :--- | :--- |
| **Frontend** | React (Next.js) | App Router, Tailwind CSS, TanStack Query, Zustand |
| **Backend** | Node.js (NestJS) | TypeScript, Prisma ORM, Express (micro-services) |
| **Database** | PostgreSQL 16 | Row-Level Security (RLS), Partitioning |
| **Infra** | Docker/K8s | Redis, Kafka (Future), OpenSearch |

---

## 3. Backend Architecture

The backend adopts a **Database-per-Service** pattern to ensure decoupling and domain isolation. Communication between services occurs primarily via synchronous REST APIs, with future provisions for asynchronous event-driven patterns.

```mermaid
graph TB
    subgraph "Core Domain Services"
        direction TB
        
        subgraph "Foundation Domain"
            FS[Foundation Service]
            FDB[(Foundation DB)]
            FS --> FDB
            FS_API[Auth, Tenants, Users]
            FS --- FS_API
        end

        subgraph "Clinical Domain"
            CS[Clinical Service]
            CDB[(Clinical DB)]
            CS --> CDB
            CS_API[EMR, Orders, Vitals]
            CS --- CS_API
        end

        subgraph "RCM Domain"
            RS[RCM Service]
            RDB[(RCM DB)]
            RS --> RDB
            RS_API[Claims, Invoices]
            RS --- RS_API
        end
        
        subgraph "Support Services"
            PS[PRM Service]
            PDB[(PRM DB)]
            PS --> PDB
            
            AS[Analytics Service]
            ADB[(Analytics DB)]
            AS --> ADB
        end
    end

    subgraph "Shared Infrastructure"
        Redis[(Redis Cache)]
        Gateway[API Gateway]
    end

    Gateway --> FS
    Gateway --> CS
    Gateway --> RS
    Gateway --> PS
    Gateway --> AS

    FS -.-> Redis
    CS -.-> Redis
    
    %% Cross-service (Logical)
    CS -.->|Verify User| FS
    RS -.->|Get Encounter| CS
```

### Key Architectural Patterns

1.  **Multi-Tenancy**: Implemented via **Row-Level Security (RLS)** in PostgreSQL. Every query is scoped to a `tenant_id` passed via the session context.
2.  **Shared Libraries**: A monorepo structure hosts shared packages for standard tasks:
    *   `@zeal/database-*`: Typed Prisma clients for each DB.
    *   `@zeal/common`: Middleware, Guards, DTOs, and Utilities.
3.  **Type Safety**: End-to-end TypeScript. Prisma schemas generate types that are used in service logic and exposed to the frontend via shared DTOs.

---

## 4. Frontend Architecture

The frontend is a **Modular Monolith** built on Next.js. It logically separates business domains (modules) while sharing core UI foundations and context providers.

```mermaid
graph TD
    subgraph "Next.js Application"
        
        subgraph "App Layer (Router)"
            Layout[Root Layout]
            Router[App Router]
        end

        subgraph "Context Providers"
            AuthCtx[Auth Context]
            TenantCtx[Tenant Context]
            UICtx[UI Theme Context]
        end

        subgraph "Domain Modules"
            tobill[Billing Module]
            toclin[Clinical Module]
            tofound[Foundation Module]
        end

        subgraph "Shared Core"
            UIComponents["UI Components (Shadcn)"]
            APIClient[Unified Axios Client]
            Hooks[Custom Hooks]
        end

        Layout --> AuthCtx
        AuthCtx --> TenantCtx
        TenantCtx --> Router

        Router --> toclin
        Router --> tobill
        Router --> tofound

        toclin --> UIComponents
        tobill --> UIComponents
        tofound --> UIComponents

        toclin --> APIClient
        tobill --> APIClient
    end
```

### Frontend Strategy

*   **Framework**: **Next.js 14+ (App Router)** for server-side rendering capability and efficient routing.
*   **State Management**:
    *   **Server State**: `TanStack Query` (React Query) handles data fetching, caching, and synchronization.
    *   **Client State**: `Zustand` for lightweight global state (auth tokens, user preferences).
    *   **Form State**: `React Hook Form` + `Zod` for schema-based validation.
*   **Styling**: `Tailwind CSS` for utility-first styling combined with `Shadcn/ui` for accessible, pre-built component primitives.
*   **Design System**: A centralized `shared/components` directory ensures visual consistency across all modules.

---

## 5. Deployment & Data Flow

1.  **Request Flow**:
    *   User \-> CDN \-> API Gateway \-> Service \-> DB.
2.  **Security**:
    *   All Traffic over TLS 1.3.
    *   JWT Tokens (Access + Refresh) for stateless authentication.
    *   WAF protection at the Gateway level.
3.  **Scalability**:
    *   Services are stateless containerized (Docker) applications.
    *   Can scale horizontally based on CPU/Memory load.
    *   Read-heavy operations can be offloaded to Read Replicas (future).

## 6. Future Considerations

*   **Message Queue**: Introduction of Kafka/RabbitMQ for decoupling complex workflows (e.g., Claim Submission -> Status Update).
*   **AI Integration**: Dedicated Python microservices for AI/ML tasks (OCR, coding assistance), communicating via gRPC/REST.
