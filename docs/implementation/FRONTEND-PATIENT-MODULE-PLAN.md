# Frontend Patient Module Implementation Plan

**Date**: 2025-10-25
**Goal**: Add patient management (list, search, create) to existing frontend
**Estimated Time**: 6-8 hours

## Current State

✅ **What's Already Working:**
- Login/logout functionality
- Dark/light mode theme toggle
- Sidebar and topbar layout
- Foundation domain pages (users, facilities, tenants, etc.)
- shadcn/ui components
- i18n (English/Arabic)

⚠️ **What Needs Fixing:**
- API client port (3010 → 3001)
- Missing headers (x-user-id, x-facility-id)
- No Clinical API client
- No patient pages

## Implementation Steps

### Step 1: Fix API Client (30 mins) ⚠️ CRITICAL

**File:** `/src/lib/api/client.ts`

**Changes:**
1. Foundation port already correct: `3010` ✅
2. Add Clinical API client for port `3011`
3. Add RCM API client for port `3012`
4. Add missing headers to interceptors:
   ```typescript
   config.headers['x-tenant-id'] = claims.tenantId;
   config.headers['x-user-id'] = claims.userId;          // NEW
   config.headers['x-facility-id'] = claims.facilityId;  // NEW
   ```

### Step 2: Create Base API Service (30 mins)

**File:** `/src/lib/api/base-service.ts` (NEW)

**Purpose:** Generic CRUD operations for all services

```typescript
export class BaseApiService<T> {
  constructor(protected client: AxiosInstance, protected basePath: string) {}

  async findAll(params?: any): Promise<PaginatedResponse<T>>
  async findOne(id: string): Promise<T>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
  async search(query: string, params?: any): Promise<PaginatedResponse<T>>
}
```

### Step 3: Create Patient Module Structure (1 hour)

**New folders:**
```
/src/modules/clinical/
  ├── services/
  │   └── patient-service.ts
  ├── types/
  │   └── patient.ts
  ├── components/
  │   ├── PatientForm.tsx
  │   ├── PatientCard.tsx
  │   └── PatientSearchBar.tsx
  └── hooks/
      └── use-patients.ts
```

**patient-service.ts:**
```typescript
class PatientService extends BaseApiService<Patient> {
  constructor() {
    super(clinicalClient, '/patients');
  }

  async registerPatient(data: CreatePatientDto): Promise<Patient>
  async searchPatients(query: string): Promise<PaginatedResponse<Patient>>
}

export const patientService = new PatientService();
```

**patient.ts:**
```typescript
export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email?: string;
  nationalId?: string;
  // ... other fields
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  // ... other fields
}
```

### Step 4: Create Patient Routes (2 hours)

**New route group:**
```
/src/app/[locale]/(clinical)/
  └── patients/
      ├── page.tsx              # List + Search
      ├── new/page.tsx          # Create form
      └── [id]/page.tsx         # View/Edit (future)
```

**patients/page.tsx - List & Search:**
```typescript
'use client';

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => patientService.search(search),
  });

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <DataTable data={data?.data} columns={patientColumns} />
    </div>
  );
}
```

**patients/new/page.tsx - Create Form:**
```typescript
'use client';

export default function NewPatientPage() {
  const createMutation = useMutation({
    mutationFn: patientService.create,
    onSuccess: () => router.push('/patients'),
  });

  return (
    <PatientForm onSubmit={createMutation.mutate} />
  );
}
```

### Step 5: Create Patient Components (2 hours)

**PatientForm.tsx:**
- React Hook Form + Zod validation
- Fields: firstName, lastName, dateOfBirth, gender, contact, email, nationalId
- Submit handler
- Error handling

**PatientSearchBar.tsx:**
- Search input with debounce
- Search by name, MRN, contact number

**PatientCard.tsx:**
- Display patient info in card format
- Click to navigate to details

### Step 6: Update Sidebar Navigation (15 mins)

**File:** `/src/components/layout/sidebar.tsx`

**Add to navItems:**
```typescript
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/patients', icon: Users, labelKey: 'nav.patients' },  // NEW
  // ... existing items
];
```

### Step 7: Add i18n Translations (15 mins)

**File:** `/src/lib/i18n/messages/en.json`

```json
{
  "nav": {
    "patients": "Patients",
    "appointments": "Appointments"
  },
  "patients": {
    "title": "Patient Management",
    "new": "New Patient",
    "search": "Search patients...",
    "list": "Patient List"
  }
}
```

### Step 8: Testing (1 hour)

1. **Test Login/Logout**
   - Login with valid credentials
   - Verify JWT token stored
   - Logout and verify redirect

2. **Test Theme Toggle**
   - Switch dark/light mode
   - Verify persistence

3. **Test Sidebar/Topbar**
   - Sidebar collapse/expand
   - Navigation works
   - Topbar displays user info

4. **Test Patient List**
   - Navigate to /patients
   - Verify API call with headers
   - Display patient list

5. **Test Patient Search**
   - Search by name
   - Verify debounce
   - Display filtered results

6. **Test Patient Creation**
   - Fill form
   - Submit
   - Verify API call
   - Redirect to list

## File Changes Summary

### Modified Files (3)
1. `/src/lib/api/client.ts` - Fix ports, add headers, add Clinical client
2. `/src/components/layout/sidebar.tsx` - Add patients nav item
3. `/src/lib/i18n/messages/en.json` - Add patient translations

### New Files (10)
1. `/src/lib/api/base-service.ts` - Base API service class
2. `/src/modules/clinical/services/patient-service.ts` - Patient API service
3. `/src/modules/clinical/types/patient.ts` - Patient TypeScript types
4. `/src/modules/clinical/hooks/use-patients.ts` - React Query hooks
5. `/src/modules/clinical/components/PatientForm.tsx` - Patient form component
6. `/src/modules/clinical/components/PatientSearchBar.tsx` - Search component
7. `/src/modules/clinical/components/PatientCard.tsx` - Patient card component
8. `/src/app/[locale]/(clinical)/layout.tsx` - Clinical layout
9. `/src/app/[locale]/(clinical)/patients/page.tsx` - Patient list page
10. `/src/app/[locale]/(clinical)/patients/new/page.tsx` - New patient page

## Risk Mitigation

### Potential Issues

1. **Backend Services Running**
   - Mitigation: Verify backend services running on correct ports
   - Test Foundation: `curl http://localhost:3010/api/v1/auth/login`
   - Test Clinical: `curl http://localhost:3011/api/v1/patients` (with headers)

2. **Missing Headers**
   - Mitigation: Add all three required headers (tenant, user, facility)
   - Test: Check network tab for request headers

3. **JWT Claims Missing**
   - Mitigation: Verify JWT token contains userId, tenantId, facilityId
   - Test: Decode token and log claims

4. **CORS Issues**
   - Mitigation: Ensure backend CORS allows frontend origin
   - Test: Check console for CORS errors

## Success Criteria

✅ User can login and see dashboard
✅ User can toggle dark/light theme
✅ User can navigate using sidebar
✅ User can see list of patients
✅ User can search patients by name
✅ User can create a new patient
✅ All API calls include proper headers
✅ No console errors
✅ Responsive on mobile

## Next Phase (Future)

- Patient details page
- Patient edit functionality
- Patient documents upload
- Patient history view
- Appointment scheduling
- RCM module (billing/claims)

---

**Status:** Ready to Implement
**Start with:** Step 1 (Fix API Client)
