# Zeal Frontend

Elegant multi-tenant PMS/EHR/ECM interface for Zeal Healthcare, built with Next.js 14, TypeScript, shadcn/ui, and Tailwind CSS. The UI aligns with architecture decisions (ADR-0001, ADR-0003, ADR-0005) and is ready for PDPL/GDPR compliance.

## Stack
- Next.js 14 (App Router) with TypeScript
- Tailwind CSS + shadcn/ui for light/dark design system
- React Query for data fetching
- next-intl + react-i18next scaffolding (English + Arabic placeholder)
- Axios API client with JWT + refresh handling
- Vitest + Testing Library for unit tests
- Storybook 8 for component docs
- Husky + lint-staged + Prettier for workflow

## Getting Started
```bash
cd frontend
npm install
npm run dev
```

Environment variables (create `.env.local`):
```
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:3001
NEXT_PUBLIC_FOUNDATION_BASE_URL=http://localhost:3010
```

### Scripts
- `npm run dev` – start Next dev server
- `npm run build` – build for production
- `npm run lint` / `npm run lint:fix`
- `npm run test` / `npm run test:watch`
- `npm run storybook` / `npm run storybook:build`
- `npm run mock` – seed demo data via backend APIs

## Structure
```
src/
  app/
    [locale]/(auth)        # public routes (login, reset)
    [locale]/(dashboard)   # protected routes + layout
  components/
    layout/                # sidebar, topbar, breadcrumb
    tables/                # table utilities and widgets
    charts/                # scheduling visualisations
    ui/                    # shadcn primitives
  hooks/                   # React Query + auth helpers
  lib/
    api/                   # axios clients, session helpers
    auth/                  # token utilities
    i18n/                  # localization resources
    utils/                 # formatters, class helpers
  providers/               # theme + query providers
  styles/                  # global Tailwind styles
  test/                    # Vitest setup
```

## Security & Compliance
- JWT secrets must be defined via backend (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_RESET_SECRET`)
- Automatic PHI masking in tables (`data-tenant-mask` attribute)
- Audit & consent language surfaced in profile screen
- Dark/light mode accessible and WCAG AA compliant
- RTL ready; switching to Arabic sets `dir="rtl"`

## Storybook
```bash
npm run storybook
```
Stories consume the same Tailwind + Theme providers for parity with app UI.

## Testing
```bash
npm run test
```
Vitest runs in jsdom using Testing Library. Add specs alongside components as `*.test.tsx`.

## Mock Data Script
`scripts/mockData.ts` contains sample automation to call backend APIs (login, seed tenants/users). Update credentials and endpoints before running `npm run mock`.

