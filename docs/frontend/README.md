# Frontend Documentation

This folder contains documentation specific to the athma-ce frontend application.

## Overview

The athma-ce frontend is a Next.js 16 application built with TypeScript, providing the user interface for the healthcare platform. It follows a domain-driven module structure aligned with the backend services.

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
├── proxy.ts                # Locale routing (next-intl); `middleware.ts` in Next <16
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

## Route Parameters

Next.js 16 delivers route `params` as a **Promise**. How you read them depends on
the component type — do not accept `params` as a prop in a client component.

**Client components** (the overwhelming majority here) use the `useParams()` hook:

```tsx
'use client';
import { useParams } from 'next/navigation';

export default function PatientsPage() {
  const params = useParams() as { locale: string };
  // ...
}
```

**Server components** accept the Promise and await it:

```tsx
export default async function LocaleLayout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale = 'en' } = await params;
  // ...
}
```

`React.use(params)` is not an option while the app is on React 18 — `use()` ships
with React 19. The same rule applies to `cookies()` and `headers()` from
`next/headers`, which must now be awaited:

```ts
const cookieStore = await cookies();
```

Accessing `params.locale` synchronously still renders, but logs a
`sync-dynamic-apis` error and is removed in a future major.

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

- **Framework**: Next.js 16 (App Router, Turbopack)
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
