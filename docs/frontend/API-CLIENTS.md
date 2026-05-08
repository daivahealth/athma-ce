# Frontend API Clients

This document describes the API client architecture used in the athma-ce frontend.

## Overview

The frontend uses Axios-based API clients to communicate with backend services. Each domain has its own configured client that handles authentication, tenant context, and error handling.

## Client Architecture

```
lib/api/
├── client.ts              # Core client setup and auth functions
├── enhanced-client.ts     # Enhanced client wrapper
└── base-service.ts        # Base service class for CRUD operations
```

## Core Client (`lib/api/client.ts`)

### Exported Clients

```typescript
// Pre-configured Axios instances
export const authClient: AxiosInstance;       // For authentication endpoints
export const foundationClient: AxiosInstance; // Foundation service (3010)
export const clinicalClient: AxiosInstance;   // Clinical service (3011)
export const rcmClient: AxiosInstance;        // RCM service (3012)
export const prmClient: AxiosInstance;        // PRM service (3013)
```

### Authentication Functions

```typescript
/**
 * Authenticate user and establish session
 */
export async function login(email: string, password: string): Promise<Session>;

/**
 * Clear session and logout user
 */
export async function logout(): Promise<void>;

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string>;

/**
 * Switch active facility context
 */
export async function switchFacility(facilityId: string): Promise<Session>;

/**
 * Get current session from storage
 */
export function getSession(): Session | null;

/**
 * Store session in localStorage
 */
export function setSession(session: Session): void;

/**
 * Create a tenant-scoped client instance
 */
export function tenantScopedClient(
  baseClient: AxiosInstance,
  tenantId: string
): AxiosInstance;
```

### Request Interceptors

All clients automatically include:

| Header | Description | Source |
|--------|-------------|--------|
| `Authorization` | Bearer token | Session storage |
| `x-tenant-id` | Current tenant ID | Session user |
| `x-facility-id` | Current facility ID | Session user |
| `Content-Type` | `application/json` | Default |

### Response Interceptors

- **401 Unauthorized**: Attempts token refresh, retries request
- **403 Forbidden**: Redirects to access denied
- **Network errors**: Throws with user-friendly message

### Protected Route Guarding

- Dashboard and clinical layouts call `useAuthGuard(locale)` before mounting protected route content.
- When the current session is missing or expired, those layouts return `null` and redirect to `/${locale}/login?redirect=...`.
- This prevents shared layout queries and page-level React Query hooks from firing unauthenticated requests during the client-side redirect window.

## Enhanced Client (`lib/api/enhanced-client.ts`)

Wrapper class providing typed HTTP methods:

```typescript
class ApiClient {
  constructor(private client: AxiosInstance) {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
```

### Usage

```typescript
import { clinicalClient } from '@/lib/api/client';
import { ApiClient } from '@/lib/api/enhanced-client';

const api = new ApiClient(clinicalClient);

// Typed response
const patient = await api.get<Patient>(`/patients/${id}`);
```

## Base Service (`lib/api/base-service.ts`)

Abstract base class for domain services:

```typescript
abstract class BaseService<T, CreateDto, UpdateDto> {
  constructor(
    protected client: AxiosInstance,
    protected basePath: string
  ) {}

  /**
   * Get all entities with optional filtering
   */
  async findAll(params?: QueryParams): Promise<PaginatedResponse<T>>;

  /**
   * Get single entity by ID
   */
  async findOne(id: string): Promise<T>;

  /**
   * Create new entity
   */
  async create(data: CreateDto): Promise<T>;

  /**
   * Update existing entity
   */
  async update(id: string, data: UpdateDto): Promise<T>;

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<void>;

  /**
   * Search entities with query
   */
  async search(query: string, params?: QueryParams): Promise<PaginatedResponse<T>>;

  /**
   * Count entities matching filter
   */
  async count(filter?: Record<string, unknown>): Promise<number>;
}
```

### Extending Base Service

```typescript
// modules/clinical/services/patient-service.ts
import { BaseService } from '@/lib/api/base-service';
import { clinicalClient } from '@/lib/api/client';

class PatientService extends BaseService<Patient, CreatePatientDto, UpdatePatientDto> {
  constructor() {
    super(clinicalClient, '/patients');
  }

  // Add custom methods
  async getHistory(patientId: string): Promise<PatientHistory[]> {
    const response = await this.client.get(`/patients/${patientId}/history`);
    return response.data;
  }
}

export const patientService = new PatientService();
```

## Domain Services

### Clinical Services (`modules/clinical/services/`)

| Service | Purpose | Endpoints |
|---------|---------|-----------|
| `patient-service.ts` | Patient CRUD and history | `/patients` |
| `encounter-service.ts` | Encounter management | `/encounters` |
| `scheduling-service.ts` | Appointments and availability | `/scheduling/*` |
| `charting-service.ts` | Notes, diagnoses, orders | `/notes`, `/diagnoses`, `/orders` |
| `inpatient-service.ts` | Admissions, discharges | `/inpatient/*` |
| `triage-service.ts` | Triage assessments | `/encounters/*/triage` |
| `catalog-service.ts` | Medical catalogs | `/catalogs` |
| `valueset-service.ts` | Value sets | `/valuesets` |

### Foundation Services (`modules/foundation/services/`)

| Service | Purpose | Endpoints |
|---------|---------|-----------|
| `user-service.ts` | User management | `/users` |
| `facility-service.ts` | Facility hierarchy | `/facilities` |
| `staff-service.ts` | Staff profiles | `/staff` |
| `tenant-service.ts` | Tenant management | `/tenants` |

### RCM Services (`modules/rcm/services/`)

| Service | Purpose | Endpoints |
|---------|---------|-----------|
| `invoice-service.ts` | Invoice management | `/invoices` |
| `receipt-service.ts` | Payment receipts | `/receipts` |
| `payer-service.ts` | Insurance payers | `/payers` |
| `policy-service.ts` | Insurance policies | `/policies` |
| `billing-item-service.ts` | Billing items | `/billing-items` |
| `medical-coding-service.ts` | Coding sessions | `/medical-coding` |

### PRM Services (`modules/prm/services/`)

| Service | Purpose | Endpoints |
|---------|---------|-----------|
| `tasks-service.ts` | Patient tasks | `/v1/tasks` |
| `messages-service.ts` | Message history | `/v1/messages` |
| `rules-service.ts` | Engagement rules | `/v1/rules` |
| `events-service.ts` | Event tracking | `/v1/events` |

## React Query Integration

Services are typically used with React Query hooks:

```typescript
// modules/clinical/hooks/use-patients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patient-service';

export function usePatients(params?: QueryParams) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientService.findAll(params),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientService.findOne(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
```

## Error Handling

### ApiException

```typescript
class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}
```

### Handling in Components

```typescript
import { usePatients } from '@/modules/clinical/hooks/use-patients';

function PatientList() {
  const { data, isLoading, error } = usePatients();

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;

  return <PatientTable patients={data.data} />;
}
```

## Environment Variables

```bash
# API Base URLs
NEXT_PUBLIC_FOUNDATION_BASE_URL=http://localhost:3010
NEXT_PUBLIC_CLINICAL_BASE_URL=http://localhost:3011
NEXT_PUBLIC_RCM_BASE_URL=http://localhost:3012
NEXT_PUBLIC_PRM_BASE_URL=http://localhost:3013
```

## Best Practices

1. **Use domain services** rather than raw clients
2. **Wrap with React Query hooks** for caching and state management
3. **Handle errors** at the component level using error boundaries
4. **Type all responses** using types from `@zeal/contracts`
5. **Invalidate queries** after mutations to refresh data

## Related Documentation

- [Frontend README](../../frontend/README.md)
- [API Documentation](../api/README.md)
- [Authentication Context](../api/API-AUTHENTICATION-CONTEXT.md)
