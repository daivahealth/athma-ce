# Frontend Documentation

This folder contains documentation specific to the Zeal frontend application.

## Overview

The Zeal frontend is a Next.js 14 application built with TypeScript, providing the user interface for the healthcare platform. It follows a domain-driven module structure aligned with the backend services.

## Contents

- [Architecture](./ARCHITECTURE.md) - Frontend architecture and design patterns
- [API Clients](./API-CLIENTS.md) - API client documentation and usage
- [Modules](./MODULES.md) - Domain module structure and patterns
- [Components](./COMPONENTS.md) - Shared component library

## Quick Links

- [Main Frontend README](../../frontend/README.md) - Getting started and development
- [Feature Documentation](../features/) - Feature-specific documentation
- [API Documentation](../api/) - Backend API documentation

## Architecture Overview

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── [locale]/
│   │   ├── (auth)/         # Public routes (login, reset)
│   │   ├── (clinical)/     # Clinical domain routes
│   │   └── (dashboard)/    # Foundation/admin routes
│   └── api/                # API routes
├── components/             # Shared UI components
│   ├── layout/             # Sidebar, topbar, breadcrumb
│   ├── tables/             # Data tables
│   ├── forms/              # Form components
│   ├── clinical/           # Clinical-specific components
│   └── ui/                 # shadcn/ui primitives
├── modules/                # Domain modules
│   ├── clinical/           # Clinical domain
│   ├── foundation/         # Foundation domain
│   ├── rcm/                # RCM domain
│   └── prm/                # PRM domain
├── lib/                    # Core utilities
│   ├── api/                # API clients
│   ├── auth/               # Auth utilities
│   ├── stores/             # Zustand stores
│   └── utils/              # Helper functions
├── hooks/                  # Shared React hooks
└── providers/              # React providers
```

## Domain Modules

Each domain module follows a consistent structure:

```
modules/<domain>/
├── components/             # Domain-specific UI components
├── hooks/                  # React Query hooks
├── services/               # API service classes
└── types/                  # TypeScript types
```

### Available Modules

| Module | Description | Backend Service |
|--------|-------------|-----------------|
| `clinical` | Patient management, encounters, scheduling, charting | Clinical Service (3011) |
| `foundation` | Users, facilities, staff, configuration | Foundation Service (3010) |
| `rcm` | Billing, invoices, insurance, coding | RCM Service (3012) |
| `prm` | Patient relationship management | PRM Service (3013) |

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand (global) + React Query (server)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **Documentation**: Storybook 8

## Related Documentation

- [Backend Architecture](../architecture/BACKEND-ARCHITECTURE.md)
- [Frontend Architecture Decision](../architecture/FRONTEND-ARCHITECTURE-DECISION.md)
- [Multi-tenancy](../multitenancy/README.md)
