# Zeal Healthcare Platform

Zeal is an AI-driven, multi-tenant Practice Management System (PMS) + Electronic Health Record (EHR) + Revenue Cycle Management (RCM) SaaS platform designed for healthcare providers in the UAE.

## Overview

The platform provides comprehensive healthcare management capabilities including patient registration, clinical encounters, scheduling, billing, and revenue cycle management. Built with strict domain boundaries following a 4-database architecture for security and compliance.

### Key Features

- **Multi-Tenant Architecture**: Complete tenant isolation with Row-Level Security (RLS)
- **Domain-Driven Design**: Strict boundaries between Foundation, Clinical, RCM, and PRM domains
- **Healthcare Compliance**: HIPAA, GDPR, UAE PDPL compliant architecture
- **UAE Integration Ready**: Prepared for NABIDH, Malaffi, Riayati HIE platforms
- **Internationalization**: Full support for English and Arabic (RTL)

## Project Structure

```
zeal/
├── backend/                    # Backend monorepo
│   ├── services/               # NestJS microservices
│   │   ├── foundation/         # Tenancy, RBAC, users, facilities (port 3010)
│   │   ├── clinical/           # Patients, encounters, scheduling (port 3011)
│   │   ├── rcm/                # Billing, insurance, coding (port 3012)
│   │   ├── prm/                # Patient relationship management (port 3013)
│   │   └── pms/                # Pharmacy management (placeholder)
│   ├── shared/                 # Shared packages
│   │   ├── database-foundation/ # Prisma client for zeal_foundation
│   │   ├── database-clinical/   # Prisma client for zeal_clinical
│   │   ├── database-rcm/        # Prisma client for zeal_rcm
│   │   ├── database-prm/        # Prisma client for zeal_prm
│   │   ├── config-client/       # Hierarchical configuration client
│   │   ├── utils/               # Shared utilities
│   │   └── types/               # Shared type definitions
│   └── contracts/              # Shared DTOs and Zod schemas
├── frontend/                   # Next.js 14 application
│   └── src/
│       ├── app/                # App Router pages
│       ├── components/         # Shared UI components
│       ├── modules/            # Domain modules (clinical, foundation, rcm, prm)
│       ├── lib/                # Core utilities and API clients
│       └── hooks/              # React hooks
├── docs/                       # Documentation
│   ├── architecture/           # System architecture
│   ├── adr/                    # Architecture Decision Records
│   ├── features/               # Feature documentation
│   ├── api/                    # API documentation
│   └── runbooks/               # Operational guides
├── seed/                       # Database seed files
│   ├── foundation/             # Foundation DB seeds
│   ├── clinical/               # Clinical DB seeds
│   └── rcm/                    # RCM DB seeds
└── init-scripts/               # Database initialization
```

## Technology Stack

### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18+ |
| Framework | NestJS with TypeScript |
| Database | PostgreSQL 16 with Prisma ORM |
| Caching | Redis 7 |
| Authentication | JWT with refresh tokens |
| Validation | Zod schemas |
| API Style | REST with OpenAPI/Swagger |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | Zustand + React Query |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |
| Documentation | Storybook 8 |

### Infrastructure
| Component | Technology |
|-----------|------------|
| Containerization | Docker |
| Orchestration | Kubernetes (EKS) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm 9+

### 1. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma clients
npm run build --workspace=@zeal/database-foundation
npm run build --workspace=@zeal/database-clinical
npm run build --workspace=@zeal/database-rcm
npm run build --workspace=@zeal/database-prm

# Push schema to databases
npx prisma db push --schema shared/database-foundation/prisma/schema.prisma
npx prisma db push --schema shared/database-clinical/prisma/schema.prisma
npx prisma db push --schema shared/database-rcm/prisma/schema.prisma
npx prisma db push --schema shared/database-prm/prisma/schema.prisma

# Seed the databases
./seed/run-seeds.sh foundation
./seed/run-seeds.sh clinical
```

### 3. Start Backend Services

```bash
# Start Foundation service (port 3010)
npm run dev --workspace=@zeal/foundation

# Start Clinical service (port 3011)
npm run dev --workspace=@zeal/clinical

# Start RCM service (port 3012)
npm run dev --workspace=@zeal/rcm
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_FOUNDATION_BASE_URL=http://localhost:3010
NEXT_PUBLIC_CLINICAL_BASE_URL=http://localhost:3011
NEXT_PUBLIC_RCM_BASE_URL=http://localhost:3012
EOF

# Start development server
npm run dev
```

### 5. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Foundation API Docs | http://localhost:3010/docs |
| Clinical API Docs | http://localhost:3011/docs |
| RCM API Docs | http://localhost:3012/docs |
| pgAdmin | http://localhost:8080 |
| RedisInsight | http://localhost:5540 |

## Database Architecture

The platform uses a 4-database architecture for domain isolation (see [ADR-0013](docs/adr/ADR-0013-service-decomposition.md)):

| Database | Domain | Purpose |
|----------|--------|---------|
| `zeal_foundation` | Foundation | Tenants, users, RBAC, facilities, staff |
| `zeal_clinical` | Clinical | Patients (PHI), encounters, scheduling |
| `zeal_rcm` | RCM | Billing, insurance, claims |
| `zeal_analytics` | Analytics | Audit logs, usage events |

**Important**: Cross-database joins are not allowed. Use REST APIs for inter-domain data access.

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test --workspace=@zeal/foundation
npm test --workspace=@zeal/clinical

# Frontend tests
cd frontend
npm run test
```

### Code Style

- 2-space indentation
- ESLint + Prettier enforced
- Conventional commit messages (`feat:`, `fix:`, `docs:`)

### Environment Variables

Backend services require environment files. See individual service READMEs:
- [Foundation Service](backend/services/foundation/README.md)
- [Clinical Service](backend/services/clinical/README.md)
- [RCM Service](backend/services/rcm/README.md)

## Documentation

Comprehensive documentation is available in the [docs/](docs/) folder:

- [Architecture Overview](docs/architecture/README.md)
- [Architecture Decision Records](docs/adr/)
- [API Documentation](docs/api/README.md)
- [Feature Documentation](docs/features/README.md)
- [Development Guides](docs/development/README.md)
- [Operational Runbooks](docs/runbooks/)

## Contributing

1. Follow the established patterns and [ADRs](docs/adr/)
2. Ensure TypeScript types are properly defined
3. Add tests for new functionality
4. Update documentation for API changes
5. Use conventional commit messages

## License

Proprietary - All rights reserved.
