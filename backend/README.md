# Zeal Backend Services

This directory contains the backend services for the Zeal PMS/RCM platform, implemented using NestJS with TypeScript following the ADR-0001 language split decision.

## Architecture Overview

The backend is organised by domain. Each domain currently ships as a single NestJS deployable that can be split into smaller services as teams and scale demand.

### Domain Deployables

1. **Foundation Service** (`services/foundation/`) – Authentication, tenancy/org management, catalog, staff, RBAC, MFA.
2. **Clinical Service** (`services/clinical/`) – Patients, scheduling, encounters, care plans (scaffolded; modules landing incrementally).
3. **RCM Service** (`services/rcm/`) – Billing, claims, eligibility, AR/pharmacy (scaffolded for future modules).

Additional services (AI, integrations, notifications, reporting, etc.) remain on the roadmap and reuse the shared packages found under `shared/`.

### Shared Components

1. **Database** (`shared/database/`) - Prisma client, transactions, middleware
2. **Contracts** (`contracts/`) - Shared types, schemas, and API contracts
3. **Types** (`shared/types/`) - Common type definitions
4. **Utils** (`shared/utils/`) - Utility functions
5. **Middleware** (`shared/middleware/`) - Common middleware
6. **Validators** (`shared/validators/`) - Validation utilities

## Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Argon2 password hashing
- **Validation**: Zod schemas
- **Messaging**: Kafka/RabbitMQ for async communication
- **Caching**: Redis for session and data caching
- **Monitoring**: OpenTelemetry, Prometheus, Grafana

## Service Implementation Status

### ✅ Completed

#### Foundation Layer
- **Shared Database Module**: Prisma schema, client, transactions, middleware
- **Contracts Package**: Common types, Zod schemas, API contracts
- **Project Structure**: Monorepo setup with Turbo, TypeScript configuration

#### Authentication & Authorization
- **Foundation Service (Auth module)**: Complete RBAC implementation with MFA support
  - JWT authentication with refresh tokens
  - Role-based access control (RBAC)
  - Multi-factor authentication (TOTP, SMS, Email)
  - User and role management
  - Permission-based authorization
  - Session management
  - Trusted device support
  - Password reset functionality

### 🚧 In Progress

#### Core PMS Services
- **Patient Module**: Patient management, search, medical history
- **Appointment Module**: Scheduling, resource management
- **Encounter Module**: Clinical encounters and documentation
- **Staff Module**: Healthcare provider management
- **Facility Module**: Location and facility management
- **Clinical Module**: Clinical notes, orders, vitals

### 📋 Pending

#### Billing & RCM
- **Billing Service**: Charge capture, superbills, fee schedules
- **RCM Service**: Claims processing, ERA handling, AR management

#### AI & ML Services
- **Note Drafting**: AI-assisted clinical documentation
- **Coding Assistant**: ICD/CPT code suggestions
- **Denial Prediction**: ML-based claim denial risk assessment
- **Document AI**: OCR and EOB parsing

#### Integrations
- **HIE Integration**: NABIDH, Malaffi, Riayati connectivity
- **UAE Connectors**: DHA eClaimLink, DOH Shafafiya
- **Clearinghouse**: Post-office integration

#### Operations
- **Notifications**: Multi-channel notification system
- **Audit**: Comprehensive audit logging
- **Reporting**: Analytics and KPI dashboards

## Key Features Implemented

### Authentication & Security
- ✅ JWT-based authentication with refresh tokens
- ✅ Argon2 password hashing
- ✅ Multi-factor authentication (TOTP, SMS, Email)
- ✅ Role-based access control (RBAC)
- ✅ Permission-based authorization
- ✅ Session management and device tracking
- ✅ Password reset with secure tokens
- ✅ Account lockout and brute force protection

### Database & Data Management
- ✅ Prisma ORM with PostgreSQL
- ✅ Row-level security (RLS) for multi-tenancy
- ✅ Transaction management with retry logic
- ✅ Database middleware for audit and validation
- ✅ Comprehensive error handling
- ✅ Multi-language support with translations table

### API Design
- ✅ RESTful API design with OpenAPI specifications
- ✅ Zod-based request/response validation
- ✅ Comprehensive error handling and responses
- ✅ Pagination and filtering support
- ✅ Search functionality with full-text search

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Redis (for caching and sessions)

### Installation
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

### Development
```bash
# Start all services in development mode
npm run dev

# Start individual services
npm run dev --workspace=@zeal/foundation
npm run dev --workspace=@zeal/clinical
npm run dev --workspace=@zeal/rcm
```

### Testing
```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=@zeal/foundation
```

## API Documentation

Each service provides OpenAPI documentation:
- Foundation API: `http://localhost:3010/docs`
- Clinical API: `http://localhost:3020/docs`
- RCM API: `http://localhost:3030/docs`

## Database Schema

The database schema includes:
- Multi-tenant architecture with tenant isolation
- Comprehensive RBAC with roles and permissions
- Patient management with Emirates ID validation
- Clinical data with FHIR-compatible structures
- HIE integration tables for NABIDH, Malaffi, Riayati
- Multi-language support with translations
- Audit logging and compliance tracking

## Security Features

- **Multi-tenancy**: Complete tenant isolation with RLS
- **Authentication**: JWT with secure refresh token rotation
- **Authorization**: Granular permission-based access control
- **MFA**: Multiple MFA methods with backup codes
- **Audit**: Comprehensive audit trails for compliance
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Strict validation with Zod schemas

## Next Steps

1. **Complete PMS Core**: Finish patient, appointment, and encounter modules
2. **Implement Billing**: Add billing and charge capture functionality
3. **Add RCM Features**: Implement claims processing and ERA handling
4. **AI Integration**: Add AI services for clinical assistance
5. **HIE Connectivity**: Implement UAE HIE platform integrations
6. **Monitoring**: Add comprehensive observability and monitoring

## Contributing

1. Follow the established patterns and ADRs
2. Ensure all new code includes proper TypeScript types
3. Add comprehensive tests for new functionality
4. Update documentation for API changes
5. Follow the security and validation patterns established

## Architecture Decisions

This implementation follows the architectural decisions documented in the ADRs:
- ADR-0001: Language Split (Node.js/TypeScript for APIs)
- ADR-0003: Multi-tenancy Model
- ADR-0005: RBAC Access Control
- ADR-0012: HIE Integration Architecture

For complete architectural decisions, see the `docs/adr/` directory.







