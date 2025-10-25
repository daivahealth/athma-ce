# Frontend Current State Analysis

**Date**: 2025-10-25
**Status**: Analysis Complete

## Current Frontend Architecture

### ✅ What Exists and Works Well

#### 1. **Tech Stack** - Matches Recommendations Perfectly
- ✅ Next.js 14 with App Router
- ✅ React 18
- ✅ TypeScript
- ✅ TanStack Query (@tanstack/react-query)
- ✅ Zustand for state management
- ✅ Axios for HTTP client
- ✅ shadcn/ui components (Radix UI primitives)
- ✅ Tailwind CSS
- ✅ React Hook Form + Zod validation
- ✅ next-themes for dark/light mode
- ✅ next-intl for internationalization

#### 2. **Authentication** - Fully Implemented
- ✅ Login page with form validation (`/app/[locale]/(auth)/login`)
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ MFA support
- ✅ Password reset flow
- ✅ Session management
- ✅ Logout functionality

**Files:**
- `/src/lib/api/client.ts` - Auth client with interceptors
- `/src/lib/auth/tokens.ts` - Token decode and validation
- `/src/app/[locale]/(auth)/login/page.tsx` - Login UI

#### 3. **Layout Components** - Fully Implemented
- ✅ Sidebar with collapsible functionality (`/components/layout/sidebar.tsx`)
- ✅ Topbar with search, notifications, theme toggle (`/components/layout/topbar.tsx`)
- ✅ Theme toggle (dark/light mode) (`/components/layout/theme-toggle.tsx`)
- ✅ Facility switcher (`/components/layout/facility-switcher.tsx`)
- ✅ Breadcrumb navigation (`/components/layout/breadcrumb.tsx`)
- ✅ Mobile responsive sidebar

#### 4. **UI Components** - shadcn/ui Implemented
- ✅ Button, Input, Label, Card
- ✅ Dialog, Dropdown Menu, Separator
- ✅ Badge, Alert, Toaster
- ✅ Switch, Skeleton, Loading
- ✅ Textarea

**Location:** `/src/components/ui/`

#### 5. **Existing Pages** (Foundation Domain)
- ✅ Dashboard (`/dashboard`)
- ✅ Tenants (`/tenants`)
- ✅ Users (`/users`)
- ✅ Facilities (`/facilities`)
- ✅ Staff (`/staff`)
- ✅ Spaces (`/spaces`)
- ✅ RBAC (Roles & Permissions) (`/rbac/roles`, `/rbac/permissions`)
- ✅ Profile (`/profile`)

**Location:** `/src/app/[locale]/(dashboard)/`

#### 6. **Internationalization (i18n)**
- ✅ next-intl configured
- ✅ `[locale]` route parameter for English/Arabic
- ✅ Translation messages structure
- ✅ RTL support for Arabic

**Location:** `/src/lib/i18n/`

#### 7. **Providers**
- ✅ Theme Provider (`/src/providers/theme-provider.tsx`)
- ✅ Query Provider (`/src/providers/query-provider.tsx`)

## 🔍 Gap Analysis - What's Missing

### 1. **Domain Module Structure**
**Current:** Flat component structure in `/components/`

**Recommended:** Domain-based modules
```
❌ Missing: /src/modules/
  ├── clinical/      (Patient, Appointment, Encounter)
  ├── rcm/           (Billing, Claims, Payment)
  └── foundation/    (Users, Facilities - move existing)
```

**Impact:** Low - Current structure works but less organized for large scale

### 2. **Clinical API Client**
**Current:** Only `foundationClient` exists (port 3010) ✅ Correct

**Missing:**
```typescript
❌ clinicalClient  → http://localhost:3011/api/v1
❌ rcmClient       → http://localhost:3012/api/v1
```

**Impact:** High - Cannot make API calls to Clinical service for patients

### 3. **Multi-Tenancy Headers**
**Current:** Only `x-tenant-id` injected from JWT

**Missing:**
```typescript
❌ x-user-id header (required by backend)
❌ x-facility-id header (required by backend)
```

**Impact:** High - Backend will reject requests without these headers

### 4. **Clinical Domain Routes**
**Current:** Only Foundation domain pages exist

**Missing:**
```
❌ /src/app/[locale]/(clinical)/
  ├── patients/
  │   ├── page.tsx              (List patients)
  │   ├── new/page.tsx          (Create patient)
  │   └── [id]/page.tsx         (View/Edit patient)
  ├── appointments/
  └── encounters/
```

**Impact:** High - No patient management UI

### 5. **Patient Module**
**Missing:**
```
❌ /src/modules/clinical/
  ├── components/
  │   ├── PatientForm/
  │   ├── PatientCard/
  │   └── PatientSearch/
  ├── services/
  │   └── patient-service.ts    (API calls)
  ├── types/
  │   └── patient.ts            (TypeScript types)
  └── hooks/
      └── use-patients.ts       (React Query hooks)
```

**Impact:** High - Need these for patient management

### 6. **Sidebar Navigation**
**Current:** Only Foundation items (dashboard, tenants, users, etc.)

**Missing:**
```typescript
❌ { href: '/patients', icon: Users, labelKey: 'nav.patients' }
❌ { href: '/appointments', icon: Calendar, labelKey: 'nav.appointments' }
❌ { href: '/encounters', icon: FileText, labelKey: 'nav.encounters' }
```

**Impact:** Medium - Users can't navigate to patient features

## 📋 Current File Structure

```
frontend/src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/                    ✅ Auth pages exist
│   │   │   ├── login/
│   │   │   ├── reset-password/
│   │   │   └── confirm-reset/
│   │   └── (dashboard)/               ✅ Foundation pages exist
│   │       ├── dashboard/
│   │       ├── tenants/
│   │       ├── users/
│   │       ├── facilities/
│   │       ├── staff/
│   │       ├── spaces/
│   │       ├── rbac/
│   │       └── profile/
│   ├── layout.tsx                     ✅ Root layout
│   └── api/auth/session/route.ts      ✅ API route
│
├── components/
│   ├── ui/                            ✅ shadcn/ui components
│   ├── layout/                        ✅ Sidebar, Topbar, Theme Toggle
│   ├── forms/                         ✅ Form components
│   ├── tables/                        ✅ Table components
│   └── charts/                        ✅ Chart components
│
├── lib/
│   ├── api/
│   │   ├── client.ts                  ⚠️  Needs Clinical API
│   │   └── enhanced-client.ts
│   ├── auth/                          ✅ Token management
│   ├── contexts/                      ✅ React contexts
│   ├── stores/                        ✅ Zustand stores
│   ├── utils/                         ✅ Utilities
│   └── i18n/                          ✅ Translations
│
├── providers/                         ✅ Theme, Query providers
├── hooks/                             ✅ Custom hooks
├── types/                             ✅ TypeScript types
└── styles/                            ✅ Global styles
```

## ⚠️ Issues to Fix

### 1. **API Client - Already Correct**
**File:** `/src/lib/api/client.ts`

**Current:**
```typescript
const FOUNDATION_BASE_URL = 'http://localhost:3010'  // ✅ Correct
```

**Backend Services:**
- Foundation: `http://localhost:3010` ✅
- Clinical: `http://localhost:3011` (need to add)
- RCM: `http://localhost:3012` (need to add)

### 2. **Missing Required Headers**
**File:** `/src/lib/api/client.ts` (line 55-58)

**Current:**
```typescript
foundationClient.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${session.accessToken}`;
  if (claims?.tenantId) {
    config.headers['x-tenant-id'] = claims.tenantId;
  }
  return config;
});
```

**Missing:**
```typescript
// Backend requires ALL three headers:
config.headers['x-tenant-id'] = claims.tenantId;
config.headers['x-user-id'] = claims.userId;      // ❌ Missing
config.headers['x-facility-id'] = claims.facilityId;  // ❌ Missing
```

**Impact:** Backend will return 400 Bad Request errors

### 3. **No BaseApiService Class**
**Missing:** Generic base class for API services

**Need to create:** `/src/lib/api/base-service.ts`

This will provide CRUD operations (findAll, findOne, create, update, delete) that all domain services can extend.

## 🎯 Recommended Actions

### Priority 1: Fix Existing Issues (High Priority)

1. **Enhance API Client** ⚠️ Critical
   - Foundation port is correct (3010) ✅
   - Add `x-user-id` and `x-facility-id` headers to interceptors
   - Extract userId and facilityId from JWT claims

2. **Add Clinical API Client** ⚠️ Critical
   - Create `clinicalClient` for http://localhost:3011
   - Add same interceptors (auth + tenant headers)
   - Export for use in patient service

### Priority 2: Create Patient Module (High Priority)

3. **Create Module Structure**
   ```
   /src/modules/clinical/
     ├── services/patient-service.ts
     ├── types/patient.ts
     ├── components/PatientForm.tsx
     ├── components/PatientCard.tsx
     └── hooks/use-patients.ts
   ```

4. **Create Patient Routes**
   ```
   /src/app/[locale]/(clinical)/
     └── patients/
         ├── page.tsx           (List + Search)
         ├── new/page.tsx       (Create)
         └── [id]/page.tsx      (View/Edit)
   ```

5. **Update Sidebar**
   - Add "Patients" navigation item
   - Add Clinical domain section separator

### Priority 3: Optional Enhancements (Low Priority)

6. **Refactor Foundation Pages**
   - Move Foundation components to `/modules/foundation/`
   - Keep current routes working

7. **Add RCM Module** (Future)
   - Create `rcmClient`
   - Add billing/claims routes

## ✅ Summary

### What's Working
- ✅ All recommended technologies in place
- ✅ Authentication fully implemented
- ✅ Layout (sidebar, topbar, theme toggle) complete
- ✅ Foundation domain pages working
- ✅ Dark/light mode working
- ✅ i18n (English/Arabic) working

### What's Needed
- ⚠️ Fix API client ports and headers
- ⚠️ Add Clinical API client
- ⚠️ Create patient module
- ⚠️ Create patient routes
- ⚠️ Update sidebar navigation

### Complexity Assessment
- **Difficulty:** Low to Medium
- **Effort:** 2-3 days
- **Risk:** Low (building on solid foundation)

### Next Steps
1. Fix API client issues (30 mins)
2. Create patient service and types (1 hour)
3. Create patient list page (2 hours)
4. Create patient form page (2 hours)
5. Add sidebar navigation (15 mins)
6. Test full flow (1 hour)

**Total Estimated Time:** 6-8 hours of focused development

---

**Status:** ✅ Analysis Complete - Ready for Implementation
**Recommended Approach:** Enhance existing architecture rather than full rewrite
