# Frontend Architecture Summary

**Date**: 2025-10-25
**Status**: ✅ Recommended Architecture Defined

## Decision

**Build a single monolithic Next.js application with domain-based module structure**

## Why This Approach?

### ✅ Recommended: Single App with Modules

```
athma-ce Frontend (Single Next.js App)
├── /modules/clinical    → Patient, Appointment, Encounter features
├── /modules/rcm         → Billing, Claims, Payment features
├── /modules/foundation  → Users, Facilities, Settings
└── /shared              → Common components, auth, API client
```

### Key Benefits

1. **Unified User Experience**
   - Healthcare workflows span multiple domains (Patient → Appointment → Bill)
   - Seamless navigation between Clinical and RCM features
   - Consistent design system across all modules

2. **Simplified Multi-Tenancy**
   - Single authentication context
   - Centralized tenant management
   - One API client with automatic header injection (x-tenant-id, x-user-id, x-facility-id)
   - Consistent tenant switching UI

3. **Development Efficiency**
   - Faster development with shared components
   - Single codebase for small team
   - Easier onboarding for new developers
   - Single deployment pipeline

4. **Code Reuse**
   - Shared UI components (tables, forms, modals)
   - Common utilities (date formatting, validation)
   - Single API client configuration
   - Shared state management

5. **Future Flexibility**
   - Can evolve to micro-frontends later if needed
   - Clear module boundaries support future extraction
   - No rewrite required for evolution

### ❌ Why Not Micro-Frontends?

- Too complex for current team size
- Healthcare workflows are interconnected (not truly independent)
- Overhead of managing multiple apps, shared state, and deployments
- Can always split later if needed

## Technology Stack

| Category | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 14+ (App Router) | Server components, routing, API routes |
| Language | TypeScript | Type safety, better developer experience |
| Styling | Tailwind CSS + shadcn/ui | Fast development, consistent design |
| State | Zustand | Lightweight, simple, better than Redux for this scale |
| Forms | React Hook Form + Zod | Performance, validation, type safety |
| API Client | Axios | Interceptors for auth/tenant headers |
| Data Fetching | TanStack Query | Caching, background updates, optimistic updates |

## Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (clinical)/             # Clinical routes
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   └── encounters/
│   │   ├── (rcm)/                  # RCM routes
│   │   │   ├── billing/
│   │   │   ├── claims/
│   │   │   └── payments/
│   │   └── (foundation)/           # Foundation routes
│   │       ├── users/
│   │       ├── facilities/
│   │       └── settings/
│   │
│   ├── modules/                    # Domain modules
│   │   ├── clinical/
│   │   │   ├── components/        # Clinical-specific components
│   │   │   ├── services/          # Clinical API calls
│   │   │   ├── hooks/             # Clinical hooks
│   │   │   └── types/             # Clinical types
│   │   ├── rcm/
│   │   └── foundation/
│   │
│   └── shared/                     # Shared across domains
│       ├── components/            # Reusable UI components
│       ├── lib/
│       │   ├── api/               # API client
│       │   ├── auth/              # Authentication
│       │   └── tenant/            # Multi-tenancy
│       ├── hooks/                 # Shared hooks
│       └── types/                 # Shared types
```

## Multi-Tenancy Implementation

### API Client with Auto Headers

```typescript
// Automatically adds to every request:
headers: {
  'x-tenant-id': '<tenant-uuid>',
  'x-user-id': '<user-uuid>',
  'x-facility-id': '<facility-uuid>',
  'Authorization': 'Bearer <jwt-token>'
}
```

### Tenant Context

```typescript
// Available throughout the app
const { tenantId, facilityId, setTenant } = useTenant();
```

### Service-Specific API Clients

```typescript
clinicalApi   → http://localhost:3011/api/v1
rcmApi        → http://localhost:3012/api/v1
foundationApi → http://localhost:3010/api/v1
```

## Example: Patient Management

### API Service

```typescript
// src/modules/clinical/services/patient-service.ts
class PatientService extends BaseApiService<Patient> {
  async registerPatient(data: CreatePatientDto): Promise<Patient> {
    return this.create(data); // Automatically includes tenant headers
  }

  async searchPatients(query: string): Promise<PaginatedResponse<Patient>> {
    return this.search(query);
  }
}
```

### Patient List Page

```typescript
// src/app/(clinical)/patients/page.tsx
export default function PatientsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.findAll(),
  });

  return <DataTable data={data?.data} columns={patientColumns} />;
}
```

### Create Patient Page

```typescript
// src/app/(clinical)/patients/new/page.tsx
export default function NewPatientPage() {
  const createMutation = useMutation({
    mutationFn: patientService.registerPatient,
    onSuccess: () => router.push('/patients'),
  });

  return <PatientForm onSubmit={createMutation.mutate} />;
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2) ✅ NEXT
- Setup Next.js project with App Router
- Configure Tailwind CSS + shadcn/ui
- Implement authentication (login, JWT, protected routes)
- Implement multi-tenancy (context, API interceptors)
- Build shared components (Button, Input, Table, Modal)

### Phase 2: Clinical Module (Week 3-4)
- Patient management (list, create, edit, view)
- Patient search and filtering
- Appointment scheduling

### Phase 3: RCM Module (Week 5-6)
- Invoice management
- Payment processing
- Claims tracking

### Phase 4: Foundation Module (Week 7-8)
- User management
- Facility management
- Settings and RBAC UI

### Phase 5: Polish & Deploy (Week 9-10)
- Testing, optimization, deployment

## Key Advantages

| Advantage | Impact |
|-----------|--------|
| **Unified UX** | Clinicians navigate seamlessly from Patient → Appointment → Bill |
| **Shared Auth** | Login once, access all modules with consistent tenant context |
| **Code Reuse** | Form components, tables, utilities used across all domains |
| **Fast Development** | Shared components accelerate feature development |
| **Easy Deployment** | Single build, single deployment, simpler CI/CD |
| **Maintainability** | One codebase, consistent patterns, easier to update |

## Evolution Path

If you need to split later:

```
Step 1: Current (Monolith with modules)
  ↓
Step 2: Extract shared components to npm package
  ↓
Step 3: Implement module federation
  ↓
Step 4: Split into separate deployable apps
```

The current architecture supports this without requiring a rewrite.

## Documentation Created

1. **[FRONTEND-ARCHITECTURE-RECOMMENDATION.md](../../architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md)** (~800 lines)
   - Complete architecture guide
   - Full code examples
   - Project structure details
   - Multi-tenancy implementation
   - Authentication flow
   - Patient module example

2. **[FRONTEND-ARCHITECTURE-DECISION.md](../../architecture/FRONTEND-ARCHITECTURE-DECISION.md)** (~300 lines)
   - Decision rationale
   - Options considered
   - Technology choices
   - Implementation plan
   - Success metrics
   - Risk mitigation

## Next Steps

1. **Review** the detailed architecture documents
2. **Initialize** Next.js project following the recommended structure
3. **Start** with Phase 1 (Foundation setup)
4. **Build** Patient module as first feature
5. **Iterate** based on feedback

---

**Status**: ✅ Architecture Defined - Ready to Begin Implementation

**Key Documents**:
- [Complete Architecture Guide](../../architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
- [Architecture Decision](../../architecture/FRONTEND-ARCHITECTURE-DECISION.md)
- [Backend Developer Guidelines](../../development/BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)
