# Foundation Service

The Foundation Service is the core service for the Zeal Healthcare Platform, handling tenancy, authentication, authorization, user management, and organizational hierarchy.

## Overview

This service manages all foundational entities that other services depend on, including:

- **Authentication & Authorization**: JWT-based auth with MFA support, RBAC
- **Tenant Management**: Multi-tenant isolation and configuration
- **User Management**: User accounts and staff linkage
- **Facility Hierarchy**: Facilities, departments, wards, beds, clinics, spaces
- **Staff Management**: Healthcare provider profiles and specialties
- **Configuration**: Hierarchical configuration (instance/tenant/facility levels)

## Port

**Default Port**: 3010

## Technology Stack

- NestJS with TypeScript
- PostgreSQL (via Prisma ORM)
- JWT authentication with Argon2 password hashing
- Swagger/OpenAPI documentation

## Module Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── common/
│   └── logger/                # Pino logging service
└── modules/
    ├── auth/                  # Authentication & authorization
    │   ├── controllers/       # Auth endpoints
    │   ├── services/          # Auth, MFA, user services
    │   ├── guards/            # JWT, roles, permissions guards
    │   ├── decorators/        # @Roles, @Permissions decorators
    │   └── dto/               # Auth DTOs
    ├── tenant/                # Tenant management
    ├── user/                  # User account management
    ├── user-facility/         # User-facility assignments
    ├── facility/              # Facility management
    ├── department/            # Department management
    ├── ward/                  # Ward management
    ├── bed/                   # Bed management
    ├── clinic/                # Clinic/outpatient settings
    ├── space/                 # Physical space management
    ├── staff/                 # Healthcare staff management
    ├── specialty/             # Medical specialties
    ├── rbac/                  # Role-based access control
    ├── config/                # Hierarchical configuration
    └── health/                # Health check endpoints
```

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user and get tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/change-password` | Change user password |
| POST | `/auth/reset-password` | Request password reset |
| POST | `/auth/confirm-reset-password` | Confirm password reset |
| POST | `/auth/mfa/verify` | Verify MFA code |
| GET | `/auth/mfa/status` | Get MFA status |
| POST | `/auth/switch-facility` | Switch active facility context |

### Tenants (`/tenants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tenants` | Create new tenant |
| GET | `/tenants` | List all tenants |
| GET | `/tenants/:id` | Get tenant by ID |
| PUT | `/tenants/:id` | Update tenant |
| DELETE | `/tenants/:id` | Delete tenant |

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create new user |
| GET | `/users` | List users with pagination |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| PATCH | `/users/:id/staff` | Link user to staff profile |
| DELETE | `/users/:id` | Delete user |

### Facilities (`/facilities`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/facilities` | Create facility |
| GET | `/facilities` | List facilities |
| GET | `/facilities/:id` | Get facility by ID |
| PUT | `/facilities/:id` | Update facility |
| DELETE | `/facilities/:id` | Archive facility |
| GET | `/facilities/:id/specialties` | Get facility specialties |

### Departments (`/facilities/:facilityId/departments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/facilities/:facilityId/departments` | Create department |
| GET | `/facilities/:facilityId/departments` | List departments |
| GET | `/facilities/:facilityId/departments/:id` | Get department |
| PATCH | `/facilities/:facilityId/departments/:id` | Update department |
| DELETE | `/facilities/:facilityId/departments/:id` | Delete department |

### Wards (`/facilities/:facilityId/wards`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/facilities/:facilityId/wards` | Create ward |
| GET | `/facilities/:facilityId/wards` | List wards |
| GET | `/facilities/:facilityId/wards/:id` | Get ward |
| PATCH | `/facilities/:facilityId/wards/:id` | Update ward |
| DELETE | `/facilities/:facilityId/wards/:id` | Delete ward |

### Beds (`/facilities/:facilityId/beds`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/facilities/:facilityId/beds` | Create bed |
| GET | `/facilities/:facilityId/beds` | List beds |
| GET | `/facilities/:facilityId/beds/:id` | Get bed |
| PATCH | `/facilities/:facilityId/beds/:id` | Update bed |
| DELETE | `/facilities/:facilityId/beds/:id` | Delete bed |
| POST | `/facilities/:facilityId/beds/:id/assign` | Assign patient to bed |
| POST | `/facilities/:facilityId/beds/:id/release` | Release bed |

### Staff (`/staff`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/staff` | Create staff profile |
| GET | `/staff` | List staff with pagination |
| GET | `/staff/search` | Search staff by criteria |
| GET | `/staff/:id` | Get staff by ID |
| PUT | `/staff/:id` | Update staff |
| DELETE | `/staff/:id` | Archive staff |

### RBAC (`/rbac`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rbac/roles` | Create role |
| GET | `/rbac/roles` | List roles |
| GET | `/rbac/roles/:id` | Get role by ID |
| PUT | `/rbac/roles/:id` | Update role |
| DELETE | `/rbac/roles/:id` | Delete role |
| POST | `/rbac/users/:userId/roles/:roleId` | Assign role to user |
| DELETE | `/rbac/users/:userId/roles/:roleId` | Remove role from user |
| GET | `/rbac/users/:userId/roles` | Get user roles |
| GET | `/rbac/permissions` | List all permissions |

### Configuration (`/configs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/configs/resolve` | Resolve config for context |
| GET | `/configs/effective` | Get effective configs |
| GET | `/configs/schema` | Get config schema |
| GET | `/configs/instance` | Get instance configs |
| GET | `/configs/instance/:key` | Get instance config by key |
| PUT | `/configs/instance/:key` | Set instance config |
| GET | `/configs/tenant/:tenantId` | Get tenant configs |
| PUT | `/configs/tenant/:tenantId/:key` | Set tenant config |
| DELETE | `/configs/tenant/:tenantId/:key` | Delete tenant config |
| GET | `/configs/facility/:facilityId` | Get facility configs |
| PUT | `/configs/facility/:facilityId/:key` | Set facility config |
| DELETE | `/configs/facility/:facilityId/:key` | Delete facility config |

### Health (`/health`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Server
PORT=3010
NODE_ENV=development

# Database
FOUNDATION_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d
JWT_RESET_SECRET=your-reset-secret-here

# MFA (optional)
MFA_ISSUER=Zeal Healthcare
```

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- Foundation database created and migrated

### Running the Service

```bash
# From backend directory
npm run dev --workspace=@zeal/foundation

# Or with debug logging
npm run dev:debug --workspace=@zeal/foundation
```

### Building for Production

```bash
npm run build --workspace=@zeal/foundation
npm run start --workspace=@zeal/foundation
```

### API Documentation

When the service is running, Swagger documentation is available at:

```
http://localhost:3010/docs
```

## Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Argon2 password hashing
- Secure token rotation on refresh
- Account lockout after failed attempts

### Multi-Factor Authentication
- TOTP (Time-based One-Time Password) support
- SMS verification (configurable)
- Email verification (configurable)
- Backup codes

### Authorization
- Role-based access control (RBAC)
- Permission-based fine-grained control
- Facility-scoped permissions
- Tenant isolation

## Request Headers

All authenticated requests require:

| Header | Description |
|--------|-------------|
| `Authorization` | Bearer token (JWT) |
| `x-tenant-id` | Current tenant ID |
| `x-facility-id` | Current facility ID (optional for some endpoints) |

## Dependencies

### Internal Packages
- `@zeal/database-foundation` - Prisma client for Foundation DB
- `@zeal/database-clinical` - Prisma client for Clinical DB (for cross-service queries)
- `@zeal/contracts` - Shared DTOs and Zod schemas
- `@zeal/shared-utils` - Shared utilities

### Key External Dependencies
- `@nestjs/jwt` - JWT handling
- `argon2` - Password hashing
- `class-validator` - DTO validation
- `pino` - Logging

## Related Documentation

- [Architecture Overview](../../../docs/architecture/BACKEND-ARCHITECTURE.md)
- [Multi-Tenancy Guide](../../../docs/multitenancy/README.md)
- [RBAC Implementation](../../../docs/security/20-RBAC-Access-Control.md)
- [ADR-0003: Multi-tenancy](../../../docs/adr/ADR-0003-multitenancy.md)
- [ADR-0005: RBAC](../../../docs/adr/ADR-0005-rbac-access-control.md)
