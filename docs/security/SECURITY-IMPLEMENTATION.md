# Security Implementation Guide

This document provides a comprehensive overview of the security implementation in the athma-ce Healthcare Platform, including authentication, authorization (RBAC), and best practices for developers and implementors.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication (JWT)](#authentication-jwt)
3. [Authorization (RBAC)](#authorization-rbac)
4. [Permission System](#permission-system)
5. [Guards and Decorators](#guards-and-decorators)
6. [Developer Guide](#developer-guide)
7. [Implementor Guide](#implementor-guide)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### High-Level Security Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌────────────┐
│   Client    │────▶│  API Gateway │────▶│  Auth Middleware │────▶│ Controller │
│  (Frontend) │     │              │     │  (JWT + RBAC)    │     │            │
└─────────────┘     └──────────────┘     └─────────────────┘     └────────────┘
       │                                          │
       │                                          ▼
       │                                 ┌─────────────────┐
       │                                 │  Permission     │
       │                                 │  Verification   │
       │                                 └─────────────────┘
       │                                          │
       ▼                                          ▼
┌─────────────┐                          ┌─────────────────┐
│  JWT Token  │                          │   Foundation    │
│  (Headers)  │                          │   Database      │
└─────────────┘                          │ (Roles/Perms)   │
                                         └─────────────────┘
```

### Security Layers

| Layer | Component | Purpose |
|-------|-----------|---------|
| 1. Transport | HTTPS/TLS | Encrypt data in transit |
| 2. Authentication | JWT Guards | Verify user identity |
| 3. Authorization | Permission Guards | Verify user permissions |
| 4. Tenant Isolation | Tenant Middleware | Ensure data isolation |
| 5. Input Validation | DTOs + Validators | Prevent injection attacks |

### Cross-Service Authentication

The security system is designed to work across all microservices:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Shared Security Package                      │
│                      @zeal/shared-utils                          │
├─────────────────────────────────────────────────────────────────┤
│  JwtAuthGuard  │  PermissionsGuard  │  RolesGuard  │ Decorators │
└────────┬───────┴─────────┬──────────┴──────┬───────┴────────────┘
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │Foundation│      │ Clinical  │     │    RCM    │
    │ Service  │      │  Service  │     │  Service  │
    └──────────┘      └───────────┘     └───────────┘
```

---

## Authentication (JWT)

### JWT Token Structure

The JWT token contains the following claims:

```typescript
interface JwtPayload {
  sub: string;          // User ID (UUID)
  email: string;        // User email
  tenantId: string;     // Tenant ID (UUID)
  facilityId?: string;  // Current facility ID (UUID)
  roles: string[];      // Array of role names
  permissions: string[]; // Array of permission codes
  staffId?: string;     // Staff ID if user is staff member
  iat: number;          // Issued at timestamp
  exp: number;          // Expiration timestamp
}
```

### Token Flow

```
1. User Login
   └─▶ POST /auth/login { email, password }
       └─▶ Validate credentials
           └─▶ Generate JWT with roles/permissions
               └─▶ Return { accessToken, refreshToken }

2. API Request
   └─▶ GET /api/v1/patients
       └─▶ Header: Authorization: Bearer <token>
           └─▶ JwtAuthGuard validates token
               └─▶ Attach user to request
                   └─▶ PermissionsGuard checks permissions
                       └─▶ Execute controller method
```

### Token Validation Process

```typescript
// JwtAuthGuard validation steps:
1. Check for @Public() decorator → Skip auth if present
2. Extract token from Authorization header
3. Verify token signature using JWT_SECRET
4. Check token expiration
5. Attach decoded payload to request.user
6. Allow request to proceed
```

---

## Authorization (RBAC)

### RBAC Model

The Role-Based Access Control system uses a hierarchical permission model:

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                 │
└──────────────────────────┬───────────────────────────────────┘
                           │ has many
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     USER_ROLES                                │
│  (user_id, role_id, tenant_id, facility_id?, assigned_at)    │
└──────────────────────────┬───────────────────────────────────┘
                           │ belongs to
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                         ROLES                                 │
│  (id, name, description, tenant_id, is_system, is_active)    │
└──────────────────────────┬───────────────────────────────────┘
                           │ has many
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    ROLE_PERMISSIONS                           │
│              (role_id, permission_id)                         │
└──────────────────────────┬───────────────────────────────────┘
                           │ belongs to
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      PERMISSIONS                              │
│  (id, code, name, description, resource, action, is_active)  │
└──────────────────────────────────────────────────────────────┘
```

### Role Hierarchy

| Role | Description | Typical Permissions |
|------|-------------|---------------------|
| `super_admin` | System administrator | All permissions |
| `tenant_admin` | Tenant administrator | All tenant-scoped permissions |
| `physician` | Medical doctor | Clinical read/write, prescriptions |
| `nurse` | Nursing staff | Clinical read, vitals, triage |
| `receptionist` | Front desk | Patient read, appointments |
| `billing_staff` | Billing department | RCM permissions |

### Permission Naming Convention

Permissions follow the format: `resource.action`

```
patient.read      - Read patient data
patient.create    - Create new patients
patient.update    - Update patient data
patient.delete    - Delete patients

appointment.read
appointment.create
appointment.cancel
appointment.reschedule

encounter.read
encounter.create
encounter.close
```

---

## Permission System

### Permission Categories

#### Clinical Permissions
```typescript
// Patient Management
PATIENT_READ = 'patient.read'
PATIENT_CREATE = 'patient.create'
PATIENT_UPDATE = 'patient.update'
PATIENT_DELETE = 'patient.delete'
PATIENT_MERGE = 'patient.merge'
PATIENT_EXPORT = 'patient.export'

// Encounters
ENCOUNTER_READ = 'encounter.read'
ENCOUNTER_CREATE = 'encounter.create'
ENCOUNTER_UPDATE = 'encounter.update'
ENCOUNTER_CLOSE = 'encounter.close'
ENCOUNTER_REOPEN = 'encounter.reopen'

// Clinical Notes
CLINICAL_NOTE_READ = 'clinical_note.read'
CLINICAL_NOTE_CREATE = 'clinical_note.create'
CLINICAL_NOTE_UPDATE = 'clinical_note.update'
CLINICAL_NOTE_SIGN = 'clinical_note.sign'
CLINICAL_NOTE_COSIGN = 'clinical_note.cosign'

// Diagnosis
DIAGNOSIS_READ = 'diagnosis.read'
DIAGNOSIS_CREATE = 'diagnosis.create'
DIAGNOSIS_UPDATE = 'diagnosis.update'
DIAGNOSIS_DELETE = 'diagnosis.delete'

// Prescriptions
PRESCRIPTION_READ = 'prescription.read'
PRESCRIPTION_CREATE = 'prescription.create'
PRESCRIPTION_UPDATE = 'prescription.update'
PRESCRIPTION_DISPENSE = 'prescription.dispense'

// Clinical Orders
CLINICAL_ORDER_READ = 'clinical_order.read'
CLINICAL_ORDER_CREATE = 'clinical_order.create'
CLINICAL_ORDER_UPDATE = 'clinical_order.update'
CLINICAL_ORDER_CANCEL = 'clinical_order.cancel'

// Vitals
VITALS_READ = 'vitals.read'
VITALS_CREATE = 'vitals.create'
VITALS_UPDATE = 'vitals.update'

// Triage
TRIAGE_READ = 'triage.read'
TRIAGE_CREATE = 'triage.create'
TRIAGE_UPDATE = 'triage.update'
```

#### Scheduling Permissions
```typescript
APPOINTMENT_READ = 'appointment.read'
APPOINTMENT_CREATE = 'appointment.create'
APPOINTMENT_UPDATE = 'appointment.update'
APPOINTMENT_CANCEL = 'appointment.cancel'
APPOINTMENT_RESCHEDULE = 'appointment.reschedule'
APPOINTMENT_CHECKIN = 'appointment.checkin'

SCHEDULE_READ = 'schedule.read'
SCHEDULE_CREATE = 'schedule.create'
SCHEDULE_UPDATE = 'schedule.update'
SCHEDULE_DELETE = 'schedule.delete'

CALENDAR_READ = 'calendar.read'
AVAILABILITY_READ = 'availability.read'
```

#### Inpatient Permissions
```typescript
ADMISSION_READ = 'admission.read'
ADMISSION_CREATE = 'admission.create'
ADMISSION_UPDATE = 'admission.update'

DISCHARGE_CREATE = 'discharge.create'
DISCHARGE_UPDATE = 'discharge.update'

WARD_READ = 'ward.read'
WARD_MANAGE = 'ward.manage'
BED_MANAGE = 'bed.manage'
```

#### Administrative Permissions
```typescript
// User Management
USER_READ = 'user.read'
USER_CREATE = 'user.create'
USER_UPDATE = 'user.update'
USER_DELETE = 'user.delete'
USER_ACTIVATE = 'user.activate'
USER_DEACTIVATE = 'user.deactivate'
USER_RESET_PASSWORD = 'user.reset_password'

// Staff Management
STAFF_READ = 'staff.read'
STAFF_CREATE = 'staff.create'
STAFF_UPDATE = 'staff.update'
STAFF_DELETE = 'staff.delete'

// RBAC Management
RBAC_READ = 'rbac.read'
RBAC_MANAGE = 'rbac.manage'
ROLE_CREATE = 'role.create'
ROLE_UPDATE = 'role.update'
ROLE_DELETE = 'role.delete'
ROLE_ASSIGN = 'role.assign'
PERMISSION_READ = 'permission.read'

// Facility Management
FACILITY_READ = 'facility.read'
FACILITY_CREATE = 'facility.create'
FACILITY_UPDATE = 'facility.update'
```

#### Billing Permissions (RCM)
```typescript
INVOICE_READ = 'invoice.read'
INVOICE_CREATE = 'invoice.create'
INVOICE_UPDATE = 'invoice.update'
INVOICE_VOID = 'invoice.void'

PAYMENT_READ = 'payment.read'
PAYMENT_CREATE = 'payment.create'
PAYMENT_REFUND = 'payment.refund'

CLAIM_READ = 'claim.read'
CLAIM_CREATE = 'claim.create'
CLAIM_SUBMIT = 'claim.submit'
CLAIM_UPDATE = 'claim.update'
```

---

## Guards and Decorators

### Available Guards

#### JwtAuthGuard
Validates JWT token and attaches user to request.

```typescript
import { JwtAuthGuard } from '@zeal/shared-utils';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  // All routes require authentication
}
```

#### PermissionsGuard
Checks if user has required permissions.

```typescript
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';

@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {

  @Get()
  @Permissions(PATIENT_READ)
  findAll() {
    // Requires patient.read permission
  }
}
```

#### RolesGuard
Checks if user has any of the required roles.

```typescript
import { JwtAuthGuard, RolesGuard, Roles } from '@zeal/shared-utils';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

  @Get('dashboard')
  @Roles('super_admin', 'tenant_admin')
  getDashboard() {
    // Requires super_admin OR tenant_admin role
  }
}
```

### Available Decorators

#### @Permissions(...permissions)
Requires user to have ALL specified permissions (AND logic).

```typescript
@Permissions(PATIENT_READ)                    // Single permission
@Permissions(PATIENT_READ, PATIENT_UPDATE)    // Multiple (all required)
```

#### @Roles(...roles)
Requires user to have ANY of the specified roles (OR logic).

```typescript
@Roles('physician')                           // Single role
@Roles('physician', 'nurse')                  // Multiple (any required)
```

#### @Public()
Bypasses authentication for the decorated route.

```typescript
@Public()
@Get('health')
healthCheck() {
  // No authentication required
}
```

---

## Developer Guide

### Adding Security to a New Controller

#### Step 1: Import Required Dependencies

```typescript
import {
  Controller,
  Get,
  Post,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { PATIENT_READ, PATIENT_CREATE } from '@zeal/contracts';
```

#### Step 2: Apply Guards at Controller Level

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {
  // All routes in this controller require authentication
}
```

#### Step 3: Add Permission Decorators to Methods

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {

  /**
   * GET /patients - List all patients
   */
  @Get()
  @Permissions(PATIENT_READ)
  async findAll() {
    return this.patientService.findAll();
  }

  /**
   * POST /patients - Create new patient
   */
  @Post()
  @Permissions(PATIENT_CREATE)
  async create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }

  /**
   * PUT /patients/:id - Update patient
   */
  @Put(':id')
  @Permissions(PATIENT_UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }
}
```

### Complete Controller Example

```typescript
/**
 * Example Controller with Full Security Implementation
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions, Public } from '@zeal/shared-utils';
import {
  PATIENT_READ,
  PATIENT_CREATE,
  PATIENT_UPDATE,
  PATIENT_DELETE,
} from '@zeal/contracts';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto, SearchPatientDto } from './dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * GET /patients - Search patients
   * Requires: patient.read permission
   */
  @Get()
  @Permissions(PATIENT_READ)
  async search(
    @Query() query: SearchPatientDto,
    @TenantId() tenantId: string
  ) {
    return this.patientService.search(tenantId, query);
  }

  /**
   * GET /patients/:id - Get patient by ID
   * Requires: patient.read permission
   */
  @Get(':id')
  @Permissions(PATIENT_READ)
  async findOne(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.findById(id, tenantId);
  }

  /**
   * POST /patients - Create new patient
   * Requires: patient.create permission
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PATIENT_CREATE)
  async create(
    @Body() dto: CreatePatientDto,
    @Context() context: any
  ) {
    return this.patientService.create(dto, context);
  }

  /**
   * PUT /patients/:id - Update patient
   * Requires: patient.update permission
   */
  @Put(':id')
  @Permissions(PATIENT_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Context() context: any
  ) {
    return this.patientService.update(id, dto, context);
  }

  /**
   * DELETE /patients/:id - Delete patient
   * Requires: patient.delete permission
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PATIENT_DELETE)
  async delete(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.delete(id, tenantId);
  }
}
```

### Accessing User Information in Controller

```typescript
import { Req } from '@nestjs/common';

@Get('profile')
@Permissions(USER_READ)
async getProfile(@Req() req: any) {
  // Access authenticated user from request
  const user = req.user;

  console.log(user.sub);         // User ID
  console.log(user.email);       // User email
  console.log(user.tenantId);    // Tenant ID
  console.log(user.roles);       // ['physician', 'tenant_admin']
  console.log(user.permissions); // ['patient.read', 'patient.create', ...]

  return this.userService.getProfile(user.sub);
}
```

### Creating Public Endpoints

```typescript
import { Public } from '@zeal/shared-utils';

@Controller('auth')
@UseGuards(JwtAuthGuard)  // Applied at controller level
export class AuthController {

  @Public()  // Bypasses JwtAuthGuard
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // This route still requires authentication
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}
```

### Adding New Permissions

#### Step 1: Define Permission Constant

Add to `backend/contracts/src/constants/permissions.ts`:

```typescript
// ============================================
// YOUR_RESOURCE PERMISSIONS
// ============================================
export const YOUR_RESOURCE_READ = 'your_resource.read';
export const YOUR_RESOURCE_CREATE = 'your_resource.create';
export const YOUR_RESOURCE_UPDATE = 'your_resource.update';
export const YOUR_RESOURCE_DELETE = 'your_resource.delete';
```

#### Step 2: Add to ALL_PERMISSIONS Array

```typescript
export const ALL_PERMISSIONS = [
  // ... existing permissions ...

  // Your Resource
  { code: YOUR_RESOURCE_READ, name: 'Read Your Resource', resource: 'your_resource', action: 'read' },
  { code: YOUR_RESOURCE_CREATE, name: 'Create Your Resource', resource: 'your_resource', action: 'create' },
  { code: YOUR_RESOURCE_UPDATE, name: 'Update Your Resource', resource: 'your_resource', action: 'update' },
  { code: YOUR_RESOURCE_DELETE, name: 'Delete Your Resource', resource: 'your_resource', action: 'delete' },
];
```

#### Step 3: Create Database Migration/Seed

Add to `seed/foundation/04-permissions.sql`:

```sql
INSERT INTO permissions (id, code, name, description, resource, action, is_active)
VALUES
  (gen_random_uuid(), 'your_resource.read', 'Read Your Resource', 'View your resource data', 'your_resource', 'read', true),
  (gen_random_uuid(), 'your_resource.create', 'Create Your Resource', 'Create new your resource', 'your_resource', 'create', true),
  (gen_random_uuid(), 'your_resource.update', 'Update Your Resource', 'Modify your resource', 'your_resource', 'update', true),
  (gen_random_uuid(), 'your_resource.delete', 'Delete Your Resource', 'Remove your resource', 'your_resource', 'delete', true)
ON CONFLICT (code) DO NOTHING;
```

#### Step 4: Assign to Roles

Add to `seed/foundation/05-role-permissions.sql`:

```sql
-- Assign to appropriate roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'tenant_admin'
  AND p.code IN ('your_resource.read', 'your_resource.create', 'your_resource.update', 'your_resource.delete')
ON CONFLICT DO NOTHING;
```

---

## Implementor Guide

### Initial Setup

#### 1. Environment Variables

Ensure the following environment variables are set:

```bash
# JWT Configuration
JWT_SECRET=your-secure-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Database URLs (for Foundation service)
FOUNDATION_DATABASE_URL=postgresql://user:pass@host:5432/zeal_foundation
```

#### 2. Database Schema

The RBAC tables are defined in the Foundation database:

```sql
-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  tenant_id UUID REFERENCES tenants(id),
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, tenant_id)
);

-- Role-Permission junction
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User-Role junction
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  facility_id UUID REFERENCES facilities(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(user_id, role_id, tenant_id, facility_id)
);
```

#### 3. Run Database Seeds

```bash
cd seed

# Seed permissions
./run-seeds.sh foundation

# Or run individual seed files
psql $FOUNDATION_DATABASE_URL -f foundation/04-permissions.sql
psql $FOUNDATION_DATABASE_URL -f foundation/05-role-permissions.sql
```

### Module Configuration

#### SharedAuthModule

The `SharedAuthModule` must be imported in each service's app module:

```typescript
// backend/services/clinical/src/app.module.ts
import { Module } from '@nestjs/common';
import { SharedAuthModule } from '@zeal/shared-utils';

@Module({
  imports: [
    SharedAuthModule,  // Provides JwtAuthGuard, PermissionsGuard, RolesGuard
    // ... other modules
  ],
})
export class AppModule {}
```

### Default Role Configuration

#### System Roles

| Role | Scope | Description |
|------|-------|-------------|
| `super_admin` | Global | Full system access |
| `tenant_admin` | Tenant | Full tenant access |
| `physician` | Facility | Clinical staff with prescribing rights |
| `nurse` | Facility | Clinical staff |
| `receptionist` | Facility | Front desk operations |
| `billing_staff` | Facility | RCM operations |

#### Recommended Permission Assignments

**Physician Role:**
```sql
-- Clinical permissions
patient.read, patient.create, patient.update
encounter.read, encounter.create, encounter.update, encounter.close
clinical_note.read, clinical_note.create, clinical_note.update, clinical_note.sign
diagnosis.read, diagnosis.create, diagnosis.update
prescription.read, prescription.create, prescription.update
clinical_order.read, clinical_order.create
vitals.read, vitals.create

-- Scheduling
appointment.read, appointment.create, appointment.update
calendar.read
```

**Nurse Role:**
```sql
-- Clinical permissions (limited)
patient.read
encounter.read, encounter.create, encounter.update
clinical_note.read, clinical_note.create
vitals.read, vitals.create, vitals.update
triage.read, triage.create, triage.update

-- Scheduling
appointment.read, appointment.checkin
```

**Receptionist Role:**
```sql
-- Patient (limited)
patient.read, patient.create, patient.update

-- Scheduling
appointment.read, appointment.create, appointment.update, appointment.cancel
schedule.read
calendar.read
```

### Verifying Security Implementation

#### Test Authentication

```bash
# Without token (should return 401)
curl -X GET http://localhost:3011/api/v1/patients

# With valid token (should return data)
curl -X GET http://localhost:3011/api/v1/patients \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "x-tenant-id: <tenant-uuid>"
```

#### Test Authorization

```bash
# User without patient.read permission (should return 403)
curl -X GET http://localhost:3011/api/v1/patients \
  -H "Authorization: Bearer <token-without-permission>"

# User with patient.read permission (should return data)
curl -X GET http://localhost:3011/api/v1/patients \
  -H "Authorization: Bearer <token-with-permission>"
```

---

## Security Best Practices

### 1. Always Use Guards at Controller Level

```typescript
// GOOD: Guards at controller level
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {}

// BAD: No guards
@Controller('patients')
export class PatientController {}
```

### 2. Apply Specific Permissions per Endpoint

```typescript
// GOOD: Specific permission per action
@Get()
@Permissions(PATIENT_READ)
findAll() {}

@Post()
@Permissions(PATIENT_CREATE)
create() {}

@Delete(':id')
@Permissions(PATIENT_DELETE)
delete() {}

// BAD: Same permission for all actions
@Get()
@Permissions(PATIENT_READ)
findAll() {}

@Delete(':id')
@Permissions(PATIENT_READ)  // Should be PATIENT_DELETE
delete() {}
```

### 3. Use Principle of Least Privilege

```typescript
// GOOD: Only required permission
@Post(':id/dispense')
@Permissions(PRESCRIPTION_DISPENSE)
dispenseMedication() {}

// BAD: Overly broad permissions
@Post(':id/dispense')
@Permissions(PRESCRIPTION_READ, PRESCRIPTION_CREATE, PRESCRIPTION_UPDATE, PRESCRIPTION_DISPENSE)
dispenseMedication() {}
```

### 4. Never Skip Authentication Without @Public()

```typescript
// GOOD: Explicitly mark public endpoints
@Public()
@Get('health')
healthCheck() {}

// BAD: Relying on missing guards
@Get('health')  // No @Public(), but no guards applied = security risk
healthCheck() {}
```

### 5. Validate Tenant Context

```typescript
// GOOD: Always validate tenant context
async findAll(@TenantId() tenantId: string) {
  if (!tenantId) {
    throw new BadRequestException('Tenant ID required');
  }
  return this.service.findAll(tenantId);
}

// BAD: No tenant validation
async findAll() {
  return this.service.findAll();  // Cross-tenant data leak risk
}
```

### 6. Audit Sensitive Operations

```typescript
@Delete(':id')
@Permissions(PATIENT_DELETE)
async delete(
  @Param('id') id: string,
  @Context() context: any
) {
  // Log the deletion
  await this.auditService.log({
    action: 'PATIENT_DELETE',
    resourceId: id,
    userId: context.userId,
    tenantId: context.tenantId,
    timestamp: new Date(),
  });

  return this.patientService.delete(id, context.tenantId);
}
```

### 7. Handle Authorization Errors Gracefully

The guards automatically throw appropriate HTTP exceptions:

| Scenario | Exception | HTTP Status |
|----------|-----------|-------------|
| Missing/Invalid token | UnauthorizedException | 401 |
| Expired token | UnauthorizedException | 401 |
| Missing permissions | ForbiddenException | 403 |
| Missing roles | ForbiddenException | 403 |

---

## Troubleshooting

### Common Issues

#### 1. "Unauthorized" Error (401)

**Cause:** Missing or invalid JWT token

**Solutions:**
- Verify token is included in Authorization header
- Check token format: `Bearer <token>`
- Verify token hasn't expired
- Ensure JWT_SECRET matches between services

```bash
# Debug: Decode token to inspect claims
echo "<your-token>" | cut -d'.' -f2 | base64 -d | jq
```

#### 2. "Forbidden" Error (403)

**Cause:** User lacks required permissions

**Solutions:**
- Check user's roles in database
- Verify role has required permissions assigned
- Ensure permissions are correctly seeded

```sql
-- Check user's permissions
SELECT DISTINCT p.code
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.id = '<user-uuid>';
```

#### 3. Guards Not Applying

**Cause:** Module not properly configured

**Solutions:**
- Ensure `SharedAuthModule` is imported in app.module.ts
- Check controller has `@UseGuards()` decorator
- Verify guards are imported from `@zeal/shared-utils`

#### 4. Permissions Not Found in Token

**Cause:** Token generated without permissions

**Solutions:**
- Check login/token generation includes permissions
- Verify user has roles assigned
- Ensure roles have permissions assigned

```typescript
// Token generation should include permissions
const payload = {
  sub: user.id,
  email: user.email,
  tenantId: user.tenantId,
  roles: user.roles.map(r => r.name),
  permissions: await this.getPermissionsForRoles(user.roles),
};
```

### Debug Mode

Enable debug logging for security:

```typescript
// In guard implementation
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(`Authenticating request to ${request.url}`);
    this.logger.debug(`Token present: ${!!request.headers.authorization}`);

    // ... validation logic

    this.logger.debug(`User authenticated: ${user.email}`);
    this.logger.debug(`Roles: ${user.roles.join(', ')}`);
    this.logger.debug(`Permissions: ${user.permissions.length} total`);

    return true;
  }
}
```

---

## Appendix

### A. Permission Code Reference

See `backend/contracts/src/constants/permissions.ts` for the complete list of permission constants.

### B. Related Documentation

- [Multi-Tenancy Implementation](../multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
- [API Authentication Context](../multitenancy/API-AUTHENTICATION-CONTEXT.md)
- [Backend Feature Development Guide](../development/BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)

### C. Security Contacts

For security concerns or vulnerabilities, contact the security team through appropriate channels.

---

*Document Version: 1.0*
*Last Updated: January 2026*
