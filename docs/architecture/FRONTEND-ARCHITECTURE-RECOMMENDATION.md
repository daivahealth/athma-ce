# Frontend Architecture Recommendation

**Project**: athma-ce Healthcare Platform
**Date**: 2025-10-25
**Status**: Proposed Architecture

## Executive Summary

**Recommendation**: Single monolithic Next.js application with domain-based module structure

**Rationale**:
- Cohesive user experience for healthcare workflows
- Simplified authentication and tenant context management
- Easier shared component reuse
- Lower initial complexity
- Can evolve to micro-frontends later if needed

## Architecture Decision

### ✅ Recommended: Monolithic Frontend with Domain Modules

```
┌─────────────────────────────────────────────────────────┐
│              Single Next.js Application                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Shell/Layout (Authentication, Navigation, Tenant) │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Clinical   │  │     RCM      │  │  Foundation  │ │
│  │   Module     │  │   Module     │  │    Module    │ │
│  │              │  │              │  │              │ │
│  │ - Patients   │  │ - Billing    │  │ - Users      │ │
│  │ - Appts      │  │ - Claims     │  │ - Facilities │ │
│  │ - Encounters │  │ - Payments   │  │ - Settings   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │    Shared Components & Utilities                   │ │
│  │  (Forms, Tables, API Client, Auth, Multi-tenancy) │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
           ↓           ↓              ↓
    ┌──────────┐ ┌──────────┐  ┌──────────┐
    │ Clinical │ │   RCM    │  │Foundation│
    │ Service  │ │ Service  │  │ Service  │
    │ :3011    │ │ :3012    │  │ :3001    │
    └──────────┘ └──────────┘  └──────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand or Redux Toolkit
- **Forms**: React Hook Form + Zod
- **API Client**: Axios with interceptors
- **Authentication**: JWT with refresh tokens
- **Data Fetching**: TanStack Query (React Query)

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home/Dashboard
│   │   ├── login/               # Auth pages
│   │   ├── (clinical)/          # Clinical domain routes
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx                    # List patients
│   │   │   │   ├── [id]/page.tsx              # Patient details
│   │   │   │   ├── [id]/edit/page.tsx         # Edit patient
│   │   │   │   └── new/page.tsx               # Create patient
│   │   │   ├── appointments/
│   │   │   ├── encounters/
│   │   │   └── layout.tsx       # Clinical layout
│   │   ├── (rcm)/               # RCM domain routes
│   │   │   ├── billing/
│   │   │   ├── claims/
│   │   │   ├── payments/
│   │   │   └── layout.tsx       # RCM layout
│   │   └── (foundation)/        # Foundation domain routes
│   │       ├── users/
│   │       ├── facilities/
│   │       ├── settings/
│   │       └── layout.tsx       # Foundation layout
│   │
│   ├── modules/                  # Domain modules
│   │   ├── clinical/
│   │   │   ├── components/      # Clinical-specific components
│   │   │   │   ├── PatientForm/
│   │   │   │   ├── PatientCard/
│   │   │   │   └── AppointmentCalendar/
│   │   │   ├── hooks/           # Clinical hooks
│   │   │   ├── services/        # Clinical API services
│   │   │   ├── types/           # Clinical TypeScript types
│   │   │   └── utils/           # Clinical utilities
│   │   ├── rcm/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── foundation/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── shared/                   # Shared across all domains
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Base UI (shadcn/ui)
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Table/
│   │   │   │   └── Dialog/
│   │   │   ├── layout/
│   │   │   │   ├── AppShell/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Header/
│   │   │   │   └── Breadcrumbs/
│   │   │   └── common/
│   │   │       ├── DataTable/
│   │   │       ├── SearchBar/
│   │   │       ├── Pagination/
│   │   │       └── StatusBadge/
│   │   ├── lib/                 # Core utilities
│   │   │   ├── api/             # API client
│   │   │   │   ├── client.ts           # Axios instance
│   │   │   │   ├── interceptors.ts     # Auth, tenant interceptors
│   │   │   │   └── base-service.ts     # Base API service class
│   │   │   ├── auth/            # Authentication
│   │   │   │   ├── auth-context.tsx
│   │   │   │   ├── auth-service.ts
│   │   │   │   ├── jwt.ts
│   │   │   │   └── protected-route.tsx
│   │   │   ├── tenant/          # Multi-tenancy
│   │   │   │   ├── tenant-context.tsx
│   │   │   │   ├── tenant-service.ts
│   │   │   │   ├── tenant-selector.tsx
│   │   │   │   └── use-tenant.ts
│   │   │   └── utils/
│   │   │       ├── date.ts
│   │   │       ├── format.ts
│   │   │       └── validation.ts
│   │   ├── hooks/               # Shared hooks
│   │   │   ├── use-api.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-tenant.ts
│   │   │   └── use-debounce.ts
│   │   ├── types/               # Shared TypeScript types
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── tenant.ts
│   │   │   └── common.ts
│   │   └── constants/
│   │       ├── api-endpoints.ts
│   │       └── app-config.ts
│   │
│   └── store/                    # Global state
│       ├── auth-store.ts
│       ├── tenant-store.ts
│       └── user-store.ts
│
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Multi-Tenancy Implementation

### 1. Tenant Context Provider

```typescript
// src/shared/lib/tenant/tenant-context.tsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/use-auth';

interface TenantContextType {
  tenantId: string | null;
  facilityId: string | null;
  setTenant: (tenantId: string, facilityId: string) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [facilityId, setFacilityId] = useState<string | null>(null);

  useEffect(() => {
    // Load tenant from localStorage or JWT token
    const storedTenantId = localStorage.getItem('tenantId');
    const storedFacilityId = localStorage.getItem('facilityId');

    if (user?.tenantId) {
      setTenantId(user.tenantId);
      setFacilityId(user.facilityId || storedFacilityId);
    } else if (storedTenantId) {
      setTenantId(storedTenantId);
      setFacilityId(storedFacilityId);
    }
  }, [user]);

  const setTenant = (newTenantId: string, newFacilityId: string) => {
    setTenantId(newTenantId);
    setFacilityId(newFacilityId);
    localStorage.setItem('tenantId', newTenantId);
    localStorage.setItem('facilityId', newFacilityId);
  };

  const clearTenant = () => {
    setTenantId(null);
    setFacilityId(null);
    localStorage.removeItem('tenantId');
    localStorage.removeItem('facilityId');
  };

  return (
    <TenantContext.Provider value={{ tenantId, facilityId, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
```

### 2. API Client with Tenant Headers

```typescript
// src/shared/lib/api/client.ts

import axios from 'axios';
import { getAuthToken } from '@/shared/lib/auth/jwt';

const API_BASE_URLS = {
  clinical: process.env.NEXT_PUBLIC_CLINICAL_API_URL || 'http://localhost:3011',
  rcm: process.env.NEXT_PUBLIC_RCM_API_URL || 'http://localhost:3012',
  foundation: process.env.NEXT_PUBLIC_FOUNDATION_API_URL || 'http://localhost:3010',
};

export function createApiClient(service: 'clinical' | 'rcm' | 'foundation') {
  const client = axios.create({
    baseURL: `${API_BASE_URLS[service]}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth and tenant headers
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      const tenantId = localStorage.getItem('tenantId');
      const userId = localStorage.getItem('userId');
      const facilityId = localStorage.getItem('facilityId');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add required tenant context headers
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }
      if (userId) {
        config.headers['x-user-id'] = userId;
      }
      if (facilityId) {
        config.headers['x-facility-id'] = facilityId;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 - Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt token refresh
          const newToken = await refreshAuthToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle 400 - Tenant context errors
      if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        if (message?.includes('Tenant ID') || message?.includes('User ID')) {
          // Tenant context missing - redirect to tenant selection
          window.location.href = '/select-tenant';
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

// Create service-specific clients
export const clinicalApi = createApiClient('clinical');
export const rcmApi = createApiClient('rcm');
export const foundationApi = createApiClient('foundation');
```

### 3. Base API Service Class

```typescript
// src/shared/lib/api/base-service.ts

import { AxiosInstance } from 'axios';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BaseApiService<T> {
  constructor(
    protected client: AxiosInstance,
    protected basePath: string
  ) {}

  async findAll(params?: PaginationParams & Record<string, any>): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(this.basePath, { params });
    return response.data;
  }

  async findOne(id: string): Promise<T> {
    const response = await this.client.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await this.client.post(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }

  async search(query: string, params?: Record<string, any>): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(this.basePath, {
      params: { search: query, ...params },
    });
    return response.data;
  }
}
```

### 4. Domain-Specific Service Example

```typescript
// src/modules/clinical/services/patient-service.ts

import { clinicalApi } from '@/shared/lib/api/client';
import { BaseApiService } from '@/shared/lib/api/base-service';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../types/patient';

class PatientService extends BaseApiService<Patient> {
  constructor() {
    super(clinicalApi, '/patients');
  }

  // Custom methods beyond CRUD
  async getPatientHistory(patientId: string) {
    const response = await this.client.get(`${this.basePath}/${patientId}/history`);
    return response.data;
  }

  async getPatientAppointments(patientId: string) {
    const response = await this.client.get(`${this.basePath}/${patientId}/appointments`);
    return response.data;
  }

  async registerPatient(data: CreatePatientDto): Promise<Patient> {
    return this.create(data);
  }

  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    return this.update(id, data);
  }
}

export const patientService = new PatientService();
```

## Authentication Flow

```typescript
// src/shared/lib/auth/auth-service.ts

import { foundationApi } from '@/shared/lib/api/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  facilityId: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await foundationApi.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data;

    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Store user context
    localStorage.setItem('userId', user.id);
    localStorage.setItem('tenantId', user.tenantId);
    localStorage.setItem('facilityId', user.facilityId);

    return { user, tokens: { accessToken, refreshToken } };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('facilityId');
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await foundationApi.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  }

  async getCurrentUser(): Promise<User> {
    const response = await foundationApi.get('/auth/me');
    return response.data;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
```

## Patient Module Example

### Patient List Page

```typescript
// src/app/(clinical)/patients/page.tsx

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/modules/clinical/services/patient-service';
import { DataTable } from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/Button';
import { SearchBar } from '@/shared/components/common/SearchBar';
import { useRouter } from 'next/navigation';

export default function PatientsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', page, search],
    queryFn: () => patientService.findAll({ page, limit: 20, search }),
  });

  const columns = [
    { key: 'mrn', label: 'MRN' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button onClick={() => router.push('/patients/new')}>
          Add New Patient
        </Button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search patients by name, MRN..."
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onRowClick={(patient) => router.push(`/patients/${patient.id}`)}
      />
    </div>
  );
}
```

### Patient Form Component

```typescript
// src/modules/clinical/components/PatientForm/PatientForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.string().optional(),
  contactNumber: z.string().min(10, 'Valid contact number required'),
  email: z.string().email().optional(),
  nationalId: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PatientForm({ initialData, onSubmit, onCancel, isSubmitting }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="First Name *"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          label="Middle Name"
          {...register('middleName')}
        />
        <Input
          label="Last Name *"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date of Birth *"
          {...register('dateOfBirth')}
          error={errors.dateOfBirth?.message}
        />
        <Select
          label="Gender *"
          {...register('gender')}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          error={errors.gender?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact Number *"
          {...register('contactNumber')}
          error={errors.contactNumber?.message}
        />
        <Input
          type="email"
          label="Email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="National ID"
          {...register('nationalId')}
        />
        <Input
          label="Nationality"
          {...register('nationality')}
        />
      </div>

      <Input
        label="Address"
        {...register('address')}
        multiline
        rows={3}
      />

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Patient'}
        </Button>
      </div>
    </form>
  );
}
```

### Create Patient Page

```typescript
// src/app/(clinical)/patients/new/page.tsx

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PatientForm } from '@/modules/clinical/components/PatientForm';
import { patientService } from '@/modules/clinical/services/patient-service';

export default function NewPatientPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: patientService.registerPatient.bind(patientService),
    onSuccess: (patient) => {
      toast.success('Patient created successfully');
      router.push(`/patients/${patient.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create patient');
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register New Patient</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <PatientForm
          onSubmit={(data) => createMutation.mutateAsync(data)}
          onCancel={() => router.back()}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
```

## Root Layout with Providers

```typescript
// src/app/layout.tsx

import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```typescript
// src/app/providers.tsx

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/shared/lib/auth/auth-context';
import { TenantProvider } from '@/shared/lib/tenant/tenant-context';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          {children}
          <Toaster position="top-right" />
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

## Advantages of This Architecture

### 1. **Unified User Experience**
- Single navigation and layout
- Consistent design system
- Seamless workflow across Clinical → RCM
- Example: View patient → Create appointment → Generate invoice (all in one flow)

### 2. **Simplified Authentication & Multi-Tenancy**
- Single auth context shared across all modules
- Centralized tenant management
- One set of API interceptors
- Consistent header injection

### 3. **Code Reuse**
- Shared components (forms, tables, buttons)
- Common utilities (date formatting, validation)
- Single API client configuration
- Shared hooks and state management

### 4. **Development Efficiency**
- Single development server
- Faster hot reload
- Easier debugging
- Single deployment pipeline

### 5. **Lower Initial Complexity**
- No need for shell app or module federation
- Simpler state sharing
- Easier to onboard new developers
- Less infrastructure overhead

## When to Consider Micro-Frontends

Consider splitting into micro-frontends if:

- **Team Size**: Multiple large teams (5+ developers per domain)
- **Independent Releases**: Need to deploy Clinical and RCM separately
- **Technology Diversity**: Want to use different frameworks per domain
- **Performance**: Bundle size becomes problematic (>5MB)
- **Scalability**: Different scaling requirements per domain

## Migration Path to Micro-Frontends

If you need to evolve later:

```
Phase 1: Current (Monolith with modules)
  ↓
Phase 2: Extract shared components to npm package
  ↓
Phase 3: Implement module federation
  ↓
Phase 4: Split into separate deployable apps
```

The current architecture supports this evolution without requiring a rewrite.

## Environment Configuration

```env
# .env.local

# API URLs
NEXT_PUBLIC_CLINICAL_API_URL=http://localhost:3011
NEXT_PUBLIC_RCM_API_URL=http://localhost:3012
NEXT_PUBLIC_FOUNDATION_API_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_NAME=athma-ce Healthcare Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_CLINICAL_MODULE=true
NEXT_PUBLIC_ENABLE_RCM_MODULE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Next Steps

1. **Setup**: Initialize Next.js project with App Router
2. **Shared Layer**: Build shared components, API client, auth
3. **Clinical Module**: Implement patient management (starting point)
4. **RCM Module**: Add billing and claims features
5. **Foundation Module**: Add user and facility management
6. **Testing**: Unit tests, integration tests, E2E tests
7. **Deployment**: CI/CD pipeline, staging, production

---

**Recommendation**: Start with the monolithic approach outlined above. It provides the best balance of:
- Development speed
- Code reuse
- User experience
- Maintainability

You can always evolve to micro-frontends later if business requirements demand it, but the architectural patterns above will support that evolution.

**Status**: Ready for implementation
**Last Updated**: 2025-10-25
