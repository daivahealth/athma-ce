# @zeal/contracts

Shared TypeScript types, DTOs, and Zod validation schemas used across Zeal backend services and frontend.

## Overview

This package provides shared contracts to ensure type safety and consistency across the platform:

- **Type Definitions**: Common interfaces and types
- **DTOs**: Data Transfer Objects for API communication
- **Zod Schemas**: Runtime validation schemas

## Installation

This package is used internally within the Zeal monorepo. Reference it in your `package.json`:

```json
{
  "dependencies": {
    "@zeal/contracts": "file:../../contracts"
  }
}
```

## Exports

```typescript
// Core types
export * from './types/common';
export * from './types/auth';
export * from './types/pms';
export * from './types/patient';
```

## Type Categories

### Common Types (`types/common.ts`)

Base types used throughout the application:

```typescript
// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// API Error
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Audit fields
interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Status types
type EntityStatus = 'active' | 'inactive' | 'deleted' | 'archived';
```

### Auth Types (`types/auth.ts`)

Authentication and authorization types:

```typescript
// JWT Payload
interface JwtPayload {
  sub: string;           // User ID
  email: string;
  tenantId: string;
  facilityId?: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

// Session
interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: SessionUser;
}

interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  facilityId?: string;
  roles: Role[];
}

// Login/Logout
interface LoginRequest {
  email: string;
  password: string;
  tenantSlug?: string;
}

interface LoginResponse {
  session: Session;
  requiresMfa?: boolean;
  mfaToken?: string;
}

// MFA
interface MfaVerifyRequest {
  mfaToken: string;
  code: string;
}
```

### PMS Types (`types/pms.ts`)

Practice Management System types:

```typescript
// Facility
interface Facility {
  id: string;
  tenantId: string;
  name: string;
  type: FacilityType;
  address?: Address;
  phone?: string;
  email?: string;
  status: EntityStatus;
}

type FacilityType = 'hospital' | 'clinic' | 'laboratory' | 'pharmacy';

// Staff
interface StaffMember {
  id: string;
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  specialties: Specialty[];
  licenseNumber?: string;
  status: EntityStatus;
}

// Appointment
interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  facilityId: string;
  spaceId?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status: AppointmentStatus;
  type: AppointmentType;
  reason?: string;
}

type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

// Encounter
interface Encounter {
  id: string;
  patientId: string;
  facilityId: string;
  type: EncounterType;
  status: EncounterStatus;
  startTime: Date;
  endTime?: Date;
  chiefComplaint?: string;
  assignedProviderId?: string;
}

type EncounterType = 'outpatient' | 'inpatient' | 'emergency' | 'telemedicine';
type EncounterStatus = 'scheduled' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
```

### Patient Types (`types/patient.ts`)

Patient-related DTOs for display:

```typescript
// Patient display DTO
interface PatientDisplayDto {
  id: string;
  mrn: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality?: string;
  emiratesId?: string;
  phone?: string;
  email?: string;
}

type Gender = 'male' | 'female' | 'other' | 'unknown';

// Patient with translations (for multi-language support)
interface PatientWithTranslations extends PatientDisplayDto {
  firstNameAr?: string;
  middleNameAr?: string;
  lastNameAr?: string;
}
```

## Zod Schemas (`schemas/`)

Runtime validation schemas:

### Common Schemas (`schemas/common.ts`)

```typescript
import { z } from 'zod';

// UUID validation
export const uuidSchema = z.string().uuid();

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Date range
export const dateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
}).refine(
  (data) => data.from <= data.to,
  { message: 'From date must be before or equal to To date' }
);

// Phone number (UAE format)
export const phoneSchema = z.string().regex(
  /^\+971[0-9]{9}$/,
  'Phone must be in UAE format (+971XXXXXXXXX)'
);

// Emirates ID
export const emiratesIdSchema = z.string().regex(
  /^784-[0-9]{4}-[0-9]{7}-[0-9]$/,
  'Invalid Emirates ID format'
);
```

## Usage

### In NestJS Controllers

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from '@zeal/contracts';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }
}
```

### In Services

```typescript
import { Injectable } from '@nestjs/common';
import { PatientDisplayDto, Session } from '@zeal/contracts';

@Injectable()
export class PatientService {
  async getPatientDisplay(id: string): Promise<PatientDisplayDto> {
    // Implementation
  }
}
```

### In Frontend

```typescript
import { LoginRequest, Session } from '@zeal/contracts';

async function login(credentials: LoginRequest): Promise<Session> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response.json();
}
```

### Zod Validation

```typescript
import { paginationSchema, emiratesIdSchema } from '@zeal/contracts/schemas/common';

// Validate pagination params
const pagination = paginationSchema.parse(req.query);

// Validate Emirates ID
const result = emiratesIdSchema.safeParse(input);
if (!result.success) {
  throw new BadRequestException(result.error.message);
}
```

## Type Safety Benefits

1. **Single Source of Truth**: Types are defined once and shared
2. **Compile-Time Safety**: TypeScript catches type mismatches
3. **Runtime Validation**: Zod schemas validate at runtime
4. **API Contract**: Clear contract between frontend and backend
5. **Documentation**: Types serve as documentation

## Adding New Types

1. Create or update the appropriate file in `src/types/`
2. Export from `src/index.ts`
3. Run type-check: `npm run type-check --workspace=@zeal/contracts`
4. Update consuming packages

## Related Packages

- `@zeal/database-foundation` - Uses types for database entities
- `@zeal/database-clinical` - Uses types for database entities
- All backend services - Import types for DTOs
- `@zeal/frontend` - Uses types for API communication
